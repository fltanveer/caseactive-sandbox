import { useMemo, useState } from 'react';
import { TICKETS } from './tickets';
import { ROLE_LABEL, ROLE_NOTE } from './roles';
import './Browser.css';

/* The ticket browser.

   Pick a ticket, see what changes and where, as whole screens rather than
   panels. The role switch is scoped to the roles that ticket touches, since
   offering all four on a ticket only a Manager meets invites the reader to
   infer a permission model that is not there. */

const ALL_ROLES = ['admin', 'manager', 'staff', 'client'];

const Browser = () => {
    const [q, setQ] = useState('');
    const [openNo, setOpenNo] = useState(1);
    const [role, setRole] = useState('admin');
    const [screenId, setScreenId] = useState(null);

    const matches = useMemo(() => {
        const needle = q.trim().toLowerCase();
        if (!needle) return TICKETS;
        return TICKETS.filter(t => {
            const hay = [
                `ticket ${t.no}`, t.title, ...t.brief,
                ...t.items.map(i => `${i.id} ${i.what} ${i.where} ${i.file}`),
                ...t.screens.map(s => s.label),
            ].join(' ').toLowerCase();
            return hay.includes(needle);
        });
    }, [q]);

    const ticket = TICKETS.find(t => t.no === openNo) || TICKETS[0];

    /* Keep the role and screen legal whenever the ticket changes. */
    const roles = ticket.roles;
    const activeRole = roles.includes(role) ? role : roles[0];
    const screens = ticket.screens.filter(s => s.roles.includes(activeRole));
    const screen = screens.find(s => s.id === screenId) || screens[0];

    const openTicket = (no) => {
        const t = TICKETS.find(x => x.no === no);
        setOpenNo(no);
        setScreenId(null);
        if (!t.roles.includes(role)) setRole(t.roles[0]);
    };

    const itemsForRole = ticket.items.filter(i => i.roles.includes(activeRole));
    const itemsOther = ticket.items.filter(i => !i.roles.includes(activeRole));

    return (
        <div className="tb">
            {/* ── Top: search + tickets ── */}
            <div className="tb-top">
                <div className="tb-search">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input
                        className="tb-search-input"
                        placeholder="Search tickets, items, screens or file paths"
                        value={q}
                        onChange={e => setQ(e.target.value)}
                    />
                    {q && <button className="tb-search-clear" onClick={() => setQ('')}>Clear</button>}
                </div>
                <div className="tb-tickets" role="tablist" aria-label="Tickets">
                    {matches.map(t => (
                        <button
                            key={t.no}
                            role="tab"
                            aria-selected={t.no === openNo}
                            className={`tb-ticket${t.no === openNo ? ' is-open' : ''}`}
                            onClick={() => openTicket(t.no)}
                        >
                            <span className="tb-ticket-no">{t.no}</span>
                            <span className="tb-ticket-title">{t.title}</span>
                            <span className="tb-ticket-count">{t.items.length}</span>
                        </button>
                    ))}
                    {matches.length === 0 && <p className="tb-nomatch">Nothing matches "{q}".</p>}
                </div>
            </div>

            {/* ── Ticket head: brief + role switch ── */}
            <div className="tb-head">
                <div className="tb-head-main">
                    <span className="tb-head-eyebrow">Ticket {ticket.no}</span>
                    <h2 className="tb-head-title">{ticket.title}</h2>
                    <ol className="tb-brief">
                        {ticket.brief.map((b, i) => <li key={i}>{b}</li>)}
                    </ol>
                    {ticket.alsoKnown && <p className="tb-alsoknown"><strong>Also on the ticket.</strong> {ticket.alsoKnown}</p>}
                </div>
                <div className="tb-head-side">
                    <span className="tb-roles-label">Who sees this</span>
                    <div className="tb-roles" role="group" aria-label="Role">
                        {ALL_ROLES.filter(r => roles.includes(r)).map(r => (
                            <button
                                key={r}
                                className={`tb-role${activeRole === r ? ' is-active' : ''}`}
                                onClick={() => { setRole(r); setScreenId(null); }}
                            >
                                {ROLE_LABEL[r]}
                            </button>
                        ))}
                        {ALL_ROLES.filter(r => !roles.includes(r)).map(r => (
                            <span key={r} className="tb-role is-na" title="This ticket does not touch this role">{ROLE_LABEL[r]}</span>
                        ))}
                    </div>
                    <p className="tb-role-note">{ROLE_NOTE[activeRole]}</p>
                </div>
            </div>

            {ticket.decision && (
                <p className="tb-decision"><strong>Recommended.</strong> {ticket.decision}</p>
            )}
            {ticket.capability && (
                <p className="tb-capability"><strong>Not a tier.</strong> {ticket.capability}</p>
            )}

            {/* ── What changes, and where ── */}
            <div className="tb-manifest">
                <div className="tb-manifest-head">
                    <h3>What changes, and where</h3>
                    <span className="tb-manifest-sub">
                        {itemsForRole.length} of {ticket.items.length} items apply to a {ROLE_LABEL[activeRole]}
                    </span>
                </div>
                <table className="tb-mtable">
                    <thead>
                        <tr><th>Item</th><th>What changes</th><th>Where</th><th>File</th></tr>
                    </thead>
                    <tbody>
                        {itemsForRole.map(i => (
                            <tr key={i.id}>
                                <td><span className="tb-item-no">{i.id}</span></td>
                                <td>
                                    {i.what}
                                    {i.bug && <span className="tb-flag tb-flag-bug">bug today</span>}
                                    {i.missing && <span className="tb-flag tb-flag-missing">screen not in this codebase</span>}
                                    {i.stub && <p className="tb-stub"><span className="tb-flag tb-flag-stub">stub</span> {i.stub}</p>}
                                </td>
                                <td className="tb-where">{i.where}</td>
                                <td><code className="tb-file">{i.file}</code></td>
                            </tr>
                        ))}
                        {itemsOther.map(i => (
                            <tr key={i.id} className="is-na">
                                <td><span className="tb-item-no">{i.id}</span></td>
                                <td>{i.what}</td>
                                <td className="tb-where" colSpan={2}>
                                    Not for a {ROLE_LABEL[activeRole]} · {i.roles.map(r => ROLE_LABEL[r]).join(', ')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ── The screens ── */}
            <div className="tb-screens">
                <div className="tb-screen-tabs" role="tablist" aria-label="Screens">
                    {screens.map(s => (
                        <button
                            key={s.id}
                            role="tab"
                            aria-selected={s.id === screen?.id}
                            className={`tb-screen-tab${s.id === screen?.id ? ' is-active' : ''}`}
                            onClick={() => setScreenId(s.id)}
                        >
                            {s.label}
                            {s.phone && <span className="tb-phone-tag">phone</span>}
                        </button>
                    ))}
                </div>

                {screen ? (
                    <div className="tb-stage">
                        {screen.note && <p className="tb-screen-note">{screen.note}</p>}
                        <div className={`tb-canvas${screen.phone ? ' is-phone' : ''}`}>
                            {screen.render(activeRole)}
                        </div>
                    </div>
                ) : (
                    <p className="tb-nomatch">No screen on this ticket is seen by a {ROLE_LABEL[activeRole]}.</p>
                )}
            </div>
        </div>
    );
};

export default Browser;
