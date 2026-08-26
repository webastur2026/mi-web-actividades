import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Quiénes somos - El sol y la mariposa',
};

export default function QuienesSomosPage() {
  return (
    <main className="min-h-screen py-6 px-4 sm:px-8 bg-[#FAFAF7]">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Navegación Superior */}
        <nav className="bg-white border border-[#EBF2E8] px-5 py-3 rounded-2xl shadow-sm flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative w-8 h-8">
              <Image src="/logo.png" alt="Logo" fill className="object-contain" priority />
            </div>
            <span className="font-heading font-bold text-sm text-[#4A3728]">
              El sol y la mariposa
            </span>
          </Link>
          <Link href="/" className="text-xs font-bold text-[#1FA4B6] bg-[#EBF2E8] px-3.5 py-2 rounded-xl">
            ← Volver al inicio
          </Link>
        </nav>

        {/* Contenido */}
        <article className="bg-white p-6 sm:p-10 rounded-3xl border border-[#EBF2E8] shadow-sm space-y-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#4A3728] font-heading">
            Sobre nosotros
          </h1>
          
          <div className="space-y-4 text-sm text-[#6B5340] leading-relaxed">
            <p>
              Bienvenidos a <strong>El sol y la mariposa</strong>. Este espacio nace de una necesidad muy real y de una frustración que probablemente compartas: llegar a un plan supuestamente "ideal para toda la familia" y descubrir que no era apto para ir con los peques.
            </p>
            
            <div className="p-4 bg-[#FAFAF7] border-l-4 border-[#1FA4B6] rounded-r-xl text-[#4A3728] font-medium">
              Por eso, nuestro compromiso es claro: todas las rutas, talleres y actividades que publicamos aquí están previamente comprobadas y realizadas por nosotros.
            </div>

            <p>
              Queremos ayudarte a encontrar fácilmente planes de calidad y sin sorpresas desagradables. Aún así, la naturaleza y los negocios cambian. Te agradecemos enormemente que, si visitas un lugar y notas alguna modificación (un sendero cerrado, un cambio de horario o cualquier error), nos lo comuniques para mantener la web siempre actualizada y seguir ayudando a otras familias.
            </p>
          </div>
        </article>

      </div>
    </main>
  );
}