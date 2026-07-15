'use client';

interface Props {
  question: {
    question_text: string;
    question_type: string;
    allowed_options: string | null;
  };
  answers: string[]; // Array of strings (each string is an answer to this question)
}

export function QuestionAggregator({ question, answers }: Props) {
  // Count frequencies
  const frequencies: Record<string, number> = {};
  let totalValidAnswers = 0;

  answers.forEach(ans => {
    if (!ans) return;
    totalValidAnswers++;
    if (question.question_type === 'multi_choice') {
      // Assuming multi choice answers might be comma separated or JSON array
      // Simplification: just count the raw string for now
      frequencies[ans] = (frequencies[ans] || 0) + 1;
    } else {
      frequencies[ans] = (frequencies[ans] || 0) + 1;
    }
  });

  const isChoice = question.question_type === 'single_choice' || question.question_type === 'multi_choice';

  return (
    <div className="card" style={{ marginBottom: '24px' }}>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{question.question_text}</h3>
      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
        Typ: {question.question_type} | Celkem odpovědí: {totalValidAnswers}
      </div>

      {isChoice ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Object.entries(frequencies).sort((a, b) => b[1] - a[1]).map(([ans, count]) => {
            const percentage = totalValidAnswers > 0 ? Math.round((count / totalValidAnswers) * 100) : 0;
            return (
              <div key={ans}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.95rem' }}>
                  <span>{ans}</span>
                  <span style={{ fontWeight: 500 }}>{count} ({percentage}%)</span>
                </div>
                <div style={{ width: '100%', backgroundColor: 'var(--border)', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{ width: `${percentage}%`, backgroundColor: 'var(--primary)', height: '100%', transition: 'width 0.5s ease-out' }}></div>
                </div>
              </div>
            );
          })}
          {Object.keys(frequencies).length === 0 && (
            <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Žádná data k zobrazení.</div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '8px' }}>Poslední odpovědi:</h4>
          {answers.filter(Boolean).slice(0, 10).map((ans, idx) => (
            <div key={idx} style={{ padding: '12px', backgroundColor: 'var(--background)', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.95rem' }}>
              "{ans}"
            </div>
          ))}
          {answers.length === 0 && (
             <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Žádná data k zobrazení.</div>
          )}
        </div>
      )}
    </div>
  );
}
