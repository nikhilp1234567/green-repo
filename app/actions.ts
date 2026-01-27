'use server'

import { fetchRepoData } from '@/lib/github';
import { calculateScore, ScoreResult } from '@/lib/scorer';

export type AnalysisResult = {
  success: boolean;
  score?: ScoreResult;
  error?: string;
  repoDetails?: {
    owner: string;
    repo: string;
  };
};

export async function analyzeRepo(formData: FormData): Promise<AnalysisResult> {
  const url = formData.get('url') as string;

  if (!url) {
    return { success: false, error: 'Please provide a GitHub URL' };
  }

  // Parse URL
  // Supports: github.com/owner/repo or just owner/repo
  let owner = '';
  let repo = '';

  try {
    if (url.includes('github.com')) {
      const parts = new URL(url).pathname.split('/').filter(Boolean);
      if (parts.length >= 2) {
        owner = parts[0];
        repo = parts[1];
      }
    } else {
      const parts = url.split('/');
      if (parts.length === 2) {
        owner = parts[0];
        repo = parts[1];
      }
    }
  } catch (e) {
    return { success: false, error: 'Invalid URL format' };
  }

  if (!owner || !repo) {
    return { success: false, error: 'Could not parse owner and repo name' };
  }

  try {
    const data = await fetchRepoData(owner, repo);
    const scoreResult = calculateScore(data);
    
    return {
      success: true,
      score: scoreResult,
      repoDetails: { owner, repo }
    };
  } catch (e: any) {
    console.error(e);
    return { success: false, error: e.message || 'Failed to analyze repository' };
  }
}
