'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { supabase } from '@/lib/supabase';

function generarSlug(texto: string): string {
  return texto
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function NuevaActividadPage() {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    descripcion_larga: '',
    edad_minima: '',
    edad_maxima: '',
    ubicacion_nombre: '',
    direccion: '',
    como_llegar: '',
    latitud: '',
    longitud: '',
    precio: '',
    publicado: true,
  });

  const [archivosImagenes, setArchivosImagenes] = useState<FileList | null>(null);
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

  const handleImagenesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setArchivosImagenes(e.target.files);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setMensaje(null);

    try {
      const urlsImagenes: string[] = [];

      // 1. Subir todas las imágenes seleccionadas a Supabase Storage
      if (archivosImagenes && archivosImagenes.length > 0) {
        for (let i = 0; i < archivosImagenes.length; i++) {
          const archivo = archivosImagenes[i];
          const fileExt = archivo.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('actividades-imagenes')
            .upload(fileName, archivo);

          if (uploadError) {
            throw new Error(`Error al subir imagen ${archivo.name}: ${uploadError.message}`);
          }

          const { data: urlData } = supabase.storage
            .from('actividades-imagenes')
            .getPublicUrl(fileName);

          urlsImagenes.push(urlData.publicUrl);
        }
      }

      // 2. Guardar el registro en la base de datos
      const slugGenerado = generarSlug(formData.titulo);

      const { error } = await supabase.from('actividades').insert([
        {
          titulo: formData.titulo,
          slug: slugGenerado,
          descripcion: formData.descripcion || null,
          descripcion_larga: formData.descripcion_larga || null,
          edad_minima: formData.edad_minima ? parseInt(formData.edad_minima) : null,
          edad_maxima: formData.edad_maxima ? parseInt(formData.edad_maxima) : null,
          ubicacion_nombre: formData.ubicacion_nombre || null,
          direccion: formData.direccion || null,
          como_llegar: formData.como_llegar || null,
          latitud: formData.latitud ? parseFloat(formData.latitud) : null,
          longitud: formData.longitud ? parseFloat(formData.longitud) : null,
          precio: formData.precio || null,
          publicado: formData.publicado,
          imagen_url: urlsImagenes.length > 0 ? urlsImagenes[0] : null, // Mantenemos la primera como portada
          imagenes: urlsImagenes, // Array completo
        },
      ]);

      if (error) throw error;

      setMensaje({ tipo: 'exito', texto: '¡Actividad creada correctamente con sus imágenes!' });
      setFormData({
        titulo: '',
        descripcion: '',
        descripcion_larga: '',
        edad_minima: '',
        edad_maxima: '',
        ubicacion_nombre: '',
        direccion: '',
        como_llegar: '',
        latitud: '',
        longitud: '',
        precio: '',
        publicado: true,
      });
      setArchivosImagenes(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al guardar la actividad';
      setMensaje({ tipo: 'error', texto: errorMessage });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg my-10 border border-gray-100">
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
            placeholder="Ej. Taller de Piragüismo en el Sella"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Imágenes de la actividad (puedes seleccionar varias)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImagenesChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {archivosImagenes && (
            <p className="text-xs text-gray-500 mt-1">
              {archivosImagenes.length} imagen(es) seleccionada(s).
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Resumen o descripción corta
          </label>
          <textarea
            name="descripcion"
            rows={2}
            value={formData.descripcion}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 text-black focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Breve resumen que aparecerá en la tarjeta de la portada..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción detallada (Tipo blog)
          </label>
          <textarea
            name="descripcion_larga"
            rows={8}
            value={formData.descripcion_larga}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 text-black focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Escribe aquí con detalle cómo se desarrolla la actividad, recomendaciones, historia, itinerario..."
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
            placeholder="Ej. Arriondas, Asturias"
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
            placeholder="Ej. Paseo de Dionisio de la Huerta"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Latitud GPS
            </label>
            <input
              type="number"
              step="any"
              name="latitud"
              value={formData.latitud}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 text-black focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ej. 43.3881"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Longitud GPS
            </label>
            <input
              type="number"
              step="any"
              name="longitud"
              value={formData.longitud}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 text-black focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ej. -5.1834"
            />
          </div>
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
            placeholder="Ej. Acceso directo por N-634"
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
            placeholder="Ej. 25€ por persona"
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
          {cargando ? 'Subiendo imágenes y guardando...' : 'Guardar Actividad'}
        </button>
      </form>
    </div>
  );
}