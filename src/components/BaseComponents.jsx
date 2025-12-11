import React from 'react';
import './Button.css';

export function Button({ children, onClick, variant = 'primary', className = '', ...props }) {
    return (
        <button
            className={`btn btn-${variant} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
}

export function Input({ label, error, className = '', containerClassName = '', ...props }) {
    return (
        <div className={`input-group ${containerClassName}`}>
            {label && <label className="input-label">{label}</label>}
            <input
                className={`input-field ${error ? 'input-error' : ''} ${className}`}
                {...props}
            />
            {error && <span className="input-error-msg">{error}</span>}
        </div>
    );
}
