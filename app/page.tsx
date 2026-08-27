'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';

interface ImagenObjeto {
  url: string;
  fuente?: string;
}

interface Actividad {
  id: string;
  titulo: string;
  slug: string;
  descripcion: string;
  categoria?: string;
  categorias?: string[];
  ubicacion_nombre: string;
  imagenes?: (string | ImagenObjeto)[];
  imagen_url?: string;
}

const CATEGORIAS = [
  'Todas',
  'Rutas y Naturaleza',
  'Talleres y Manualidades',
  'Deportes y Multiaventura',
  'Teatro y Espectáculos',
  'Parques y Granja Escuela',
  'Ocio en Familia',
];

function obtenerUrlImagen(img: any): string {
  if (!img) return '/logo.png';

  if (typeof img === 'object' && img !== null) {
    return img.url || '/logo.png';
  }

  if (typeof img === 'string') {
    const textoLimpio = img.trim();
    if (textoLimpio.startsWith('{')) {
      try {
        const json = JSON.parse(textoLimpio);
        return json.url || '/logo.png';
      } catch {
        return img;
      }
    }
    return img;
  }

  return '/logo.png';
}

export default function HomePage() {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');

  useEffect(() => {
    cargarActividades();
  }, []);

  async function cargarActividades() {
    setCargando(true);
    const { data } = await supabase
      .from('actividades')
      .select('*')
      .eq('publicado', true)
      .order('created_at', { ascending: false });

    if (data) {
      setActividades(data);
    }
    setCargando(false);
  }

  const actividadesFiltradas = actividades.filter((act) => {
    const coincideTexto =
      act.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      act.descripcion?.toLowerCase().includes(busqueda.toLowerCase()) ||
      act.ubicacion_nombre?.toLowerCase().includes(busqueda.toLowerCase());

    const listaCats = act.categorias || (act.categoria ? [act.categoria] : []);
    const coincideCategoria =
      categoriaSeleccionada === 'Todas' || listaCats.includes(categoriaSeleccionada);

    return coincideTexto && coincideCategoria;
  });

  return (
    <main className="min-h-screen py-6 px-4 sm:px-8 bg-[#FAFAF7]">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Cabecera Principal con Logo Extra Grande */}
        <header className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EBF2E8] shadow-sm flex items-center justify-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#EBF2E8] rounded-full blur-2xl opacity-60 pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-[#F48C2E]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 text-center sm:text-left">
            {/* Columna 1: Logo Extra Grande (128px móvil / 176px escritorio) */}
            <div className="relative w-32 h-32 sm:w-44 sm:h-44 shrink-0 transition-transform hover:scale-105 duration-300">
              <Image
                src="/logo.png"
                alt="Logo El Sol y la Mariposa"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Columna 2: Título y Subtítulo */}
            <div className="flex flex-col justify-center space-y-1 sm:space-y-2">
              <h1 className="text-3xl sm:text-5xl font-bold text-[#4A3728] font-heading tracking-tight leading-tight">
                El sol y la mariposa
              </h1>
              <p className="text-sm sm:text-lg text-[#6B5340] font-medium max-w-md">
                El mejor ocio para disfrutar con los peques de la casa.
              </p>
            </div>
          </div>
        </header>

        {/* Buscador y Filtros */}
        <section className="bg-white p-4 sm:p-6 rounded-2xl border border-[#EBF2E8] shadow-sm space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Buscar por título, palabra clave o municipio..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full p-3 pl-4 bg-[#FAFAF7] border border-[#EBF2E8] rounded-xl text-sm text-[#4A3728] outline-none focus:ring-2 focus:ring-[#1FA4B6]"
            />
          </div>

          {/* Categorías */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIAS.map((cat) => {
              const activa = categoriaSeleccionada === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategoriaSeleccionada(cat)}
                  className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all ${
                    activa
                      ? 'bg-[#1FA4B6] text-white shadow-sm'
                      : 'bg-[#FAFAF7] text-[#6B5340] border border-[#EBF2E8] hover:bg-[#EBF2E8]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </section>

        {/* Listado de Actividades */}
        {cargando ? (
          <div className="text-center py-12 text-[#6B5340] text-sm">Cargando actividades...</div>
        ) : actividadesFiltradas.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-[#EBF2E8] text-[#6B5340] text-sm">
            No se encontraron actividades con los filtros seleccionados.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {actividadesFiltradas.map((act) => {
              const primeraImg =
                act.imagenes && act.imagenes.length > 0
                  ? act.imagenes[0]
                  : act.imagen_url;

              const imagenUrl = obtenerUrlImagen(primeraImg);
              const categorias = act.categorias || (act.categoria ? [act.categoria] : []);

              return (
                <Link
                  key={act.id}
                  href={`/${act.slug}`}
                  className="group bg-white rounded-2xl border border-[#EBF2E8] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-48 w-full bg-[#FAFAF7] overflow-hidden">
                    <img
                      src={imagenUrl}
                      alt={act.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="p-5 flex flex-col flex-1 justify-between space-y-3">
                    <div>
                      {categorias.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {categorias.map((c) => (
                            <span
                              key={c}
                              className="text-[10px] font-bold text-[#1FA4B6] uppercase bg-[#EBF2E8] px-2 py-0.5 rounded-md"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      )}

                      <h2 className="text-lg font-bold text-[#4A3728] font-heading group-hover:text-[#1FA4B6] transition-colors line-clamp-1">
                        {act.titulo}
                      </h2>

                      {act.descripcion && (
                        <p className="text-xs text-[#6B5340] line-clamp-2 mt-1">
                          {act.descripcion}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-[#EBF2E8] flex justify-between items-center text-xs text-[#6B5340] font-semibold">
                      <span>📍 {act.ubicacion_nombre || 'Asturias'}</span>
                      <span className="text-[#F48C2E] group-hover:translate-x-1 transition-transform">
                        Ver ficha ↗
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}