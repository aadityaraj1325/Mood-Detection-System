function PrimaryButton({ className = '', children, ...props }) {
  return (
    <button type="button" className={`btn-primary ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}

function GhostButton({ className = '', children, ...props }) {
  return (
    <button type="button" className={`btn-ghost ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}

function DangerButton({ className = '', children, ...props }) {
  return (
    <button type="button" className={`btn-danger ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}

function IconButton({ className = '', children, ...props }) {
  return (
    <button type="button" className={`btn-icon ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}

export { PrimaryButton, GhostButton, DangerButton, IconButton };
