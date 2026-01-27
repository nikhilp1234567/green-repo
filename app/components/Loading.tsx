'use client';

import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

export default function Loading() {
  return (
    <motion.div 
       key="loader"
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       exit={{ opacity: 0 }}
       className="flex flex-col items-center justify-center h-[50vh] space-y-4"
     >
        <div className="relative">
          <div className="w-16 h-16 border-4 border-zinc-800 border-t-emerald-500 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Leaf size={20} className="text-emerald-500/50" />
          </div>
        </div>
        <p className="text-zinc-400 animate-pulse font-light">Analyzing codebase structure...</p>
     </motion.div>
  );
}
