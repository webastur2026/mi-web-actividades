import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import ListaActividades from './ListaActividades';

export const revalidate = 0;

export default async function HomePage() {
  const { data: actividades } = await supabase
    .from('actividades')
    .select('*')
    .eq('publicado', true)
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen py-8 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado Principal con Logo */}
        <header className="mb-10 text-center flex flex-col items-center">
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 mb-4 drop-shadow-sm hover:scale-105 transition-transform duration-300">
            <Image
              src="/logo.png"
              alt="Logo El Sol y la Mariposa"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-[#4A3728] font-heading tracking-tight">
            El sol y la mariposa
          </h1>
          <p className="mt-2 text-base sm:text-lg text-[#6B5340] max-w-xl font-medium">
            El mejor ocio para disfrutar con los peques de la casa
          </p>
          <div className="w-24 h-1 bg-[#F48C2E] rounded-full mt-4"></div>
        </header>

        {/* Buscador y Listado Filtrable */}
        <ListaActividades actividadesIniciales={actividades || []} />
      </div>
    </main>
  );
}