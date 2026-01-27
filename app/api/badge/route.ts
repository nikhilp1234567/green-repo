import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const scoreStr = searchParams.get('score');
  
  let score = 100;
  if (scoreStr) {
    score = parseInt(scoreStr, 10);
  }

  // Determine Grade and Color
  let grade = 'F';
  let color = '#ef4444'; // Red-500
  let label = 'Intensive';

  if (score >= 95) {
    grade = 'A+';
    color = '#22c55e'; // Green-500
    label = 'Eco Native';
  } else if (score >= 80) {
    grade = 'B';
    color = '#3b82f6'; // Blue-500
    label = 'Efficient';
  } else if (score >= 70) {
    grade = 'C';
    color = '#eab308'; // Yellow-500
    label = 'Standard';
  } else {
    grade = 'D'; // or F
    if (score < 50) grade = 'F';
    color = '#ef4444'; // Red-500
    label = 'Intensive';
  }

  const width = 300;
  const height = 100;

  const svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${height}" rx="15" fill="#18181b" />
    <circle cx="50" cy="50" r="35" stroke="${color}" stroke-width="5" fill="none" />
    <text x="50" y="55" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="${color}" text-anchor="middle" alignment-baseline="middle">${grade}</text>
    <text x="100" y="40" font-family="Arial, sans-serif" font-size="18" fill="#e4e4e7" font-weight="bold">Green Score: ${score}</text>
    <text x="100" y="70" font-family="Arial, sans-serif" font-size="14" fill="#a1a1aa">${label}</text>
  </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
