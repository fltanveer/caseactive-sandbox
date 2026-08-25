import { useMemo, useState } from 'react';
import InfoBanner from '../components/InfoBanner';
import {
    NOTIFICATIONS, KINDS, KIND_FILTERS, GROUP_ORDER, groupOf, relativeTime,
} from '../components/NotificationsPopover';
import '../components/NotificationsPopover.css';
import './EventsView.css';
import './FormsView.css';
import './NotificationsView.css';

const TABS = [
    { id: 'all',    label: 'All'    },
    { id: 'unread', label: 'Unread' },
    { id: 'read',   label: 'Read'   },
];

const NotificationsView = ({ embedded = false }) => {
    const [items, setItems] = useState(NOTIFICATIONS);
    const [tab, setTab]     = useState('all');
    const [kind, setKind]   = useState('all');
    const [search, setSearch] = useState('');

    const unreadCount = items.filter(n => n.unread).length;

    const matchesTab = (n, id) => (id === 'all' ? true : id === 'unread' ? n.unread : !n.unread);

    const visible = items
        .filter(n => matchesTab(n, tab))
        .filter(n => kind === 'all' || n.kind === kind)
        .filter(n => {
            const q = search.trim().toLowerCase();
            if (!q) return true;
            return `${n.actor} ${n.text} ${n.case}`.toLowerCase().includes(q);
        });

    const grouped = useMemo(() => {
        const map = {};
        visible.forEach(n => {
            const g = groupOf(n.minutesAgo);
            (map[g] = map[g] || []).push(n);
        });
        return GROUP_ORDER.filter(g => map[g]).map(g => [g, map[g]]);
    }, [visible]);

    const markAllRead = () => setItems(prev => prev.map(n => ({ ...n, unread: false })));
    const toggleRead  = (id) => setItems(prev => prev.map(n => (n.id === id ? { ...n, unread: !n.unread } : n)));
    const dismiss     = (id, e) => { e.stopPropagation(); setItems(prev => prev.filter(n => n.id !== id)); };
    /* Clearing wipes what's on screen, not the whole inbox — otherwise a
       filtered view would quietly delete rows the user can't see. */
    const clearVisible = () => {
        const ids = new Set(visible.map(n => n.id));
        setItems(prev => prev.filter(n => !ids.has(n.id)));
    };

    return (
        <div className={`forms-page nv-page${embedded ? ' nv-page-embedded' : ''}`}>
            <InfoBanner message="Everything that happened across your cases — deadlines, submissions, signatures, payments and messages, newest first." />

            <div className="ev-tabs-outer-embedded">
                <div className="ev-tabs-bar">
                    {TABS.map(t => (
                        <button key={t.id} className={`ev-tab${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
                            {t.label}
                            <span className="cfm-tab-count">{items.filter(n => matchesTab(n, t.id)).length}</span>
                        </button>
                    ))}
                </div>
                <button className="np-link-btn nv-mark-all" onClick={markAllRead} disabled={unreadCount === 0}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Mark all read
                </button>
            </div>

            <div className="forms-view">
                <div className="nv-toolbar">
                    <div className="hubs-search nv-search">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        <input
                            type="text"
                            className="hubs-search-input"
                            placeholder="Search notifications, people or cases..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="nv-kinds">
                        {KIND_FILTERS.map(k => (
                            <button
                                key={k.id}
                                className={`nv-kind-chip${kind === k.id ? ' active' : ''}`}
                                onClick={() => setKind(k.id)}
                            >
                                {k.id !== 'all' && (
                                    <span className={`nv-kind-dot np-tint-${KINDS[k.id].tint}`} />
                                )}
                                {k.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="nv-list-head">
                    <span className="nv-count">
                        {visible.length} {visible.length === 1 ? 'notification' : 'notifications'}
                        {kind !== 'all' && <> in <strong>{KIND_FILTERS.find(k => k.id === kind).label}</strong></>}
                    </span>
                    <button className="nv-clear-btn" onClick={clearVisible} disabled={visible.length === 0}>
                        Clear these
                    </button>
                </div>

                <div className="nv-list">
                    {grouped.length === 0 ? (
                        <div className="np-empty">
                            <div className="np-empty-icon">
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            </div>
                            <p className="np-empty-title">Nothing here</p>
                            <p className="np-empty-desc">
                                {search.trim() ? 'No notification matches that search.' : 'Try a different filter.'}
                            </p>
                        </div>
                    ) : grouped.map(([group, rows]) => (
                        <div key={group} className="np-group">
                            <div className="np-group-label nv-group-label">{group}</div>
                            {rows.map(n => {
                                const glyph = KINDS[n.kind];
                                return (
                                    <button
                                        key={n.id}
                                        className={`np-item nv-item np-tint-${glyph.tint}${n.unread ? ' unread' : ''}`}
                                        onClick={() => toggleRead(n.id)}
                                        title={n.unread ? 'Mark as read' : 'Mark as unread'}
                                    >
                                        <span className="np-item-icon">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{glyph.icon}</svg>
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
                                        <span className="np-item-right nv-item-right">
                                            {n.unread && <span className="nv-new-badge">New</span>}
                                            <span
                                                className="np-item-dismiss"
                                                role="button"
                                                tabIndex={-1}
                                                onClick={(e) => dismiss(n.id, e)}
                                                title="Dismiss"
                                            >
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                            </span>
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NotificationsView;
