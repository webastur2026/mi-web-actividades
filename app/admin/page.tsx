'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Actividad {
  id: string;
  titulo: string;
  publicado: boolean;
  ubicacion_nombre: string | null;
}

export default function AdminDashboard() {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetchActividades();
  }, []);

  async function fetchActividades() {
    setCargando(true);
    const { data } = await supabase
      .from('actividades')
      .select('id, titulo, publicado, ubicacion_nombre')
      .order('created_at', { ascending: false });

    if (data) setActividades(data);
    setCargando(false);
  }

  async function togglePublicado(id: string, actual: boolean) {
    await supabase.from('actividades').update({ publicado: !actual }).eq('id', id);
    fetchActividades();
  }

  async function eliminarActividad(id: string, titulo: string) {
    if (confirm(`¿Estás seguro de que deseas eliminar "${titulo}"?`)) {
      const { error } = await supabase.from('actividades').delete().eq('id', id);
      if (error) {
        alert('Error al eliminar. Revisa los permisos SQL de Supabase.');
      } else {
        fetchActividades();
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Actividades</h1>
          </div>
          <Link href="/admin/nueva-actividad" className="bg-blue-600 text-white font-medium px-4 py-2 rounded-lg text-sm">
            + Nueva Actividad
          </Link>
        </div>

        {cargando ? (
          <p className="text-gray-500 text-center py-8">Cargando...</p>
        ) : (
          <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b text-xs font-semibold text-gray-600 uppercase">
                  <th className="p-4">Título</th>
                  <th className="p-4">Ubicación</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {actividades.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">{a.titulo}</td>
                    <td className="p-4 text-gray-500">{a.ubicacion_nombre || '—'}</td>
                    <td className="p-4">
                      <button
                        onClick={() => togglePublicado(a.id, a.publicado)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          a.publicado ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {a.publicado ? 'Publicado' : 'Borrador'}
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-3">
                      <Link href={`/admin/editar/${a.id}`} className="text-blue-600 hover:text-blue-800 font-medium text-xs">
                        Editar
                      </Link>
                      <button
                        onClick={() => eliminarActividad(a.id, a.titulo)}
                        className="text-red-600 hover:text-red-800 font-medium text-xs"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}