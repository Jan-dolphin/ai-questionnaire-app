import { prisma } from "@/lib/prisma";
import { CampaignForm } from "@/components/campaigns/CampaignForm";
import { TriggerCampaignButton } from "./TriggerCampaignButton";

export default async function CampaignsPage() {
  const campaigns = await prisma.campaign.findMany({
    where: { archived: false },
    include: {
      questions: {
        orderBy: { question_index: 'asc' }
      }
    },
    orderBy: { id: 'desc' }
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem' }}>Správa Kampaní</h1>
        <CampaignForm />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {campaigns.map(camp => (
          <div key={camp.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{camp.name}</h2>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Klíč: {camp.key}</div>
                {camp.description && <div style={{ marginTop: '8px' }}>{camp.description}</div>}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn" style={{ backgroundColor: 'white', color: 'var(--foreground)', border: '1px solid var(--border)' }}>Upravit</button>
                <TriggerCampaignButton campaignId={camp.id} />
              </div>
            </div>

            <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', marginTop: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>Otázky ({camp.questions.length})</h3>
            
            {camp.questions.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {camp.questions.map(q => (
                  <div key={q.id} style={{ padding: '16px', backgroundColor: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ backgroundColor: 'var(--border)', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>{q.question_index}</span>
                        {q.question_text}
                      </strong>
                      <span className="badge" style={{ backgroundColor: 'var(--border)', color: 'var(--text-muted)' }}>{q.question_type}</span>
                    </div>
                    {q.allowed_options && q.allowed_options !== 'null' && (
                      <div style={{ marginTop: '12px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        <div style={{ marginBottom: '8px' }}><strong>Možnosti:</strong></div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {(() => {
                            try {
                              const parsed = JSON.parse(q.allowed_options);
                              return Object.entries(parsed).map(([key, val]) => (
                                <span key={key} style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)', padding: '4px 10px', borderRadius: '16px', color: 'var(--foreground)' }}>
                                  <strong style={{ color: 'var(--primary)' }}>{key}</strong>: {val as string}
                                </span>
                              ));
                            } catch (e) {
                              return <span>{q.allowed_options}</span>;
                            }
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)' }}>Zatím nejsou přidány žádné otázky.</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
