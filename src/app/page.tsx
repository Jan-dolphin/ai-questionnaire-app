import { prisma } from "@/lib/prisma";

export default async function Dashboard() {
  const campaignsCount = await prisma.campaign.count({ where: { is_active: true } });
  const colleaguesCount = await prisma.colleague.count({ where: { active: true } });
  const completedSessions = await prisma.session.count({ where: { status: 'completed' } });
  const inProgressSessions = await prisma.session.count({ where: { status: 'in_progress' } });

  const activeCampaigns = await prisma.campaign.findMany({
    where: { is_active: true },
    include: {
      sessions: true
    }
  });

  return (
    <div>
      <h1 style={{ marginBottom: '24px', fontSize: '1.8rem' }}>Přehled systému</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="card">
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Aktivní kampaně</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{campaignsCount}</div>
        </div>
        <div className="card">
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Aktivní zaměstnanci</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{colleaguesCount}</div>
        </div>
        <div className="card">
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Dokončené průzkumy</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>{completedSessions}</div>
        </div>
        <div className="card">
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Čekající / Rozepsané</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning)' }}>{inProgressSessions}</div>
        </div>
      </div>

      <h2 style={{ marginBottom: '16px', fontSize: '1.4rem' }}>Běžící kampaně</h2>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Název kampaně</th>
              <th>Klíč</th>
              <th>Celkem odesláno</th>
              <th>Dokončeno</th>
            </tr>
          </thead>
          <tbody>
            {activeCampaigns.map(camp => {
              const total = camp.sessions.length;
              const completed = camp.sessions.filter(s => s.status === 'completed').length;
              return (
                <tr key={camp.id}>
                  <td style={{ fontWeight: 500 }}>{camp.name}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{camp.key}</td>
                  <td>{total}</td>
                  <td>
                    <span className="badge badge-completed">{completed} / {total}</span>
                  </td>
                </tr>
              )
            })}
            {activeCampaigns.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>Žádné aktivní kampaně.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
