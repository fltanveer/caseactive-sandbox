import { useState } from 'react';

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
    const [profileOpen, setProfileOpen] = useState(false);

    return (
        <div className="lobby-shell">
            {/* Shared topbar */}
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
                        <button className="portal-mode-btn" onClick={onToggle}>Admin</button>
                        <button className="portal-mode-btn active">Lobby</button>
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
                                <button className="portal-profile-option" onClick={() => setProfileOpen(false)}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                                    Settings
                                </button>
                                <button className="portal-profile-option danger" onClick={() => setProfileOpen(false)}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                                    Log out
                                </button>
                            </div>
                        )}
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

export default LobbyView;
