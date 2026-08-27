'use client';

import { useState } from 'react';

export interface ImagenObjeto {
  url: string;
  fuente?: string;
}

interface Props {
  imagenes: any;
  titulo: string;
}

// Normaliza cualquier formato de datos (JSON string, Objeto, Array de URLs)
function normalizarLista(input: any): Array<{ url: string; fuente: string }> {
  if (!input) return [];

  let datos = input;

  if (typeof datos === 'string') {
    const texto = datos.trim();
    if (texto.startsWith('[')) {
      try { datos = JSON.parse(texto); } catch { return [{ url: texto, fuente: '' }]; }
    } else if (texto.startsWith('{')) {
      try {
        const obj = JSON.parse(texto);
        return [{ url: obj.url || '', fuente: obj.fuente || '' }];
      } catch { return [{ url: texto, fuente: '' }]; }
    } else {
      return [{ url: texto, fuente: '' }];
    }
  }

  if (!Array.isArray(datos)) return [];

  return datos.map((item) => {
    if (!item) return { url: '', fuente: '' };
    if (typeof item === 'object') return { url: item.url || '', fuente: item.fuente || '' };
    if (typeof item === 'string') {
      const t = item.trim();
      if (t.startsWith('{')) {
        try {
          const parsed = JSON.parse(t);
          return { url: parsed.url || '', fuente: parsed.fuente || '' };
        } catch { return { url: t, fuente: '' }; }
      }
      return { url: t, fuente: '' };
    }
    return { url: '', fuente: '' };
  }).filter((i) => Boolean(i.url));
}

export default function GaleriaImagenes({ imagenes, titulo }: Props) {
  const [indiceSeleccionado, setIndiceSeleccionado] = useState(0);
  const [modalAbierto, setModalAbierto] = useState(false);

  const listaProcesada = normalizarLista(imagenes);

  if (listaProcesada.length === 0) return null;

  const fotoActual = listaProcesada[indiceSeleccionado] || listaProcesada[0];

  return (
    <>
      <div className="space-y-2 p-2 bg-[#FAFAF7] rounded-t-xl">
        {/* Imagen principal */}
        <div
          className="relative cursor-pointer group rounded-lg overflow-hidden h-80 bg-gray-200"
          onClick={() => setModalAbierto(true)}
        >
          <img
            src={fotoActual.url}
            alt={titulo}
            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
          />

          {fotoActual.fuente && (
            <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-medium px-2.5 py-1 rounded-md backdrop-blur-sm z-10">
              📷 {fotoActual.fuente}
            </span>
          )}

          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="bg-white/90 text-gray-900 font-medium px-3 py-1.5 rounded-lg text-xs shadow-md">
              🔍 Ampliar foto
            </span>
          </div>
        </div>

        {/* Rejilla de miniaturas */}
        {listaProcesada.length > 1 && (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-1">
            {listaProcesada.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndiceSeleccionado(i)}
                className={`h-20 rounded-md overflow-hidden border-2 transition-all ${
                  indiceSeleccionado === i
                    ? 'border-[#1FA4B6] ring-2 ring-[#1FA4B6]/30 scale-95'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img.url} alt={`${titulo} ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Visor Pantalla Completa */}
      {modalAbierto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setModalAbierto(false)}
        >
          <button
            onClick={() => setModalAbierto(false)}
            className="absolute top-4 right-4 text-white text-3xl font-bold bg-white/10 hover:bg-white/20 w-10 h-10 rounded-full flex items-center justify-center transition-colors z-50"
          >
            ✕
          </button>

          {fotoActual.fuente && (
            <div className="absolute top-4 left-4 bg-black/60 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-sm z-50">
              📷 {fotoActual.fuente}
            </div>
          )}

          <img
            src={fotoActual.url}
            alt={titulo}
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {listaProcesada.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 px-4 py-2 rounded-full text-white text-sm">
              {indiceSeleccionado + 1} / {listaProcesada.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}