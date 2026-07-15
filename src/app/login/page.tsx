'use client';

import { authenticate } from './actions';
import { useActionState } from 'react';

export default function LoginPage() {
  const [errorMessage, dispatch] = useActionState(authenticate, undefined);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--background)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '32px' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '24px', textAlign: 'center' }}>Přihlášení</h1>
        <form action={dispatch} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Email</label>
            <input 
              name="email"
              type="email" 
              className="form-control" 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Heslo</label>
            <input 
              name="password"
              type="password" 
              className="form-control" 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
              required
            />
          </div>
          {errorMessage && (
            <div style={{ color: 'var(--warning)', fontSize: '0.9rem', textAlign: 'center' }}>{errorMessage}</div>
          )}
          <button type="submit" className="btn" style={{ marginTop: '16px', width: '100%' }}>
            Přihlásit se
          </button>
        </form>
      </div>
    </div>
  );
}
