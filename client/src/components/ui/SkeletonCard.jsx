const SkeletonCard = () => {
  return (
    <div style={{ backgroundColor: '#FFFFFF' }}>
      <div className="animate-pulse" style={{ height: '240px', backgroundColor: '#F5F5F5' }} />
      <div style={{ padding: '16px' }}>
        <div className="animate-pulse" style={{ height: '8px', width: '40%', backgroundColor: '#E5E5E5', marginBottom: '10px' }} />
        <div className="animate-pulse" style={{ height: '12px', width: '75%', backgroundColor: '#E5E5E5', marginBottom: '8px' }} />
        <div className="animate-pulse" style={{ height: '10px', width: '90%', backgroundColor: '#F5F5F5', marginBottom: '12px' }} />
        <div className="animate-pulse" style={{ height: '14px', width: '35%', backgroundColor: '#E5E5E5', marginBottom: '8px' }} />
        <div className="animate-pulse" style={{ height: '10px', width: '50%', backgroundColor: '#F5F5F5', marginBottom: '14px' }} />
        <div className="flex" style={{ gap: '1px' }}>
          <div className="animate-pulse" style={{ height: '36px', flex: 1, backgroundColor: '#E5E5E5' }} />
          <div className="animate-pulse" style={{ height: '36px', width: '44px', backgroundColor: '#F5F5F5' }} />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
