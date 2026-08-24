'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Actividad {
  id: string;
  titulo: string;
  slug: string;
  descripcion: string | null;
  ubicacion_nombre: string | null;
  categoria: string | null;
  precio: string | null;
  edad_minima: number | null;
  edad_maxima: number | null;
  imagen_url: string | null;
  imagenes: string[] | null;
}

const CATEGORIAS = ['Todas', 'Aventura', 'Naturaleza', 'Cultura', 'Gastronomía', 'Infantil'];

export default function HomePage() {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [cargando, setCargando] = useState(true);
  
  // Estados para los filtros
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSel, setCategoriaSel] = useState('Todas');

  useEffect(() => {
    async function fetchActividades() {
      const { data } = await supabase
        .from('actividades')
        .select('*')
        .eq('publicado', true)
        .order('created_at', { ascending: false });

      if (data) setActividades(data);
      setCargando(false);
    }
    fetchActividades();
  }, []);

  // Filtrado dinámico en cliente
  const actividadesFiltradas = actividades.filter((act) => {
    const coincideTexto = 
      act.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      (act.ubicacion_nombre && act.ubicacion_nombre.toLowerCase().includes(busqueda.toLowerCase()));

    const coincideCategoria = 
      categoriaSel === 'Todas' || act.categoria === categoriaSel;

    return coincideTexto && coincideCategoria;
  });

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
            Actividades y Planes
          </h1>
          <p className="text-lg text-gray-600">
            Descubre las mejores experiencias e itinerarios.
          </p>
        </header>

        {/* Buscador y Filtros */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-8 space-y-4">
          <div className="w-full">
            <input
              type="text"
              placeholder="🔍 Buscar por nombre o municipio (ej. Arriondas)..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-black focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-semibold text-gray-500 uppercase mr-2">Categorías:</span>
            {CATEGORIAS.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaSel(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  categoriaSel === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Resultados */}
        {cargando ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-500">Cargando actividades...</p>
          </div>
        ) : actividadesFiltradas.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-500">No se encontraron actividades con estos filtros.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {actividadesFiltradas.map((actividad) => {
              const imagenMostrar =
                actividad.imagenes && actividad.imagenes.length > 0
                  ? actividad.imagenes[0]
                  : actividad.imagen_url;

              return (
                <Link
                  key={actividad.id}
                  href={`/${actividad.slug}`}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200 flex flex-col"
                >
                  {imagenMostrar ? (
                    <img
                      src={imagenMostrar}
                      alt={actividad.titulo}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                      Sin imagen
                    </div>
                  )}

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        {actividad.ubicacion_nombre && (
                          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">
                            📍 {actividad.ubicacion_nombre}
                          </span>
                        )}
                        {actividad.categoria && (
                          <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                            {actividad.categoria}
                          </span>
                        )}
                      </div>
                      
                      <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {actividad.titulo}
                      </h2>
                      {actividad.descripcion && (
                        <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                          {actividad.descripcion}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
                      <span>
                        {actividad.edad_minima || actividad.edad_maxima
                          ? `Edad: ${actividad.edad_minima || 0} - ${actividad.edad_maxima || 'sin límite'}`
                          : 'Todas las edades'}
                      </span>
                      <span className="text-gray-900 font-semibold">
                        {actividad.precio || 'Gratis / A consultar'}
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