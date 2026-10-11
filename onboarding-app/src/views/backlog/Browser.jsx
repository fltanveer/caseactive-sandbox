import { useEffect, useMemo, useRef, useState } from 'react';
import { TICKETS } from './tickets';
import { SPECS } from './specs';
import { ROLE_LABEL, ROLE_NOTE } from './roles';
import { PatchContext } from './patchContext';
import './Browser.css';

/* The ticket browser, built for a dev reading it rather than a designer
   presenting it.

   Left rail is the spec, right side is the screen. Clicking a numbered pin on
   the screen selects that change and the rail becomes its build notes: why it
   is this way, what it is made of, every state, exact values, exact copy, the
   rules, and the line that says when it is done. A screenshot answers what it
   looks like; this answers everything asked afterwards. */

const ALL_ROLES = ['admin', 'manager', 'staff', 'client'];

const Section = ({ title, children }) => (
    <section className="sp-section">
        <h4 className="sp-h">{title}</h4>
        {children}
    </section>
);

/* ── The spec rail ──────────────────────────────────────────────────── */
const ItemSpec = ({ item, spec, onBack }) => (
    <div className="sp">
        <button className="sp-back" onClick={onBack}>‹ All changes on this ticket</button>

        <div className="sp-top">
            <span className="sp-no">{item.id}</span>
            <h3 className="sp-title">{item.what}</h3>
        </div>

        <div className="sp-meta">
            <span><em>Where</em>{item.where}</span>
            <span><em>File</em><code>{item.file}</code></span>
            {spec?.component && <span><em>Component</em><code>{spec.component}</code></span>}
            <span><em>Seen by</em>{item.roles.map(r => ROLE_LABEL[r]).join(', ')}</span>
        </div>

        {item.bug && <p className="sp-flagline sp-bug">This is a live bug, not a new feature. The current behaviour is described on the ticket.</p>}
        {item.missing && <p className="sp-flagline sp-missing">This screen does not exist in this codebase. Designed from the ticket text alone.</p>}

        {!spec && <p className="sp-nospec">No build notes written for this item yet.</p>}

        {spec?.today && <Section title="What is there today"><p className="sp-today">{spec.today}</p></Section>}

        {spec?.why && <Section title="Why it is this way"><p className="sp-why">{spec.why}</p></Section>}

        {spec?.anatomy && (
            <Section title="Anatomy">
                <ol className="sp-anatomy">{spec.anatomy.map((a, i) => <li key={i}>{a}</li>)}</ol>
            </Section>
        )}

        {spec?.states && (
            <Section title="States to build">
                <ul className="sp-states">
                    {spec.states.map(([name, desc], i) => (
                        <li key={i}><strong>{name}</strong>{desc && <span>{desc}</span>}</li>
                    ))}
                </ul>
            </Section>
        )}

        {spec?.tokens && (
            <Section title="Values">
                <table className="sp-tokens">
                    <tbody>{spec.tokens.map(([k, v], i) => <tr key={i}><td>{k}</td><td><code>{v}</code></td></tr>)}</tbody>
                </table>
            </Section>
        )}

        {spec?.copy?.length > 0 && (
            <Section title="Copy, verbatim">
                <ul className="sp-copy">{spec.copy.map((c, i) => <li key={i}>{c}</li>)}</ul>
            </Section>
        )}

        {spec?.rules && (
            <Section title="Rules">
                <ul className="sp-rules">{spec.rules.map((r, i) => <li key={i}>{r}</li>)}</ul>
            </Section>
        )}

        {spec?.data && <Section title="Data dev must wire"><p className="sp-data">{spec.data}</p></Section>}
        {spec?.note && <Section title="Open question"><p className="sp-data">{spec.note}</p></Section>}

        {spec?.done && (
            <div className="sp-done"><em>Done when</em>{spec.done}</div>
        )}
    </div>
);

const TicketSpec = ({ ticket, role, onPick }) => {
    const mine = ticket.items.filter(i => i.roles.includes(role));
    const other = ticket.items.filter(i => !i.roles.includes(role));
    return (
        <div className="sp">
            <div className="sp-top">
                <span className="sp-key">{ticket.key}</span>
                <h3 className="sp-title">{ticket.ticketName}</h3>
            </div>

            <div className="sp-chips">
                <span className={`sp-chip sp-chip-${ticket.status.replace(/\s/g, '').toLowerCase()}`}>{ticket.status}</span>
                <span className="sp-chip">{ticket.severity}</span>
                {ticket.domain.split(',').map(d => <span key={d} className="sp-chip sp-chip-dom">{d.trim()}</span>)}
                <a className="sp-chip sp-chip-link" href={ticket.link} target="_blank" rel="noreferrer">Open in Slack ↗</a>
            </div>

            <Section title="Design asked for">
                <ol className="sp-brief">{ticket.brief.map((b, i) => <li key={i}>{b}</li>)}</ol>
            </Section>

            {ticket.alsoKnown && (
                <Section title="Also on the ticket"><p className="sp-also">{ticket.alsoKnown}</p></Section>
            )}

            {ticket.decision && (
                <Section title="Recommended"><p className="sp-decision">{ticket.decision}</p></Section>
            )}
            {ticket.capability && (
                <Section title="Not a tier"><p className="sp-capability">{ticket.capability}</p></Section>
            )}

            <Section title={`Changes · ${mine.length} for a ${ROLE_LABEL[role]}`}>
                <ul className="sp-items">
                    {mine.map(i => (
                        <li key={i.id}>
                            <button className="sp-item" onClick={() => onPick(i.id)}>
                                <span className="sp-item-no">{i.id}</span>
                                <span className="sp-item-what">{i.what}</span>
                                {i.bug && <span className="sp-tag sp-tag-bug">bug</span>}
                                {i.missing && <span className="sp-tag">no screen</span>}
                            </button>
                        </li>
                    ))}
                    {other.map(i => (
                        <li key={i.id} className="is-na">
                            <span className="sp-item sp-item-na">
                                <span className="sp-item-no">{i.id}</span>
                                <span className="sp-item-what">{i.what}</span>
                                <span className="sp-tag">{i.roles.map(r => ROLE_LABEL[r]).join(', ')}</span>
                            </span>
                        </li>
                    ))}
                </ul>
            </Section>
        </div>
    );
};

/* ── Page ───────────────────────────────────────────────────────────── */
const Browser = () => {
    const [q, setQ] = useState('');
    const [openNo, setOpenNo] = useState(1);
    const [role, setRole] = useState('admin');
    const [screenId, setScreenId] = useState(null);
    const [picked, setPicked] = useState(null);
    /* The screens carry the proposed design applied in place. Before takes
       every patch back out, so the two are one toggle apart rather than one
       scroll apart. */
    const [patched, setPatched] = useState(true);
    const canvasRef = useRef(null);

    const ticket = TICKETS.find(t => t.no === openNo) || TICKETS[0];
    const roles = ticket.roles;
    const activeRole = roles.includes(role) ? role : roles[0];
    const screens = ticket.screens.filter(s => s.roles.includes(activeRole));
    const screen = screens.find(s => s.id === screenId) || screens[0];

    const matches = useMemo(() => {
        const needle = q.trim().toLowerCase();
        if (!needle) return TICKETS;
        return TICKETS.filter(t => [
            t.key, t.ticketName, t.title, t.domain, ...t.brief,
            ...t.items.map(i => `${i.id} ${i.what} ${i.where} ${i.file}`),
            ...t.screens.map(s => s.label),
        ].join(' ').toLowerCase().includes(needle));
    }, [q]);

    /* Pins are rendered by the screens, which know nothing about selection,
       so the wiring happens here: label every pin with its item and let a
       click anywhere in the canvas select it. */
    useEffect(() => {
        const root = canvasRef.current;
        if (!root) return undefined;
        const pins = [...root.querySelectorAll('.sh-pin')];
        pins.forEach(pin => {
            pin.classList.add('is-clickable');
            pin.classList.toggle('is-picked', pin.textContent.trim() === picked);
        });
        const onClick = (e) => {
            const pin = e.target.closest('.sh-pin');
            if (!pin) return;
            const id = pin.textContent.trim();
            setPicked(prev => (prev === id ? null : id));
        };
        root.addEventListener('click', onClick);
        return () => root.removeEventListener('click', onClick);
    }, [picked, screen, activeRole, openNo, patched]);

    const openTicket = (no) => {
        const t = TICKETS.find(x => x.no === no);
        setOpenNo(no);
        setScreenId(null);
        setPicked(null);
        setPatched(true);
        if (!t.roles.includes(role)) setRole(t.roles[0]);
    };

    const pickedItem = picked ? ticket.items.find(i => i.id === picked) : null;

    return (
        <div className="tb">
            {/* ── Top: search + dropdown ── */}
            <div className="tb-top">
                <div className="tb-pick">
                    <label className="tb-pick-label" htmlFor="tb-ticket">Ticket</label>
                    <select
                        id="tb-ticket"
                        className="tb-select"
                        value={openNo}
                        onChange={e => openTicket(Number(e.target.value))}
                    >
                        {matches.map(t => (
                            <option key={t.no} value={t.no}>{t.key} — {t.ticketName}</option>
                        ))}
                    </select>
                    <div className="tb-search">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        <input
                            className="tb-search-input"
                            placeholder="Filter by HF number, screen, file path or wording"
                            value={q}
                            onChange={e => setQ(e.target.value)}
                        />
                        {q && <button className="tb-search-clear" onClick={() => setQ('')}>Clear</button>}
                    </div>
                    <span className="tb-pick-count">{matches.length} of {TICKETS.length}</span>
                </div>
            </div>

            {/* ── Two columns: spec left, screen right ── */}
            <div className="tb-split">
                <aside className="tb-rail">
                    {pickedItem
                        ? <ItemSpec item={pickedItem} spec={SPECS[pickedItem.id]} onBack={() => setPicked(null)} />
                        : <TicketSpec ticket={ticket} role={activeRole} onPick={setPicked} />}
                </aside>

                <div className="tb-work">
                    <div className="tb-controls">
                        <div className="tb-ctl">
                            <span className="tb-ctl-label">Viewing as</span>
                            <div className="tb-roles" role="group" aria-label="Role">
                                {ALL_ROLES.filter(r => roles.includes(r)).map(r => (
                                    <button
                                        key={r}
                                        className={`tb-role${activeRole === r ? ' is-active' : ''}`}
                                        onClick={() => { setRole(r); setScreenId(null); setPicked(null); setPatched(true); }}
                                    >{ROLE_LABEL[r]}</button>
                                ))}
                                {ALL_ROLES.filter(r => !roles.includes(r)).map(r => (
                                    <span key={r} className="tb-role is-na" title="This ticket does not touch this role">{ROLE_LABEL[r]}</span>
                                ))}
                            </div>
                            <p className="tb-role-note">{ROLE_NOTE[activeRole]}</p>
                        </div>
                        <div className="tb-ctl tb-ctl-show">
                            <span className="tb-ctl-label">Showing</span>
                            <div className="tb-show" role="group" aria-label="Before or after">
                                <button
                                    className={`tb-show-btn${patched ? '' : ' is-active'}`}
                                    onClick={() => setPatched(false)}
                                >Today</button>
                                <button
                                    className={`tb-show-btn${patched ? ' is-active' : ''}`}
                                    onClick={() => setPatched(true)}
                                >Proposed</button>
                            </div>
                            <p className="tb-role-note">
                                {patched
                                    ? 'The app\'s own screen with this ticket\'s changes applied in place.'
                                    : 'The same screen exactly as it is today, with every change taken back out.'}
                            </p>
                        </div>
                        <div className="tb-ctl">
                            <span className="tb-ctl-label">Screen</span>
                            <div className="tb-screen-tabs" role="tablist">
                                {screens.map(s => (
                                    <button
                                        key={s.id}
                                        role="tab"
                                        aria-selected={s.id === screen?.id}
                                        className={`tb-screen-tab${s.id === screen?.id ? ' is-active' : ''}`}
                                        onClick={() => { setScreenId(s.id); setPicked(null); setPatched(true); }}
                                    >
                                        {s.label}
                                        {s.phone && <span className="tb-phone-tag">phone</span>}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {screen?.note && <p className="tb-screen-note">{screen.note}</p>}

                    <p className="tb-hint">
                        {picked
                            ? `Showing build notes for ${picked}. Click the pin again, or Back, to return to the ticket.`
                            : 'Click a numbered pin on the screen to open its build notes.'}
                        <span className="tb-hint-sep">·</span>
                        <span className="tb-hint-inspect">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 4l7.07 17 2.51-7.39L21 11.07z"/></svg>
                            For measurements and CSS, use the inspector in the bottom right. Esc exits it.
                        </span>
                    </p>

                    {screen ? (
                        <div
                            ref={canvasRef}
                            className={`tb-canvas${screen.phone ? ' is-phone' : ''}${picked ? ' is-focusing' : ''}${patched ? '' : ' is-today'}`}
                        >
                            <PatchContext.Provider value={patched}>
                                {screen.render(activeRole)}
                            </PatchContext.Provider>
                        </div>
                    ) : (
                        <p className="tb-nomatch">No screen on this ticket is seen by a {ROLE_LABEL[activeRole]}.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Browser;
