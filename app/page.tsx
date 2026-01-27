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
  Github
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
    <div className="min-h-screen bg-[#0a0f0d] text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-teal-900/10 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 flex flex-col items-center max-w-5xl mx-auto px-6 py-20 min-h-screen">
        
        {/* Header / Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6 max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 p-3 rounded-full bg-emerald-900/20 border border-emerald-800/30 text-emerald-400/80 text-xs font-medium mb-4 tracking-wide uppercase">
            <Leaf size={24} />
          </div>
          
          <h1 className="text-5xl md:text-8xl font-semibold tracking-tight text-white">
          Evaluate your repository's <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-500 font-light">
             carbon footprint.
            </span>
          </h1>
          
        </motion.div>

        {/* Input Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-xl mt-12"
        >
          <div className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800 rounded-full p-1.5 focus-within:ring-1 focus-within:ring-emerald-500/30 focus-within:border-emerald-500/30 transition-all shadow-xl shadow-emerald-900/5">
            <form action={handleSubmit} className="flex items-center gap-2">
              <div className="pl-4 text-zinc-600">
                <Github size={18} />
              </div>
              <input
                name="url"
                type="text"
                placeholder="github.com/username/repo"
                required
                className="flex-1 bg-transparent border-none text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-0 py-2.5 text-base font-light"
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-emerald-600/90 hover:bg-emerald-500 text-white/90 font-medium p-2.5 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[44px]"
              >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <ArrowRight size={18} />}
              </button>
            </form>
          </div>
        </motion.div>

        {/* Scoring Criteria (Only show if no result yet to keep it clean, or keep below?) -> Let's keep below for context */}
        {!result && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
          >
            <FeatureCard 
              icon={<Cpu className="text-emerald-400/80" size={20} />}
              title="Compute Intensity"
              description="We detect heavy AI/ML libraries and crypto miners that unnecessarily drain CPU & GPU cycles."
            />
            <FeatureCard 
              icon={<Database className="text-teal-400/80" size={20} />}
              title="Digital Bloat"
              description="Large repositories and unoptimized assets increase bandwidth usage and storage energy costs."
            />
            <FeatureCard 
              icon={<Leaf className="text-green-400/80" size={20} />}
              title="Language Efficiency"
              description="Compiled languages like Rust & C consume significantly less energy than interpreted ones like Python."
            />
          </motion.div>
        )}

        {/* Results Section */}
        <AnimatePresence mode='wait'>
          {result && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="w-full max-w-4xl mt-16"
            >
              {result.error ? (
                <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-6 rounded-lg flex items-center gap-4">
                  <AlertTriangle className="text-red-500" />
                  <p className="font-light">{result.error}</p>
                </div>
              ) : result.score && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-2xl p-8 shadow-xl">
                  
                  {/* Left Column: Badge & Score */}
                  <div className="lg:col-span-2 flex flex-col items-center justify-center p-6 bg-zinc-950/30 rounded-xl border border-zinc-800/30">
                    <img
                      src={`/api/badge?score=${result.score.score}`}
                      alt="Green Score Badge"
                      className="w-full h-auto drop-shadow-lg mb-6 hover:scale-105 transition-transform duration-300"
                    />
                    <div className="text-center space-y-1">
                      <p className="text-zinc-500 text-xs uppercase tracking-widest font-medium">Environmental Grade</p>
                      <p className={cn(
                        "text-4xl font-light",
                        result.score.grade === 'A+' ? 'text-emerald-400' :
                        result.score.grade === 'B' ? 'text-blue-400' :
                        result.score.grade === 'C' ? 'text-yellow-400' : 'text-red-400'
                      )}>{result.score.grade}</p>
                    </div>
                  </div>

                  {/* Right Column: Breakdown */}
                  <div className="lg:col-span-3 flex flex-col justify-center space-y-6">
                    <div>
                      <h3 className="text-xl font-light text-white mb-1">Analysis Results</h3>
                      <p className="text-zinc-500 text-sm font-light">for <span className="text-zinc-400">{result.repoDetails?.owner}/{result.repoDetails?.repo}</span></p>
                    </div>

                    <div className="space-y-4">
                      {result.score.breakdown.reasons.length === 0 ? (
                        <p className="text-emerald-400/90 font-light flex items-center gap-2">
                          <CheckCircle2 size={18} />
                          No inefficiencies detected.
                        </p>
                      ) : (
                        <ul className="space-y-2">
                          {result.score.breakdown.reasons.map((reason, idx) => (
                            <motion.li 
                              key={idx}
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="text-zinc-300 font-light text-sm flex items-start gap-2"
                            >
                              <span className="text-red-400/80 mt-1">•</span>
                              {reason}
                            </motion.li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="pt-4 border-t border-zinc-800/50">
                      <p className="text-[10px] text-zinc-600 mb-2 uppercase tracking-widest font-medium">Badge Markdown</p>
                      <code className="block w-full bg-[#050505]/50 p-3 rounded-md text-xs text-zinc-500 font-mono break-all border border-zinc-800/50 focus:outline-none selection:bg-emerald-900/30 cursor-text hover:text-zinc-400 transition-colors">
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
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-xl bg-zinc-900/20 border border-zinc-800/40 hover:bg-zinc-800/20 transition-colors group">
      <div className="w-10 h-10 rounded-lg bg-zinc-950/50 flex items-center justify-center border border-zinc-800/50 mb-4 group-hover:border-zinc-700/50 transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-zinc-200 mb-2">{title}</h3>
      <p className="text-zinc-500 leading-relaxed text-sm font-light">
        {description}
      </p>
    </div>
  );
}
