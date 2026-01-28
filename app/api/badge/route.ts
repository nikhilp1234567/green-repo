import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const scoreStr = searchParams.get('score');
  
  let score = 100;
  if (scoreStr) {
    score = parseInt(scoreStr, 10);
    if (isNaN(score)) score = 0;
  }
  // Clamp to [0, 100] so progress ring stays valid
  score = Math.max(0, Math.min(100, score));

  // Configuration based on score
  let grade = 'F';
  let color = '#ef4444'; // Red
  let secondaryColor = '#450a0a'; // Dark Red bg
  let label = 'Intensive';
  
  if (score > 90) {
    grade = 'S';
    color = '#10b981'; // Emerald-500
    secondaryColor = '#064e3b'; // Emerald-900
    label = 'Eco Native';
  } else if (score > 80) {
    grade = 'A';
    color = '#3b82f6'; // Blue-500
    secondaryColor = '#1e3a8a'; // Blue-900
    label = 'Efficient';
  } else if (score > 70) {
    grade = 'B';
    color = '#eab308'; // Yellow-500
    secondaryColor = '#713f12'; // Yellow-900
    label = 'Standard';
  } else if (score > 60) {
    grade = 'C';
    color = '#eab308'; // Yellow-500
    secondaryColor = '#713f12'; // Yellow-900
    label = 'Standard';
  } else if (score > 50) {
    grade = 'D';
    color = '#ef4444'; // Red-500
    secondaryColor = '#7f1d1d'; // Red-900
    label = 'Intensive';
  } else {
    grade = 'F'; 
    color = '#ef4444'; // Red-500
    secondaryColor = '#7f1d1d'; // Red-900
    label = 'Intensive';
  }

  // SVG Geometry
  const width = 400;
  const height = 120;
  const centerX = 330;
  const centerY = 60;
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#18181b;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#09090b;stop-opacity:1" />
      </linearGradient>
      
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <rect x="1" y="1" width="${width-2}" height="${height-2}" rx="16" fill="url(#bgGradient)" stroke="#27272a" stroke-width="1" />
    
    <g transform="translate(30, 40)">
      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM17 8L10 15L7 12" 
            transform="scale(0.8) translate(-2, -8)" 
            fill="${color}" opacity="0.9" />
      
      <text x="24" y="6" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="14" fill="#a1a1aa" font-weight="500" letter-spacing="1">GREEN REPO</text>
      
      <text x="0" y="42" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="28" font-weight="800" fill="#e4e4e7" letter-spacing="-0.5">${label}</text>
    </g>

    <g transform="translate(${centerX}, ${centerY})">
      <circle cx="0" cy="0" r="${radius}" fill="none" stroke="#27272a" stroke-width="8" />
      
      <circle cx="0" cy="0" r="${radius}" fill="none" stroke="${color}" stroke-width="8" 
              stroke-dasharray="${circumference}" 
              stroke-dashoffset="${offset}" 
              stroke-linecap="round" 
              transform="rotate(-90)" />
              
          <text x="0" y="2"
            font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
            font-size="22" font-weight="bold" fill="#ffffff"
            text-anchor="middle" dominant-baseline="middle">${grade}</text>
      
    </g>
    
    <line x1="250" y1="30" x2="250" y2="90" stroke="#27272a" stroke-width="1" />
  </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}