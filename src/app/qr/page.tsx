'use client';

import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer, ExternalLink } from 'lucide-react';

export default function QRPage() {
  const surveyUrl = 'https://encuesta-ortopedia-sla.vercel.app';

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const svg = document.getElementById('survey-qr');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new window.Image();
    
    img.onload = () => {
      canvas.width = 1000;
      canvas.height = 1000;
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, 1000, 1000);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = 'qr-encuesta-ortopedia-sla.png';
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-50">
      {/* Print-only styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-qr, #printable-qr * {
            visibility: visible;
          }
          #printable-qr {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 2rem;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Action buttons - hidden on print */}
      <div className="no-print fixed top-4 right-4 z-20 flex gap-3">
        <button
          onClick={handleDownload}
          className="flex items-center px-4 py-2 bg-white shadow-lg rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all"
        >
          <Download className="w-4 h-4 mr-2" />
          Descargar PNG
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center px-4 py-2 bg-brand-500 shadow-lg rounded-full text-white hover:bg-brand-600 transition-all"
        >
          <Printer className="w-4 h-4 mr-2" />
          Imprimir
        </button>
      </div>

      {/* Main QR Card */}
      <div id="printable-qr" className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
          {/* Header with logos */}
          <div className="bg-gradient-to-r from-brand-500 via-brand-600 to-purple-600 p-8 text-center">
            <div className="flex justify-center items-center gap-6 mb-4">
              <div className="w-20 h-20 bg-white rounded-2xl p-2 shadow-lg">
                <Image
                  src="/logo-artroscopia.jpg"
                  alt="SLA"
                  width={80}
                  height={80}
                  className="rounded-xl object-cover"
                />
              </div>
              <div className="w-20 h-20 bg-white rounded-2xl p-2 shadow-lg flex items-center justify-center">
                <Image
                  src="/logo-agapai.png"
                  alt="AGAPAI"
                  width={70}
                  height={35}
                />
              </div>
            </div>
            <h1 className="text-2xl font-extrabold text-white mb-2">
              Encuesta de Consenso
            </h1>
            <p className="text-white/90 text-sm">
              Sociedad Latinoamericana de Artroscopia
            </p>
          </div>

          {/* QR Code */}
          <div className="p-8 flex flex-col items-center">
            <div className="bg-white p-6 rounded-2xl shadow-inner border-4 border-slate-100 mb-6">
              <QRCodeSVG
                id="survey-qr"
                value={surveyUrl}
                size={280}
                level="H"
                includeMargin={false}
                bgColor="#ffffff"
                fgColor="#1e293b"
              />
            </div>

            <h2 className="text-xl font-bold text-slate-800 text-center mb-2">
              Inestabilidad Traumática de Hombro
            </h2>
            <p className="text-slate-500 text-center text-sm mb-4">
              Escanee el código QR para participar en la encuesta
            </p>

            {/* URL display */}
            <div className="w-full bg-slate-50 rounded-xl p-4 flex items-center justify-center gap-2">
              <ExternalLink className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-mono text-slate-600 break-all">
                {surveyUrl}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 px-8 py-4 border-t border-slate-100">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Disponible en: Español • Português • English</span>
              <span>Powered by AGAPAI</span>
            </div>
          </div>
        </div>

        {/* Additional info for print */}
        <div className="mt-8 text-center text-slate-400 text-sm no-print">
          <p>Este QR está optimizado para impresión en alta calidad</p>
        </div>
      </div>
    </div>
  );
}
