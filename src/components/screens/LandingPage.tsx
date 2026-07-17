"use client";
import { motion } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";
import Image from "next/image";

export default function LandingPage({ onNext }: { onNext: () => void }) {
  const domains = [
    { name: "Education", emoji: "🎓" },
    { name: "Healthcare", emoji: "🏥" },
    { name: "Restaurant", emoji: "🍽️" },
    { name: "E-Commerce", emoji: "🛒" },
    { name: "Solar Energy", emoji: "☀️" },
    { name: "Portfolio", emoji: "🎨" },
  ];

  return (
    <div className="relative w-full h-screen bg-slate-50 overflow-hidden flex items-center justify-center text-slate-800">
      
      {/* Background Image & Effects */}
      <div className="absolute inset-0 w-full h-full">
        <Image 
          src="/hero_abstract.png" 
          alt="Abstract Background"
          fill
          className="object-cover opacity-60"
          priority
        />
        {/* Subtle white fade gradient at the bottom/top for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/90"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto px-4 w-full mt-10">
        
        {/* Powered by AI Tag */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 px-5 py-2 rounded-full border border-slate-200/60 bg-white/60 backdrop-blur-md flex items-center gap-2 text-sm text-slate-600 font-semibold shadow-sm"
        >
          <span className="text-primary">✨</span> Powered by Advanced AI
        </motion.div>

        {/* Logo and Name */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-4 mb-10"
        >
          <div className="w-14 h-14 rounded-2xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center text-primary font-black text-3xl border border-slate-100">
            D
          </div>
          <div className="text-left flex flex-col justify-center h-14">
            <h1 className="text-3xl font-extrabold leading-none tracking-tight text-slate-900">
              DomainCraft
            </h1>
            <span className="text-primary font-medium text-sm mt-1.5 tracking-wide uppercase">
              Intelligent Site Builder
            </span>
          </div>
        </motion.div>

        {/* Main Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6 mb-12"
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-slate-900 drop-shadow-sm">
            Launch Your Website <br/>
            <span className="text-primary">
              Without the Complexity
            </span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Just describe what you need, and our AI will instantly generate a <br/>
            stunning, fully-functional website tailored to your business.
          </p>
        </motion.div>

        {/* Domain Pills */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {domains.map((domain) => (
            <button 
              key={domain.name}
              onClick={onNext}
              className="px-5 py-2.5 rounded-full border border-slate-200/60 bg-white/80 backdrop-blur-sm hover:bg-white hover:border-slate-300 hover:shadow-md transition-all duration-300 flex items-center gap-2 text-sm font-semibold text-slate-700"
            >
              <span className="text-base">{domain.emoji}</span> {domain.name}
            </button>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.button 
          onClick={onNext}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="group relative px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all duration-300 flex items-center gap-3 shadow-xl shadow-slate-900/20"
        >
          <span className="text-lg">Start Generating Now</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>

        {/* Security Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex items-center gap-2 text-sm font-medium text-slate-500"
        >
          <Lock className="w-4 h-4 text-emerald-500" />
          Secure & Private Generation Process
        </motion.div>
      </div>
    </div>
  );
}
