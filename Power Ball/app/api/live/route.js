import { fallbackPoints, teamCodeMap } from '@/data/tournament';

const API_BASE = process.env.WORLD_CUP_API_BASE || 'https://worldcupapi.com/api';
const API_KEY = process.env.WORLD_CUP_API_KEY;

function normalize(name) {
  return name.toLowerCase().replace(/[^a-z]/g, '');
}

function mapApiScores(matches) {
  const result = { ...fallbackPoints };
  const liveMatches = [];

  for (const match of matches || []) {
    const homeName = match?.home_team?.name || match?.homeTeam?.name || match?.home_team || match?.home || '';
    const awayName = match?.away_team?.name || match?.awayTeam?.name || match?.away_team || match?.away || '';
    const homeScore = Number(match?.home_score ?? match?.goals?.home ?? match?.score?.home ?? 0);
    const awayScore = Number(match?.away_score ?? match?.goals?.away ?? match?.score?.away ?? 0);
    const status = match?.status || match?.state || 'scheduled';
    const minute = match?.minute || match?.clock || null;

    for (const teamName of Object.keys(teamCodeMap)) {
      if (normalize(homeName) === normalize(teamName)) result[teamName] = homeScore;
      if (normalize(awayName) === normalize(teamName)) result[teamName] = awayScore;
    }

    liveMatches.push({ homeName, awayName, homeScore, awayScore, status, minute });
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
    const response = await fetch(`${API_BASE}/matches?status=live,completed`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        Accept: 'application/json'
      },
      next: { revalidate: 15 }
    });

    if (!response.ok) throw new Error(`API request failed: ${response.status}`);
    const data = await response.json();
    const matches = data.matches || data.data || [];
    const mapped = mapApiScores(matches);

    return Response.json({
      mode: 'live',
      updatedAt: new Date().toISOString(),
      ...mapped
    });
  } catch (error) {
    return Response.json({
      mode: 'fallback',
      message: error.message,
      scores: fallbackPoints,
      liveMatches: []
    }, { status: 200 });
  }
}
