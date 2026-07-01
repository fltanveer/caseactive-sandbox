import { useState, useEffect } from 'react';
import './PortalDashboard.css';
import './styles/client-dashboard.css';
import LobbyView from './views/LobbyView';
import HubsPage from './views/HubsPage';
import CasesView from './views/CasesView';
import UsersView from './views/UsersView';
import AnnouncementsView from './views/AnnouncementsView';
import InquiriesView from './views/InquiriesView';
import FeedTemplatesView from './views/library/FeedTemplatesView';
import FormTemplatesView from './views/library/FormTemplatesView';
import ProfileView from './views/ProfileView';
import GeneralSettingsView from './views/settings/GeneralSettingsView';
import AdvancedSettingsView from './views/settings/AdvancedSettingsView';
import AutomationsView from './views/settings/AutomationsView';
import CustomFieldsView from './views/settings/CustomFieldsView';


const WIPView = ({ nav, sub }) => (
    <div className="portal-content wip-page">
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
        ),
        sub: ['Dashboard', 'Announcements', 'Inquiries', 'Payments'],
    },
    {
        label: 'Cases', icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
        ),
    },
    {
        label: 'Users', icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>
        ),
    },
    {
        label: 'Library', icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        ),
        sub: ['Feed Templates', 'Form Templates', 'E-Sign Templates', 'Note Templates', 'Task Templates'],
    },
    {
        label: 'Integration', icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
        ),
        sub: ['Imports', 'Webhooks', 'Keys'],
    },
    {
        label: 'Settings', icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="8" cy="6" r="2" fill="white"/><circle cx="16" cy="12" r="2" fill="white"/><circle cx="10" cy="18" r="2" fill="white"/></svg>
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
    return <div className="portal-stat-icon-wrap" style={{ background: color + '14', color: color }}>{icons[type]}</div>;
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
    {
        label: 'Users', value: '2', type: 'users', color: '#149EB1',
        rows: [],
    },
    {
        label: 'Cases', value: '2', type: 'cases', color: '#149EB1',
        rows: [],
    },
    {
        label: 'Media Size', value: '0.02MB', type: 'media', color: '#149EB1',
        rows: [],
    },
    {
        label: 'Inquiries', value: '0', type: 'inquiries', color: '#149EB1', variant: 'inquiries',
        meta: [
            { label: 'Unprocessed', value: '4' },
        ],
        rows: [],
    },
];

const ACTIVITY = [
    { text: 'New user registered',      time: '2h ago',     type: 'user' },
    { text: 'Case #2 updated',          time: '4h ago',     type: 'case' },
    { text: 'Inquiry submitted',        time: 'Yesterday',  type: 'inquiry' },
    { text: 'Announcement published',   time: '2 days ago', type: 'announcement' },
];

const CHART_DATA = [
    { date: '06/16', views: 0, cases: 0 },
    { date: '06/17', views: 0, cases: 0 },
    { date: '06/18', views: 0, cases: 0 },
    { date: '06/19', views: 8, cases: 1 },
    { date: '06/20', views: 2, cases: 1 },
    { date: '06/21', views: 4, cases: 1 },
    { date: '06/22', views: 9, cases: 1 },
    { date: '06/23', views: 0, cases: 0 },
];

const HUBS = ['Hub 1', 'Hub 2', 'All Hubs'];

const MiniChart = () => {
    const W = 600, H = 120, PAD = 20;
    const maxV = 10;
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
            {[0,2,4,6,8,10].map(v => {
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
    const [usersCreateOpen, setUsersCreateOpen] = useState(false);
    const [navOpen, setNavOpen] = useState(false);
    const [casesCreateOpen, setCasesCreateOpen] = useState(false);
    const [announcementsCreateOpen, setAnnouncementsCreateOpen] = useState(false);
    const [inquiriesCreateOpen, setInquiriesCreateOpen] = useState(false);
    const [feedCreateOpen, setFeedCreateOpen] = useState(false);
    const [formCreateOpen, setFormCreateOpen] = useState(false);
    const [hubsCreateOpen, setHubsCreateOpen] = useState(false);
    const [chartMetric, setChartMetric] = useState('Audience');
    const [chartFrom, setChartFrom] = useState('2026-06-17');
    const [chartTo, setChartTo] = useState('2026-06-23');

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
                <div className="portal-topbar-left">
                    <button className="portal-hamburger" onClick={() => setNavOpen(p => !p)} aria-label="Toggle navigation">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                    </button>
                    <div className="portal-logo">
                        <img src="/assets/images/logo.svg" alt="CaseActive" className="portal-logo-full" style={{ height: 28, width: 'auto' }} />
                        <img src="/assets/images/logo-sm.svg" alt="CaseActive" className="portal-logo-sm" style={{ height: 28, width: 'auto', display: 'none' }} />
                    </div>
                </div>
                <div className="portal-topbar-right">
                    <div className="portal-hub-wrap">
                        <button className="portal-hub-btn" onClick={() => setHubOpen(p => !p)}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                            <span className="portal-hub-label">{selectedHub}</span>
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

            {/* Hub bar — mobile only */}
            <div className="portal-hub-bar" onClick={() => setHubOpen(p => !p)}>
                <div className="portal-hub-bar-left">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    <span>Current Hub: <span className="portal-hub-bar-name">{selectedHub}</span></span>
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                {hubOpen && (
                    <div className="portal-hub-dropdown portal-hub-bar-dropdown" onClick={e => e.stopPropagation()}>
                        {HUBS.map(h => (
                            <button key={h} className={`portal-hub-option${selectedHub === h ? ' active' : ''}`} onClick={() => { if (h === 'All Hubs') { setHubOpen(false); setActiveNav('Settings'); setActiveSub('Hubs'); setOpenNav('Settings'); } else { setSelectedHub(h); setHubOpen(false); } }}>{h}</button>
                        ))}
                        <div className="portal-hub-divider"/>
                        <button className="portal-hub-join" onClick={() => setHubOpen(false)}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            Join / Add Hub
                        </button>
                    </div>
                )}
            </div>

            {/* Body — sidebar flush left, main content scrollable */}
            <div className="portal-body">

                {/* Nav overlay backdrop (mobile/tablet) */}
                {navOpen && <div className="portal-nav-overlay active" onClick={() => setNavOpen(false)} />}

                {/* Sidebar */}
                <aside className={`portal-sidebar${navOpen ? ' portal-sidebar--open' : ''}`}>
                    <div className="portal-sidebar-logo-header">
                        <img src="/assets/images/logo.svg" alt="CaseActive" style={{ height: 28, width: 'auto' }} />
                        <button className="case-sidebar-close-btn" onClick={() => setNavOpen(false)} aria-label="Close sidebar">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                    </div>
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
                                            // On tablet/mobile: auto-expand sidebar so sub-items are visible
                                            if (!navOpen && window.innerWidth < 1024) {
                                                setNavOpen(true);
                                            }
                                        } else {
                                            setOpenNav(null);
                                            setActiveSub(null);
                                            setNavOpen(false);
                                        }
                                    }}
                                >
                                    <span className="portal-nav-icon">{item.icon}</span>
                                    <span className="portal-nav-label">{item.label}</span>
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
                                                onClick={() => { setActiveSub(s); setActiveNav(item.label); setNavOpen(false); }}
                                            >{s}</button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>
                    <div style={{ marginTop: 'auto', padding: '0 0 16px 12px' }}>
                        <img src="/assets/images/left-sidebar.svg" alt="" style={{ width: '100%', opacity: 0.85, display: 'block' }} />
                    </div>
                </aside>

                {/* Main content */}
                <main className="portal-main">
                    <div className="portal-content-title">
                        <div>
                            <h1 className="portal-page-title">
                                {activeNav === 'Home' ? (activeSub || 'Dashboard') : (activeSub || activeNav)}
                            </h1>
                            <p className="portal-breadcrumb">
                                {activeNav === 'Home'
                                    ? `Home · ${activeSub || 'Dashboard'}`
                                    : activeNav + (activeSub ? ` · ${activeSub}` : '')}
                            </p>
                        </div>
                        {(activeNav === 'Users' || activeNav === 'Cases' ||
                          (activeNav === 'Home' && activeSub === 'Announcements') ||
                          (activeNav === 'Home' && activeSub === 'Inquiries') ||
                          (activeNav === 'Library' && (activeSub === 'Feed Templates' || activeSub === 'Form Templates')) ||
                          (activeNav === 'Settings' && activeSub === 'Hubs')) && (
                            <button className="hubs-new-btn" onClick={() => {
                                if (activeNav === 'Users') setUsersCreateOpen(true);
                                else if (activeNav === 'Cases') setCasesCreateOpen(true);
                                else if (activeNav === 'Home' && activeSub === 'Announcements') setAnnouncementsCreateOpen(true);
                                else if (activeNav === 'Home' && activeSub === 'Inquiries') setInquiriesCreateOpen(true);
                                else if (activeNav === 'Library' && activeSub === 'Feed Templates') setFeedCreateOpen(true);
                                else if (activeNav === 'Library' && activeSub === 'Form Templates') setFormCreateOpen(true);
                                else if (activeNav === 'Settings' && activeSub === 'Hubs') setHubsCreateOpen(true);
                            }}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                NEW
                            </button>
                        )}
                    </div>
                    <div className="portal-main-body">
                    {activeNav === 'Cases' ? (
                        <CasesView createOpen={casesCreateOpen} onCloseCreate={() => setCasesCreateOpen(false)} />
                    ) : activeNav === 'Users' ? (
                        <UsersView createOpen={usersCreateOpen} onCloseCreate={() => setUsersCreateOpen(false)} />
                    ) : activeNav === 'Home' && activeSub === 'Announcements' ? (
                        <AnnouncementsView addOpen={announcementsCreateOpen} onCloseAdd={() => setAnnouncementsCreateOpen(false)} />
                    ) : activeNav === 'Home' && activeSub === 'Inquiries' ? (
                        <InquiriesView addOpen={inquiriesCreateOpen} onCloseAdd={() => setInquiriesCreateOpen(false)} />
                    ) : activeNav === 'Library' && activeSub === 'Feed Templates' ? (
                        <FeedTemplatesView addOpen={feedCreateOpen} onCloseAdd={() => setFeedCreateOpen(false)} />
                    ) : activeNav === 'Library' && activeSub === 'Form Templates' ? (
                        <FormTemplatesView addOpen={formCreateOpen} onCloseAdd={() => setFormCreateOpen(false)} />
                    ) : activeNav === 'Settings' && activeSub === 'Profile' ? (
                        <ProfileView onBack={() => { setActiveNav('Home'); setActiveSub('Dashboard'); setOpenNav('Home'); }} />
                    ) : activeNav === 'Settings' && activeSub === 'Hubs' ? (
                        <HubsPage embedded onAdmin={() => setAppView('admin')} onLobby={() => setAppView('lobby')} newModalOpen={hubsCreateOpen} onCloseNew={() => setHubsCreateOpen(false)} />
                    ) : activeNav === 'Settings' && activeSub === 'General' ? (
                        <GeneralSettingsView />
                    ) : activeNav === 'Settings' && activeSub === 'Advanced Settings' ? (
                        <AdvancedSettingsView />
                    ) : activeNav === 'Settings' && activeSub === 'Automations' ? (
                        <AutomationsView />
                    ) : activeNav === 'Settings' && activeSub === 'Custom Fields' ? (
                        <CustomFieldsView />
                    ) : activeNav !== 'Home' || activeSub !== 'Dashboard' ? (
                        <WIPView nav={activeNav} sub={activeSub} />
                    ) : (
                    <div className="portal-content">
                        {/* Stats */}
                        <div className="portal-stats-row">
                            {STATS.map(s => (
                                <div key={s.label} className={`portal-stat-card${s.variant === 'inquiries' ? ' portal-stat-card--inquiries' : ''}`}>
                                    <div className="portal-stat-card-top">
                                        <StatIcon type={s.type} color={s.color} />
                                        <div className={`portal-stat-body${s.variant === 'inquiries' ? ' portal-stat-body--inquiries' : ''}`}>
                                            <div className="portal-stat-label">{s.label}</div>
                                            <div className="portal-stat-number-row">
                                                <div className="portal-stat-value">{s.value}</div>
                                                {s.meta?.map(item => (
                                                    <span key={item.label} className={`portal-stat-meta-pill${s.variant === 'inquiries' ? ' portal-stat-meta-pill--large' : ''}`}>
                                                        {item.label}
                                                        <strong>{item.value}</strong>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    {s.rows.length > 0 && (
                                        <>
                                            <div className="portal-stat-divider" />
                                            <div className={`portal-stat-sub-rows${s.label === 'Media Size' ? ' portal-stat-sub-rows--media' : ''}${s.rows.length === 1 ? ' portal-stat-sub-rows--single' : ''}`}>
                                                {s.rows.map(r => (
                                                    <div key={r.label} className="portal-stat-sub-row">
                                                        <span className="portal-stat-sub-label">{r.label}</span>
                                                        <span className="portal-stat-sub-val">{r.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Chart + Activity */}
                        <div className="portal-grid-2">
                            <div className="portal-card portal-chart-card">
                                <div className="portal-card-header portal-chart-header">
                                    <h2 className="portal-card-title">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                                        Overview
                                    </h2>
                                    <div className="portal-chart-controls">
                                        <select value={chartMetric} onChange={(event) => setChartMetric(event.target.value)} className="portal-chart-select" aria-label="Chart metric">
                                            <option>Audience</option>
                                            <option>Asset Sizes</option>
                                            <option>Invoices</option>
                                        </select>
                                        <div className="portal-chart-date-controls" aria-label="Chart date range">
                                            <input id="chart-from" className="portal-chart-date-input" type="date" value={chartFrom} onChange={(event) => setChartFrom(event.target.value)} aria-label="From date" />
                                            <span className="portal-chart-date-separator">to</span>
                                            <input id="chart-to" className="portal-chart-date-input" type="date" value={chartTo} onChange={(event) => setChartTo(event.target.value)} aria-label="To date" />
                                        </div>
                                    </div>
                                </div>
                                <div className="portal-chart-legend">
                                    <span><span className="legend-dot" style={{ background: '#149EB1' }}/>Views</span>
                                    <span><span className="legend-dot" style={{ background: '#9CA3AF' }}/>Cases</span>
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

                    </div>
                    )}
                    </div>
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
