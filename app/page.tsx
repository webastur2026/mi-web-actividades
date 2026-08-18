import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export const revalidate = 0; // Para que recargue datos frescos siempre

export default async function HomePage() {
  const { data: actividades } = await supabase
    .from('actividades')
    .select('*')
    .eq('publicado', true)
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
            Actividades y Planes
          </h1>
          <p className="text-lg text-gray-600">
            Descubre las mejores experiencias e itinerarios.
          </p>
        </header>

        {!actividades || actividades.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-500">Aún no hay actividades publicadas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {actividades.map((actividad) => {
              // Si tiene array de imágenes usamos la primera, si no la imagen de portada
              const imagenMostrar = 
                (actividad.imagenes && actividad.imagenes.length > 0)
                  ? actividad.imagenes[0]
                  : actividad.imagen_url;

              return (
                <Link
                  key={actividad.id}
                  href={`/${actividad.slug}`}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200 flex flex-col"
                >
                  {imagenMostrar ? (
                    <img
                      src={imagenMostrar}
                      alt={actividad.titulo}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                      Sin imagen
                    </div>
                  )}

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {actividad.ubicacion_nombre && (
                        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block mb-1">
                          📍 {actividad.ubicacion_nombre}
                        </span>
                      )}
                      <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {actividad.titulo}
                      </h2>
                      {actividad.descripcion && (
                        <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                          {actividad.descripcion}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
                      <span>
                        {actividad.edad_minima || actividad.edad_maxima
                          ? `Edad: ${actividad.edad_minima || 0} - ${actividad.edad_maxima || 'sin límite'}`
                          : 'Todas las edades'}
                      </span>
                      <span className="text-gray-900 font-semibold">
                        {actividad.precio || 'Gratis / A consultar'}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}