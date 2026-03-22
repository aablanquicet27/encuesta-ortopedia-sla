'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { surveyDomains, getQuestionText, getDomainTitle } from '@/lib/questions';
import { getLikertScale } from '@/lib/translations';
import { useLanguage } from '@/lib/language-context';
import { CheckCircle2, ChevronRight, ChevronLeft, AlertCircle, Loader2, Sparkles, Shield, Database, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language } from '@/lib/translations';

const LIKERT_COLORS = [
  {
    base: 'border-brand-200 bg-brand-50/50',
    selected: 'border-brand-500 bg-brand-500 text-white shadow-lg shadow-brand-200',
    number: 'text-brand-400',
    numberSelected: 'text-white',
    hover: 'hover:border-brand-300 hover:bg-brand-50',
    ring: 'ring-brand-200',
  },
  {
    base: 'border-orange-200 bg-orange-50/50',
    selected: 'border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-200',
    number: 'text-orange-400',
    numberSelected: 'text-white',
    hover: 'hover:border-orange-300 hover:bg-orange-50',
    ring: 'ring-orange-200',
  },
  {
    base: 'border-amber-200 bg-amber-50/50',
    selected: 'border-amber-500 bg-amber-500 text-white shadow-lg shadow-amber-200',
    number: 'text-amber-400',
    numberSelected: 'text-white',
    hover: 'hover:border-amber-300 hover:bg-amber-50',
    ring: 'ring-amber-200',
  },
  {
    base: 'border-emerald-200 bg-emerald-50/50',
    selected: 'border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-200',
    number: 'text-emerald-400',
    numberSelected: 'text-white',
    hover: 'hover:border-emerald-300 hover:bg-emerald-50',
    ring: 'ring-emerald-200',
  },
  {
    base: 'border-teal-200 bg-teal-50/50',
    selected: 'border-teal-500 bg-teal-500 text-white shadow-lg shadow-teal-200',
    number: 'text-teal-400',
    numberSelected: 'text-white',
    hover: 'hover:border-teal-300 hover:bg-teal-50',
    ring: 'ring-teal-200',
  },
];

const languages = [
  { code: 'es' as Language, name: 'Español', flag: '🇪🇸' },
  { code: 'pt' as Language, name: 'Português', flag: '🇧🇷' },
  { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
];

export default function SurveyPage() {
  const router = useRouter();
  const { lang, setLang, t } = useLanguage();
  const [step, setStep] = useState(-1); // -1 = consent, 0 = demographics, 1+ = domains
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [direction, setDirection] = useState(1);
  const [justSelected, setJustSelected] = useState<string | null>(null);
  
  // Consent state
  const [consentAgapai, setConsentAgapai] = useState(false);
  const [consentData, setConsentData] = useState(false);

  // Form State
  const [participant, setParticipant] = useState({
    name: '',
    age: '',
    country: '',
    specialty: '',
    experience_years: ''
  });

  const [responses, setResponses] = useState<Record<string, number>>({});

  const likertScale = getLikertScale(lang);
  const totalSteps = surveyDomains.length + 2; // consent + demographics + domains
  const progress = ((step + 1) / totalSteps) * 100;

  const isParticipantValid = 
    participant.name.trim() !== '' &&
    participant.age !== '' &&
    participant.country.trim() !== '' &&
    participant.specialty.trim() !== '' &&
    participant.experience_years !== '';

  const isConsentValid = consentAgapai && consentData;

  const handleSelectResponse = useCallback((questionId: string, value: number) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
    setJustSelected(questionId);
    setTimeout(() => setJustSelected(null), 400);
  }, []);

  const handleNextDomain = () => {
    if (step === -1) {
      if (!isConsentValid) {
        setError(t.consentAccept);
        return;
      }
    }
    if (step > 0 && step <= surveyDomains.length) {
      const currentDomain = surveyDomains[step - 1];
      const allAnswered = currentDomain.questions.every(q => responses[q.id] !== undefined);
      if (!allAnswered) {
        setError(t.pleaseAnswer);
        return;
      }
    }
    setError(null);
    setDirection(1);
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setError(null);
    setDirection(-1);
    setStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const totalQuestions = surveyDomains.reduce((acc, curr) => acc + curr.questions.length, 0);
      if (Object.keys(responses).length !== totalQuestions) {
        throw new Error('Faltan preguntas por responder.');
      }

      const { data: pData, error: pError } = await supabase
        .from('ortopedas_participants')
        .insert([{
          name: participant.name,
          age: parseInt(participant.age),
          country: participant.country,
          specialty: participant.specialty,
          experience_years: parseInt(participant.experience_years),
          language: lang,
        }])
        .select('id')
        .single();

      if (pError) throw pError;
      if (!pData) throw new Error('Error al guardar datos del participante');

      const formattedResponses: Record<string, any> = { participant_id: pData.id };
      for (const [key, value] of Object.entries(responses)) {
        formattedResponses[key] = value;
      }

      const { error: rError } = await supabase
        .from('ortopedas_responses')
        .insert([formattedResponses]);

      if (rError) throw rError;

      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocurrió un error al enviar la encuesta. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const pageVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
    }),
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.4,
        ease: 'easeOut' as const,
      },
    }),
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="glass-card p-12 rounded-3xl shadow-2xl border border-white/60 max-w-lg w-full text-center space-y-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-200"
          >
            <CheckCircle2 className="w-14 h-14 text-white" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-extrabold bg-gradient-to-r from-brand-600 to-vivid-600 bg-clip-text text-transparent"
          >
            {t.thankYou}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-slate-600 text-lg leading-relaxed"
          >
            {t.successMessage}
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/')}
            className="mt-6 px-10 py-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold rounded-2xl hover:from-brand-600 hover:to-brand-700 transition-all shadow-lg shadow-brand-200 inline-block text-lg"
          >
            {t.backToHome}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Language switcher */}
      <div className="absolute top-4 right-4 z-20">
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as Language)}
          className="px-4 py-2 bg-white/80 backdrop-blur rounded-full shadow-md border border-slate-200 text-sm font-medium text-slate-700 cursor-pointer"
        >
          {languages.map(l => (
            <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
          ))}
        </select>
      </div>

      <div className="glass-card rounded-3xl shadow-2xl overflow-hidden border border-white/60">
        
        {/* Header with Progress */}
        <div className="px-8 py-6 sm:px-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-extrabold text-slate-800 text-xl">
                {step === -1 ? t.consentTitle : step === 0 ? t.demographics : getDomainTitle(surveyDomains[step - 1], lang)}
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                {step === -1 ? '' : step === 0 ? t.participantInfo : `${t.section} ${step} ${t.of} ${surveyDomains.length}`}
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold bg-gradient-to-r from-brand-500 to-vivid-500 bg-clip-text text-transparent">
                {Math.round(Math.max(0, progress))}%
              </span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full progress-gradient"
              initial={false}
              animate={{ width: `${Math.max(progress, 2)}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </div>

          {/* Step indicators */}
          <div className="flex justify-between mt-3">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i === step + 1
                      ? 'bg-brand-500 ring-4 ring-brand-100 scale-125'
                      : i < step + 1
                        ? 'bg-brand-400'
                        : 'bg-slate-200'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="px-8 pb-10 sm:px-10">
          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 flex items-start overflow-hidden"
              >
                <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                <p className="font-medium">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait" custom={direction}>
            {/* Consent Step */}
            {step === -1 && (
              <motion.div
                key="consent"
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="space-y-8"
              >
                {/* AGAPAI Logo and branding */}
                <div className="text-center pb-6 border-b border-slate-100">
                  <Image
                    src="/logo-agapai.svg"
                    alt="AGAPAI"
                    width={150}
                    height={45}
                    className="mx-auto mb-4"
                  />
                  <p className="text-sm text-slate-500">Tecnología para la investigación médica</p>
                </div>

                {/* Consent: AGAPAI authorization */}
                <div className="p-6 rounded-2xl border-2 border-slate-100 bg-white/80">
                  <div className="flex items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mr-4 flex-shrink-0">
                      <Shield className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 mb-2">{t.consentAgapai}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {t.consentAgapaiText}
                      </p>
                    </div>
                  </div>
                  <label className="flex items-center cursor-pointer mt-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={consentAgapai}
                      onChange={(e) => setConsentAgapai(e.target.checked)}
                      className="w-5 h-5 rounded border-slate-300 text-brand-500 focus:ring-brand-500"
                    />
                    <span className="ml-3 text-sm font-medium text-slate-700">{t.consentAccept}</span>
                  </label>
                </div>

                {/* Consent: Data treatment */}
                <div className="p-6 rounded-2xl border-2 border-slate-100 bg-white/80">
                  <div className="flex items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mr-4 flex-shrink-0">
                      <Database className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 mb-2">{t.consentData}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {t.consentDataText}
                      </p>
                    </div>
                  </div>
                  <label className="flex items-center cursor-pointer mt-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={consentData}
                      onChange={(e) => setConsentData(e.target.checked)}
                      className="w-5 h-5 rounded border-slate-300 text-brand-500 focus:ring-brand-500"
                    />
                    <span className="ml-3 text-sm font-medium text-slate-700">{t.consentAccept}</span>
                  </label>
                </div>

                <div className="pt-4 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02, x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNextDomain}
                    disabled={!isConsentValid}
                    className="px-10 py-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center transition-all shadow-lg shadow-brand-200 hover:shadow-xl hover:shadow-brand-300 text-lg"
                  >
                    {t.consentContinue}
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Demographics Step */}
            {step === 0 && (
              <motion.div
                key="demographics"
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="space-y-6"
              >
                <p className="text-slate-500 mb-8 pb-4 border-b border-slate-100/80 text-lg">
                  {t.demographicsDescription}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">{t.fullName}</label>
                    <input 
                      type="text" 
                      value={participant.name}
                      onChange={(e) => setParticipant({...participant, name: e.target.value})}
                      className="input-modern w-full px-5 py-3.5 rounded-xl border-2 border-slate-200 bg-white/80 focus:bg-white outline-none text-slate-800 placeholder-slate-300 font-medium"
                      placeholder={t.fullNamePlaceholder}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">{t.age}</label>
                    <input 
                      type="number" 
                      value={participant.age}
                      onChange={(e) => setParticipant({...participant, age: e.target.value})}
                      className="input-modern w-full px-5 py-3.5 rounded-xl border-2 border-slate-200 bg-white/80 focus:bg-white outline-none text-slate-800 placeholder-slate-300 font-medium"
                      placeholder={t.agePlaceholder}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">{t.country}</label>
                    <input 
                      type="text" 
                      value={participant.country}
                      onChange={(e) => setParticipant({...participant, country: e.target.value})}
                      className="input-modern w-full px-5 py-3.5 rounded-xl border-2 border-slate-200 bg-white/80 focus:bg-white outline-none text-slate-800 placeholder-slate-300 font-medium"
                      placeholder={t.countryPlaceholder}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">{t.specialty}</label>
                    <input 
                      type="text" 
                      value={participant.specialty}
                      onChange={(e) => setParticipant({...participant, specialty: e.target.value})}
                      className="input-modern w-full px-5 py-3.5 rounded-xl border-2 border-slate-200 bg-white/80 focus:bg-white outline-none text-slate-800 placeholder-slate-300 font-medium"
                      placeholder={t.specialtyPlaceholder}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">{t.experienceYears}</label>
                    <input 
                      type="number" 
                      value={participant.experience_years}
                      onChange={(e) => setParticipant({...participant, experience_years: e.target.value})}
                      className="input-modern w-full px-5 py-3.5 rounded-xl border-2 border-slate-200 bg-white/80 focus:bg-white outline-none text-slate-800 placeholder-slate-300 font-medium"
                      placeholder={t.experienceYearsPlaceholder}
                    />
                  </div>
                </div>

                <div className="pt-8 flex justify-between">
                  <motion.button
                    whileHover={{ scale: 1.02, x: -3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBack}
                    className="px-6 py-3.5 text-slate-500 font-bold hover:text-slate-700 hover:bg-white/60 rounded-xl transition-all flex items-center"
                  >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    {t.previous}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02, x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNextDomain}
                    disabled={!isParticipantValid}
                    className="px-10 py-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center transition-all shadow-lg shadow-brand-200 hover:shadow-xl hover:shadow-brand-300 text-lg"
                  >
                    {t.nextSection}
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Domain Steps */}
            {step > 0 && step <= surveyDomains.length && (
              <motion.div
                key={`domain-${step}`}
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                <div className="mb-8">
                  <p className="text-slate-500 text-lg">
                    {t.indicateAgreement}
                  </p>
                </div>

                {/* Scale legend */}
                <div className="mb-8 flex items-center justify-between px-2 py-3 bg-slate-50/80 rounded-xl border border-slate-100">
                  <span className="text-xs font-bold text-brand-500 uppercase tracking-wide">1 = {t.totallyDisagree}</span>
                  <div className="hidden sm:flex items-center gap-1.5">
                    {[1,2,3,4,5].map(n => (
                      <div key={n} className={`w-3 h-3 rounded-full ${
                        n === 1 ? 'bg-brand-400' : n === 2 ? 'bg-orange-400' : n === 3 ? 'bg-amber-400' : n === 4 ? 'bg-emerald-400' : 'bg-teal-500'
                      }`} />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-teal-600 uppercase tracking-wide">5 = {t.totallyAgree}</span>
                </div>

                <div className="space-y-8">
                  {surveyDomains[step - 1].questions.map((q, idx) => {
                    const isAnswered = responses[q.id] !== undefined;
                    return (
                      <motion.div
                        key={q.id}
                        custom={idx}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        className={`p-6 sm:p-8 rounded-2xl border-2 transition-all duration-300 ${
                          isAnswered
                            ? 'bg-white/90 border-slate-100 shadow-sm'
                            : 'bg-white/60 border-slate-100/80'
                        }`}
                      >
                        <p className="text-lg font-semibold text-slate-700 mb-6 leading-relaxed flex items-start">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-brand-400 to-brand-500 text-white text-sm font-bold mr-4 flex-shrink-0 shadow-sm">
                            {idx + 1}
                          </span>
                          <span className="pt-0.5">{getQuestionText(q, lang)}</span>
                        </p>
                        
                        {/* Likert Scale Buttons */}
                        <div className="flex gap-2 sm:gap-3">
                          {likertScale.map((option, optIdx) => {
                            const isSelected = responses[q.id] === option.value;
                            const colors = LIKERT_COLORS[optIdx];
                            const wasJustSelected = justSelected === q.id && isSelected;
                            
                            return (
                              <button
                                key={option.value}
                                onClick={() => handleSelectResponse(q.id, option.value)}
                                className={`flex-1 flex flex-col items-center justify-center py-4 sm:py-5 rounded-xl sm:rounded-2xl border-2 transition-all duration-200 cursor-pointer select-none ${
                                  isSelected
                                    ? `${colors.selected} scale-105`
                                    : `${colors.base} ${colors.hover} hover:scale-[1.02]`
                                } ${wasJustSelected ? 'animate-pop' : ''}`}
                              >
                                <span className={`text-2xl sm:text-3xl font-extrabold mb-0.5 transition-colors duration-200 ${
                                  isSelected ? colors.numberSelected : colors.number
                                }`}>
                                  {option.value}
                                </span>
                                <span className={`text-[10px] sm:text-xs text-center font-semibold leading-tight px-1 transition-colors duration-200 ${
                                  isSelected ? 'text-white/90' : 'text-slate-400'
                                } hidden sm:block`}>
                                  {option.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Mobile labels */}
                        <div className="flex justify-between mt-2 sm:hidden">
                          <span className="text-[10px] font-medium text-slate-400">{t.disagree}</span>
                          <span className="text-[10px] font-medium text-slate-400">{t.agree}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="pt-10 mt-8 flex justify-between items-center">
                  <motion.button
                    whileHover={{ scale: 1.02, x: -3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBack}
                    className="px-6 py-3.5 text-slate-500 font-bold hover:text-slate-700 hover:bg-white/60 rounded-xl transition-all flex items-center"
                  >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    {t.previous}
                  </motion.button>

                  {step < surveyDomains.length ? (
                    <motion.button
                      whileHover={{ scale: 1.02, x: 3 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleNextDomain}
                      className="px-10 py-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold rounded-2xl flex items-center transition-all shadow-lg shadow-brand-200 hover:shadow-xl hover:shadow-brand-300 text-lg"
                    >
                      {t.next}
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleSubmit}
                      disabled={loading}
                      className="px-10 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-2xl disabled:opacity-60 flex items-center transition-all shadow-lg shadow-emerald-200 hover:shadow-xl text-lg"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          {t.sending}
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          {t.finishSubmit}
                        </>
                      )}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
