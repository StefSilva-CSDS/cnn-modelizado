/**
 * Genera un mapa de calor visual tipo Grad-CAM en el cliente (Canvas)
 * para modo demostración cuando el servidor local FastAPI no está activo.
 */
export function generateClientGradCam(
  imageElement: HTMLImageElement,
  movementId: string
): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve('');
      return;
    }

    const width = imageElement.naturalWidth || 600;
    const height = imageElement.naturalHeight || 450;
    canvas.width = width;
    canvas.height = height;

    // Dibujar imagen original
    ctx.drawImage(imageElement, 0, 0, width, height);

    // Crear capa de activación según el movimiento
    const overlayCanvas = document.createElement('canvas');
    overlayCanvas.width = width;
    overlayCanvas.height = height;
    const overlayCtx = overlayCanvas.getContext('2d');

    if (overlayCtx) {
      // Puntos focales de gradiente según la composición típica
      const gradPoints = getFocalPointsForMovement(movementId, width, height);
      
      gradPoints.forEach((point) => {
        const radGrad = overlayCtx.createRadialGradient(
          point.x, point.y, 10,
          point.x, point.y, point.radius
        );
        radGrad.addColorStop(0, 'rgba(255, 0, 0, 0.85)');     // Máxima activación (Rojo)
        radGrad.addColorStop(0.35, 'rgba(255, 165, 0, 0.7)'); // Naranja
        radGrad.addColorStop(0.65, 'rgba(255, 255, 0, 0.45)');// Amarillo
        radGrad.addColorStop(0.85, 'rgba(0, 180, 255, 0.2)'); // Azul celeste
        radGrad.addColorStop(1, 'rgba(0, 0, 128, 0)');        // Nula activación
        
        overlayCtx.fillStyle = radGrad;
        overlayCtx.fillRect(0, 0, width, height);
      });

      // Superponer con modo 'screen' o 'color'
      ctx.globalAlpha = 0.65;
      ctx.drawImage(overlayCanvas, 0, 0);
    }

    resolve(canvas.toDataURL('image/jpeg', 0.92));
  });
}

function getFocalPointsForMovement(movementId: string, w: number, h: number) {
  switch (movementId) {
    case 'Expressionism':
      // Foco en las pinceladas turbulentas del cielo y en las figuras centrales
      return [
        { x: w * 0.45, y: h * 0.28, radius: Math.min(w, h) * 0.45 },
        { x: w * 0.65, y: h * 0.62, radius: Math.min(w, h) * 0.38 },
        { x: w * 0.25, y: h * 0.55, radius: Math.min(w, h) * 0.32 }
      ];
    case 'Cubism':
      // Múltiples nodos geométricos fracturados
      return [
        { x: w * 0.5, y: h * 0.48, radius: Math.min(w, h) * 0.42 },
        { x: w * 0.35, y: h * 0.35, radius: Math.min(w, h) * 0.3 },
        { x: w * 0.7, y: h * 0.45, radius: Math.min(w, h) * 0.28 }
      ];
    case 'Impressionism':
      // Difuso en el juego de luces y reflejos de agua
      return [
        { x: w * 0.5, y: h * 0.4, radius: Math.min(w, h) * 0.55 },
        { x: w * 0.3, y: h * 0.7, radius: Math.min(w, h) * 0.4 }
      ];
    case 'Art_Nouveau_Modern':
    default:
      // Foco en siluetas curvadas y ornamentación
      return [
        { x: w * 0.5, y: h * 0.38, radius: Math.min(w, h) * 0.48 },
        { x: w * 0.5, y: h * 0.72, radius: Math.min(w, h) * 0.35 }
      ];
  }
}
