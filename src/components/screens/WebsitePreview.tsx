"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Monitor, Tablet, Smartphone, ArrowRight, ArrowLeft, Code2, CheckCircle, Maximize2, Minimize2 } from "lucide-react";

export default function WebsitePreview({ onNext, onPrev, domain, websiteName, themeColor, onExport, darkMode, generatedSiteData, generationError }: { onNext: () => void, onPrev: () => void, domain: string | null, websiteName: string, themeColor?: string, onExport: () => void, darkMode?: boolean, generatedSiteData?: any, generationError?: string | null }) {
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const deviceWidths = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px"
  };

  const displayName = websiteName || "My Website";
  
  const rawHtml = generatedSiteData?.html || (generationError ? `<div class='p-10 text-center flex flex-col items-center justify-center h-full'><h3 class='text-red-500 font-bold text-xl mb-2'>Generation Failed</h3><p class='text-red-400'>${generationError}</p><p class='text-gray-500 mt-4 text-sm'>Please click Previous and try again. The AI will automatically try a different fallback model.</p></div>` : "<div class='p-10 text-center flex flex-col items-center justify-center h-full'><p class='text-gray-500'>No content generated yet. Please go back and generate.</p></div>");

  // We wrap the raw HTML in a complete HTML document string that includes the Tailwind CSS CDN
  // so that the generated classes work inside the iframe.
  const srcDoc = `
    <!DOCTYPE html>
    <html lang="en" class="${darkMode ? 'dark' : ''}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${displayName}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <script>
        tailwind.config = {
          darkMode: 'class',
          theme: {
            extend: {
              colors: {
                primary: '${generatedSiteData?.themeColor || themeColor || "#0d9488"}'
              }
            }
          }
        }
      </script>
      <style>
        body { margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
      </style>
      <script>
        document.addEventListener('DOMContentLoaded', () => {
          document.body.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link) {
              e.preventDefault();
            }
          });
        });
      </script>
    </head>
    <body class="${darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}">
      ${rawHtml}
    </body>
    </html>
  `;

  const previewContent = (
    <div 
      className={`w-full h-full rounded-t-2xl shadow-2xl overflow-hidden ${isFullscreen ? 'border-none rounded-2xl' : 'border-t border-l border-r'} transition-all duration-500 ease-in-out relative flex flex-col ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'}`}
      style={{ maxWidth: deviceWidths[device] }}
    >
      {/* Mock Browser Header */}
      <div className={`px-4 py-3 border-b flex items-center justify-between sticky top-0 z-20 backdrop-blur-xl ${darkMode ? 'bg-slate-900/80 border-slate-700/50' : 'bg-white/80 border-slate-200/50'}`}>
        <div className="flex gap-1.5 w-16">
          <div className="w-3 h-3 rounded-full bg-red-400/90 shadow-sm shadow-red-400/20"></div>
          <div className="w-3 h-3 rounded-full bg-amber-400/90 shadow-sm shadow-amber-400/20"></div>
          <div className="w-3 h-3 rounded-full bg-green-400/90 shadow-sm shadow-green-400/20"></div>
        </div>
        <div className={`flex-1 max-w-sm mx-2 px-4 py-1 rounded-full text-xs font-medium flex items-center justify-center gap-2 border shadow-inner overflow-hidden text-ellipsis whitespace-nowrap ${darkMode ? 'bg-slate-800/50 border-slate-700/50 text-slate-400' : 'bg-slate-50 border-slate-200/50 text-slate-500'}`}>
          <span>🔒</span> https://{displayName.toLowerCase().replace(/\s+/g, '-')}.domaincraft.ai
        </div>
        <div className="w-16 flex justify-end">
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`p-1.5 rounded-md transition-colors ${darkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'}`}
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Iframe content */}
      <div className="flex-1 w-full bg-white relative">
        <iframe 
          title="Generated Website Preview"
          srcDoc={srcDoc}
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      
      {/* Header & Device Toggles */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 shrink-0 gap-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            Website Preview <span className="text-xl">✨</span>
          </h2>
          <p className="text-slate-500 mt-1">Here is the actual website generated by Gemini!</p>
        </div>

        <div className="flex items-center bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button 
            onClick={() => setDevice("desktop")}
            className={`p-2 rounded-lg flex items-center gap-2 transition-colors ${device === 'desktop' ? 'bg-white shadow-sm text-primary font-medium' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Monitor size={18} /> <span className="hidden sm:inline text-sm">Desktop</span>
          </button>
          <button 
            onClick={() => setDevice("tablet")}
            className={`p-2 rounded-lg flex items-center gap-2 transition-colors ${device === 'tablet' ? 'bg-white shadow-sm text-primary font-medium' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Tablet size={18} /> <span className="hidden sm:inline text-sm">Tablet</span>
          </button>
          <button 
            onClick={() => setDevice("mobile")}
            className={`p-2 rounded-lg flex items-center gap-2 transition-colors ${device === 'mobile' ? 'bg-white shadow-sm text-primary font-medium' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Smartphone size={18} /> <span className="hidden sm:inline text-sm">Mobile</span>
          </button>
        </div>
      </div>

      {/* Preview Container */}
      {isFullscreen && mounted ? createPortal(
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4 sm:p-8 animate-in fade-in duration-200">
          {previewContent}
        </div>,
        document.body
      ) : (
        <div className="flex-1 overflow-hidden flex flex-col items-center bg-slate-200/50 rounded-t-2xl border-t border-l border-r border-slate-200 pt-2 px-2 sm:pt-4 sm:px-4 min-h-0">
          {previewContent}
        </div>
      )}

      {/* Footer Navigation */}
      <div className="mt-3 pt-3 flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 shrink-0 gap-3">
        <button 
          onClick={onPrev}
          className="flex items-center gap-2 px-6 py-3 rounded-full text-slate-600 font-semibold hover:bg-slate-100 transition-colors w-full sm:w-auto justify-center"
        >
          <ArrowLeft size={20} /> Previous
        </button>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button 
            onClick={onExport}
            className="flex-1 sm:flex-none items-center justify-center gap-2 px-6 py-3 rounded-full font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all flex"
          >
            <Code2 size={20} /> Export Code
          </button>
          <button 
            onClick={onNext}
            className="flex-1 sm:flex-none items-center justify-center gap-2 px-8 py-3 rounded-full font-bold bg-primary text-white hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-1 transition-all flex"
          >
            <CheckCircle size={20} /> Customize AI <ArrowRight size={20} className="hidden sm:inline" />
          </button>
        </div>
      </div>
    </div>
  );
}
