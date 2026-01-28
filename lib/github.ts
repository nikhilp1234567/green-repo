
import { RepoData } from './scorer';

const GITHUB_API_BASE = 'https://api.github.com';

export async function fetchRepoData(owner: string, repo: string): Promise<RepoData> {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  };
  
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }

  // 1. Fetch Repo Metadata (Size & Default Branch)
  const repoRes = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, { headers });
  if (!repoRes.ok) {
    throw new Error(`Failed to fetch repo data: ${repoRes.statusText}`);
  }
  const repoJson = await repoRes.json();
  const size = repoJson.size; // Size in KB
  const defaultBranch = repoJson.default_branch;

  // 2. Fetch Languages
  const langRes = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/languages`, { headers });
  if (!langRes.ok) {
    throw new Error(`Failed to fetch languages: ${langRes.statusText}`);
  }
  const languages = await langRes.json();

  // 3. Fetch Git Tree (Recursive) to analyze file structure and extensions
  // We limit recursion to avoiding massive payloads if possible, but GitHub API recursive=1 returns full tree.
  // Truncated is a property if it's too big.
  const treeRes = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`, { headers });
  if (!treeRes.ok) {
    throw new Error(`Failed to fetch file tree: ${treeRes.statusText}`);
  }
  const treeJson = await treeRes.json();
  const tree: any[] = treeJson.tree || [];

  const filePaths: string[] = [];
  const fileExtensions: string[] = [];
  const manifestFilesToCheck: string[] = [];
  
  const manifestNames = [
    'package.json',
    'requirements.txt',
    'pyproject.toml',
    'Cargo.toml',
    'go.mod',
    'Gemfile',
    'composer.json',
    'mix.exs'
  ];

  for (const node of tree) {
    if (node.type === 'blob') {
      const path = node.path as string;
      filePaths.push(path);
      
      const parts = path.split('.');
      if (parts.length > 1) {
        const ext = parts.pop()?.toLowerCase();
        if (ext) fileExtensions.push(ext);
      }

      // Check for manifests (limit depth to 2 to avoid monorepo noise)
      const depth = path.split('/').length;
      const filename = path.split('/').pop();
      if (filename && manifestNames.includes(filename) && depth <= 2) {
        manifestFilesToCheck.push(path);
      }
    }
  }

  // 4. Fetch Manifest Contents
  const dependencies: string[] = [];
  // Limit to first 5 manifests to avoid rate limits/timeouts
  const manifestsToFetch = manifestFilesToCheck.slice(0, 5);

  await Promise.all(manifestsToFetch.map(async (path) => {
    try {
      // Construct raw URL: https://raw.githubusercontent.com/owner/repo/branch/path
      // OR use the API blob endpoint if raw isn't reliable? 
      // API Blob is better for private repos if we had token, but raw.githubusercontent is easier for public.
      // However, we can use the 'url' property in the tree node which points to the blob API.
      const blobUrl = tree.find(n => n.path === path)?.url;
      if (blobUrl) {
        const blobRes = await fetch(blobUrl, { headers });
        if (blobRes.ok) {
          const blobJson = await blobRes.json();
          // Content is base64 encoded
          if (blobJson.content && blobJson.encoding === 'base64') {
             const content = Buffer.from(blobJson.content, 'base64').toString('utf-8');
             dependencies.push(content);
          }
        }
      }
    } catch (e) {
      console.warn(`Failed to fetch manifest ${path}`, e);
    }
  }));

  return {
    languages,
    size,
    dependencies,
    fileExtensions,
    filePaths
  };
}
