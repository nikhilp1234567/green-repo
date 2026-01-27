
export interface ScoreResult {
  score: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'F';
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
}

const LANGUAGE_TIERS: Record<string, 'green' | 'yellow' | 'red'> = {
  // Green (No Deduction)
  C: 'green',
  'C++': 'green',
  Rust: 'green',
  Zig: 'green',
  HTML: 'green',
  CSS: 'green',
  
  // Yellow (Minor Deduction)
  Go: 'yellow',
  Java: 'yellow',
  'C#': 'yellow',
  TypeScript: 'yellow',
  Swift: 'yellow',
  Kotlin: 'yellow',
  Dart: 'yellow',
  
  // Red (Major Deduction)
  Python: 'red',
  Ruby: 'red',
  JavaScript: 'red',
  PHP: 'red',
  Shell: 'red',
};

const HIGH_COMPUTE_LIBS = [
  { name: 'langchain', score: 10, category: 'AI/LLM' },
  { name: 'openai', score: 10, category: 'AI/LLM' },
  { name: 'transformers', score: 10, category: 'AI/LLM' },
  { name: 'torch', score: 10, category: 'AI/LLM' },
  { name: 'tensorflow', score: 10, category: 'AI/LLM' },
  { name: 'web3', score: 15, category: 'Crypto' },
  { name: 'ethers', score: 15, category: 'Crypto' },
  { name: 'spark', score: 10, category: 'Big Data' },
  { name: 'hadoop', score: 10, category: 'Big Data' },
  { name: 'pandas', score: 5, category: 'Big Data' }, // pandas is common, maybe less penalty
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

  // 1. Language Efficiency
  let totalBytes = 0;
  for (const bytes of Object.values(data.languages)) {
    totalBytes += bytes;
  }

  let greenBytes = 0;

  if (totalBytes > 0) {
    let weightedDeduction = 0;
    
    for (const [lang, bytes] of Object.entries(data.languages)) {
      const percentage = bytes / totalBytes;
      const tier = LANGUAGE_TIERS[lang] || 'yellow'; // Default to yellow if unknown
      
      if (tier === 'green') {
        greenBytes += bytes;
      } else if (tier === 'red') {
        // Red tier: up to 25 points deduction if 100%
        weightedDeduction += percentage * 25;
      } else if (tier === 'yellow') {
        // Yellow tier: up to 10 points deduction if 100%
        weightedDeduction += percentage * 10;
      }
    }
    
    const langPoints = Math.round(weightedDeduction);
    if (langPoints > 0) {
      score -= langPoints;
      breakdown.languageDeduction = langPoints;
      breakdown.reasons.push(`Language efficiency deduction: -${langPoints} pts (based on codebase composition)`);
    }

    // Positive check for languages
    if (greenBytes / totalBytes > 0.3) {
      breakdown.positiveReasons.push("Efficient languages detected (e.g. C, C++, Rust)");
    }
  }

  // 2. Compute Intensity
  const foundLibs = new Set<string>();
  for (const lib of HIGH_COMPUTE_LIBS) {
    if (data.dependencies.some(dep => dep.includes(lib.name))) {
      // Avoid double counting if multiple matches for same lib logic (simplified here)
      if (!foundLibs.has(lib.name)) {
        score -= lib.score;
        breakdown.computeDeduction += lib.score;
        breakdown.reasons.push(`High-compute library detected: ${lib.name} (-${lib.score} pts)`);
        foundLibs.add(lib.name);
      }
    }
  }

  if (breakdown.computeDeduction === 0) {
    breakdown.positiveReasons.push("No high-compute dependencies found");
  }

  // 3. Digital Bloat
  // Repo size in KB. 500MB = 500 * 1024 KB
  const sizeMB = data.size / 1024;
  if (sizeMB > 500) {
    const bloat = 20;
    score -= bloat;
    breakdown.bloatDeduction += bloat;
    breakdown.reasons.push(`Repository size > 500MB (-${bloat} pts)`);
  } else if (sizeMB > 100) {
    const bloat = 10;
    score -= bloat;
    breakdown.bloatDeduction += bloat;
    breakdown.reasons.push(`Repository size > 100MB (-${bloat} pts)`);
  } else if (sizeMB < 10) {
    breakdown.positiveReasons.push("Lightweight repository (< 10MB)");
  }

  // Cap score at 0
  score = Math.max(0, Math.round(score));

  // Determine Grade
  let grade: ScoreResult['grade'] = 'F';
  if (score >= 95) grade = 'S';
  else if (score >= 80) grade = 'A';
  else if (score >= 70) grade = 'B';
  else if (score >= 50) grade = 'C'; // "Below 69 is D/F", refining slightly

  return {
    score,
    grade,
    breakdown
  };
}
