import { useState } from 'react';
import { submitContact } from '../api';
import './ContactPage.css';

const INQUIRY_TYPES = [
  { value: 'GENERAL', label: 'General Inquiry' },
  { value: 'ORDER', label: 'Custom Order' },
  { value: 'CATERING', label: 'Catering' },
  { value: 'WHOLESALE', label: 'Wholesale' },
  { value: 'FEEDBACK', label: 'Feedback' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', inquiryType: 'GENERAL', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await submitContact(form);
      setStatus('success');
      setForm({ name: '', email: '', phone: '', inquiryType: 'GENERAL', message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (status === 'error') setStatus('idle');
  };

  return (
    <div className="contact-page section">
      <div className="container">
        <div className="section-title">
          <h2>Get in Touch</h2>
          <div className="divider" />
          <p>Have a question or want to place a custom order? We'd love to hear from you.</p>
        </div>

        <div className="contact-form-wrapper">
          {status === 'success' ? (
            <div className="contact-success">
              <h3>Thank You!</h3>
              <p>We've received your message and will get back to you soon.</p>
              <button className="btn btn-primary" onClick={() => setStatus('idle')}>Send Another Message</button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Name *</label>
                  <input id="name" type="text" value={form.name} onChange={(e) => updateField('name', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input id="email" type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input id="phone" type="tel" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="inquiryType">Inquiry Type</label>
                  <select id="inquiryType" value={form.inquiryType} onChange={(e) => updateField('inquiryType', e.target.value)}>
                    {INQUIRY_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea id="message" value={form.message} onChange={(e) => updateField('message', e.target.value)} required rows={5} />
              </div>
              {status === 'error' && <p className="form-message error">{errorMsg}</p>}
              <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
