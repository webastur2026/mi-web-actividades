'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Actividad {
  id: string;
  titulo: string;
  slug: string;
  descripcion: string;
  ubicacion_nombre: string;
  precio: string;
  imagen_url: string | null;
}

export default function HomePage() {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    async function cargarActividades() {
      const { data, error } = await supabase
        .from('actividades')
        .select('*')
        .eq('publicado', true)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setActividades(data);
      }
      setCargando(false);
    }

    cargarActividades();
  }, []);

  const actividadesFiltradas = actividades.filter((act) =>
    act.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    (act.ubicacion_nombre && act.ubicacion_nombre.toLowerCase().includes(busqueda.toLowerCase()))
  );

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Actividades en Asturias</h1>
            <p className="text-gray-600 mt-1">Descubre y planifica los mejores planes</p>
          </div>
          <Link
            href="/admin/nueva-actividad"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + Nueva Actividad
          </Link>
        </header>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Buscar por título o ubicación..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full max-w-md border border-gray-300 rounded-lg p-3 text-black focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {cargando ? (
          <p className="text-gray-500">Cargando actividades...</p>
        ) : actividadesFiltradas.length === 0 ? (
          <p className="text-gray-500">No se encontraron actividades.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {actividadesFiltradas.map((actividad) => (
              <div
                key={actividad.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                {actividad.imagen_url && (
                  <img
                    src={actividad.imagen_url}
                    alt={actividad.titulo}
                    className="w-full h-48 object-cover"
                  />
                )}

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                      {actividad.titulo}
                    </h2>
                    {actividad.ubicacion_nombre && (
                      <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-3">
                        📍 {actividad.ubicacion_nombre}
                      </p>
                    )}
                    {actividad.descripcion && (
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                        {actividad.descripcion}
                      </p>
                    )}
                  </div>

                  <div className="border-t border-gray-100 pt-4 mt-2 flex justify-between items-center text-sm">
                    <span className="font-semibold text-gray-700">
                      {actividad.precio ? actividad.precio : 'Consulte precio'}
                    </span>
                    <Link
                      href={`/${actividad.slug}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Ver detalles →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}