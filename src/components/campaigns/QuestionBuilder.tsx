'use client';

import { useState } from 'react';
import { SingleChoiceOptions } from './options/SingleChoiceOptions';
import { MultiChoiceOptions } from './options/MultiChoiceOptions';

interface Question {
  id?: number;
  question_index: number;
  question_type: string;
  question_text: string;
  html_template: string;
  allowed_options: string;
}

interface Props {
  initialQuestions?: Question[];
  onChange: (questions: Question[]) => void;
}

export function QuestionBuilder({ initialQuestions = [], onChange }: Props) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);

  const handleAddQuestion = () => {
    const newIndex = questions.length > 0 ? Math.max(...questions.map(q => q.question_index)) + 1 : 1;
    const newQuestion: Question = {
      question_index: newIndex,
      question_type: 'single_choice',
      question_text: '',
      html_template: '',
      allowed_options: ''
    };
    const updated = [...questions, newQuestion];
    setQuestions(updated);
    onChange(updated);
  };

  const handleUpdateQuestion = (index: number, updates: Partial<Question>) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], ...updates };
    setQuestions(updated);
    onChange(updated);
  };

  const handleDeleteQuestion = (index: number) => {
    const updated = questions.filter((_, i) => i !== index);
    // Recalculate indexes
    const reindexed = updated.map((q, i) => ({ ...q, question_index: i + 1 }));
    setQuestions(reindexed);
    onChange(reindexed);
  };

  return (
    <div style={{ marginTop: '24px' }}>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Otázky ({questions.length})</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '24px' }}>
        {questions.map((q, index) => (
          <div key={index} style={{ padding: '24px', backgroundColor: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border)', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <strong style={{ fontSize: '1.1rem' }}>Otázka {q.question_index}</strong>
              <button 
                type="button" 
                onClick={() => handleDeleteQuestion(index)}
                style={{ color: 'var(--warning)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
              >
                Smazat otázku
              </button>
            </div>

            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Typ otázky</label>
                <select 
                  className="form-control" 
                  value={q.question_type} 
                  onChange={(e) => {
                    const newType = e.target.value;
                    // Reset options if switching away from choice types
                    const newOptions = newType === 'open' ? '' : q.allowed_options;
                    handleUpdateQuestion(index, { question_type: newType, allowed_options: newOptions });
                  }}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                >
                  <option value="single_choice">Single Choice (Jedna možnost)</option>
                  <option value="multi_choice">Multi Choice (Více možností)</option>
                  <option value="open">Open-ended (Otevřená odpověď)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Znění otázky</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={q.question_text}
                  onChange={(e) => handleUpdateQuestion(index, { question_text: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                  placeholder="Např.: Jak jste spokojeni s přístupem k informacím?"
                  required
                />
              </div>

              {q.question_type === 'single_choice' && (
                <SingleChoiceOptions 
                  value={q.allowed_options} 
                  onChange={(newOpts) => handleUpdateQuestion(index, { allowed_options: newOpts })} 
                />
              )}

              {q.question_type === 'multi_choice' && (
                <MultiChoiceOptions 
                  value={q.allowed_options} 
                  onChange={(newOpts) => handleUpdateQuestion(index, { allowed_options: newOpts })} 
                />
              )}

              {q.question_type === 'open' && (
                <div style={{ marginTop: '16px', padding: '16px', backgroundColor: 'var(--border)', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Pro otevřenou otázku zaměstnanec odpovídá libovolným textem. Žádné možnosti nejsou potřeba.
                </div>
              )}
            </div>
          </div>
        ))}

        {questions.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px', border: '2px dashed var(--border)', borderRadius: '8px', color: 'var(--text-muted)' }}>
            Nebyly přidány žádné otázky.
          </div>
        )}
      </div>

      <button type="button" className="btn" onClick={handleAddQuestion}>
        + Přidat novou otázku
      </button>
    </div>
  );
}
