import { useState } from 'react';

const NAV_ITEMS = [
    { label: 'Dashboard', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
    { label: 'Cases', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> },
    { label: 'Clients', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
    { label: 'Staff', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg> },
    { label: 'Settings', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
];

const STATS = [
    { label: 'Active Cases',     value: '12', trend: '+2 this week',   warn: false, icon: 'case', color: 'teal' },
    { label: 'Clients',          value: '8',  trend: '+1 this week',   warn: false, icon: 'client', color: 'blue' },
    { label: 'Staff',            value: '3',  trend: null,             warn: false, icon: 'staff', color: 'amber' },
    { label: 'Pending Reviews',  value: '2',  trend: 'Action needed',  warn: true,  icon: 'review', color: 'red' },
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

const CLIENTS = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah.j@email.com', cases: 2, status: 'Active', joined: 'Jan 2025', lastActive: '2h ago' },
    { id: 2, name: 'Marcus Lee', email: 'marcus.lee@email.com', cases: 1, status: 'Active', joined: 'Feb 2025', lastActive: '4h ago' },
    { id: 3, name: 'Emily Martinez', email: 'emily.m@email.com', cases: 3, status: 'Active', joined: 'Dec 2024', lastActive: 'Yesterday' },
    { id: 4, name: 'James Wilson', email: 'james.w@email.com', cases: 1, status: 'Inactive', joined: 'Mar 2025', lastActive: '2 days ago' },
    { id: 5, name: 'Lisa Chen', email: 'lisa.chen@email.com', cases: 2, status: 'Active', joined: 'Jan 2025', lastActive: '3 days ago' },
    { id: 6, name: 'Robert Taylor', email: 'robert.t@email.com', cases: 1, status: 'Active', joined: 'Nov 2024', lastActive: '1 week ago' },
    { id: 7, name: 'Amanda Brown', email: 'amanda.b@email.com', cases: 2, status: 'Active', joined: 'Apr 2025', lastActive: '2 days ago' },
    { id: 8, name: 'David Kim', email: 'david.kim@email.com', cases: 1, status: 'Inactive', joined: 'Feb 2025', lastActive: '5 days ago' },
];

const STAFF = [
    { id: 1, name: 'Casey Staff', email: 'casey@demolaw.com', role: 'Paralegal', status: 'Active', joined: 'Nov 2024', lastActive: '1h ago' },
    { id: 2, name: 'Alex Morgan', email: 'alex@demolaw.com', role: 'Attorney', status: 'Active', joined: 'Dec 2024', lastActive: '3h ago' },
    { id: 3, name: 'Jordan Admin', email: 'jordan@demolaw.com', role: 'Admin', status: 'Active', joined: 'Oct 2024', lastActive: 'Just now' },
];

const STATUS_COLORS = {
    'Active': '#149EB1',
    'Settlement': '#2563EB',
    'Discovery': '#D97706',
    'Review': '#7C3AED',
};

const ActivityIcon = ({ type }) => {
    const icons = {
        update: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
        client: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>,
        doc: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
        review: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
        settings: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    };
    return <div className={`activity-icon-wrap type-${type}`}>{icons[type]}</div>;
};

const StatIcon = ({ type, color }) => {
    const icons = {
        case: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
        client: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
        staff: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>,
        review: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    };
    return <div className={`stat-icon-wrap ${color}`}>{icons[type]}</div>;
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

        if (activeNav === 'Clients') {
            return (
                <div className="dashboard-panel">
                    <h2 className="section-title">All Clients</h2>
                    <div className="cases-data-grid">
                        <table className="cases-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Cases</th>
                                    <th>Status</th>
                                    <th>Joined</th>
                                    <th>Last Active</th>
                                </tr>
                            </thead>
                            <tbody>
                                {CLIENTS.map(c => (
                                    <tr key={c.id}>
                                        <td className="case-client">{c.name}</td>
                                        <td className="case-name">{c.email}</td>
                                        <td className="case-opened">{c.cases}</td>
                                        <td>
                                            <span className="case-status" style={{ backgroundColor: `${STATUS_COLORS[c.status]}20`, color: STATUS_COLORS[c.status] }}>
                                                {c.status}
                                            </span>
                                        </td>
                                        <td className="case-opened">{c.joined}</td>
                                        <td className="case-update">{c.lastActive}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }

        if (activeNav === 'Staff') {
            return (
                <div className="dashboard-panel">
                    <h2 className="section-title">All Staff</h2>
                    <div className="cases-data-grid">
                        <table className="cases-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Joined</th>
                                    <th>Last Active</th>
                                </tr>
                            </thead>
                            <tbody>
                                {STAFF.map(s => (
                                    <tr key={s.id}>
                                        <td className="case-client">{s.name}</td>
                                        <td className="case-name">{s.email}</td>
                                        <td className="case-opened">{s.role}</td>
                                        <td>
                                            <span className="case-status" style={{ backgroundColor: `${STATUS_COLORS[s.status]}20`, color: STATUS_COLORS[s.status] }}>
                                                {s.status}
                                            </span>
                                        </td>
                                        <td className="case-opened">{s.joined}</td>
                                        <td className="case-update">{s.lastActive}</td>
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
                            <div className="stat-card-top">
                                <StatIcon type={s.icon} color={s.color} />
                            </div>
                            <div className="stat-value">{s.value}</div>
                            <div className="stat-label">{s.label}</div>
                            {s.trend && (
                                <div className={`stat-trend${s.warn ? ' warn' : ''}`}>
                                    {s.warn ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>}
                                    {s.trend}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="dashboard-panel">
                    <h2 className="section-title">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                        Recent Activity
                    </h2>
                    <div className="activity-list">
                        {ACTIVITY.map((item, i) => (
                            <div key={i} className="activity-item">
                                <ActivityIcon type={item.type} />
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
                            key={item.label} 
                            className={`dashboard-nav-item${activeNav === item.label ? ' active' : ''}`}
                            onClick={() => setActiveNav(item.label)}
                        >
                            {item.icon}
                            {item.label}
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