'use client';

import { useEffect, useState, FormEvent, use } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import FormularioEnlaces, { EnlaceInteres } from '../../FormularioEnlaces';

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditarActividadPage({ params }: Props) {
  const { id } = use(params);
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
  const [imagenesExistentes, setImagenesExistentes] = useState<string[]>([]);
  const [nuevasImagenes, setNuevasImagenes] = useState<File[]>([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    async function cargarActividad() {
      const { data } = await supabase.from('actividades').select('*').eq('id', id).single();
      if (data) {
        setTitulo(data.titulo || '');
        setDescripcion(data.descripcion || '');
        setDescripcionLarga(data.descripcion_larga || '');
        setCategoria(data.categoria || '');
        setUbicacionNombre(data.ubicacion_nombre || '');
        setTelefono(data.telefono || '');
        setEmail(data.email || '');
        setWebUrl(data.web_url || '');
        setEnlaces(data.enlaces || []);
        setImagenesExistentes(data.imagenes || (data.imagen_url ? [data.imagen_url] : []));
      }
      setCargando(false);
    }
    cargarActividad();
  }, [id]);

  const eliminarFotoExistente = (urlParaBorrar: string) => {
    setImagenesExistentes((prev) => prev.filter((url) => url !== urlParaBorrar));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGuardando(true);

    try {
      const urlsSubidas: string[] = [];
      for (const file of nuevasImagenes) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('actividades-fotos')
          .upload(fileName, file);

        if (!uploadError) {
          const { data } = supabase.storage.from('actividades-fotos').getPublicUrl(fileName);
          urlsSubidas.push(data.publicUrl);
        }
      }

      const listaFinalImagenes = [...imagenesExistentes, ...urlsSubidas];
      const enlacesValidos = enlaces.filter(e => e.titulo.trim() !== '' && e.url.trim() !== '');

      const { error } = await supabase
        .from('actividades')
        .update({
          titulo,
          descripcion,
          descripcion_larga: descripcionLarga,
          categoria,
          ubicacion_nombre: ubicacionNombre,
          telefono,
          email,
          web_url: webUrl,
          enlaces: enlacesValidos,
          imagenes: listaFinalImagenes,
        })
        .eq('id', id);

      if (error) throw error;
      router.push('/admin');
    } catch (err: any) {
      alert('Error al actualizar: ' + err.message);
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return <div className="p-8 text-center text-gray-500">Cargando actividad...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar Actividad</h1>

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
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full border rounded-lg p-2.5 text-black outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Ubicación (Nombre)</label>
              <input
                type="text"
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

          {/* Fotos actuales */}
          {imagenesExistentes.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Fotos actuales</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {imagenesExistentes.map((url, i) => (
                  <div key={i} className="relative group rounded-lg overflow-hidden border border-gray-200">
                    <img src={url} alt="Foto" className="w-full h-24 object-cover" />
                    <button
                      type="button"
                      onClick={() => eliminarFotoExistente(url)}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full text-xs hover:bg-red-700"
                      title="Eliminar foto"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Añadir más imágenes</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setNuevasImagenes(Array.from(e.target.files || []))}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={guardando}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
            >
              {guardando ? 'Guardando cambios...' : 'Guardar Cambios'}
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