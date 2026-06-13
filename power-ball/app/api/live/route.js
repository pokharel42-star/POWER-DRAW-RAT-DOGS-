import { fallbackPoints, teamCodeMap } from '@/data/tournament';

const API_BASE = process.env.WORLD_CUP_API_BASE || 'https://v3.football.api-sports.io';
const API_KEY = process.env.WORLD_CUP_API_KEY;

function normalize(name) {
  return String(name || '').toLowerCase().replace(/[^a-z]/g, '');
}

function mapApiScores(fixtures) {
  const result = { ...fallbackPoints };
  const liveMatches = [];

  for (const item of fixtures || []) {
    const match = item?.fixture || {};
    const teams = item?.teams || {};
    const goals = item?.goals || {};

    const homeName = teams?.home?.name || '';
    const awayName = teams?.away?.name || '';
    const homeScore = Number(goals?.home ?? 0);
    const awayScore = Number(goals?.away ?? 0);
    const status = match?.status?.short || match?.status?.long || 'scheduled';
    const minute = match?.status?.elapsed ?? null;

    for (const teamName of Object.keys(teamCodeMap)) {
      if (normalize(homeName) === normalize(teamName)) result[teamName] = homeScore;
      if (normalize(awayName) === normalize(teamName)) result[teamName] = awayScore;
    }

    liveMatches.push({
      homeName,
      awayName,
      homeScore,
      awayScore,
      status,
      minute
    });
  }

  return { scores: result, liveMatches };
}

export async function GET() {
  if (!API_KEY) {
    return Response.json({
      mode: 'fallback',
      message: 'Add WORLD_CUP_API_KEY and optional WORLD_CUP_API_BASE in Vercel env vars to enable live updates.',
      scores: fallbackPoints,
      liveMatches: []
    });
  }

  try {
    const response = await fetch(`${API_BASE}/fixtures?live=all`, {
      headers: {
        'x-apisports-key': API_KEY,
        Accept: 'application/json'
      },
      next: { revalidate: 15 }
    });

    if (!response.ok) {
      throw new Error(`Live API request failed: ${response.status}`);
    }

    const data = await response.json();
    const fixtures = data.response || [];
    const mapped = mapApiScores(fixtures);

    return Response.json({
      mode: 'live',
      updatedAt: new Date().toISOString(),
      ...mapped
    });
  } catch (error) {
    return Response.json({
      mode: 'fallback',
      message: error instanceof Error ? error.message : 'Unknown API error',
      scores: fallbackPoints,
      liveMatches: []
    }, { status: 200 });
  }
}
