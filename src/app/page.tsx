import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Activity, ClipboardList, Stethoscope } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 sm:p-12">
      <div className="max-w-4xl w-full glass-card rounded-3xl shadow-2xl overflow-hidden border border-white/60">
        <div className="md:flex">
          <div className="md:w-2/5 bg-gradient-to-br from-brand-50 via-purple-50 to-brand-100/50 p-10 flex flex-col items-center justify-center border-r border-white/40">
            <div className="w-48 h-48 relative mb-6 rounded-full overflow-hidden shadow-xl ring-4 ring-white/80">
              <Image 
                src="/logo-artroscopia.jpg" 
                alt="Sociedad Latinoamericana de Artroscopia" 
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
            <h2 className="text-xl font-extrabold text-slate-800 text-center mb-2">
              Sociedad Latinoamericana de Artroscopia
            </h2>
            <p className="text-sm text-slate-500 text-center font-semibold">
              Investigacion en Ortopedia
            </p>
          </div>
          
          <div className="md:w-3/5 p-8 sm:p-12 flex flex-col justify-center">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-brand-50 to-purple-50 text-brand-600 text-xs font-bold tracking-wider uppercase mb-6 w-max border border-brand-100">
              <Activity className="w-4 h-4 mr-2" />
              Estudio Clinico 2024
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-brand-700 bg-clip-text text-transparent">
                Consenso sobre Inestabilidad Traumatica de Hombro
              </span>
            </h1>
            
            <div className="space-y-4 text-slate-600 mb-10">
              <p className="flex items-start">
                <span className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <ClipboardList className="w-4 h-4 text-brand-500" />
                </span>
                <span>Esta encuesta evalua las perspectivas y practicas actuales de cirujanos ortopedas respecto a la evaluacion clinica, imagenes y tratamiento.</span>
              </p>
              <p className="flex items-start">
                <span className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <Stethoscope className="w-4 h-4 text-emerald-500" />
                </span>
                <span>Sus respuestas nos ayudaran a establecer patrones de practica en el manejo de la inestabilidad de hombro.</span>
              </p>
            </div>
            
            <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-6 mb-10">
              <h3 className="font-bold text-slate-700 mb-3">Estructura de la encuesta:</h3>
              <ul className="text-sm text-slate-500 space-y-2">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-400 mr-3"></span>
                  Datos demograficos y experiencia
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mr-3"></span>
                  Evaluacion clinica e imagenes
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-3"></span>
                  Biomecanica y factores de riesgo
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mr-3"></span>
                  Tratamiento artroscopico y procedimientos oseos
                </li>
              </ul>
            </div>
            
            <Link 
              href="/survey" 
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 rounded-2xl transition-all shadow-lg shadow-brand-200 hover:shadow-xl hover:shadow-brand-300 w-full sm:w-auto group"
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
