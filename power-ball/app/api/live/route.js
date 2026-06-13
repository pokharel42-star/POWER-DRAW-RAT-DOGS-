import { fallbackPoints } from '@/data/tournament';

export async function GET() {
  return Response.json({
    mode: 'manual',
    message: 'Manual mode active.',
    updatedAt: new Date().toISOString(),
    scores: fallbackPoints,
    liveMatches: []
  });
}
