import React from 'react';

const AtmosphericBlooms = ({ intensity = 'medium' }) => {
  const intensities = {
    subtle: { size: '400px', opacity: 0.05 },
    medium: { size: '600px', opacity: 0.08 },
    vibrant: { size: '800px', opacity: 0.12 },
  };

  const settings = intensities[intensity] || intensities.medium;

  const blooms = [
    { color: 'indigo', style: { top: '-200px', left: '-200px', width: settings.size, height: settings.size } },
    { color: 'pink', style: { bottom: '-300px', right: '-150px', width: settings.size, height: settings.size } },
    { color: 'cyan', style: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: settings.size, height: settings.size } },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {blooms.map((bloom, index) => (
        <div
          key={index}
          className={`bloom-circle ${bloom.color}`}
          style={{
            ...bloom.style,
            opacity: settings.opacity,
            filter: `blur(100px)`,
          }}
        />
      ))}
    </div>
  );
};

export default AtmosphericBlooms;
