import Link from 'next/link';

export const metadata = { title: 'Política de Privacidad - El sol y la mariposa' };

export default function PoliticaPrivacidadPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl border border-gray-200 shadow-sm text-gray-800 space-y-4">
        <Link href="/" className="text-sm text-blue-600 font-medium hover:underline mb-4 inline-block">← Volver al inicio</Link>
        <h1 className="text-3xl font-bold text-gray-900">Política de Privacidad</h1>
        
        <h2 className="text-lg font-bold pt-2">1. Responsable del Tratamiento</h2>
        <p className="text-sm">El responsable del tratamiento de los datos recabados en este sitio web es <strong>El sol y la mariposa</strong> con contacto en [Email de contacto].</p>

        <h2 className="text-lg font-bold pt-2">2. Finalidad del Tratamiento</h2>
        <p className="text-sm">Los datos facilitados por los usuarios se utilizarán exclusivamente para gestionar las consultas remitidas y ofrecer la información solicitada respecto a las actividades.</p>

        <h2 className="text-lg font-bold pt-2">3. Derechos del Usuario</h2>
        <p className="text-sm">El usuario puede ejercer sus derechos de acceso, rectificación, supresión y oposición enviando un correo electrónico a [Email de contacto].</p>
      </div>
    </main>
  );
}