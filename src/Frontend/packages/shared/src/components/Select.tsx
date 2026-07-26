import { SelectHTMLAttributes, forwardRef } from 'react';
import './Select.css';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      options,
      placeholder,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    const classes = [
      'select',
      hasError ? 'select-error' : '',
      fullWidth ? 'select-full-width' : '',
      className
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={`select-wrapper ${fullWidth ? 'select-wrapper-full-width' : ''}`}>
        {label && (
          <label htmlFor={selectId} className="select-label">
            {label}
          </label>
        )}
        <select ref={ref} id={selectId} className={classes} {...props}>
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <span className="select-error-text">{error}</span>}
        {helperText && !error && <span className="select-helper-text">{helperText}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;