/* Replicas of the three shells a CaseActive screen lives in, so a ticket's
   design can be shown as the whole page rather than a floating panel. A state
   reviewed out of context reviews well and then does not fit. */

import './Shell.css';

const I = {
    home:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    cases:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
    users:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
    payments: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
    library:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
    integ:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
    settings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    bell:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
};

const ADMIN_NAV = [
    { label: 'Home', icon: I.home },
    { label: 'Cases', icon: I.cases },
    { label: 'Users', icon: I.users },
    { label: 'Payments', icon: I.payments },
    { label: 'Library', icon: I.library },
    { label: 'Integration', icon: I.integ },
    { label: 'Settings', icon: I.settings },
];

const CASE_NAV = ['Feed', 'Events', 'Forms', 'E-signs', 'Invoices', 'Notes', 'Tasks', 'Convo', 'Overview'];

/* A numbered marker tying a spot on the screen to its row in the change list. */
export const Pin = ({ n, label, place = 'tr' }) => (
    <span className={`sh-pin sh-pin-${place}`} title={label}>{n}</span>
);

/* Wrap anything to put a pin on it and ring what changed. */
export const Change = ({ n, label, place, children, ring = true, block = false }) => (
    <span className={`sh-change${ring ? ' is-ringed' : ''}${block ? ' is-block' : ''}`}>
        <Pin n={n} label={label} place={place} />
        {children}
    </span>
);

/* ── Admin / manage shell ───────────────────────────────────────────── */
export const AdminShell = ({ nav = 'Settings', sub, title, breadcrumb, actions, who = 'Robert Grant', role = 'Administrator', children }) => (
    <div className="sh sh-admin">
        <header className="sh-topbar">
            <span className="sh-logo">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="14" height="12" rx="2"/><path d="M16 10h4a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-8"/></svg>
                CaseActive
            </span>
            <span className="sh-hub">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                Sterling &amp; Brooks Injury Law
            </span>
            <span className="sh-modes"><span className="sh-mode is-active">Admin</span><span className="sh-mode">Lobby</span></span>
            <span className="sh-bell">{I.bell}<span className="sh-bell-dot">4</span></span>
            <span className="sh-me">
                <span className="sh-avatar">{who.split(' ').map(w => w[0]).join('')}</span>
                <span className="sh-me-text"><strong>{who}</strong><em>{role}</em></span>
            </span>
        </header>
        <div className="sh-main">
            <aside className="sh-side">
                {ADMIN_NAV.map(n => (
                    <div key={n.label}>
                        <span className={`sh-nav${nav === n.label ? ' is-active' : ''}`}>
                            <span className="sh-nav-icon">{n.icon}</span>{n.label}
                        </span>
                        {nav === n.label && sub && (
                            <span className="sh-subnav">
                                {sub.map(s => (
                                    <span key={s.label} className={`sh-sub${s.active ? ' is-active' : ''}`}>{s.label}</span>
                                ))}
                            </span>
                        )}
                    </div>
                ))}
            </aside>
            <div className="sh-content">
                <div className="sh-pagehead">
                    <div>
                        <h3 className="sh-pagetitle">{title}</h3>
                        {breadcrumb && <p className="sh-crumb">{breadcrumb}</p>}
                    </div>
                    {actions}
                </div>
                <div className="sh-pagebody">{children}</div>
            </div>
        </div>
    </div>
);

/* ── Lobby / client portal shell ────────────────────────────────────── */
export const LobbyShell = ({ caseTitle, nav = 'Feed', title, breadcrumb, who = 'Alexandra Reyes', role = 'Client', aside, children }) => (
    <div className="sh sh-lobby">
        <header className="sh-topbar">
            <span className="sh-logo">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="14" height="12" rx="2"/><path d="M16 10h4a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-8"/></svg>
                CaseActive
            </span>
            <span className="sh-hub">Sterling &amp; Brooks Injury Law</span>
            <span className="sh-modes"><span className="sh-mode">Admin</span><span className="sh-mode is-active">Lobby</span></span>
            <span className="sh-bell">{I.bell}</span>
            <span className="sh-me">
                <span className="sh-avatar">{who.split(' ').map(w => w[0]).join('')}</span>
                <span className="sh-me-text"><strong>{who}</strong><em>{role}</em></span>
            </span>
        </header>
        <div className="sh-main">
            {caseTitle && (
                <aside className="sh-side sh-side-case">
                    <span className="sh-back">‹ Cases</span>
                    <span className="sh-casepick">{caseTitle}</span>
                    <span className="sh-side-label">Case categories</span>
                    {CASE_NAV.map(n => (
                        <span key={n} className={`sh-nav${nav === n ? ' is-active' : ''}`}>{n}</span>
                    ))}
                </aside>
            )}
            <div className="sh-content">
                {title && (
                    <div className="sh-pagehead">
                        <div>
                            <h3 className="sh-pagetitle">{title}</h3>
                            {breadcrumb && <p className="sh-crumb">{breadcrumb}</p>}
                        </div>
                    </div>
                )}
                <div className="sh-pagebody">{children}</div>
            </div>
            {aside && <aside className="sh-rail">{aside}</aside>}
        </div>
    </div>
);

/* ── Account site shell (ca-account): hubs and profile only ─────────── */
export const AccountShell = ({ nav = 'Hubs', narrow = false, children, headerPin }) => (
    <div className={`sh sh-account${narrow ? ' is-narrow' : ''}`}>
        <header className="sh-acct-top">
            <span className="sh-logo">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="14" height="12" rx="2"/><path d="M16 10h4a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-8"/></svg>
                {!narrow && 'CaseActive'}
            </span>
            <nav className="sh-acct-nav">
                {headerPin}
                <span className={`sh-acct-link${nav === 'Hubs' ? ' is-active' : ''}`}>Hubs</span>
                <span className={`sh-acct-link${nav === 'Profile' ? ' is-active' : ''}`}>Profile</span>
                <span className="sh-acct-link sh-acct-slot">HF-71<span className="sh-slot-tag">slot</span></span>
            </nav>
            <span className="sh-avatar">RG</span>
        </header>
        <div className="sh-acct-body">{children}</div>
    </div>
);

/* ── Shared page furniture ──────────────────────────────────────────── */
export const Panel = ({ label, sub, actions, children, flush = false }) => (
    <div className={`sh-panel${flush ? ' is-flush' : ''}`}>
        {(label || actions) && (
            <div className="sh-panel-head">
                <div>
                    {label && <div className="sh-panel-label">{label}</div>}
                    {sub && <p className="sh-panel-sub">{sub}</p>}
                </div>
                {actions}
            </div>
        )}
        {children}
    </div>
);

export const Table = ({ cols, rows, align = {} }) => (
    <table className="sh-table">
        <thead>
            <tr>{cols.map(c => <th key={c} style={align[c] ? { textAlign: align[c] } : undefined}>{c}</th>)}</tr>
        </thead>
        <tbody>
            {rows.map((r, i) => (
                <tr key={i}>{cols.map(c => <td key={c} style={align[c] ? { textAlign: align[c] } : undefined}>{r[c]}</td>)}</tr>
            ))}
        </tbody>
    </table>
);

export const Modal = ({ title, crumb, children, footer, width = 520 }) => (
    <div className="sh-modal-scrim">
        <div className="sh-modal" style={{ maxWidth: width }}>
            <div className="sh-modal-head">
                <div>
                    {crumb && <p className="sh-modal-crumb">{crumb}</p>}
                    <h4 className="sh-modal-title">{title}</h4>
                </div>
                <span className="sh-modal-x">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </span>
            </div>
            <div className="sh-modal-body">{children}</div>
            {footer && <div className="sh-modal-foot">{footer}</div>}
        </div>
    </div>
);

export const Btn = ({ children, kind = 'ghost', ...rest }) => (
    <button type="button" className={`sh-btn sh-btn-${kind}`} {...rest}>{children}</button>
);

export const Field = ({ label, hint, children }) => (
    <div className="sh-field">
        {label && <span className="sh-field-label">{label}</span>}
        {children}
        {hint && <span className="sh-field-hint">{hint}</span>}
    </div>
);

export const Input = ({ value, placeholder, as = 'input' }) => (
    as === 'static'
        ? <div className="sh-input is-static">{value}</div>
        : <input className="sh-input" defaultValue={value} placeholder={placeholder} readOnly />
);

export const Toggle = ({ on }) => <span className={`sh-toggle${on ? ' on' : ''}`}><span /></span>;

export const Row = ({ name, hint, control }) => (
    <div className="sh-row">
        <div className="sh-row-main">
            <span className="sh-row-name">{name}</span>
            {hint && <span className="sh-row-hint">{hint}</span>}
        </div>
        {control}
    </div>
);

export const Code = ({ children }) => <code className="sh-code">{children}</code>;

export const Phone = ({ children }) => (
    <div className="sh-phone"><div className="sh-phone-screen">{children}</div></div>
);
