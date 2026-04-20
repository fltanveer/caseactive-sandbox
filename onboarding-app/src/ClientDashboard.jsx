import React from 'react';

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
    },
    {
        from: 'Jordan Admin', role: 'Attorney', time: '3 days ago',
        text: "Your case is progressing well. The investigation phase is nearly complete. We expect to begin negotiations next month.",
    },
];

const DOCUMENTS = [
    { name: 'Medical Report Q3',    status: 'uploaded', date: 'Oct 12' },
    { name: 'Incident Report',      status: 'uploaded', date: 'Oct 8'  },
    { name: 'Insurance Documents',  status: 'pending',  date: null     },
];

const ClientDashboard = ({ prefill, onExit }) => {
    const firmName  = prefill?.firmName  ?? 'Demo Law Firm';
    const fullName  = prefill?.fullName  ?? 'Alex Demo';
    const caseName  = prefill?.caseName  ?? 'Johnson v. City Transit';

    return (
        <div className="client-dashboard">
            <div className="client-header">
                <div className="client-header-left">
                    <div className="dashboard-logo dark">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15c0 .53-.21 1.04-.59 1.41-.37.38-.88.59-1.41.59H7l-4 4V5c0-.53.21-1.04.59-1.41C3.96 3.21 4.47 3 5 3h14c.53 0 1.04.21 1.41.59.38.37.59.88.59 1.41v10z"/></svg>
                        CaseActive
                    </div>
                    <span className="client-firm-badge">{firmName}</span>
                </div>
                <div className="client-header-right">
                    <span className="client-user-name">👤 {fullName}</span>
                    <button className="demo-exit-btn" onClick={onExit}>Exit demo</button>
                </div>
            </div>

            <div className="client-content">
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
                                        {step.done && (
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
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
                </div>

                <div className="client-panels">
                    <div className="client-panel">
                        <h3 className="client-section-title">Messages from {firmName}</h3>
                        <div className="message-list">
                            {MESSAGES.map((msg, i) => (
                                <div key={i} className="message-item">
                                    <div className="message-meta">
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
                        <h3 className="client-section-title">Documents</h3>
                        <div className="doc-list">
                            {DOCUMENTS.map((doc, i) => (
                                <div key={i} className="doc-item">
                                    <div className="doc-icon">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
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
            </div>
        </div>
    );
};

export default ClientDashboard;
