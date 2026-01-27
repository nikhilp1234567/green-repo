'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  AlertTriangle, 
  Copy,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { AnalysisResult } from '../actions';

interface ResultsProps {
  result: AnalysisResult;
  onRetry: () => void;
}

export default function Results({ result, onRetry }: ResultsProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      key="results"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full"
    >
      {result.error ? (
        <div className="max-w-xl mx-auto bg-red-500/5 border border-red-500/10 text-red-200 p-6 rounded-2xl flex flex-col items-center gap-4 text-center">
          <AlertTriangle className="text-red-500" size={32} />
          <div>
            <h3 className="text-lg font-medium">Analysis Failed</h3>
            <p className="text-zinc-400 mt-1">{result.error}</p>
          </div>
          <button onClick={onRetry} className="text-sm underline hover:text-white transition-colors">Try again</button>
        </div>
      ) : result.score && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Big Badge Card */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="bg-[#131816]/80 backdrop-blur-sm border border-zinc-800 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden group"
            >
              {/* Decorative Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950/50 pointer-events-none" />
              <div className={cn(
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[80px] opacity-20 pointer-events-none",
                result.score.grade === 'S' ? "bg-emerald-500" : 
                result.score.grade === 'A' ? "bg-blue-500" : 
                result.score.grade === 'B' ? "bg-yellow-500" : "bg-red-500"
              )} />

              <img
                src={`/api/badge?score=${result.score.score}`}
                alt="Green Score Badge"
                className="w-64 h-auto drop-shadow-2xl relative z-10 hover:scale-105 transition-transform duration-500"
              />

              <div className="mt-8 text-center relative z-10 space-y-1">
                <h2 className="text-3xl font-bold text-white tracking-tight">{result.repoDetails?.owner}</h2>
                <p className="text-zinc-400 font-mono text-sm">{result.repoDetails?.repo}</p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Details Grid */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Good Points */}
              <div className="bg-[#131816]/50 border border-emerald-900/30 rounded-2xl p-6 hover:bg-[#131816] transition-colors">
                <div className="flex items-center gap-3 mb-4 text-emerald-400">
                  <ThumbsUp size={20} />
                  <h3 className="font-medium text-zinc-200">Eco Wins</h3>
                </div>
                <ul className="space-y-3">
                  {result.score.breakdown.positiveReasons && result.score.breakdown.positiveReasons.length > 0 ? (
                    result.score.breakdown.positiveReasons.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-zinc-400">
                        <Check size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                        <span>{reason}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-zinc-500 italic">No specific optimizations detected.</li>
                  )}
                </ul>
              </div>

              {/* Bad Points */}
              <div className="bg-[#131816]/50 border border-red-900/10 rounded-2xl p-6 hover:bg-[#131816] transition-colors">
                <div className="flex items-center gap-3 mb-4 text-orange-400">
                  <ThumbsDown size={20} />
                  <h3 className="font-medium text-zinc-200">Carbon Leaks</h3>
                </div>
                <ul className="space-y-3">
                  {result.score.breakdown.reasons && result.score.breakdown.reasons.length > 0 ? (
                    result.score.breakdown.reasons.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-zinc-400">
                        <AlertTriangle size={16} className="text-orange-500/80 mt-0.5 shrink-0" />
                        <span>{reason}</span>
                      </li>
                    ))
                  ) : (
                    <li className="flex items-start gap-3 text-sm text-zinc-400">
                       <Check size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                       <span className="text-emerald-500/80">Clean codebase! No issues found.</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Markdown Badge Section */}
            <div className="bg-black/40 border border-zinc-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                 <h4 className="text-sm font-medium text-zinc-300">Share your Green Score</h4>
                 <span className="text-xs text-zinc-600 bg-zinc-900 px-2 py-1 rounded">Markdown</span>
              </div>
              
              <div className="relative group">
                <code className="block w-full bg-[#0a0a0a] border border-zinc-800 p-4 rounded-xl text-xs text-zinc-400 font-mono break-all leading-relaxed">
                  [![Green Score]({typeof window !== 'undefined' ? window.location.origin : 'https://green-repo.vercel.app'}/api/badge?score={result.score.score})](https://green-repo.vercel.app)
                </code>
                
                <button 
                  onClick={() => copyToClipboard(`[![Green Score](${window.location.origin}/api/badge?score=${result.score!.score})](https://green-repo.vercel.app)`)}
                  className="absolute right-2 top-2 p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-all opacity-0 group-hover:opacity-100 shadow-xl"
                  title="Copy to clipboard"
                >
                  {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                </button>
              </div>
              <p className="text-xs text-zinc-600 mt-3 pl-1">
                Add this badge to your README.md to show off your repository&apos;s sustainability score.
              </p>
            </div>

          </div>
        </div>
      )}
    </motion.div>
  );
}
