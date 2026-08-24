import Link from 'next/link';

export const metadata = { title: 'Política de Cookies - El sol y la mariposa' };

export default function PoliticaCookiesPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl border border-gray-200 shadow-sm text-gray-800 space-y-4">
        <Link href="/" className="text-sm text-blue-600 font-medium hover:underline mb-4 inline-block">← Volver al inicio</Link>
        <h1 className="text-3xl font-bold text-gray-900">Política de Cookies</h1>
        <p className="text-sm">Esta web utiliza únicamente cookies técnicas estrictamente necesarias para el funcionamiento del sitio y la autenticación del panel de administración.</p>

        <h2 className="text-lg font-bold pt-2">1. ¿Qué son las cookies?</h2>
        <p className="text-sm">Una cookie es un pequeño fichero de texto que se almacena en su navegador cuando visita casi cualquier página web.</p>

        <h2 className="text-lg font-bold pt-2">2. Desactivación de cookies</h2>
        <p className="text-sm">Usted puede restringir, bloquear o borrar las cookies de este sitio web utilizando la configuración de su navegador.</p>
      </div>
    </main>
  );
}