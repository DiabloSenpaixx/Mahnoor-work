"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Globe, Clock, LayoutDashboard, Plus, Trash2, ExternalLink } from "lucide-react";

export default function Dashboard() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('domaincraft_projects');
    if (saved) {
      try {
        setProjects(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse projects", e);
      }
    }
  }, []);

  const handleDelete = (id: string) => {
    const filtered = projects.filter(p => p.id !== id);
    setProjects(filtered);
    localStorage.setItem('domaincraft_projects', JSON.stringify(filtered));
  };

  const handleDownload = (project: any) => {
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.name || "My Website"}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = { theme: { extend: { colors: { primary: '${project.themeColor || "#0d9488"}' } } } }
  </script>
</head>
<body>
  ${project.html}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(project.name || "website").toLowerCase().replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
              <LayoutDashboard className="text-primary" size={32} /> My Dashboard
            </h1>
            <p className="text-slate-500 mt-1">Manage your generated websites and projects.</p>
          </div>
          
          <Link 
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <Plus size={18} /> New Website
          </Link>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="text-slate-300" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No projects yet</h3>
            <p className="text-slate-500 mb-6">You haven't saved any websites to your dashboard yet.</p>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-all"
            >
              Start Generating
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5" style={{ backgroundColor: project.themeColor }}></div>
                
                <div className="flex justify-between items-start mb-4 mt-2">
                  <h3 className="font-bold text-lg text-slate-800 line-clamp-1">{project.name}</h3>
                  <button 
                    onClick={() => handleDelete(project.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                    title="Delete project"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Globe size={14} className="text-slate-400" />
                    <span className="truncate">{project.domain}.domaincraft.ai</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock size={14} className="text-slate-400" />
                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                  <button 
                    onClick={() => handleDownload(project)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-semibold rounded-lg transition-colors border border-slate-200"
                  >
                    Download HTML
                  </button>
                  <button 
                    onClick={() => {
                      // Open a basic preview in a new tab using a data URL
                      const fullHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${project.name}</title><script src="https://cdn.tailwindcss.com"></script><script>tailwind.config={theme:{extend:{colors:{primary:'${project.themeColor}'}}}}</script></head><body>${project.html}</body></html>`;
                      const newWindow = window.open();
                      if (newWindow) {
                        newWindow.document.write(fullHtml);
                        newWindow.document.close();
                      }
                    }}
                    className="p-2 text-slate-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors border border-transparent"
                    title="Preview"
                  >
                    <ExternalLink size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
