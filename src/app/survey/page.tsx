'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { surveyDomains, likertScale } from '@/lib/questions';
import { CheckCircle2, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';

export default function SurveyPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form State
  const [participant, setParticipant] = useState({
    name: '',
    age: '',
    country: '',
    specialty: '',
    experience_years: ''
  });

  const [responses, setResponses] = useState<Record<string, number>>({});

  const isParticipantValid = 
    participant.name.trim() !== '' &&
    participant.age !== '' &&
    participant.country.trim() !== '' &&
    participant.specialty.trim() !== '' &&
    participant.experience_years !== '';

  const handleNextDomain = () => {
    // Basic validation to ensure current domain questions are answered
    if (step > 0 && step <= surveyDomains.length) {
      const currentDomain = surveyDomains[step - 1];
      const allAnswered = currentDomain.questions.every(q => responses[q.id] !== undefined);
      if (!allAnswered) {
        setError('Por favor responda todas las preguntas de esta sección antes de continuar.');
        return;
      }
    }
    setError(null);
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setError(null);
    setStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      // Verify all questions are answered
      const totalQuestions = surveyDomains.reduce((acc, curr) => acc + curr.questions.length, 0);
      if (Object.keys(responses).length !== totalQuestions) {
        throw new Error('Faltan preguntas por responder.');
      }

      // Insert Participant
      const { data: pData, error: pError } = await supabase
        .from('ortopedas_participants')
        .insert([{
          name: participant.name,
          age: parseInt(participant.age),
          country: participant.country,
          specialty: participant.specialty,
          experience_years: parseInt(participant.experience_years)
        }])
        .select('id')
        .single();

      if (pError) throw pError;
      if (!pData) throw new Error('Error al guardar datos del participante');

      // Prepare responses object
      const formattedResponses: Record<string, any> = { participant_id: pData.id };
      for (const [key, value] of Object.entries(responses)) {
        formattedResponses[key] = value;
      }

      // Insert Responses
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

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-2xl shadow-lg border border-slate-100 max-w-lg w-full text-center space-y-6">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800">¡Muchas gracias!</h2>
          <p className="text-slate-600">
            Sus respuestas han sido registradas exitosamente. Apreciamos su tiempo y contribución a este consenso.
          </p>
          <button 
            onClick={() => router.push('/')}
            className="mt-6 px-8 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors inline-block"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        
        {/* Header Progress */}
        <div className="bg-slate-50 border-b border-slate-200 px-8 py-5 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 text-lg">
            {step === 0 ? 'Datos Demográficos' : `Paso ${step} de ${surveyDomains.length}`}
          </h2>
          <div className="flex gap-2 items-center">
            {Array.from({ length: surveyDomains.length + 1 }).map((_, i) => (
              <div 
                key={i} 
                className={`w-3 h-3 rounded-full transition-colors ${i === step ? 'bg-cyan-600 ring-4 ring-cyan-100' : i < step ? 'bg-cyan-300' : 'bg-slate-200'}`} 
              />
            ))}
          </div>
        </div>

        <div className="p-8 sm:p-12">
          {error && (
            <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-start">
              <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {step === 0 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <p className="text-slate-600 mb-8 pb-4 border-b border-slate-100">
                Por favor complete los siguientes datos para contextualizar sus respuestas. 
                La información será tratada de manera confidencial.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Nombre completo</label>
                  <input 
                    type="text" 
                    value={participant.name}
                    onChange={(e) => setParticipant({...participant, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                    placeholder="Ej. Dr. Juan Pérez"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Edad</label>
                  <input 
                    type="number" 
                    value={participant.age}
                    onChange={(e) => setParticipant({...participant, age: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                    placeholder="Ej. 45"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">País de práctica</label>
                  <input 
                    type="text" 
                    value={participant.country}
                    onChange={(e) => setParticipant({...participant, country: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                    placeholder="Ej. Colombia"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Especialidad / Subespecialidad</label>
                  <input 
                    type="text" 
                    value={participant.specialty}
                    onChange={(e) => setParticipant({...participant, specialty: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                    placeholder="Ej. Ortopedia - Cirugía de Hombro"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700">Años de experiencia post-especialización</label>
                  <input 
                    type="number" 
                    value={participant.experience_years}
                    onChange={(e) => setParticipant({...participant, experience_years: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                    placeholder="Ej. 10"
                  />
                </div>
              </div>

              <div className="pt-8 flex justify-end">
                <button
                  onClick={handleNextDomain}
                  disabled={!isParticipantValid}
                  className="px-8 py-3 bg-cyan-700 text-white font-medium rounded-xl hover:bg-cyan-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-all"
                >
                  Siguiente Sección
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          )}

          {step > 0 && step <= surveyDomains.length && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">{surveyDomains[step - 1].title}</h3>
                <p className="text-slate-500">Por favor indique su nivel de acuerdo con las siguientes afirmaciones.</p>
              </div>

              <div className="space-y-12">
                {surveyDomains[step - 1].questions.map((q, idx) => (
                  <div key={q.id} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:border-cyan-100 transition-colors">
                    <p className="text-lg font-medium text-slate-800 mb-6">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-cyan-50 text-cyan-700 text-sm font-bold mr-3">
                        {idx + 1}
                      </span>
                      {q.text}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                      {likertScale.map(option => {
                        const isSelected = responses[q.id] === option.value;
                        return (
                          <button
                            key={option.value}
                            onClick={() => setResponses(prev => ({ ...prev, [q.id]: option.value }))}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                              isSelected 
                                ? 'border-cyan-500 bg-cyan-50 text-cyan-800 shadow-md scale-[1.02]' 
                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <span className={`text-xl font-bold mb-2 ${isSelected ? 'text-cyan-600' : 'text-slate-400'}`}>
                              {option.value}
                            </span>
                            <span className="text-xs text-center font-medium leading-tight">
                              {option.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-10 mt-8 border-t border-slate-100 flex justify-between items-center">
                <button
                  onClick={handleBack}
                  className="px-6 py-3 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Atrás
                </button>

                {step < surveyDomains.length ? (
                  <button
                    onClick={handleNextDomain}
                    className="px-8 py-3 bg-cyan-700 text-white font-medium rounded-xl hover:bg-cyan-800 flex items-center transition-all"
                  >
                    Siguiente
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-8 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 disabled:opacity-70 flex items-center transition-all shadow-md"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        Finalizar y Enviar
                        <CheckCircle2 className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
