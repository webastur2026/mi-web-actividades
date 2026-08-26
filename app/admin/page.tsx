'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import EditorEnriquecido from './EditorEnriquecido';

interface EnlaceInteres {
  titulo: string;
  url: string;
}

interface Actividad {
  id?: string;
  titulo: string;
  slug: string;
  descripcion: string;
  descripcion_larga: string;
  categoria?: string;
  categorias: string[];
  ubicacion_nombre: string;
  latitud: number | null;
  longitud: number | null;
  organizador: string;
  telefono: string;
  email: string;
  web_url: string;
  wikiloc_embed?: string;
  publicado: boolean;
  imagenes: string[];
  enlaces: EnlaceInteres[];
}

const CATEGORIAS_PREDEFINIDAS = [
  'Rutas y Naturaleza',
  'Talleres y Manualidades',
  'Deportes y Multiaventura',
  'Teatro y Espectáculos',
  'Parques y Granja Escuela',
  'Ocio en Familia',
];

export default function AdminDashboard() {
  const router = useRouter();
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState<Actividad | null>(null);
  const [subiendoImg, setSubiendoImg] = useState(false);

  const [formData, setFormData] = useState<Actividad>({
    titulo: '',
    slug: '',
    descripcion: '',
    descripcion_larga: '',
    categorias: [],
    ubicacion_nombre: '',
    latitud: null,
    longitud: null,
    organizador: '',
    telefono: '',
    email: '',
    web_url: '',
    wikiloc_embed: '',
    publicado: true,
    imagenes: [],
    enlaces: [],
  });

  const [nuevoEnlaceTitulo, setNuevoEnlaceTitulo] = useState('');
  const [nuevoEnlaceUrl, setNuevoEnlaceUrl] = useState('');

  useEffect(() => {
    comprobarSesionYCargar();
  }, []);

  async function comprobarSesionYCargar() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/login');
      return;
    }
    cargarActividades();
  }

  async function cargarActividades() {
    setCargando(true);
    const { data } = await supabase
      .from('actividades')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) {
      const mapeadas = data.map((act) => ({
        ...act,
        categorias: act.categorias || (act.categoria ? [act.categoria] : []),
      }));
      setActividades(mapeadas);
    }
    setCargando(false);
  }

  async function cerrarSesion() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  function generarSlug(titulo: string) {
    return titulo
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  const handleTituloChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      titulo: val,
      slug: editando ? prev.slug : generarSlug(val),
    }));
  };

  const handleSubirImagenes = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setSubiendoImg(true);
    const nuevasUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('actividades')
        .upload(fileName, file);

      if (!error && data) {
        const { data: urlData } = supabase.storage
          .from('actividades')
          .getPublicUrl(data.path);

        nuevasUrls.push(urlData.publicUrl);
      }
    }

    setFormData((prev) => ({
      ...prev,
      imagenes: [...prev.imagenes, ...nuevasUrls],
    }));
    setSubiendoImg(false);
  };

  function eliminarImagen(index: number) {
    setFormData((prev) => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== index),
    }));
  }

  function añadirEnlace() {
    if (!nuevoEnlaceTitulo.trim() || !nuevoEnlaceUrl.trim()) return;
    setFormData((prev) => ({
      ...prev,
      enlaces: [
        ...prev.enlaces,
        { titulo: nuevoEnlaceTitulo.trim(), url: nuevoEnlaceUrl.trim() },
      ],
    }));
    setNuevoEnlaceTitulo('');
    setNuevoEnlaceUrl('');
  }

  function eliminarEnlace(index: number) {
    setFormData((prev) => ({
      ...prev,
      enlaces: prev.enlaces.filter((_, i) => i !== index),
    }));
  }

  function iniciarEdicion(act: Actividad) {
    setEditando(act);
    setFormData({
      ...act,
      categorias: act.categorias || (act.categoria ? [act.categoria] : []),
      imagenes: act.imagenes || [],
      enlaces: act.enlaces || [],
      wikiloc_embed: act.wikiloc_embed || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelarEdicion() {
    setEditando(null);
    setFormData({
      titulo: '',
      slug: '',
      descripcion: '',
      descripcion_larga: '',
      categorias: [],
      ubicacion_nombre: '',
      latitud: null,
      longitud: null,
      organizador: '',
      telefono: '',
      email: '',
      web_url: '',
      wikiloc_embed: '',
      publicado: true,
      imagenes: [],
      enlaces: [],
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      ...formData,
      slug: formData.slug || generarSlug(formData.titulo),
      categoria: formData.categorias.length > 0 ? formData.categorias[0] : null,
      categorias: formData.categorias,
      imagen_url: formData.imagenes.length > 0 ? formData.imagenes[0] : null,
    };

    if (editando?.id) {
      await supabase.from('actividades').update(payload).eq('id', editando.id);
    } else {
      await supabase.from('actividades').insert([payload]);
    }

    cancelarEdicion();
    cargarActividades();
  }

  async function togglePublicado(act: Actividad) {
    if (!act.id) return;
    await supabase.from('actividades').update({ publicado: !act.publicado }).eq('id', act.id);
    cargarActividades();
  }

  async function eliminarActividad(id?: string) {
    if (!id || !confirm('¿Estás seguro de eliminar esta actividad?')) return;
    await supabase.from('actividades').delete().eq('id', id);
    cargarActividades();
  }

  return (
    <main className="min-h-screen py-8 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Cabecera Principal */}
        <header className="bg-white p-6 rounded-2xl border border-[#EBF2E8] shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12">
              <Image src="/logo.png" alt="Logo" fill className="object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#4A3728] font-heading">Panel de Gestión</h1>
              <p className="text-xs text-[#6B5340]">El sol y la mariposa</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/mensajes"
              className="text-xs font-bold text-[#1FA4B6] bg-[#EBF2E8] px-3.5 py-2 rounded-xl hover:bg-[#FAFAF7] transition-colors flex items-center gap-1.5"
            >
              ✉️ Mensajes
            </Link>
            <Link
              href="/"
              target="_blank"
              className="text-xs font-bold text-[#1FA4B6] bg-[#EBF2E8] px-3.5 py-2 rounded-xl hover:bg-[#FAFAF7] transition-colors"
            >
              🌐 Ver Web
            </Link>
            <button
              onClick={cerrarSesion}
              className="text-xs font-bold text-red-600 border border-red-200 bg-red-50 px-3.5 py-2 rounded-xl hover:bg-red-100 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </header>

        {/* Banner destacado: Acceso a la Bandeja de Mensajes */}
        <div className="bg-white p-5 rounded-2xl border border-[#EBF2E8] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EBF2E8] flex items-center justify-center text-xl shrink-0">
              ✉️
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#4A3728]">Bandeja de Contacto</h2>
              <p className="text-xs text-[#6B5340]">Revisa las propuestas y fotos enviadas por las familias desde el formulario.</p>
            </div>
          </div>
          <Link
            href="/admin/mensajes"
            className="text-xs font-bold text-white bg-[#1FA4B6] px-4 py-2.5 rounded-xl hover:bg-[#188897] transition-colors shrink-0"
          >
            Ver mensajes recibidos ↗
          </Link>
        </div>

        {/* Formulario de Crear / Editar Actividad */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[#EBF2E8] shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-[#EBF2E8]">
            <h2 className="text-xl font-bold text-[#4A3728] font-heading">
              {editando ? '✏️ Editando Actividad' : '➕ Nueva Actividad'}
            </h2>
            {editando && (
              <button
                type="button"
                onClick={cancelarEdicion}
                className="text-xs font-bold text-[#6B5340] hover:underline"
              >
                Cancelar edición
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-[#4A3728] mb-1">
                Título de la actividad *
              </label>
              <input
                type="text"
                required
                value={formData.titulo}
                onChange={handleTituloChange}
                className="w-full p-2.5 bg-[#FAFAF7] border border-[#EBF2E8] rounded-xl text-sm text-[#4A3728] outline-none focus:ring-2 focus:ring-[#1FA4B6]"
                placeholder="Ej: Ruta a la Cascada del Maza"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A3728] mb-2">
                Categorías (selección múltiple)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-[#FAFAF7] p-3 rounded-xl border border-[#EBF2E8]">
                {CATEGORIAS_PREDEFINIDAS.map((cat) => {
                  const seleccionada = formData.categorias?.includes(cat);
                  return (
                    <label
                      key={cat}
                      className={`flex items-center gap-2 text-xs font-semibold p-2.5 rounded-lg cursor-pointer transition-colors border ${
                        seleccionada
                          ? 'bg-[#EBF2E8] text-[#1FA4B6] border-[#1FA4B6]'
                          : 'bg-white text-[#6B5340] border-[#EBF2E8] hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={seleccionada}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData((prev) => ({
                              ...prev,
                              categorias: [...(prev.categorias || []), cat],
                            }));
                          } else {
                            setFormData((prev) => ({
                              ...prev,
                              categorias: (prev.categorias || []).filter((c) => c !== cat),
                            }));
                          }
                        }}
                        className="accent-[#1FA4B6]"
                      />
                      {cat}
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#4A3728] mb-1">
                  Ubicación (Pueblo / Municipio)
                </label>
                <input
                  type="text"
                  value={formData.ubicacion_nombre}
                  onChange={(e) => setFormData({ ...formData, ubicacion_nombre: e.target.value })}
                  className="w-full p-2.5 bg-[#FAFAF7] border border-[#EBF2E8] rounded-xl text-sm text-[#4A3728] outline-none focus:ring-2 focus:ring-[#1FA4B6]"
                  placeholder="Ej: Cangas de Onís"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3728] mb-1">
                  Organizador / Empresa
                </label>
                <input
                  type="text"
                  value={formData.organizador}
                  onChange={(e) => setFormData({ ...formData, organizador: e.target.value })}
                  className="w-full p-2.5 bg-[#FAFAF7] border border-[#EBF2E8] rounded-xl text-sm text-[#4A3728] outline-none focus:ring-2 focus:ring-[#1FA4B6]"
                  placeholder="Ej: Turismo Activo Asturias"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A3728] mb-1">
                Descripción Corta (Tarjeta)
              </label>
              <textarea
                rows={2}
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="w-full p-2.5 bg-[#FAFAF7] border border-[#EBF2E8] rounded-xl text-sm text-[#4A3728] outline-none focus:ring-2 focus:ring-[#1FA4B6]"
                placeholder="Breve resumen para la tarjeta..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A3728] mb-1">
                Descripción Detallada (Ficha completa)
              </label>
              <EditorEnriquecido
                content={formData.descripcion_larga}
                onChange={(html) => setFormData((prev) => ({ ...prev, descripcion_larga: html }))}
              />
            </div>

            {/* Campo Wikiloc */}
            <div className="bg-[#FAFAF7] p-4 rounded-xl border border-[#EBF2E8]">
              <label className="block text-xs font-bold text-[#4A3728] mb-1">
                🗺️ Código o Enlace de Embebido Wikiloc (Opcional)
              </label>
              <input
                type="text"
                value={formData.wikiloc_embed || ''}
                onChange={(e) => setFormData({ ...formData, wikiloc_embed: e.target.value })}
                className="w-full p-2.5 bg-white border border-[#EBF2E8] rounded-xl text-xs text-[#4A3728] outline-none focus:ring-2 focus:ring-[#1FA4B6]"
                placeholder="Pega aquí la URL de embebido o el código <iframe> completo de Wikiloc"
              />
              <p className="text-[11px] text-[#6B5340] mt-1">
                En Wikiloc: Clic en Compartir → Incluir en tu web → Copia el código iframe o el enlace de embeber.
              </p>
            </div>

            <div className="space-y-3 bg-[#FAFAF7] p-4 rounded-xl border border-[#EBF2E8]">
              <label className="block text-xs font-bold text-[#4A3728]">
                📷 Galería de Fotos
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleSubirImagenes}
                disabled={subiendoImg}
                className="block w-full text-xs text-[#6B5340] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#1FA4B6] file:text-white hover:file:bg-[#188897] cursor-pointer"
              />
              {subiendoImg && <p className="text-xs text-[#F48C2E] font-bold">Subiendo fotos...</p>}

              {formData.imagenes.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2">
                  {formData.imagenes.map((url, idx) => (
                    <div key={idx} className="relative group h-20 bg-gray-100 rounded-lg overflow-hidden border border-[#EBF2E8]">
                      <img src={url} alt="subida" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => eliminarImagen(idx)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3 bg-[#FAFAF7] p-4 rounded-xl border border-[#EBF2E8]">
              <label className="block text-xs font-bold text-[#4A3728]">
                🔗 Enlaces de Interés
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Título (Ej: Ruta Wikiloc)"
                  value={nuevoEnlaceTitulo}
                  onChange={(e) => setNuevoEnlaceTitulo(e.target.value)}
                  className="flex-1 p-2 bg-white border border-[#EBF2E8] rounded-xl text-xs text-[#4A3728]"
                />
                <input
                  type="url"
                  placeholder="URL (Ej: https://wikiloc.com/...)"
                  value={nuevoEnlaceUrl}
                  onChange={(e) => setNuevoEnlaceUrl(e.target.value)}
                  className="flex-1 p-2 bg-white border border-[#EBF2E8] rounded-xl text-xs text-[#4A3728]"
                />
                <button
                  type="button"
                  onClick={añadirEnlace}
                  className="bg-[#72A448] text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-[#598C3A] transition-colors shrink-0"
                >
                  + Añadir
                </button>
              </div>

              {formData.enlaces.length > 0 && (
                <div className="space-y-1 pt-2">
                  {formData.enlaces.map((link, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white p-2 rounded-lg border border-[#EBF2E8] text-xs">
                      <span className="font-semibold text-[#4A3728]">🔗 {link.titulo} ({link.url})</span>
                      <button
                        type="button"
                        onClick={() => eliminarEnlace(idx)}
                        className="text-red-500 font-bold hover:underline"
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#4A3728] mb-1">Teléfono</label>
                <input
                  type="text"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="w-full p-2 bg-[#FAFAF7] border border-[#EBF2E8] rounded-xl text-xs text-[#4A3728]"
                  placeholder="600 000 000"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#4A3728] mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2 bg-[#FAFAF7] border border-[#EBF2E8] rounded-xl text-xs text-[#4A3728]"
                  placeholder="info@ejemplo.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#4A3728] mb-1">Web Oficial</label>
                <input
                  type="text"
                  value={formData.web_url}
                  onChange={(e) => setFormData({ ...formData, web_url: e.target.value })}
                  className="w-full p-2 bg-[#FAFAF7] border border-[#EBF2E8] rounded-xl text-xs text-[#4A3728]"
                  placeholder="https://..."
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#F48C2E] hover:bg-[#E96D27] text-white font-bold py-3 rounded-xl transition-colors shadow-sm text-sm"
            >
              {editando ? '💾 Guardar Cambios' : '🚀 Publicar Actividad'}
            </button>
          </form>
        </section>

        {/* Listado de Actividades */}
        <section className="bg-white p-6 rounded-2xl border border-[#EBF2E8] shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-[#4A3728] font-heading">
            📋 Actividades Creadas ({actividades.length})
          </h2>

          {cargando ? (
            <p className="text-xs text-[#6B5340]">Cargando actividades...</p>
          ) : actividades.length === 0 ? (
            <p className="text-xs text-[#6B5340]">No hay actividades registradas todavía.</p>
          ) : (
            <div className="divide-y divide-[#EBF2E8]">
              {actividades.map((act) => (
                <div key={act.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap gap-1">
                      {act.categorias?.map((cat) => (
                        <span key={cat} className="text-[10px] font-bold text-[#1FA4B6] bg-[#EBF2E8] px-2 py-0.5 rounded-md uppercase">
                          {cat}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-bold text-[#4A3728] text-base">{act.titulo}</h3>
                    <p className="text-xs text-[#6B5340]">📍 {act.ubicacion_nombre || 'Sin ubicación'}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePublicado(act)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-colors ${
                        act.publicado
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {act.publicado ? 'Publicado' : 'Borrador'}
                    </button>
                    <button
                      onClick={() => iniciarEdicion(act)}
                      className="bg-[#FAFAF7] border border-[#EBF2E8] text-[#4A3728] font-bold text-xs px-3 py-1.5 rounded-xl hover:bg-[#EBF2E8] transition-colors"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => eliminarActividad(act.id)}
                      className="bg-red-50 border border-red-200 text-red-600 font-bold text-xs px-3 py-1.5 rounded-xl hover:bg-red-100 transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}