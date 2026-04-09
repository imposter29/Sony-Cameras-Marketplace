const steps = ['Address', 'Payment', 'Review'];

const StepIndicator = ({ currentStep = 0 }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {steps.map((step, index) => (
        <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              backgroundColor: index <= currentStep ? '#000' : '#E5E5E5',
              color: index <= currentStep ? '#fff' : '#7F7F7F',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 600,
            }}>
              {index < currentStep ? '✓' : index + 1}
            </div>
            <span style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 600,
              color: index <= currentStep ? '#000' : '#7F7F7F',
              textTransform: 'uppercase', letterSpacing: '0.1em',
            }}>
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div style={{
              width: '40px', height: '1px', margin: '0 12px',
              backgroundColor: index < currentStep ? '#000' : '#E5E5E5',
            }} />
          )}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
