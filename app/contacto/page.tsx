import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Contacto - El sol y la mariposa',
  description: 'Ponte en contacto con el equipo de El sol y la mariposa.',
};

export default function ContactoPage() {
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

        {/* Tarjeta de Contacto */}
        <article className="bg-white p-6 sm:p-10 rounded-3xl border border-[#EBF2E8] shadow-sm space-y-6">
          <header className="border-b border-[#EBF2E8] pb-4">
            <h1 className="text-3xl font-bold text-[#4A3728] font-heading">
              Contacto
            </h1>
            <p className="text-sm text-[#6B5340] mt-1">
              ¿Tienes alguna duda, propuesta o sugerencia de actividad? Escríbenos.
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#FAFAF7] p-5 rounded-2xl border border-[#EBF2E8] space-y-2">
              <span className="text-2xl">✉️</span>
              <h3 className="font-bold text-[#4A3728] text-base">Correo Electrónico</h3>
              <p className="text-xs text-[#6B5340]">Para consultas generales o colaboraciones:</p>
              <a 
                href="mailto:info@elsolylamariposa.com" 
                className="inline-block text-sm font-bold text-[#1FA4B6] hover:underline"
              >
                info@elsolylamariposa.com
              </a>
            </div>

            <div className="bg-[#FAFAF7] p-5 rounded-2xl border border-[#EBF2E8] space-y-2">
              <span className="text-2xl">📣</span>
              <h3 className="font-bold text-[#4A3728] text-base">¿Tienes un negocio o evento?</h3>
              <p className="text-xs text-[#6B5340]">
                Si organizas actividades infantiles o familiares, ponte en contacto para incluirlas.
              </p>
            </div>
          </div>
        </article>

      </div>
    </main>
  );
}