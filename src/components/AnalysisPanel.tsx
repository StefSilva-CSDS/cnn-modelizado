import React from 'react';
import { Award, Clock, BookOpen, Brush, Palette, Info, CheckCircle2, ChevronRight } from 'lucide-react';
import { PredictionResponse, ArtMovementInfo } from '../types';
import { ART_MOVEMENTS } from '../data/artMovements';

interface Props {
  prediction: PredictionResponse | null;
  isAnalyzing: boolean;
}

export const AnalysisPanel: React.FC<Props> = ({ prediction, isAnalyzing }) => {
  if (!prediction && !isAnalyzing) {
    return (
      <div className="bg-[#FFFFFF] border border-[#E8E5DF] rounded-lg p-6 sm:p-8 text-center text-[#706B64]">
        <div className="w-12 h-12 rounded-full bg-[#FAF9F6] border border-[#E8E5DF] flex items-center justify-center mx-auto mb-3 text-[#B44C33]">
          <Palette className="w-5 h-5" />
        </div>
        <h3 className="font-serif text-lg text-[#24201E] mb-1">
          Listo para Clasificar
        </h3>
        <p className="text-xs text-[#706B64] max-w-sm mx-auto">
          Carga una pintura desde tu PC o pega una URL directa. La CNN evaluará la obra entre los 4 movimientos estilísticos y calculará el mapa Grad-CAM.
        </p>
      </div>
    );
  }

  const movementInfo: ArtMovementInfo | undefined = prediction
    ? ART_MOVEMENTS[prediction.predominant_movement]
    : undefined;

  return (
    <div className="bg-[#FFFFFF] border border-[#E8E5DF] rounded-lg p-5 sm:p-6 shadow-[0_2px_12px_rgba(36,32,30,0.03)] space-y-6">
      
      {/* Cabecera del Dictamen Curatorial */}
      <div className="border-b border-[#E8E5DF] pb-4">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-1.5">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#706B64] flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-[#B44C33]" />
            <span>Dictamen del Modelo CNN</span>
          </span>
          {prediction && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#706B64] flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{prediction.inference_time_ms} ms</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#B44C33]/10 text-[#B44C33] border border-[#B44C33]/20">
                {Math.round(prediction.confidence * 100)}% de Confianza
              </span>
            </div>
          )}
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl text-[#24201E] tracking-tight">
          {prediction ? (movementInfo?.name || prediction.predominant_label) : 'Analizando rasgos pictóricos...'}
        </h2>

        {movementInfo && (
          <p className="text-xs text-[#1E355B] font-medium mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1E355B]" />
            <span>{movementInfo.era}</span>
          </p>
        )}
      </div>

      {/* Distribución de Probabilidades en las 4 Clases */}
      {prediction && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#24201E] mb-3 flex items-center justify-between">
            <span>Distribución de Probabilidades (4 Clases)</span>
            <span className="text-[11px] font-mono text-[#706B64] font-normal">Capa Softmax</span>
          </h3>

          <div className="space-y-2.5">
            {prediction.top_predictions.map((item, index) => {
              const isWinner = index === 0;
              const movementData = ART_MOVEMENTS[item.movement];
              return (
                <div key={item.movement} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${isWinner ? 'bg-[#B44C33]' : 'bg-[#D0C4BE]'}`} />
                      <span className={`font-medium ${isWinner ? 'text-[#24201E] font-semibold' : 'text-[#706B64]'}`}>
                        {movementData?.label || item.label}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-[#24201E] font-semibold">
                      {item.percentage}%
                    </span>
                  </div>

                  {/* Barra de progreso con estética de terracota */}
                  <div className="h-2 w-full bg-[#F4F2EC] rounded-full overflow-hidden border border-[#E8E5DF]">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        isWinner
                          ? 'bg-[#B44C33]'
                          : 'bg-[#706B64]/40'
                      }`}
                      style={{ width: `${Math.max(item.percentage, 2)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Interpretación Grad-CAM */}
      {prediction && (
        <div className="bg-[#FAF9F6] border border-[#E8E5DF] rounded-lg p-4 text-xs space-y-2">
          <div className="flex items-center gap-1.5 text-[#24201E] font-semibold">
            <Brush className="w-3.5 h-3.5 text-[#B44C33]" />
            <span>Interpretación de Atención Visual (Grad-CAM)</span>
          </div>
          <p className="text-[#4D4541] leading-relaxed">
            {prediction.gradcam_explanation || (
              prediction.predominant_movement === 'Expressionism'
                ? 'Los filtros convolucionales superiores de la red activaron con alta intensidad en las zonas de empaste denso y contrastes cromáticos antinaturales (naranjas de fuego frente a azules cobalto), detectando la tensión gestual característica de Die Brücke y Der Blaue Reiter.'
                : prediction.predominant_movement === 'Cubism'
                ? 'La red concentró su gradiente en las intersecciones angulosas, la fractura de planos geométricos y la ausencia de perspectiva lineal tradicional.'
                : prediction.predominant_movement === 'Impressionism'
                ? 'El modelo reaccionó prioritariamente a la micro-textura de pinceladas cortas yuxtapuestas y la vibración cromática de las luces reflejadas.'
                : 'La red reconoció los ritmos de líneas sinuosas continuas ("coup de fouet") y la estilización ornamental en los contornos de las figuras.'
            )}
          </p>
        </div>
      )}

      {/* Ficha Histórica del Movimiento */}
      {movementInfo && (
        <div className="space-y-4 pt-2 border-t border-[#E8E5DF]">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#24201E] mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#1E355B]" />
              <span>Contexto Curatorial</span>
            </h4>
            <p className="text-xs text-[#4D4541] leading-relaxed">
              {movementInfo.description}
            </p>
          </div>

          {/* Maestros Clave */}
          <div>
            <span className="text-[11px] font-semibold text-[#706B64] uppercase tracking-wider block mb-1.5">
              Maestros & Referencias Clave:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {movementInfo.keyArtists.map((artist) => (
                <span
                  key={artist}
                  className="px-2 py-0.5 rounded text-[11px] bg-[#F4F2EC] text-[#24201E] border border-[#E8E5DF]"
                >
                  {artist}
                </span>
              ))}
            </div>
          </div>

          {/* Rasgos Diagnósticos */}
          <div>
            <span className="text-[11px] font-semibold text-[#706B64] uppercase tracking-wider block mb-1.5">
              Rasgos Diagnósticos Identificados:
            </span>
            <ul className="space-y-1 text-xs text-[#4D4541]">
              {movementInfo.characteristics.map((char, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-[#B44C33] mt-0.5">•</span>
                  <span>{char}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Paleta Cromática Mineral del Movimiento */}
          <div>
            <span className="text-[11px] font-semibold text-[#706B64] uppercase tracking-wider block mb-1.5">
              Gama Cromática Representativa:
            </span>
            <div className="flex items-center gap-2">
              {movementInfo.paletteColors.map((color, idx) => (
                <div
                  key={idx}
                  title={color}
                  className="w-7 h-7 rounded border border-[#CBC7C1] shadow-xs"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
