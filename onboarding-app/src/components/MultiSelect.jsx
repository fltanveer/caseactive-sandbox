import { useState, useEffect, useRef } from 'react';

export const PERMISSION_OPTIONS = ['All', 'Bots', 'Clients'];

export const MultiSelect = ({ options, value, onChange, placeholder = 'Select...', allValue = null }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const toggle = (opt) => {
        if (allValue && opt === allValue) {
            onChange(value.includes(allValue) ? [] : [...options]);
        } else {
            const next = value.includes(opt) ? value.filter(v => v !== opt) : [...value, opt];
            const others = options.filter(o => o !== allValue);
            const allOthersSelected = others.every(o => next.includes(o));
            if (allValue) {
                onChange(allOthersSelected ? [...new Set([...next, allValue])] : next.filter(v => v !== allValue));
            } else {
                onChange(next);
            }
        }
    };

    return (
        <div className="ms-wrap" ref={ref}>
            <button type="button" className="ms-trigger" onClick={() => setOpen(o => !o)}>
                <span className={value.length === 0 ? 'ms-placeholder' : 'ms-value'}>
                    {value.length === 0 ? placeholder : value.join(', ')}
                </span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', flexShrink: 0 }}>
                    <polyline points="6 9 12 15 18 9"/>
                </svg>
            </button>
            {open && (
                <div className="ms-dropdown">
                    {options.map(opt => (
                        <label key={opt} className="ms-option">
                            <input type="checkbox" checked={value.includes(opt)} onChange={() => toggle(opt)} />
                            {opt}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MultiSelect;
