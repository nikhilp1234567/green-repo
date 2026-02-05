# Green Repo 🌿

**Green Repo** is a tool designed to analyze the environmental impact and digital carbon footprint of GitHub repositories. By evaluating codebases against energy efficiency benchmarks, architectural patterns, and resource usage, it provides developers with actionable insights to build more sustainable software.

## How It Works

Green Repo scans public GitHub repositories and calculates a "Green Score" (0-100) based on four key pillars of digital sustainability.

### The Scoring Methodology

The scorer evaluates repositories across four dimensions, penalizing inefficient practices and rewarding optimization.

#### 1. Language Efficiency (30%)
Different programming languages consume vastly different amounts of energy for the same task. We use a tiered system based on the [Energy Efficiency of Languages](https://greenlab.di.uminho.pt/wp-content/uploads/2017/10/sleFinal.pdf) study.

*   **Tier 1 (Eco Native):** C, C++, Rust, Zig, HTML/CSS. (Zero Penalty)
*   **Tier 2 (Efficient Managed):** Go, Java, C#, Swift. (Low Penalty)
*   **Tier 3 (Interpreted/JIT):** JavaScript, TypeScript, PHP. (Medium Penalty)
*   **Tier 4 (Energy Intensive):** Python, Ruby, Perl. (High Penalty)

*The score deducts points based on the percentage of code written in lower-tier languages.*

#### 2. Ecosystem & Compute Intensity (25%)
Dependencies matter. We scan `package.json`, `Cargo.toml`, etc., for libraries known to be computationally heavy or efficient.

*   **Penalties:** Deep Learning frameworks (TensorFlow, PyTorch), Blockchain/Crypto libs (Web3), and heavy client wrappers (Electron).
*   **Bonuses:** Lightweight, modern frameworks (Fastify, Actix, Preact, Svelte).

#### 3. Data & Digital Bloat (20%)
Data transfer is a major driver of carbon emissions. We analyze the repository's file structure for asset optimization.

*   **Asset Heavy:** High ratio of images/videos to code files (>15%) deducts points.
*   **Format Optimization:** Usage of modern formats like WebP, AVIF, and SVG is rewarded.
*   **Video Files:** Storing heavy video files directly in the repo is penalized.

#### 4. Architecture & Health (25%)
Sustainable code is maintainable and automated.

*   **Repository Size:** Massive repos (>500MB) are penalized for storage and bandwidth bloat. Micro-repos (<5MB) are rewarded.
*   **CI/CD:** Presence of automation (GitHub Actions, GitLab CI) is rewarded as it often prevents manual errors and rework.
*   **Cloud-Native:** Serverless configurations (Vercel, Netlify) are rewarded for encouraging scale-to-zero architectures.

### Grading Scale

*   **S (>90):** Eco Native. Highly optimized.
*   **A (>80):** Efficient. Good practices.
*   **B (>70):** Standard. Room for improvement.
*   **C (>60):** Needs Work.
*   **D (>50):** Intensive.
*   **F (<=50):** High Carbon Impact.

## Tech Stack

*   **Framework:** Next.js 15 (App Router)
*   **Styling:** Tailwind CSS, Framer Motion
*   **Icons:** Lucide React
*   **Analysis:** Custom GitHub API integration & Scoring Engine

## Getting Started

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up environment variables (Optional but recommended for higher rate limits):
    ```bash
    export GITHUB_TOKEN=your_token_here
    ```
4.  Run the development server:
    ```bash
    npm run dev
    ```

## Contributing

We welcome contributions! Please open an issue or submit a PR if you have ideas for improving the scoring algorithm or adding support for more languages/frameworks.
