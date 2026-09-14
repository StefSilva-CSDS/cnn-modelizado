import React, { useState } from 'react';
import { Wifi, WifiOff, RefreshCw, Settings2, CheckCircle2, AlertCircle } from 'lucide-react';
import { ServerConfig } from '../types';

interface Props {
  config: ServerConfig;
  onRefresh: () => void;
  onUpdateUrl: (newUrl: string) => void;
  onOpenCodeModal: () => void;
}

export const ServerStatusBadge: React.FC<Props> = ({
  config,
  onRefresh,
  onUpdateUrl,
  onOpenCodeModal
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [urlInput, setUrlInput] = useState(config.baseUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUrl(urlInput.trim());
    setIsEditing(false);
  };

  return (
    <div className="relative inline-flex items-center text-xs">
      <div className="flex items-center gap-2 bg-[#FFFFFF] border border-[#E8E5DF] rounded px-2.5 py-1.5 shadow-[0_2px_8px_rgba(36,32,30,0.04)]">
        <span
          className={`w-2 h-2 rounded-full transition-colors ${
            config.isConnected
              ? 'bg-emerald-600 animate-pulse'
              : 'bg-[#B44C33]'
          }`}
        />
        <div className="flex items-center gap-1.5 text-[#24201E] font-medium">
          {config.isConnected ? (
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>FastAPI Activo</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[#706B64]">
              <WifiOff className="w-3.5 h-3.5 text-[#B44C33]" />
              <span>Servidor Local Desconectado</span>
            </span>
          )}
        </div>

        <span className="text-[#E8E5DF]">|</span>

        <button
          id="btn-check-server"
          type="button"
          onClick={onRefresh}
          disabled={config.isChecking}
          title="Reintentar conexión con servidor Python"
          className="p-1 text-[#706B64] hover:text-[#24201E] hover:bg-[#F4F2EC] rounded transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${config.isChecking ? 'animate-spin' : ''}`} />
        </button>

        <button
          id="btn-server-settings"
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          title="Configurar URL del servidor"
          className="p-1 text-[#706B64] hover:text-[#24201E] hover:bg-[#F4F2EC] rounded transition-colors"
        >
          <Settings2 className="w-3.5 h-3.5" />
        </button>

        <button
          id="btn-open-python-code"
          type="button"
          onClick={onOpenCodeModal}
          className="ml-1 px-2 py-0.5 text-[11px] font-semibold tracking-wider uppercase bg-[#24201E] text-[#FAF9F6] hover:bg-[#B44C33] rounded transition-colors"
        >
          Código Python
        </button>
      </div>

      {isEditing && (
        <div className="absolute right-0 top-full mt-2 w-72 p-3 bg-[#FFFFFF] border border-[#E8E5DF] rounded-md shadow-lg z-30">
          <p className="text-xs font-semibold text-[#24201E] mb-1">URL del Servidor FastAPI</p>
          <p className="text-[11px] text-[#706B64] mb-2">
            Normalmente <code>http://127.0.0.1:8000</code> en tu PC.
          </p>
          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              id="input-server-url"
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="http://127.0.0.1:8000"
              className="w-full text-xs px-2 py-1.5 border border-[#E8E5DF] rounded focus:outline-none focus:border-[#24201E] text-[#24201E]"
            />
            <div className="flex justify-end gap-1.5">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-2 py-1 text-[11px] text-[#706B64] hover:text-[#24201E]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-2.5 py-1 text-[11px] bg-[#24201E] text-[#FAF9F6] hover:bg-[#B44C33] rounded"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
