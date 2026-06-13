export const managers = [
  {
    id: 'diwa', name: 'diwa', emoji: '🦁', flag: '🔥', gradient: 'linear-gradient(90deg,#ef4444,#f59e0b)',
    top2: ['France', 'Germany'],
    others: ['Algeria', 'Colombia', 'Congo DR', 'Ecuador', 'Haiti', 'Iraq', 'Norway', 'Saudi Arabia', 'Tunisia', 'Türkiye']
  },
  {
    id: 'sid', name: 'sid', emoji: '🐆', flag: '⚡', gradient: 'linear-gradient(90deg,#3b82f6,#06b6d4)',
    top2: ['England', 'Spain'],
    others: ['Bosnia and Herzegovina', 'Croatia', 'Ivory Coast', 'Jordan', 'New Zealand', 'Paraguay', 'Qatar', 'Scotland', 'South Korea', 'Sweden']
  },
  {
    id: 'suraj', name: 'Suraj', emoji: '🦅', flag: '🌍', gradient: 'linear-gradient(90deg,#22c55e,#14b8a6)',
    top2: ['Argentina', 'Netherlands'],
    others: ['Australia', 'Cape Verde', 'Curaçao', 'Czechia', 'Ghana', 'Japan', 'Mexico', 'Panama', 'Senegal', 'Uruguay']
  },
  {
    id: 'tushar', name: 'tushar', emoji: '🐉', flag: '💜', gradient: 'linear-gradient(90deg,#a855f7,#ec4899)',
    top2: ['Brazil', 'Portugal'],
    others: ['Austria', 'Belgium', 'Canada', 'Egypt', 'Iran', 'Morocco', 'South Africa', 'Switzerland', 'United States', 'Uzbekistan']
  }
];

export const teamCodeMap = {
  'Algeria': 'dz', 'Argentina': 'ar', 'Australia': 'au', 'Austria': 'at', 'Belgium': 'be',
  'Bosnia and Herzegovina': 'ba', 'Brazil': 'br', 'Canada': 'ca', 'Cape Verde': 'cv', 'Colombia': 'co',
  'Congo DR': 'cd', 'Croatia': 'hr', 'Curaçao': 'cw', 'Czechia': 'cz', 'Ecuador': 'ec', 'Egypt': 'eg',
  'England': 'gb-eng', 'France': 'fr', 'Germany': 'de', 'Ghana': 'gh', 'Haiti': 'ht', 'Iran': 'ir',
  'Iraq': 'iq', 'Ivory Coast': 'ci', 'Japan': 'jp', 'Jordan': 'jo', 'Mexico': 'mx', 'Morocco': 'ma',
  'Netherlands': 'nl', 'New Zealand': 'nz', 'Norway': 'no', 'Panama': 'pa', 'Paraguay': 'py',
  'Portugal': 'pt', 'Qatar': 'qa', 'Saudi Arabia': 'sa', 'Scotland': 'gb-sct', 'Senegal': 'sn',
  'South Africa': 'za', 'South Korea': 'kr', 'Spain': 'es', 'Sweden': 'se', 'Switzerland': 'ch',
  'Tunisia': 'tn', 'Türkiye': 'tr', 'United States': 'us', 'Uruguay': 'uy', 'Uzbekistan': 'uz'
};

export const fallbackPoints = {
  'France': 18,'Germany': 17,'Algeria': 6,'Colombia': 10,'Congo DR': 4,'Ecuador': 8,'Haiti': 2,'Iraq': 3,'Norway': 9,'Saudi Arabia': 4,'Tunisia': 5,'Türkiye': 8,
  'England': 18,'Spain': 17,'Bosnia and Herzegovina': 4,'Croatia': 11,'Ivory Coast': 6,'Jordan': 2,'New Zealand': 3,'Paraguay': 6,'Qatar': 4,'Scotland': 5,'South Korea': 8,'Sweden': 9,
  'Argentina': 18,'Netherlands': 16,'Australia': 7,'Cape Verde': 4,'Curaçao': 3,'Czechia': 8,'Ghana': 7,'Japan': 10,'Mexico': 9,'Panama': 5,'Senegal': 8,'Uruguay': 11,
  'Brazil': 19,'Portugal': 16,'Austria': 8,'Belgium': 10,'Canada': 7,'Egypt': 5,'Iran': 5,'Morocco': 9,'South Africa': 4,'Switzerland': 8,'United States': 8,'Uzbekistan': 3
};

export const showcaseFixtures = [
  ['France','England','Opening duel'], ['Argentina','Brazil','Heavyweight clash'], ['Germany','Spain','Classic rivalry'], ['Portugal','Netherlands','Prime-time spotlight'],
  ['Colombia','Croatia','Mid-table mover'], ['Japan','United States','Pace test'], ['Morocco','Mexico','Crowd favorite'], ['Sweden','Uruguay','Late drama'],
  ['Norway','Saudi Arabia','Points battle'], ['Tunisia','Qatar','Regional showdown'], ['Australia','Canada','Balanced matchup'], ['Belgium','Switzerland','Tactical chess']
];

export function allTeams(manager) {
  return [...manager.top2, ...manager.others];
}

export function chunkTeams(teams, size = 3) {
  const chunks = [];
  for (let i = 0; i < teams.length; i += size) chunks.push(teams.slice(i, i + size));
  return chunks;
}
