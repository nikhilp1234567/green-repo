'use client';
import { motion } from 'framer-motion';
import { 
  Leaf, 
  ArrowRight, 
  Github,
  Loader2,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface HeaderProps {
  isCompact: boolean;
  isLoading: boolean;
  url: string;
  error?: string | null;
  onAnalyze: (formData: FormData) => void;
}

export default function Header({ isCompact, isLoading, url, error, onAnalyze }: HeaderProps) {
  return (
    <motion.div 
      layout
      className={cn(
        "relative z-20 flex flex-col w-full transition-all duration-700 ease-in-out",
        isCompact 
          ? "items-start px-6 py-6 border-b border-zinc-900 bg-[#0a0f0d]/80 backdrop-blur-md sticky top-0" 
          : "items-center justify-center pt-32 px-6"
      )}
    >
      <div className={cn("flex items-center gap-6 w-full max-w-7xl mx-auto", isCompact ? "flex-row" : "flex-col text-center")}>
        
        {/* Logo Section */}
        <motion.div layout className={cn("flex items-center gap-3", isCompact ? "shrink-0" : "flex-col space-y-4 mb-8")}>
          <motion.div 
            layout
            className={cn(
              "rounded-full bg-zinc-900/50 border border-zinc-800 text-emerald-500 shadow-sm flex items-center justify-center transition-all",
              isCompact ? "p-2 w-10 h-10" : "p-4 w-16 h-16"
            )}
          >
            <Leaf size={isCompact ? 20 : 32} strokeWidth={2} />
          </motion.div>
          
          <motion.div layout className="text-center">
            <h1 className={cn("font-bold tracking-tight text-white transition-all", isCompact ? "text-xl" : "text-5xl")}>
             <span className='hover:text-emerald-600 transition-colors duration-300'>Green</span> Repo
            </h1>
            {!isCompact && (
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-lg text-zinc-400 mt-4 font-light max-w-md mx-auto"
              >
                Curious how green your code is? Check your repo’s eco-friendliness.
              </motion.p>
            )}
          </motion.div>
        </motion.div>

        {/* Input Section */}
        <motion.div layout className={cn("w-full transition-all duration-500", isCompact ? "max-w-md ml-auto" : "max-w-xl")}>
          <div className={cn(
            "relative group bg-[#0F1412] border rounded-full flex items-center shadow-xl transition-all",
            error ? "border-red-500/50 shadow-red-500/10" : isCompact ? "border-zinc-800 py-1" : "border-zinc-800 p-2 shadow-black/20 focus-within:border-emerald-500/30"
          )}>
   <form
  onSubmit={(e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onAnalyze(formData);
  }}
            className="flex items-center w-full gap-2 px-3">
              <div className={cn("transition-colors", error ? "text-red-500" : "text-zinc-500")}>
                {error ? <XCircle size={18} /> : <Github size={18} />}
              </div>
              <input
                name="url"
                type="text"
                defaultValue={url}
                placeholder={error || "github.com/username/repo"}
                required
                disabled={isCompact || isLoading} 
                className={cn(
                  "flex-1 bg-transparent border-none text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-0 font-light w-full transition-all",
                  isCompact ? "text-sm py-2 text-zinc-400 cursor-not-allowed" : "py-3 text-base",
                  error && "placeholder-red-400/50"
                )}
                autoComplete="off"
                onChange={() => {
                   // Optional: Clear error on type if we had access to setStatus from here, 
                   // but for now the parent handles state. 
                }}
              />
              {!isCompact && (
                <button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2",
                    isLoading 
                      ? "bg-zinc-800 text-zinc-400 cursor-not-allowed" 
                      : error 
                        ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                        : "bg-emerald-600 hover:bg-emerald-800 text-zinc-200"
                  )}
                >
                  {isLoading ? (
                    <>
                      <span>Analyzing</span>
                      <Loader2 size={16} className="animate-spin" />
                    </>
                  ) : error ? (
                    <>
                      <span>Retry</span>
                      <RefreshCw size={16} />
                    </>
                  ) : (
                    <>
                      <span>Generate</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              )}
            </form>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
