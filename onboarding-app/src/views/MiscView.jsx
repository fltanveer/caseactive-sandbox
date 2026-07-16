import { useState, useRef } from 'react';
import './MiscView.css';

const SNACKBAR_VARIANTS = [
    {
        type: 'default',
        label: 'Default',
        message: 'This is a neutral snackbar for general messages.',
    },
    {
        type: 'success',
        label: 'Success',
        message: 'Case saved successfully.',
    },
    {
        type: 'error',
        label: 'Error',
        message: 'Failed to save changes. Please try again.',
    },
    {
        type: 'warning',
        label: 'Warning',
        message: 'Your session is about to expire.',
    },
    {
        type: 'info',
        label: 'Info',
        message: 'A new update is available.',
    },
];

const SnackIcon = ({ type }) => {
    switch (type) {
        case 'success':
            return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
        case 'error':
            return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>;
        case 'warning':
            return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
        case 'info':
            return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;
        default:
            return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
    }
};

const MiscView = () => {
    const [snacks, setSnacks] = useState([]);
    const idRef = useRef(0);

    const dismiss = (id) => setSnacks(prev => prev.filter(s => s.id !== id));

    const showSnack = (variant) => {
        const id = ++idRef.current;
        setSnacks(prev => [...prev, { id, ...variant }]);
    };

    return (
        <div className="portal-content misc-content">
            {/* ── Snackbar section ── */}
            <div className="misc-section">
                <div className="misc-section-header">
                    <h3 className="misc-section-title">Snackbar</h3>
                    <p className="misc-section-desc">
                        Contextual feedback messages. Trigger each variant below —
                        snackbars stack at the top right and stay visible until
                        dismissed with the close button.
                    </p>
                </div>
                <div className="misc-section-body">
                    <div className="misc-demo-row">
                        {SNACKBAR_VARIANTS.map(v => (
                            <button
                                key={v.type}
                                className={`misc-snack-btn ${v.type}`}
                                onClick={() => showSnack(v)}
                            >
                                <SnackIcon type={v.type} />
                                {v.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Placeholder for future components ── */}
            <div className="misc-coming-soon">
                More components coming soon — tooltips, badges, empty states…
            </div>

            {/* ── Snackbar host ── */}
            <div className="misc-snack-host">
                {snacks.map(s => (
                    <div key={s.id} className={`misc-snack ${s.type}`}>
                        <span className="misc-snack-icon"><SnackIcon type={s.type} /></span>
                        <span className="misc-snack-msg">{s.message}</span>
                        <button className="misc-snack-close" onClick={() => dismiss(s.id)} aria-label="Dismiss">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MiscView;
