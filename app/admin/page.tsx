'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Actividad {
  id: string;
  titulo: string;
  publicado: boolean;
}

export default function AdminDashboard() {
  const [actividades, setActividades] = useState<Actividad[]>([]);

  useEffect(() => {
    fetchActividades();
  }, []);

  async function fetchActividades() {
    const { data } = await supabase.from('actividades').select('id, titulo, publicado').order('created_at', { ascending: false });
    if (data) setActividades(data);
  }

  async function togglePublicado(id: string, actual: boolean) {
    await supabase.from('actividades').update({ publicado: !actual }).eq('id', id);
    fetchActividades();
  }

  async function eliminarActividad(id: string) {
    if (confirm('¿Estás seguro de eliminar esta actividad?')) {
      await supabase.from('actividades').delete().eq('id', id);
      fetchActividades();
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Gestión de Actividades</h1>
        <Link href="/admin/nueva-actividad" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
          + Nueva Actividad
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-700">Título</th>
              <th className="p-4 font-semibold text-gray-700">Estado</th>
              <th className="p-4 font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {actividades.map((a) => (
              <tr key={a.id} className="border-b">
                <td className="p-4">{a.titulo}</td>
                <td className="p-4">
                  <button onClick={() => togglePublicado(a.id, a.publicado)} className={`px-2 py-1 rounded text-xs ${a.publicado ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {a.publicado ? 'Publicado' : 'Borrador'}
                  </button>
                </td>
                <td className="p-4">
                  <button onClick={() => eliminarActividad(a.id)} className="text-red-600 hover:text-red-800 text-sm">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}