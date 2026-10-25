import { useState, useEffect } from 'react';
import './PortalDashboard.css';
import { NAV } from './adminNav';
import './styles/client-dashboard.css';
import LobbyView from './views/LobbyView';
import HubsPage from './views/HubsPage';
import CasesView from './views/CasesView';
import UsersView from './views/UsersView';
import PaymentsView from './views/PaymentsView';
import MiscView from './views/MiscView';
import AnnouncementsView from './views/AnnouncementsView';
import InquiriesView from './views/InquiriesView';
import FeedTemplatesView from './views/library/FeedTemplatesView';
import FormTemplatesView from './views/library/FormTemplatesView';
import ESignTemplatesView from './views/library/ESignTemplatesView';
import NoteTemplatesView from './views/library/NoteTemplatesView';
import TaskTemplatesView from './views/library/TaskTemplatesView';
import ProfileView from './views/ProfileView';
import GeneralSettingsView from './views/settings/GeneralSettingsView';
import AdvancedSettingsView from './views/settings/AdvancedSettingsView';
import AutomationsView from './views/settings/AutomationsView';
import NotificationsPopover, { UNREAD_NOTIFICATION_COUNT } from './components/NotificationsPopover';
import NotificationsView from './views/NotificationsView';
import BillingSettingsView from './views/settings/BillingSettingsView';
import CustomFieldsView from './views/settings/CustomFieldsView';
import StagesView from './views/settings/StagesView';
import UserIntakeView from './views/settings/UserIntakeView';
import ImportsView from './views/integration/ImportsView';
import WebhooksView from './views/integration/WebhooksView';
import KeysView from './views/integration/KeysView';
import DashboardView from './views/DashboardView';
import HelpCenter from './components/HelpCenter';


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



const HUBS = ['Sterling & Brooks Injury Law', 'Harlow Mass Tort Group', 'All Hubs'];

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

const PortalDashboard = ({ initialView, initialNav } = {}) => {
    const [activeNav, setActiveNav] = useState(initialNav ?? 'Home');
    const [activeSub, setActiveSub] = useState(initialNav ? null : 'Dashboard');
    const [openNav, setOpenNav] = useState(initialNav ? null : 'Home');
    const [hubOpen, setHubOpen] = useState(false);
    const [selectedHub, setSelectedHub] = useState('Sterling & Brooks Injury Law');
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
    const [esignCreateOpen, setEsignCreateOpen] = useState(false);
    const [noteCreateOpen, setNoteCreateOpen] = useState(false);
    const [taskCreateOpen, setTaskCreateOpen] = useState(false);
    const [intakeCreateOpen, setIntakeCreateOpen] = useState(false);
    const [hubsCreateOpen, setHubsCreateOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [automationsCreateOpen, setAutomationsCreateOpen] = useState(false);
    const [importsCreateOpen, setImportsCreateOpen] = useState(false);
    const [webhooksCreateOpen, setWebhooksCreateOpen] = useState(false);
    const [keysCreateOpen, setKeysCreateOpen] = useState(false);
    const [casesStageFilter, setCasesStageFilter] = useState('all');
    const [automationsTab, setAutomationsTab] = useState('Assign Cases');

    useEffect(() => {
        const t = setTimeout(() => setProfileNudgeOpen(true), 3000);
        return () => clearTimeout(t);
    }, []);

    /* Misc has its own address, /misc, so it can be shared. Going there puts
       it in the bar; leaving puts the app address back. */
    useEffect(() => {
        const { pathname, hash } = window.location;
        const onMisc = /^\/misc\/?$/.test(pathname) || /^#\/?misc\/?$/.test(hash);
        if (activeNav === 'Misc' && !onMisc) window.history.replaceState(null, '', '/misc');
        else if (activeNav !== 'Misc' && onMisc) window.history.replaceState(null, '', '/#/admin');
    }, [activeNav]);

    useEffect(() => {
        document.body.style.display = 'block';
        document.body.style.padding = '0';
        return () => {
            document.body.style.display = '';
            document.body.style.padding = '';
        };
    }, []);

    /* Cross-page links (e.g. Stages → Cases filtered to one stage). */
    const navigateTo = (target, opts = {}) => {
        if (target === 'cases') {
            setCasesStageFilter(opts.stageId || 'all');
            setActiveNav('Cases'); setActiveSub(null); setOpenNav(null);
        } else if (target === 'automations') {
            setAutomationsTab(opts.tab || 'Assign Cases');
            setActiveNav('Settings'); setActiveSub('Automations'); setOpenNav('Settings');
        } else if (target === 'stages') {
            setActiveNav('Settings'); setActiveSub('Stages'); setOpenNav('Settings');
        }
    };

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
                    <a className="portal-tickets-btn" href="/tickets" title="Design tickets">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 9a3 3 0 0 0 0 6v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3a3 3 0 0 0 0-6V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"/><line x1="13" y1="5" x2="13" y2="7"/><line x1="13" y1="11" x2="13" y2="13"/><line x1="13" y1="17" x2="13" y2="19"/></svg>
                        <span className="portal-tickets-label">Tickets</span>
                    </a>
                    <div className="portal-notif-wrap">
                        <button className="portal-notif-btn" onClick={() => setNotifOpen(p => !p)} aria-label="Notifications">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                            <span className="portal-notif-badge">{UNREAD_NOTIFICATION_COUNT}</span>
                        </button>
                        {notifOpen && (
                            <NotificationsPopover
                                onClose={() => setNotifOpen(false)}
                                onViewAll={() => { setActiveNav('Notifications'); setActiveSub(null); setOpenNav(null); }}
                            />
                        )}
                    </div>
                    <div className="portal-profile-wrap">
                        <div className="portal-topbar-profile" onClick={() => setProfileOpen(p => !p)}>
                            <div className="portal-avatar">R</div>
                            <div className="portal-topbar-profile-info">
                                <div className="portal-user-name">Robert Grant</div>
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
                        {NAV.map((item, navIdx) => item.divider ? (
                            <div key={`divider-${navIdx}`} className="portal-nav-divider" />
                        ) : (
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
                                            setCasesStageFilter('all');
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
                                                onClick={() => { setActiveSub(s); setActiveNav(item.label); setNavOpen(false); setAutomationsTab('Assign Cases'); }}
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
                          (activeNav === 'Library' && (activeSub === 'Feed Templates' || activeSub === 'Form Templates' || activeSub === 'E-Sign Templates' || activeSub === 'Note Templates' || activeSub === 'Task Templates')) ||
                          (activeNav === 'Settings' && activeSub === 'User Intake') ||
                          (activeNav === 'Settings' && activeSub === 'Hubs') ||
                          (activeNav === 'Settings' && activeSub === 'Automations') ||
                          (activeNav === 'Integration' && activeSub === 'Imports') ||
                          (activeNav === 'Integration' && activeSub === 'Webhooks') ||
                          (activeNav === 'Integration' && activeSub === 'Keys')) && (
                            <button className="hubs-new-btn" onClick={() => {
                                if (activeNav === 'Users') setUsersCreateOpen(true);
                                else if (activeNav === 'Cases') setCasesCreateOpen(true);
                                else if (activeNav === 'Home' && activeSub === 'Announcements') setAnnouncementsCreateOpen(true);
                                else if (activeNav === 'Home' && activeSub === 'Inquiries') setInquiriesCreateOpen(true);
                                else if (activeNav === 'Library' && activeSub === 'Feed Templates') setFeedCreateOpen(true);
                                else if (activeNav === 'Library' && activeSub === 'Form Templates') setFormCreateOpen(true);
                                else if (activeNav === 'Library' && activeSub === 'E-Sign Templates') setEsignCreateOpen(true);
                                else if (activeNav === 'Library' && activeSub === 'Note Templates') setNoteCreateOpen(true);
                                else if (activeNav === 'Library' && activeSub === 'Task Templates') setTaskCreateOpen(true);
                                else if (activeNav === 'Settings' && activeSub === 'User Intake') setIntakeCreateOpen(true);
                                else if (activeNav === 'Settings' && activeSub === 'Hubs') setHubsCreateOpen(true);
                                else if (activeNav === 'Settings' && activeSub === 'Automations') setAutomationsCreateOpen(true);
                                else if (activeNav === 'Integration' && activeSub === 'Imports') setImportsCreateOpen(true);
                                else if (activeNav === 'Integration' && activeSub === 'Webhooks') setWebhooksCreateOpen(true);
                                else if (activeNav === 'Integration' && activeSub === 'Keys') setKeysCreateOpen(true);
                            }}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                NEW
                            </button>
                        )}
                    </div>
                    <div className="portal-main-body">
                    {activeNav === 'Notifications' ? (
                        <NotificationsView />
                    ) : activeNav === 'Cases' ? (
                        <CasesView key={casesStageFilter} initialStageFilter={casesStageFilter} createOpen={casesCreateOpen} onCloseCreate={() => setCasesCreateOpen(false)} />
                    ) : activeNav === 'Users' ? (
                        <UsersView createOpen={usersCreateOpen} onCloseCreate={() => setUsersCreateOpen(false)} />
                    ) : activeNav === 'Payments' ? (
                        <PaymentsView />
                    ) : activeNav === 'Misc' ? (
                        <MiscView />
                    ) : activeNav === 'Home' && activeSub === 'Announcements' ? (
                        <AnnouncementsView addOpen={announcementsCreateOpen} onCloseAdd={() => setAnnouncementsCreateOpen(false)} />
                    ) : activeNav === 'Home' && activeSub === 'Inquiries' ? (
                        <InquiriesView addOpen={inquiriesCreateOpen} onCloseAdd={() => setInquiriesCreateOpen(false)} />
                    ) : activeNav === 'Library' && activeSub === 'Feed Templates' ? (
                        <FeedTemplatesView addOpen={feedCreateOpen} onCloseAdd={() => setFeedCreateOpen(false)} />
                    ) : activeNav === 'Library' && activeSub === 'Form Templates' ? (
                        <FormTemplatesView addOpen={formCreateOpen} onCloseAdd={() => setFormCreateOpen(false)} />
                    ) : activeNav === 'Library' && activeSub === 'E-Sign Templates' ? (
                        <ESignTemplatesView addOpen={esignCreateOpen} onCloseAdd={() => setEsignCreateOpen(false)} />
                    ) : activeNav === 'Library' && activeSub === 'Note Templates' ? (
                        <NoteTemplatesView addOpen={noteCreateOpen} onCloseAdd={() => setNoteCreateOpen(false)} />
                    ) : activeNav === 'Library' && activeSub === 'Task Templates' ? (
                        <TaskTemplatesView addOpen={taskCreateOpen} onCloseAdd={() => setTaskCreateOpen(false)} />
                    ) : activeNav === 'Settings' && activeSub === 'User Intake' ? (
                        <UserIntakeView addOpen={intakeCreateOpen} onCloseAdd={() => setIntakeCreateOpen(false)} />
                    ) : activeNav === 'Settings' && activeSub === 'Profile' ? (
                        <ProfileView onBack={() => { setActiveNav('Home'); setActiveSub('Dashboard'); setOpenNav('Home'); }} />
                    ) : activeNav === 'Settings' && activeSub === 'Hubs' ? (
                        <HubsPage embedded onAdmin={() => setAppView('admin')} onLobby={() => setAppView('lobby')} newModalOpen={hubsCreateOpen} onCloseNew={() => setHubsCreateOpen(false)} />
                    ) : activeNav === 'Settings' && activeSub === 'General' ? (
                        <GeneralSettingsView />
                    ) : activeNav === 'Settings' && activeSub === 'Advanced Settings' ? (
                        <AdvancedSettingsView />
                    ) : activeNav === 'Settings' && activeSub === 'Automations' ? (
                        <AutomationsView key={automationsTab} initialTab={automationsTab} createOpen={automationsCreateOpen} onCloseCreate={() => setAutomationsCreateOpen(false)} />
                    ) : activeNav === 'Settings' && activeSub === 'Billing & Subscription' ? (
                        <BillingSettingsView />
                    ) : activeNav === 'Settings' && activeSub === 'Custom Fields' ? (
                        <CustomFieldsView onOpenStages={() => navigateTo('stages')} />
                    ) : activeNav === 'Settings' && activeSub === 'Stages' ? (
                        <StagesView onNavigate={navigateTo} />
                    ) : activeNav === 'Integration' && activeSub === 'Imports' ? (
                        <ImportsView addOpen={importsCreateOpen} onCloseAdd={() => setImportsCreateOpen(false)} />
                    ) : activeNav === 'Integration' && activeSub === 'Webhooks' ? (
                        <WebhooksView addOpen={webhooksCreateOpen} onCloseAdd={() => setWebhooksCreateOpen(false)} />
                    ) : activeNav === 'Integration' && activeSub === 'Keys' ? (
                        <KeysView addOpen={keysCreateOpen} onCloseAdd={() => setKeysCreateOpen(false)} />
                    ) : activeNav !== 'Home' || activeSub !== 'Dashboard' ? (
                        <WIPView nav={activeNav} sub={activeSub} />
                    ) : (
                    <DashboardView />
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

            <HelpCenter
                onNavigate={(nav, sub) => { setActiveNav(nav); setActiveSub(sub); setOpenNav(nav); }}
                onActivity={() => setProfileNudgeOpen(false)}
            />
        </div>
    );
};

export default PortalDashboard;
