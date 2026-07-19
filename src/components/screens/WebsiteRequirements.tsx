"use client";
import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { ArrowRight, ArrowLeft, Building2, Users, Target, Palette, LayoutGrid, Home, Info, Briefcase, PenTool, Phone, Image, MessageSquare, Calendar } from "lucide-react";

const featuresList = [
  { name: "Home", icon: Home },
  { name: "About Us", icon: Info },
  { name: "Services", icon: Briefcase },
  { name: "Blog", icon: PenTool },
  { name: "Contact", icon: Phone },
  { name: "Gallery", icon: Image },
  { name: "Testimonials", icon: MessageSquare },
  { name: "Booking", icon: Calendar },
];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function WebsiteRequirements({ 
  onNext, 
  onPrev, 
  websiteName, 
  onNameChange, 
  selectedFeatures, 
  onFeaturesChange,
  targetAudience,
  onTargetAudienceChange,
  mainGoal,
  onMainGoalChange,
  designStyle,
  onDesignStyleChange
}: { 
  onNext: () => void, 
  onPrev: () => void, 
  websiteName: string, 
  onNameChange: (name: string) => void, 
  selectedFeatures: Set<string>, 
  onFeaturesChange: (features: Set<string>) => void,
  targetAudience: string,
  onTargetAudienceChange: (v: string) => void,
  mainGoal: string,
  onMainGoalChange: (v: string) => void,
  designStyle: string,
  onDesignStyleChange: (v: string) => void
}) {
  const [isFocused, setIsFocused] = useState(false);

  const toggleFeature = (feat: string) => {
    const next = new Set(selectedFeatures);
    if (next.has(feat)) next.delete(feat);
    else next.add(feat);
    onFeaturesChange(next);
  };

  const filledCount = [
    websiteName ? 1 : 0, 
    targetAudience ? 1 : 0, 
    mainGoal ? 1 : 0, 
    designStyle ? 1 : 0, 
    selectedFeatures.size > 0 ? 1 : 0
  ].reduce((a, b) => a + b, 0);
  
  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <motion.div 
        className="mb-3 shrink-0"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-extrabold text-slate-800">Website Requirements</h2>
        <p className="text-slate-500 mt-2">Tell us about your website so we can build it perfectly for you.</p>
        {/* Mini progress */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
              animate={{ width: `${(filledCount / 5) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-xs font-bold text-slate-400">{filledCount}/5</span>
        </div>
      </motion.div>

      <motion.div 
        className="space-y-4 mb-4 flex-1 overflow-y-auto pr-2 min-h-0"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Business Name — Floating Label */}
        <motion.div className="glass-card p-6 rounded-2xl group" variants={itemVariants}>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">
            <Building2 size={16} className="text-primary" /> Business / Website Name
          </label>
          <div className="relative">
            <input 
              type="text" 
              value={websiteName}
              onChange={(e) => onNameChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="e.g. BrightCare Clinic"
              className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-white text-slate-800 font-medium"
            />
            {isFocused && (
              <motion.div 
                className="absolute inset-0 rounded-xl pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ boxShadow: '0 0 0 4px rgba(139, 92, 246, 0.08)' }}
              />
            )}
          </div>
        </motion.div>

        {/* Target Audience & Goal Row */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-5" variants={itemVariants}>
          <div className="glass-card p-6 rounded-2xl">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">
              <Users size={16} className="text-primary" /> Target Audience
            </label>
            <select 
              value={targetAudience}
              onChange={(e) => onTargetAudienceChange(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-white text-slate-700 font-medium appearance-none cursor-pointer"
            >
              <option value="" disabled>Select audience</option>
              <option>Local Customers</option>
              <option>Businesses (B2B)</option>
              <option>Students & Learners</option>
              <option>Global Audience</option>
            </select>
          </div>

          <div className="glass-card p-6 rounded-2xl">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">
              <Target size={16} className="text-primary" /> Main Goal
            </label>
            <select 
              value={mainGoal}
              onChange={(e) => onMainGoalChange(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-white text-slate-700 font-medium appearance-none cursor-pointer"
            >
              <option value="" disabled>Select primary goal</option>
              <option>Sell Products</option>
              <option>Book Appointments</option>
              <option>Showcase Portfolio</option>
              <option>Provide Information</option>
            </select>
          </div>
        </motion.div>

        {/* Style Preference */}
        <motion.div className="glass-card p-6 rounded-2xl" variants={itemVariants}>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">
            <Palette size={16} className="text-primary" /> Design Style
          </label>
          <select 
            value={designStyle}
            onChange={(e) => onDesignStyleChange(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-white text-slate-700 font-medium appearance-none cursor-pointer"
          >
            <option value="" disabled>Choose design style</option>
            <option>Modern & Clean</option>
            <option>Playful & Vibrant</option>
            <option>Corporate & Professional</option>
            <option>Minimalist</option>
          </select>
        </motion.div>

        {/* Features — Pill Toggles instead of checkboxes */}
        <motion.div className="glass-card p-6 rounded-2xl" variants={itemVariants}>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-4 uppercase tracking-wider">
            <LayoutGrid size={16} className="text-primary" /> Website Features
          </label>
          <div className="flex flex-wrap gap-3">
            {featuresList.map(feature => {
              const Icon = feature.icon;
              const isActive = selectedFeatures.has(feature.name);
              return (
                <motion.button
                  key={feature.name}
                  onClick={() => toggleFeature(feature.name)}
                  className={`pill-toggle flex items-center gap-2 px-4 py-2.5 rounded-full border-2 text-sm font-semibold cursor-pointer
                    ${isActive 
                      ? 'active' 
                      : 'border-slate-200 bg-white text-slate-600 hover:border-primary/40 hover:text-primary'
                    }
                  `}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={16} />
                  {feature.name}
                </motion.button>
              );
            })}
          </div>
          {selectedFeatures.size > 0 && (
            <motion.p 
              className="mt-3 text-xs text-primary font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {selectedFeatures.size} feature{selectedFeatures.size > 1 ? 's' : ''} selected
            </motion.p>
          )}
        </motion.div>
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
          disabled={filledCount < 5}
          className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold text-white relative overflow-hidden transition-all duration-300 ${
            filledCount === 5 
              ? 'cta-glow hover:-translate-y-1' 
              : 'opacity-60 cursor-not-allowed grayscale'
          }`}
          whileHover={filledCount === 5 ? { scale: 1.03 } : {}}
          whileTap={filledCount === 5 ? { scale: 0.97 } : {}}
        >
          <span className="absolute inset-0 bg-gradient-to-r from-primary via-primary-dark to-primary bg-[length:200%_100%] animate-[shimmer_3s_linear_infinite]" />
          <span className="relative">{filledCount === 5 ? "Generate Website" : "Fill all fields"}</span>
          <ArrowRight size={20} className="relative" />
        </motion.button>
      </div>
    </div>
  );
}
