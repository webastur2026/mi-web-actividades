import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ActividadDetallePage({ params }: Props) {
  const { slug } = await params;

  const { data: actividad } = await supabase
    .from('actividades')
    .select('*')
    .eq('slug', slug)
    .eq('publicado', true)
    .single();

  if (!actividad) {
    notFound();
  }

  // Generar enlace a Google Maps si existen coordenadas
  const enlaceGoogleMaps =
    actividad.latitud && actividad.longitud
      ? `https://www.google.com/maps/search/?api=1&query=${actividad.latitud},${actividad.longitud}`
      : null;

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <Link
          href="/"
          className="text-sm text-blue-600 hover:underline mb-6 inline-block font-medium"
        >
          ← Volver al listado
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {actividad.titulo}
        </h1>

        {actividad.ubicacion_nombre && (
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-6">
            📍 {actividad.ubicacion_nombre}
          </p>
        )}

        <div className="space-y-6 text-gray-700">
          {actividad.descripcion && (
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-2">Descripción</h2>
              <p className="whitespace-pre-line leading-relaxed">{actividad.descripcion}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div>
              <span className="block text-xs font-semibold text-gray-500 uppercase">Edad recomendada</span>
              <span className="font-medium">
                {actividad.edad_minima || actividad.edad_maxima
                  ? `${actividad.edad_minima || 0} - ${actividad.edad_maxima || 'sin límite'} años`
                  : 'Todas las edades'}
              </span>
            </div>

            <div>
              <span className="block text-xs font-semibold text-gray-500 uppercase">Precio</span>
              <span className="font-medium">{actividad.precio || 'Consulte precio'}</span>
            </div>
          </div>

          {(actividad.direccion || actividad.como_llegar || enlaceGoogleMaps) && (
            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-lg font-bold text-gray-800 mb-3">Ubicación y Cómo Llegar</h2>
              
              {actividad.direccion && (
                <p className="mb-2">
                  <strong>Dirección:</strong> {actividad.direccion}
                </p>
              )}

              {actividad.como_llegar && (
                <p className="mb-4">
                  <strong>Indicaciones:</strong> {actividad.como_llegar}
                </p>
              )}

              {enlaceGoogleMaps && (
                <a
                  href={enlaceGoogleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  📍 Abrir ubicación en Google Maps
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}