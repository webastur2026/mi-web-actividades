import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen py-8 px-4 sm:px-8 bg-[#FAFAF7]">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Cabecera */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#EBF2E8] shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-[#4A3728] font-heading">
              Panel de Administración
            </h1>
            <p className="text-xs text-[#6B5340] mt-1">
              Gestiona el contenido y los avisos de El sol y la mariposa.
            </p>
          </div>
          <Link
            href="/"
            className="text-xs font-bold text-[#1FA4B6] bg-[#EBF2E8] px-4 py-2.5 rounded-xl hover:bg-[#FAFAF7] transition-colors self-start sm:self-auto"
          >
            ← Ir a la web principal
          </Link>
        </div>

        {/* Accesos Rápidos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Tarjeta: Mensajes de Contacto */}
          <Link
            href="/admin/mensajes"
            className="group bg-white p-6 rounded-2xl border border-[#EBF2E8] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl">✉️</span>
              <span className="text-xs font-bold text-[#1FA4B6] bg-[#EBF2E8] px-3 py-1 rounded-lg group-hover:bg-[#1FA4B6] group-hover:text-white transition-colors">
                Ver mensajes ↗
              </span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#4A3728] font-heading">
                Bandeja de Contacto
              </h2>
              <p className="text-xs text-[#6B5340] mt-1">
                Revisa los correos, sugerencias y fotografías que envían las familias desde la web.
              </p>
            </div>
          </Link>

          {/* Tarjeta: Gestión de Actividades */}
          <Link
            href="/admin/nueva"
            className="group bg-white p-6 rounded-2xl border border-[#EBF2E8] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl">🌿</span>
              <span className="text-xs font-bold text-[#F48C2E] bg-[#F48C2E]/10 px-3 py-1 rounded-lg group-hover:bg-[#F48C2E] group-hover:text-white transition-colors">
                Publicar ↗
              </span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#4A3728] font-heading">
                Nueva Actividad
              </h2>
              <p className="text-xs text-[#6B5340] mt-1">
                Añade una nueva ruta, taller o parque comprobado por vosotros.
              </p>
            </div>
          </Link>

        </div>

      </div>
    </main>
  );
}