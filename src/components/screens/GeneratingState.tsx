"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, Circle, X } from "lucide-react";

const generationSteps = [
  "Analyzing your requirements",
  "Selecting the best template",
  "Creating layout structure",
  "Generating content",
  "Finalizing and optimizing"
];

export default function GeneratingState({ onNext, onCancel, onStepChange, isGenerating }: { onNext: () => void, onCancel: () => void, onStepChange?: (stepIndex: number) => void, isGenerating?: boolean }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < generationSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentStepIndex === generationSteps.length - 1 && !isGenerating) {
      const timeout = setTimeout(onNext, 1500);
      return () => clearTimeout(timeout);
    }
  }, [currentStepIndex, isGenerating, onNext]);

  useEffect(() => {
    onStepChange?.(currentStepIndex);
  }, [currentStepIndex, onStepChange]);

  const progressPercentage = Math.round((currentStepIndex / (generationSteps.length - 1)) * 100);

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto justify-center py-4">
      
      {/* Orbital Animation + Title */}
      <div className="text-center mb-6 relative">
        {/* Orbital rings */}
        <div className="relative w-32 h-32 mx-auto mb-4">
          {/* Center sparkle */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-3 h-3 absolute" style={{ top: '10%', left: '50%' }}>
              <div className="w-full h-full rounded-full bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/40" />
            </div>
          </motion.div>
          
          {/* Ring 1 */}
          <div className="absolute inset-4 rounded-full border border-dashed border-primary/15" />
          <motion.div 
            className="absolute inset-4"
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary to-primary-light shadow-md shadow-primary/50" />
          </motion.div>

          {/* Ring 2 */}
          <div className="absolute inset-8 rounded-full border border-dashed border-secondary/15" />
          <motion.div 
            className="absolute inset-8"
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gradient-to-r from-secondary to-secondary-light shadow-md shadow-secondary/50" />
          </motion.div>

          {/* Ring 3 (innermost) */}
          <div className="absolute inset-14 rounded-full border border-dashed border-primary/10" />
          <motion.div 
            className="absolute inset-14"
            animate={{ rotate: -360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary/60" />
          </motion.div>

          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <SparklesIcon className="text-primary w-10 h-10" />
            </motion.div>
          </div>
        </div>

        <motion.h2 
          className="text-2xl font-extrabold text-slate-800"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Generating Your Website...
        </motion.h2>
        <p className="text-slate-500 mt-2 text-sm">This may take a few moments. Please don't close this window.</p>
      </div>

      {/* Progress Bar — Animated gradient */}
      <div className="w-full bg-slate-100 rounded-full h-2.5 mb-6 overflow-hidden">
        <motion.div 
          className="h-full rounded-full progress-line"
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      {/* Checklist — Animated transitions */}
      <div className="glass-card rounded-2xl p-4 space-y-0 shadow-sm mb-6 overflow-hidden">
        {generationSteps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isPending = index > currentStepIndex;

          return (
            <motion.div 
              key={step} 
              className={`flex items-center gap-3 py-2 px-3 rounded-xl transition-colors duration-300 ${isCurrent ? 'bg-primary/5' : ''}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isPending ? 0.35 : 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <div className="shrink-0 w-8 flex justify-center">
                <AnimatePresence mode="wait">
                  {isCompleted && (
                    <motion.div
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      <CheckCircle2 className="text-secondary" size={22} />
                    </motion.div>
                  )}
                  {isCurrent && (
                    <motion.div key="spin" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <Loader2 className="text-primary animate-spin" size={22} />
                    </motion.div>
                  )}
                  {isPending && <Circle className="text-slate-200" size={22} />}
                </AnimatePresence>
              </div>
              <span className={`text-sm font-medium transition-colors ${isCompleted ? 'text-slate-600' : isCurrent ? 'text-primary font-bold' : 'text-slate-400'}`}>
                {step}...
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex justify-center mt-auto">
        <motion.button 
          onClick={onCancel}
          className="flex items-center gap-2 px-8 py-3 rounded-full border-2 border-slate-200 text-slate-600 font-bold hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <X size={20} /> Cancel Generation
        </motion.button>
      </div>
    </div>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  );
}
