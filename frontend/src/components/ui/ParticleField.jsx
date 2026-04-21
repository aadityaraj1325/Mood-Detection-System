import { useMemo } from 'react';

function ParticleField() {
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, index) => ({
        id: index,
        size: Math.round(2 + Math.random() * 6),
        left: Math.round(Math.random() * 100),
        duration: 10 + Math.random() * 12,
        delay: Math.random() * 5,
        opacity: 0.15 + Math.random() * 0.4
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="absolute rounded-full bg-cyan-300 blur-[1px]"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.left}%`,
            bottom: '-20px',
            opacity: particle.opacity,
            animation: `floatY ${particle.duration}s linear ${particle.delay}s infinite`
          }}
        />
      ))}
      <style>
        {`@keyframes floatY { from { transform: translateY(0); } to { transform: translateY(-115vh); } }`}
      </style>
    </div>
  );
}

export default ParticleField;
