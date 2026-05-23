import React, { useState, useRef, useEffect } from 'react';
import FeedView from './views/FeedView';
import ProfileView from './views/ProfileView';

const TIMELINE = [
    { label: 'Intake',         done: true,  active: false },
    { label: 'Investigation',  done: false, active: true  },
    { label: 'Negotiation',    done: false, active: false },
    { label: 'Settlement',     done: false, active: false },
];

const MESSAGES = [
    {
        from: 'Casey Staff', role: 'Paralegal', time: 'Yesterday',
        text: "Hi Alex, we've received your medical records and have submitted them to the insurance adjuster. We'll update you within 3–5 business days.",
        avatar: 'CS',
        color: 'teal',
    },
    {
        from: 'Jordan Admin', role: 'Attorney', time: '3 days ago',
        text: "Your case is progressing well. The investigation phase is nearly complete. We expect to begin negotiations next month.",
        avatar: 'JA',
        color: 'blue',
    },
];

const DOCUMENTS = [
    { name: 'Medical Report Q3',    status: 'uploaded', date: 'Oct 12', type: 'pdf' },
    { name: 'Incident Report',      status: 'uploaded', date: 'Oct 8',  type: 'doc' },
    { name: 'Insurance Documents',  status: 'pending',  date: null,     type: 'img' },
];


const ClientDashboard = ({ prefill, onExit }) => {
    const firmName  = prefill?.firmName  ?? 'Demo Law Firm';
    const fullName  = prefill?.fullName  ?? 'Alex Demo';
    const caseName  = prefill?.caseName  ?? 'Johnson v. City Transit';
    const [activeView, setActiveView]     = useState('dashboard');
    const [activeTab, setActiveTab]       = useState('feed');
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [, setCheckedDocs] = useState({});
    const menuRef = useRef(null);

    useEffect(() => {
        if (!userMenuOpen) return;
        const handle = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setUserMenuOpen(false);
        };
        document.addEventListener('mousedown', handle);
        return () => document.removeEventListener('mousedown', handle);
    }, [userMenuOpen]);

    const nameParts   = fullName.split(' ');
    const clientPrefill = {
        firstName:   nameParts[0] ?? 'Alex',
        lastName:    nameParts.slice(1).join(' ') || 'Demo',
        role:        'Client',
        email:       'alex.demo@clientmail.com',
        phone:       '555-867-5309',
        memberSince: 'Mar 2024',
    };

    const toggleDoc = (name) => {
        setCheckedDocs(prev => ({ ...prev, [name]: !prev[name] }));
    };

    const TABS = [
        { id: 'overview', label: 'Overview' },
        { id: 'feed',     label: 'Feed' },
        { id: 'documents',label: 'Documents' },
    ];

    return (
        <div className="client-dashboard">
            <div className="client-header">
                <div className="client-header-left">
                    <div className="dashboard-logo dark">
                        <img src="/assets/images/logo.svg" alt="CaseActive" style={{ height: 24, width: 'auto' }} />
                    </div>
                    <span className="client-firm-badge">{firmName}</span>
                </div>
                <div className="client-header-right">
                    <div className="cd-user-menu-wrap" ref={menuRef}>
                        <button className="cd-user-btn" onClick={() => setUserMenuOpen(v => !v)}>
                            <div className="cd-user-avatar">{(fullName[0] || '').toUpperCase()}</div>
                            <span className="cd-user-label">{fullName}</span>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                        </button>
                        {userMenuOpen && (
                            <div className="cd-user-dropdown">
                                <button className="cd-dropdown-item" onClick={() => { setActiveView('profile'); setUserMenuOpen(false); }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                    Profile
                                </button>
                                <div className="cd-dropdown-divider" />
                                <button className="cd-dropdown-item cd-dropdown-danger" onClick={onExit}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                                    Exit demo
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {activeView === 'profile' ? (
                <ProfileView onBack={() => setActiveView('dashboard')} userPrefill={clientPrefill} />
            ) : (
            <div className="client-content">
                {/* Case card always visible */}
                <div className="client-case-card">
                    <div className="client-case-top">
                        <div>
                            <div className="client-case-label">Your Case</div>
                            <h2 className="client-case-name">{caseName}</h2>
                        </div>
                        <span className="case-status-badge status-active">In Progress</span>
                    </div>
                    <div className="case-timeline">
                        {TIMELINE.map((step, i) => (
                            <React.Fragment key={step.label}>
                                <div className="timeline-step">
                                    <div className={`timeline-dot${step.done ? ' done' : step.active ? ' active' : ''}`}>
                                        {step.done ? (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                        ) : (
                                            <span style={{ fontSize: '12px', color: step.active ? '#149EB1' : '#ccc' }}>{i + 1}</span>
                                        )}
                                    </div>
                                    <span className={`timeline-label${step.active ? ' active' : step.done ? ' done' : ''}`}>
                                        {step.label}
                                    </span>
                                </div>
                                {i < TIMELINE.length - 1 && (
                                    <div className={`timeline-connector${TIMELINE[i + 1].done || TIMELINE[i + 1].active ? ' done' : ''}`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Tabs */}
                    <div className="client-tabs">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                className={`client-tab${activeTab === tab.id ? ' active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab content */}
                {activeTab === 'feed' && <FeedView />}

                {activeTab === 'overview' && (
                    <div className="client-panels">
                        <div className="client-panel">
                            <h3 className="client-section-title">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                Messages from {firmName}
                            </h3>
                            <div className="message-list">
                                {MESSAGES.map((msg, i) => (
                                    <div key={i} className="message-item">
                                        <div className="message-meta">
                                            <div className={`message-avatar ${msg.color}`}>{msg.avatar}</div>
                                            <span className="message-from">{msg.from}</span>
                                            <span className="message-role">{msg.role}</span>
                                            <span className="message-time">{msg.time}</span>
                                        </div>
                                        <p className="message-text">{msg.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="client-panel">
                            <h3 className="client-section-title">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                Documents
                            </h3>
                            <div className="doc-list">
                                {DOCUMENTS.map((doc, i) => (
                                    <div key={i} className="doc-item" onClick={() => toggleDoc(doc.name)}>
                                        <div className={`doc-icon ${doc.type}`}>
                                            {doc.type === 'pdf' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
                                            {doc.type === 'doc' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>}
                                            {doc.type === 'img' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>}
                                        </div>
                                        <div className="doc-info">
                                            <span className="doc-name">{doc.name}</span>
                                            {doc.date && <span className="doc-date">{doc.date}</span>}
                                        </div>
                                        <span className={`doc-status ${doc.status}`}>{doc.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'documents' && (
                    <div className="client-panel" style={{ marginTop: 0 }}>
                        <h3 className="client-section-title">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                            Documents
                        </h3>
                        <div className="doc-list">
                            {DOCUMENTS.map((doc, i) => (
                                <div key={i} className="doc-item" onClick={() => toggleDoc(doc.name)}>
                                    <div className={`doc-icon ${doc.type}`}>
                                        {doc.type === 'pdf' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
                                        {doc.type === 'doc' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>}
                                        {doc.type === 'img' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>}
                                    </div>
                                    <div className="doc-info">
                                        <span className="doc-name">{doc.name}</span>
                                        {doc.date && <span className="doc-date">{doc.date}</span>}
                                    </div>
                                    <span className={`doc-status ${doc.status}`}>{doc.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            )}
        </div>
    );
};

export default ClientDashboard;
