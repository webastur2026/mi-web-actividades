import type { Metadata } from 'next';
import { Fredoka, Nunito } from 'next/font/google';
import './globals.css';
import Footer from './Footer';

const fredoka = Fredoka({ 
  subsets: ['latin'],
  variable: '--font-fredoka',
  weight: ['400', '600', '700']
});

const nunito = Nunito({ 
  subsets: ['latin'],
  variable: '--font-nunito',
  weight: ['400', '600', '700']
});

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
    <html lang="es" className={`${fredoka.variable} ${nunito.variable}`}>
      <body className="flex flex-col min-h-screen bg-[#FAFAF7] text-[#4A3728] font-sans antialiased">
        <div className="flex-grow">{children}</div>
        <Footer />
      </body>
    </html>
  );
}