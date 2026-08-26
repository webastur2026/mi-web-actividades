import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import FiltrosYLista from './FiltrosYLista';

export const revalidate = 0;

export default async function HomePage() {
  const { data: actividades } = await supabase
    .from('actividades')
    .select('*')
    .eq('publicado', true)
    .order('created_at', { ascending: false });

  const lista = actividades || [];

  return (
    <main className="min-h-screen py-6 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Cabecera Principal Equilibrada */}
        <header className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EBF2E8] shadow-sm text-center flex flex-col items-center justify-center relative overflow-hidden">
          {/* Adorno sutil de fondo */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#EBF2E8] rounded-full blur-2xl opacity-60 pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#F48C2E]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            {/* Logo de tamaño mediano/proporcionado */}
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 mb-2 drop-shadow-sm transition-transform hover:scale-105 duration-300">
              <Image
                src="/logo.png"
                alt="Logo El Sol y la Mariposa"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Título Principal */}
            <h1 className="text-2xl sm:text-3xl font-bold text-[#4A3728] font-heading tracking-tight">
              El sol y la mariposa
            </h1>
            
            {/* Subtítulo breve */}
            <p className="text-xs sm:text-sm text-[#6B5340] font-medium mt-1 max-w-md">
              Actividades, rutas y experiencias para disfrutar en familia
            </p>
          </div>
        </header>

        {/* Buscador, Filtros y Listado de Actividades */}
        <FiltrosYLista actividadesIniciales={lista} />

      </div>
    </main>
  );
}