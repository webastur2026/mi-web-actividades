'use client'; 

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Mensaje {
  id: string;
  nombre: string;
  email: string;
  mensaje: string;
  imagenes_urls?: string[];
  created_at: string;
}

export default function AdminMensajesPage() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarMensajes();
  }, []);

  async function cargarMensajes() {
    setCargando(true);
    const { data, error } = await supabase
      .from('mensajes_contacto')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMensajes(data);
    }
    setCargando(false);
  }

  async function borrarMensaje(id: string) {
    if (!confirm('¿Seguro que quieres borrar este mensaje?')) return;

    const { error } = await supabase
      .from('mensajes_contacto')
      .delete()
      .eq('id', id);

    if (!error) {
      setMensajes(mensajes.filter((m) => m.id !== id));
    }
  }

  return (
    <main className="min-h-screen py-8 px-4 sm:px-8 bg-[#FAFAF7]">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Cabecera */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#EBF2E8] shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-[#4A3728] font-heading">
              Bandeja de Contacto
            </h1>
            <p className="text-xs text-[#6B5340] mt-1">
              Mensajes y sugerencias recibidos desde el formulario web.
            </p>
          </div>
          <Link
            href="/admin"
            className="text-xs font-bold text-[#1FA4B6] bg-[#EBF2E8] px-4 py-2.5 rounded-xl hover:bg-[#FAFAF7] transition-colors self-start sm:self-auto"
          >
            ← Volver al Panel Admin
          </Link>
        </div>

        {/* Listado de Mensajes */}
        {cargando ? (
          <div className="text-center py-12 text-[#6B5340] text-sm">
            Cargando mensajes...
          </div>
        ) : mensajes.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-[#EBF2E8] text-[#6B5340] text-sm">
            No tienes ningún mensaje nuevo en la bandeja de entrada.
          </div>
        ) : (
          <div className="space-y-4">
            {mensajes.map((msg) => {
              const fecha = new Date(msg.created_at).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <article
                  key={msg.id}
                  className="bg-white p-6 rounded-2xl border border-[#EBF2E8] shadow-sm space-y-4"
                >
                  {/* Encabezado del mensaje */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#EBF2E8] pb-3 gap-2">
                    <div>
                      <h2 className="font-bold text-[#4A3728] text-base">
                        {msg.nombre}
                      </h2>
                      <a
                        href={`mailto:${msg.email}`}
                        className="text-xs text-[#1FA4B6] hover:underline font-medium"
                      >
                        {msg.email}
                      </a>
                    </div>
                    <span className="text-[11px] text-[#6B5340] font-medium bg-[#FAFAF7] px-3 py-1 rounded-lg border border-[#EBF2E8] self-start sm:self-auto">
                      {fecha}
                    </span>
                  </div>

                  {/* Cuerpo del mensaje */}
                  <p className="text-sm text-[#4A3728] leading-relaxed whitespace-pre-wrap">
                    {msg.mensaje}
                  </p>

                  {/* Fotos adjuntas si existen */}
                  {msg.imagenes_urls && msg.imagenes_urls.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-bold text-[#6B5340]">
                        Imágenes adjuntas ({msg.imagenes_urls.length}):
                      </span>
                      <div className="flex flex-wrap gap-3">
                        {msg.imagenes_urls.map((url, idx) => (
                          <a
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block relative w-20 h-20 rounded-xl overflow-hidden border border-[#EBF2E8] hover:opacity-80 transition-opacity"
                          >
                            <img
                              src={url}
                              alt={`Adjunto ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Acciones */}
                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EBF2E8]">
                    <button
                      onClick={() => borrarMensaje(msg.id)}
                      className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors px-3 py-1.5"
                    >
                      Eliminar
                    </button>
                    <a
                      href={`mailto:${msg.email}?subject=Re: Tu consulta en El sol y la mariposa`}
                      className="bg-[#1FA4B6] text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-[#188897] transition-colors"
                    >
                      ✉️ Responder
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}