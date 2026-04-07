import { useState } from 'react';
import { useToast } from '../components/ui/Toast';
import api from '../api/axios';

const ContactUs = () => {
  const { addToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const inputStyle = {
    width: '100%', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#000',
    border: '0.5px solid #000', borderRadius: '0', padding: '12px 16px', outline: 'none',
    backgroundColor: '#fff', boxSizing: 'border-box',
  };
  const labelStyle = {
    fontFamily: "'DM Sans', sans-serif", fontSize: '9px', fontWeight: 600,
    textTransform: 'uppercase', letterSpacing: '0.14em', color: '#000',
    display: 'block', marginBottom: '8px',
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    try {
      setLoading(true);
      await api.post('/contact', form);
      setSubmitted(true);
      addToast("✓ Message sent — we'll get back to you within 24 hours.");
    } catch {
      addToast('✗ Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: 'calc(100vh - 56px)' }}>
      {/* Hero */}
      <div style={{ backgroundColor: '#000', padding: '72px 40px', textAlign: 'center' }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.3em', color: '#7F7F7F', marginBottom: '16px' }}>
          GET IN TOUCH
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', fontWeight: 400, color: '#FFFFFF', letterSpacing: '-0.5px' }}>
          Contact Us
        </h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#7F7F7F', marginTop: '16px', maxWidth: '480px', margin: '16px auto 0', lineHeight: 1.8 }}>
          Questions about a product, order support, or business enquiries — we're here to help.
        </p>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '72px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '64px', alignItems: 'start' }}>

          {/* Left — Contact Info */}
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#7F7F7F', marginBottom: '28px' }}>CONTACT DETAILS</p>
            {[
              { label: 'EMAIL', value: 'support@sonycameras.in' },
              { label: 'PHONE', value: '+91 1800 103 7799' },
              { label: 'HOURS', value: 'Mon – Sat, 9 am – 6 pm IST' },
              { label: 'ADDRESS', value: 'Sony India Pvt. Ltd.\nA-31, Mohan Cooperative Industrial Estate\nNew Delhi – 110044' },
            ].map((item) => (
              <div key={item.label} style={{ marginBottom: '28px', paddingBottom: '28px', borderBottom: '0.5px solid #E5E5E5' }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '9px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#7F7F7F', marginBottom: '6px' }}>{item.label}</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#000', whiteSpace: 'pre-line', lineHeight: 1.7 }}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* Right — Contact Form */}
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#7F7F7F', marginBottom: '28px' }}>SEND A MESSAGE</p>

            {submitted ? (
              <div style={{ border: '0.5px solid #000', padding: '40px', textAlign: 'center' }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', fontWeight: 400, color: '#000', marginBottom: '12px' }}>Message Received</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#7F7F7F', lineHeight: 1.8 }}>
                  Thank you, {form.name}. Our team will respond to <strong>{form.email}</strong> within 24 hours.
                </p>
                <button
                  onClick={() => { setForm({ name: '', email: '', subject: '', message: '' }); setSubmitted(false); }}
                  style={{ marginTop: '24px', fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', backgroundColor: '#000', color: '#fff', border: 'none', padding: '12px 28px', cursor: 'pointer' }}
                >
                  SEND ANOTHER
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>NAME *</label>
                    <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} placeholder="Your full name" />
                  </div>
                  <div>
                    <label style={labelStyle}>EMAIL *</label>
                    <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} placeholder="you@example.com" />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>SUBJECT</label>
                  <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} style={inputStyle} placeholder="What's this about?" />
                </div>
                <div>
                  <label style={labelStyle}>MESSAGE *</label>
                  <textarea
                    required rows={6} value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '140px' }}
                    placeholder="Tell us how we can help..."
                  />
                </div>
                <button type="submit" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', backgroundColor: '#000', color: '#fff', border: 'none', padding: '14px', cursor: 'pointer' }}>
                  SEND MESSAGE
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
