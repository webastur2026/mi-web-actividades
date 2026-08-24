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

      if (archivosImagenes && archivosImagenes.length > 0) {
        for (let i = 0; i < archivosImagenes.length; i++) {
          const archivo = archivosImagenes[i];
          const fileExt = archivo.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('actividades-imagenes')
            .upload(fileName, archivo);

          if (uploadError) throw uploadError;

          const { data: urlData } = supabase.storage
            .from('actividades-imagenes')
            .getPublicUrl(fileName);

          urlsImagenes.push(urlData.publicUrl);
        }
      }

      const slugGenerado = generarSlug(formData.titulo);

      const { error } = await supabase.from('actividades').insert([
        {
          titulo: formData.titulo,
          slug: slugGenerado,
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
          imagen_url: urlsImagenes.length > 0 ? urlsImagenes[0] : null,
          imagenes: urlsImagenes,
        },
      ]);

      if (error) throw error;

      setMensaje({ tipo: 'exito', texto: '¡Actividad creada correctamente!' });
      setFormData({
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
      setArchivosImagenes(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al guardar';
      setMensaje({ tipo: 'error', texto: errorMessage });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg my-10 border border-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Nueva Actividad</h1>

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
          <input type="text" name="organizador" value={formData.organizador} onChange={handleChange} className="w-full border rounded-md p-2 text-black" placeholder="Ej. Club de Kayak Sella" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Imágenes</label>
          <input type="file" accept="image/*" multiple onChange={handleImagenesChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Resumen corto (para la tarjeta)</label>
          <textarea name="descripcion" rows={2} value={formData.descripcion} onChange={handleChange} className="w-full border rounded-md p-2 text-black" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción detallada (Estilo blog)</label>
          <textarea name="descripcion_larga" rows={6} value={formData.descripcion_larga} onChange={handleChange} className="w-full border rounded-md p-2 text-black" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} className="w-full border rounded-md p-2 text-black" placeholder="+34 600..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border rounded-md p-2 text-black" placeholder="info@..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Web oficial</label>
            <input type="text" name="web_url" value={formData.web_url} onChange={handleChange} className="w-full border rounded-md p-2 text-black" placeholder="https://..." />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Edad Mínima</label>
            <input type="number" name="edad_minima" value={formData.edad_minima} onChange={handleChange} className="w-full border rounded-md p-2 text-black" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Edad Máxima</label>
            <input type="number" name="edad_maxima" value={formData.edad_maxima} onChange={handleChange} className="w-full border rounded-md p-2 text-black" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Municipio / Ubicación</label>
            <input type="text" name="ubicacion_nombre" value={formData.ubicacion_nombre} onChange={handleChange} className="w-full border rounded-md p-2 text-black" placeholder="Ej. Arriondas" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
            <input type="text" name="precio" value={formData.precio} onChange={handleChange} className="w-full border rounded-md p-2 text-black" placeholder="Ej. 25€" />
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

        <button type="submit" disabled={cargando} className="w-full bg-blue-600 text-white font-medium py-2 rounded-md mt-4">
          {cargando ? 'Guardando...' : 'Guardar Actividad'}
        </button>
      </form>
    </div>
  );
}