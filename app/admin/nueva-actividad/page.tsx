'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { supabase } from '@/lib/supabase';

// Función para generar un slug amigable para URLs a partir del título
function generarSlug(texto: string): string {
  return texto
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Elimina acentos
    .replace(/[^a-z0-9 -]/g, '')     // Elimina caracteres especiales
    .replace(/\s+/g, '-')            // Reemplaza espacios por guiones
    .replace(/-+/g, '-');            // Evita guiones dobles
}

export default function NuevaActividadPage() {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    edad_minima: '',
    edad_maxima: '',
    ubicacion_nombre: '',
    direccion: '',
    como_llegar: '',
    precio: '',
    publicado: true,
  });

  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'exito' | 'error'; texto: string } | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : e.target.value;

    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setMensaje(null);

    const slugGenerado = generarSlug(formData.titulo);

    const { error } = await supabase.from('actividades').insert([
      {
        titulo: formData.titulo,
        slug: slugGenerado,
        descripcion: formData.descripcion || null,
        edad_minima: formData.edad_minima ? parseInt(formData.edad_minima) : null,
        edad_maxima: formData.edad_maxima ? parseInt(formData.edad_maxima) : null,
        ubicacion_nombre: formData.ubicacion_nombre || null,
        direccion: formData.direccion || null,
        como_llegar: formData.como_llegar || null,
        precio: formData.precio || null,
        publicado: formData.publicado,
      },
    ]);

    if (error) {
      setMensaje({ tipo: 'error', texto: `Error Supabase (${error.code}): ${error.message}` });
      setCargando(false);
      return;
    }

    setMensaje({ tipo: 'exito', texto: '¡Actividad creada correctamente en Supabase!' });
    setFormData({
      titulo: '',
      descripcion: '',
      edad_minima: '',
      edad_maxima: '',
      ubicacion_nombre: '',
      direccion: '',
      como_llegar: '',
      precio: '',
      publicado: true,
    });
    setCargando(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg my-10 border border-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Nueva Actividad</h1>

      {mensaje && (
        <div
          className={`p-4 mb-6 rounded-md ${
            mensaje.tipo === 'exito'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título de la actividad *
          </label>
          <input
            type="text"
            name="titulo"
            required
            value={formData.titulo}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 text-black focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Ej. Taller de Piragüismo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            name="descripcion"
            rows={3}
            value={formData.descripcion}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 text-black focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Detalles sobre la actividad..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Edad Mínima
            </label>
            <input
              type="number"
              name="edad_minima"
              value={formData.edad_minima}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 text-black focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ej. 8"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Edad Máxima
            </label>
            <input
              type="number"
              name="edad_maxima"
              value={formData.edad_maxima}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 text-black focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ej. 99"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la Ubicación
          </label>
          <input
            type="text"
            name="ubicacion_nombre"
            value={formData.ubicacion_nombre}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 text-black focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Ej. Ribadesella, Asturias"
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
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 text-black focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Ej. Calle Paseo de la Princesa Letizia, s/n"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cómo llegar
          </label>
          <input
            type="text"
            name="como_llegar"
            value={formData.como_llegar}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 text-black focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Ej. Autobús de ALSA parada Ribadesella o N-634"
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
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 text-black focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Ej. Gratis / 15€ por persona"
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="publicado"
            name="publicado"
            checked={formData.publicado}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <label htmlFor="publicado" className="text-sm text-gray-700">
            Publicar inmediatamente
          </label>
        </div>

        <button
          type="submit"
          disabled={cargando}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:bg-gray-400 mt-6"
        >
          {cargando ? 'Guardando...' : 'Guardar Actividad'}
        </button>
      </form>
    </div>
  );
}