"use client";
import { useState } from "react";
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Lock,
  GraduationCap, 
  HeartPulse, 
  Utensils, 
  ShoppingCart, 
  Sun, 
  Briefcase 
} from "lucide-react";

const domainConfigs: Record<string, any> = {
  education: {
    Icon: GraduationCap,
    color: "blue",
    heroTitle: "Empowering Your Future",
    heroDesc: "Discover world-class education tailored to your goals. Learn from experts and build your career.",
    buttonText: "Explore Courses"
  },
  healthcare: {
    Icon: HeartPulse,
    color: "teal",
    heroTitle: "Your Health, Our Priority",
    heroDesc: "We provide exceptional healthcare services with compassion & excellence. Trust us with your family's health.",
    buttonText: "Book Appointment"
  },
  restaurant: {
    Icon: Utensils,
    color: "orange",
    heroTitle: "A Taste You'll Remember",
    heroDesc: "Experience culinary excellence with our carefully crafted menu, using only the freshest ingredients.",
    buttonText: "View Menu"
  },
  ecommerce: {
    Icon: ShoppingCart,
    color: "violet",
    heroTitle: "Discover Your Style",
    heroDesc: "Shop the latest trends with unbeatable prices. Quality products delivered straight to you.",
    buttonText: "Shop Now"
  },
  solar: {
    Icon: Sun,
    color: "yellow",
    heroTitle: "Powering the Future",
    heroDesc: "Switch to clean, renewable energy. Save money and the planet with our premium solar solutions.",
    buttonText: "Get Quote"
  },
  portfolio: {
    Icon: Briefcase,
    color: "pink",
    heroTitle: "Creative Excellence",
    heroDesc: "Showcasing my best work. Let's collaborate to bring your next big idea to life.",
    buttonText: "Hire Me"
  }
};

const colorMap: any = {
  blue: { text: "#2563eb", bg: "#2563eb", lightBg: "#eff6ff" },
  teal: { text: "#0d9488", bg: "#0d9488", lightBg: "#f0fdfa" },
  orange: { text: "#ea580c", bg: "#ea580c", lightBg: "#fff7ed" },
  violet: { text: "#7c3aed", bg: "#7c3aed", lightBg: "#f5f3ff" },
  yellow: { text: "#ca8a04", bg: "#ca8a04", lightBg: "#fefce8" },
  pink: { text: "#db2777", bg: "#db2777", lightBg: "#fdf2f8" },
};

export default function CustomizeChat({ onNext, onPrev, themeColor, domain, websiteName, darkMode, generatedSiteData }: { onNext: () => void, onPrev: () => void, themeColor: string, domain: string | null, websiteName: string, darkMode?: boolean, generatedSiteData?: any }) {
  const fallbackDomain = domain ? (domainConfigs[domain] || domainConfigs.healthcare) : domainConfigs.healthcare;
  const ActiveIcon = fallbackDomain.Icon;
  const displayName = websiteName || "My Website";
  
  const heroTitle = generatedSiteData?.heroTitle || fallbackDomain.heroTitle;
  const heroDesc = generatedSiteData?.heroDesc || fallbackDomain.heroDesc;
  
  const hexColor = generatedSiteData?.themeColor;
  const activeColor = hexColor ? { text: hexColor, bg: hexColor, lightBg: `${hexColor}15` } : (colorMap[themeColor || fallbackDomain.color] || colorMap.teal);

  return (
    <div className="flex flex-col h-full w-full max-w-6xl mx-auto">
      
      <div className="mb-3 flex items-end justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Customize Your Site
          </h2>
          <p className="text-slate-500 mt-1">Talk to your AI assistant to make adjustments instantly.</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden min-h-0">
        
        {/* Full Width Preview */}
        <div className="w-full h-full bg-slate-100/50 rounded-2xl border border-slate-200 p-4 overflow-hidden relative flex flex-col items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
          
          <div className={`w-full h-full max-w-4xl rounded-xl shadow-xl border transition-all duration-500 ease-in-out overflow-hidden flex flex-col ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200/60'}`}>
            <div className={`p-2 border-b flex items-center gap-2 shrink-0 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex gap-1.5 ml-2">
                <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
              </div>
              <div className="flex-1 flex justify-center mr-8">
                <div className={`border rounded-md py-1 px-8 text-xs font-medium flex items-center gap-1.5 shadow-sm ${darkMode ? 'bg-slate-900 border-slate-700 text-slate-400' : 'bg-white border-slate-200 text-slate-400'}`}>
                   <Lock size={10} /> preview.domaincraft.ai
                </div>
              </div>
            </div>
            
            {/* Website Content */}
            <div className="flex-1 w-full bg-white relative">
              <iframe 
                title="Generated Website Preview"
                srcDoc={`
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
                              primary: '${hexColor || themeColor || "#0d9488"}'
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
                    ${generatedSiteData?.html || "<div class='p-10 text-center text-gray-500'>No content generated yet. Please go back and generate.</div>"}
                  </body>
                  </html>
                `}
                className="w-full h-full border-none"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 flex items-center justify-between border-t border-slate-200 shrink-0 pb-1">
        <button 
          onClick={onPrev}
          className="flex items-center gap-2 px-6 py-3 rounded-full text-slate-600 font-semibold hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft size={20} /> Previous
        </button>
        
        <button 
          onClick={onNext}
          className="flex items-center gap-2 px-8 py-3 rounded-full font-bold bg-primary text-white hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-1 transition-all"
        >
          Accessibility Check <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
