import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { 
  Globe, 
  Download, 
  Share2, 
  ArrowLeft, 
  Save, 
  LayoutDashboard,
  CheckCircle2,
  PartyPopper,
  Rocket,
  Loader2,
  ExternalLink,
  Check,
  Search,
  Server,
  Lock,
  Copy,
  QrCode,
  Link
} from "lucide-react";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const exportOptions = [
  {
    id: "domain",
    title: "Publish to Domain",
    desc: "Go live instantly with your custom domain",
    icon: Globe,
    action: "Connect Domain",
    successMsg: "🌐 Domain connected! Your site is live.",
    recommended: true,
    color: "#8b5cf6",
    bgColor: "bg-gradient-to-r from-primary/10 to-indigo-500/10",
    activeBg: "bg-gradient-to-r from-primary to-indigo-600",
  },
  {
    id: "download",
    title: "Export Website Files",
    desc: "Download HTML, CSS & JS as a ZIP file",
    icon: Download,
    action: "Download ZIP",
    successMsg: "📦 ZIP file downloaded successfully!",
    recommended: false,
    color: "#10b981",
    bgColor: "bg-gradient-to-r from-emerald-500/10 to-teal-500/10",
    activeBg: "bg-gradient-to-r from-emerald-500 to-teal-600",
  },
  {
    id: "wordpress",
    title: "Publish to WordPress",
    desc: "Auto-install as a WordPress theme",
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 1c4.962 0 9 4.038 9 9 0 4.963-4.038 9-9 9-4.963 0-9-4.037-9-9 0-4.962 4.037-9 9-9zm-2.5 4.5L12 14l2.5-6.5L12 10 9.5 7.5z"/>
      </svg>
    ),
    action: "Connect WordPress",
    successMsg: "🎨 WordPress theme installed!",
    recommended: false,
    color: "#2563eb",
    bgColor: "bg-gradient-to-r from-blue-500/10 to-sky-500/10",
    activeBg: "bg-gradient-to-r from-[#21759b] to-[#1a5f7f]",
  },
  {
    id: "share",
    title: "Share Preview Link",
    desc: "Get a shareable link for clients & friends",
    icon: Share2,
    action: "Copy Link",
    successMsg: "🔗 Preview link copied to clipboard!",
    recommended: false,
    color: "#a855f7",
    bgColor: "bg-gradient-to-r from-violet-500/10 to-purple-500/10",
    activeBg: "bg-gradient-to-r from-violet-500 to-purple-600",
  }
];

export default function ExportOptions({ onPrev, onReset, generatedSiteData, websiteName, domain, themeColor }: { onPrev: () => void, onReset?: () => void, generatedSiteData?: any, websiteName?: string, domain?: string | null, themeColor?: string }) {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(true);
  const [activeOption, setActiveOption] = useState<string | null>(null);
  const [completedOptions, setCompletedOptions] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isGoingToDashboard, setIsGoingToDashboard] = useState(false);
  
  // State for sub-pages
  const [view, setView] = useState<'main' | 'domain' | 'wordpress' | 'share'>('main');
  const [inputDomain, setInputDomain] = useState("");
  const [wpUrl, setWpUrl] = useState("");
  const [wpUser, setWpUser] = useState("");
  const [wpPass, setWpPass] = useState("");
  const [mockLoading, setMockLoading] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    if (view === 'main') {
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [view]);

  const downloadHtml = () => {
    if (!generatedSiteData?.html) return;
    
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${websiteName || "My Website"}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: '${generatedSiteData?.themeColor || themeColor || "#0d9488"}'
          }
        }
      }
    }
  </script>
</head>
<body>
  ${generatedSiteData.html}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(websiteName || "website").toLowerCase().replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOptionClick = (id: string) => {
    if (completedOptions.has(id) || activeOption) return;
    
    if (id === 'download') {
      setActiveOption(id);
      setTimeout(() => {
        downloadHtml();
        setCompletedOptions(prev => new Set(prev).add(id));
        setActiveOption(null);
      }, 1000);
      return;
    }

    // Open corresponding mock page
    setView(id as 'domain' | 'wordpress' | 'share');
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      try {
        const savedProjects = JSON.parse(localStorage.getItem('domaincraft_projects') || '[]');
        const newProject = {
          id: Date.now().toString(),
          name: websiteName || "My Website",
          domain: domain || "unknown",
          themeColor: generatedSiteData?.themeColor || themeColor || "#0d9488",
          html: generatedSiteData?.html || "",
          createdAt: new Date().toISOString()
        };
        savedProjects.unshift(newProject);
        localStorage.setItem('domaincraft_projects', JSON.stringify(savedProjects));
      } catch (e) {
        console.error("Failed to save project", e);
      }

      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }, 1000);
  };

  const handleDashboard = () => {
    setIsGoingToDashboard(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 1000);
  };

  const markCompletedAndReturn = (id: string) => {
    setMockLoading(true);
    setTimeout(() => {
      setMockLoading(false);
      setCompletedOptions(prev => new Set(prev).add(id));
      setView('main');
    }, 2000);
  };

  const confettiParticles = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      backgroundColor: ['#8b5cf6', '#2dd4bf', '#f97316', '#ec4899', '#3b82f6', '#eab308'][i % 6],
      width: `${6 + Math.random() * 8}px`,
      height: `${6 + Math.random() * 8}px`,
      borderRadius: Math.random() > 0.5 ? '50%' : '2px',
      animationDuration: `${1.5 + Math.random() * 2}s`,
      animationDelay: `${Math.random() * 0.8}s`,
    }));
  }, []);

  const renderDomainMockup = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col h-full bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl"
    >
      <div className="bg-gradient-to-r from-primary to-indigo-600 p-6 text-white text-center relative">
        <button onClick={() => setView('main')} className="absolute left-6 top-6 hover:bg-white/20 p-2 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
          <Globe size={32} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold">Connect Custom Domain</h2>
        <p className="text-primary-100 mt-1 text-sm">Make your website live for the world to see.</p>
      </div>

      <div className="p-8 flex-1 flex flex-col gap-6">
        <div>
          <label className="text-sm font-bold text-slate-700 mb-2 block">Enter your domain</label>
          <div className="relative">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="e.g. myawesomebusiness.com"
              value={inputDomain}
              onChange={e => setInputDomain(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-slate-800"
            />
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
          <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
            <Server size={18} className="text-primary" /> Required DNS Records
          </h4>
          <p className="text-xs text-slate-500 mb-4">Add these records to your domain provider (e.g. GoDaddy, Namecheap).</p>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-200 text-sm">
              <div>
                <span className="font-bold text-slate-700 w-12 inline-block">Type</span>
                <span className="text-slate-500">A</span>
              </div>
              <div>
                <span className="font-bold text-slate-700 mr-2">Name</span>
                <span className="text-slate-500">@</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">Value</span>
                <span className="text-primary font-mono">76.223.105.170</span>
              </div>
            </div>
            <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-200 text-sm">
              <div>
                <span className="font-bold text-slate-700 w-12 inline-block">Type</span>
                <span className="text-slate-500">CNAME</span>
              </div>
              <div>
                <span className="font-bold text-slate-700 mr-2">Name</span>
                <span className="text-slate-500">www</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">Value</span>
                <span className="text-primary font-mono">cname.vercel-dns.com</span>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={() => markCompletedAndReturn('domain')}
          disabled={!inputDomain || mockLoading}
          className={`mt-auto w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${
            inputDomain ? 'bg-primary hover:bg-primary-dark shadow-lg shadow-primary/30' : 'bg-slate-300 cursor-not-allowed'
          }`}
        >
          {mockLoading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
          {mockLoading ? "Verifying Records..." : "Verify Connection"}
        </button>
      </div>
    </motion.div>
  );

  const renderWPMockup = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col h-full bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl"
    >
      <div className="bg-gradient-to-r from-[#21759b] to-[#1a5f7f] p-6 text-white text-center relative">
        <button onClick={() => setView('main')} className="absolute left-6 top-6 hover:bg-white/20 p-2 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm border border-white/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 1c4.962 0 9 4.038 9 9 0 4.963-4.038 9-9 9-4.963 0-9-4.037-9-9 0-4.962 4.037-9 9-9zm-2.5 4.5L12 14l2.5-6.5L12 10 9.5 7.5z"/>
          </svg>
        </div>
        <h2 className="text-2xl font-bold">Deploy to WordPress</h2>
        <p className="text-blue-100 mt-1 text-sm">Convert your design into a live WordPress theme instantly.</p>
      </div>

      <div className="p-8 flex-1 flex flex-col gap-5">
        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800 mb-2 flex items-start gap-3">
          <Lock className="text-blue-500 shrink-0 mt-0.5" size={18} />
          <p>We use WordPress Application Passwords to securely push your theme. Your credentials are never stored.</p>
        </div>

        <div>
          <label className="text-sm font-bold text-slate-700 mb-2 block">WordPress URL</label>
          <div className="relative">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="https://yourwebsite.com"
              value={wpUrl}
              onChange={e => setWpUrl(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#21759b] outline-none transition-all font-medium"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-slate-700 mb-2 block">Admin Username</label>
          <input 
            type="text" 
            placeholder="admin_user"
            value={wpUser}
            onChange={e => setWpUser(e.target.value)}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#21759b] outline-none transition-all font-medium"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-slate-700 mb-2 block">Application Password</label>
          <input 
            type="password" 
            placeholder="••••••••••••••••"
            value={wpPass}
            onChange={e => setWpPass(e.target.value)}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#21759b] outline-none transition-all font-medium font-mono"
          />
        </div>

        <button 
          onClick={() => markCompletedAndReturn('wordpress')}
          disabled={!wpUrl || !wpUser || !wpPass || mockLoading}
          className={`mt-auto w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${
            (wpUrl && wpUser && wpPass) ? 'bg-[#21759b] hover:bg-[#1a5f7f] shadow-lg shadow-[#21759b]/30' : 'bg-slate-300 cursor-not-allowed'
          }`}
        >
          {mockLoading ? <Loader2 className="animate-spin" size={20} /> : <Rocket size={20} />}
          {mockLoading ? "Installing Theme..." : "Install WordPress Theme"}
        </button>
      </div>
    </motion.div>
  );

  const renderShareMockup = () => {
    const mockLink = `https://preview.domaincraft.ai/${Math.random().toString(36).substring(2, 8)}`;
    
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="flex flex-col h-full bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl"
      >
        <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-6 text-white text-center relative">
          <button onClick={() => setView('main')} className="absolute left-6 top-6 hover:bg-white/20 p-2 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
            <Share2 size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold">Share Preview Link</h2>
          <p className="text-purple-100 mt-1 text-sm">Send this link to clients, friends, or your team.</p>
        </div>

        <div className="p-8 flex-1 flex flex-col items-center justify-center gap-8 text-center">
          
          <div className="w-48 h-48 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-400 p-4">
            <QrCode size={64} className="text-violet-500 opacity-50" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Scan to View</span>
          </div>

          <div className="w-full">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 block">Your Private Link</label>
            <div className="flex bg-slate-50 border-2 border-slate-200 rounded-xl overflow-hidden p-1">
              <div className="flex-1 px-3 py-3 text-sm font-medium text-slate-600 truncate flex items-center gap-2">
                <Link size={16} className="text-slate-400 shrink-0" />
                {mockLink}
              </div>
              <button 
                onClick={() => {
                  setLinkCopied(true);
                  setTimeout(() => setLinkCopied(false), 2000);
                  markCompletedAndReturn('share');
                }}
                className={`px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
                  linkCopied ? 'bg-emerald-500 text-white' : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
                }`}
              >
                {linkCopied ? <Check size={16} /> : <Copy size={16} />}
                {linkCopied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto relative w-full">
      
      {showConfetti && view === 'main' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
          {confettiParticles.map((particle) => (
            <div
              key={particle.id}
              className="confetti-particle"
              style={{
                left: particle.left,
                top: '-10px',
                backgroundColor: particle.backgroundColor,
                width: particle.width,
                height: particle.height,
                borderRadius: particle.borderRadius,
                animationDuration: particle.animationDuration,
                animationDelay: particle.animationDelay,
              }}
            />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {view === 'domain' && <motion.div key="domain" className="w-full h-full pb-6">{renderDomainMockup()}</motion.div>}
        {view === 'wordpress' && <motion.div key="wordpress" className="w-full h-full pb-6">{renderWPMockup()}</motion.div>}
        {view === 'share' && <motion.div key="share" className="w-full h-full pb-6">{renderShareMockup()}</motion.div>}
        
        {view === 'main' && (
          <motion.div 
            key="main"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col h-full w-full"
          >
            {/* Success Header */}
            <motion.div 
              className="mb-4 text-center shrink-0"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 text-primary font-bold text-xs mb-3"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                <PartyPopper size={14} /> Website Created Successfully!
              </motion.div>
              <h2 className="text-2xl font-extrabold text-slate-800">
                Publish & Export
              </h2>
              <p className="text-slate-500 mt-1 text-sm">Choose how you want to publish or export your website.</p>
            </motion.div>

            {/* Export Options — Bar Buttons */}
            <motion.div 
              className="flex-1 flex flex-col gap-3 min-h-0 overflow-y-auto pr-1 pb-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {exportOptions.map((option) => {
                const Icon = option.icon;
                const isActive = activeOption === option.id;
                const isCompleted = completedOptions.has(option.id);
                
                return (
                  <motion.button
                    key={option.id}
                    variants={itemVariants}
                    onClick={() => handleOptionClick(option.id)}
                    disabled={isActive}
                    className={`relative w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all duration-300 text-left group
                      ${isCompleted 
                        ? 'border-emerald-300 bg-emerald-50/50' 
                        : isActive
                          ? 'border-primary/40 bg-primary/5 scale-[0.99]'
                          : option.recommended 
                            ? 'border-primary/40 bg-white hover:border-primary hover:shadow-lg hover:shadow-primary/10' 
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                      }
                    `}
                    whileHover={!isActive && !isCompleted ? { x: 4 } : {}}
                    whileTap={!isActive && !isCompleted ? { scale: 0.98 } : {}}
                  >
                    {/* Recommended badge */}
                    {option.recommended && !isCompleted && (
                      <div className="absolute -top-2.5 left-5 bg-gradient-to-r from-primary to-primary-dark text-white text-[9px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                        ⭐ Recommended
                      </div>
                    )}
                    
                    {/* Icon */}
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 shadow-sm
                      ${isCompleted
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                        : isActive
                          ? `${option.activeBg} text-white animate-pulse`
                          : `${option.bgColor} text-slate-700`
                      }
                    `}>
                      <AnimatePresence mode="wait">
                        {isCompleted ? (
                          <motion.div key="done" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 500 }}>
                            <Check size={20} strokeWidth={3} />
                          </motion.div>
                        ) : isActive ? (
                          <motion.div key="loading" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            <Loader2 size={20} className="animate-spin" />
                          </motion.div>
                        ) : (
                          <motion.div key="icon"><Icon size={20} /></motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-sm font-bold transition-colors ${isCompleted ? 'text-emerald-700' : 'text-slate-800'}`}>
                        {option.title}
                      </h3>
                      <p className={`text-xs mt-0.5 transition-colors ${isCompleted ? 'text-emerald-600' : 'text-slate-500'}`}>
                        {isCompleted ? option.successMsg : isActive ? 'Processing...' : option.desc}
                      </p>
                    </div>
                    
                    {/* Action button / Status */}
                    <div className="shrink-0">
                      {isCompleted ? (
                        <motion.div 
                          initial={{ scale: 0 }} 
                          animate={{ scale: 1 }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold"
                        >
                          <CheckCircle2 size={14} /> Done
                        </motion.div>
                      ) : isActive ? (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                          <Loader2 size={14} className="animate-spin" /> Working...
                        </div>
                      ) : (
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all
                          ${option.recommended 
                            ? 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white' 
                            : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                          }
                        `}>
                          {option.action} <ExternalLink size={12} />
                        </div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Footer Navigation */}
            <div className="mt-auto pt-3 flex flex-col sm:flex-row items-center justify-between border-t border-slate-200/60 shrink-0 gap-3">
              <button 
                onClick={onPrev}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full text-slate-600 font-semibold hover:bg-white/80 transition-colors w-full sm:w-auto justify-center text-sm"
              >
                <ArrowLeft size={18} /> Previous
              </button>
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button 
                  onClick={handleSave}
                  disabled={isSaving || isSaved}
                  className={`flex-1 sm:flex-none items-center justify-center gap-2 px-5 py-2.5 rounded-full font-bold transition-colors flex border text-sm
                    ${isSaved 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                      : 'text-slate-600 hover:bg-white/80 border-slate-200 bg-white'
                    }
                  `}
                >
                  {isSaving ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : isSaved ? (
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  ) : (
                    <Save size={16} />
                  )}
                  {isSaving ? "Saving..." : isSaved ? "Saved!" : "Save Project"}
                </button>
                <motion.button 
                  onClick={handleDashboard}
                  disabled={isGoingToDashboard}
                  className="flex-1 sm:flex-none items-center justify-center gap-2 px-6 py-2.5 rounded-full font-bold text-white relative overflow-hidden cta-glow flex text-sm"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-primary via-primary-dark to-primary bg-[length:200%_100%] animate-[shimmer_3s_linear_infinite]" />
                  <span className="relative flex items-center gap-2">
                    {isGoingToDashboard ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <LayoutDashboard size={16} />
                    )}
                    {isGoingToDashboard ? "Loading..." : "Dashboard"}
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

