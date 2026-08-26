'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export default function ContactoPage() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [archivos, setArchivos] = useState<FileList | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setErrorMsg('');

    try {
      const imagenesUrls: string[] = [];

      // Subida de archivos a Supabase Storage
      if (archivos && archivos.length > 0) {
        for (let i = 0; i < archivos.length; i++) {
          const file = archivos[i];
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
          const filePath = `mensajes/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('contacto_adjuntos')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: publicUrlData } = supabase.storage
            .from('contacto_adjuntos')
            .getPublicUrl(filePath);

          if (publicUrlData?.publicUrl) {
            imagenesUrls.push(publicUrlData.publicUrl);
          }
        }
      }

      // Guardar el registro en la base de datos
      const { error: insertError } = await supabase
        .from('mensajes_contacto')
        .insert([
          {
            nombre,
            email,
            mensaje,
            imagenes_urls: imagenesUrls,
          },
        ]);

      if (insertError) throw insertError;

      setExito(true);
      setNombre('');
      setEmail('');
      setMensaje('');
      setArchivos(null);
    } catch (err: any) {
      setErrorMsg('Error al enviar el mensaje. Inténtalo de nuevo.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="min-h-screen py-6 px-4 sm:px-8 bg-[#FAFAF7]">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Navegación Superior */}
        <nav className="bg-white border border-[#EBF2E8] px-5 py-3 rounded-2xl shadow-sm flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative w-8 h-8">
              <Image src="/logo.png" alt="Logo" fill className="object-contain" priority />
            </div>
            <span className="font-heading font-bold text-sm text-[#4A3728]">
              El sol y la mariposa
            </span>
          </Link>
          <Link href="/" className="text-xs font-bold text-[#1FA4B6] bg-[#EBF2E8] px-3.5 py-2 rounded-xl hover:bg-[#FAFAF7] transition-colors">
            ← Volver al inicio
          </Link>
        </nav>

        {/* Contenido y Formulario */}
        <article className="bg-white p-6 sm:p-10 rounded-3xl border border-[#EBF2E8] shadow-sm space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#4A3728] font-heading">
              Contacto
            </h1>
            <p className="text-sm text-[#6B5340] mt-2">
              ¿Tienes alguna propuesta, quieres sugerir una actividad o has notado algún cambio en nuestros planes? Escríbenos y envíanos tus fotos.
            </p>
          </div>

          {exito ? (
            <div className="p-4 bg-[#EBF2E8] border border-[#1FA4B6] text-[#4A3728] rounded-2xl text-sm font-medium">
              ¡Gracias por escribirnos! Hemos recibido tu mensaje correctamente.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-600 border border-red-200 text-xs rounded-xl font-medium">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="nombre" className="text-xs font-bold text-[#4A3728]">Tu nombre</label>
                  <input
                    type="text"
                    id="nombre"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full p-3 bg-[#FAFAF7] border border-[#EBF2E8] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1FA4B6]"
                    placeholder="Ej. Laura"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="email" className="text-xs font-bold text-[#4A3728]">Tu email</label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-[#FAFAF7] border border-[#EBF2E8] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1FA4B6]"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="mensaje" className="text-xs font-bold text-[#4A3728]">Mensaje</label>
                <textarea
                  id="mensaje"
                  rows={4}
                  required
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  className="w-full p-3 bg-[#FAFAF7] border border-[#EBF2E8] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1FA4B6]"
                  placeholder="Cuéntanos..."
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="adjunto" className="text-xs font-bold text-[#4A3728]">Adjuntar imágenes (opcional)</label>
                <input
                  type="file"
                  id="adjunto"
                  accept="image/*"
                  multiple
                  onChange={(e) => setArchivos(e.target.files)}
                  className="w-full text-sm text-[#6B5340] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#EBF2E8] file:text-[#1FA4B6] hover:file:bg-[#FAFAF7] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={enviando}
                className="w-full sm:w-auto bg-[#1FA4B6] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-sm hover:bg-[#188897] transition-colors disabled:opacity-50"
              >
                {enviando ? 'Enviando...' : 'Enviar mensaje'}
              </button>
            </form>
          )}
        </article>

      </div>
    </main>
  );
}