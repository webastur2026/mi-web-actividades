import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-16 py-8 px-4 text-center text-xs text-gray-500">
      <div className="max-w-6xl mx-auto space-y-4">
        <p className="font-medium text-gray-700">
          El sol y la mariposa — El mejor ocio para disfrutar con los peques de la casa
        </p>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-gray-600">
          <Link href="/quienes-somos" className="hover:text-blue-600 transition-colors">
            Quiénes somos
          </Link>
          <span>•</span>
          <Link href="/contacto" className="hover:text-blue-600 transition-colors">
            Contacto
          </Link>
          <span>•</span>
          <Link href="/aviso-legal" className="hover:text-blue-600 transition-colors">
            Aviso Legal
          </Link>
          <span>•</span>
          <Link href="/politica-de-privacidad" className="hover:text-blue-600 transition-colors">
            Política de Privacidad
          </Link>
          <span>•</span>
          <Link href="/politica-de-cookies" className="hover:text-blue-600 transition-colors">
            Política de Cookies
          </Link>
        </div>
        <p className="text-gray-400">© {year} El sol y la mariposa. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}