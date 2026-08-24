import type { Metadata } from 'next';
import './globals.css';
import Footer from './Footer';

export const metadata: Metadata = {
  title: 'El sol y la mariposa',
  description: 'El mejor ocio para disfrutar con los peques de la casa',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="flex flex-col min-h-screen">
        <div className="flex-grow">{children}</div>
        <Footer />
      </body>
    </html>
  );
}