/* The ticket dropdown and the search used to be two controls side by side:
   type in one, then open the other to see what was left. This is one field.
   It reads as the open ticket until it is clicked, then takes a search and
   lists what matches underneath, the way the app's SearchableSelect does.

   SearchableSelect itself only matches on the label. Here a dev searches by
   file path or a word from the brief as often as by HF number, so the match
   runs over the whole ticket. */

import { useEffect, useMemo, useRef, useState } from 'react';

const haystack = (t) => [
    t.key, t.ticketName, t.title, t.domain, ...t.brief,
    ...t.items.map(i => `${i.id} ${i.what} ${i.where} ${i.file}`),
    ...t.screens.map(s => s.label),
].join(' ').toLowerCase();

const TicketPicker = ({ tickets, value, onPick }) => {
    const [open, setOpen] = useState(false);
    const [q, setQ] = useState('');
    const [hi, setHi] = useState(0);
    const wrapRef = useRef(null);
    const inputRef = useRef(null);
    const listRef = useRef(null);

    const index = useMemo(() => tickets.map(t => [t, haystack(t)]), [tickets]);
    const needle = q.trim().toLowerCase();
    const matches = needle ? index.filter(([, h]) => h.includes(needle)).map(([t]) => t) : tickets;
    const current = tickets.find(t => t.no === value);

    const close = () => { setOpen(false); setQ(''); inputRef.current?.blur(); };

    useEffect(() => {
        if (!open) return undefined;
        const onDown = (e) => { if (!wrapRef.current?.contains(e.target)) { setOpen(false); setQ(''); } };
        document.addEventListener('pointerdown', onDown);
        return () => document.removeEventListener('pointerdown', onDown);
    }, [open]);

    useEffect(() => {
        listRef.current?.querySelector('.is-hi')?.scrollIntoView({ block: 'nearest' });
    }, [hi, open]);

    const pick = (t) => { onPick(t.no); close(); };

    const onKey = (e) => {
        if (e.key === 'Escape') { close(); return; }
        if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) { setOpen(true); return; }
        if (e.key === 'ArrowDown') { e.preventDefault(); setHi(h => Math.min(h + 1, matches.length - 1)); }
        if (e.key === 'ArrowUp') { e.preventDefault(); setHi(h => Math.max(h - 1, 0)); }
        if (e.key === 'Enter' && matches[hi]) { e.preventDefault(); pick(matches[hi]); }
    };

    return (
        <div className={`tb-combo${open ? ' is-open' : ''}`} ref={wrapRef}>
            <svg className="tb-combo-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
                ref={inputRef}
                className="tb-combo-input"
                role="combobox"
                aria-expanded={open}
                aria-controls="tb-combo-list"
                aria-label="Ticket"
                value={open ? q : current ? `${current.key}  ${current.ticketName}` : ''}
                placeholder="Search HF number, screen, file or wording"
                onFocus={() => { setOpen(true); setHi(Math.max(0, tickets.indexOf(current))); }}
                onChange={(e) => { setQ(e.target.value); setHi(0); setOpen(true); }}
                onKeyDown={onKey}
            />
            <button
                type="button"
                className="tb-combo-caret"
                tabIndex={-1}
                aria-label={open ? 'Close list' : 'Open list'}
                onPointerDown={(e) => e.preventDefault()}
                onClick={() => (open ? close() : inputRef.current?.focus())}
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
            </button>

            {open && (
                <div className="tb-combo-menu">
                    <div className="tb-combo-count">{matches.length} of {tickets.length} tickets</div>
                    <div className="tb-combo-list" id="tb-combo-list" role="listbox" ref={listRef}>
                        {matches.length ? matches.map((t, i) => (
                            <button
                                type="button"
                                key={t.no}
                                role="option"
                                aria-selected={t.no === value}
                                className={`tb-combo-opt${t.no === value ? ' is-current' : ''}${i === hi ? ' is-hi' : ''}`}
                                onPointerDown={(e) => e.preventDefault()}
                                onMouseEnter={() => setHi(i)}
                                onClick={() => pick(t)}
                            >
                                <span className="tb-combo-key">{t.key}</span>
                                <span className="tb-combo-name">{t.ticketName}</span>
                            </button>
                        )) : (
                            <div className="tb-combo-empty">No ticket matches that.</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketPicker;
