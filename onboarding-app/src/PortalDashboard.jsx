import { useState, useEffect } from 'react';

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
    },
    {
        label: 'Integration', icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M21 12h-3M3 12H6M12 3V6M12 18v3"/></svg>
        ),
    },
    {
        label: 'Settings', icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        ),
    },
];

const STATS = [
    { label: 'Users',       value: '2',      delta: '+1 this week', icon: '👤', color: '#374151' },
    { label: 'Cases',       value: '2',      delta: '+0 this week', icon: '📁', color: '#6B7280' },
    { label: 'Media Size',  value: '0.02MB', delta: null,           icon: '🗂️', color: '#9CA3AF' },
    { label: 'Inquiries',   value: '0',      delta: 'No new',       icon: '💬', color: '#D1D5DB' },
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

const ACTIVITY = [
    { text: 'New user registered',         time: '2h ago',    dot: '#374151' },
    { text: 'Case #2 updated',             time: '4h ago',    dot: '#6B7280' },
    { text: 'Inquiry submitted',           time: 'Yesterday', dot: '#9CA3AF' },
    { text: 'Announcement published',      time: '2 days ago', dot: '#D1D5DB' },
];

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
                    <stop offset="0%" stopColor="#374151" stopOpacity="0.18"/>
                    <stop offset="100%" stopColor="#374151" stopOpacity="0"/>
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
            <polyline points={pts('views')} fill="none" stroke="#374151" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
            <polygon
                points={`${PAD},${H - PAD} ${pts('cases')} ${W - PAD},${H - PAD}`}
                fill="url(#lightGrad)"
            />
            <polyline points={pts('cases')} fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="5 3"/>
            {CHART_DATA.map((d, i) => {
                const x = PAD + (i / (CHART_DATA.length - 1)) * (W - PAD * 2);
                const y = H - PAD - (d.views / maxV) * (H - PAD * 2);
                return d.views > 0 ? <circle key={i} cx={x} cy={y} r="3.5" fill="#374151" stroke="#fff" strokeWidth="1.5"/> : null;
            })}
        </svg>
    );
};

const HUBS = ['Hub 1', 'Hub 2', 'All Hubs'];

const LOBBY_CASES = [
    { title: 'Rear-End-Collision---Downtown-LA' },
    { title: 'Welcome! Here is a Sample Case' },
];

const CASE_NAV = [
    { label: 'Feed',     hasSub: true, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg> },
    { label: 'Events',   icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
    { label: 'Forms',    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
    { label: 'E-signs',  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> },
    { label: 'Invoices', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
    { label: 'Notes',    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> },
    { label: 'Tasks',    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> },
    { label: 'Convo',    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12 19.79 19.79 0 0 1 1.95 3.59 2 2 0 0 1 3.92 1.4h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> },
    { label: 'Info',     icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> },
];

const LobbyNavBtn = () => (
    <>
        <button className="lobby-nav-btn"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg></button>
        <button className="lobby-nav-btn"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>
    </>
);

const LobbyView = ({ onToggle, onHubs }) => {
    const [caseTab, setCaseTab] = useState('open');
    const [inquiryTab, setInquiryTab] = useState('open');
    const [hubOpen, setHubOpen] = useState(false);
    const [selectedHub, setSelectedHub] = useState('Hub 1');
    const [selectedCase, setSelectedCase] = useState(null);
    const [activeCaseNav, setActiveCaseNav] = useState('Feed');
    const [caseSwitchOpen, setCaseSwitchOpen] = useState(false);

    return (
        <div className="lobby-shell">
            {/* Shared topbar */}
            <div className="portal-topbar">
                <div className="portal-logo">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15c0 .53-.21 1.04-.59 1.41-.37.38-.88.59-1.41.59H7l-4 4V5c0-.53.21-1.04.59-1.41C3.96 3.21 4.47 3 5 3h14c.53 0 1.04.21 1.41.59.38.37.59.88.59 1.41v10z"/></svg>
                    <span>CaseActive</span>
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
                                    <button key={h} className={`portal-hub-option${selectedHub === h ? ' active' : ''}`} onClick={() => { if (h === 'All Hubs') { setHubOpen(false); onHubs(); } else { setSelectedHub(h); setHubOpen(false); } }}>{h}</button>
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
                        <span className="portal-mode-label">Admin</span>
                        <button className="portal-toggle-track on" onClick={onToggle} aria-label="Switch mode">
                            <span className="portal-toggle-thumb"/>
                        </button>
                        <span className="portal-mode-label active">Lobby</span>
                    </div>
                    <button className="portal-notif-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                    </button>
                    <div className="portal-topbar-profile">
                        <div className="portal-avatar">J</div>
                        <div className="portal-topbar-profile-info">
                            <div className="portal-user-name">Jordan Admin</div>
                            <div className="portal-user-role">Administrator</div>
                        </div>
                    </div>
                </div>
            </div>

            {selectedCase ? (
                /* Case Detail View */
                <div className="case-view-body">
                    <div className="case-view-breadcrumb">
                        <button className="case-back-btn" onClick={() => setSelectedCase(null)}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                            Cases
                        </button>
                        <span className="case-breadcrumb-sep">/</span>
                        <div className="case-switcher-wrap">
                            <button className="case-switcher-btn" onClick={() => setCaseSwitchOpen(p => !p)}>
                                <span className="case-breadcrumb-title">{selectedCase.title}</span>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                            </button>
                            {caseSwitchOpen && (
                                <div className="case-switcher-dropdown">
                                    {LOBBY_CASES.map((c, i) => (
                                        <button key={i} className={`case-switcher-option${selectedCase.title === c.title ? ' active' : ''}`} onClick={() => { setSelectedCase(c); setCaseSwitchOpen(false); }}>
                                            {c.title}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="case-view-layout">
                        <aside className="case-sidebar">
                            <p className="case-sidebar-label">Case Categories</p>
                            {CASE_NAV.map(item => (
                                <button key={item.label} className={`case-nav-item${activeCaseNav === item.label ? ' active' : ''}`} onClick={() => setActiveCaseNav(item.label)}>
                                    <span className="case-nav-icon">{item.icon}</span>
                                    <span>{item.label}</span>
                                    {item.hasSub && <svg style={{marginLeft:'auto'}} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>}
                                </button>
                            ))}
                        </aside>
                        <main className="case-main">
                            <h2 className="case-main-title">{activeCaseNav}</h2>
                            {activeCaseNav === 'Feed' ? (
                                <>
                                    <div className="case-feed-compose">
                                        <div className="case-feed-avatar-icon">
                                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                        </div>
                                        <span className="case-feed-placeholder">Write something...</span>
                                    </div>
                                    <div className="case-feed-empty-card">No feeds yet.</div>
                                </>
                            ) : (
                                <div className="case-feed-empty-card">No {activeCaseNav.toLowerCase()} yet.</div>
                            )}
                        </main>
                    </div>
                </div>
            ) : (
                /* Lobby content — full width */
                <div className="lobby-content">
                    <div className="lobby-firm-header">
                        <h1 className="lobby-firm-name">Hub 1</h1>
                        <p className="lobby-firm-sub">Hub 1 · Client Lobby</p>
                    </div>

                    {/* Cases */}
                    <div className="lobby-card">
                        <div className="lobby-section-header">
                            <h2 className="lobby-section-title">Cases</h2>
                            <div className="lobby-section-actions">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                                <LobbyNavBtn />
                            </div>
                        </div>
                        <div className="lobby-tabs-row">
                            <button className={`lobby-tab-pill${caseTab === 'open' ? ' active' : ''}`} onClick={() => setCaseTab('open')}>Open <span className="lobby-tab-count">2</span></button>
                            <button className={`lobby-tab-pill${caseTab === 'closed' ? ' active' : ''}`} onClick={() => setCaseTab('closed')}>Closed <span className="lobby-tab-count">0</span></button>
                            <button className="lobby-add-btn">+</button>
                        </div>
                        <div className="lobby-cases-grid">
                            {caseTab === 'open' ? LOBBY_CASES.map((c, i) => (
                                <div key={i} className="lobby-case-card" onClick={() => { setSelectedCase(c); setActiveCaseNav('Feed'); }}>
                                    <div className="lobby-case-title">{c.title}</div>
                                    <svg className="lobby-case-avatar-icon" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                    <div className="lobby-case-corner"/>
                                </div>
                            )) : <p className="lobby-empty-msg">No closed cases.</p>}
                        </div>
                    </div>

                    {/* Announcements */}
                    <div className="lobby-card">
                        <div className="lobby-section-header">
                            <h2 className="lobby-section-title">Announcements</h2>
                            <div className="lobby-section-actions"><LobbyNavBtn /></div>
                        </div>
                        <p className="lobby-empty-msg">You currently have no announcements.</p>
                    </div>

                    {/* Inquiries + Locations */}
                    <div className="lobby-bottom-grid">
                        <div className="lobby-card">
                            <div className="lobby-section-header">
                                <h2 className="lobby-section-title">Inquiries</h2>
                                <div className="lobby-section-actions"><LobbyNavBtn /></div>
                            </div>
                            <div className="lobby-tabs-row">
                                <button className={`lobby-tab-pill${inquiryTab === 'open' ? ' active' : ''}`} onClick={() => setInquiryTab('open')}>Open <span className="lobby-tab-count">0</span></button>
                                <button className={`lobby-tab-pill${inquiryTab === 'closed' ? ' active' : ''}`} onClick={() => setInquiryTab('closed')}>Closed <span className="lobby-tab-count">0</span></button>
                                <button className="lobby-add-btn">+</button>
                            </div>
                            <p className="lobby-empty-msg">You currently have no open tickets.</p>
                        </div>
                        <div className="lobby-card">
                            <div className="lobby-section-header">
                                <h2 className="lobby-section-title">Locations</h2>
                                <div className="lobby-section-actions"><LobbyNavBtn /></div>
                            </div>
                            <p className="lobby-empty-msg">You currently have no locations.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const HUBS_DATA = [
    { name: 'Hub 1', type: 'admin', status: 'active' },
    { name: 'Hub 2', type: 'admin', status: 'active' },
];

const HubsPage = ({ onAdmin, onLobby }) => {
    const [statusTab, setStatusTab] = useState('Active');
    const [infoOpen, setInfoOpen] = useState(true);
    const [newModalOpen, setNewModalOpen] = useState(false);
    return (
        <div className="hubs-shell">
            <div className="portal-topbar">
                <div className="portal-logo">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15c0 .53-.21 1.04-.59 1.41-.37.38-.88.59-1.41.59H7l-4 4V5c0-.53.21-1.04.59-1.41C3.96 3.21 4.47 3 5 3h14c.53 0 1.04.21 1.41.59.38.37.59.88.59 1.41v10z"/></svg>
                    <span>CaseActive</span>
                </div>
                <div className="portal-topbar-profile">
                    <div className="portal-avatar">J</div>
                    <div className="portal-topbar-profile-info">
                        <div className="portal-user-name">Jordan Admin</div>
                        <div className="portal-user-role">Administrator</div>
                    </div>
                </div>
            </div>
            {infoOpen && (
                <div className="hubs-info-banner">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <p className="hubs-info-text">A Hub in CaseActive is a workspace where you can manage all your cases. You can create a single workspace for all your clients or multiple workspaces according to your clients, depending on your preferences.</p>
                    <button className="hubs-info-close" onClick={() => setInfoOpen(false)} aria-label="Dismiss">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
            )}
            <div className="hubs-content">
                <div className="hubs-page-header">
                    <h1 className="hubs-title">Hubs</h1>
                    <button className="hubs-new-btn" onClick={() => setNewModalOpen(true)}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        NEW
                    </button>
                </div>
                <div className="hubs-table">
                    <div className="hubs-toolbar">
                        <div className="hubs-search">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                            <input type="text" className="hubs-search-input" placeholder="Search hubs..."/>
                        </div>
                        <div className="hubs-status-row">
                            {['Active', 'Rejected', 'Disabled'].map(tab => (
                                <button key={tab} className={`hubs-status-tab${statusTab === tab ? ' active' : ''}`} onClick={() => setStatusTab(tab)}>{tab}</button>
                            ))}
                        </div>
                    </div>
                    <div className="hubs-table-head">
                        <span>COMPANY NAME</span>
                        <span>TYPE</span>
                        <span>STATUS</span>
                        <span/>
                    </div>
                    {HUBS_DATA.map((hub, i) => (
                        <div key={i} className="hubs-table-row">
                            <div className="hubs-row-name">
                                <div className="hubs-row-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                                </div>
                                <span>{hub.name}</span>
                            </div>
                            <span className="hubs-row-cell">{hub.type}</span>
                            <span className="hubs-row-cell">{hub.status}</span>
                            <div className="hubs-row-actions">
                                <button className="hubs-action-btn" onClick={onLobby}>LOBBY</button>
                                <button className="hubs-action-btn" onClick={onAdmin}>ADMIN</button>
                                <button className="hubs-more-btn">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="19" r="1" fill="currentColor"/></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {newModalOpen && (
                <div className="hub-modal-overlay" onClick={() => setNewModalOpen(false)}>
                    <div className="hub-modal" onClick={e => e.stopPropagation()}>
                        <div className="hub-modal-header">
                            <h2 className="hub-modal-title">Select an option</h2>
                            <button className="hub-modal-close" onClick={() => setNewModalOpen(false)}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                            </button>
                        </div>
                        <div className="hub-modal-divider"/>
                        <div className="hub-modal-options">
                            <button className="hub-modal-card">
                                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                <span>Join an existing Hub as a client</span>
                            </button>
                            <button className="hub-modal-card">
                                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                                <span>Create a new Hub for my business</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const PortalDashboard = () => {
    const [activeNav, setActiveNav] = useState('Home');
    const [activeSub, setActiveSub] = useState('Dashboard');
    const [homeOpen, setHomeOpen] = useState(true);
    const [hubOpen, setHubOpen] = useState(false);
    const [selectedHub, setSelectedHub] = useState('Hub 1');
    const [appView, setAppView] = useState('hubs');

    useEffect(() => {
        document.body.style.display = 'block';
        document.body.style.padding = '0';
        return () => {
            document.body.style.display = '';
            document.body.style.padding = '';
        };
    }, []);

    if (appView === 'hubs') return <HubsPage onAdmin={() => setAppView('admin')} onLobby={() => setAppView('lobby')} />;
    if (appView === 'lobby') return <LobbyView onToggle={() => setAppView('admin')} onHubs={() => setAppView('hubs')} />;

    return (
        <div className="portal-shell">

            {/* Top bar — full width */}
            <div className="portal-topbar">
                <div className="portal-logo">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15c0 .53-.21 1.04-.59 1.41-.37.38-.88.59-1.41.59H7l-4 4V5c0-.53.21-1.04.59-1.41C3.96 3.21 4.47 3 5 3h14c.53 0 1.04.21 1.41.59.38.37.59.88.59 1.41v10z"/></svg>
                    <span>CaseActive</span>
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
                                        onClick={() => { if (h === 'All Hubs') { setHubOpen(false); setAppView('hubs'); } else { setSelectedHub(h); setHubOpen(false); } }}
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
                        <span className="portal-mode-label active">Admin</span>
                        <button
                            className="portal-toggle-track"
                            onClick={() => setAppView('lobby')}
                            aria-label="Switch mode"
                        >
                            <span className="portal-toggle-thumb"/>
                        </button>
                        <span className="portal-mode-label">Lobby</span>
                    </div>
                    <button className="portal-notif-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                    </button>
                    <div className="portal-topbar-profile">
                        <div className="portal-avatar">J</div>
                        <div className="portal-topbar-profile-info">
                            <div className="portal-user-name">Jordan Admin</div>
                            <div className="portal-user-role">Administrator</div>
                        </div>
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
                                    className={`portal-nav-item${activeNav === item.label ? ' active' : ''}`}
                                    onClick={() => {
                                        setActiveNav(item.label);
                                        if (item.sub) setHomeOpen(p => item.label === 'Home' ? !p : p);
                                    }}
                                >
                                    <span className="portal-nav-icon">{item.icon}</span>
                                    <span>{item.label}</span>
                                    {item.sub && (
                                        <svg className={`portal-nav-chevron${homeOpen && item.label === 'Home' ? ' open' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                                    )}
                                </button>
                                {item.sub && homeOpen && item.label === 'Home' && (
                                    <div className="portal-subnav">
                                        {item.sub.map(s => (
                                            <button
                                                key={s}
                                                className={`portal-subnav-item${activeSub === s ? ' active' : ''}`}
                                                onClick={() => { setActiveSub(s); setActiveNav('Home'); }}
                                            >{s}</button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>
                    <div className="portal-sidebar-footer">
                        <div className="portal-avatar-row">
                            <div className="portal-avatar">J</div>
                            <div>
                                <div className="portal-user-name">Jordan Admin</div>
                                <div className="portal-user-role">Administrator</div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main content */}
                <main className="portal-main">
                    <div className="portal-content">
                        <div className="portal-content-title">
                            <h1 className="portal-page-title">Dashboard</h1>
                            <p className="portal-breadcrumb">Home · {activeSub}</p>
                        </div>
                        {/* Stats */}
                        <div className="portal-stats-row">
                            {STATS.map(s => (
                                <div key={s.label} className="portal-stat-card">
                                    <div className="portal-stat-icon" style={{ background: s.color + '18', color: s.color }}>{s.icon}</div>
                                    <div className="portal-stat-body">
                                        <div className="portal-stat-value">{s.value}</div>
                                        <div className="portal-stat-label">{s.label}</div>
                                        {s.delta && <div className="portal-stat-delta">{s.delta}</div>}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Chart + Activity */}
                        <div className="portal-grid-2">
                            <div className="portal-card portal-chart-card">
                                <div className="portal-card-header">
                                    <h2 className="portal-card-title">Audience Overview</h2>
                                    <div className="portal-chart-legend">
                                        <span className="legend-dot" style={{ background: '#374151' }}/>Views
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
                                    <h2 className="portal-card-title">Recent Activity</h2>
                                    <span className="portal-card-badge">Updated daily</span>
                                </div>
                                <div className="portal-activity-list">
                                    {ACTIVITY.map((a, i) => (
                                        <div key={i} className="portal-activity-item">
                                            <span className="portal-activity-dot" style={{ background: a.dot }}/>
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
                                <h2 className="portal-card-title">All Statistics</h2>
                                <span className="portal-card-badge">Updated daily</span>
                            </div>
                            <div className="portal-all-stats-grid">
                                {STATS.map(s => (
                                    <div key={s.label} className="portal-all-stat-row">
                                        <span className="portal-all-stat-label">{s.label}</span>
                                        <div className="portal-all-stat-bar-wrap">
                                            <div className="portal-all-stat-bar" style={{ width: s.label === 'Users' ? '40%' : s.label === 'Cases' ? '40%' : '5%', background: s.color }}/>
                                        </div>
                                        <span className="portal-all-stat-val">{s.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>

            </div>
        </div>
    );
};

export default PortalDashboard;
