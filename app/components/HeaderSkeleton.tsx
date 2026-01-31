import { Leaf, Github, ArrowRight } from 'lucide-react';

export default function HeaderSkeleton() {
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
