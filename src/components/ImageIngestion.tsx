import React, { useState, useRef } from 'react';
import { Upload, Link2, Image as ImageIcon, Sparkles, Check, ArrowRight } from 'lucide-react';
import { SAMPLE_ARTWORKS } from '../data/artMovements';
import { SampleArtwork } from '../types';

interface Props {
  onImageSelected: (source: { file?: File; url?: string; sample?: SampleArtwork }) => void;
  isAnalyzing: boolean;
  selectedSampleId?: string;
}

export const ImageIngestion: React.FC<Props> = ({
  onImageSelected,
  isAnalyzing,
  selectedSampleId
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'samples'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        onImageSelected({ file });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onImageSelected({ file });
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onImageSelected({ url: urlInput.trim() });
    }
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#E8E5DF] rounded-lg p-4 sm:p-5 shadow-[0_2px_12px_rgba(36,32,30,0.03)]">
      
      {/* Selector de pestañas de origen */}
      <div className="flex items-center justify-between border-b border-[#E8E5DF] pb-3 mb-4">
        <div className="flex items-center gap-2 sm:gap-4 text-xs">
          <button
            id="tab-upload-pc"
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-1.5 pb-2 font-medium tracking-wide border-b-2 transition-all ${
              activeTab === 'upload'
                ? 'border-[#B44C33] text-[#24201E]'
                : 'border-transparent text-[#706B64] hover:text-[#24201E]'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Cargar desde PC</span>
          </button>

          <button
            id="tab-direct-url"
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-1.5 pb-2 font-medium tracking-wide border-b-2 transition-all ${
              activeTab === 'url'
                ? 'border-[#B44C33] text-[#24201E]'
                : 'border-transparent text-[#706B64] hover:text-[#24201E]'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Enlace Directo (URL HTML)</span>
          </button>

          <button
            id="tab-samples-gallery"
            type="button"
            onClick={() => setActiveTab('samples')}
            className={`flex items-center gap-1.5 pb-2 font-medium tracking-wide border-b-2 transition-all ${
              activeTab === 'samples'
                ? 'border-[#B44C33] text-[#24201E]'
                : 'border-transparent text-[#706B64] hover:text-[#24201E]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#B44C33]" />
            <span>Obras de Referencia</span>
          </button>
        </div>

        <span className="hidden md:inline-block text-[11px] text-[#706B64] font-mono">
          Procesamiento en memoria RAM (BytesIO)
        </span>
      </div>

      {/* Contenido de pestaña: Cargar desde PC */}
      {activeTab === 'upload' && (
        <div>
          <div
            id="drop-zone-pc"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative cursor-pointer border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-all ${
              isDragging
                ? 'border-[#B44C33] bg-[#FAF8F3]'
                : 'border-[#D4CFCA] bg-[#FAF9F6] hover:border-[#24201E] hover:bg-[#F4F2EC]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp, image/bmp"
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#FFFFFF] border border-[#E8E5DF] flex items-center justify-center text-[#24201E] shadow-sm">
              <Upload className="w-5 h-5" />
            </div>

            <h3 className="font-serif text-lg text-[#24201E] mb-1">
              Arrastra una pintura aquí o haz clic para examinar
            </h3>
            <p className="text-xs text-[#706B64] max-w-md mx-auto mb-3">
              Formatos soportados: JPEG, PNG, WebP. La imagen se enviará en streaming directo a tu servidor FastAPI sin guardarse en disco.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-[#24201E] text-[#FAF9F6] text-xs font-medium hover:bg-[#B44C33] transition-colors">
              <span>Seleccionar pintura de la PC</span>
            </div>
          </div>
        </div>
      )}

      {/* Contenido de pestaña: Enlace Directo URL */}
      {activeTab === 'url' && (
        <div>
          <form onSubmit={handleUrlSubmit} className="space-y-3">
            <div>
              <label htmlFor="input-img-url" className="block text-xs font-semibold text-[#24201E] mb-1.5">
                Enlace directo a la imagen (HTTP / HTTPS)
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#706B64]">
                    <Link2 className="w-4 h-4" />
                  </div>
                  <input
                    id="input-img-url"
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://ejemplo.com/obra-expresionista.jpg"
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs border border-[#E8E5DF] rounded focus:outline-none focus:border-[#24201E] bg-[#FAF9F6] text-[#24201E]"
                  />
                </div>
                <button
                  id="btn-submit-url"
                  type="submit"
                  disabled={isAnalyzing || !urlInput.trim()}
                  className="px-4 py-2 text-xs font-medium bg-[#24201E] text-[#FAF9F6] hover:bg-[#B44C33] rounded transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  <span>Analizar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <p className="text-[11px] text-[#706B64]">
              Ideal para enlazar obras de repositorios de museos (The Met, MoMA, Wikimedia Commons o cualquier servidor web).
            </p>
          </form>
        </div>
      )}

      {/* Contenido de pestaña: Obras de muestra (4 clases) */}
      {activeTab === 'samples' && (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SAMPLE_ARTWORKS.map((sample) => {
              const isSelected = selectedSampleId === sample.id;
              return (
                <button
                  key={sample.id}
                  id={`btn-sample-${sample.id}`}
                  type="button"
                  onClick={() => onImageSelected({ sample })}
                  disabled={isAnalyzing}
                  className={`group text-left p-2 rounded border transition-all relative overflow-hidden ${
                    isSelected
                      ? 'border-[#B44C33] bg-[#FAF8F3] ring-1 ring-[#B44C33]'
                      : 'border-[#E8E5DF] bg-[#FAF9F6] hover:border-[#24201E]'
                  }`}
                >
                  <div className="aspect-[4/3] rounded overflow-hidden mb-2 bg-[#E8E5DF] relative">
                    <img
                      src={sample.imageUrl}
                      alt={sample.title}
                      crossOrigin="anonymous"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-[#24201E]/80 text-[#FAF9F6] backdrop-blur-xs">
                      {sample.movementLabel}
                    </span>
                  </div>
                  <h4 className="font-serif text-xs text-[#24201E] font-medium truncate leading-tight">
                    {sample.title}
                  </h4>
                  <p className="text-[10px] text-[#706B64] truncate mt-0.5">
                    {sample.artists}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
