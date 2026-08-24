import Link from 'next/link';

export const metadata = { title: 'Aviso Legal - El sol y la mariposa' };

export default function AvisoLegalPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl border border-gray-200 shadow-sm text-gray-800 space-y-4">
        <Link href="/" className="text-sm text-blue-600 font-medium hover:underline mb-4 inline-block">← Volver al inicio</Link>
        <h1 className="text-3xl font-bold text-gray-900">Aviso Legal</h1>
        <p className="text-sm text-gray-600">En cumplimiento con el artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSI-CE), se exponen los siguientes datos identificativos del titular de la web:</p>
        
        <h2 className="text-lg font-bold pt-2">1. Datos Identificativos</h2>
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li><strong>Denominación comercial:</strong> El sol y la mariposa</li>
          <li><strong>Titular / Responsable:</strong> [Nombre o Razon Social]</li>
          <li><strong>NIF/CIF:</strong> [Número de NIF/CIF]</li>
          <li><strong>Domicilio:</strong> [Dirección completa / Localidad]</li>
          <li><strong>Correo electrónico:</strong> [Email de contacto]</li>
        </ul>

        <h2 className="text-lg font-bold pt-2">2. Propiedad Intelectual</h2>
        <p className="text-sm">Los contenidos, textos, imágenes y diseño web de "El sol y la mariposa" están protegidos por la legislación sobre propiedad intelectual.</p>
      </div>
    </main>
  );
}