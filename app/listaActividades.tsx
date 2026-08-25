'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Actividad {
  id: string;
  titulo: string;
  slug: string;
  descripcion: string;
  categoria?: string;
  categorias?: string[];
  ubicacion_nombre: string;
  imagen_url: string;
  imagenes: string[];
}

export default function ListaActividades({ actividadesIniciales }: { actividadesIniciales: Actividad[] }) {
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSel, setCategoriaSel] = useState('');

  const categorias = Array.from(
    new Set(
      actividadesIniciales.flatMap((a) => {
        if (a.categorias && a.categorias.length > 0) return a.categorias;
        if (a.categoria) return [a.categoria];
        return [];
      })
    )
  );

  const actividadesFiltradas = actividadesIniciales.filter((act) => {
    const coincideTexto =
      act.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      (act.descripcion && act.descripcion.toLowerCase().includes(busqueda.toLowerCase())) ||
      (act.ubicacion_nombre && act.ubicacion_nombre.toLowerCase().includes(busqueda.toLowerCase()));

    const listaCatsActividad = act.categorias && act.categorias.length > 0 
      ? act.categorias 
      : act.categoria ? [act.categoria] : [];

    const coincideCat = categoriaSel === '' || listaCatsActividad.includes(categoriaSel);

    return coincideTexto && coincideCat;
  });

  return (
    <div className="space-y-8">
      {/* Barra de Búsqueda y Filtros */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-[#EBF2E8] flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-1/2">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#A8C298]">
            🔍
          </span>
          <input
            type="text"
            placeholder="Buscar por título, pueblo o descripción..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#FAFAF7] text-[#4A3728] text-sm border border-[#EBF2E8] rounded-xl outline-none focus:ring-2 focus:ring-[#1FA4B6] focus:bg-white transition-all"
          />
        </div>

        <div className="w-full sm:w-auto flex flex-wrap gap-2 items-center">
          <button
            type="button"
            onClick={() => setCategoriaSel('')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              categoriaSel === ''
                ? 'bg-[#F48C2E] text-white shadow-sm'
                : 'bg-[#FAFAF7] text-[#6B5340] border border-[#EBF2E8] hover:bg-[#EBF2E8]'
            }`}
          >
            Todas
          </button>
          {categorias.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoriaSel(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                categoriaSel === cat
                  ? 'bg-[#1FA4B6] text-white shadow-sm'
                  : 'bg-[#FAFAF7] text-[#6B5340] border border-[#EBF2E8] hover:bg-[#EBF2E8]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Rejilla de Tarjetas */}
      {actividadesFiltradas.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[#A8C298]/40">
          <p className="text-[#6B5340] font-medium">No se encontraron actividades con ese criterio.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {actividadesFiltradas.map((act) => {
            const fotoPrincipal =
              act.imagenes && act.imagenes.length > 0
                ? act.imagenes[0]
                : act.imagen_url || '/placeholder.png';

            const listaCats = act.categorias && act.categorias.length > 0 
              ? act.categorias 
              : act.categoria ? [act.categoria] : [];

            return (
              <Link
                key={act.id}
                href={`/${act.slug}`}
                className="group bg-white rounded-2xl border border-[#EBF2E8] overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full bg-[#EBF2E8] overflow-hidden">
                    <img
                      src={fotoPrincipal}
                      alt={act.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {listaCats.length > 0 && (
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1 max-w-[90%]">
                        {listaCats.map((cat) => (
                          <span
                            key={cat}
                            className="bg-white/90 text-[#1FA4B6] text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-5 space-y-2">
                    {act.ubicacion_nombre && (
                      <span className="text-xs font-semibold text-[#72A448] flex items-center gap-1">
                        📍 {act.ubicacion_nombre}
                      </span>
                    )}
                    <h2 className="text-xl font-bold text-[#4A3728] font-heading line-clamp-1 group-hover:text-[#1FA4B6] transition-colors">
                      {act.titulo}
                    </h2>
                    {act.descripcion && (
                      <p className="text-xs text-[#6B5340] line-clamp-2 leading-relaxed">
                        {act.descripcion}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-[#EBF2E8] flex justify-between items-center text-xs font-bold text-[#F48C2E] group-hover:translate-x-1 transition-transform">
                    <span>Ver más detalles</span>
                    <span>→</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}