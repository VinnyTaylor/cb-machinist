import './PillToggle.css';

interface PillToggleProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  size?: 'small' | 'normal';
  fullWidth?: boolean;
}

export function PillToggle<T extends string>({
  options,
  value,
  onChange,
  size = 'normal',
  fullWidth = false
}: PillToggleProps<T>) {
  return (
    <div className={`pill-toggle pill-${size} ${fullWidth ? 'pill-full' : ''}`}>
      {options.map((option) => (
        <button
          key={option.value}
          className={`pill-option ${value === option.value ? 'active' : ''}`}
          onClick={() => onChange(option.value)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
