import { useState } from 'react';

const NAV_ITEMS = [
    { label: 'Dashboard', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
    { label: 'My Cases', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> },
    { label: 'Tasks', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> },
    { label: 'Clients', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
    { label: 'Settings', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
];

const STATS = [
    { label: 'My Cases', value: '3', color: 'teal', icon: 'case' },
    { label: 'Open Tasks', value: '3', color: 'amber', icon: 'task' },
    { label: 'Clients', value: '5', color: 'blue', icon: 'client' },
];

const TASKS = [
    { text: 'Follow up with Johnson on settlement offer',  due: 'Today',      priority: 'high'   },
    { text: 'Upload medical records for Lee case',         due: 'Tomorrow',   priority: 'medium' },
    { text: 'Schedule deposition for Martinez case',       due: 'This week',  priority: 'low'    },
];

const EVENTS = [
    { title: 'Client intake call — Alex Demo',  time: 'Today, 2:00 PM'      },
    { title: 'Deposition prep — Martinez',      time: 'Tomorrow, 10:00 AM'  },
    { title: 'Team standup',                    time: 'Daily, 9:00 AM'      },
];

const CASES = [
    { name: 'Johnson v. Regional Health', status: 'Settlement',   type: 'success' },
    { name: 'Lee v. City Transit',        status: 'Investigation', type: 'active'  },
    { name: 'Martinez v. Regional Health', status: 'Intake',      type: 'pending' },
];

const StatIcon = ({ type, color }) => {
    const icons = {
        case: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
        client: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
        task: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
    };
    return <div className={`stat-icon-wrap ${color}`}>{icons[type]}</div>;
};

const StaffDashboard = ({ prefill, onExit }) => {
    const firmName  = prefill?.firmName  ?? 'Demo Law Firm';
    const fullName  = prefill?.fullName  ?? 'Casey Staff';
    const firstName = fullName.split(' ')[0];
    const [activeNav, setActiveNav] = useState('Dashboard');

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
                            <div className="dashboard-user-role">Staff · {firmName}</div>
                        </div>
                    </div>
                </div>
            </aside>

            <main className="dashboard-main">
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-greeting">Hi, {firstName} 👋</h1>
                        <p className="dashboard-subheading">{firmName} · Paralegal</p>
                    </div>
                    <button className="demo-exit-btn" onClick={onExit}>Exit demo</button>
                </div>

                <div className="stats-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    {STATS.map(s => (
                        <div key={s.label} className="stat-card">
                            <div className="stat-card-top">
                                <StatIcon type={s.icon} color={s.color} />
                            </div>
                            <div className="stat-value">{s.value}</div>
                            <div className="stat-label">{s.label}</div>
                        </div>
                    ))}
                </div>

                <div className="dashboard-grid-2">
                    <div className="dashboard-panel">
                        <h2 className="section-title">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                            My Tasks
                        </h2>
                        <div className="task-list">
                            {TASKS.map((task, i) => (
                                <div key={i} className="task-item">
                                    <div className={`task-priority priority-${task.priority}`} />
                                    <div className="task-body">
                                        <span className="task-text">{task.text}</span>
                                        <span className={`task-due${task.due === 'Today' ? ' urgent' : ''}`}>
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                            Due: {task.due}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="dashboard-panel">
                        <h2 className="section-title">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                            Upcoming
                        </h2>
                        <div className="event-list">
                            {EVENTS.map((e, i) => (
                                <div key={i} className="event-item">
                                    <div className="event-icon-wrap">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                    </div>
                                    <div>
                                        <div className="event-title">{e.title}</div>
                                        <div className="event-time">{e.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="dashboard-panel">
                    <h2 className="section-title">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                        My Cases
                    </h2>
                    <div className="case-list">
                        {CASES.map((c, i) => (
                            <div key={i} className="case-item">
                                <span className="case-name">{c.name}</span>
                                <span className={`case-status-badge status-${c.type}`}>{c.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StaffDashboard;