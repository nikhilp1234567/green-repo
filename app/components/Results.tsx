'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  AlertTriangle, 
  Copy,
  ArrowLeft,
  Leaf,
  Github,
  Code2,
  Share2,
  Code
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

  // Helper to determine color based on grade
  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-emerald-400 border-emerald-500/50 shadow-emerald-500/20';
    if (grade.startsWith('B')) return 'text-blue-400 border-blue-500/50 shadow-blue-500/20';
    if (grade.startsWith('C')) return 'text-yellow-400 border-yellow-500/50 shadow-yellow-500/20';
    return 'text-red-400 border-red-500/50 shadow-red-500/20';
  };

  const getGradeBg = (grade: string) => {
    if (grade.startsWith('A')) return 'bg-emerald-500/10';
    if (grade.startsWith('B')) return 'bg-blue-500/10';
    if (grade.startsWith('C')) return 'bg-yellow-500/10';
    return 'bg-red-500/10';
  };

  return (
    <motion.div
      key="results"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-5xl mx-auto"
    >
      {/* Navigation */}
      <div className="mb-8 flex items-center justify-between">
        <button 
          onClick={onRetry}
          className="flex items-center gap-2 text-zinc-400 hover:text-emerald-400 transition-colors text-sm font-medium group px-3 py-2 rounded-lg hover:bg-zinc-900/50"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Search</span>
        </button>
      </div>

      {result.error ? (
        <div className="max-w-md mx-auto bg-red-500/5 border border-red-500/10 text-red-200 p-8 rounded-3xl flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Analysis Failed</h3>
            <p className="text-zinc-400 mt-2 text-sm leading-relaxed">{result.error}</p>
          </div>
          <button onClick={onRetry} className="mt-4 text-sm font-medium bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-full transition-colors">
            Try again
          </button>
        </div>
      ) : result.score && (
<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 lg:items-stretch">          
          {/* LEFT COLUMN: Main Score Card */}
          <div className="lg:col-span-5 space-y-6 flex flex-col h-full">
  <div className="bg-[#131816] border border-zinc-800 rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col items-center text-center shadow-2xl flex-1">
       
              {/* Background Gradient Effect */}
              <div className={cn(
                "absolute top-0 inset-x-0 h-32 blur-[60px] opacity-20 pointer-events-none transition-colors duration-500",
                getGradeBg(result.score.grade)
              )} />

              {/* Repo Header */}
              <div className="relative z-10 mb-8 space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/50 border border-zinc-800 text-xs text-zinc-400 mb-2">
                  <Github size={12} />
                  <span>GitHub Repository</span>
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight break-all">
                  {result.repoDetails?.repo}
                </h2>
                <p className="text-zinc-500 text-sm font-mono">
                  {result.repoDetails?.owner}
                </p>
              </div>

              {/* Score Gauge */}
              <div className="relative z-10 mb-8 group cursor-default">
                <div className={cn(
                  "w-40 h-40 rounded-full border-4 flex items-center justify-center backdrop-blur-sm bg-zinc-900/30 transition-all duration-500",
                  getGradeColor(result.score.grade)
                )}>
                  <div className="flex flex-col items-center">
                    <span className="text-5xl font-black tracking-tighter text-white">
                      {result.score.grade}
                    </span>
                    <span className="text-sm font-medium opacity-80 mt-1">
                      {result.score.score}/100
                    </span>
                  </div>
                </div>
                
                {/* Decorative Ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 160 160">
                  <circle 
                    cx="80" cy="80" r="78" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1" 
                    strokeDasharray="4 4" 
                    className={cn("opacity-20", result.score.grade.startsWith('A') ? "text-emerald-500" : "text-zinc-500")}
                  />
                </svg>
              </div>

              {/* High Level Verdict */}
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800/50 flex flex-col items-center justify-center gap-2">
                  <Leaf size={20} className="text-emerald-500" />
                  <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Impact</span>
                  <span className="text-sm text-zinc-200">
                    {result.score.score > 80 ? 'Low Carbon' : 'High Carbon'}
                  </span>
                </div>
                <div className="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800/50 flex flex-col items-center justify-center gap-2">
                   {/* Dynamic Icon based on score could go here */}
                   <Code2 size={20} className="text-blue-500" />
                   <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Code Quality</span>
                   <span className="text-sm text-zinc-200">
                     {result.score.grade === 'S' || result.score.grade === 'A' ? 'Optimized' : 'Needs Work'}
                   </span>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: Details & Actions */}
          <div className="lg:col-span-7 flex flex-col gap-6 h-full">            
            {/* 1. Analysis Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 items-stretch">
              
              {/* Eco Wins */}
              <div className="bg-[#131816]/60 border border-zinc-800/60 rounded-2xl p-5 flex flex-col h-full">
              <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-500">
                    <Check size={16} />
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-200">Eco Wins</h3>
                </div>
                <ul className="space-y-3 flex-1">
                  {result.score.breakdown.positiveReasons && result.score.breakdown.positiveReasons.length > 0 ? (
                    result.score.breakdown.positiveReasons.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-zinc-400 leading-relaxed">
                        <span className="w-1 h-1 rounded-full bg-emerald-500 mt-2 shrink-0" />
                        <span>{reason}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-zinc-500 italic">No specific optimizations detected.</li>
                  )}
                </ul>
              </div>

              {/* Carbon Leaks */}
              <div className="bg-[#131816]/60 border border-zinc-800/60 rounded-2xl p-5 flex flex-col h-full">
              <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 rounded-md bg-orange-500/10 text-orange-500">
                    <AlertTriangle size={16} />
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-200">Carbon Leaks</h3>
                </div>
                <ul className="space-y-3 flex-1">
                  {result.score.breakdown.reasons && result.score.breakdown.reasons.length > 0 ? (
                    result.score.breakdown.reasons.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-zinc-400 leading-relaxed">
                        <span className="w-1 h-1 rounded-full bg-orange-500 mt-2 shrink-0" />
                        <span>{reason}</span>
                      </li>
                    ))
                  ) : (
                    <li className="flex items-center gap-2 text-xs md:text-sm text-emerald-400/80 mt-2">
                       <Check size={14} />
                       <span>Clean codebase! No issues found.</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* 2. Embed / Share Section */}
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl flex flex-col sm:flex-row overflow-hidden">            {/* Preview Area */}
              <div className="p-6 flex flex-col items-center justify-center gap-4 bg-[#0a0f0d] border-b sm:border-b-0 sm:border-r border-zinc-800 min-w-[240px]">
                 <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1 flex items-center gap-2">
 Badge Preview
                 </div>
                 <a 
                    href={typeof window !== 'undefined' ? window.location.origin + '/greenrepo' : '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:scale-105 transition-transform duration-300 drop-shadow-lg"
                  >
                    <img 
                        src={`/greenrepo/api/badge?score=${result.score.score}`} 
                        alt="Green Repo Score" 
                        className="h-[80px] w-auto"
                    />
                  </a>
              </div>

              {/* Code Area */}
              <div className="flex-1 p-5 flex flex-col justify-center min-w-0">
                <div className="flex items-center justify-left gap-3 mb-2">
                  <Code className='w-3.5 h-3.5'/>
                  <span className="text-xs font-mono text-zinc-500">HTML Embed Code</span>
                </div>
                
                <div className="relative group">
                  <div className="absolute inset-0 bg-linear-to-r from-transparent to-zinc-900/10 pointer-events-none" />
                  <pre className="block w-full bg-zinc-950 border border-zinc-800/50 p-3 rounded-lg text-[10px] md:text-xs text-zinc-400 font-mono overflow-x-auto whitespace-pre scrollbar-hide">
                    {`<a href="${typeof window !== 'undefined' ? window.location.origin + '/greenrepo' : 'https://green-repo.vercel.app/greenrepo'}">
  <img src="${typeof window !== 'undefined' ? window.location.origin + '/greenrepo' : 'https://green-repo.vercel.app/greenrepo'}/api/badge?score=${result.score.score}" alt="Green Repo Score">
</a>`}
                  </pre>
                  
                  <button
  onClick={() =>
    copyToClipboard(
      `<a href="${window.location.origin}/greenrepo" target="_blank"><img src="${window.location.origin}/greenrepo/api/badge?score=${result.score!.score}" alt="Green Repo Score" /></a>`
    )
  }
  className="absolute right-2 top-2 p-1.5 bg-zinc-800 hover:bg-emerald-600 hover:text-white text-zinc-400 rounded-md transition-all shadow-lg border border-zinc-700 hover:border-emerald-500
             opacity-0 translate-y-1 pointer-events-none
             group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto"
  title="Copy code"
>
  {copied ? <Check size={14} /> : <Copy size={14} />}
</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </motion.div>
  );
}