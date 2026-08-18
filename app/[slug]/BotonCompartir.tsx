'use client';

import { useState } from 'react';

interface Props {
  titulo: string;
}

export default function BotonCompartir({ titulo }: Props) {
  const [copiado, setCopiado] = useState(false);

  const handleCompartir = async () => {
    const url = window.location.href;

    // Si el navegador soporta Web Share API (móviles y navegadores modernos)
    if (navigator.share) {
      try {
        await navigator.share({
          title: titulo,
          text: `Echa un vistazo a esta actividad: ${titulo}`,
          url: url,
        });
      } catch {
        // El usuario canceló o no se pudo compartir
      }
    } else {
      // Fallback: copiar al portapapeles
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 3000);
    }
  };

  const urlWhatsapp = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `Mira esta actividad: ${titulo} -> `
  )}${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}`;

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <button
        onClick={handleCompartir}
        className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
      >
        🔗 {copiado ? '¡Enlace copiado!' : 'Compartir'}
      </button>

      <a
        href={urlWhatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
      >
        💬 WhatsApp
      </a>
    </div>
  );
}