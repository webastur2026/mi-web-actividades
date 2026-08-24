'use client';

import { useState } from 'react';

interface Props {
  imagenes: string[];
  titulo: string;
}

export default function GaleriaImagenes({ imagenes, titulo }: Props) {
  const [indiceSeleccionado, setIndiceSeleccionado] = useState(0);
  const [modalAbierto, setModalAbierto] = useState(false);

  if (!imagenes || imagenes.length === 0) return null;

  return (
    <>
      <div className="space-y-2 p-2 bg-gray-100 rounded-t-xl">
        {/* Imagen principal con cursor interactivo */}
        <div
          className="relative cursor-pointer group rounded-lg overflow-hidden h-80 bg-gray-900"
          onClick={() => setModalAbierto(true)}
        >
          <img
            src={imagenes[indiceSeleccionado]}
            alt={titulo}
            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="bg-white/90 text-gray-900 font-medium px-3 py-1.5 rounded-lg text-xs shadow-md">
              🔍 Ampliar foto
            </span>
          </div>
        </div>

        {/* Carrusel / rejilla de miniaturas */}
        {imagenes.length > 1 && (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-1">
            {imagenes.map((imgUrl, i) => (
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
                <img src={imgUrl} alt={`${titulo} ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
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
            className="absolute top-4 right-4 text-white text-3xl font-bold bg-white/10 hover:bg-white/20 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          >
            ✕
          </button>

          <img
            src={imagenes[indiceSeleccionado]}
            alt={titulo}
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()} // Evita cerrar el modal si se pulsa la foto directamente
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