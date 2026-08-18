'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { supabase } from '@/lib/supabase';

export default function NuevaActividadPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    ubicacion: '',
    edad_minima: '',
    precio: '',
  });

  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'exito' | 'error'; texto: string } | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setMensaje(null);

    try {
      const { error } = await supabase.from('actividades').insert([
        {
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          ubicacion: formData.ubicacion,
          edad_minima: formData.edad_minima ? parseInt(formData.edad_minima) : null,
          precio: formData.precio ? parseFloat(formData.precio) : 0,
        },
      ]);

      if (error) throw error;

      setMensaje({ tipo: 'exito', texto: '¡Actividad creada correctamente en Supabase!' });
      setFormData({
        nombre: '',
        descripcion: '',
        ubicacion: '',
        edad_minima: '',
        precio: '',
      });
} catch (err: any) {
      // Captura el mensaje específico retornado por Supabase
      const errorMessage = err?.message || err?.error_description || 'Error al guardar la actividad';
      setMensaje({ tipo: 'error', texto: errorMessage });
      console.error('Error detallado:', err);
    } finally {
      setCargando(false);
    }
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
            Nombre de la actividad *
          </label>
          <input
            type="text"
            name="nombre"
            required
            value={formData.nombre}
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
            rows={4}
            value={formData.descripcion}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 text-black focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Detalles sobre la actividad..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ubicación
          </label>
          <input
            type="text"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 text-black focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Ej. Ribadesella, Asturias"
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
              Precio (€)
            </label>
            <input
              type="number"
              step="0.01"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 text-black focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ej. 15.00"
            />
          </div>
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