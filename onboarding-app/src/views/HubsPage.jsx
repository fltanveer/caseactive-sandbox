import { useState } from 'react';
import InfoBanner from '../components/InfoBanner';

const HUBS_DATA = [
    { name: 'Hub 1', type: 'admin', status: 'active' },
    { name: 'Hub 2', type: 'admin', status: 'active' },
];

const HubsBody = ({ onAdmin, onLobby, newModalOpen = false, onCloseNew }) => {
    const [statusTab, setStatusTab] = useState('Active');
    return (
        <>
            <InfoBanner message="A Hub in CaseActive is a workspace where you can manage all your cases. You can create a single workspace for all your clients or multiple workspaces according to your clients, depending on your preferences." />
            <div className="hubs-content">
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
                        <span>Company Name</span>
                        <span>Type</span>
                        <span>Status</span>
                        <span/>
                    </div>
                    {HUBS_DATA.map((hub, i) => (
                        <div key={i} className="hubs-table-row">
                            <span data-label="Company Name">
                                <div className="hubs-row-name">
                                    <div className="hubs-row-icon">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                                    </div>
                                    <span>{hub.name}</span>
                                </div>
                            </span>
                            <span className="hubs-row-cell" data-label="Type">{hub.type}</span>
                            <span className="hubs-status-text" data-label="Status">{hub.status}</span>
                            <span data-label="Action">
                                <div className="hubs-row-actions">
                                    <button className="hubs-text-btn lobby" onClick={onLobby}>Lobby</button>
                                    <button className="hubs-text-btn admin" onClick={onAdmin}>Admin</button>
                                    <button className="hubs-action-btn more" title="More Options">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="19" r="1" fill="currentColor"/></svg>
                                    </button>
                                </div>
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {newModalOpen && (
                <div className="hub-modal-overlay" onClick={onCloseNew}>
                    <div className="hub-modal" onClick={e => e.stopPropagation()}>
                        <div className="hub-modal-header">
                            <h2 className="hub-modal-title">Select an option</h2>
                            <button className="hub-modal-close" onClick={onCloseNew}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                            </button>
                        </div>
                        <div className="hub-modal-divider"/>
                        <div className="hub-modal-options">
                            <button className="hub-modal-card">
                                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#149EB1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                <span>Join an existing Hub as a client</span>
                            </button>
                            <button className="hub-modal-card">
                                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#149EB1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                                <span>Create a new Hub for my business</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const HubsPage = ({ onAdmin, onLobby, embedded = false, newModalOpen = false, onCloseNew }) => {
    const [profileOpen, setProfileOpen] = useState(false);

    if (embedded) {
        return (
            <div className="hubs-view">
                <HubsBody onAdmin={onAdmin} onLobby={onLobby} newModalOpen={newModalOpen} onCloseNew={onCloseNew} />
            </div>
        );
    }

    return (
        <div className="hubs-shell">
            <div className="portal-topbar">
                <div className="portal-logo">
                    <img src="/assets/images/logo.svg" alt="CaseActive" style={{ height: 28, width: 'auto' }} />
                </div>
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
            <HubsBody onAdmin={onAdmin} onLobby={onLobby} />
        </div>
    );
};

export default HubsPage;
