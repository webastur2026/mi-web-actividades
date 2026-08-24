'use client';

import { useState, FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import FormularioEnlaces, { EnlaceInteres } from '../FormularioEnlaces';

export default function NuevaActividadPage() {
  const router = useRouter();
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [descripcionLarga, setDescripcionLarga] = useState('');
  const [categoria, setCategoria] = useState('');
  const [ubicacionNombre, setUbicacionNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [webUrl, setWebUrl] = useState('');
  const [enlaces, setEnlaces] = useState<EnlaceInteres[]>([]);
  const [archivosImagenes, setArchivosImagenes] = useState<File[]>([]);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setCargando(true);

    try {
      // 1. Subir imágenes si existen
      const urlsImagenes: string[] = [];
      for (const file of archivosImagenes) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('actividades-fotos')
          .upload(fileName, file);

        if (!uploadError) {
          const { data } = supabase.storage.from('actividades-fotos').getPublicUrl(fileName);
          urlsImagenes.push(data.publicUrl);
        }
      }

      // 2. Generar slug
      const slug = titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      // 3. Filtrar enlaces válidos
      const enlacesValidos = enlaces.filter(e => e.titulo.trim() !== '' && e.url.trim() !== '');

      // 4. Insertar en base de datos
      const { error } = await supabase.from('actividades').insert({
        titulo,
        slug,
        descripcion,
        descripcion_larga: descripcionLarga,
        categoria,
        ubicacion_nombre: ubicacionNombre,
        telefono,
        email,
        web_url: webUrl,
        enlaces: enlacesValidos,
        imagenes: urlsImagenes,
        publicado: true
      });

      if (error) throw error;
      router.push('/admin');
    } catch (err: any) {
      alert('Error al guardar: ' + err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Nueva Actividad</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Título *</label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full border rounded-lg p-2.5 text-black outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Categoría</label>
              <input
                type="text"
                placeholder="Ej: Senderismo, Gastronomía"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full border rounded-lg p-2.5 text-black outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Ubicación (Nombre)</label>
              <input
                type="text"
                placeholder="Ej: Llanes, Picos de Europa"
                value={ubicacionNombre}
                onChange={(e) => setUbicacionNombre(e.target.value)}
                className="w-full border rounded-lg p-2.5 text-black outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Resumen corto</label>
            <textarea
              rows={2}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full border rounded-lg p-2.5 text-black outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción detallada</label>
            <textarea
              rows={5}
              value={descripcionLarga}
              onChange={(e) => setDescripcionLarga(e.target.value)}
              className="w-full border rounded-lg p-2.5 text-black outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Gestión de enlaces de interés */}
          <FormularioEnlaces enlaces={enlaces} onChange={setEnlaces} />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono</label>
              <input
                type="text"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full border rounded-lg p-2.5 text-black outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg p-2.5 text-black outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Web oficial</label>
              <input
                type="text"
                value={webUrl}
                onChange={(e) => setWebUrl(e.target.value)}
                className="w-full border rounded-lg p-2.5 text-black outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Imágenes</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setArchivosImagenes(Array.from(e.target.files || []))}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={cargando}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
            >
              {cargando ? 'Guardando...' : 'Crear Actividad'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-6 py-2.5 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}