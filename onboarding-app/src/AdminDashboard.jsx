import { useState } from 'react';
import './PortalDashboard.css';

const NAV_ITEMS = [
    {
        label: 'Dashboard',
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    },
    {
        label: 'Cases',
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
    },
    {
        label: 'Clients',
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    },
    {
        label: 'Staff',
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>,
    },
    {
        label: 'Settings',
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    },
];

const STATS = [
    { label: 'Active Cases',    value: '12', delta: '+2 this week',  type: 'case',   color: '#149EB1' },
    { label: 'Clients',         value: '8',  delta: '+1 this week',  type: 'client', color: '#2563EB' },
    { label: 'Staff',           value: '3',  delta: null,            type: 'staff',  color: '#D97706' },
    { label: 'Pending Reviews', value: '2',  delta: 'Action needed', type: 'review', color: '#EF4444' },
];

const ACTIVITY = [
    { text: "Sarah Johnson's case moved to Settlement",      time: '2h ago',     type: 'update'   },
    { text: 'New client Marcus Lee added by Casey Staff',    time: '4h ago',     type: 'client'   },
    { text: 'Document uploaded: Medical Report Q3',          time: 'Yesterday',  type: 'doc'      },
    { text: 'Review requested: Martinez v. Regional Health', time: 'Yesterday',  type: 'review'   },
    { text: 'Portal customization updated',                  time: '3 days ago', type: 'settings' },
];

const CASES = [
    { id: 1, client: 'Sarah Johnson',  case: 'Johnson v. City Transit',       status: 'Settlement', opened: 'Jan 2025', lastUpdate: '2h ago'    },
    { id: 2, client: 'Marcus Lee',     case: 'Lee v. Metro Health',            status: 'Discovery',  opened: 'Feb 2025', lastUpdate: '4h ago'    },
    { id: 3, client: 'Emily Martinez', case: 'Martinez v. Regional Health',    status: 'Review',     opened: 'Dec 2024', lastUpdate: 'Yesterday' },
    { id: 4, client: 'James Wilson',   case: 'Wilson v. ABC Corp',             status: 'Active',     opened: 'Mar 2025', lastUpdate: '2 days ago'},
    { id: 5, client: 'Lisa Chen',      case: 'Chen v. XYZ Industries',         status: 'Discovery',  opened: 'Jan 2025', lastUpdate: '3 days ago'},
    { id: 6, client: 'Robert Taylor',  case: 'Taylor v. Quick Delivery',       status: 'Settlement', opened: 'Nov 2024', lastUpdate: '1 week ago'},
    { id: 7, client: 'Amanda Brown',   case: 'Brown v. City Bus Line',         status: 'Active',     opened: 'Apr 2025', lastUpdate: '2 days ago'},
    { id: 8, client: 'David Kim',      case: 'Kim v. State Hospital',          status: 'Review',     opened: 'Feb 2025', lastUpdate: '5 days ago'},
];

const CLIENTS = [
    { id: 1, name: 'Sarah Johnson',  email: 'sarah.j@email.com',    cases: 2, status: 'Active',   joined: 'Jan 2025', lastActive: '2h ago'    },
    { id: 2, name: 'Marcus Lee',     email: 'marcus.lee@email.com', cases: 1, status: 'Active',   joined: 'Feb 2025', lastActive: '4h ago'    },
    { id: 3, name: 'Emily Martinez', email: 'emily.m@email.com',    cases: 3, status: 'Active',   joined: 'Dec 2024', lastActive: 'Yesterday' },
    { id: 4, name: 'James Wilson',   email: 'james.w@email.com',    cases: 1, status: 'Inactive', joined: 'Mar 2025', lastActive: '2 days ago'},
    { id: 5, name: 'Lisa Chen',      email: 'lisa.chen@email.com',  cases: 2, status: 'Active',   joined: 'Jan 2025', lastActive: '3 days ago'},
    { id: 6, name: 'Robert Taylor',  email: 'robert.t@email.com',   cases: 1, status: 'Active',   joined: 'Nov 2024', lastActive: '1 week ago'},
    { id: 7, name: 'Amanda Brown',   email: 'amanda.b@email.com',   cases: 2, status: 'Active',   joined: 'Apr 2025', lastActive: '2 days ago'},
    { id: 8, name: 'David Kim',      email: 'david.kim@email.com',  cases: 1, status: 'Inactive', joined: 'Feb 2025', lastActive: '5 days ago'},
];

const STAFF = [
    { id: 1, name: 'Casey Staff',  email: 'casey@demolaw.com',  role: 'Paralegal', status: 'Active', joined: 'Nov 2024', lastActive: '1h ago'   },
    { id: 2, name: 'Alex Morgan',  email: 'alex@demolaw.com',   role: 'Attorney',  status: 'Active', joined: 'Dec 2024', lastActive: '3h ago'   },
    { id: 3, name: 'Jordan Admin', email: 'jordan@demolaw.com', role: 'Admin',     status: 'Active', joined: 'Oct 2024', lastActive: 'Just now' },
];

const STATUS_COLOR = {
    'Active':     '#149EB1',
    'Settlement': '#2563EB',
    'Discovery':  '#D97706',
    'Review':     '#7C3AED',
    'Inactive':   '#94A3B8',
};

const CHART_DATA = [
    { date: '04/22', views: 0, cases: 0 },
    { date: '04/23', views: 1, cases: 0 },
    { date: '04/24', views: 5, cases: 1 },
    { date: '04/25', views: 2, cases: 0 },
    { date: '04/26', views: 1, cases: 0 },
    { date: '04/27', views: 1, cases: 0 },
    { date: '04/28', views: 1, cases: 0 },
    { date: '04/29', views: 1, cases: 1 },
];

const StatIcon = ({ type, color }) => {
    const icons = {
        case:   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
        client: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
        staff:  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>,
        review: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    };
    return <div className="portal-stat-icon-wrap" style={{ background: color + '18', color }}>{icons[type]}</div>;
};

const ActivityIcon = ({ type }) => {
    const map = {
        update:   { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>, color: '#149EB1' },
        client:   { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>, color: '#2563EB' },
        doc:      { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>, color: '#D97706' },
        review:   { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>, color: '#7C3AED' },
        settings: { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>, color: '#94A3B8' },
    };
    const { icon, color } = map[type] || map.settings;
    return <div className="portal-activity-icon-wrap" style={{ background: color + '15', color }}>{icon}</div>;
};

const MiniChart = () => {
    const W = 600, H = 120, PAD = 20;
    const maxV = 5;
    const pts = (key) => CHART_DATA.map((d, i) => {
        const x = PAD + (i / (CHART_DATA.length - 1)) * (W - PAD * 2);
        const y = H - PAD - (d[key] / maxV) * (H - PAD * 2);
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            <defs>
                <linearGradient id="adGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#149EB1" stopOpacity="0.18"/>
                    <stop offset="100%" stopColor="#149EB1" stopOpacity="0"/>
                </linearGradient>
                <linearGradient id="adLightGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#9CA3AF" stopOpacity="0.15"/>
                    <stop offset="100%" stopColor="#9CA3AF" stopOpacity="0"/>
                </linearGradient>
            </defs>
            {[0,1,2,3,4,5].map(v => {
                const y = H - PAD - (v / maxV) * (H - PAD * 2);
                return <line key={v} x1={PAD} y1={y} x2={W - PAD} y2={y} stroke="#F3F4F6" strokeWidth="1"/>;
            })}
            <polygon points={`${PAD},${H - PAD} ${pts('views')} ${W - PAD},${H - PAD}`} fill="url(#adGrad)"/>
            <polyline points={pts('views')} fill="none" stroke="#149EB1" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
            <polygon points={`${PAD},${H - PAD} ${pts('cases')} ${W - PAD},${H - PAD}`} fill="url(#adLightGrad)"/>
            <polyline points={pts('cases')} fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="5 3"/>
            {CHART_DATA.map((d, i) => {
                const x = PAD + (i / (CHART_DATA.length - 1)) * (W - PAD * 2);
                const y = H - PAD - (d.views / maxV) * (H - PAD * 2);
                return d.views > 0 ? <circle key={i} cx={x} cy={y} r="3.5" fill="#149EB1" stroke="#fff" strokeWidth="1.5"/> : null;
            })}
        </svg>
    );
};

const StatusBadge = ({ status }) => (
    <span style={{
        display: 'inline-flex', alignItems: 'center',
        padding: '3px 10px', borderRadius: 20,
        fontSize: 12, fontWeight: 600,
        background: (STATUS_COLOR[status] || '#94A3B8') + '18',
        color: STATUS_COLOR[status] || '#94A3B8',
    }}>{status}</span>
);

const TH_STYLE = {
    padding: '10px 16px', textAlign: 'left',
    fontSize: 11, fontWeight: 600, letterSpacing: '0.07em',
    color: '#9CA3AF', textTransform: 'uppercase',
    background: '#FAFAFA', borderBottom: '1px solid #E2E8F0',
};
const TD_STYLE = {
    padding: '12px 16px', fontSize: 13,
    color: 'var(--text-primary)', borderBottom: '1px solid #F3F4F6',
};

const AdminDashboard = ({ prefill, onExit }) => {
    const firmName  = prefill?.firmName  ?? 'Demo Law Firm';
    const fullName  = prefill?.fullName  ?? 'Jordan Admin';
    const firstName = fullName.split(' ')[0];

    const [activeNav, setActiveNav] = useState('Dashboard');
    const [profileOpen, setProfileOpen] = useState(false);

    const renderContent = () => {
        if (activeNav === 'Cases') return (
            <div className="portal-content">
                <div className="portal-content-title">
                    <h1 className="portal-page-title">All Cases</h1>
                    <p className="portal-breadcrumb">Cases</p>
                </div>
                <div className="portal-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', minWidth: 600, borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    {['Client','Case','Status','Opened','Last Update'].map(h => (
                                        <th key={h} style={TH_STYLE}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {CASES.map(c => (
                                    <tr key={c.id} style={{ cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background='#FAFAFA'} onMouseLeave={e => e.currentTarget.style.background=''}>
                                        <td style={{ ...TD_STYLE, fontWeight: 600 }}>{c.client}</td>
                                        <td style={{ ...TD_STYLE, color: '#64748B' }}>{c.case}</td>
                                        <td style={TD_STYLE}><StatusBadge status={c.status}/></td>
                                        <td style={{ ...TD_STYLE, color: '#64748B' }}>{c.opened}</td>
                                        <td style={{ ...TD_STYLE, color: '#94A3B8' }}>{c.lastUpdate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );

        if (activeNav === 'Clients') return (
            <div className="portal-content">
                <div className="portal-content-title">
                    <h1 className="portal-page-title">All Clients</h1>
                    <p className="portal-breadcrumb">Clients</p>
                </div>
                <div className="portal-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', minWidth: 720, borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    {['Name','Email','Cases','Status','Joined','Last Active'].map(h => (
                                        <th key={h} style={TH_STYLE}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {CLIENTS.map(c => (
                                    <tr key={c.id} style={{ cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background='#FAFAFA'} onMouseLeave={e => e.currentTarget.style.background=''}>
                                        <td style={{ ...TD_STYLE, fontWeight: 600 }}>{c.name}</td>
                                        <td style={{ ...TD_STYLE, color: '#64748B' }}>{c.email}</td>
                                        <td style={{ ...TD_STYLE, color: '#64748B' }}>{c.cases}</td>
                                        <td style={TD_STYLE}><StatusBadge status={c.status}/></td>
                                        <td style={{ ...TD_STYLE, color: '#64748B' }}>{c.joined}</td>
                                        <td style={{ ...TD_STYLE, color: '#94A3B8' }}>{c.lastActive}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );

        if (activeNav === 'Staff') return (
            <div className="portal-content">
                <div className="portal-content-title">
                    <h1 className="portal-page-title">All Staff</h1>
                    <p className="portal-breadcrumb">Staff</p>
                </div>
                <div className="portal-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', minWidth: 720, borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    {['Name','Email','Role','Status','Joined','Last Active'].map(h => (
                                        <th key={h} style={TH_STYLE}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {STAFF.map(s => (
                                    <tr key={s.id} style={{ cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background='#FAFAFA'} onMouseLeave={e => e.currentTarget.style.background=''}>
                                        <td style={{ ...TD_STYLE, fontWeight: 600 }}>{s.name}</td>
                                        <td style={{ ...TD_STYLE, color: '#64748B' }}>{s.email}</td>
                                        <td style={{ ...TD_STYLE, color: '#64748B' }}>{s.role}</td>
                                        <td style={TD_STYLE}><StatusBadge status={s.status}/></td>
                                        <td style={{ ...TD_STYLE, color: '#64748B' }}>{s.joined}</td>
                                        <td style={{ ...TD_STYLE, color: '#94A3B8' }}>{s.lastActive}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );

        if (activeNav === 'Settings') return (
            <div className="portal-content">
                <div className="portal-content-title">
                    <h1 className="portal-page-title">Settings</h1>
                    <p className="portal-breadcrumb">Settings</p>
                </div>
                <div className="portal-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 40px', gap: 12, color: '#94A3B8' }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                    <p style={{ margin: 0, fontSize: 14 }}>Settings coming soon</p>
                </div>
            </div>
        );

        // Dashboard
        const statBars = [
            { label: 'Active Cases',    value: '12', pct: 60 },
            { label: 'Clients',         value: '8',  pct: 40 },
            { label: 'Staff',           value: '3',  pct: 15 },
            { label: 'Pending Reviews', value: '2',  pct: 10 },
        ];

        return (
            <div className="portal-content">
                <div className="portal-content-title">
                    <h1 className="portal-page-title">Dashboard</h1>
                    <p className="portal-breadcrumb">{firmName} · Admin</p>
                </div>

                {/* Stats */}
                <div className="portal-stats-row">
                    {STATS.map(s => (
                        <div key={s.label} className="portal-stat-card">
                            <StatIcon type={s.type} color={s.color} />
                            <div className="portal-stat-body">
                                <div className="portal-stat-value">{s.value}</div>
                                <div className="portal-stat-label">{s.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Chart + Activity */}
                <div className="portal-grid-2">
                    <div className="portal-card portal-chart-card">
                        <div className="portal-card-header">
                            <h2 className="portal-card-title">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                                Audience Overview
                            </h2>
                            <div className="portal-chart-legend">
                                <span className="legend-dot" style={{ background: '#149EB1' }}/>Views
                                <span className="legend-dot" style={{ background: '#9CA3AF' }}/>Cases
                            </div>
                        </div>
                        <div className="portal-chart-dates">
                            {CHART_DATA.map(d => <span key={d.date}>{d.date}</span>)}
                        </div>
                        <div className="portal-chart-area">
                            <MiniChart />
                        </div>
                    </div>
                    <div className="portal-card">
                        <div className="portal-card-header">
                            <h2 className="portal-card-title">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                Recent Activity
                            </h2>
                            <span className="portal-card-badge">Updated daily</span>
                        </div>
                        <div className="portal-activity-list">
                            {ACTIVITY.map((a, i) => (
                                <div key={i} className="portal-activity-item">
                                    <ActivityIcon type={a.type} />
                                    <span className="portal-activity-text">{a.text}</span>
                                    <span className="portal-activity-time">{a.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* All Stats */}
                <div className="portal-card portal-all-stats">
                    <div className="portal-card-header">
                        <h2 className="portal-card-title">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                            All Statistics
                        </h2>
                        <span className="portal-card-badge">Updated daily</span>
                    </div>
                    <div className="portal-all-stats-grid">
                        {statBars.map(s => (
                            <div key={s.label} className="portal-all-stat-row">
                                <span className="portal-all-stat-label">{s.label}</span>
                                <div className="portal-all-stat-bar-wrap">
                                    <div className="portal-all-stat-bar" style={{ width: `${s.pct}%` }}/>
                                </div>
                                <span className="portal-all-stat-val">{s.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="portal-shell">

            {/* Top bar */}
            <div className="portal-topbar">
                <div className="portal-logo">
                    <img src="/assets/images/logo.svg" alt="CaseActive" style={{ height: 28, width: 'auto' }} />
                </div>
                <div className="portal-topbar-right">
                    <button className="portal-hub-btn">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                        Hub 1
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                    </button>
                    <div className="portal-mode-toggle">
                        <button className="portal-mode-btn active">Admin</button>
                        <button className="portal-mode-btn">Lobby</button>
                    </div>
                    <button className="portal-notif-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                    </button>
                    <div className="portal-profile-wrap">
                        <div className="portal-topbar-profile" onClick={() => setProfileOpen(p => !p)}>
                            <div className="portal-avatar">{firstName[0]}</div>
                            <div className="portal-topbar-profile-info">
                                <div className="portal-user-name">{fullName}</div>
                                <div className="portal-user-role">Administrator</div>
                            </div>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#94A3B8', marginLeft: 2, flexShrink: 0 }}><polyline points="6 9 12 15 18 9"/></svg>
                        </div>
                        {profileOpen && (
                            <div className="portal-profile-dropdown">
                                <button className="portal-profile-option" onClick={() => setProfileOpen(false)}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                    Profile
                                </button>
                                <button className="portal-profile-option" onClick={() => { setProfileOpen(false); setActiveNav('Settings'); }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                                    Settings
                                </button>
                                <button className="portal-profile-option danger" onClick={() => { setProfileOpen(false); onExit(); }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                                    Exit demo
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="portal-body">

                {/* Sidebar */}
                <aside className="portal-sidebar">
                    <nav className="portal-nav">
                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.label}
                                className={`portal-nav-item${activeNav === item.label ? ' active' : ''}`}
                                onClick={() => setActiveNav(item.label)}
                            >
                                <span className="portal-nav-icon">{item.icon}</span>
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>
                    <div className="sidebar-bottom-img">
                        <img
                            src="/assets/images/left-sidebar.svg"
                            alt=""
                        />
                    </div>
                </aside>

                {/* Main */}
                <main className="portal-main" style={{ overflowY: 'auto' }}>
                    {renderContent()}
                </main>

            </div>
        </div>
    );
};

export default AdminDashboard;
