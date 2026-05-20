import React from 'react';

const AtmosphericBlooms = ({ intensity = 'medium' }) => {
  // Opacity based on intensity
  const opacityMap = {
    subtle: 0.05,
    medium: 0.08,
    vibrant: 0.12,
  };
  const opacity = opacityMap[intensity] || opacityMap.medium;

  // Size variations for more natural look
  const sizes = [
    'w-[600px] h-[600px]',
    'w-[500px] h-[500px]',
    'w-[450px] h-[450px]',
  ];

  // Positions for the blooms
  const positions = [
    'top-[-200px] left-[-200px]',
    'top-[-150px] right-[-200px]',
    'bottom-[-250px] left-[30%]',
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {positions.map((pos, idx) => (
        <div
          key={idx}
          className={`absolute ${positions[idx]} ${sizes[idx]} rounded-full blur-[100px]`}
          style={{ opacity }}
        >
          {idx === 0 && (
            <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 rounded-full" />
          )}
          {idx === 1 && (
            <div className="w-full h-full bg-gradient-to-br from-pink-500 via-pink-600 to-pink-700 rounded-full" />
          )}
          {idx === 2 && (
            <div className="w-full h-full bg-gradient-to-br from-cyan-400 via-cyan-500 to-cyan-600 rounded-full" />
          )}
        </div>
      ))}
    </div>
  );
};

export default AtmosphericBlooms;
