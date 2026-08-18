export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-50 flex flex-col items-center justify-center">
      <div className="text-center max-w-lg bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Panel de Actividades
        </h1>
        <p className="text-gray-600 mb-6">
          El sitio web está configurado y conectado con Supabase.
        </p>
        <a
          href="/admin/nueva-actividad"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors cursor-pointer"
        >
          Ir al Formulario de Nueva Actividad
        </a>
      </div>
    </main>
  );
}