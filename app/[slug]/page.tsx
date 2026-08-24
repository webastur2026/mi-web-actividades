import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import BotonCompartir from './BotonCompartir';
import GaleriaImagenes from './GaleriaImagenes';

export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string }>;
}

interface EnlaceInteres {
  titulo: string;
  url: string;
}

function formatearUrl(url: string | null): string | null {
  if (!url) return null;
  const urlLimpia = url.trim();
  if (urlLimpia.startsWith('http://') || urlLimpia.startsWith('https://')) {
    return urlLimpia;
  }
  return `https://${urlLimpia}`;
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

  const enlacesInteres: EnlaceInteres[] = actividad.enlaces || [];

  const enlaceGoogleMaps = actividad.latitud && actividad.longitud
    ? `https://www.google.com/maps/search/?api=1&query=${actividad.latitud},${actividad.longitud}`
    : null;

  const webUrlValida = formatearUrl(actividad.web_url);

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Galería Interactiva */}
        <GaleriaImagenes imagenes={listaImagenes} titulo={actividad.titulo} />

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

            {/* Enlaces de interés (Wikiloc, restaurantes, descargas...) */}
            {enlacesInteres.length > 0 && (
              <div className="border-t pt-6">
                <h2 className="text-lg font-bold text-gray-800 mb-3">Enlaces de interés</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {enlacesInteres.map((item, index) => {
                    const urlValida = formatearUrl(item.url);
                    if (!urlValida) return null;
                    return (
                      <a
                        key={index}
                        href={urlValida}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3.5 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-xl font-medium text-sm text-gray-800 hover:text-blue-700 transition-all group"
                      >
                        <span className="truncate pr-2">🔗 {item.titulo}</span>
                        <span className="text-xs text-gray-400 group-hover:text-blue-600 font-bold shrink-0">
                          Abrir ↗
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Datos de contacto */}
            {(actividad.telefono || actividad.email || webUrlValida) && (
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <span className="font-semibold text-gray-800 text-sm">Información y Reservas:</span>
                <div className="flex flex-wrap gap-2 text-sm">
                  {actividad.telefono && (
                    <a
                      href={`tel:${actividad.telefono}`}
                      className="bg-white border border-gray-200 text-blue-600 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      📞 {actividad.telefono}
                    </a>
                  )}
                  {actividad.email && (
                    <a
                      href={`mailto:${actividad.email}`}
                      className="bg-white border border-gray-200 text-blue-600 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      ✉️ {actividad.email}
                    </a>
                  )}
                  {webUrlValida && (
                    <a
                      href={webUrlValida}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white font-medium px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      🌐 Web Oficial ↗
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Mapa interactivo */}
            {actividad.latitud && actividad.longitud && (
              <div className="border-t pt-6">
                <h2 className="text-lg font-bold text-gray-800 mb-3">Ubicación exacta</h2>
                <a
                  href={enlaceGoogleMaps!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative group rounded-xl overflow-hidden border border-gray-300"
                >
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
                      📍 Abrir mapa en Google Maps
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