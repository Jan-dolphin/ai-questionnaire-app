import { prisma } from "@/lib/prisma";
import { ColleagueClientButtons } from "@/components/colleagues/ColleagueClientButtons";
import { ColleagueForm } from "@/components/colleagues/ColleagueForm";

export default async function ColleaguesPage() {
  const colleagues = await prisma.colleague.findMany({
    where: { archived: false },
    orderBy: { name: 'asc' },
    include: {
      sessions: {
        include: {
          campaign: true
        },
        orderBy: { updated_at: 'desc' }
      }
    }
  });

  return (
    <main style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem' }}>Zaměstnanci</h1>
        <ColleagueForm />
      </div>

      <div style={{ display: 'grid', gap: '24px' }}>
        {colleagues.map(col => (
          <div key={col.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '16px', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{col.name}</h2>
                <div style={{ color: 'var(--text-muted)' }}>{col.email}</div>
                {col.department && <div style={{ marginTop: '4px', fontSize: '0.9rem' }}>Oddělení: {col.department}</div>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                <span style={{ 
                  display: 'inline-block', 
                  padding: '4px 12px', 
                  backgroundColor: col.active ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)', 
                  color: col.active ? '#2ecc71' : '#e74c3c', 
                  borderRadius: '20px', 
                  fontSize: '0.85rem', 
                  fontWeight: 500 
                }}>
                  {col.active ? 'Aktivní' : 'Neaktivní'}
                </span>
                <ColleagueClientButtons id={col.id} isActive={col.active} />
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Historie kampaní ({col.sessions.length})</h3>
              
              {col.sessions.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                  Zatím nebyl zařazen do žádné kampaně.
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '12px' }}>
                  {col.sessions.map(session => (
                    <div key={session.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'var(--background)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                      <div>
                        <div style={{ fontWeight: 500 }}>{session.campaign.name}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }} suppressHydrationWarning>
                          Aktualizováno: {new Date(session.updated_at).toLocaleString('cs-CZ')}
                        </div>
                      </div>
                      <div>
                        {session.status === 'completed' ? (
                          <span style={{ color: '#2ecc71', fontSize: '0.9rem', fontWeight: 500 }}>✔ Dokončeno</span>
                        ) : session.status === 'in_progress' ? (
                          <span style={{ color: '#f1c40f', fontSize: '0.9rem', fontWeight: 500 }}>⏳ Zpracovává se</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>🕒 Čeká</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
