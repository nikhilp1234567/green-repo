
export interface ScoreResult {
  score: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  breakdown: {
    languageDeduction: number;
    computeDeduction: number;
    bloatDeduction: number;
    reasons: string[];
    positiveReasons: string[];
  };
}

export interface RepoData {
  languages: Record<string, number>; // bytes per language
  dependencies: string[];
  size: number; // in KB
  fileExtensions: string[];
  filePaths: string[];
}

// Based on "Energy Efficiency of Languages" papers and general runtime characteristics
const LANGUAGE_TIERS: Record<string, { tier: 1 | 2 | 3 | 4; penalty: number }> = {
  // Tier 1: Eco Native (Compiled, Metal)
  C: { tier: 1, penalty: 0 },
  'C++': { tier: 1, penalty: 0 },
  Rust: { tier: 1, penalty: 0 },
  Zig: { tier: 1, penalty: 0 },
  Ada: { tier: 1, penalty: 0 },
  Fortran: { tier: 1, penalty: 0 },
  HTML: { tier: 1, penalty: 0 },
  CSS: { tier: 1, penalty: 0 },
  ShaderLab: { tier: 1, penalty: 0 },

  // Tier 2: Efficient Managed (GC, VM, but fast)
  Go: { tier: 2, penalty: 5 },
  Java: { tier: 2, penalty: 5 },
  'C#': { tier: 2, penalty: 5 },
  Swift: { tier: 2, penalty: 5 },
  Kotlin: { tier: 2, penalty: 5 },
  Haskell: { tier: 2, penalty: 5 },
  Pascal: { tier: 2, penalty: 5 },
  Dart: { tier: 2, penalty: 5 }, // Strong typing helps
  
  // Tier 3: Interpreted / JIT (Dynamic but optimized)
  JavaScript: { tier: 3, penalty: 15 },
  TypeScript: { tier: 3, penalty: 15 }, // Transpiles to JS
  PHP: { tier: 3, penalty: 15 },
  Elixir: { tier: 3, penalty: 10 }, // Erlang VM is efficient for concurrency
  Erlang: { tier: 3, penalty: 10 },
  
  // Tier 4: Energy Intensive (Heavy interpretation/Global Interpreter Lock)
  Python: { tier: 4, penalty: 30 },
  Ruby: { tier: 4, penalty: 30 },
  Perl: { tier: 4, penalty: 30 },
  Lua: { tier: 4, penalty: 25 },
  R: { tier: 4, penalty: 30 },
  Shell: { tier: 4, penalty: 20 },
  PowerShell: { tier: 4, penalty: 20 },
};

const ECOSYSTEM_SCORES = [
  // Heavy / Intensive
  { name: 'tensorflow', score: -15, reason: 'Deep Learning (Heavy Compute)' },
  { name: 'torch', score: -15, reason: 'PyTorch (Heavy Compute)' },
  { name: 'transformers', score: -10, reason: 'LLM/Transformers (Heavy Compute)' },
  { name: 'langchain', score: -10, reason: 'LLM Orchestration' },
  { name: 'openai', score: -5, reason: 'AI API Integration' },
  { name: 'web3', score: -15, reason: 'Blockchain/Crypto (Energy Intensive)' },
  { name: 'ethers', score: -15, reason: 'Blockchain/Crypto' },
  { name: 'puppeteer', score: -10, reason: 'Headless Browser (Memory Heavy)' },
  { name: 'selenium', score: -10, reason: 'Browser Automation' },
  { name: 'electron', score: -10, reason: 'Electron (Bundled Chromium)' },
  
  // Efficient / Modern
  { name: 'fastify', score: 5, reason: 'Fastify (High Performance Node.js)' },
  { name: 'actix', score: 5, reason: 'Actix (Rust High Performance)' },
  { name: 'axum', score: 5, reason: 'Axum (Rust High Performance)' },
  { name: 'preact', score: 5, reason: 'Preact (Lightweight React)' },
  { name: 'svelte', score: 5, reason: 'Svelte (Compiler Optimized)' },
  { name: 'astro', score: 5, reason: 'Astro (Zero JS by default)' },
  { name: 'next', score: 0, reason: 'Next.js (Standard)' }, // Neutral
];

export function calculateScore(data: RepoData): ScoreResult {
  let score = 100;
  const breakdown = {
    languageDeduction: 0,
    computeDeduction: 0,
    bloatDeduction: 0,
    reasons: [] as string[],
    positiveReasons: [] as string[],
  };

  // 1. Language Efficiency Analysis
  let totalBytes = 0;
  Object.values(data.languages).forEach(b => totalBytes += b);

  if (totalBytes > 0) {
    let weightedPenalty = 0;
    
    for (const [lang, bytes] of Object.entries(data.languages)) {
      const percentage = bytes / totalBytes;
      const tierInfo = LANGUAGE_TIERS[lang] || { tier: 2, penalty: 10 }; // Default to mid-penalty
      
      weightedPenalty += percentage * tierInfo.penalty;
    }
    
    const langDeduction = Math.round(weightedPenalty);
    if (langDeduction > 0) {
      score -= langDeduction;
      breakdown.languageDeduction = langDeduction;
      breakdown.reasons.push(`Language composition penalty: -${langDeduction} pts (based on energy efficiency)`);
    } else {
      breakdown.positiveReasons.push("Purely efficient languages detected (Tier 1)");
    }
  }

  // 2. Ecosystem & Compute Intensity
  const foundLibs = new Set<string>();
  const dependenciesStr = data.dependencies.join(' ').toLowerCase();

  for (const item of ECOSYSTEM_SCORES) {
    if (dependenciesStr.includes(item.name)) {
      if (!foundLibs.has(item.name)) {
        foundLibs.add(item.name);
        
        if (item.score < 0) {
          score += item.score; // Add negative
          breakdown.computeDeduction += Math.abs(item.score);
          breakdown.reasons.push(`${item.reason}: ${item.score} pts`);
        } else {
          score += item.score;
          breakdown.positiveReasons.push(`${item.reason}: +${item.score} pts`);
        }
      }
    }
  }

  // 3. Digital Bloat & Assets
  const totalFiles = data.fileExtensions.length;
  const imageExts = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff'];
  const videoExts = ['mp4', 'mov', 'avi', 'wmv', 'flv'];
  const modernExts = ['webp', 'avif', 'svg'];
  
  let imageCount = 0;
  let videoCount = 0;
  let modernCount = 0;

  data.fileExtensions.forEach(ext => {
    if (imageExts.includes(ext)) imageCount++;
    if (videoExts.includes(ext)) videoCount++;
    if (modernExts.includes(ext)) modernCount++;
  });

  if (totalFiles > 0) {
    const assetRatio = (imageCount + videoCount) / totalFiles;
    if (assetRatio > 0.15) {
      const deduction = 10;
      score -= deduction;
      breakdown.bloatDeduction += deduction;
      breakdown.reasons.push(`High density of non-optimized assets (>15% of files): -${deduction} pts`);
    }

    if (videoCount > 0) {
      const deduction = 5;
      score -= deduction;
      breakdown.bloatDeduction += deduction;
      breakdown.reasons.push(`Video files detected in repo: -${deduction} pts`);
    }

    if (modernCount > 0 && modernCount >= imageCount * 0.3) {
      score += 5;
      breakdown.positiveReasons.push("Modern image formats (WebP/SVG) used: +5 pts");
    }
  }

  // 4. Architecture & Health
  const sizeMB = data.size / 1024;
  
  // Size Penalties/Bonuses
  if (sizeMB > 500) {
    score -= 20;
    breakdown.bloatDeduction += 20;
    breakdown.reasons.push(`Massive repository size (>500MB): -20 pts`);
  } else if (sizeMB > 100) {
    score -= 10;
    breakdown.bloatDeduction += 10;
    breakdown.reasons.push(`Large repository size (>100MB): -10 pts`);
  } else if (sizeMB < 5) {
    score += 5;
    breakdown.positiveReasons.push("Micro-repository (<5MB): +5 pts");
  }

  // Config Checks
  const hasCI = data.filePaths.some(p => p.startsWith('.github/workflows') || p.includes('.gitlab-ci.yml') || p.includes('circle.yml'));
  if (hasCI) {
    score += 5;
    breakdown.positiveReasons.push("CI/CD Automation detected: +5 pts");
  }

  const hasServerless = data.filePaths.some(p => p.endsWith('vercel.json') || p.endsWith('netlify.toml') || p.endsWith('serverless.yml'));
  if (hasServerless) {
    score += 5;
    breakdown.positiveReasons.push("Serverless/Cloud-Native config detected: +5 pts");
  }

  // Clamp Score
  score = Math.max(0, Math.min(100, Math.round(score)));

  // Determine Grade
  let grade: ScoreResult['grade'] = 'F';
  if (score > 90) grade = 'S';
  else if (score > 80) grade = 'A';
  else if (score > 70) grade = 'B';
  else if (score > 60) grade = 'C';
  else if (score > 50) grade = 'D';

  return {
    score,
    grade,
    breakdown
  };
}
