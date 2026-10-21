import { useState } from 'react';
import SearchableSelect from '../components/SearchableSelect';

/* Home → Dashboard: the stats row, the Overview chart and Recent Activity.
   Its own view, out of PortalDashboard, so the design backlog can mount the
   real dashboard rather than a drawing of it. */

const StatIcon = ({ type, color }) => {
    const icons = {
        users: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
        cases: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
        media: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
        inquiries: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    };
    return <div className="portal-stat-icon-wrap" style={{ background: color + '14', color: color }}>{icons[type]}</div>;
};

const ActivityIcon = ({ type }) => {
    const icons = {
        user: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/></svg>,
        case: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
        inquiry: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
        announcement: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    };
    const colors = {
        user: '#149EB1',
        case: '#149EB1',
        inquiry: '#149EB1',
        announcement: '#149EB1',
    };
    return <div className="portal-activity-icon-wrap" style={{ background: colors[type] + '15', color: colors[type] }}>{icons[type]}</div>;
};

const STATS = [
    {
        label: 'Users', value: '32', type: 'users', color: '#149EB1',
        rows: [],
    },
    {
        label: 'Cases', value: '216', type: 'cases', color: '#149EB1',
        rows: [],
    },
    {
        label: 'Media Size', value: '2.43GB', type: 'media', color: '#149EB1',
        rows: [],
    },
    {
        label: 'Inquiries', value: '12', type: 'inquiries', color: '#149EB1', variant: 'inquiries',
        meta: [
            { label: 'Unprocessed', value: '4' },
        ],
        rows: [],
    },
];

const ACTIVITY = [
    { text: 'New user registered',                                  time: '2h ago',     type: 'user' },
    { text: 'Rear End Collision, Downtown LA updated',               time: '4h ago',     type: 'case' },
    { text: 'Inquiry submitted by Alexandra Reyes',                  time: 'Yesterday',  type: 'inquiry' },
    { text: 'Announcement published: Downtown LA Office Has Moved',  time: '2 days ago', type: 'announcement' },
];

const CHART_DATA = [
    { date: '06/16', views: 3, cases: 1 },
    { date: '06/17', views: 5, cases: 2 },
    { date: '06/18', views: 4, cases: 2 },
    { date: '06/19', views: 8, cases: 3 },
    { date: '06/20', views: 4, cases: 2 },
    { date: '06/21', views: 6, cases: 3 },
    { date: '06/22', views: 9, cases: 3 },
    { date: '06/23', views: 5, cases: 2 },
];

const MiniChart = () => {
    const W = 600, H = 120, PAD = 20;
    const maxV = 10;
    const pts = (key) => CHART_DATA.map((d, i) => {
        const x = PAD + (i / (CHART_DATA.length - 1)) * (W - PAD * 2);
        const y = H - PAD - (d[key] / maxV) * (H - PAD * 2);
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            <defs>
                <linearGradient id="darkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#149EB1" stopOpacity="0.18"/>
                    <stop offset="100%" stopColor="#149EB1" stopOpacity="0"/>
                </linearGradient>
                <linearGradient id="lightGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#9CA3AF" stopOpacity="0.15"/>
                    <stop offset="100%" stopColor="#9CA3AF" stopOpacity="0"/>
                </linearGradient>
            </defs>
            {[0,2,4,6,8,10].map(v => {
                const y = H - PAD - (v / maxV) * (H - PAD * 2);
                return <line key={v} x1={PAD} y1={y} x2={W - PAD} y2={y} stroke="#F3F4F6" strokeWidth="1"/>;
            })}
            <polygon
                points={`${PAD},${H - PAD} ${pts('views')} ${W - PAD},${H - PAD}`}
                fill="url(#darkGrad)"
            />
            <polyline points={pts('views')} fill="none" stroke="#149EB1" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
            <polygon
                points={`${PAD},${H - PAD} ${pts('cases')} ${W - PAD},${H - PAD}`}
                fill="url(#lightGrad)"
            />
            <polyline points={pts('cases')} fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="5 3"/>
            {CHART_DATA.map((d, i) => {
                const x = PAD + (i / (CHART_DATA.length - 1)) * (W - PAD * 2);
                const y = H - PAD - (d.views / maxV) * (H - PAD * 2);
                return d.views > 0 ? <circle key={i} cx={x} cy={y} r="3.5" fill="#149EB1" stroke="#fff" strokeWidth="1.5"/> : null;
            })}
        </svg>
    );
};

const DashboardView = () => {
    const [chartMetric, setChartMetric] = useState('Audience');
    const [chartFrom, setChartFrom] = useState('2026-06-17');
    const [chartTo, setChartTo] = useState('2026-06-23');

    return (
        <div className="portal-content">
            {/* Stats */}
            <div className="portal-stats-row">
                {STATS.map(s => (
                    <div key={s.label} className={`portal-stat-card${s.variant === 'inquiries' ? ' portal-stat-card--inquiries' : ''}`}>
                        <div className="portal-stat-card-top">
                            <StatIcon type={s.type} color={s.color} />
                            <div className={`portal-stat-body${s.variant === 'inquiries' ? ' portal-stat-body--inquiries' : ''}`}>
                                <div className="portal-stat-label">{s.label}</div>
                                <div className="portal-stat-number-row">
                                    <div className="portal-stat-value">{s.value}</div>
                                    {s.meta?.map(item => (
                                        <span key={item.label} className={`portal-stat-meta-pill${s.variant === 'inquiries' ? ' portal-stat-meta-pill--large' : ''}`}>
                                            {item.label}
                                            <strong>{item.value}</strong>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {s.rows.length > 0 && (
                            <>
                                <div className="portal-stat-divider" />
                                <div className={`portal-stat-sub-rows${s.label === 'Media Size' ? ' portal-stat-sub-rows--media' : ''}${s.rows.length === 1 ? ' portal-stat-sub-rows--single' : ''}`}>
                                    {s.rows.map(r => (
                                        <div key={r.label} className="portal-stat-sub-row">
                                            <span className="portal-stat-sub-label">{r.label}</span>
                                            <span className="portal-stat-sub-val">{r.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

            {/* Chart + Activity */}
            <div className="portal-grid-2">
                <div className="portal-card portal-chart-card">
                    <div className="portal-card-header portal-chart-header">
                        <h2 className="portal-card-title">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                            Overview
                        </h2>
                        <div className="portal-chart-controls">
                            <SearchableSelect value={chartMetric} onChange={(event) => setChartMetric(event.target.value)} className="portal-chart-select" aria-label="Chart metric">
                                <option>Audience</option>
                                <option>Asset Sizes</option>
                                <option>Invoices</option>
                            </SearchableSelect>
                            <div className="portal-chart-date-controls" aria-label="Chart date range">
                                <input id="chart-from" className="portal-chart-date-input" type="date" value={chartFrom} onChange={(event) => setChartFrom(event.target.value)} aria-label="From date" />
                                <span className="portal-chart-date-separator">to</span>
                                <input id="chart-to" className="portal-chart-date-input" type="date" value={chartTo} onChange={(event) => setChartTo(event.target.value)} aria-label="To date" />
                            </div>
                        </div>
                    </div>
                    <div className="portal-chart-legend">
                        <span><span className="legend-dot" style={{ background: '#149EB1' }}/>Views</span>
                        <span><span className="legend-dot" style={{ background: '#9CA3AF' }}/>Cases</span>
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

        </div>
    );
};

export default DashboardView;
