const NAV_ITEMS = ['Dashboard', 'My Cases', 'Tasks', 'Clients', 'Settings'];

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

const StaffDashboard = ({ prefill, onExit }) => {
    const firmName  = prefill?.firmName  ?? 'Demo Law Firm';
    const fullName  = prefill?.fullName  ?? 'Casey Staff';
    const firstName = fullName.split(' ')[0];

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

                <div className="dashboard-grid-2">
                    <div className="dashboard-panel">
                        <h2 className="section-title">My Tasks</h2>
                        <div className="task-list">
                            {TASKS.map((task, i) => (
                                <div key={i} className="task-item">
                                    <div className={`task-priority priority-${task.priority}`} />
                                    <div className="task-body">
                                        <span className="task-text">{task.text}</span>
                                        <span className={`task-due${task.due === 'Today' ? ' urgent' : ''}`}>
                                            Due: {task.due}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="dashboard-panel">
                        <h2 className="section-title">Upcoming</h2>
                        <div className="event-list">
                            {EVENTS.map((e, i) => (
                                <div key={i} className="event-item">
                                    <div className="event-dot" />
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
                    <h2 className="section-title">My Cases</h2>
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
