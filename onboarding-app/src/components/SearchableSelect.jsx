import { Children, isValidElement, useEffect, useMemo, useRef, useState } from 'react';
import './SearchableSelect.css';

const normalizeOptions = (children) => Children.toArray(children)
    .filter(isValidElement)
    .map(child => {
        const label = child.props.children === undefined || child.props.children === null
            ? ''
            : String(child.props.children);
        const value = child.props.value === undefined ? label : String(child.props.value);
        return { value, label, disabled: Boolean(child.props.disabled) };
    });

const SearchableSelect = ({
    children,
    className = '',
    value,
    defaultValue,
    onChange,
    placeholder = 'Select...',
    disabled = false,
    id,
    name,
    'aria-label': ariaLabel,
}) => {
    const options = useMemo(() => normalizeOptions(children), [children]);
    const initialValue = value !== undefined ? String(value) : defaultValue !== undefined ? String(defaultValue) : options[0]?.value ?? '';
    const [internalValue, setInternalValue] = useState(initialValue);
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const wrapRef = useRef(null);
    const searchRef = useRef(null);
    const currentValue = value !== undefined ? String(value) : internalValue;
    const selected = options.find(option => option.value === currentValue);
    const filtered = options.filter(option => option.label.toLowerCase().includes(query.trim().toLowerCase()));

    useEffect(() => {
        if (!open) return undefined;
        const onPointerDown = event => {
            if (!wrapRef.current?.contains(event.target)) {
                setOpen(false);
                setQuery('');
            }
        };
        document.addEventListener('pointerdown', onPointerDown);
        return () => document.removeEventListener('pointerdown', onPointerDown);
    }, [open]);

    useEffect(() => {
        if (open) {
            setTimeout(() => searchRef.current?.focus(), 0);
        }
    }, [open]);

    const commit = (option) => {
        if (option.disabled) return;
        if (value === undefined) setInternalValue(option.value);
        onChange?.({ target: { value: option.value, name, id } });
        setOpen(false);
        setQuery('');
    };

    return (
        <div className={`searchable-select${open ? ' open' : ''}${disabled ? ' disabled' : ''}`} ref={wrapRef}>
            <button
                type="button"
                id={id}
                name={name}
                className={`searchable-select-trigger ${className}`.trim()}
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label={ariaLabel}
                onClick={() => setOpen(prev => !prev)}
            >
                <span className={!selected?.label ? 'searchable-select-placeholder' : ''}>
                    {selected?.label || placeholder}
                </span>
                <svg className="searchable-select-caret" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>
            {open && (
                <div className="searchable-select-menu">
                    <input
                        ref={searchRef}
                        className="searchable-select-search"
                        value={query}
                        onChange={event => setQuery(event.target.value)}
                        onKeyDown={event => {
                            if (event.key === 'Escape') {
                                setOpen(false);
                                setQuery('');
                            }
                        }}
                        aria-label="Search options"
                    />
                    <div className="searchable-select-list" role="listbox">
                        {filtered.length > 0 ? filtered.map(option => (
                            <button
                                type="button"
                                key={`${option.value}-${option.label}`}
                                className={`searchable-select-option${option.value === currentValue ? ' selected' : ''}`}
                                disabled={option.disabled}
                                role="option"
                                aria-selected={option.value === currentValue}
                                onClick={() => commit(option)}
                            >
                                {option.label || '--'}
                            </button>
                        )) : (
                            <div className="searchable-select-empty">No options found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchableSelect;
