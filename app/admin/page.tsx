'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Actividad {
  id: string;
  titulo: string;
  publicado: boolean;
  ubicacion_nombre: string | null;
}

export default function AdminDashboard() {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [cargando, setCargando] = useState(true);
  const router = useRouter();

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
        alert('Error al eliminar. Revisa las políticas SQL en Supabase.');
      } else {
        fetchActividades();
      }
    }
  }

  const handleCerrarSesion = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Actividades</h1>
            <p className="text-sm text-gray-500 mt-1">Panel de administración general</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/nueva-actividad"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors"
            >
              + Nueva Actividad
            </Link>
            <button
              onClick={handleCerrarSesion}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {cargando ? (
          <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500">
            Cargando actividades...
          </div>
        ) : actividades.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500">
            No hay actividades registradas todavía.
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase">
                  <th className="p-4">Título</th>
                  <th className="p-4">Ubicación</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {actividades.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{a.titulo}</td>
                    <td className="p-4 text-gray-500">{a.ubicacion_nombre || '—'}</td>
                    <td className="p-4">
                      <button
                        onClick={() => togglePublicado(a.id, a.publicado)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                          a.publicado
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        }`}
                      >
                        {a.publicado ? 'Publicado' : 'Borrador'}
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-3">
                      <Link
                        href={`/admin/editar/${a.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                      >
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