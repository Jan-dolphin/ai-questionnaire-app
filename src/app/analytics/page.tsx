import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { QuestionAggregator } from "@/components/analytics/QuestionAggregator";

export default async function AnalyticsPage(props: {
  searchParams: Promise<{ campaignId?: string }>;
}) {
  const searchParams = await props.searchParams;
  const campaigns = await prisma.campaign.findMany({
    orderBy: { id: 'desc' }
  });

  const selectedCampaignId = searchParams.campaignId ? parseInt(searchParams.campaignId) : (campaigns[0]?.id || null);

  if (!selectedCampaignId) {
    return (
      <div>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '24px' }}>Analýza odpovědí</h1>
        <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          Zatím nejsou k dispozici žádné kampaně k analýze.
        </div>
      </div>
    );
  }

  const selectedCampaign = await prisma.campaign.findUnique({
    where: { id: selectedCampaignId },
    include: {
      questions: { orderBy: { question_index: 'asc' } },
      sessions: { where: { status: 'completed' }, include: { colleague: true } }
    }
  });

  if (!selectedCampaign) return <div>Kampaň nenalezena.</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem' }}>Analýza odpovědí</h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontWeight: 500 }}>Vybrat kampaň:</span>
          {/* We use a simple layout for the dropdown: links disguised as buttons or a client component. Since this is a Server Component, a form with GET method is easiest. */}
          <form method="GET" style={{ display: 'flex' }}>
            <select 
              name="campaignId" 
              className="form-control"
              style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', marginRight: '8px' }}
              defaultValue={selectedCampaignId || ''}
            >
              {campaigns.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <button type="submit" className="btn" style={{ padding: '8px 12px' }}>Zobrazit</button>
          </form>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '24px' }}>
        <div className="card" style={{ display: 'flex', gap: '24px', backgroundColor: 'var(--background)' }}>
          <div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Dokončeno průzkumů</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{selectedCampaign.sessions.length}</div>
          </div>
        </div>

        {selectedCampaign.questions.map(q => {
          // Extract answers for this specific question from all completed sessions
          const questionAnswers: string[] = [];
          selectedCampaign.sessions.forEach(session => {
            try {
              const parsed = JSON.parse(session.answers);
              const ans = parsed[q.question_index.toString()];
              if (ans !== undefined && ans !== null) {
                questionAnswers.push(ans.toString());
              }
            } catch (e) {
              // Ignore invalid JSON
            }
          });

          return (
            <QuestionAggregator key={q.id} question={q} answers={questionAnswers} />
          );
        })}
      </div>
    </div>
  );
}
