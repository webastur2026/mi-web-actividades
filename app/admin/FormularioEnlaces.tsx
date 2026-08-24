'use client';

export interface EnlaceInteres {
  titulo: string;
  url: string;
}

interface Props {
  enlaces: EnlaceInteres[];
  onChange: (enlaces: EnlaceInteres[]) => void;
}

export default function FormularioEnlaces({ enlaces, onChange }: Props) {
  const agregarEnlace = () => {
    onChange([...enlaces, { titulo: '', url: '' }]);
  };

  const actualizarEnlace = (index: number, campo: 'titulo' | 'url', valor: string) => {
    const nuevos = [...enlaces];
    nuevos[index][campo] = valor;
    onChange(nuevos);
  };

  const eliminarEnlace = (index: number) => {
    onChange(enlaces.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-semibold text-gray-700">
          Enlaces de interés (Wikiloc, dónde comer, etc.)
        </label>
        <button
          type="button"
          onClick={agregarEnlace}
          className="text-xs bg-blue-50 text-blue-600 font-bold px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors"
        >
          + Añadir enlace
        </button>
      </div>

      {enlaces.length === 0 ? (
        <p className="text-xs text-gray-400 italic bg-gray-50 p-3 rounded-lg border border-dashed border-gray-200">
          No hay enlaces añadidos. Haz clic en "+ Añadir enlace" para agregar uno.
        </p>
      ) : (
        <div className="space-y-2">
          {enlaces.map((enlace, i) => (
            <div key={i} className="flex flex-col sm:flex-row gap-2 items-center bg-gray-50 p-2.5 rounded-lg border border-gray-200">
              <input
                type="text"
                placeholder="Título (ej: Ruta en Wikiloc, Restaurante...)"
                value={enlace.titulo}
                onChange={(e) => actualizarEnlace(i, 'titulo', e.target.value)}
                className="w-full sm:w-1/2 text-sm border border-gray-300 rounded-md p-2 text-black outline-none focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="URL (ej: https://wikiloc.com/...)"
                value={enlace.url}
                onChange={(e) => actualizarEnlace(i, 'url', e.target.value)}
                className="w-full sm:w-1/2 text-sm border border-gray-300 rounded-md p-2 text-black outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => eliminarEnlace(i)}
                className="text-red-600 hover:text-red-800 p-2 text-xs font-bold"
                title="Eliminar enlace"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}