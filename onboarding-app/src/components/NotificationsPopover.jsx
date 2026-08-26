import { useEffect, useMemo, useRef, useState } from 'react';
import './NotificationsPopover.css';

/* Each kind carries its own glyph and tint, so the list is scannable by
   shape before a word is read. */
export const KINDS = {
    invoice: {
        tint: 'green',
        icon: <><path d="M18 2H6a1 1 0 0 0-1 1v18l3-2 2 2 2-2 2 2 2-2 3 2V3a1 1 0 0 0-1-1z"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/></>,
    },
    form: {
        tint: 'teal',
        icon: <><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="m9 12 2 2 4-4"/></>,
    },
    esign: {
        tint: 'violet',
        icon: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    },
    event: {
        tint: 'amber',
        icon: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    },
    task: {
        tint: 'teal',
        icon: <><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></>,
    },
    message: {
        tint: 'slate',
        icon: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>,
    },
    update: {
        tint: 'slate',
        icon: <><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1" fill="currentColor"/></>,
    },
    alert: {
        tint: 'red',
        icon: <><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    },
};

/* minutesAgo keeps the seed readable and lets the grouping logic stay real */
export const NOTIFICATIONS = [
    { id: 'n01', kind: 'alert',   minutesAgo: 8,     unread: true,  actor: 'System',          text: 'Statute of limitations is 30 days out',      case: 'Johnson v. City Transit' },
    { id: 'n02', kind: 'invoice', minutesAgo: 45,    unread: true,  actor: 'Alexandra Reyes', text: 'paid invoice INV-1038 · $120.00',            case: 'Kim Clinic records' },
    { id: 'n03', kind: 'esign',   minutesAgo: 130,   unread: true,  actor: 'Gold Roger',      text: 'signed Retainer Agreement',                  case: 'Rear-End Collision' },
    { id: 'n04', kind: 'form',    minutesAgo: 320,   unread: true,  actor: 'Alexandra Reyes', text: 'submitted Case Intake Form',                 case: 'Johnson v. City Transit' },
    { id: 'n05', kind: 'event',   minutesAgo: 1520,  unread: false, actor: 'Jordan Admin',    text: 'moved the Deposition to Fri, 30 May 2:00 PM', case: 'Rear-End Collision' },
    { id: 'n06', kind: 'message', minutesAgo: 1655,  unread: false, actor: 'Sara Chen',       text: 'replied in Convo',                           case: 'Settlement Conference — Martinez' },
    { id: 'n07', kind: 'task',    minutesAgo: 2880,  unread: false, actor: 'Mike Torres',     text: 'completed Collect medical records',          case: 'Kim Clinic records' },
    { id: 'n08', kind: 'invoice', minutesAgo: 4320,  unread: false, actor: 'System',          text: 'Invoice INV-1044 is now overdue · $3,220.00', case: 'Expert Review' },
    { id: 'n09', kind: 'update',  minutesAgo: 5760,  unread: false, actor: 'Virtual Assistant', text: 'added a case update',                      case: 'at12fa/260602/1545' },
    { id: 'n10', kind: 'esign',   minutesAgo: 7200,  unread: false, actor: 'Ar Tanveer',      text: 'published Release Authorization to 2 signers', case: 'Johnson v. City Transit' },
    { id: 'n11', kind: 'form',    minutesAgo: 8640,  unread: false, actor: 'System',          text: 'Lost Wages Declaration is due tomorrow',     case: 'Rear-End Collision' },
    { id: 'n12', kind: 'update',  minutesAgo: 11520, unread: false, actor: 'Virtual Assistant', text: 'added a case update',                      case: 'tsa97d/260602/1545' },
    { id: 'n13', kind: 'event',   minutesAgo: 20160, unread: false, actor: 'Sara Chen',       text: 'invited you to Settlement Conference',       case: 'Martinez' },
    { id: 'n14', kind: 'task',    minutesAgo: 30240, unread: false, actor: 'Jordan Admin',    text: 'assigned you Draft demand letter',           case: 'Johnson v. City Transit' },
    { id: 'n15', kind: 'message', minutesAgo: 43200, unread: false, actor: 'Gold Roger',      text: 'sent a document through Convo',              case: 'Rear-End Collision' },
    { id: 'n16', kind: 'invoice', minutesAgo: 46080, unread: false, actor: 'Sara Chen',       text: 'voided invoice INV-1031',                    case: 'Martinez' },
    { id: 'n17', kind: 'form',    minutesAgo: 50400, unread: false, actor: 'Gold Roger',      text: 'submitted Accident Details Questionnaire',   case: 'Rear-End Collision' },
    { id: 'n18', kind: 'task',    minutesAgo: 54720, unread: false, actor: 'Mike Torres',     text: 'commented on Request police report',         case: 'Johnson v. City Transit' },
    { id: 'n19', kind: 'event',   minutesAgo: 60480, unread: false, actor: 'Jordan Admin',    text: 'scheduled Client Intake for Tue, 27 May',    case: 'Johnson v. City Transit' },
    { id: 'n20', kind: 'esign',   minutesAgo: 67200, unread: false, actor: 'Alexandra Reyes', text: 'signed HIPAA Release',                       case: 'Kim Clinic records' },
    { id: 'n21', kind: 'alert',   minutesAgo: 72000, unread: false, actor: 'System',          text: 'Demand letter deadline passed with no response', case: 'Martinez' },
    { id: 'n22', kind: 'update',  minutesAgo: 80640, unread: false, actor: 'Virtual Assistant', text: 'imported 14 pages of medical records',     case: 'Kim Clinic records' },
    { id: 'n23', kind: 'message', minutesAgo: 86400, unread: false, actor: 'Sara Chen',       text: 'mentioned you in Convo',                     case: 'Expert Review' },
    { id: 'n24', kind: 'task',    minutesAgo: 100800, unread: false, actor: 'Ar Tanveer',     text: 'created the Litigation Prep checklist',      case: 'Rear-End Collision' },
    { id: 'n25', kind: 'invoice', minutesAgo: 129600, unread: false, actor: 'Alexandra Reyes', text: 'paid invoice INV-1022 · $435.00',           case: 'Johnson v. City Transit' },
];

/* Kind filter chips on the full page — 'all' plus one per glyph family */
export const KIND_FILTERS = [
    { id: 'all',     label: 'Everything' },
    { id: 'alert',   label: 'Alerts'     },
    { id: 'invoice', label: 'Invoices'   },
    { id: 'form',    label: 'Forms'      },
    { id: 'esign',   label: 'E-signs'    },
    { id: 'task',    label: 'Tasks'      },
    { id: 'event',   label: 'Events'     },
    { id: 'message', label: 'Messages'   },
    { id: 'update',  label: 'Case updates' },
];

export const relativeTime = (mins) => {
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    return weeks < 5 ? `${weeks}w ago` : `${Math.floor(days / 30)}mo ago`;
};

/* Buckets are by calendar-ish distance, not by kind — people look for
   "what happened while I was away" first. */
export const groupOf = (mins) => {
    if (mins < 1440) return 'Today';
    if (mins < 2880) return 'Yesterday';
    if (mins < 10080) return 'This Week';
    if (mins < 43200) return 'Earlier This Month';
    return 'Older';
};
export const GROUP_ORDER = ['Today', 'Yesterday', 'This Week', 'Earlier This Month', 'Older'];

const NotificationsPopover = ({ onClose, onViewAll }) => {
    const [items, setItems] = useState(NOTIFICATIONS);
    const [filter, setFilter] = useState('all');
    const wrapRef = useRef(null);

    useEffect(() => {
        const onDocClick = (e) => {
            /* Only a real left-click in a focused page dismisses. A right-click
               (Inspect Element) or an event arriving while DevTools holds focus
               would otherwise close the popover before it can be inspected. */
            if (e.button !== 0 || !document.hasFocus()) return;
            /* While the in-app inspector is armed, clicks are for picking
               elements — including the inspector's own toggle button, which
               sits outside this popover and would otherwise dismiss it. */
            if (document.body.dataset.inspecting === 'true') return;
            if (e.target.closest('[data-devinspector]')) return;
            /* The bell itself toggles, so ignore clicks that started on it */
            if (wrapRef.current && !wrapRef.current.contains(e.target) && !e.target.closest('.portal-notif-btn')) {
                onClose();
            }
        };
        const onKey = (e) => {
            /* Escape exits the inspector first — it owns the key while armed */
            if (document.body.dataset.inspecting === 'true') return;
            if (e.key === 'Escape' && document.hasFocus()) onClose();
        };
        document.addEventListener('mousedown', onDocClick);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onDocClick);
            document.removeEventListener('keydown', onKey);
        };
    }, [onClose]);

    const unreadCount = items.filter(n => n.unread).length;
    const visible = filter === 'unread' ? items.filter(n => n.unread) : items;

    const grouped = useMemo(() => {
        const map = {};
        visible.forEach(n => {
            const g = groupOf(n.minutesAgo);
            (map[g] = map[g] || []).push(n);
        });
        return GROUP_ORDER.filter(g => map[g]).map(g => [g, map[g]]);
    }, [visible]);

    const markAllRead = () => setItems(prev => prev.map(n => ({ ...n, unread: false })));
    const toggleRead = (id) => setItems(prev => prev.map(n => (n.id === id ? { ...n, unread: !n.unread } : n)));
    const dismiss = (id, e) => { e.stopPropagation(); setItems(prev => prev.filter(n => n.id !== id)); };

    return (
        <div className="np-popover" ref={wrapRef}>
            <div className="np-header">
                <div className="np-header-top">
                    <h3 className="np-title">
                        Notifications
                        {unreadCount > 0 && <span className="np-unread-pill">{unreadCount} new</span>}
                    </h3>
                    <div className="np-header-actions">
                        <button className="np-link-btn" onClick={markAllRead} disabled={unreadCount === 0}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            Mark all read
                        </button>
                        <button className="np-close-btn" onClick={onClose} aria-label="Close notifications">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                    </div>
                </div>
                <div className="np-filters">
                    <button className={`np-filter${filter === 'all' ? ' active' : ''}`} onClick={() => setFilter('all')}>
                        All <span className="np-filter-count">{items.length}</span>
                    </button>
                    <button className={`np-filter${filter === 'unread' ? ' active' : ''}`} onClick={() => setFilter('unread')}>
                        Unread <span className="np-filter-count">{unreadCount}</span>
                    </button>
                </div>
            </div>

            <div className="np-list">
                {grouped.length === 0 ? (
                    <div className="np-empty">
                        <div className="np-empty-icon">
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                        <p className="np-empty-title">You&apos;re all caught up</p>
                        <p className="np-empty-desc">Nothing unread right now.</p>
                    </div>
                ) : grouped.map(([group, rows]) => (
                    <div key={group} className="np-group">
                        <div className="np-group-label">{group}</div>
                        {rows.map(n => {
                            const kind = KINDS[n.kind];
                            return (
                                <button
                                    key={n.id}
                                    className={`np-item np-tint-${kind.tint}${n.unread ? ' unread' : ''}`}
                                    onClick={() => toggleRead(n.id)}
                                    title={n.unread ? 'Mark as read' : 'Mark as unread'}
                                >
                                    <span className="np-item-icon">
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{kind.icon}</svg>
                                    </span>
                                    <span className="np-item-body">
                                        <span className="np-item-text">
                                            <strong>{n.actor}</strong> {n.text}
                                        </span>
                                        <span className="np-item-meta">
                                            <span className="np-item-case">{n.case}</span>
                                            <span className="np-item-dot">·</span>
                                            <span>{relativeTime(n.minutesAgo)}</span>
                                        </span>
                                    </span>
                                    <span className="np-item-right">
                                        {n.unread && <span className="np-item-unread-dot" />}
                                        <span
                                            className="np-item-dismiss"
                                            role="button"
                                            tabIndex={-1}
                                            onClick={(e) => dismiss(n.id, e)}
                                            title="Dismiss"
                                        >
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                        </span>
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>

            <div className="np-footer">
                <button className="np-footer-btn" onClick={() => { onClose(); onViewAll?.(); }}>
                    View all notifications
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
            </div>
        </div>
    );
};

export const UNREAD_NOTIFICATION_COUNT = NOTIFICATIONS.filter(n => n.unread).length;
export default NotificationsPopover;
