import { useState } from 'react';
import { subscribe } from '../api';
import './ComingSoon.css';

export default function ComingSoon() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const result = await subscribe(email);
      setStatus('success');
      setMessage(result.message);
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  return (
    <div className="coming-soon">
      <div className="coming-soon-overlay" />
      <div className="coming-soon-content">
        <span className="coming-soon-badge">Coming Soon</span>
        <img src="/logo.png" alt="He Does It!" className="coming-soon-logo" />
        <p className="coming-soon-tagline">
          Artisan baked goods crafted with love.<br />
          Something delicious is on its way.
        </p>

        <form className="coming-soon-form" onSubmit={handleSubmit}>
          <div className="coming-soon-input-group">
            <input
              type="email"
              placeholder="Enter your email for updates"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={status === 'loading'}
            />
            <button type="submit" className="btn btn-gold" disabled={status === 'loading'}>
              {status === 'loading' ? 'Sending...' : 'Notify Me'}
            </button>
          </div>
          {status === 'success' && <p className="form-message success">{message}</p>}
          {status === 'error' && <p className="form-message error">{message}</p>}
        </form>

        <div className="coming-soon-social">
          <p>Follow our journey</p>
          <div className="social-links">
            <a href="#" aria-label="Instagram">Instagram</a>
            <a href="#" aria-label="Facebook">Facebook</a>
          </div>
        </div>
      </div>
    </div>
  );
}
