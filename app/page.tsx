'use client';

import { useState } from 'react';
import { analyzeRepo, AnalysisResult } from './actions';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Leaf, 
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
    <div className="min-h-screen w-full bg-[#0a0f0d] text-zinc-100 selection:bg-emerald-500/30 flex flex-col">
      
      {/* Background Ambience - Subtle */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-emerald-900/10 blur-[100px] rounded-full opacity-30" />
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-6 pt-20 pb-10">
        
        {/* Hero Section - Matching Reference Spacing */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center space-y-6"
        >
           {/* Icon Badge - Small and Circular like reference */}
            <div className="p-3 rounded-full bg-zinc-900/50 border border-zinc-800 text-emerald-500 shadow-sm">
              <Leaf size={24} strokeWidth={2} />
            </div>

            <div className="space-y-3 max-w-lg">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                Green Repo
              </h1>
              <p className="text-lg text-zinc-400 font-light leading-relaxed">
                Curious how green your code is? <br />Check your repo’s eco-friendliness in just a few seconds.
              </p>
            </div>
        </motion.div>

        {/* Input Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-xl mt-12 mb-12"
        >
          <div className="relative group">
            {/* Input Container */}
            <div className="relative bg-[#0F1412] border border-zinc-800 rounded-full p-2 flex items-center shadow-xl shadow-black/20 transition-all focus-within:border-emerald-500/30 focus-within:ring-1 focus-within:ring-emerald-500/30">
              <form action={handleSubmit} className="flex items-center w-full gap-3">
                <div className="pl-3 text-zinc-500">
                  <Github size={20} />
                </div>
                <input
                  name="url"
                  type="text"
                  placeholder="github.com/username/repo"
                  required
                  className="flex-1 bg-transparent border-none text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-0 py-3 text-base font-light w-full"
                  autoComplete="off"
                  autoCorrect="off"
                  autoFocus={true}
                  spellCheck={false}
                  inputMode="url"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-emerald-600 hover:bg-emerald-800 text-zinc-200 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      <span>Analyzing</span>
                    </>
                  ) : (
                    <>
                      <span>Generate</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence mode='wait'>
          {result && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full max-w-3xl mb-12"
            >
              {result.error ? (
                <div className="bg-red-500/5 border border-red-500/10 text-red-200 p-4 rounded-xl flex items-center gap-4 justify-center text-sm">
                  <AlertTriangle className="text-red-500" size={18} />
                  <p>{result.error}</p>
                </div>
              ) : result.score && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 bg-[#131816]/50 border border-zinc-800/60 rounded-2xl p-6">
                  {/* Badge */}
                  <div className="md:col-span-2 flex flex-col items-center justify-center p-4 bg-zinc-950/30 rounded-xl border border-zinc-800/30">
                    <img
                      src={`/api/badge?score=${result.score.score}`}
                      alt="Green Score Badge"
                      className="w-32 h-auto drop-shadow-xl mb-3 hover:scale-105 transition-transform"
                    />
                    <div className="text-center">
                      <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-medium">Grade</p>
                      <p className={cn(
                        "text-2xl font-light",
                        result.score.grade === 'S' ? 'text-gray-300 shadow' :
                        result.score.grade === 'A' ? 'text-yellow-400' :
                        result.score.grade === 'B' ? 'text-orange-400' : 'text-red-600'
                      )}>{result.score.grade}</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="md:col-span-3 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-lg text-white font-medium">Analysis Report</h3>
                      <p className="text-zinc-500 text-xs font-mono">{result.repoDetails?.owner}/{result.repoDetails?.repo}</p>
                      
                      <div className="mt-4 space-y-2">
                        {/* Positive Reasons */}
                        {result.score.breakdown.positiveReasons && result.score.breakdown.positiveReasons.map((reason, idx) => (
                          <div key={`pos-${idx}`} className="text-zinc-400 text-xs flex items-start gap-2">
                            <span className="text-emerald-400 mt-0.5">•</span> {reason}
                          </div>
                        ))}

                         {result.score.breakdown.reasons.length === 0 ? (
                          <div className="text-emerald-400/80 text-sm flex items-center gap-2">
                             <CheckCircle2 size={16} /> No major issues found.
                          </div>
                        ) : (
                          result.score.breakdown.reasons.map((reason, idx) => (
                            <div key={idx} className="text-zinc-400 text-xs flex items-start gap-2">
                              <span className="text-red-400 mt-0.5">•</span> {reason}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-zinc-800/50">
                       <p className="text-[10px] text-zinc-500 mb-1">MARKDOWN BADGE</p>
                       <code className="block w-full bg-black/30 p-2 rounded text-[10px] text-zinc-500 font-mono break-all border border-zinc-800/50">
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

      {/* Footer Section - Matches Reference Layout */}
      <footer className="w-full">
        {/* Divider Line */}
        
        <div className="max-w-4xl mx-auto px-6 py-8 md:py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            
            {/* Left: Created By */}
            <div className="text-sm font-light text-zinc-500">
              Created by <a href="#" className="text-zinc-300 hover:text-emerald-400 underline decoration-zinc-700 underline-offset-4 transition-colors">Nikhil Parmar</a>
            </div>

            {/* Right: ShillGuard Card */}
            <a 
              href="#" 
              className="group flex items-center gap-4 p-4 rounded-xl border border-zinc-800 bg-[#0F1412] hover:bg-zinc-900/50 hover:border-zinc-700 transition-all duration-300 w-full md:w-auto md:min-w-[320px]"
            >
              <div className="h-10 w-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-emerald-400 transition-colors">
                <ShieldCheck strokeWidth={1.5} size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-zinc-200">ShillGuard</h4>
                  <ExternalLink size={12} className="text-zinc-600 group-hover:text-zinc-400" />
                </div>
                <p className="text-xs text-zinc-500 mt-1 font-light truncate group-hover:text-zinc-400 transition-colors">
                  Your repo is green, now it&apos;s time to market the product.
                </p>
              </div>
            </a>

          </div>
        </div>
      </footer>
    </div>
  );
}