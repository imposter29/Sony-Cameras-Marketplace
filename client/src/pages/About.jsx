const About = () => {
  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: 'calc(100vh - 56px)' }}>
      {/* Hero */}
      <div style={{ backgroundColor: '#000', padding: '80px 40px', textAlign: 'center' }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.3em', color: '#7F7F7F', marginBottom: '16px' }}>
          OUR STORY
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '52px', fontWeight: 400, color: '#FFFFFF', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
          Crafted for creators.<br />Built for vision.
        </h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#7F7F7F', marginTop: '20px', maxWidth: '520px', margin: '20px auto 0', lineHeight: 1.8 }}>
          Sony Cameras India is the authorised digital marketplace for Sony's full range of imaging products — from professional cinema cameras to compact everyday companions.
        </p>
      </div>

      {/* Mission */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '72px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'start' }}>
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#7F7F7F', marginBottom: '16px' }}>OUR MISSION</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: 400, color: '#000', lineHeight: 1.25, marginBottom: '20px' }}>
              Putting the world's finest cameras in every creator's hands
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#404040', lineHeight: 1.9 }}>
              We believe that the right camera unlocks stories that would otherwise go untold. From wildlife photographers in the Western Ghats to wedding cinematographers in Mumbai, we ship the full Sony lineup across India with authorised pricing, warranty, and local support.
            </p>
          </div>
          <div style={{ borderLeft: '0.5px solid #E5E5E5', paddingLeft: '64px' }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#7F7F7F', marginBottom: '16px' }}>WHY SONY</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: 400, color: '#000', lineHeight: 1.25, marginBottom: '20px' }}>
              Seven decades of imaging innovation
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#404040', lineHeight: 1.9 }}>
              Sony has been at the forefront of imaging technology since 1948. From the world's first single-lens reflex digital camera to the pioneering Alpha mirrorless system, every Sony product carries decades of engineering expertise and a relentless obsession with image quality.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', backgroundColor: '#E5E5E5', marginTop: '72px' }}>
          {[
            { num: '75+', label: 'Years of imaging innovation' },
            { num: '18+', label: 'Camera models available' },
            { num: '5', label: 'Camera categories covered' },
          ].map((s) => (
            <div key={s.label} style={{ backgroundColor: '#fff', padding: '40px 32px' }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', fontWeight: 300, color: '#000', marginBottom: '8px' }}>{s.num}</p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#7F7F7F', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Categories */}
        <div style={{ marginTop: '72px' }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#7F7F7F', marginBottom: '32px' }}>WHAT WE CARRY</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[
              { name: 'Interchangeable-lens Cameras', desc: 'Sony Alpha mirrorless & DSLR systems for professionals and enthusiasts.' },
              { name: 'Vlog Cameras', desc: 'The ZV series — compact, creator-first cameras built for content.' },
              { name: 'Handycam Camcorders', desc: 'Reliable HD & 4K camcorders for capturing every moment.' },
              { name: 'Compact Cameras', desc: 'Pocket-sized powerhouses with pro-grade sensor quality.' },
              { name: 'Cinema Line Cameras', desc: 'FX-series cine cameras used on professional film sets worldwide.' },
            ].map((cat) => (
              <div key={cat.name} style={{ border: '0.5px solid #E5E5E5', padding: '24px' }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', fontWeight: 500, color: '#000', marginBottom: '8px' }}>{cat.name}</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#7F7F7F', lineHeight: 1.7 }}>{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
