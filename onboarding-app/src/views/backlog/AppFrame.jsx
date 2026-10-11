/* The real CaseActive chrome, rendered static.
 *
 * The earlier version of this page drew look-alike shells with their own
 * spacing, type scale and borders. A design reviewed in a look-alike reviews
 * well and then does not fit: the real panel radius is 14px not 9px, the real
 * table row is 13.5px on 14px padding not 12.5px on 9px, the real sidebar is
 * 300px not 160px. So these frames use the app's own markup and the app's own
 * stylesheets, and the body of each screen mounts the app's real view
 * component wherever one exists.
 *
 * Nothing here styles anything. AppFrame.css only bounds the height, because
 * .portal-shell and .lobby-shell are written for a 100vh page and this page
 * shows them inside a review column.
 */

import { NAV } from '../../adminNav';
import { CASE_NAV } from '../caseNav';
import { UNREAD_NOTIFICATION_COUNT } from '../../components/NotificationsPopover';
import '../../PortalDashboard.css';
import '../../styles/client-dashboard.css';
import './AppFrame.css';

const HUB = 'Sterling & Brooks Injury Law';

const Chevron = ({ size = 12 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
);

const initialsOf = (name) => name.split(' ').map(w => w[0]).join('').slice(0, 2);

/* The topbar, identical in both modes apart from which pill is active. */
const Topbar = ({ mode, who, role }) => (
    <div className="portal-topbar">
        <div className="portal-topbar-left">
            <button type="button" className="portal-hamburger" aria-label="Toggle navigation">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <div className="portal-logo">
                <img src="/assets/images/logo.svg" alt="CaseActive" className="portal-logo-full" style={{ height: 28, width: 'auto' }} />
                <img src="/assets/images/logo-sm.svg" alt="CaseActive" className="portal-logo-sm" style={{ height: 28, width: 'auto', display: 'none' }} />
            </div>
        </div>
        <div className="portal-topbar-right">
            <div className="portal-hub-wrap">
                <button type="button" className="portal-hub-btn">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    <span className="portal-hub-label">{HUB}</span>
                    <Chevron />
                </button>
            </div>
            <div className="portal-mode-toggle">
                <button type="button" className={`portal-mode-btn${mode === 'admin' ? ' active' : ''}`}>Admin</button>
                <button type="button" className={`portal-mode-btn${mode === 'lobby' ? ' active' : ''}`}>Lobby</button>
            </div>
            <div className="portal-notif-wrap">
                <button type="button" className="portal-notif-btn" aria-label="Notifications">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                    <span className="portal-notif-badge">{UNREAD_NOTIFICATION_COUNT}</span>
                </button>
            </div>
            <div className="portal-profile-wrap">
                <div className="portal-topbar-profile">
                    <div className="portal-avatar">{initialsOf(who)}</div>
                    <div className="portal-topbar-profile-info">
                        <div className="portal-user-name">{who}</div>
                        <div className="portal-user-role">{role}</div>
                    </div>
                    <span style={{ color: '#94A3B8', marginLeft: 2, flexShrink: 0, display: 'inline-flex' }}><Chevron /></span>
                </div>
            </div>
        </div>
    </div>
);

const NewBtn = ({ label = 'NEW' }) => (
    <button type="button" className="hubs-new-btn">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        {label}
    </button>
);

/* ── Admin Panel (ca-manage) ─────────────────────────────────────────── */
export const AdminFrame = ({
    nav = 'Settings', sub, title, breadcrumb,
    who = 'Robert Grant', role = 'Administrator',
    actions, newBtn, height, bodyClass = '', modal, overlay, children,
}) => (
    <div className="af" style={height ? { '--af-h': `${height}px` } : undefined}>
        <div className="portal-shell">
            <Topbar mode="admin" who={who} role={role} />
            <div className="portal-body">
                <aside className="portal-sidebar">
                    <nav className="portal-nav">
                        {NAV.map((item, i) => item.divider ? (
                            <div key={`d-${i}`} className="portal-nav-divider" />
                        ) : (
                            <div key={item.label}>
                                <button
                                    type="button"
                                    className={`portal-nav-item${nav === item.label ? ' active' : ''}${item.sub ? ' has-sub' : ''}`}
                                >
                                    <span className="portal-nav-icon">{item.icon}</span>
                                    <span className="portal-nav-label">{item.label}</span>
                                    {item.sub && (
                                        <svg className={`portal-nav-chevron${nav === item.label ? ' open' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                                    )}
                                </button>
                                {item.sub && nav === item.label && (
                                    <div className="portal-subnav">
                                        {item.sub.map(s => (
                                            <button
                                                key={s}
                                                type="button"
                                                className={`portal-subnav-item${sub === s ? ' active' : ''}`}
                                            >
                                                {s}
                                                {s === 'Billing & Subscription' && <span className="portal-subnav-trial-badge">Trial</span>}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>
                </aside>
                <main className="portal-main">
                    <div className="portal-content-title">
                        <div>
                            <h1 className="portal-page-title">{title || sub || nav}</h1>
                            <p className="portal-breadcrumb">{breadcrumb || (sub ? `${nav} · ${sub}` : nav)}</p>
                        </div>
                        {actions}
                        {newBtn && <NewBtn label={typeof newBtn === 'string' ? newBtn : 'NEW'} />}
                    </div>
                    <div className={`portal-main-body ${bodyClass}`}>{children}</div>
                </main>
            </div>
        </div>
        {modal}
        {overlay}
    </div>
);

/* ── Lobby, inside one case (ca-app) ─────────────────────────────────── */
export const CaseFrame = ({
    caseTitle = 'Rear-End Collision — Downtown LA',
    nav = 'Feed', title, stage,
    who = 'Alexandra Reyes', role = 'Client',
    actions, newBtn, aside, height, modal, overlay, children,
}) => (
    <div className="af" style={height ? { '--af-h': `${height}px` } : undefined}>
        <div className="lobby-shell">
            <Topbar mode="lobby" who={who} role={role} />
            <div className="case-view-layout">
                <aside className="case-sidebar">
                    <div className="case-sidebar-back">
                        <button type="button" className="case-back-btn">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                            Back to Cases
                        </button>
                        <div className="case-switcher-wrap">
                            <button type="button" className="case-switcher-btn">
                                <span className="case-switcher-name">{caseTitle}</span>
                                <Chevron />
                            </button>
                        </div>
                    </div>
                    <p className="case-sidebar-label">Case Categories</p>
                    {CASE_NAV.map(item => (
                        <button key={item.label} type="button" className={`case-nav-item${nav === item.label ? ' active' : ''}`}>
                            <span className="case-nav-icon">{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </aside>
                <main className="case-main">
                    <div className="case-content-title">
                        <div className="case-title-block">
                            <h2 className="portal-page-title">{title || nav}</h2>
                            <div className="case-title-meta">
                                <p className="portal-breadcrumb">{caseTitle} · {nav}</p>
                                {stage}
                            </div>
                        </div>
                        {actions}
                        {newBtn && <NewBtn label={typeof newBtn === 'string' ? newBtn : 'NEW'} />}
                    </div>
                    <div className="case-content-body">{children}</div>
                </main>
                {aside}
            </div>
        </div>
        {modal}
        {overlay}
    </div>
);

/* Some views are the whole page: LobbyView renders its own shell and topbar.
   They need the bounding box and nothing else. */
export const BareFrame = ({ height, modal, overlay, children }) => (
    <div className="af" style={height ? { '--af-h': `${height}px` } : undefined}>
        {children}
        {modal}
        {overlay}
    </div>
);
