'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { analyzeRepo, AnalysisResult } from './actions';
import { AnimatePresence } from 'framer-motion';
import { ShieldCheck, ExternalLink, Leaf, Github, ArrowRight } from 'lucide-react';
import Header from './components/Header';
import Results from './components/Results';

function HomeContent() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'results'>('idle');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [url, setUrl] = useState('');
  const searchParams = useSearchParams();

  async function handleSubmit(formData: FormData) {
    setResult(null); // Clear previous errors
    
    // 1. Sanitize Input
    const rawUrl = formData.get('url')?.toString() || '';
    // Basic sanitization: remove whitespace, dangerous chars (though rare in URL input)
    // We allow standard URL characters. 
    const sanitizedUrl = rawUrl.trim().replace(/[<>"'\s]/g, '');

    if (!sanitizedUrl) {
      setResult({ success: false, error: 'Please enter a valid URL.' });
      return;
    }

    // 2. Optimistic Update
    setStatus('loading');
    
    // Update formData with sanitized URL
    formData.set('url', sanitizedUrl);

    try {
      const res = await analyzeRepo(formData);
      
      if (!res.success) {
         // Handle explicit failure from action
         setResult(res);
         setStatus('idle');
      } else {
         setResult(res);
         setStatus('results');
      }
    } catch (e) {
      console.error(e);
      setResult({ success: false, error: 'An unexpected error occurred.' });
      setStatus('idle'); // Reset on error so they can try again
    }
  }

  useEffect(() => {
    const urlParam = searchParams.get('url');
    if (urlParam && status === 'idle') {
      setUrl(urlParam);
      const formData = new FormData();
      formData.append('url', urlParam);
      handleSubmit(formData);
    }
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  // Header becomes compact ONLY when showing results. 
  // During 'loading', we keep the big header to show the spinner button.
  const isCompact = status === 'results';

  return (
    <div className="min-h-screen w-full bg-[#0a0f0d] text-zinc-100 selection:bg-emerald-500/30 flex flex-col font-light overflow-x-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-emerald-900/10 blur-[100px] rounded-full opacity-30" />
      </div>

      <Header 
        isCompact={isCompact} 
        isLoading={status === 'loading'}
        url={url}
        error={result?.error}
        onAnalyze={handleSubmit} 
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 py-8">
        
        <AnimatePresence mode='wait'>
          {status === 'results' && result && (
            <Results result={result} onRetry={() => setStatus('idle')} />
          )}
        </AnimatePresence>
      </main>

      {/* Footer Section */}
      <footer className="w-full py-8 text-center border-t border-zinc-900/50 mt-auto bg-[#0a0f0d]">
        <div className="text-sm font-light text-zinc-600">
          Created by <a href="https://nikhilp.online" className="text-zinc-400 hover:text-emerald-400 transition-colors">Nikhil Parmar</a>
        </div>
      </footer>

      {/* Floating ShillGuard Card */}
      <a 
        href="https://shillguardapp.com" 
        className="fixed bottom-6 left-6 z-50 group hidden md:flex items-center gap-4 p-4 rounded-xl border border-zinc-800 bg-[#0F1412] hover:bg-zinc-900/50 hover:border-zinc-700 transition-all duration-300 w-full max-w-[320px] shadow-2xl"
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
  );
}

function HeaderSkeleton() {
  return (
    <div className="min-h-screen w-full bg-[#0a0f0d] flex flex-col font-light overflow-x-hidden">
       {/* Background Ambience */}
       <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-emerald-900/10 blur-[100px] rounded-full opacity-30" />
      </div>

      <div className="relative z-20 flex flex-col w-full items-center justify-center pt-32 px-6">
        <div className="flex flex-col items-center gap-6 w-full max-w-7xl mx-auto text-center">
          
          <div className="flex flex-col items-center space-y-4 mb-8">
            <div className="rounded-full bg-zinc-900/50 border border-zinc-800 text-emerald-500 shadow-sm flex items-center justify-center p-4 w-16 h-16">
              <Leaf size={32} strokeWidth={2} />
            </div>
            
            <div className="text-center">
              <h1 className="font-bold tracking-tight text-white text-5xl">
               <span className='hover:text-emerald-600 transition-colors duration-300'>Green</span> Repo
              </h1>
              <p className="text-lg text-zinc-400 mt-4 font-light max-w-md mx-auto">
                Curious how green your code is? Check your repo’s eco-friendliness.
              </p>
            </div>
          </div>

          <div className="w-full max-w-xl">
            <div className="relative group bg-[#0F1412] border rounded-full flex items-center shadow-xl border-zinc-800 p-2 shadow-black/20">
              <div className="flex items-center w-full gap-2 px-3">
                <div className="text-zinc-500">
                  <Github size={18} />
                </div>
                <div className="flex-1 bg-transparent border-none text-zinc-600 font-light w-full py-3 text-base">
                  github.com/username/repo
                </div>
                <button className="px-4 py-2.5 rounded-full text-sm font-medium bg-emerald-600 text-zinc-200 flex items-center gap-2">
                    <span>Generate</span>
                    <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<HeaderSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}
