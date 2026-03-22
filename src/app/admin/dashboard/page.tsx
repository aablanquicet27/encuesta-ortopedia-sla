'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { surveyDomains, getQuestionText, getDomainTitle } from '@/lib/questions';
import { BarChart3, Users, Download, LogOut, RefreshCw, AlertCircle, TrendingUp, QrCode, Clock } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface Stats {
  [questionId: string]: {
    total: number;
    distribution: { [value: number]: number };
    average: number;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [stats, setStats] = useState<Stats>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const { data: responses, error: rError } = await supabase
        .from('ortopedas_responses')
        .select(`
          *,
          participant:participant_id (
            name, age, country, specialty, experience_years
          )
        `)
        .order('created_at', { ascending: false });

      if (rError) throw rError;
      setData(responses || []);
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
    } catch (err: any) {
      console.error(err);
      setError('Error al cargar los datos: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (!auth) {
      router.push('/admin');
      return;
    }
    fetchData();
  }, [router, fetchData]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchData]);

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    router.push('/admin');
  };

  const exportCSV = () => {
    if (!data.length) return;
    
    const headers = ['Nombre', 'Edad', 'País', 'Especialidad', 'Años Exp', 'Fecha'];
    const allQuestions = surveyDomains.flatMap(d => d.questions);
    headers.push(...allQuestions.map(q => q.id));

    const rows = data.map(row => {
      const p = row.participant || {};
      const date = new Date(row.created_at).toLocaleDateString('es-ES');
      const baseData = [p.name, p.age, p.country, p.specialty, p.experience_years, date];
      const qData = allQuestions.map(q => row[q.id] || '');
      return [...baseData, ...qData].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'resultados_encuesta_ortopedia.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getAgreementColor = (avg: number) => {
    if (avg >= 4) return 'text-emerald-600 bg-emerald-50';
    if (avg >= 3) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  const getBarWidth = (count: number, total: number) => {
    if (total === 0) return '0%';
    return `${(count / total) * 100}%`;
  };

  if (loading && data.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  const surveyUrl = typeof window !== 'undefined' ? `${window.location.origin}/admin` : 'https://encuesta-ortopedia-sla.vercel.app/admin';

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Panel de Resultados</h1>
          <p className="text-slate-500">Consenso sobre Inestabilidad de Hombro</p>
          {lastUpdated && (
            <p className="text-xs text-slate-400 mt-1 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              Última actualización: {lastUpdated.toLocaleTimeString('es-ES')}
              {autoRefresh && <span className="ml-2 text-emerald-500">● Auto-refresh activo</span>}
            </p>
          )}
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center px-4 py-2 border rounded-lg transition-colors ${
              autoRefresh 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? 'Auto' : 'Manual'}
          </button>
          <button 
            onClick={fetchData}
            className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </button>
          <button 
            onClick={() => setShowQR(!showQR)}
            className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <QrCode className="w-4 h-4 mr-2" />
            QR
          </button>
          <button 
            onClick={exportCSV}
            className="flex items-center px-4 py-2 bg-cyan-700 text-white rounded-lg hover:bg-cyan-800 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            CSV
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Salir
          </button>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowQR(false)}>
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">Acceso QR al Panel</h3>
            <div className="bg-white p-4 rounded-xl flex justify-center">
              <QRCodeSVG 
                value={surveyUrl} 
                size={200}
                level="H"
                includeMargin
              />
            </div>
            <p className="text-sm text-slate-500 text-center mt-4">
              Escanee para acceder a las respuestas
            </p>
            <p className="text-xs text-slate-400 text-center mt-2 break-all">
              {surveyUrl}
            </p>
            <button
              onClick={() => setShowQR(false)}
              className="w-full mt-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mr-4">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Participantes</p>
            <p className="text-3xl font-bold text-slate-800">{data.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mr-4">
            <BarChart3 className="w-7 h-7" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Tasa Finalización</p>
            <p className="text-3xl font-bold text-slate-800">100%</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center">
          <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mr-4">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Promedio General</p>
            <p className="text-3xl font-bold text-slate-800">
              {data.length > 0 
                ? (Object.values(stats).reduce((a, b) => a + b.average, 0) / Object.values(stats).length).toFixed(1)
                : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Live Statistics by Domain */}
      {data.length > 0 && (
        <div className="space-y-8 mb-10">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            <TrendingUp className="w-6 h-6 mr-3 text-brand-500" />
            Estadísticas en Tiempo Real
          </h2>
          
          {surveyDomains.map((domain) => (
            <div key={domain.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                <h3 className="font-bold text-slate-800">{getDomainTitle(domain, 'es')}</h3>
              </div>
              
              <div className="p-6 space-y-6">
                {domain.questions.map((q, idx) => {
                  const qStats = stats[q.id] || { total: 0, distribution: {1:0,2:0,3:0,4:0,5:0}, average: 0 };
                  const totalResponses = qStats.total;
                  
                  return (
                    <div key={q.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between mb-3">
                        <p className="text-sm text-slate-700 flex-1 pr-4">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold mr-2">
                            {idx + 1}
                          </span>
                          {getQuestionText(q, 'es')}
                        </p>
                        <div className={`px-3 py-1 rounded-full text-sm font-bold ${getAgreementColor(qStats.average)}`}>
                          {qStats.average.toFixed(1)}
                        </div>
                      </div>
                      
                      {/* Distribution bars */}
                      <div className="flex items-center gap-1 h-8">
                        {[1, 2, 3, 4, 5].map(value => {
                          const count = qStats.distribution[value] || 0;
                          const percentage = totalResponses > 0 ? ((count / totalResponses) * 100).toFixed(0) : 0;
                          const colors = [
                            'bg-red-400',
                            'bg-orange-400',
                            'bg-amber-400',
                            'bg-emerald-400',
                            'bg-teal-500',
                          ];
                          
                          return (
                            <div key={value} className="flex-1 flex flex-col items-center">
                              <div className="w-full bg-slate-100 rounded-full h-6 relative overflow-hidden">
                                <div 
                                  className={`h-full ${colors[value - 1]} rounded-full transition-all duration-500`}
                                  style={{ width: getBarWidth(count, totalResponses) }}
                                />
                                {count > 0 && (
                                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow">
                                    {percentage}%
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400 mt-1">{value}</span>
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Agreement summary */}
                      <div className="flex justify-between mt-2 text-xs text-slate-500">
                        <span>
                          En desacuerdo: {((((qStats.distribution[1] || 0) + (qStats.distribution[2] || 0)) / Math.max(totalResponses, 1)) * 100).toFixed(0)}%
                        </span>
                        <span>
                          Neutral: {(((qStats.distribution[3] || 0) / Math.max(totalResponses, 1)) * 100).toFixed(0)}%
                        </span>
                        <span>
                          De acuerdo: {((((qStats.distribution[4] || 0) + (qStats.distribution[5] || 0)) / Math.max(totalResponses, 1)) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Participants Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h2 className="font-semibold text-slate-800">Últimos Registros</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-white border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">País</th>
                <th className="px-6 py-4">Especialidad</th>
                <th className="px-6 py-4">Años Exp.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.slice(0, 20).map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(row.created_at).toLocaleDateString('es-ES', { 
                      day: '2-digit', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800">{row.participant?.name || 'Anónimo'}</td>
                  <td className="px-6 py-4">{row.participant?.country}</td>
                  <td className="px-6 py-4">{row.participant?.specialty}</td>
                  <td className="px-6 py-4 text-center">{row.participant?.experience_years}</td>
                </tr>
              ))}
              
              {data.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                    No hay respuestas registradas aún.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
