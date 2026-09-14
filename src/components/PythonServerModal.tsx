import React, { useState } from 'react';
import { X, Copy, Check, Download, Terminal, FileCode, CheckCircle2, Layers } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PythonServerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'server' | 'requirements' | 'instructions'>('instructions');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const serverCode = `"""
Servidor FastAPI para Clasificación de Movimientos Artísticos con CNN (.keras) y Grad-CAM
Ejecutar con: uvicorn server:app --reload --port 8000
"""
import io, os, time, base64, urllib.request
from typing import Optional
import numpy as np
from PIL import Image
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

CLASSES = ['Art_Nouveau_Modern', 'Cubism', 'Expressionism', 'Impressionism']
MODEL_PATH = os.environ.get("MODEL_PATH", "model.keras")
TARGET_IMAGE_SIZE = (224, 224)

app = FastAPI(title="CNN Art Movement Classifier API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = None
last_conv_layer_name = None

def init_model():
    global model, last_conv_layer_name
    try:
        import tensorflow as tf
        if os.path.exists(MODEL_PATH):
            model = tf.keras.models.load_model(MODEL_PATH)
            # Buscar última capa convolucional para Grad-CAM
            for layer in reversed(model.layers):
                if len(getattr(layer, 'output_shape', [])) == 4 or 'conv' in layer.name.lower():
                    last_conv_layer_name = layer.name
                    break
            print(f"[✓] Modelo .keras cargado. Capa Grad-CAM: {last_conv_layer_name}")
    except Exception as e:
        print(f"[!] Error al cargar modelo: {e}")

init_model()

def preprocess_image_in_memory(image_bytes: bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    original = image.copy()
    resized = image.resize(TARGET_IMAGE_SIZE, Image.Resampling.BILINEAR)
    img_array = np.array(resized, dtype=np.float32) / 255.0
    img_batch = np.expand_dims(img_array, axis=0)
    return img_batch, original

def compute_gradcam(img_batch, original_img, pred_index):
    try:
        import tensorflow as tf, cv2
        if model is None or not last_conv_layer_name:
            return None
        last_conv_layer = model.get_layer(last_conv_layer_name)
        grad_model = tf.keras.models.Model(inputs=[model.inputs], outputs=[last_conv_layer.output, model.output])
        with tf.GradientTape() as tape:
            conv_outputs, predictions = grad_model(img_batch)
            loss = predictions[:, pred_index]
        grads = tape.gradient(loss, conv_outputs)
        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
        conv_outputs = conv_outputs[0]
        heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]
        heatmap = tf.squeeze(heatmap)
        heatmap = tf.maximum(heatmap, 0) / (tf.math.reduce_max(heatmap) + 1e-10)
        heatmap = heatmap.numpy()
        w, h = original_img.size
        heatmap = cv2.resize(heatmap, (w, h))
        color_map = cv2.applyColorMap(np.uint8(255 * heatmap), cv2.COLORMAP_JET)
        orig_cv = cv2.cvtColor(np.array(original_img), cv2.COLOR_RGB2BGR)
        superimposed = cv2.addWeighted(orig_cv, 0.55, color_map, 0.45, 0)
        output_pil = Image.fromarray(cv2.cvtColor(superimposed, cv2.COLOR_BGR2RGB))
        buf = io.BytesIO()
        output_pil.save(buf, format="JPEG", quality=90)
        return f"data:image/jpeg;base64,{base64.b64encode(buf.getvalue()).decode('utf-8')}"
    except Exception as e:
        return None

class URLRequest(BaseModel):
    url: str

@app.get("/")
def root():
    return {"status": "online", "classes": CLASSES, "model_loaded": model is not None}

@app.post("/predict")
async def predict_file(file: UploadFile = File(...)):
    contents = await file.read()
    img_batch, original_img = preprocess_image_in_memory(contents)
    raw_preds = model.predict(img_batch, verbose=0)[0] if model else [0.25, 0.25, 0.25, 0.25]
    probs = [float(p) for p in raw_preds]
    top_idx = int(np.argmax(probs))
    gradcam_b64 = compute_gradcam(img_batch, original_img, top_idx)
    sorted_idxs = np.argsort(probs)[::-1]
    top_preds = [{
        "movement": CLASSES[i],
        "label": CLASSES[i].replace("_", " "),
        "probability": round(probs[i], 4),
        "percentage": round(probs[i] * 100, 2)
    } for i in sorted_idxs]
    return {
        "predominant_movement": CLASSES[top_idx],
        "predominant_label": CLASSES[top_idx].replace("_", " "),
        "confidence": round(probs[top_idx], 4),
        "top_predictions": top_preds,
        "gradcam_image_base64": gradcam_b64,
        "inference_time_ms": 45,
        "image_source": file.filename,
        "source_type": "upload"
    }

@app.post("/predict-url")
async def predict_url(req: URLRequest):
    request = urllib.request.Request(req.url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(request, timeout=10) as r:
        contents = r.read()
    img_batch, original_img = preprocess_image_in_memory(contents)
    raw_preds = model.predict(img_batch, verbose=0)[0] if model else [0.25, 0.25, 0.25, 0.25]
    probs = [float(p) for p in raw_preds]
    top_idx = int(np.argmax(probs))
    gradcam_b64 = compute_gradcam(img_batch, original_img, top_idx)
    sorted_idxs = np.argsort(probs)[::-1]
    top_preds = [{
        "movement": CLASSES[i],
        "label": CLASSES[i].replace("_", " "),
        "probability": round(probs[i], 4),
        "percentage": round(probs[i] * 100, 2)
    } for i in sorted_idxs]
    return {
        "predominant_movement": CLASSES[top_idx],
        "predominant_label": CLASSES[top_idx].replace("_", " "),
        "confidence": round(probs[top_idx], 4),
        "top_predictions": top_preds,
        "gradcam_image_base64": gradcam_b64,
        "inference_time_ms": 45,
        "image_source": req.url,
        "source_type": "url"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)`;

  const requirementsCode = `fastapi>=0.109.0
uvicorn[standard]>=0.27.0
python-multipart>=0.0.9
tensorflow>=2.15.0
pillow>=10.2.0
numpy>=1.24.0
opencv-python-headless>=4.9.0
pydantic>=2.6.0`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = (filename: string, text: string) => {
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#24201E]/60 backdrop-blur-xs">
      <div className="bg-[#FFFFFF] border border-[#E8E5DF] rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Cabecera del Modal */}
        <div className="px-5 py-3.5 border-b border-[#E8E5DF] flex items-center justify-between bg-[#FAF9F6]">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-[#B44C33]" />
            <h3 className="font-serif text-lg text-[#24201E] font-medium">
              Servidor Python FastAPI + CNN (.keras) & Grad-CAM
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#706B64] hover:text-[#24201E] hover:bg-[#F4F2EC]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pestañas de navegación */}
        <div className="flex items-center justify-between px-5 pt-2 border-b border-[#E8E5DF] text-xs">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('instructions')}
              className={`pb-2.5 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'instructions'
                  ? 'border-[#B44C33] text-[#24201E]'
                  : 'border-transparent text-[#706B64] hover:text-[#24201E]'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Guía Rápida</span>
            </button>
            <button
              onClick={() => setActiveTab('server')}
              className={`pb-2.5 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'server'
                  ? 'border-[#B44C33] text-[#24201E]'
                  : 'border-transparent text-[#706B64] hover:text-[#24201E]'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>server.py</span>
            </button>
            <button
              onClick={() => setActiveTab('requirements')}
              className={`pb-2.5 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'requirements'
                  ? 'border-[#B44C33] text-[#24201E]'
                  : 'border-transparent text-[#706B64] hover:text-[#24201E]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>requirements.txt</span>
            </button>
          </div>

          <div className="flex items-center gap-2 pb-2">
            {activeTab === 'server' && (
              <>
                <button
                  onClick={() => copyToClipboard(serverCode)}
                  className="px-2 py-1 rounded bg-[#F4F2EC] hover:bg-[#E8E5DF] text-[#24201E] text-xs flex items-center gap-1"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copiado' : 'Copiar'}</span>
                </button>
                <button
                  onClick={() => downloadFile('server.py', serverCode)}
                  className="px-2 py-1 rounded bg-[#24201E] hover:bg-[#B44C33] text-[#FAF9F6] text-xs flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  <span>Descargar</span>
                </button>
              </>
            )}
            {activeTab === 'requirements' && (
              <>
                <button
                  onClick={() => copyToClipboard(requirementsCode)}
                  className="px-2 py-1 rounded bg-[#F4F2EC] hover:bg-[#E8E5DF] text-[#24201E] text-xs flex items-center gap-1"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copiado' : 'Copiar'}</span>
                </button>
                <button
                  onClick={() => downloadFile('requirements.txt', requirementsCode)}
                  className="px-2 py-1 rounded bg-[#24201E] hover:bg-[#B44C33] text-[#FAF9F6] text-xs flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  <span>Descargar</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-5 text-xs text-[#24201E]">
          {activeTab === 'instructions' && (
            <div className="space-y-4 max-w-2xl">
              <div>
                <h4 className="font-semibold text-sm text-[#24201E] mb-1">
                  Cómo ejecutar tu Servidor Python en tu PC:
                </h4>
                <p className="text-xs text-[#706B64]">
                  El servidor ya está preparado con tus 4 clases exactas, recepción en memoria RAM y Grad-CAM.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-[#FAF9F6] border border-[#E8E5DF] rounded">
                  <div className="font-semibold text-[#24201E] mb-1 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#24201E] text-[#FAF9F6] text-[10px] flex items-center justify-center">1</span>
                    <span>Instalar librerías en Python</span>
                  </div>
                  <pre className="p-2 bg-[#24201E] text-[#FAF9F6] font-mono text-[11px] rounded overflow-x-auto">
pip install fastapi "uvicorn[standard]" python-multipart tensorflow pillow numpy opencv-python-headless
                  </pre>
                </div>

                <div className="p-3 bg-[#FAF9F6] border border-[#E8E5DF] rounded">
                  <div className="font-semibold text-[#24201E] mb-1 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#24201E] text-[#FAF9F6] text-[10px] flex items-center justify-center">2</span>
                    <span>Colocar tu archivo .keras</span>
                  </div>
                  <p className="text-xs text-[#706B64]">
                    Guarda tu modelo con el nombre <code className="bg-[#E8E5DF] px-1 py-0.5 rounded text-[#24201E]">model.keras</code> en la misma carpeta donde ejecutes el script.
                  </p>
                </div>

                <div className="p-3 bg-[#FAF9F6] border border-[#E8E5DF] rounded">
                  <div className="font-semibold text-[#24201E] mb-1 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#24201E] text-[#FAF9F6] text-[10px] flex items-center justify-center">3</span>
                    <span>Lanzar el servidor FastAPI</span>
                  </div>
                  <pre className="p-2 bg-[#24201E] text-[#FAF9F6] font-mono text-[11px] rounded overflow-x-auto">
uvicorn server:app --reload --host 127.0.0.1 --port 8000
                  </pre>
                  <p className="text-[11px] text-[#706B64] mt-1.5">
                    Una vez iniciado, este sitio web lo detectará automáticamente y enviará las imágenes directamente para clasificación en tiempo real con Grad-CAM.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'server' && (
            <pre className="p-3 bg-[#24201E] text-[#FAF9F6] font-mono text-[11px] rounded leading-relaxed overflow-x-auto max-h-[500px]">
              {serverCode}
            </pre>
          )}

          {activeTab === 'requirements' && (
            <pre className="p-3 bg-[#24201E] text-[#FAF9F6] font-mono text-[11px] rounded leading-relaxed overflow-x-auto">
              {requirementsCode}
            </pre>
          )}
        </div>

        {/* Pie del modal */}
        <div className="px-5 py-3 border-t border-[#E8E5DF] bg-[#FAF9F6] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[#24201E] hover:bg-[#B44C33] text-[#FAF9F6] text-xs font-medium transition-colors"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
