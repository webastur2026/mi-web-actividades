'use client';

import { useEffect, useState, ChangeEvent, FormEvent, use } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function EditarActividadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [formData, setFormData] = useState({
    titulo: '',
    categoria: 'Aventura',
    organizador: '',
    descripcion: '',
    descripcion_larga: '',
    edad_minima: '',
    edad_maxima: '',
    ubicacion_nombre: '',
    direccion: '',
    como_llegar: '',
    latitud: '',
    longitud: '',
    telefono: '',
    email: '',
    web_url: '',
    precio: '',
    publicado: true,
  });

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'exito' | 'error'; texto: string } | null>(null);

  useEffect(() => {
    async function cargarActividad() {
      const { data, error } = await supabase
        .from('actividades')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        setMensaje({ tipo: 'error', texto: 'No se pudo cargar la actividad.' });
      } else {
        setFormData({
          titulo: data.titulo || '',
          categoria: data.categoria || 'Aventura',
          organizador: data.organizador || '',
          descripcion: data.descripcion || '',
          descripcion_larga: data.descripcion_larga || '',
          edad_minima: data.edad_minima?.toString() || '',
          edad_maxima: data.edad_maxima?.toString() || '',
          ubicacion_nombre: data.ubicacion_nombre || '',
          direccion: data.direccion || '',
          como_llegar: data.como_llegar || '',
          latitud: data.latitud?.toString() || '',
          longitud: data.longitud?.toString() || '',
          telefono: data.telefono || '',
          email: data.email || '',
          web_url: data.web_url || '',
          precio: data.precio || '',
          publicado: data.publicado ?? true,
        });
      }
      setCargando(false);
    }
    cargarActividad();
  }, [id]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : e.target.value;

    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje(null);

    try {
      const { error } = await supabase
        .from('actividades')
        .update({
          titulo: formData.titulo,
          categoria: formData.categoria || null,
          organizador: formData.organizador || null,
          descripcion: formData.descripcion || null,
          descripcion_larga: formData.descripcion_larga || null,
          edad_minima: formData.edad_minima ? parseInt(formData.edad_minima) : null,
          edad_maxima: formData.edad_maxima ? parseInt(formData.edad_maxima) : null,
          ubicacion_nombre: formData.ubicacion_nombre || null,
          direccion: formData.direccion || null,
          como_llegar: formData.como_llegar || null,
          latitud: formData.latitud ? parseFloat(formData.latitud) : null,
          longitud: formData.longitud ? parseFloat(formData.longitud) : null,
          telefono: formData.telefono || null,
          email: formData.email || null,
          web_url: formData.web_url || null,
          precio: formData.precio || null,
          publicado: formData.publicado,
        })
        .eq('id', id);

      if (error) throw error;

      setMensaje({ tipo: 'exito', texto: '¡Actividad actualizada correctamente!' });
      setTimeout(() => router.push('/admin'), 1500);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar';
      setMensaje({ tipo: 'error', texto: errorMessage });
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <div className="p-8 text-center text-gray-500">Cargando datos...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg my-10 border border-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Editar Actividad</h1>

      {mensaje && (
        <div className={`p-4 mb-6 rounded-md ${mensaje.tipo === 'exito' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {mensaje.texto}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
            <input type="text" name="titulo" required value={formData.titulo} onChange={handleChange} className="w-full border rounded-md p-2 text-black" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select name="categoria" value={formData.categoria} onChange={handleChange} className="w-full border rounded-md p-2 text-black">
              <option value="Aventura">Aventura / Deporte</option>
              <option value="Naturaleza">Naturaleza / Senderismo</option>
              <option value="Cultura">Cultura / Patrimonio</option>
              <option value="Gastronomía">Gastronomía</option>
              <option value="Infantil">Familiar / Infantil</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Empresa u Organizador</label>
          <input type="text" name="organizador" value={formData.organizador} onChange={handleChange} className="w-full border rounded-md p-2 text-black" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Resumen corto</label>
          <textarea name="descripcion" rows={2} value={formData.descripcion} onChange={handleChange} className="w-full border rounded-md p-2 text-black" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción detallada</label>
          <textarea name="descripcion_larga" rows={6} value={formData.descripcion_larga} onChange={handleChange} className="w-full border rounded-md p-2 text-black" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} className="w-full border rounded-md p-2 text-black" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border rounded-md p-2 text-black" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Web oficial</label>
            <input type="text" name="web_url" value={formData.web_url} onChange={handleChange} className="w-full border rounded-md p-2 text-black" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
            <input type="text" name="ubicacion_nombre" value={formData.ubicacion_nombre} onChange={handleChange} className="w-full border rounded-md p-2 text-black" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
            <input type="text" name="precio" value={formData.precio} onChange={handleChange} className="w-full border rounded-md p-2 text-black" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Latitud GPS</label>
            <input type="number" step="any" name="latitud" value={formData.latitud} onChange={handleChange} className="w-full border rounded-md p-2 text-black" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Longitud GPS</label>
            <input type="number" step="any" name="longitud" value={formData.longitud} onChange={handleChange} className="w-full border rounded-md p-2 text-black" />
          </div>
        </div>

        <button type="submit" disabled={guardando} className="w-full bg-blue-600 text-white font-medium py-2 rounded-md mt-4">
          {guardando ? 'Guardando cambios...' : 'Actualizar Actividad'}
        </button>
      </form>
    </div>
  );
}