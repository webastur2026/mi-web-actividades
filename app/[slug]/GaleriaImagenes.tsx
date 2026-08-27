'use client';

import { useState } from 'react';

export interface ImagenObjeto {
  url: string;
  fuente?: string;
}

interface Props {
  imagenes: (string | ImagenObjeto)[];
  titulo: string;
}

export default function GaleriaImagenes({ imagenes, titulo }: Props) {
  const [indiceSeleccionado, setIndiceSeleccionado] = useState(0);
  const [modalAbierto, setModalAbierto] = useState(false);

  if (!imagenes || imagenes.length === 0) return null;

  const itemSeleccionado = imagenes[indiceSeleccionado];
  const urlSeleccionada = typeof itemSeleccionado === 'string' ? itemSeleccionado : itemSeleccionado?.url || '';
  const fuenteSeleccionada = typeof itemSeleccionado === 'string' ? '' : itemSeleccionado?.fuente || '';

  return (
    <>
      <div className="space-y-2 p-2 bg-gray-100 rounded-t-xl">
        {/* Imagen principal con cursor interactivo */}
        <div
          className="relative cursor-pointer group rounded-lg overflow-hidden h-80 bg-gray-900"
          onClick={() => setModalAbierto(true)}
        >
          <img
            src={urlSeleccionada}
            alt={titulo}
            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
          />

          {/* Etiqueta de fuente / autoría en la imagen principal */}
          {fuenteSeleccionada && (
            <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-medium px-2.5 py-1 rounded-md backdrop-blur-sm z-10">
              📷 {fuenteSeleccionada}
            </span>
          )}

          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="bg-white/90 text-gray-900 font-medium px-3 py-1.5 rounded-lg text-xs shadow-md">
              🔍 Ampliar foto
            </span>
          </div>
        </div>

        {/* Carrusel / rejilla de miniaturas */}
        {imagenes.length > 1 && (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-1">
            {imagenes.map((img, i) => {
              const urlThumb = typeof img === 'string' ? img : img.url;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndiceSeleccionado(i)}
                  className={`h-20 rounded-md overflow-hidden border-2 transition-all ${
                    indiceSeleccionado === i
                      ? 'border-blue-600 ring-2 ring-blue-300 scale-95'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={urlThumb} alt={`${titulo} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Visor a Pantalla Completa (Lightbox) */}
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

          {/* Créditos de autoría dentro de la vista ampliada */}
          {fuenteSeleccionada && (
            <div className="absolute top-4 left-4 bg-black/60 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-sm z-50">
              📷 {fuenteSeleccionada}
            </div>
          )}

          <img
            src={urlSeleccionada}
            alt={titulo}
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {imagenes.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 px-4 py-2 rounded-full text-white text-sm">
              {indiceSeleccionado + 1} / {imagenes.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}