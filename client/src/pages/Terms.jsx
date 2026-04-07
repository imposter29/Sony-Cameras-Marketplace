const Section = ({ title, children }) => (
  <div style={{ marginBottom: '40px' }}>
    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 500, color: '#000', marginBottom: '12px' }}>{title}</h2>
    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#404040', lineHeight: 1.9 }}>{children}</div>
  </div>
);

const Terms = () => (
  <div style={{ backgroundColor: '#FFFFFF', minHeight: 'calc(100vh - 56px)' }}>
    {/* Hero */}
    <div style={{ backgroundColor: '#000', padding: '64px 40px', textAlign: 'center' }}>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.3em', color: '#7F7F7F', marginBottom: '14px' }}>LEGAL</p>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '44px', fontWeight: 400, color: '#fff' }}>Terms & Conditions</h1>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#7F7F7F', marginTop: '12px' }}>Last updated: April 2026</p>
    </div>

    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '64px 40px 80px' }}>
      <Section title="1. Acceptance of Terms">
        <p>By accessing or using the Sony Cameras India website and marketplace, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree to these terms, please do not use our services.</p>
      </Section>

      <Section title="2. Products and Pricing">
        <p>All products listed on this marketplace are genuine Sony products sold through authorised channels. Prices are displayed in Indian Rupees (₹) and include applicable taxes unless stated otherwise.</p>
        <p style={{ marginTop: '10px' }}>We reserve the right to modify prices at any time without notice. However, the price displayed at the time of order confirmation is the price you will be charged.</p>
      </Section>

      <Section title="3. Orders and Payment">
        <p>By placing an order, you make an offer to purchase the product at the stated price. We reserve the right to accept or decline any order.</p>
        <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
          <li style={{ marginBottom: '6px' }}>Orders are confirmed only after successful payment</li>
          <li style={{ marginBottom: '6px' }}>We accept UPI, credit/debit cards, and net banking</li>
          <li>All transactions are processed securely through our payment gateway</li>
        </ul>
      </Section>

      <Section title="4. Shipping and Delivery">
        <p>We ship across India. Delivery timelines vary by location and are estimates only. Sony Cameras India is not liable for delays caused by logistics partners, natural disasters, or other events beyond our control.</p>
        <p style={{ marginTop: '10px' }}>Risk of loss and title for products pass to you upon delivery to the carrier.</p>
      </Section>

      <Section title="5. Returns and Refunds">
        <p>Products may be returned within 10 days of delivery if they are unused, in original packaging, and accompanied by proof of purchase. Certain products (e.g. opened software, custom orders) are not eligible for return.</p>
        <p style={{ marginTop: '10px' }}>Refunds are processed within 7–10 business days after we receive and inspect the returned item.</p>
      </Section>

      <Section title="6. Warranty">
        <p>All Sony products carry the standard Sony India manufacturer's warranty. Warranty claims must be directed to Sony India authorised service centres. Sony Cameras India does not independently provide warranty services.</p>
      </Section>

      <Section title="7. Intellectual Property">
        <p>All content on this website — including images, text, logos, and design — is the property of Sony Cameras India or Sony Corporation and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without express written permission.</p>
      </Section>

      <Section title="8. Limitation of Liability">
        <p>To the maximum extent permitted by law, Sony Cameras India shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our website or products.</p>
      </Section>

      <Section title="9. Governing Law">
        <p>These Terms are governed by the laws of India. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts in New Delhi, India.</p>
      </Section>

      <Section title="10. Changes to Terms">
        <p>We reserve the right to modify these Terms at any time. Updated terms will be posted on this page with a revised date. Continued use of our services after changes constitutes acceptance of the new terms.</p>
      </Section>

      <Section title="11. Contact">
        <p>For questions regarding these Terms, please contact:<br />
        <strong>Sony Cameras India — Legal</strong><br />
        A-31, Mohan Cooperative Industrial Estate, New Delhi – 110044<br />
        Email: <strong>legal@sonycameras.in</strong></p>
      </Section>
    </div>
  </div>
);

export default Terms;
