function SkeletonLoader({
  className = '',
  lines = 1,
  variant = 'line',
  height,
  rounded = '8px'
}) {
  const lineHeight = height || (variant === 'card' ? '140px' : '16px');

  if (variant === 'card') {
    return <div className={`skeleton ${className}`.trim()} style={{ height: lineHeight, borderRadius: rounded }} />;
  }

  return (
    <div className={`space-y-2 ${className}`.trim()}>
      {Array.from({ length: Math.max(1, lines) }).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="skeleton"
          style={{
            height: lineHeight,
            width: `${Math.max(55, 100 - index * 8)}%`,
            borderRadius: rounded
          }}
        />
      ))}
    </div>
  );
}

export default SkeletonLoader;
