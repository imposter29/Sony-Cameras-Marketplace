const Section = ({ title, children }) => (
  <div style={{ marginBottom: '40px' }}>
    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 500, color: '#000', marginBottom: '12px' }}>{title}</h2>
    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#404040', lineHeight: 1.9 }}>{children}</div>
  </div>
);

const Privacy = () => (
  <div style={{ backgroundColor: '#FFFFFF', minHeight: 'calc(100vh - 56px)' }}>
    {/* Hero */}
    <div style={{ backgroundColor: '#000', padding: '64px 40px', textAlign: 'center' }}>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.3em', color: '#7F7F7F', marginBottom: '14px' }}>LEGAL</p>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '44px', fontWeight: 400, color: '#fff' }}>Privacy Policy</h1>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#7F7F7F', marginTop: '12px' }}>Last updated: April 2026</p>
    </div>

    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '64px 40px 80px' }}>
      <Section title="1. Information We Collect">
        <p>We collect information you provide directly to us when you create an account, place an order, or contact us. This includes your name, email address, postal address, phone number, and payment information.</p>
        <p style={{ marginTop: '10px' }}>We also automatically collect certain information about your device and how you interact with our website, including IP address, browser type, pages visited, and time spent on pages.</p>
      </Section>

      <Section title="2. How We Use Your Information">
        <p>We use the information we collect to:</p>
        <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
          <li style={{ marginBottom: '6px' }}>Process and fulfil your orders</li>
          <li style={{ marginBottom: '6px' }}>Send order confirmations and delivery updates</li>
          <li style={{ marginBottom: '6px' }}>Respond to your comments, questions and support requests</li>
          <li style={{ marginBottom: '6px' }}>Send promotional communications (you may opt out at any time)</li>
          <li style={{ marginBottom: '6px' }}>Monitor and analyse usage to improve our services</li>
          <li>Detect, investigate and prevent fraudulent transactions</li>
        </ul>
      </Section>

      <Section title="3. Sharing of Information">
        <p>We do not sell, trade, or rent your personal information to third parties. We may share your information with:</p>
        <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
          <li style={{ marginBottom: '6px' }}><strong>Service providers</strong> who assist in operating our website and conducting business (e.g. payment processors, logistics partners)</li>
          <li style={{ marginBottom: '6px' }}><strong>Sony Corporation</strong> for product warranty and support purposes</li>
          <li>Law enforcement authorities when required by applicable law</li>
        </ul>
      </Section>

      <Section title="4. Cookies">
        <p>We use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies help us remember your preferences and improve your browsing experience. You can instruct your browser to refuse all cookies, but some parts of our website may not function properly as a result.</p>
      </Section>

      <Section title="5. Data Retention">
        <p>We retain personal data for as long as necessary to fulfil the purposes described in this policy, including legal, accounting, and reporting requirements. Order data is retained for 7 years in compliance with Indian tax law.</p>
      </Section>

      <Section title="6. Security">
        <p>We take commercially reasonable measures to protect your personal information from unauthorised access, use, or disclosure. However, no internet transmission is completely secure and we cannot guarantee absolute security.</p>
      </Section>

      <Section title="7. Your Rights">
        <p>You have the right to access, correct, update, or delete the personal information we hold about you. To exercise these rights, please contact us at <strong>privacy@sonycameras.in</strong>. We will respond within 30 days.</p>
      </Section>

      <Section title="8. Changes to This Policy">
        <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page with an updated revision date. Your continued use of our website after the update constitutes acceptance of the revised policy.</p>
      </Section>

      <Section title="9. Contact">
        <p>If you have any questions about this Privacy Policy, please contact us at:<br />
        <strong>Sony Cameras India — Privacy Team</strong><br />
        A-31, Mohan Cooperative Industrial Estate, New Delhi – 110044<br />
        Email: <strong>privacy@sonycameras.in</strong></p>
      </Section>
    </div>
  </div>
);

export default Privacy;
