'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { supabase } from '@/lib/supabase';

export default function NuevaActividadPage() {
  const [formData, setFormData] = useState({
    titulo: '',
    slug: '',
    descripcion: '',
    edadMinima: 3,
    edadMaxima: 12,
    ubicacionNombre: '',
    direccion: '',
    comoLlegar: '',
    precio: 'Gratis',
    publicado: true,
  });

  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'exito' | 'error'; texto: string } | null>(null);

  const manejarTituloChange = (e: ChangeEvent<HTMLInputElement>) => {
    const titulo = e.target.value;
    const slug = titulo
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    setFormData((prev) => ({ ...prev, titulo, slug }));
  };

  const manejarInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const manejarEnvio = async (e: FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje(null);

    // Mapeo de campos de TypeScript a la tabla de Supabase
    const { error } = await supabase.from('actividades').insert([
      {
        titulo: formData.titulo,
        slug: formData.slug,
        descripcion: formData.descripcion,
        edad_minima: formData.edadMinima,
        edad_maxima: formData.edadMaxima,
        ubicacion_nombre: formData.ubicacionNombre,
        direccion: formData.direccion,
        como_llegar: formData.comoLlegar,
        precio: formData.precio,
        publicado: formData.publicado,
      },
    ]);

    setGuardando(false);

    if (error) {
      setMensaje({ tipo: 'error', texto: `Error al guardar: ${error.message}` });
    } else {
      setMensaje({ tipo: 'exito', texto: '¡Actividad guardada con éxito en Supabase!' });
      // Limpiar formulario
      setFormData({
        titulo: '',
        slug: '',
        descripcion: '',
        edadMinima: 3,
        edadMaxima: 12,
        ubicacionNombre: '',
        direccion: '',
        comoLlegar: '',
        precio: 'Gratis',
        publicado: true,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-xl my-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
        Crear Nueva Ficha de Actividad
      </h1>

      {mensaje && (
        <div
          className={`p-4 mb-6 rounded-lg text-sm ${
            mensaje.tipo === 'exito'
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      <form onSubmit={manejarEnvio} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título de la actividad *
            </label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={manejarTituloChange}
              required
              className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL Amigable (Slug)
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={manejarInputChange}
              required
              className="w-full border rounded-lg p-2.5 bg-gray-50 text-sm font-mono outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Edad mínima
            </label>
            <input
              type="number"
              name="edadMinima"
              value={formData.edadMinima}
              onChange={manejarInputChange}
              className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Edad máxima
            </label>
            <input
              type="number"
              name="edadMaxima"
              value={formData.edadMaxima}
              onChange={manejarInputChange}
              className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio
            </label>
            <input
              type="text"
              name="precio"
              value={formData.precio}
              onChange={manejarInputChange}
              className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lugar / Municipio *
            </label>
            <input
              type="text"
              name="ubicacionNombre"
              value={formData.ubicacionNombre}
              onChange={manejarInputChange}
              required
              className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección exacta
            </label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={manejarInputChange}
              className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción *
          </label>
          <textarea
            name="descripcion"
            rows={4}
            value={formData.descripcion}
            onChange={manejarInputChange}
            required
            className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ¿Cómo llegar?
          </label>
          <textarea
            name="comoLlegar"
            rows={2}
            value={formData.comoLlegar}
            onChange={manejarInputChange}
            className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              name="publicado"
              checked={formData.publicado}
              onChange={manejarInputChange}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Publicar de inmediato</span>
          </label>

          <button
            type="submit"
            disabled={guardando}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors disabled:opacity-50"
          >
            {guardando ? 'Guardando en Supabase...' : 'Guardar Actividad'}
          </button>
        </div>
      </form>
    </div>
  );
}