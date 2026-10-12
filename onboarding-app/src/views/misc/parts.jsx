/* Layout pieces for the Misc component reference. */

export const Section = ({ id, title, desc, children }) => (
    <section className="misc-section" id={`misc-${id}`} aria-labelledby={`misc-${id}-title`}>
        <div className="misc-section-header">
            <h3 className="misc-section-title" id={`misc-${id}-title`}>{title}</h3>
            {desc && <p className="misc-section-desc">{desc}</p>}
        </div>
        <div className="misc-section-body">{children}</div>
    </section>
);

export const Sub = ({ title, note, children }) => (
    <div className="misc-sub">
        <div className="misc-sub-head">
            <h4 className="misc-sub-title">{title}</h4>
            {note && <p className="misc-sub-note">{note}</p>}
        </div>
        {children}
    </div>
);

export const Specimen = ({ label, children }) => (
    <div className="misc-spec">
        <span className="misc-spec-label">{label}</span>
        {children}
    </div>
);
