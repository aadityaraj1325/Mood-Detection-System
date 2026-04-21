import { useMemo } from 'react';

function ParticleField() {
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }).map((_, index) => ({
        id: index,
        size: Math.round(2 + Math.random() * 5),
        left: Math.round(Math.random() * 100),
        top: Math.round(Math.random() * 100),
        duration: 8 + Math.random() * 7,
        delay: Math.random() * 5,
        opacity: 0.3 + Math.random() * 0.3,
        tone: index % 3 === 0 ? 'var(--pulse-500)' : 'var(--neural-500)'
      })),
    []
  );

  const links = particles.slice(0, 8).map((particle, index) => ({
    id: `${particle.id}-${index}`,
    left: particle.left,
    top: particle.top,
    angle: Math.round(Math.random() * 360),
    length: 60 + Math.round(Math.random() * 120),
    opacity: 0.08 + Math.random() * 0.16
  }));

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {links.map((link) => (
        <span
          key={link.id}
          className="absolute rounded-full"
          style={{
            left: `${link.left}%`,
            top: `${link.top}%`,
            width: `${link.length}px`,
            height: '1px',
            transform: `rotate(${link.angle}deg)`,
            transformOrigin: 'left center',
            opacity: link.opacity,
            background: 'linear-gradient(90deg, transparent, var(--neural-500), transparent)',
            filter: 'drop-shadow(0 0 4px rgba(0, 170, 255, 0.18))'
          }}
        />
      ))}
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="absolute rounded-full blur-[1px]"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            opacity: particle.opacity,
            background: particle.tone,
            boxShadow: `0 0 10px ${particle.tone}`,
            animation: `floatY ${particle.duration}s linear ${particle.delay}s infinite alternate`
          }}
        />
      ))}
      <style>
        {`@keyframes floatY { from { transform: translateY(0); } to { transform: translateY(-18px); } }`}
      </style>
    </div>
  );
}

export default ParticleField;
