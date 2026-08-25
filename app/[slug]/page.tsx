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
    <main className="min-h-screen py-10 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xs border border-[#EBF2E8] overflow-hidden">
        
        {/* Galería Interactiva */}
        <GaleriaImagenes imagenes={listaImagenes} titulo={actividad.titulo} />

        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <Link 
              href="/" 
              className="text-sm text-[#1FA4B6] font-bold hover:underline flex items-center gap-1"
            >
              ← Volver al inicio
            </Link>
            <BotonCompartir titulo={actividad.titulo} />
          </div>

          {actividad.categoria && (
            <span className="text-xs font-bold text-[#1FA4B6] uppercase tracking-wider bg-[#EBF2E8] px-3 py-1 rounded-lg mb-3 inline-block">
              {actividad.categoria}
            </span>
          )}

          <h1 className="text-3xl sm:text-4xl font-bold text-[#4A3728] font-heading mb-1">
            {actividad.titulo}
          </h1>
          
          {actividad.organizador && (
            <p className="text-xs font-semibold text-[#6B5340] mb-4">
              Por: {actividad.organizador}
            </p>
          )}

          <div className="space-y-6 text-[#4A3728] mt-4">
            {actividad.descripcion && (
              <div className="p-4 bg-[#FAFAF7] border-l-4 border-[#F48C2E] rounded-r-xl text-[#6B5340] italic text-sm sm:text-base leading-relaxed">
                {actividad.descripcion}
              </div>
            )}

            {actividad.descripcion_larga && (
              <div>
                <h2 className="text-xl font-bold text-[#4A3728] font-heading mb-3">
                  Detalles de la actividad
                </h2>
                <div className="whitespace-pre-line leading-relaxed text-[#6B5340] text-sm sm:text-base">
                  {actividad.descripcion_larga}
                </div>
              </div>
            )}

            {/* Enlaces de interés (Wikiloc, restaurantes, descargas...) */}
            {enlacesInteres.length > 0 && (
              <div className="border-t border-[#EBF2E8] pt-6">
                <h2 className="text-lg font-bold text-[#4A3728] font-heading mb-3">
                  Enlaces de interés
                </h2>
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
                        className="flex items-center justify-between p-3.5 bg-[#FAFAF7] hover:bg-[#EBF2E8] border border-[#EBF2E8] rounded-xl font-semibold text-sm text-[#4A3728] hover:text-[#1FA4B6] transition-all group"
                      >
                        <span className="truncate pr-2">🔗 {item.titulo}</span>
                        <span className="text-xs text-[#1FA4B6] font-bold shrink-0">
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
              <div className="bg-[#EBF2E8]/60 p-5 rounded-2xl border border-[#A8C298]/30 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <span className="font-bold text-[#4A3728] text-sm">
                  Información y Reservas:
                </span>
                <div className="flex flex-wrap gap-2 text-sm">
                  {actividad.telefono && (
                    <a
                      href={`tel:${actividad.telefono}`}
                      className="bg-white border border-[#EBF2E8] text-[#1FA4B6] font-bold px-3 py-1.5 rounded-xl hover:bg-[#FAFAF7] transition-colors shadow-xs"
                    >
                      📞 {actividad.telefono}
                    </a>
                  )}
                  {actividad.email && (
                    <a
                      href={`mailto:${actividad.email}`}
                      className="bg-white border border-[#EBF2E8] text-[#1FA4B6] font-bold px-3 py-1.5 rounded-xl hover:bg-[#FAFAF7] transition-colors shadow-xs"
                    >
                      ✉️ {actividad.email}
                    </a>
                  )}
                  {webUrlValida && (
                    <a
                      href={webUrlValida}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#F48C2E] hover:bg-[#E96D27] text-white font-bold px-3.5 py-1.5 rounded-xl transition-colors shadow-xs"
                    >
                      🌐 Web Oficial ↗
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Mapa interactivo */}
            {actividad.latitud && actividad.longitud && (
              <div className="border-t border-[#EBF2E8] pt-6">
                <h2 className="text-lg font-bold text-[#4A3728] font-heading mb-3">
                  Ubicación exacta
                </h2>
                <a
                  href={enlaceGoogleMaps!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative group rounded-2xl overflow-hidden border border-[#EBF2E8]"
                >
                  <iframe
                    width="100%"
                    height="220"
                    frameBorder="0"
                    scrolling="no"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${actividad.longitud - 0.008}%2C${actividad.latitud - 0.005}%2C${actividad.longitud + 0.008}%2C${actividad.latitud + 0.005}&layer=mapnik&marker=${actividad.latitud}%2C${actividad.longitud}`}
                    className="pointer-events-none"
                  ></iframe>
                  <div className="absolute inset-0 bg-[#4A3728]/10 group-hover:bg-[#4A3728]/20 transition-colors flex items-center justify-center">
                    <span className="bg-white text-[#4A3728] font-bold px-4 py-2 rounded-xl shadow-md text-sm">
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