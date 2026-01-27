
import { RepoData } from './scorer';

const GITHUB_API_BASE = 'https://api.github.com';

export async function fetchRepoData(owner: string, repo: string): Promise<RepoData> {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  };
  
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }

  // 1. Fetch Repo Metadata (Size)
  const repoRes = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, { headers });
  if (!repoRes.ok) {
    throw new Error(`Failed to fetch repo data: ${repoRes.statusText}`);
  }
  const repoJson = await repoRes.json();
  const size = repoJson.size; // Size in KB

  // 2. Fetch Languages
  const langRes = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/languages`, { headers });
  if (!langRes.ok) {
    throw new Error(`Failed to fetch languages: ${langRes.statusText}`);
  }
  const languages = await langRes.json();

  // 3. Scan for dependencies
  // We will check root level manifest files.
  // Ideally this should be recursive or check known paths, but for MVP we check root.
  const manifestFiles = [
    'package.json',
    'requirements.txt',
    'pyproject.toml',
    'Cargo.toml',
    'go.mod',
    'Gemfile'
  ];

  const dependencies: string[] = [];

  // Fetch root contents to see which files exist
  const contentsRes = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/contents`, { headers });
  if (contentsRes.ok) {
    const contents = await contentsRes.json();
    if (Array.isArray(contents)) {
      for (const file of contents) {
        if (manifestFiles.includes(file.name)) {
          // Fetch file content
          // GitHub API returns content in base64 or download_url
          const fileRes = await fetch(file.download_url, { headers }); // download_url is raw content
          if (fileRes.ok) {
            const text = await fileRes.text();
            dependencies.push(text);
          }
        }
      }
    }
  }

  return {
    languages,
    size,
    dependencies,
    fileExtensions: [] // Not implemented yet, maybe needed for deeper image scan
  };
}
