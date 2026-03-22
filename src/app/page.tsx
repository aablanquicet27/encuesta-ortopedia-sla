'use client';

import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Activity, ClipboardList, Stethoscope, Globe } from "lucide-react";
import { useLanguage } from '@/lib/language-context';
import { Language } from '@/lib/translations';

const languages = [
  { code: 'es' as Language, name: 'Español', flag: '🇪🇸' },
  { code: 'pt' as Language, name: 'Português', flag: '🇧🇷' },
  { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
];

export default function Home() {
  const { lang, setLang, t } = useLanguage();
  const [showLangSelector, setShowLangSelector] = useState(true);

  if (showLangSelector) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="max-w-md w-full glass-card rounded-3xl shadow-2xl overflow-hidden border border-white/60 p-10">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-brand-400 to-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Globe className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800 mb-2">
              {t.selectLanguage}
            </h2>
          </div>
          
          <div className="space-y-4">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  setLang(language.code);
                  setShowLangSelector(false);
                }}
                className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                  lang === language.code
                    ? 'border-brand-500 bg-brand-50'
                    : 'border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/50'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-3xl mr-4">{language.flag}</span>
                  <span className="text-lg font-semibold text-slate-700">{language.name}</span>
                </div>
                <ArrowRight className={`w-5 h-5 ${lang === language.code ? 'text-brand-500' : 'text-slate-300'}`} />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 sm:p-12">
      {/* Language switcher button */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setShowLangSelector(true)}
          className="flex items-center px-4 py-2 bg-white/80 backdrop-blur rounded-full shadow-md border border-slate-200 hover:bg-white transition-all"
        >
          <Globe className="w-4 h-4 mr-2 text-brand-500" />
          <span className="text-sm font-medium text-slate-700">
            {languages.find(l => l.code === lang)?.flag} {languages.find(l => l.code === lang)?.name}
          </span>
        </button>
      </div>

      <div className="max-w-4xl w-full glass-card rounded-3xl shadow-2xl overflow-hidden border border-white/60">
        <div className="md:flex">
          <div className="md:w-2/5 bg-gradient-to-br from-brand-50 via-purple-50 to-brand-100/50 p-10 flex flex-col items-center justify-center border-r border-white/40">
            <div className="w-48 h-48 relative mb-6 rounded-full overflow-hidden shadow-xl ring-4 ring-white/80">
              <Image 
                src="/logo-artroscopia.jpg" 
                alt={t.homeSubtitle}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
            <h2 className="text-xl font-extrabold text-slate-800 text-center mb-2">
              {t.homeSubtitle}
            </h2>
            <p className="text-sm text-slate-500 text-center font-semibold">
              {t.homeResearch}
            </p>
            
            {/* AGAPAI Logo */}
            <div className="mt-6 pt-6 border-t border-slate-200/60 w-full flex flex-col items-center">
              <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider">Powered by</p>
              <Image 
                src="/logo-agapai.svg" 
                alt="AGAPAI"
                width={120}
                height={36}
              />
            </div>
          </div>
          
          <div className="md:w-3/5 p-8 sm:p-12 flex flex-col justify-center">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-brand-50 to-purple-50 text-brand-600 text-xs font-bold tracking-wider uppercase mb-6 w-max border border-brand-100">
              <Activity className="w-4 h-4 mr-2" />
              {t.homeStudyBadge}
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-brand-700 bg-clip-text text-transparent">
                {t.homeTitle}
              </span>
            </h1>
            
            <div className="space-y-4 text-slate-600 mb-10">
              <p className="flex items-start">
                <span className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <ClipboardList className="w-4 h-4 text-brand-500" />
                </span>
                <span>{t.homeDescription1}</span>
              </p>
              <p className="flex items-start">
                <span className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <Stethoscope className="w-4 h-4 text-emerald-500" />
                </span>
                <span>{t.homeDescription2}</span>
              </p>
            </div>
            
            <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-6 mb-10">
              <h3 className="font-bold text-slate-700 mb-3">{t.homeStructure}</h3>
              <ul className="text-sm text-slate-500 space-y-2">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-400 mr-3"></span>
                  {t.homeStructure1}
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mr-3"></span>
                  {t.homeStructure2}
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-3"></span>
                  {t.homeStructure3}
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mr-3"></span>
                  {t.homeStructure4}
                </li>
              </ul>
            </div>
            
            <Link 
              href="/survey" 
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 rounded-2xl transition-all shadow-lg shadow-brand-200 hover:shadow-xl hover:shadow-brand-300 w-full sm:w-auto group"
            >
              {t.startSurvey}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
