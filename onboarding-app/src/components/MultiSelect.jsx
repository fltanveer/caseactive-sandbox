import { useState, useEffect, useRef } from 'react';

export const PERMISSION_OPTIONS = ['All', 'Bots', 'Clients'];

const getScrollParent = (element) => {
    let current = element?.parentElement;

    while (current) {
        const { overflowY } = window.getComputedStyle(current);
        if (overflowY === 'auto' || overflowY === 'scroll') {
            return current;
        }
        current = current.parentElement;
    }

    return window;
};

export const MultiSelect = ({ options, value, onChange, placeholder = 'Select...', allValue = null }) => {
    const [open, setOpen] = useState(false);
    const [dropUp, setDropUp] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => {
        if (!open || !ref.current) return;

        const scrollParent = getScrollParent(ref.current);
        const updatePosition = () => {
            const rect = ref.current.getBoundingClientRect();
            const estimatedMenuHeight = Math.min(options.length * 40 + 12, 260);
            const bounds = scrollParent === window
                ? { top: 0, bottom: window.innerHeight }
                : scrollParent.getBoundingClientRect();
            const spaceBelow = bounds.bottom - rect.bottom;
            const spaceAbove = rect.top - bounds.top;
            setDropUp(spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow);
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
        scrollParent.addEventListener('scroll', updatePosition, { passive: true });

        return () => {
            window.removeEventListener('resize', updatePosition);
            scrollParent.removeEventListener('scroll', updatePosition);
        };
    }, [open, options.length]);

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
                    {value.length === 0 ? placeholder : value.length === 1 ? value[0] : `${value.length} selected`}
                </span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', flexShrink: 0 }}>
                    <polyline points="6 9 12 15 18 9"/>
                </svg>
            </button>
            {open && (
                <div className={`ms-dropdown${dropUp ? ' drop-up' : ''}`}>
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
