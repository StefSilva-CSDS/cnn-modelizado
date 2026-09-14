import React, { useState } from 'react';
import { Eye, Layers, Sliders, Columns, Sparkles, ZoomIn } from 'lucide-react';
import { PredictionResponse, SampleArtwork } from '../types';

interface Props {
  imageUrl: string;
  gradcamUrl?: string;
  prediction?: PredictionResponse | null;
  activeSample?: SampleArtwork | null;
  isAnalyzing: boolean;
}

type ViewMode = 'original' | 'gradcam' | 'blend' | 'split';

export const ArtworkCanvas: React.FC<Props> = ({
  imageUrl,
  gradcamUrl,
  prediction,
  activeSample,
  isAnalyzing
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('blend');
  const [blendOpacity, setBlendOpacity] = useState<number>(0.65);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  return (
    <div className="bg-[#FFFFFF] border border-[#E8E5DF] rounded-lg p-4 sm:p-6 shadow-[0_2px_12px_rgba(36,32,30,0.03)] flex flex-col items-center">
      
      {/* Barra de herramientas superior del lienzo */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 border-b border-[#E8E5DF] pb-3 mb-5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#706B64]">
            Inspección Visual
          </span>
          {prediction && (
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#B44C33]/10 text-[#B44C33]">
              Grad-CAM Activo
            </span>
          )}
        </div>

        {/* Selector de Modos de Visualización Grad-CAM */}
        <div className="flex items-center gap-1 bg-[#F4F2EC] p-1 rounded border border-[#E8E5DF] text-xs">
          <button
            id="view-mode-original"
            type="button"
            onClick={() => setViewMode('original')}
            className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
              viewMode === 'original'
                ? 'bg-[#FFFFFF] text-[#24201E] font-medium shadow-xs'
                : 'text-[#706B64] hover:text-[#24201E]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Pintura</span>
          </button>

          <button
            id="view-mode-blend"
            type="button"
            onClick={() => setViewMode('blend')}
            disabled={!gradcamUrl}
            className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 disabled:opacity-40 ${
              viewMode === 'blend'
                ? 'bg-[#FFFFFF] text-[#24201E] font-medium shadow-xs'
                : 'text-[#706B64] hover:text-[#24201E]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#B44C33]" />
            <span>Superposición Grad-CAM</span>
          </button>

          <button
            id="view-mode-gradcam"
            type="button"
            onClick={() => setViewMode('gradcam')}
            disabled={!gradcamUrl}
            className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 disabled:opacity-40 ${
              viewMode === 'gradcam'
                ? 'bg-[#FFFFFF] text-[#24201E] font-medium shadow-xs'
                : 'text-[#706B64] hover:text-[#24201E]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#B44C33]" />
            <span>Atención CNN</span>
          </button>

          <button
            id="view-mode-split"
            type="button"
            onClick={() => setViewMode('split')}
            disabled={!gradcamUrl}
            className={`px-2.5 py-1 rounded transition-colors hidden sm:flex items-center gap-1.5 disabled:opacity-40 ${
              viewMode === 'split'
                ? 'bg-[#FFFFFF] text-[#24201E] font-medium shadow-xs'
                : 'text-[#706B64] hover:text-[#24201E]'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Lado a Lado</span>
          </button>
        </div>
      </div>

      {/* Control deslizante de opacidad de Grad-CAM */}
      {viewMode === 'blend' && gradcamUrl && (
        <div className="w-full max-w-md flex items-center gap-3 mb-4 px-3 py-1.5 bg-[#FAF9F6] border border-[#E8E5DF] rounded text-xs text-[#706B64]">
          <Sliders className="w-3.5 h-3.5 text-[#B44C33]" />
          <span className="font-medium text-[#24201E]">Opacidad Grad-CAM:</span>
          <input
            id="slider-gradcam-opacity"
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={blendOpacity}
            onChange={(e) => setBlendOpacity(parseFloat(e.target.value))}
            className="flex-1 accent-[#B44C33] cursor-pointer"
          />
          <span className="font-mono text-[11px] w-10 text-right">
            {Math.round(blendOpacity * 100)}%
          </span>
        </div>
      )}

      {/* Marco de Museo y Montura Archival */}
      <div className="w-full relative flex justify-center py-2">
        <div className="relative p-2 sm:p-4 bg-[#F4F2EC] rounded border border-[#D4CFCA] shadow-[0_16px_36px_-12px_rgba(36,32,30,0.12)] inline-block max-w-full">
          
          {isAnalyzing && (
            <div className="absolute inset-0 z-10 bg-[#FAF9F6]/80 backdrop-blur-xs rounded flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-[#B44C33] border-t-transparent animate-spin" />
              <p className="font-serif text-sm text-[#24201E]">
                Extrayendo mapas de características en la CNN...
              </p>
            </div>
          )}

          {/* Contenedor de la Imagen según el modo de vista */}
          {viewMode === 'split' && gradcamUrl ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-4xl">
              <div className="flex flex-col items-center">
                <span className="text-[11px] font-mono text-[#706B64] mb-1">Obra Original</span>
                <img
                  src={imageUrl}
                  alt="Original"
                  className="max-h-[380px] w-auto object-contain rounded border border-[#E8E5DF]"
                />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[11px] font-mono text-[#B44C33] mb-1">Grad-CAM (Mapa de Activación)</span>
                <img
                  src={gradcamUrl}
                  alt="Grad-CAM"
                  className="max-h-[380px] w-auto object-contain rounded border border-[#E8E5DF]"
                />
              </div>
            </div>
          ) : (
            <div className="relative overflow-hidden rounded inline-block max-w-full">
              {/* Imagen base */}
              <img
                id="artwork-displayed-img"
                src={viewMode === 'gradcam' && gradcamUrl ? gradcamUrl : imageUrl}
                alt="Pintura para análisis curatorial"
                crossOrigin="anonymous"
                className={`object-contain transition-all duration-300 rounded ${
                  isZoomed ? 'max-h-[580px]' : 'max-h-[360px] sm:max-h-[440px]'
                } w-auto`}
              />

              {/* Capa superpuesta en modo blend */}
              {viewMode === 'blend' && gradcamUrl && (
                <img
                  src={gradcamUrl}
                  alt="Grad-CAM Overlay"
                  style={{ opacity: blendOpacity }}
                  className={`absolute inset-0 object-contain w-full h-full pointer-events-none transition-opacity duration-150 rounded`}
                />
              )}

              {/* Botón de ampliar tamaño */}
              <button
                type="button"
                onClick={() => setIsZoomed(!isZoomed)}
                title={isZoomed ? 'Reducir' : 'Ampliar'}
                className="absolute top-2 right-2 p-1.5 rounded bg-[#24201E]/70 text-[#FAF9F6] hover:bg-[#24201E] backdrop-blur-xs transition-colors"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Placa de Exhibición de Museo (como en la foto de referencia de Kirchner / Munch / Marc) */}
          <div className="mt-4 pt-2 flex justify-center">
            <div className="bg-[#E9E8E5] border border-[#CBC7C1] rounded px-5 py-2 text-center shadow-xs max-w-md">
              <p className="font-mono text-[11px] tracking-wider uppercase font-bold text-[#24201E] leading-tight">
                {activeSample ? activeSample.artists : (prediction ? 'OBRA EN EVALUACIÓN DE ARTE' : 'PINTURA CARGADA')}
              </p>
              <p className="font-serif italic text-xs text-[#4D4541] mt-0.5">
                {activeSample ? activeSample.title : 'Clasificación de Movimiento por Visión Artificial'}
              </p>
              <div className="flex items-center justify-center gap-2 mt-1 text-[10px] text-[#706B64] font-mono">
                <span>{activeSample ? activeSample.year : 'c. Inferencia CNN'}</span>
                <span>•</span>
                <span className="text-[#B44C33] font-semibold uppercase">
                  {prediction ? prediction.predominant_label : 'En espera'}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
