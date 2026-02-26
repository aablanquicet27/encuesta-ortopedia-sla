import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Encuesta SLA - Inestabilidad de Hombro',
  description: 'Encuesta sobre inestabilidad traumática de hombro para ortopedas - Sociedad Latinoamericana de Artroscopia',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} min-h-screen bg-slate-50 flex flex-col antialiased text-slate-800 relative`}>
        {/* Subtle background watermark */}
        <div 
          className="fixed inset-0 pointer-events-none opacity-5 z-0 flex items-center justify-center bg-center bg-no-repeat bg-contain p-20"
          style={{ backgroundImage: 'url(/logo-sportsmed.jpg)' }}
        />
        
        <main className="flex-grow z-10 relative">
          {children}
        </main>
        
        <footer className="bg-white border-t border-slate-200 mt-12 py-6 z-10 relative shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
            <p className="font-semibold text-slate-700 tracking-wide mb-1">Agapai</p>
            <p className="flex justify-center items-center space-x-2">
              <a href="https://agapai.com.co" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-600 transition-colors">
                agapai.com.co
              </a>
              <span className="text-slate-300">|</span>
              <a href="mailto:ablanquicet@agapai.com.co" className="hover:text-cyan-600 transition-colors">
                ablanquicet@agapai.com.co
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
