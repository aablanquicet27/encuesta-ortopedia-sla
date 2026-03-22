'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { surveyDomains, getQuestionText, getDomainTitle } from '@/lib/questions';
import { useLanguage } from '@/lib/language-context';
import { Users, TrendingUp, RefreshCw, Home, CheckCircle2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface Stats {
  [questionId: string]: {
    total: number;
    distribution: { [value: number]: number };
    average: number;
  };
}

export default function ResultsPage() {
  const { lang, t } = useLanguage();
  const [stats, setStats] = useState<Stats>({});
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const { data: responses, error } = await supabase
        .from('ortopedas_responses')
        .select('*');

      if (error) throw error;

      setTotalParticipants(responses?.length || 0);
      setLastUpdated(new Date());

      // Calculate stats
      const newStats: Stats = {};
      const allQuestions = surveyDomains.flatMap(d => d.questions);
      
      for (const q of allQuestions) {
        const values = (responses || [])
          .map(r => r[q.id])
          .filter(v => v !== null && v !== undefined);
        
        const distribution: { [value: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        values.forEach(v => {
          if (distribution[v] !== undefined) distribution[v]++;
        });

        const average = values.length > 0 
          ? values.reduce((a: number, b: number) => a + b, 0) / values.length 
          : 0;

        newStats[q.id] = {
          total: values.length,
          distribution,
          average,
        };
      }
      setStats(newStats);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();

    // Set up realtime subscription
    const channel = supabase
      .channel('realtime-results')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ortopedas_responses'
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    // Also poll every 10 seconds as backup
    const interval = setInterval(fetchStats, 10000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [fetchStats]);

  const getAgreementPercentage = (qStats: Stats[string]) => {
    if (qStats.total === 0) return 0;
    const agree = (qStats.distribution[4] || 0) + (qStats.distribution[5] || 0);
    return Math.round((agree / qStats.total) * 100);
  };

  const getDisagreementPercentage = (qStats: Stats[string]) => {
    if (qStats.total === 0) return 0;
    const disagree = (qStats.distribution[1] || 0) + (qStats.distribution[2] || 0);
    return Math.round((disagree / qStats.total) * 100);
  };

  const translations = {
    es: {
      title: 'Resultados en Tiempo Real',
      subtitle: 'Consenso sobre Inestabilidad de Hombro',
      participants: 'participantes',
      haveResponded: 'han respondido',
      agree: 'De acuerdo',
      disagree: 'En desacuerdo',
      neutral: 'Neutral',
      lastUpdate: 'Última actualización',
      backHome: 'Volver al inicio',
      loading: 'Cargando resultados...',
      liveIndicator: 'EN VIVO',
      ofParticipants: 'de los participantes',
    },
    pt: {
      title: 'Resultados em Tempo Real',
      subtitle: 'Consenso sobre Instabilidade do Ombro',
      participants: 'participantes',
      haveResponded: 'responderam',
      agree: 'Concordam',
      disagree: 'Discordam',
      neutral: 'Neutro',
      lastUpdate: 'Última atualização',
      backHome: 'Voltar ao início',
      loading: 'Carregando resultados...',
      liveIndicator: 'AO VIVO',
      ofParticipants: 'dos participantes',
    },
    en: {
      title: 'Live Results',
      subtitle: 'Consensus on Shoulder Instability',
      participants: 'participants',
      haveResponded: 'have responded',
      agree: 'Agree',
      disagree: 'Disagree',
      neutral: 'Neutral',
      lastUpdate: 'Last update',
      backHome: 'Back to home',
      loading: 'Loading results...',
      liveIndicator: 'LIVE',
      ofParticipants: 'of participants',
    },
  };

  const tr = translations[lang];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
          <p className="text-slate-500">{tr.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-50 text-red-600 text-sm font-bold mb-4 animate-pulse">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-ping"></span>
          {tr.liveIndicator}
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-2">
          {tr.title}
        </h1>
        <p className="text-slate-500">{tr.subtitle}</p>
        
        {lastUpdated && (
          <p className="text-xs text-slate-400 mt-2 flex items-center justify-center">
            <Clock className="w-3 h-3 mr-1" />
            {tr.lastUpdate}: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Participants counter */}
      <motion.div 
        key={totalParticipants}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        className="glass-card rounded-2xl p-8 mb-8 text-center border border-white/60 shadow-xl"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-brand-400 to-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Users className="w-8 h-8 text-white" />
        </div>
        <motion.p 
          key={totalParticipants}
          initial={{ scale: 1.2, color: '#6366f1' }}
          animate={{ scale: 1, color: '#1e293b' }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-extrabold text-slate-800 mb-2"
        >
          {totalParticipants}
        </motion.p>
        <p className="text-slate-500 font-medium">
          {tr.participants} {tr.haveResponded}
        </p>
      </motion.div>

      {/* Results by domain */}
      <div className="space-y-6">
        {surveyDomains.map((domain) => (
          <div key={domain.id} className="glass-card rounded-2xl shadow-lg border border-white/60 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
              <h2 className="font-bold text-slate-800 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-brand-500" />
                {getDomainTitle(domain, lang)}
              </h2>
            </div>
            
            <div className="p-4 sm:p-6 space-y-6">
              {domain.questions.map((q, idx) => {
                const qStats = stats[q.id] || { total: 0, distribution: {1:0,2:0,3:0,4:0,5:0}, average: 0 };
                const agreePercent = getAgreementPercentage(qStats);
                const disagreePercent = getDisagreementPercentage(qStats);
                const neutralPercent = 100 - agreePercent - disagreePercent;
                
                return (
                  <motion.div 
                    key={q.id}
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-slate-100 pb-6 last:border-0 last:pb-0"
                  >
                    <p className="text-sm sm:text-base text-slate-700 mb-4 leading-relaxed">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-brand-100 text-brand-600 text-xs font-bold mr-2">
                        {idx + 1}
                      </span>
                      {getQuestionText(q, lang)}
                    </p>
                    
                    {/* Visual bar */}
                    <div className="h-10 rounded-xl overflow-hidden flex mb-3 shadow-inner bg-slate-100">
                      {disagreePercent > 0 && (
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${disagreePercent}%` }}
                          transition={{ duration: 0.5 }}
                          className="bg-gradient-to-r from-red-400 to-red-500 flex items-center justify-center"
                        >
                          {disagreePercent >= 15 && (
                            <span className="text-white text-sm font-bold">{disagreePercent}%</span>
                          )}
                        </motion.div>
                      )}
                      {neutralPercent > 0 && (
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${neutralPercent}%` }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                          className="bg-gradient-to-r from-amber-300 to-amber-400 flex items-center justify-center"
                        >
                          {neutralPercent >= 15 && (
                            <span className="text-amber-900 text-sm font-bold">{neutralPercent}%</span>
                          )}
                        </motion.div>
                      )}
                      {agreePercent > 0 && (
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${agreePercent}%` }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className="bg-gradient-to-r from-emerald-400 to-emerald-500 flex items-center justify-center"
                        >
                          {agreePercent >= 15 && (
                            <span className="text-white text-sm font-bold">{agreePercent}%</span>
                          )}
                        </motion.div>
                      )}
                    </div>
                    
                    {/* Legend */}
                    <div className="flex flex-wrap justify-between text-xs gap-2">
                      <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full bg-red-500 mr-1.5"></span>
                        <span className="text-slate-600">{tr.disagree}: <strong>{disagreePercent}%</strong></span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full bg-amber-400 mr-1.5"></span>
                        <span className="text-slate-600">{tr.neutral}: <strong>{neutralPercent}%</strong></span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 mr-1.5"></span>
                        <span className="text-slate-600">{tr.agree}: <strong>{agreePercent}%</strong></span>
                      </div>
                    </div>

                    {/* Responses count */}
                    <p className="text-xs text-slate-400 mt-2 text-right">
                      {qStats.total} {tr.participants}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Back button */}
      <div className="mt-10 text-center">
        <Link 
          href="/"
          className="inline-flex items-center px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
        >
          <Home className="w-4 h-4 mr-2" />
          {tr.backHome}
        </Link>
      </div>
    </div>
  );
}
