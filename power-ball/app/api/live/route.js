import { fallbackPoints, teamCodeMap } from '@/data/tournament';

const API_BASE = process.env.WORLD_CUP_API_BASE || 'https://api.football-data.org/v4';
const API_KEY = process.env.WORLD_CUP_API_KEY;
const COMPETITION_CODE = 'WC';

function normalize(name) {
  return String(name || '').toLowerCase().replace(/[^a-z]/g, '');
}

function mapApiScores(matches) {
  const result = { ...fallbackPoints };
  const liveMatches = [];

  for (const match of matches || []) {
    const homeName =
      match?.homeTeam?.name ||
      match?.home_team?.name ||
      match?.home_team ||
      match?.home ||
      '';

    const awayName =
      match?.awayTeam?.name ||
      match?.away_team?.name ||
      match?.away_team ||
      match?.away ||
      '';

    const homeScore = Number(
      match?.score?.fullTime?.homeTeam ??
      match?.score?.fullTime?.home ??
      match?.goals?.home ??
      match?.score?.home ??
      match?.home_score ??
      0
    );

    const awayScore = Number(
      match?.score?.fullTime?.awayTeam ??
      match?.score?.fullTime?.away ??
      match?.goals?.away ??
      match?.score?.away ??
      match?.away_score ??
      0
    );

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
    const response = await fetch(`${API_BASE}/competitions/${COMPETITION_CODE}/matches`, {
      headers: {
        'X-Auth-Token': API_KEY,
        Accept: 'application/json'
      },
      next: { revalidate: 15 }
    });

    if (!response.ok) {
      throw new Error(`Live API request failed: ${response.status}`);
    }

    const data = await response.json();
    const matches = data.matches || [];
    const mapped = mapApiScores(matches);

    return Response.json({
      mode: 'live',
      updatedAt: new Date().toISOString(),
      competition: COMPETITION_CODE,
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
