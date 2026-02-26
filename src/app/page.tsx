import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Activity, ClipboardList, Stethoscope } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 sm:p-12">
      <div className="max-w-4xl w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="md:flex">
          <div className="md:w-2/5 bg-gradient-to-br from-slate-50 to-slate-100 p-8 flex flex-col items-center justify-center border-r border-slate-100">
            <div className="w-48 h-48 relative mb-6 rounded-full overflow-hidden shadow-md ring-4 ring-white">
              <Image 
                src="/logo-artroscopia.jpg" 
                alt="Sociedad Latinoamericana de Artroscopia" 
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
            <h2 className="text-xl font-bold text-slate-800 text-center mb-2">
              Sociedad Latinoamericana de Artroscopia
            </h2>
            <p className="text-sm text-slate-500 text-center font-medium">
              Investigación en Ortopedia
            </p>
          </div>
          
          <div className="md:w-3/5 p-8 sm:p-12 flex flex-col justify-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 text-xs font-semibold tracking-wide uppercase mb-6 w-max">
              <Activity className="w-4 h-4 mr-2" />
              Estudio Clínico 2024
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
              Consenso sobre Inestabilidad Traumática de Hombro
            </h1>
            
            <div className="space-y-4 text-slate-600 mb-10">
              <p className="flex items-start">
                <ClipboardList className="w-5 h-5 mr-3 text-cyan-600 mt-1 flex-shrink-0" />
                <span>Esta encuesta evalúa las perspectivas y prácticas actuales de cirujanos ortopedas respecto a la evaluación clínica, imágenes y tratamiento.</span>
              </p>
              <p className="flex items-start">
                <Stethoscope className="w-5 h-5 mr-3 text-cyan-600 mt-1 flex-shrink-0" />
                <span>Sus respuestas nos ayudarán a establecer patrones de práctica en el manejo de la inestabilidad de hombro.</span>
              </p>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 mb-10">
              <h3 className="font-semibold text-slate-800 mb-2">Estructura de la encuesta:</h3>
              <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                <li>Datos demográficos y experiencia</li>
                <li>Evaluación clínica e imágenes</li>
                <li>Biomecánica y factores de riesgo</li>
                <li>Tratamiento artroscópico y procedimientos óseos</li>
              </ul>
            </div>
            
            <Link 
              href="/survey" 
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-slate-900 hover:bg-cyan-700 rounded-xl transition-all shadow-md hover:shadow-lg w-full sm:w-auto group"
            >
              Iniciar Encuesta
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
