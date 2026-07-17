"use client";
import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { 
  GraduationCap, 
  HeartPulse, 
  Utensils, 
  ShoppingCart, 
  Briefcase,
  Sun,
  ArrowRight,
  ArrowLeft,
  Check
} from "lucide-react";

const domains = [
  { id: "education", name: "Education", desc: "Schools, Courses & Training", icon: GraduationCap, color: "#3b82f6", gradient: "from-blue-500/8 to-indigo-500/8", selectedGradient: "from-blue-500/15 to-indigo-500/15", borderColor: "border-blue-400" },
  { id: "healthcare", name: "HealthCare", desc: "Clinics, Doctors & Hospitals", icon: HeartPulse, color: "#10b981", gradient: "from-emerald-500/8 to-teal-500/8", selectedGradient: "from-emerald-500/15 to-teal-500/15", borderColor: "border-emerald-400" },
  { id: "restaurant", name: "Restaurant", desc: "Cafes, Restaurants & Food Service", icon: Utensils, color: "#f97316", gradient: "from-orange-500/8 to-amber-500/8", selectedGradient: "from-orange-500/15 to-amber-500/15", borderColor: "border-orange-400" },
  { id: "ecommerce", name: "E-Commerce", desc: "Online Stores & Shops", icon: ShoppingCart, color: "#8b5cf6", gradient: "from-violet-500/8 to-purple-500/8", selectedGradient: "from-violet-500/15 to-purple-500/15", borderColor: "border-violet-400" },
  { id: "solar", name: "Solar Energy", desc: "Solar Solutions & Services", icon: Sun, color: "#eab308", gradient: "from-yellow-500/8 to-amber-500/8", selectedGradient: "from-yellow-500/15 to-amber-500/15", borderColor: "border-yellow-400" },
  { id: "portfolio", name: "Portfolio", desc: "Personal, Artist & Business", icon: Briefcase, color: "#ec4899", gradient: "from-pink-500/8 to-rose-500/8", selectedGradient: "from-pink-500/15 to-rose-500/15", borderColor: "border-pink-400" },
];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 22 } }
};

export default function DomainSelection({ onNext, onPrev, selectedDomain, onSelect }: { onNext: () => void, onPrev: () => void, selectedDomain: string | null, onSelect: (domain: string) => void }) {

  return (
    <div className="flex flex-col h-full">
      <motion.div 
        className="mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-extrabold text-slate-800">Select Your Website Domain</h2>
        <p className="text-slate-500 mt-2">This helps our AI understand your requirements better.</p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6 flex-1"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {domains.map((domain) => {
          const Icon = domain.icon;
          const isSelected = selectedDomain === domain.id;
          
          return (
            <motion.button
              key={domain.id}
              onClick={() => onSelect(domain.id)}
              variants={cardVariants}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative flex flex-col items-center text-center p-4 rounded-2xl border-2 transition-all duration-300 card-lift overflow-hidden
                ${isSelected 
                  ? `${domain.borderColor} bg-gradient-to-br ${domain.selectedGradient} shadow-lg` 
                  : `border-slate-200/80 bg-gradient-to-br ${domain.gradient} hover:border-slate-300 hover:shadow-md`
                }
              `}
            >
              {/* Selected checkmark badge */}
              {isSelected && (
                <motion.div 
                  className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-white shadow-md"
                  style={{ backgroundColor: domain.color }}
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  <Check size={14} strokeWidth={3} />
                </motion.div>
              )}
              
              {/* Icon with unique color */}
              <motion.div 
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-2 transition-all duration-300 shadow-sm"
                style={{ 
                  backgroundColor: isSelected ? domain.color : `${domain.color}15`,
                  color: isSelected ? 'white' : domain.color
                }}
                animate={isSelected ? { scale: [1, 1.15, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Icon size={22} />
              </motion.div>
              
              <h3 className="text-sm font-bold text-slate-800 mb-0.5">{domain.name}</h3>
              <p className="text-xs text-slate-500">{domain.desc}</p>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Footer Navigation */}
      <div className="mt-auto pt-3 flex items-center justify-between border-t border-slate-200/60 shrink-0">
        <button 
          onClick={onPrev}
          className="flex items-center gap-2 px-6 py-3 rounded-full text-slate-600 font-semibold hover:bg-white/80 transition-colors"
        >
          <ArrowLeft size={20} /> Back
        </button>
        
        <motion.button 
          onClick={onNext}
          disabled={!selectedDomain}
          className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all duration-300 overflow-hidden relative
            ${selectedDomain 
              ? 'text-white cta-glow hover:-translate-y-1' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }
          `}
          whileHover={selectedDomain ? { scale: 1.03 } : {}}
          whileTap={selectedDomain ? { scale: 0.97 } : {}}
        >
          {selectedDomain && <span className="absolute inset-0 bg-gradient-to-r from-primary via-primary-dark to-primary bg-[length:200%_100%] animate-[shimmer_3s_linear_infinite]" />}
          <span className="relative">Continue</span>
          <ArrowRight size={20} className="relative" />
        </motion.button>
      </div>
    </div>
  );
}
