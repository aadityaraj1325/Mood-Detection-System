function TextInput({ className = '', ...props }) {
  return <input className={`input ${className}`.trim()} {...props} />;
}

function SelectInput({ className = '', children, ...props }) {
  return (
    <select className={`select ${className}`.trim()} {...props}>
      {children}
    </select>
  );
}

function RangeSlider({ className = '', ...props }) {
  return <input type="range" className={`slider ${className}`.trim()} {...props} />;
}

function TextArea({ className = '', ...props }) {
  return <textarea className={`textarea ${className}`.trim()} {...props} />;
}

export { TextInput, SelectInput, RangeSlider, TextArea };
