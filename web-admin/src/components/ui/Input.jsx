import React, { forwardRef } from 'react';
import { Search } from 'lucide-react';
import './Input.css';

export const Input = forwardRef(function Input(
  {
    label,
    placeholder,
    type = 'text',
    value,
    onChange,
    error,
    helperText,
    icon: Icon,
    suffix,
    disabled = false,
    className = '',
    id,
    ...props
  },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`input-field ${error ? 'input-field--error' : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-field__label">
          {label}
        </label>
      )}
      <div className="input-field__control">
        {Icon && <Icon size={16} className="input-field__icon input-field__icon--left" />}
        <input
          ref={ref}
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`input-field__input ${Icon ? 'input-field__input--has-icon' : ''} ${
            suffix ? 'input-field__input--has-suffix' : ''
          }`}
          {...props}
        />
        {suffix && <div className="input-field__suffix">{suffix}</div>}
      </div>
      {error && <span className="input-field__error-msg">{error}</span>}
      {!error && helperText && <span className="input-field__helper">{helperText}</span>}
    </div>
  );
});

export const SearchInput = forwardRef(function SearchInput(
  {
    placeholder = 'Cari...',
    value,
    onChange,
    shortcut = '⌘K',
    className = '',
    onClear,
    ...props
  },
  ref
) {
  return (
    <div className={`search-input-wrap ${className}`}>
      <Search size={16} className="search-input-wrap__icon" />
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="search-input-wrap__input"
        {...props}
      />
      {shortcut && <kbd className="search-input-wrap__kbd">{shortcut}</kbd>}
    </div>
  );
});

export const Select = forwardRef(function Select(
  {
    label,
    value,
    onChange,
    options = [],
    error,
    helperText,
    disabled = false,
    className = '',
    id,
    children,
    ...props
  },
  ref
) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`input-field ${error ? 'input-field--error' : ''} ${className}`}>
      {label && (
        <label htmlFor={selectId} className="input-field__label">
          {label}
        </label>
      )}
      <div className="input-field__control">
        <select
          ref={ref}
          id={selectId}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="input-field__select"
          {...props}
        >
          {options.length > 0
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
      </div>
      {error && <span className="input-field__error-msg">{error}</span>}
      {!error && helperText && <span className="input-field__helper">{helperText}</span>}
    </div>
  );
});

export const Textarea = forwardRef(function Textarea(
  {
    label,
    placeholder,
    value,
    onChange,
    rows = 3,
    error,
    helperText,
    disabled = false,
    className = '',
    id,
    ...props
  },
  ref
) {
  const areaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`input-field ${error ? 'input-field--error' : ''} ${className}`}>
      {label && (
        <label htmlFor={areaId} className="input-field__label">
          {label}
        </label>
      )}
      <div className="input-field__control">
        <textarea
          ref={ref}
          id={areaId}
          rows={rows}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className="input-field__textarea"
          {...props}
        />
      </div>
      {error && <span className="input-field__error-msg">{error}</span>}
      {!error && helperText && <span className="input-field__helper">{helperText}</span>}
    </div>
  );
});

export default Input;
