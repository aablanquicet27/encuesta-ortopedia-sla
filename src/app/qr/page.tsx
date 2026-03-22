'use client';

import Image from 'next/image';
import { useLanguage } from '@/lib/language-context';
import { QrCode, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function QRPage() {
  const { lang } = useLanguage();

  const translations = {
    es: {
      title: 'Encuesta de Ortopedia',
      subtitle: 'Consenso sobre Inestabilidad Traumática de Hombro',
      scanQR: 'Escanea el código QR para participar',
      orVisit: 'O visita',
      startSurvey: 'Iniciar Encuesta',
      poweredBy: 'Powered by',
    },
    pt: {
      title: 'Pesquisa de Ortopedia',
      subtitle: 'Consenso sobre Instabilidade Traumática do Ombro',
      scanQR: 'Escaneie o código QR para participar',
      orVisit: 'Ou visite',
      startSurvey: 'Iniciar Pesquisa',
      poweredBy: 'Powered by',
    },
    en: {
      title: 'Orthopedics Survey',
      subtitle: 'Consensus on Traumatic Shoulder Instability',
      scanQR: 'Scan the QR code to participate',
      orVisit: 'Or visit',
      startSurvey: 'Start Survey',
      poweredBy: 'Powered by',
    },
  };

  const t = translations[lang];

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 sm:p-12">
      <div className="max-w-lg w-full glass-card rounded-3xl shadow-2xl overflow-hidden border border-white/60 p-8 sm:p-12 text-center">
        {/* Logo SLA */}
        <div className="w-24 h-24 relative mb-6 rounded-full overflow-hidden shadow-xl ring-4 ring-white/80 mx-auto">
          <Image 
            src="/logo-artroscopia.jpg" 
            alt="Sociedad Latinoamericana de Artroscopia"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-2">
          {t.title}
        </h1>
        <p className="text-slate-500 mb-8">
          {t.subtitle}
        </p>

        {/* QR Code */}
        <div className="bg-white p-6 rounded-2xl shadow-lg inline-block mb-6">
          <Image
            src="/qr-encuesta.png"
            alt="QR Code"
            width={200}
            height={200}
            className="mx-auto"
          />
        </div>

        <p className="text-slate-600 font-medium mb-2">
          {t.scanQR}
        </p>

        <p className="text-slate-400 text-sm mb-6">
          {t.orVisit}: <span className="text-brand-600 font-bold">encuesta.agapai.com.co</span>
        </p>

        <Link
          href="/survey"
          className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 rounded-2xl transition-all shadow-lg shadow-brand-200 hover:shadow-xl hover:shadow-brand-300 group"
        >
          {t.startSurvey}
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>

        {/* AGAPAI Logo */}
        <div className="mt-8 pt-6 border-t border-slate-200/60">
          <p className="text-xs text-slate-400 mb-2">{t.poweredBy}</p>
          <Image 
            src="/logo-agapai.png" 
            alt="AGAPAI"
            width={100}
            height={33}
            className="mx-auto"
          />
        </div>
      </div>
    </div>
  );
}
