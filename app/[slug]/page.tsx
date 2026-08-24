import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import BotonCompartir from './BotonCompartir';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ActividadDetallePage({ params }: Props) {
  const { slug } = await params;

  const { data: actividad } = await supabase
    .from('actividades')
    .select('*')
    .eq('slug', slug)
    .eq('publicado', true)
    .single();

  if (!actividad) notFound();

  const listaImagenes: string[] = actividad.imagenes && actividad.imagenes.length > 0
    ? actividad.imagenes
    : actividad.imagen_url
    ? [actividad.imagen_url]
    : [];

  const enlaceGoogleMaps = actividad.latitud && actividad.longitud
    ? `https://www.google.com/maps/search/?api=1&query=${actividad.latitud},${actividad.longitud}`
    : null;

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Galería de imágenes */}
        {listaImagenes.length > 0 && (
          <div className="space-y-2 p-2 bg-gray-100">
            <img src={listaImagenes[0]} alt={actividad.titulo} className="w-full h-80 object-cover rounded-lg" />
            {listaImagenes.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {listaImagenes.slice(1).map((imgUrl, i) => (
                  <img key={i} src={imgUrl} alt="Galería" className="w-full h-20 object-cover rounded-md" />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <Link href="/" className="text-sm text-blue-600 font-medium hover:underline">← Volver</Link>
            <BotonCompartir titulo={actividad.titulo} />
          </div>

          {actividad.categoria && (
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded-md mb-2 inline-block">
              {actividad.categoria}
            </span>
          )}

          <h1 className="text-3xl font-bold text-gray-900 mb-1">{actividad.titulo}</h1>
          {actividad.organizador && <p className="text-sm text-gray-500 mb-4">Por: {actividad.organizador}</p>}

          <div className="space-y-6 text-gray-700">
            {actividad.descripcion && (
              <div className="p-4 bg-gray-50 border-l-4 border-blue-500 rounded-r-md text-gray-800 italic">
                {actividad.descripcion}
              </div>
            )}

            {actividad.descripcion_larga && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-3">Detalles de la actividad</h2>
                <div className="whitespace-pre-line leading-relaxed text-gray-800">{actividad.descripcion_larga}</div>
              </div>
            )}

            {/* Datos de contacto */}
            {(actividad.telefono || actividad.email || actividad.web_url) && (
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex flex-wrap gap-4 items-center justify-between">
                <span className="font-semibold text-gray-800 text-sm">Información y Reservas:</span>
                <div className="flex flex-wrap gap-3 text-sm">
                  {actividad.telefono && (
                    <a href={`tel:${actividad.telefono}`} className="bg-white border text-blue-600 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50">
                      📞 {actividad.telefono}
                    </a>
                  )}
                  {actividad.web_url && (
                    <a href={actividad.web_url} target="_blank" rel="noreferrer" className="bg-blue-600 text-white font-medium px-3 py-1.5 rounded-lg hover:bg-blue-700">
                      🌐 Web Oficial
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Mapa interactivo y GPS */}
            {actividad.latitud && actividad.longitud && (
              <div className="border-t pt-6">
                <h2 className="text-lg font-bold text-gray-800 mb-3">Ubicación exacta</h2>
                <a href={enlaceGoogleMaps!} target="_blank" rel="noreferrer" className="block relative group rounded-xl overflow-hidden border border-gray-300">
                  <iframe
                    width="100%"
                    height="220"
                    frameBorder="0"
                    scrolling="no"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${actividad.longitud - 0.008}%2C${actividad.latitud - 0.005}%2C${actividad.longitud + 0.008}%2C${actividad.latitud + 0.005}&layer=mapnik&marker=${actividad.latitud}%2C${actividad.longitud}`}
                    className="pointer-events-none"
                  ></iframe>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="bg-white text-gray-900 font-bold px-4 py-2 rounded-lg shadow-lg text-sm">
                      📍 Abrir mapa interactivo en Google Maps
                    </span>
                  </div>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}