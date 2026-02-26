'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { surveyDomains, likertScale } from '@/lib/questions';
import { BarChart3, Users, Download, LogOut, RefreshCw, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check simple auth
    const auth = localStorage.getItem('admin_auth');
    if (!auth) {
      router.push('/admin');
      return;
    }

    fetchData();
  }, [router]);

  const fetchData = async () => {
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
    } catch (err: any) {
      console.error(err);
      setError('Error al cargar los datos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    router.push('/admin');
  };

  const exportCSV = () => {
    if (!data.length) return;
    
    // Create header
    const headers = ['Nombre', 'Edad', 'País', 'Especialidad', 'Años Exp', 'Fecha'];
    const allQuestions = surveyDomains.flatMap(d => d.questions);
    headers.push(...allQuestions.map(q => q.id));

    // Create rows
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Panel de Resultados</h1>
          <p className="text-slate-500">Consenso sobre Inestabilidad de Hombro</p>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={fetchData}
            className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </button>
          <button 
            onClick={exportCSV}
            className="flex items-center px-4 py-2 bg-cyan-700 text-white rounded-lg hover:bg-cyan-800 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
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

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

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
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Tasa de Finalización</p>
            <p className="text-3xl font-bold text-slate-800">100%</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center">
          <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mr-4">
            <BarChart3 className="w-7 h-7" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Preguntas Totales</p>
            <p className="text-3xl font-bold text-slate-800">25</p>
          </div>
        </div>
      </div>

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
              {data.map((row, i) => (
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
