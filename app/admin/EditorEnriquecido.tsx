'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { useEffect } from 'react';

interface Props {
  content: string;
  onChange: (html: string) => void;
}

export default function EditorEnriquecido({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: content || '',
    editorProps: {
      attributes: {
        class:
          'prose max-w-none p-3.5 min-h-[160px] max-h-[400px] overflow-y-auto bg-[#FAFAF7] rounded-b-xl border border-t-0 border-[#EBF2E8] text-sm text-[#4A3728] focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sincronizar contenido cuando cambia desde fuera (ej: al cargar una actividad para editar)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '');
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const insertEmoji = (emoji: string) => {
    editor.chain().focus().insertContent(emoji).run();
  };

  return (
    <div className="w-full">
      {/* Barra de Herramientas */}
      <div className="flex flex-wrap items-center gap-1.5 p-2 bg-white border border-[#EBF2E8] rounded-t-xl text-xs font-bold text-[#4A3728]">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded-md border ${
            editor.isActive('bold')
              ? 'bg-[#1FA4B6] text-white border-[#1FA4B6]'
              : 'bg-[#FAFAF7] hover:bg-[#EBF2E8] border-[#EBF2E8]'
          }`}
          title="Negrita"
        >
          <strong>B</strong>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded-md border ${
            editor.isActive('italic')
              ? 'bg-[#1FA4B6] text-white border-[#1FA4B6]'
              : 'bg-[#FAFAF7] hover:bg-[#EBF2E8] border-[#EBF2E8]'
          }`}
          title="Cursiva"
        >
          <em>I</em>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-2 py-1 rounded-md border ${
            editor.isActive('underline')
              ? 'bg-[#1FA4B6] text-white border-[#1FA4B6]'
              : 'bg-[#FAFAF7] hover:bg-[#EBF2E8] border-[#EBF2E8]'
          }`}
          title="Subrayado"
        >
          <u>U</u>
        </button>

        <span className="w-px h-5 bg-[#EBF2E8] mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 rounded-md border ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-[#1FA4B6] text-white border-[#1FA4B6]'
              : 'bg-[#FAFAF7] hover:bg-[#EBF2E8] border-[#EBF2E8]'
          }`}
          title="Título H2"
        >
          H2
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-2 py-1 rounded-md border ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-[#1FA4B6] text-white border-[#1FA4B6]'
              : 'bg-[#FAFAF7] hover:bg-[#EBF2E8] border-[#EBF2E8]'
          }`}
          title="Título H3"
        >
          H3
        </button>

        <span className="w-px h-5 bg-[#EBF2E8] mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 rounded-md border ${
            editor.isActive('bulletList')
              ? 'bg-[#1FA4B6] text-white border-[#1FA4B6]'
              : 'bg-[#FAFAF7] hover:bg-[#EBF2E8] border-[#EBF2E8]'
          }`}
          title="Lista con viñetas"
        >
          • Lista
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 rounded-md border ${
            editor.isActive('orderedList')
              ? 'bg-[#1FA4B6] text-white border-[#1FA4B6]'
              : 'bg-[#FAFAF7] hover:bg-[#EBF2E8] border-[#EBF2E8]'
          }`}
          title="Lista numerada"
        >
          1. Lista
        </button>

        <span className="w-px h-5 bg-[#EBF2E8] mx-1" />

        {/* Acceso rápido a emoticonos frecuentes */}
        <div className="flex items-center gap-1 bg-[#FAFAF7] px-2 py-0.5 rounded-md border border-[#EBF2E8]">
          <span className="text-[10px] text-[#6B5340] mr-1">Emojis:</span>
          {['☀️', '🦋', '🌲', '🎒', '📍', '👶', '⭐', '💡', '⚠️'].map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => insertEmoji(emoji)}
              className="hover:scale-125 transition-transform text-sm"
              title={`Insertar ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Área donde se escribe */}
      <EditorContent editor={editor} />
    </div>
  );
}