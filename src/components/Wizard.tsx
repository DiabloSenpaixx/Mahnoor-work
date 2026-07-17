"use client";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import RobotAssistant from "./RobotAssistant";
import LandingPage from "./screens/LandingPage";
import DomainSelection from "./screens/DomainSelection";
import WebsiteRequirements from "./screens/WebsiteRequirements";
import GeneratingState from "./screens/GeneratingState";
import WebsitePreview from "./screens/WebsitePreview";
import CustomizeChat from "./screens/CustomizeChat";
import AccessibilityCheck from "./screens/AccessibilityCheck";
import ExportOptions from "./screens/ExportOptions";

const STEPS = [
  "Welcome",
  "Domain",
  "Questions",
  "Generating",
  "Preview",
  "Customize",
  "Accessibility",
  "Export",
];

export default function Wizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [websiteName, setWebsiteName] = useState("");
  const [aiCustomizeMessage, setAiCustomizeMessage] = useState("Customize With Natural Language. Just tell me what you want to change!");
  const [themeColor, setThemeColor] = useState("teal");
  const [darkMode, setDarkMode] = useState(false);
  const [generatingStepIndex, setGeneratingStepIndex] = useState(0);
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set());
  const [targetAudience, setTargetAudience] = useState("");
  const [mainGoal, setMainGoal] = useState("");
  const [designStyle, setDesignStyle] = useState("");
  const [generatedSiteData, setGeneratedSiteData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const contentAreaRef = useRef<HTMLDivElement>(null);

  // Scroll to top on step change
  useEffect(() => {
    if (contentAreaRef.current) {
      contentAreaRef.current.scrollTop = 0;
    }
  }, [currentStep]);

  const generatingMessages = [
    "🔍 Hmm let me read your requirements... *adjusts tiny glasses*",
    "🎨 Ooh picking the perfect template! This one's gonna look AMAZING ✨",
    "🏗️ Building your layout brick by brick... I'm basically a tiny architect!",
    "✍️ Writing beautiful content... Shakespeare who? 😎",
    "🚀 Almost done! Just adding the final sparkle... *chef's kiss*"
  ];

  const handleChatAction = async (text: string) => {
    setAiCustomizeMessage("Thinking...");
    try {
      const res = await fetch("/api/customize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userPrompt: text,
          currentSiteData: generatedSiteData || {},
        }),
      });
      const data = await res.json();
      if (data && !data.error) {
        setGeneratedSiteData(data);
        if (data.themeColor) {
          setThemeColor(data.themeColor);
        }
        setAiCustomizeMessage("I've updated that for you! Check out the preview.");
      } else {
        setAiCustomizeMessage("Sorry, I encountered an error updating the site.");
      }
    } catch (error) {
      console.error(error);
      setAiCustomizeMessage("Oops, something went wrong.");
    }
  };

  const generateWebsite = async () => {
    try {
      setGenerationError(null);
      const featuresArray = Array.from(selectedFeatures);
      const featuresString = featuresArray.join(", ");
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: selectedDomain,
          websiteName,
          features: featuresString,
          targetAudience,
          mainGoal,
          designStyle
        }),
      });
      const data = await res.json();
      if (data && !data.error) {
        setGeneratedSiteData(data);
        if (data.themeColor) {
          setThemeColor(data.themeColor);
        }
      } else {
        console.error("Generation error:", data.error);
        setGenerationError(data.error || "Unknown error occurred.");
      }
    } catch (e: any) {
      console.error("Fetch error:", e);
      setGenerationError(e.message || "Network error occurred.");
    }
  };

  const nextStep = () => {
    if (currentStep === 3) {
      setIsGenerating(true);
      generateWebsite().finally(() => setIsGenerating(false));
    }
    setCurrentStep((prev) => Math.min(prev + 1, 8));
  };
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  const setStep = (step: number) => setCurrentStep(step);

  const getRobotMessage = () => {
    switch (currentStep) {
      case 1:
        return "Hi there! I'm your AI assistant. Let's build your perfect website together.";
      case 2:
        return "What type of website do you want to build? Choose the option that best describes your goal.\n\nTip: You can always change this later.";
      case 3:
        return "Let's understand your needs. The more detail you provide, the better the result!";
      case 4:
        return generatingMessages[generatingStepIndex] || generatingMessages[0];
      case 5:
        return "Great! Your Website is ready. Check out the preview on the right.";
      case 6:
        return aiCustomizeMessage;
      case 7:
        return "I've run an accessibility check to ensure everyone can use your new site.";
      case 8:
        return "Your Website is good to go! What would you like to do next?";
      default:
        return "Hello!";
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <LandingPage onNext={nextStep} />;
      case 2:
        return <DomainSelection onNext={nextStep} onPrev={prevStep} selectedDomain={selectedDomain} onSelect={setSelectedDomain} />;
      case 3:
        return <WebsiteRequirements 
          onNext={nextStep} 
          onPrev={prevStep} 
          websiteName={websiteName} 
          onNameChange={setWebsiteName} 
          selectedFeatures={selectedFeatures} 
          onFeaturesChange={setSelectedFeatures} 
          targetAudience={targetAudience}
          onTargetAudienceChange={setTargetAudience}
          mainGoal={mainGoal}
          onMainGoalChange={setMainGoal}
          designStyle={designStyle}
          onDesignStyleChange={setDesignStyle}
        />;
      case 4:
        return <GeneratingState onNext={nextStep} onCancel={() => setStep(3)} onStepChange={setGeneratingStepIndex} isGenerating={isGenerating} />;
      case 5:
        return <WebsitePreview onNext={nextStep} onPrev={prevStep} domain={selectedDomain} websiteName={websiteName} themeColor={themeColor} onExport={() => setStep(8)} darkMode={darkMode} generatedSiteData={generatedSiteData} generationError={generationError} />;
      case 6:
        return <CustomizeChat onNext={nextStep} onPrev={prevStep} themeColor={themeColor} domain={selectedDomain} websiteName={websiteName} darkMode={darkMode} generatedSiteData={generatedSiteData} />;
      case 7:
        return <AccessibilityCheck onNext={nextStep} onPrev={prevStep} generatedSiteData={generatedSiteData} onUpdateHtml={(html) => setGeneratedSiteData({ ...generatedSiteData, html })} />;
      case 8:
        return <ExportOptions onPrev={prevStep} onReset={() => setStep(1)} generatedSiteData={generatedSiteData} websiteName={websiteName} domain={selectedDomain} themeColor={themeColor} />;
      default:
        return <LandingPage onNext={nextStep} />;
    }
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row overflow-hidden bg-white">
      {/* Left Panel: Robot Assistant (30%) */}
      <AnimatePresence>
        {currentStep > 1 && (
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="w-full md:w-[30%] h-[40vh] md:h-full shrink-0 shadow-xl z-20 bg-white"
          >
            <RobotAssistant stepMessage={getRobotMessage()} showChat={currentStep === 6} onChatAction={handleChatAction} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right Panel: Content (70% or 100%) */}
      <div className={`w-full ${currentStep > 1 ? 'md:w-[70%] flex-1 noise-overlay mesh-gradient' : 'md:w-full h-full'} h-full flex flex-col relative overflow-hidden transition-all duration-500`}>
        
        {/* Stepper Navigation (Only show after step 1) */}
        {currentStep > 1 && (
          <div className="w-full px-4 sm:px-6 xl:px-10 py-2 sm:py-3 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl z-10 shrink-0">
            <div className="flex items-center justify-between max-w-4xl mx-auto overflow-x-auto no-scrollbar pb-1 sm:pb-0">
              {STEPS.map((step, index) => {
                const stepNumber = index + 1;
                const isActive = currentStep === stepNumber;
                const isPast = currentStep > stepNumber;
                return (
                  <div key={step} className="flex items-center shrink-0">
                    <div className="flex flex-col items-center gap-1 sm:gap-2">
                      {/* Step circle */}
                      <motion.div 
                        className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-500
                          ${isActive 
                            ? 'bg-gradient-to-br from-primary to-primary-dark text-white step-glow scale-110' 
                            : isPast 
                              ? 'bg-gradient-to-br from-secondary/80 to-secondary text-white shadow-md' 
                              : 'bg-slate-100 text-slate-400 border border-slate-200'
                          }`}
                        layout
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        {isPast ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500 }}
                          >
                            <Check size={14} strokeWidth={3} />
                          </motion.div>
                        ) : (
                          stepNumber
                        )}
                      </motion.div>
                      <span className={`text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider hidden md:block transition-colors duration-300
                        ${isActive ? 'text-primary' : isPast ? 'text-secondary-dark' : 'text-slate-400'}`}
                      >
                        {step}
                      </span>
                    </div>
                    {index < STEPS.length - 1 && (
                      <div className="w-4 sm:w-6 xl:w-12 h-[2px] sm:h-[3px] mx-1 sm:mx-1.5 rounded-full overflow-hidden bg-slate-100 shrink-0">
                        <motion.div 
                          className="h-full rounded-full progress-line"
                          initial={{ width: "0%" }}
                          animate={{ width: isPast ? "100%" : "0%" }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Content Area */}
        <div 
          ref={contentAreaRef}
          className={`flex-1 overflow-y-auto relative z-[1] flex flex-col min-h-0 ${currentStep === 1 ? '' : 'p-4 md:p-6'}`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className={`w-full flex-1 h-full flex flex-col mx-auto ${currentStep === 1 ? '' : 'max-w-5xl'}`}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
