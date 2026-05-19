import { useState, useEffect } from 'react';
import './PortalDashboard.css';
import './styles/client-dashboard.css';
import LobbyView from './views/LobbyView';
import HubsPage from './views/HubsPage';
import CasesView from './views/CasesView';
import UsersView from './views/UsersView';
import FeedTemplatesView from './views/library/FeedTemplatesView';
import FormTemplatesView from './views/library/FormTemplatesView';
import ProfileView from './views/ProfileView';
import GeneralSettingsView from './views/settings/GeneralSettingsView';
import AdvancedSettingsView from './views/settings/AdvancedSettingsView';

const WIPView = ({ nav, sub }) => (
    <div className="portal-content">
        <div className="portal-content-title">
            <h1 className="portal-page-title">{sub || nav}</h1>
            <p className="portal-breadcrumb">{nav}{sub ? ` · ${sub}` : ''}</p>
        </div>
        <div className="wip-container">
            <div className="wip-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
            </div>
            <div className="wip-badge">In progress</div>
            <h2 className="wip-title">Design work in progress</h2>
            <p className="wip-desc">The <strong>{sub || nav}</strong> page is currently being designed. Check back soon.</p>
        </div>
    </div>
);

const NAV = [
    {
        label: 'Home', icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        ),
        sub: ['Dashboard', 'Announcements', 'Inquiries', 'Payments'],
    },
    {
        label: 'Cases', icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
        ),
    },
    {
        label: 'Users', icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        ),
    },
    {
        label: 'Library', icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
        ),
        sub: ['Feed Templates', 'Form Templates', 'E-Sign Templates', 'Note Templates', 'Task Templates'],
    },
    {
        label: 'Integration', icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M21 12h-3M3 12H6M12 3V6M12 18v3"/></svg>
        ),
        sub: ['Imports', 'Webhooks', 'Keys'],
    },
    {
        label: 'Settings', icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        ),
        sub: ['Profile', 'General', 'Hubs', 'User Intake', 'Custom Fields', 'Automations', 'Advanced Settings'],
    },
];

const StatIcon = ({ type, color }) => {
    const icons = {
        users: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
        cases: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
        media: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
        inquiries: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    };
    return <div className="portal-stat-icon-wrap" style={{ background: color + '18', color: color }}>{icons[type]}</div>;
};

const ActivityIcon = ({ type }) => {
    const icons = {
        user: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/></svg>,
        case: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
        inquiry: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
        announcement: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    };
    const colors = {
        user: '#149EB1',
        case: '#149EB1',
        inquiry: '#149EB1',
        announcement: '#149EB1',
    };
    return <div className="portal-activity-icon-wrap" style={{ background: colors[type] + '15', color: colors[type] }}>{icons[type]}</div>;
};

const STATS = [
    { label: 'Users',       value: '2',      delta: '+1 this week', type: 'users',      color: '#149EB1' },
    { label: 'Cases',       value: '2',      delta: '+0 this week', type: 'cases',      color: '#149EB1' },
    { label: 'Media Size',  value: '0.02MB', delta: null,           type: 'media',      color: '#149EB1' },
    { label: 'Inquiries',   value: '0',      delta: 'No new',       type: 'inquiries',  color: '#149EB1' },
];

const ACTIVITY = [
    { text: 'New user registered',      time: '2h ago',     type: 'user' },
    { text: 'Case #2 updated',          time: '4h ago',     type: 'case' },
    { text: 'Inquiry submitted',        time: 'Yesterday',  type: 'inquiry' },
    { text: 'Announcement published',   time: '2 days ago', type: 'announcement' },
];

const CHART_DATA = [
    { date: '04/22', views: 0,  cases: 0  },
    { date: '04/23', views: 1,  cases: 0  },
    { date: '04/24', views: 5,  cases: 1  },
    { date: '04/25', views: 2,  cases: 0  },
    { date: '04/26', views: 1,  cases: 0  },
    { date: '04/27', views: 1,  cases: 0  },
    { date: '04/28', views: 1,  cases: 0  },
    { date: '04/29', views: 1,  cases: 1  },
];

const HUBS = ['Hub 1', 'Hub 2', 'All Hubs'];

const MiniChart = () => {
    const W = 600, H = 120, PAD = 20;
    const maxV = 5;
    const pts = (key) => CHART_DATA.map((d, i) => {
        const x = PAD + (i / (CHART_DATA.length - 1)) * (W - PAD * 2);
        const y = H - PAD - (d[key] / maxV) * (H - PAD * 2);
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            <defs>
                <linearGradient id="darkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#149EB1" stopOpacity="0.18"/>
                    <stop offset="100%" stopColor="#149EB1" stopOpacity="0"/>
                </linearGradient>
                <linearGradient id="lightGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#9CA3AF" stopOpacity="0.15"/>
                    <stop offset="100%" stopColor="#9CA3AF" stopOpacity="0"/>
                </linearGradient>
            </defs>
            {[0,1,2,3,4,5].map(v => {
                const y = H - PAD - (v / maxV) * (H - PAD * 2);
                return <line key={v} x1={PAD} y1={y} x2={W - PAD} y2={y} stroke="#F3F4F6" strokeWidth="1"/>;
            })}
            <polygon
                points={`${PAD},${H - PAD} ${pts('views')} ${W - PAD},${H - PAD}`}
                fill="url(#darkGrad)"
            />
            <polyline points={pts('views')} fill="none" stroke="#149EB1" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
            <polygon
                points={`${PAD},${H - PAD} ${pts('cases')} ${W - PAD},${H - PAD}`}
                fill="url(#lightGrad)"
            />
            <polyline points={pts('cases')} fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="5 3"/>
            {CHART_DATA.map((d, i) => {
                const x = PAD + (i / (CHART_DATA.length - 1)) * (W - PAD * 2);
                const y = H - PAD - (d.views / maxV) * (H - PAD * 2);
                return d.views > 0 ? <circle key={i} cx={x} cy={y} r="3.5" fill="#149EB1" stroke="#fff" strokeWidth="1.5"/> : null;
            })}
        </svg>
    );
};

const SwitchModeModal = ({ targetMode, onConfirm, onCancel }) => (
    <div className="modal-overlay" onClick={onCancel}>
        <div className="confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="confirm-modal-header">
                <h3 className="confirm-modal-title">Switch to {targetMode}</h3>
                <button className="confirm-modal-close" onClick={onCancel}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
            <div className="confirm-modal-body">
                <p className="confirm-modal-text">Are you sure you want to switch to {targetMode} view?</p>
            </div>
            <div className="confirm-modal-footer">
                <button className="confirm-modal-cancel" onClick={onCancel}>Cancel</button>
                <button className="confirm-modal-confirm" onClick={onConfirm}>Switch</button>
            </div>
        </div>
    </div>
);

const PortalDashboard = ({ initialView } = {}) => {
    const [activeNav, setActiveNav] = useState('Home');
    const [activeSub, setActiveSub] = useState('Dashboard');
    const [openNav, setOpenNav] = useState('Home');
    const [hubOpen, setHubOpen] = useState(false);
    const [selectedHub, setSelectedHub] = useState('Hub 1');
    const [appView, setAppView] = useState(initialView || 'hubs');
    const [profileOpen, setProfileOpen] = useState(false);
    const [switchModalOpen, setSwitchModalOpen] = useState(false);
    const [profileNudgeOpen, setProfileNudgeOpen] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setProfileNudgeOpen(true), 3000);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        document.body.style.display = 'block';
        document.body.style.padding = '0';
        return () => {
            document.body.style.display = '';
            document.body.style.padding = '';
        };
    }, []);

    const handleSwitchToLobby = () => {
        setSwitchModalOpen(false);
        setAppView('lobby');
    };

    if (appView === 'hubs') return <HubsPage onAdmin={() => setAppView('admin')} onLobby={() => setAppView('lobby')} />;
    if (appView === 'lobby') return <LobbyView onToggle={() => setAppView('admin')} onHubs={() => setAppView('hubs')} />;

    return (
        <div className="portal-shell">

            {/* Top bar — full width */}
            <div className="portal-topbar">
                <div className="portal-logo">
                    <img src="/assets/images/logo.svg" alt="CaseActive" style={{ height: 28, width: 'auto' }} />
                </div>
                <div className="portal-topbar-right">
                    <div className="portal-hub-wrap">
                        <button className="portal-hub-btn" onClick={() => setHubOpen(p => !p)}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                            {selectedHub}
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                        </button>
                        {hubOpen && (
                            <div className="portal-hub-dropdown">
                                {HUBS.map(h => (
                                    <button
                                        key={h}
                                        className={`portal-hub-option${selectedHub === h ? ' active' : ''}`}
                                        onClick={() => { if (h === 'All Hubs') { setHubOpen(false); setActiveNav('Settings'); setActiveSub('Hubs'); setOpenNav('Settings'); } else { setSelectedHub(h); setHubOpen(false); } }}
                                    >{h}</button>
                                ))}
                                <div className="portal-hub-divider"/>
                                <button className="portal-hub-join" onClick={() => setHubOpen(false)}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                    Join / Add Hub
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="portal-mode-toggle">
                        <button className="portal-mode-btn active">Admin</button>
                        <button className="portal-mode-btn" onClick={() => setSwitchModalOpen(true)}>Lobby</button>
                    </div>
                    <button className="portal-notif-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                    </button>
                    <div className="portal-profile-wrap">
                        <div className="portal-topbar-profile" onClick={() => setProfileOpen(p => !p)}>
                            <div className="portal-avatar">J</div>
                            <div className="portal-topbar-profile-info">
                                <div className="portal-user-name">Jordan Admin</div>
                                <div className="portal-user-role">Administrator</div>
                            </div>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#94A3B8', marginLeft: '2px', flexShrink: 0 }}><polyline points="6 9 12 15 18 9"/></svg>
                        </div>
                        {profileOpen && (
                            <div className="portal-profile-dropdown">
                                <button className="portal-profile-option" onClick={() => { setProfileOpen(false); setActiveNav('Settings'); setActiveSub('Profile'); setOpenNav('Settings'); }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                    Profile
                                </button>
                                <button className="portal-profile-option" onClick={() => { setProfileOpen(false); }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                                    Settings
                                </button>
                                <button className="portal-profile-option danger" onClick={() => { setProfileOpen(false); window.location.hash = ''; }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                                    Log out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Body — padded, sidebar + main side by side */}
            <div className="portal-body">

                {/* Sidebar */}
                <aside className="portal-sidebar">
                    <nav className="portal-nav">
                        {NAV.map(item => (
                            <div key={item.label}>
                                <button
                                    className={`portal-nav-item${activeNav === item.label ? ' active' : ''}${item.sub ? ' has-sub' : ''}`}
                                    onClick={() => {
                                        setActiveNav(item.label);
                                        if (item.sub) {
                                            const isOpening = openNav !== item.label;
                                            setOpenNav(isOpening ? item.label : null);
                                            if (isOpening) setActiveSub(item.sub[0]);
                                        } else {
                                            setOpenNav(null);
                                        }
                                    }}
                                >
                                    <span className="portal-nav-icon">{item.icon}</span>
                                    <span>{item.label}</span>
                                    {item.sub && (
                                        <svg className={`portal-nav-chevron${openNav === item.label ? ' open' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                                    )}
                                </button>
                                {item.sub && openNav === item.label && (
                                    <div className="portal-subnav">
                                        {item.sub.map(s => (
                                            <button
                                                key={s}
                                                className={`portal-subnav-item${activeSub === s && activeNav === item.label ? ' active' : ''}`}
                                                onClick={() => { setActiveSub(s); setActiveNav(item.label); }}
                                            >{s}</button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>
                </aside>

                {/* Main content */}
                <main className="portal-main">
                    {activeNav === 'Cases' ? (
                        <CasesView />
                    ) : activeNav === 'Users' ? (
                        <UsersView />
                    ) : activeNav === 'Library' && activeSub === 'Feed Templates' ? (
                        <FeedTemplatesView />
                    ) : activeNav === 'Library' && activeSub === 'Form Templates' ? (
                        <FormTemplatesView />
                    ) : activeNav === 'Settings' && activeSub === 'Profile' ? (
                        <ProfileView onBack={() => { setActiveNav('Home'); setActiveSub('Dashboard'); setOpenNav('Home'); }} />
                    ) : activeNav === 'Settings' && activeSub === 'Hubs' ? (
                        <HubsPage embedded onAdmin={() => setAppView('admin')} onLobby={() => setAppView('lobby')} />
                    ) : activeNav === 'Settings' && activeSub === 'General' ? (
                        <GeneralSettingsView />
                    ) : activeNav === 'Settings' && activeSub === 'Advanced Settings' ? (
                        <AdvancedSettingsView />
                    ) : activeNav !== 'Home' || activeSub !== 'Dashboard' ? (
                        <WIPView nav={activeNav} sub={activeSub} />
                    ) : (
                    <div className="portal-content">
                        <div className="portal-content-title">
                            <h1 className="portal-page-title">Dashboard</h1>
                            <p className="portal-breadcrumb">Home · {activeSub}</p>
                        </div>
                        {/* Stats */}
                        <div className="portal-stats-row">
                            {STATS.map(s => (
                                <div key={s.label} className="portal-stat-card">
                                    <StatIcon type={s.type} color={s.color} />
                                    <div className="portal-stat-body">
                                        <div className="portal-stat-value">{s.value}</div>
                                        <div className="portal-stat-label">{s.label}</div>
                                        {s.delta && (
                                            <div className="portal-stat-delta">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                                                {s.delta}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Chart + Activity */}
                        <div className="portal-grid-2">
                            <div className="portal-card portal-chart-card">
                                <div className="portal-card-header">
                                    <h2 className="portal-card-title">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                                        Audience Overview
                                    </h2>
                                    <div className="portal-chart-legend">
                                        <span className="legend-dot" style={{ background: '#149EB1' }}/>Views
                                        <span className="legend-dot" style={{ background: '#9CA3AF' }}/>Cases
                                    </div>
                                </div>
                                <div className="portal-chart-dates">
                                    {CHART_DATA.map(d => <span key={d.date}>{d.date}</span>)}
                                </div>
                                <div className="portal-chart-area">
                                    <MiniChart />
                                </div>
                            </div>
                            <div className="portal-card">
                                <div className="portal-card-header">
                                    <h2 className="portal-card-title">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                        Recent Activity
                                    </h2>
                                    <span className="portal-card-badge">Updated daily</span>
                                </div>
                                <div className="portal-activity-list">
                                    {ACTIVITY.map((a, i) => (
                                        <div key={i} className="portal-activity-item">
                                            <ActivityIcon type={a.type} />
                                            <span className="portal-activity-text">{a.text}</span>
                                            <span className="portal-activity-time">{a.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* All stats */}
                        <div className="portal-card portal-all-stats">
                            <div className="portal-card-header">
                                <h2 className="portal-card-title">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                                    All Statistics
                                </h2>
                                <span className="portal-card-badge">Updated daily</span>
                            </div>
                            <div className="portal-all-stats-grid">
                                {STATS.map(s => {
                                    const pct = s.label === 'Users' ? 40 : s.label === 'Cases' ? 40 : s.label === 'Media Size' ? 5 : 0;
                                    return (
                                        <div key={s.label} className="portal-all-stat-row">
                                            <span className="portal-all-stat-label">{s.label}</span>
                                            <div className="portal-all-stat-bar-wrap">
                                                <div
                                                    className="portal-all-stat-bar"
                                                    style={{ width: `${pct}%`, opacity: pct > 0 ? 1 : 0 }}
                                                />
                                            </div>
                                            <span className="portal-all-stat-val">{s.value}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    )}
                </main>

            </div>
            {switchModalOpen && (
                <SwitchModeModal
                    targetMode="Lobby"
                    onConfirm={handleSwitchToLobby}
                    onCancel={() => setSwitchModalOpen(false)}
                />
            )}

            {profileNudgeOpen && (
                <div className="pn-nudge">
                    <button className="pn-close" onClick={() => setProfileNudgeOpen(false)} aria-label="Dismiss">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                    <div className="pn-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#149EB1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    <div className="pn-body">
                        <p className="pn-title">Your profile is incomplete</p>
                        <p className="pn-desc">Add your name, contact info, and photo so your team and clients can recognize you.</p>
                        <button
                            className="pn-cta"
                            onClick={() => { setProfileNudgeOpen(false); setActiveNav('Settings'); setActiveSub('Profile'); setOpenNav('Settings'); }}
                        >
                            Complete my profile
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </button>
                    </div>
                </div>
            )}

            <button
                className={`pn-fab${profileNudgeOpen ? ' active' : ''}`}
                onClick={() => setProfileNudgeOpen(o => !o)}
                aria-label="Help"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3"/></svg>
            </button>
        </div>
    );
};

export default PortalDashboard;
