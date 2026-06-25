import { useState } from 'react';
import FeedView from './FeedView';
import ProfileView from './ProfileView';
import EventsView from './EventsView';

const HUBS = ['Hub 1', 'Hub 2', 'All Hubs'];

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

const ROLE_COLORS = { client: '#149EB1', staff: '#64748B', admin: '#6366F1' };

const CaseMembers = ({ members }) => {
    const visible = members.slice(0, 3);
    const extra = members.length - visible.length;
    return (
        <div className="lc-members">
            {visible.map((m, i) => (
                <div
                    key={i}
                    className="lc-avatar"
                    style={{ background: ROLE_COLORS[m.role] || '#94A3B8', zIndex: visible.length - i }}
                    title={`${m.name} (${m.role})`}
                >
                    {m.name[0].toUpperCase()}
                </div>
            ))}
            {extra > 0 && (
                <div className="lc-avatar lc-avatar-more" style={{ zIndex: 0 }}>+{extra}</div>
            )}
        </div>
    );
};

const LOBBY_CASES = [
    {
        title: 'Rear-End-Collision---Downtown-LA',
        members: [
            { name: 'Gold Roger',   role: 'client' },
            { name: 'Jordan Admin', role: 'admin'  },
            { name: 'Ar Tanveer',   role: 'staff'  },
            { name: 'Sarah Lee',    role: 'staff'  },
        ],
    },
    {
        title: 'Welcome! Here is a Sample Case',
        members: [
            { name: 'Gold Roger',   role: 'client' },
            { name: 'Jordan Admin', role: 'staff'  },
        ],
    },
];

const CASE_NAV = [
    { label: 'Feed',     icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg> },
    { label: 'Events',   icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
    { label: 'Forms',    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="m9 12 2 2 4-4"/><line x1="9" y1="17" x2="15" y2="17"/></svg> },
    { label: 'E-signs',  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
    { label: 'Invoices', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2H6a1 1 0 0 0-1 1v18l3-2 2 2 2-2 2 2 2-2 3 2V3a1 1 0 0 0-1-1z"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="12" y2="17"/></svg> },
    { label: 'Notes',    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> },
    { label: 'Tasks',    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> },
    { label: 'Convo',    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12 19.79 19.79 0 0 1 1.95 3.59 2 2 0 0 1 3.92 1.4h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> },
    { label: 'Info',     icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> },
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
    const [switchModalOpen, setSwitchModalOpen] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [navOpen, setNavOpen] = useState(false);
    const [titleSwitchOpen, setTitleSwitchOpen] = useState(false);

    const topbar = (
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
                    <button className="portal-mode-btn" onClick={() => setSwitchModalOpen(true)}>Admin</button>
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
                            <button className="portal-profile-option" onClick={() => { setProfileOpen(false); setShowProfile(true); }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                Profile
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
    );

    if (showProfile) return (
        <div className="lobby-shell">
            {topbar}
            <div className="lobby-content-title">
                <div>
                    <h1 className="portal-page-title">Profile</h1>
                    <p className="portal-breadcrumb">Lobby · Profile</p>
                </div>
            </div>
            <ProfileView onBack={() => setShowProfile(false)} backLabel="Back to Lobby" />
        </div>
    );

    return (
        <div className="lobby-shell">
            {topbar}

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

            {selectedCase ? (
                /* Case Detail View */
                <div className="case-view-layout">
                        {navOpen && <div className="portal-nav-overlay active" onClick={() => setNavOpen(false)} />}
                        <aside className={`case-sidebar${navOpen ? ' case-sidebar--open' : ''}`}>
                            <div className="case-sidebar-logo-header">
                                <img src="/assets/images/logo.svg" alt="CaseActive" style={{ height: 28, width: 'auto' }} />
                                <button className="case-sidebar-close-btn" onClick={() => setNavOpen(false)} aria-label="Close sidebar">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                </button>
                            </div>
                            <div className="case-sidebar-back">
                                <button className="case-back-btn" onClick={() => { setSelectedCase(null); setNavOpen(false); }}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                                    Cases
                                </button>
                                <div className="case-switcher-wrap">
                                    <button className="case-switcher-btn" onClick={() => setCaseSwitchOpen(p => !p)}>
                                        <span className="case-switcher-name">{selectedCase.title}</span>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="6 9 12 15 18 9"/></svg>
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
                            <p className="case-sidebar-label">Case Categories</p>
                            {CASE_NAV.map(item => (
                                <button key={item.label} className={`case-nav-item${activeCaseNav === item.label ? ' active' : ''}`} onClick={() => { setActiveCaseNav(item.label); setNavOpen(false); }}>
                                    <span className="case-nav-icon">{item.icon}</span>
                                    <span>{item.label}</span>
                                    {item.hasSub && <svg style={{marginLeft:'auto'}} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>}
                                </button>
                            ))}
                            <div className="sidebar-bottom-img">
                                <img
                                    src="/assets/images/left-sidebar.svg"
                                    alt=""
                                />
                            </div>
                        </aside>
                        <main className="case-main">
                            <div className="case-content-title">
                                <div className="case-title-mobile-nav">
                                    <button className="case-back-btn" onClick={() => { setSelectedCase(null); setNavOpen(false); }}>
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                                        Cases
                                    </button>
                                    <span style={{ color: '#D1D5DB', fontSize: 12 }}>/</span>
                                    <div className="case-switcher-wrap" style={{ width: 'auto' }}>
                                        <button className="case-title-switcher-btn" onClick={() => setTitleSwitchOpen(p => !p)}>
                                            <span className="case-switcher-name" style={{ maxWidth: 200 }}>{selectedCase.title}</span>
                                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="6 9 12 15 18 9"/></svg>
                                        </button>
                                        {titleSwitchOpen && (
                                            <div className="case-switcher-dropdown">
                                                {LOBBY_CASES.map((c, i) => (
                                                    <button key={i} className={`case-switcher-option${selectedCase.title === c.title ? ' active' : ''}`} onClick={() => { setSelectedCase(c); setTitleSwitchOpen(false); }}>
                                                        {c.title}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <h2 className="portal-page-title">{activeCaseNav}</h2>
                            </div>
                            <div className="case-content-body">
                                {activeCaseNav === 'Feed' ? (
                                    <FeedView />
                                ) : activeCaseNav === 'Events' ? (
                                    <EventsView embedded />
                                ) : (
                                    <div className="case-feed-empty-card">No {activeCaseNav.toLowerCase()} yet.</div>
                                )}
                            </div>
                        </main>
                    </div>
            ) : (
                /* Lobby content — full width */
                <>
                <div className="lobby-content-title">
                    <div>
                        <h1 className="portal-page-title">{selectedHub}</h1>
                        <p className="portal-breadcrumb">{selectedHub} · Client Lobby</p>
                    </div>
                </div>
                <div className="lobby-content">
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
                                    <CaseMembers members={c.members} />
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
                </>
            )}
            {switchModalOpen && (
                <SwitchModeModal
                    targetMode="Admin"
                    onConfirm={() => { setSwitchModalOpen(false); onToggle(); }}
                    onCancel={() => setSwitchModalOpen(false)}
                />
            )}
        </div>
    );
};

export default LobbyView;
