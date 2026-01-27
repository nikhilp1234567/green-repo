'use client';

import { useState } from 'react';
import { analyzeRepo, AnalysisResult } from './actions';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Leaf, 
  Cpu, 
  Database, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2,
  Github,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setResult(null);
    try {
      const res = await analyzeRepo(formData);
      setResult(res);
    } catch (e) {
      console.error(e);
      setResult({ success: false, error: 'An unexpected error occurred.' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#0a0f0d] text-zinc-100 font-sans selection:bg-emerald-500/30 flex flex-col">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-900/20 blur-[120px] rounded-full opacity-40" />
        <div className="absolute bottom-[-10%] left-0 w-[600px] h-[600px] bg-teal-900/10 blur-[120px] rounded-full opacity-30" />
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-5xl mx-auto px-6 py-20 lg:py-32">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center space-y-8 max-w-3xl"
        >
           {/* Logo Badge */}
           <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative p-4 rounded-full bg-[#0a0f0d] border border-zinc-800 text-emerald-500 shadow-2xl">
              <Leaf size={32} strokeWidth={1.5} />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
              Green Repo
            </h1>
            <h2 className="text-xl md:text-2xl font-light tracking-wide text-zinc-400">
              Evaluate your repository's <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 font-medium">
               carbon footprint & efficiency.
              </span>
            </h2>
          </div>
        </motion.div>

        {/* Input Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-lg mt-12 relative z-20"
        >
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
            
            <div className="relative bg-[#0F1412] border border-zinc-800 rounded-full p-2 flex items-center shadow-2xl shadow-black/50 transition-all focus-within:border-emerald-500/30 focus-within:bg-[#131a17]">
              <form action={handleSubmit} className="flex items-center w-full gap-3">
                <div className="pl-4 text-zinc-500 group-focus-within:text-emerald-500 transition-colors">
                  <Github size={20} />
                </div>
                <input
                  name="url"
                  type="text"
                  placeholder="github.com/username/repo"
                  required
                  className="flex-1 bg-transparent border-none text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-0 py-3 text-base font-light w-full"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-zinc-800 hover:bg-emerald-600 text-zinc-200 hover:text-white p-3 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
                </button>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Feature Cards (Only show if no result yet) */}
        {!result && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-4"
          >
            <FeatureCard 
              icon={<Cpu className="text-emerald-400" size={20} />}
              title="Compute Intensity"
              description="Detects heavy AI/ML libraries and high-compute patterns."
            />
            <FeatureCard 
              icon={<Database className="text-teal-400" size={20} />}
              title="Digital Bloat"
              description="Analyzes large asset files and unoptimized storage usage."
            />
            <FeatureCard 
              icon={<Leaf className="text-green-400" size={20} />}
              title="Language Efficiency"
              description="Evaluates the energy consumption of your tech stack."
            />
          </motion.div>
        )}

        {/* Results Section */}
        <AnimatePresence mode='wait'>
          {result && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="w-full max-w-4xl mt-16"
            >
              {result.error ? (
                <div className="bg-red-500/5 border border-red-500/10 text-red-200 p-6 rounded-2xl flex items-center gap-4 justify-center">
                  <AlertTriangle className="text-red-500" size={24} />
                  <p className="font-light">{result.error}</p>
                </div>
              ) : result.score && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 bg-[#131816]/80 backdrop-blur-xl border border-zinc-800/60 rounded-3xl p-8 shadow-2xl">
                  
                  {/* Left Column: Badge */}
                  <div className="md:col-span-2 flex flex-col items-center justify-center p-6 bg-zinc-950/50 rounded-2xl border border-zinc-800/40">
                    <img
                      src={`/api/badge?score=${result.score.score}`}
                      alt="Green Score Badge"
                      className="w-full max-w-[240px] h-auto drop-shadow-2xl mb-6 hover:scale-105 transition-transform duration-500"
                    />
                    <div className="text-center">
                      <p className="text-zinc-500 text-xs uppercase tracking-[0.2em] font-medium mb-1">Environmental Grade</p>
                      <p className={cn(
                        "text-4xl font-light tracking-tight",
                        result.score.grade === 'A+' ? 'text-emerald-400' :
                        result.score.grade === 'B' ? 'text-blue-400' :
                        result.score.grade === 'C' ? 'text-yellow-400' : 'text-red-400'
                      )}>{result.score.grade}</p>
                    </div>
                  </div>

                  {/* Right Column: Breakdown */}
                  <div className="md:col-span-3 flex flex-col justify-between">
                    <div>
                      <div className="mb-6">
                        <h3 className="text-xl text-white font-medium">Analysis Report</h3>
                        <p className="text-zinc-500 text-sm font-mono mt-1">{result.repoDetails?.owner} / {result.repoDetails?.repo}</p>
                      </div>

                      <div className="space-y-4 mb-8">
                        {result.score.breakdown.reasons.length === 0 ? (
                          <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-3">
                            <CheckCircle2 className="text-emerald-500" size={20} />
                            <p className="text-emerald-200/80 font-light text-sm">Excellent! No major inefficiencies detected.</p>
                          </div>
                        ) : (
                          <ul className="space-y-3">
                            {result.score.breakdown.reasons.map((reason, idx) => (
                              <motion.li 
                                key={idx}
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="text-zinc-300 font-light text-sm flex items-start gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/5"
                              >
                                <AlertTriangle className="text-red-400 shrink-0 mt-0.5" size={16} />
                                <span>{reason}</span>
                              </motion.li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-zinc-800/50">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Badge Markdown</p>
                        <span className="text-[10px] text-emerald-500/80">Copy to README.md</span>
                      </div>
                      <code className="block w-full bg-black/40 hover:bg-black/60 p-3 rounded-lg text-xs text-zinc-400 font-mono break-all border border-zinc-800 transition-colors cursor-text selection:bg-emerald-500/30">
                        [![Green Score]({typeof window !== 'undefined' ? window.location.origin : 'https://green-repo.vercel.app'}/api/badge?score={result.score.score})](https://green-repo.vercel.app)
                      </code>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Section */}
      <footer className="relative z-10 w-full border-t border-zinc-900 bg-[#0a0f0d]">
        <div className="max-w-5xl mx-auto px-6 py-8 md:py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-4">
            
            {/* Left: Created By */}
            <div className="flex flex-col space-y-2">
              <p className="text-zinc-500 text-sm font-light">
                Created by <a href="#" className="text-zinc-300 hover:text-white underline decoration-zinc-700 underline-offset-4 transition-colors">Nikhil Parmar</a>
              </p>
              <p className="text-zinc-600 text-xs">
                &copy; {new Date().getFullYear()} Green Repo. Open source sustainability.
              </p>
            </div>

            {/* Right: Promo Card (ShillGuard Style) */}
            <a 
              href="#" 
              className="group flex items-center gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/60 hover:border-zinc-700 transition-all duration-300 max-w-sm w-full md:w-auto"
            >
              <div className="h-12 w-12 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-emerald-400 transition-colors">
                <ShieldCheck strokeWidth={1.5} size={24} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-zinc-200">ShillGuard</h4>
                  <ExternalLink size={12} className="text-zinc-600 group-hover:text-zinc-400" />
                </div>
                <p className="text-xs text-zinc-500 mt-1 font-light leading-relaxed group-hover:text-zinc-400">
                  You have your startup hypothesis, now it's time to market it.
                </p>
              </div>
            </a>

          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-zinc-900/20 border border-zinc-800/60 hover:bg-zinc-800/40 hover:border-zinc-700/60 transition-all duration-300 group">
      <div className="w-10 h-10 rounded-xl bg-zinc-950/50 flex items-center justify-center border border-zinc-800/50 mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-base font-medium text-zinc-200 mb-2">{title}</h3>
      <p className="text-zinc-500 leading-relaxed text-sm font-light">
        {description}
      </p>
    </div>
  );
}