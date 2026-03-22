import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/lib/language-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Encuesta SLA - Inestabilidad de Hombro',
  description: 'Encuesta sobre inestabilidad traumática de hombro para ortopedistas - Sociedad Latinoamericana de Artroscopia.',
  openGraph: {
    title: 'Encuesta SLA - Inestabilidad de Hombro',
    description: 'Participe en la encuesta sobre inestabilidad traumática de hombro para ortopedistas de la Sociedad Latinoamericana de Artroscopia.',
    siteName: 'SLA - Sociedad Latinoamericana de Artroscopia',
    images: [
      {
        url: '/logo-artroscopia.jpg',
        width: 1200,
        height: 630,
        alt: 'Sociedad Latinoamericana de Artroscopia',
      },
    ],
    locale: 'es_LA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Encuesta SLA - Inestabilidad de Hombro',
    description: 'Participe en la encuesta sobre inestabilidad traumática de hombro para ortopedistas.',
    images: ['/logo-artroscopia.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} min-h-screen flex flex-col antialiased text-slate-800 relative`}>
        {/* Subtle background watermark */}
        <div 
          className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 flex items-center justify-center bg-center bg-no-repeat bg-contain p-20"
          style={{ backgroundImage: 'url(/logo-sportsmed.jpg)' }}
        />
        
        <LanguageProvider>
          <main className="flex-grow z-10 relative">
            {children}
          </main>
        </LanguageProvider>
        
        <footer className="glass-card border-t border-white/40 mt-12 py-6 z-10 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400 text-sm">
            <p className="font-bold text-slate-600 tracking-wide mb-1">Powered by AGAPAI</p>
            <p className="flex justify-center items-center space-x-2">
              <a href="https://agapai.com.co" target="_blank" rel="noopener noreferrer" className="hover:text-brand-500 transition-colors">
                agapai.com.co
              </a>
              <span className="text-slate-300">|</span>
              <a href="mailto:ablanquicet@agapai.com.co" className="hover:text-brand-500 transition-colors">
                ablanquicet@agapai.com.co
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
