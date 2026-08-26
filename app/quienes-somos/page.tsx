import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Quiénes somos - El sol y la mariposa',
  description: 'Conoce la historia y el proyecto detrás de El sol y la mariposa.',
};

export default function QuienesSomosPage() {
  return (
    <main className="min-h-screen py-6 px-4 sm:px-8 bg-[#FAFAF7]">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Navegación Superior */}
        <nav className="bg-white/90 backdrop-blur-md border border-[#EBF2E8] px-5 py-3 rounded-2xl shadow-sm flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 shrink-0">
              <Image 
                src="/logo.png" 
                alt="Logo El Sol y la Mariposa" 
                fill 
                className="object-contain group-hover:scale-105 transition-transform" 
                priority 
              />
            </div>
            <span className="font-heading font-bold text-sm sm:text-base text-[#4A3728] group-hover:text-[#1FA4B6] transition-colors">
              El sol y la mariposa
            </span>
          </Link>

          <Link
            href="/"
            className="text-xs font-bold text-[#1FA4B6] bg-[#EBF2E8] px-3.5 py-2 rounded-xl hover:bg-[#FAFAF7] transition-colors"
          >
            ← Volver al inicio
          </Link>
        </nav>

        {/* Tarjeta Principal de Contenido */}
        <article className="bg-white p-6 sm:p-10 rounded-3xl border border-[#EBF2E8] shadow-sm space-y-6">
          <header className="border-b border-[#EBF2E8] pb-4">
            <h1 className="text-3xl font-bold text-[#4A3728] font-heading">
              Sobre nosotros
            </h1>
            <p className="text-sm text-[#F48C2E] font-semibold mt-1">
              El mejor ocio para disfrutar con los peques de la casa
            </p>
          </header>

          <div className="space-y-4 text-sm sm:text-base text-[#6B5340] leading-relaxed">
            <p>
              ¡Hola! Bienvenido a <strong>El sol y la mariposa</strong>. Este proyecto nace de la pasión por descubrir y compartir los mejores rincones, rutas y planes para disfrutar en familia.
            </p>

            <div className="p-4 bg-[#FAFAF7] border-l-4 border-[#1FA4B6] rounded-r-xl">
              <p className="italic text-[#4A3728]">
                "Nuestra misión es facilitar a las familias la búsqueda de actividades de calidad, rutas en la naturaleza accesibles y experiencias educativas para los peques."
              </p>
            </div>

            <h2 className="text-xl font-bold text-[#4A3728] font-heading pt-2">
              ¿Qué encontrarás aquí?
            </h2>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <li className="bg-[#FAFAF7] p-3 rounded-xl border border-[#EBF2E8] text-xs sm:text-sm font-medium">
                🌲 <strong>Rutas y Naturaleza:</strong> Sendas sencillas y adaptadas para hacer con niños.
              </li>
              <li className="bg-[#FAFAF7] p-3 rounded-xl border border-[#EBF2E8] text-xs sm:text-sm font-medium">
                🎨 <strong>Talleres y Ocio:</strong> Creatividad, cultura y actividades de fin de semana.
              </li>
              <li className="bg-[#FAFAF7] p-3 rounded-xl border border-[#EBF2E8] text-xs sm:text-sm font-medium">
                📍 <strong>Ubicaciones precisas:</strong> Enlaces directos a mapas y detalles prácticos.
              </li>
              <li className="bg-[#FAFAF7] p-3 rounded-xl border border-[#EBF2E8] text-xs sm:text-sm font-medium">
                🗺️ <strong>Rutas Wikiloc:</strong> Mapas y altimetrías interactivos.
              </li>
            </ul>
          </div>
        </article>

      </div>
    </main>
  );
}