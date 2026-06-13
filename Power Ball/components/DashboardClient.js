'use client';

import { useEffect, useMemo, useState } from 'react';
import { managers, fallbackPoints, showcaseFixtures, allTeams, chunkTeams, teamCodeMap } from '@/data/tournament';

const tabs = [
  { id: 'scoreboard', label: '🏆 Scoreboard' },
  { id: 'squads', label: '🧑‍✈️ Squads' },
  { id: 'groups', label: '🗺️ Group Map' },
  { id: 'schedule', label: '📅 Schedule' }
];

function getTotal(manager, scores) {
  return allTeams(manager).reduce((sum, team) => sum + (scores[team] || 0), 0);
}

function TeamChip({ team, scores }) {
  const code = teamCodeMap[team];
  return (
    <span className="teamChip">
      {code ? <img src={`https://flagcdn.com/w40/${code}.png`} alt={`${team} flag`} width="20" height="15" loading="lazy" /> : null}
      {team}
      <strong>{scores[team] || 0}</strong>
    </span>
  );
}

export default function DashboardClient() {
  const [activeTab, setActiveTab] = useState('scoreboard');
  const [activeManager, setActiveManager] = useState(managers[0].id);
  const [liveData, setLiveData] = useState({ mode: 'fallback', scores: fallbackPoints, liveMatches: [], updatedAt: null, message: null });

  useEffect(() => {
    let mounted = true;
    async function loadScores() {
      try {
        const res = await fetch('/api/live', { cache: 'no-store' });
        const data = await res.json();
        if (mounted) setLiveData(data);
      } catch {
        if (mounted) setLiveData((prev) => ({ ...prev, mode: 'fallback' }));
      }
    }
    loadScores();
    const timer = setInterval(loadScores, 15000);
    return () => { mounted = false; clearInterval(timer); };
  }, []);

  const sortedManagers = useMemo(() => {
    return [...managers]
      .map((manager) => ({ ...manager, total: getTotal(manager, liveData.scores) }))
      .sort((a, b) => b.total - a.total);
  }, [liveData.scores]);

  const selectedManager = managers.find((manager) => manager.id === activeManager);
  const maxScore = sortedManagers[0]?.total || 1;

  return (
    <main className="shell">
      <header className="header">
        <div className="logo" aria-label="Power Draw Championship logo">
          <div className="logoMark">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 2L14.8 8.2L22 9.1L16.6 13.7L18.1 20.8L12 17.2L5.9 20.8L7.4 13.7L2 9.1L9.2 8.2L12 2Z" fill="white"/>
            </svg>
          </div>
        </div>
        <h1>Power Draw Championship</h1>
        <p className="sub">Live manager tracking with automatic polling for updated scores after matches finish.</p>
        <div className="liveBanner glass">
          <span className={`statusDot ${liveData.mode === 'live' ? 'online' : 'offline'}`}></span>
          <span>{liveData.mode === 'live' ? 'Live sync active' : 'Fallback mode active'}</span>
          {liveData.updatedAt ? <small>Updated {new Date(liveData.updatedAt).toLocaleTimeString()}</small> : null}
          {liveData.message ? <small>{liveData.message}</small> : null}
        </div>
      </header>

      <div className="tabsWrap">
        <div className="tabs glass" role="tablist" aria-label="Sections">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="managerWrap">
        <div className="managerPills glass">
          {managers.map((manager) => (
            <button
              key={manager.id}
              className={`managerPill ${activeManager === manager.id ? 'active' : ''}`}
              onClick={() => setActiveManager(manager.id)}
            >
              <span>{manager.emoji}</span>{manager.name}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'scoreboard' && (
        <section className="panel">
          <div className="glass card intro">
            <p><strong>Live mode:</strong> the page polls the server every 15 seconds, so finished games can flow into the scoreboard automatically when your API returns updated scores.</p>
          </div>
          {!!liveData.liveMatches?.length && (
            <div className="glass card contentCard matchStrip">
              <h2 className="sectionTitle">Tracked matches</h2>
              <div className="fixtureListCompact">
                {liveData.liveMatches.slice(0, 8).map((match, i) => (
                  <div className="compactFixture" key={i}>
                    <span>{match.homeName} {match.homeScore} - {match.awayScore} {match.awayName}</span>
                    <small>{match.status}{match.minute ? ` · ${match.minute}` : ''}</small>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="rankList">
            {sortedManagers.map((manager, index) => (
              <article key={manager.id} className="glass rankCard card">
                <div className="rankTop">
                  <span className="medal">{['🥇','🥈','🥉','🏅'][index] || '•'}</span>
                  <span className="nameTag" style={{ background: manager.gradient }}>{manager.emoji} {manager.name}</span>
                  <span className="meta">12 teams · auto-refreshing totals</span>
                  <span className="points">{manager.total}<small>pts</small></span>
                </div>
                <div className="bar"><span style={{ width: `${(manager.total / maxScore) * 100}%`, background: manager.gradient }}></span></div>
                <div className="teamChips">
                  {allTeams(manager).map((team) => <TeamChip key={team} team={team} scores={liveData.scores} />)}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'squads' && (
        <section className="panel grid2">
          <div className="glass card contentCard">
            <h2 className="sectionTitle">Selected manager</h2>
            <div className="overviewHead">
              <span className="nameTag" style={{ background: selectedManager.gradient }}>{selectedManager.emoji} {selectedManager.name}</span>
              <span className="badge">{getTotal(selectedManager, liveData.scores)} pts</span>
            </div>
            <div className="groupBlock">
              <div className="groupTitle">Top 2 seeds</div>
              {selectedManager.top2.map((team) => (
                <div className="teamRow" key={team}><span>{team}</span><span className="badge success">{liveData.scores[team] || 0} pts</span></div>
              ))}
            </div>
            <div className="groupBlock">
              <div className="groupTitle">Remaining 10</div>
              {selectedManager.others.map((team) => (
                <div className="teamRow" key={team}><span>{team}</span><span className="badge">{liveData.scores[team] || 0} pts</span></div>
              ))}
            </div>
          </div>
          <div className="glass card contentCard">
            <h2 className="sectionTitle">How live tracking works</h2>
            <p className="muted">This project uses a server route at <code>/api/live</code> and polls it every 15 seconds. Add your real football API key in Vercel environment variables, and the dashboard will replace fallback scores with live or completed match data.</p>
          </div>
        </section>
      )}

      {activeTab === 'groups' && (
        <section className="panel">
          <div className="glass card contentCard">
            <h2 className="sectionTitle">Manager group map</h2>
            <div className="squadGrid">
              {managers.map((manager) => (
                <article className="groupBlock" key={manager.id}>
                  <div className="overviewHead">
                    <span className="nameTag" style={{ background: manager.gradient }}>{manager.emoji} {manager.name}</span>
                    <span className="badge">4 groups</span>
                  </div>
                  {chunkTeams(allTeams(manager), 3).map((chunk, idx) => (
                    <div className="groupBlock nested" key={idx}>
                      <div className="groupTitle">Group {idx + 1}</div>
                      {chunk.map((team) => (
                        <div className="teamRow" key={team}><span>{team}</span><span className="badge">{liveData.scores[team] || 0} pts</span></div>
                      ))}
                    </div>
                  ))}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {activeTab === 'schedule' && (
        <section className="panel">
          <div className="glass card contentCard">
            <h2 className="sectionTitle">Showcase fixtures</h2>
            <div className="fixtureList">
              {showcaseFixtures.map(([home, away, note], i) => (
                <div className="fixture" key={i}>
                  <div><strong>{home}</strong><small>{note}</small></div>
                  <div className="vs">VS</div>
                  <div><strong>{away}</strong><small>Matchday {Math.floor(i / 4) + 1}</small></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
