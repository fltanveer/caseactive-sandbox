const NAV_ITEMS = ['Dashboard', 'Cases', 'Clients', 'Staff', 'Settings'];

const STATS = [
    { label: 'Active Cases',     value: '12', trend: '+2 this week',   warn: false },
    { label: 'Clients',          value: '8',  trend: '+1 this week',   warn: false },
    { label: 'Staff',            value: '3',  trend: null,             warn: false },
    { label: 'Pending Reviews',  value: '2',  trend: 'Action needed',  warn: true  },
];

const ACTIVITY = [
    { text: "Sarah Johnson's case moved to Settlement",         time: '2h ago',    type: 'update'   },
    { text: 'New client Marcus Lee added by Casey Staff',       time: '4h ago',    type: 'client'   },
    { text: 'Document uploaded: Medical Report Q3',             time: 'Yesterday', type: 'doc'      },
    { text: 'Review requested: Martinez v. Regional Health',    time: 'Yesterday', type: 'review'   },
    { text: 'Portal customization updated',                     time: '3 days ago', type: 'settings' },
];

const AdminDashboard = ({ prefill, onExit }) => {
    const firmName  = prefill?.firmName  ?? 'Demo Law Firm';
    const fullName  = prefill?.fullName  ?? 'Jordan Admin';
    const firstName = fullName.split(' ')[0];
    const portalSlug = firmName.toLowerCase().replace(/\s+/g, '');

    return (
        <div className="dashboard-shell">
            <aside className="dashboard-sidebar">
                <div className="dashboard-logo">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15c0 .53-.21 1.04-.59 1.41-.37.38-.88.59-1.41.59H7l-4 4V5c0-.53.21-1.04.59-1.41C3.96 3.21 4.47 3 5 3h14c.53 0 1.04.21 1.41.59.38.37.59.88.59 1.41v10z"/></svg>
                    CaseActive
                </div>
                <nav className="dashboard-nav">
                    {NAV_ITEMS.map((item, i) => (
                        <button key={item} className={`dashboard-nav-item${i === 0 ? ' active' : ''}`}>
                            {item}
                        </button>
                    ))}
                </nav>
                <div className="dashboard-sidebar-footer">
                    <div className="dashboard-user">
                        <div className="dashboard-avatar">{firstName[0]}</div>
                        <div>
                            <div className="dashboard-user-name">{fullName}</div>
                            <div className="dashboard-user-role">Admin</div>
                        </div>
                    </div>
                </div>
            </aside>

            <main className="dashboard-main">
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-greeting">Good morning, {firstName} 👋</h1>
                        <p className="dashboard-subheading">{firmName} · Admin</p>
                    </div>
                    <button className="demo-exit-btn" onClick={onExit}>Exit demo</button>
                </div>

                <div className="portal-live-banner">
                    <span className="portal-live-dot" />
                    <span>
                        Your portal is live at{' '}
                        <strong>demo.caseactive.com/{portalSlug}</strong>
                    </span>
                </div>

                <div className="stats-row">
                    {STATS.map(s => (
                        <div key={s.label} className="stat-card">
                            <div className="stat-value">{s.value}</div>
                            <div className="stat-label">{s.label}</div>
                            {s.trend && (
                                <div className={`stat-trend${s.warn ? ' warn' : ''}`}>{s.trend}</div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="dashboard-panel">
                    <h2 className="section-title">Recent Activity</h2>
                    <div className="activity-list">
                        {ACTIVITY.map((item, i) => (
                            <div key={i} className="activity-item">
                                <div className={`activity-dot type-${item.type}`} />
                                <span className="activity-text">{item.text}</span>
                                <span className="activity-time">{item.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
