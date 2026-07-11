import { useState, useEffect } from 'react';
import './HelpCenter.css';

const STEPS = [
    {
        id: 'branding',
        title: 'Customize Branding',
        desc: 'Upload your logo and pick brand colors so your hub feels like your firm.',
        nav: 'Settings', sub: 'General',
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>,
    },
    {
        id: 'case-types',
        title: 'Manage Case Types and Categories',
        desc: 'Define the case types and categories your team works with every day.',
        nav: 'Settings', sub: 'Advanced Settings',
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
    },
    {
        id: 'auto-assign',
        title: 'Auto-Assign Staff to Cases',
        desc: 'Set rules that automatically route new cases to the right staff members.',
        nav: 'Settings', sub: 'Automations',
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>,
    },
    {
        id: 'client-profile',
        title: 'Manage Client Profile Information',
        desc: 'Choose which fields you collect and display on client profiles.',
        nav: 'Settings', sub: 'Custom Fields',
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    },
    {
        id: 'intake-form',
        title: 'Create Custom Intake Form',
        desc: 'Build the intake form new clients fill out when they reach out to you.',
        nav: 'Settings', sub: 'User Intake',
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    },
    {
        id: 'bootstrap',
        title: 'Bootstrap Cases with Automated Actions',
        desc: 'Attach tasks, notes, and forms that fire automatically when a case opens.',
        nav: 'Settings', sub: 'Automations',
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    },
];

const STORAGE_KEY = 'ca-onboarding-done';

const loadDone = () => {
    try { return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY)) || []); }
    catch { return new Set(); }
};

const Ring = ({ done, total, size = 34, stroke = 3.5 }) => {
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const pct = total === 0 ? 0 : done / total;
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="hc-ring">
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E2E8F0" strokeWidth={stroke} />
            <circle
                cx={size / 2} cy={size / 2} r={r} fill="none"
                stroke={pct === 1 ? '#059669' : 'var(--accent)'} strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={c}
                strokeDashoffset={c * (1 - pct)}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                style={{ transition: 'stroke-dashoffset 0.4s ease' }}
            />
            <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" className="hc-ring-text">
                {done}/{total}
            </text>
        </svg>
    );
};

const CheckCircle = () => (
    <span className="ob-step-status done">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
    </span>
);

const HelpCenter = ({ onNavigate, onActivity }) => {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [done, setDone] = useState(loadDone);
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...done]));
    }, [done]);

    useEffect(() => {
        if (!popoverOpen && !drawerOpen) return;
        const onKey = (e) => {
            if (e.key === 'Escape') { setPopoverOpen(false); setDrawerOpen(false); }
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [popoverOpen, drawerOpen]);

    const remaining = STEPS.length - done.size;
    const allDone = remaining === 0;

    const openDrawer = () => {
        setPopoverOpen(false);
        setDrawerOpen(true);
        setExpanded(STEPS.find(s => !done.has(s.id))?.id ?? null);
        onActivity?.();
    };

    const goToStep = (step) => {
        setDone(prev => new Set([...prev, step.id]));
        setDrawerOpen(false);
        onNavigate(step.nav, step.sub);
    };

    return (
        <>
            {/* ── Floating launcher ── */}
            <div className="hc-launcher">
                {!allDone && (
                    <button className="hc-setup-pill" onClick={openDrawer}>
                        <Ring done={done.size} total={STEPS.length} size={30} stroke={3} />
                        <span className="hc-setup-pill-text">
                            <span className="hc-setup-pill-title">Setup guide</span>
                            <span className="hc-setup-pill-sub">{`${remaining} step${remaining > 1 ? 's' : ''} left`}</span>
                        </span>
                    </button>
                )}
                <button
                    className={`hc-fab${popoverOpen ? ' active' : ''}`}
                    onClick={() => { setPopoverOpen(p => !p); onActivity?.(); }}
                    aria-label="Support Center"
                >
                    {popoverOpen ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3"/></svg>
                    )}
                </button>
            </div>

            {/* ── Support popover ── */}
            {popoverOpen && <div className="hc-popover-backdrop" onClick={() => setPopoverOpen(false)} />}
            {popoverOpen && (
                <div className="hc-popover">
                    <div className="hc-popover-header">
                        <p className="hc-popover-kicker">Support Center</p>
                        <h3 className="hc-popover-title">How can we help?</h3>
                    </div>
                    <div className="hc-popover-list">
                        <button className="hc-item" onClick={openDrawer}>
                            <span className="hc-item-chip teal">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                            </span>
                            <span className="hc-item-body">
                                <span className="hc-item-title">Setup guide</span>
                                <span className="hc-item-desc">{allDone ? 'Everything is set up.' : `${remaining} of ${STEPS.length} steps remaining`}</span>
                                {!allDone && (
                                    <span className="hc-item-progress">
                                        <span className="hc-item-progress-fill" style={{ width: `${(done.size / STEPS.length) * 100}%` }} />
                                    </span>
                                )}
                            </span>
                            <svg className="hc-item-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                        </button>
                        <button className="hc-item" onClick={openDrawer}>
                            <span className="hc-item-chip violet">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>
                            </span>
                            <span className="hc-item-body">
                                <span className="hc-item-title">Tour</span>
                                <span className="hc-item-desc">Explore the features, unlock the potential.</span>
                            </span>
                            <svg className="hc-item-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                        </button>
                        <button className="hc-item" onClick={() => setPopoverOpen(false)}>
                            <span className="hc-item-chip indigo">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                            </span>
                            <span className="hc-item-body">
                                <span className="hc-item-title">Docs</span>
                                <span className="hc-item-desc">Your guide to getting things done.</span>
                            </span>
                            <svg className="hc-item-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                        </button>
                        <button className="hc-item" onClick={() => { setPopoverOpen(false); window.location.href = 'mailto:support@caseactive.com'; }}>
                            <span className="hc-item-chip amber">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                            </span>
                            <span className="hc-item-body">
                                <span className="hc-item-title">Contact Us</span>
                                <span className="hc-item-desc">We're here to help, reach out anytime.</span>
                            </span>
                            <svg className="hc-item-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                        </button>
                    </div>
                    <div className="hc-popover-footer">
                        Average reply time: under 2 hours
                    </div>
                </div>
            )}

            {/* ── Onboarding drawer ── */}
            {drawerOpen && (
                <div className="ob-overlay" onClick={() => setDrawerOpen(false)}>
                    <aside className="ob-drawer" onClick={e => e.stopPropagation()}>
                        <div className="ob-header">
                            <div className="ob-header-top">
                                <p className="ob-kicker">Setup guide</p>
                                <button className="ob-close" onClick={() => setDrawerOpen(false)} aria-label="Close">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                </button>
                            </div>
                            <div className="ob-header-main">
                                <div>
                                    <h2 className="ob-title">{allDone ? "You're all set!" : "Let's get you set up"}</h2>
                                    <p className="ob-subtitle">
                                        {allDone
                                            ? 'Every step is complete. Your hub is ready for clients.'
                                            : 'Complete these steps to get the most out of your hub.'}
                                    </p>
                                </div>
                                <Ring done={done.size} total={STEPS.length} size={52} stroke={5} />
                            </div>
                            <div className="ob-progress-bar">
                                <div className="ob-progress-fill" style={{ width: `${(done.size / STEPS.length) * 100}%` }} />
                            </div>
                        </div>

                        <div className="ob-steps">
                            {STEPS.map((step, i) => {
                                const isDone = done.has(step.id);
                                const isOpen = expanded === step.id;
                                return (
                                    <div key={step.id} className={`ob-step${isDone ? ' done' : ''}${isOpen ? ' open' : ''}`}>
                                        <button className="ob-step-head" onClick={() => setExpanded(isOpen ? null : step.id)}>
                                            {isDone ? <CheckCircle /> : <span className="ob-step-status">{i + 1}</span>}
                                            <span className="ob-step-title">{step.title}</span>
                                            <svg className="ob-step-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                                        </button>
                                        {isOpen && (
                                            <div className="ob-step-body">
                                                <p className="ob-step-desc">{step.desc}</p>
                                                <div className="ob-step-actions">
                                                    <button className="ob-step-go" onClick={() => goToStep(step)}>
                                                        {step.icon}
                                                        Take me there
                                                    </button>
                                                    {!isDone && (
                                                        <button className="ob-step-skip" onClick={() => setDone(prev => new Set([...prev, step.id]))}>
                                                            Mark as done
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="ob-footer">
                            <button className="ob-skip-link" onClick={() => setDrawerOpen(false)}>
                                {allDone ? 'Close' : 'Skip for now'}
                            </button>
                            <span className="ob-footer-count">{done.size} of {STEPS.length} completed</span>
                        </div>
                    </aside>
                </div>
            )}
        </>
    );
};

export default HelpCenter;
