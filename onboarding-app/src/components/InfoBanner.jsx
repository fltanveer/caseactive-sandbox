import { useState } from 'react';
import './InfoBanner.css';

const InfoBanner = ({ message }) => {
    const [open, setOpen] = useState(true);
    if (!open) return null;
    return (
        <div className="hubs-info-banner">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#149EB1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p className="hubs-info-text">{message}</p>
            <button className="hubs-info-close" onClick={() => setOpen(false)} aria-label="Dismiss">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>
    );
};

export default InfoBanner;
