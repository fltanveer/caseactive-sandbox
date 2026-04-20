const ROLE_CONFIG = {
    admin:  { label: 'Admin',  color: '#1E7B6E' },
    staff:  { label: 'Staff',  color: '#D97706' },
    client: { label: 'Client', color: '#2563EB' },
};

const DemoBanner = ({ demoRole, onExit }) => {
    const badge = ROLE_CONFIG[demoRole] ?? { label: demoRole, color: '#555' };

    return (
        <div className="demo-banner">
            <span className="demo-banner-left">
                <span className="demo-banner-label">Viewing as:</span>
                <span className="demo-banner-badge" style={{ background: badge.color }}>
                    {badge.label}
                </span>
            </span>
            <button className="demo-banner-exit" onClick={onExit}>Exit demo</button>
        </div>
    );
};

export default DemoBanner;
