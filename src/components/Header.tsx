import React from 'react';
import { Sparkles, Layers, Cpu } from 'lucide-react';
import { ServerConfig } from '../types';
import { ServerStatusBadge } from './ServerStatusBadge';



export const Header = ({

}) => {
  return (
    <header className="border-b border-[#E8E5DF] bg-[#FAF9F6]/80 backdrop-blur-sm sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        
        {/* Marca Curatorial */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded border border-[#24201E] bg-[#24201E] text-[#FAF9F6] flex items-center justify-center font-serif text-lg font-semibold tracking-tighter">
            Æ
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl sm:text-2xl text-[#24201E] tracking-tight leading-none">
                Curator Atelier
              </h1>
              <span className="hidden sm:inline-block text-[10px] uppercase tracking-wider font-mono font-semibold px-1.5 py-0.5 rounded bg-[#F4F2EC] text-[#706B64] border border-[#E8E5DF]">
                CNN Inférence .keras
              </span>
            </div>
            <p className="text-xs text-[#706B64] mt-0.5">
              Clasificación de Movimientos Artísticos & Interpretación Grad-CAM
            </p>
          </div>
        </div>

        {/* 4 Clases Disponibles & Widget de Servidor */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-[#706B64] border-r border-[#E8E5DF] pr-4">
            <span className="font-semibold text-[#24201E]">4 Clases:</span>
            <span className="bg-[#F4F2EC] px-1.5 py-0.5 rounded text-[#24201E]">Art Nouveau</span>
            <span className="bg-[#F4F2EC] px-1.5 py-0.5 rounded text-[#24201E]">Cubismo</span>
            <span className="bg-[#F4F2EC] px-1.5 py-0.5 rounded text-[#24201E]">Expresionismo</span>
            <span className="bg-[#F4F2EC] px-1.5 py-0.5 rounded text-[#24201E]">Impresionismo</span>
          </div>

       
        </div>
      </div>
    </header>
  );
};
