import { useState } from 'react';

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

const CASES = [
    { id: 1, client: 'Sarah Johnson', case: 'Johnson v. City Transit', status: 'Settlement', opened: 'Jan 2025', lastUpdate: '2h ago' },
    { id: 2, client: 'Marcus Lee', case: 'Lee v. Metro Health', status: 'Discovery', opened: 'Feb 2025', lastUpdate: '4h ago' },
    { id: 3, client: 'Emily Martinez', case: 'Martinez v. Regional Health', status: 'Review', opened: 'Dec 2024', lastUpdate: 'Yesterday' },
    { id: 4, client: 'James Wilson', case: 'Wilson v. ABC Corp', status: 'Active', opened: 'Mar 2025', lastUpdate: '2 days ago' },
    { id: 5, client: 'Lisa Chen', case: 'Chen v. XYZ Industries', status: 'Discovery', opened: 'Jan 2025', lastUpdate: '3 days ago' },
    { id: 6, client: 'Robert Taylor', case: 'Taylor v. Quick Delivery', status: 'Settlement', opened: 'Nov 2024', lastUpdate: '1 week ago' },
    { id: 7, client: 'Amanda Brown', case: 'Brown v. City Bus Line', status: 'Active', opened: 'Apr 2025', lastUpdate: '2 days ago' },
    { id: 8, client: 'David Kim', case: 'Kim v. State Hospital', status: 'Review', opened: 'Feb 2025', lastUpdate: '5 days ago' },
];

const STATUS_COLORS = {
    'Active': '#149EB1',
    'Settlement': '#2563EB',
    'Discovery': '#D97706',
    'Review': '#7C3AED',
};

const AdminDashboard = ({ prefill, onExit }) => {
    const firmName  = prefill?.firmName  ?? 'Demo Law Firm';
    const fullName  = prefill?.fullName  ?? 'Jordan Admin';
    const firstName = fullName.split(' ')[0];
    const portalSlug = firmName.toLowerCase().replace(/\s+/g, '');
    const [activeNav, setActiveNav] = useState('Dashboard');

    const renderContent = () => {
        if (activeNav === 'Cases') {
            return (
                <div className="dashboard-panel">
                    <h2 className="section-title">All Cases</h2>
                    <div className="cases-data-grid">
                        <table className="cases-table">
                            <thead>
                                <tr>
                                    <th>Client</th>
                                    <th>Case</th>
                                    <th>Status</th>
                                    <th>Opened</th>
                                    <th>Last Update</th>
                                </tr>
                            </thead>
                            <tbody>
                                {CASES.map(c => (
                                    <tr key={c.id}>
                                        <td className="case-client">{c.client}</td>
                                        <td className="case-name">{c.case}</td>
                                        <td>
                                            <span className="case-status" style={{ backgroundColor: `${STATUS_COLORS[c.status]}20`, color: STATUS_COLORS[c.status] }}>
                                                {c.status}
                                            </span>
                                        </td>
                                        <td className="case-opened">{c.opened}</td>
                                        <td className="case-update">{c.lastUpdate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }

        return (
            <>
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
            </>
        );
    };

    return (
        <div className="dashboard-shell">
            <aside className="dashboard-sidebar">
                <div className="dashboard-logo">
                    <img src="/assets/images/logo.svg" alt="CaseActive" style={{ height: 24, width: 'auto' }} />
                </div>
                <nav className="dashboard-nav">
                    {NAV_ITEMS.map((item) => (
                        <button 
                            key={item} 
                            className={`dashboard-nav-item${activeNav === item ? ' active' : ''}`}
                            onClick={() => setActiveNav(item)}
                        >
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

                {activeNav === 'Dashboard' && (
                    <div className="portal-live-banner">
                        <span className="portal-live-dot" />
                        <span>
                            Your portal is live at{' '}
                            <strong>demo.caseactive.com/{portalSlug}</strong>
                        </span>
                    </div>
                )}

                {renderContent()}
            </main>
        </div>
    );
};

export default AdminDashboard;
