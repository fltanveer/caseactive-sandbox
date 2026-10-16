/* Layout pieces for the Misc component reference. */

import { useState } from 'react';

/* Copy a link to the clipboard; fall back to a prompt where the clipboard
   is blocked (http, some embedded browsers). */
const copyLink = (url) => {
    if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(url).then(() => true, () => { window.prompt('Copy this link', url); return false; });
    window.prompt('Copy this link', url);
    return Promise.resolve(false);
};

const miscUrl = (section) => `${window.location.origin}/misc${section ? `?section=${section}` : ''}`;

const LinkIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
);

export const CopyLinkButton = ({ section, label, className = '' }) => {
    const [copied, setCopied] = useState(false);
    const copy = () => copyLink(miscUrl(section)).then(ok => {
        if (!ok) return;
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
    });
    return (
        <button type="button" className={`misc-copy${label ? ' has-label' : ''}${copied ? ' is-copied' : ''} ${className}`} onClick={copy}
            aria-label={label ? undefined : 'Copy link to this section'} title={label ? undefined : 'Copy link to this section'}>
            <LinkIcon />
            {label && <span>{copied ? 'Link copied' : label}</span>}
            {!label && copied && <span className="misc-copy-tip">Copied</span>}
        </button>
    );
};

export const Section = ({ id, title, desc, children }) => (
    <section className="misc-section" id={`misc-${id}`} aria-labelledby={`misc-${id}-title`}>
        <div className="misc-section-header">
            <div className="misc-section-titlerow">
                <h3 className="misc-section-title" id={`misc-${id}-title`}>{title}</h3>
                <CopyLinkButton section={id} />
            </div>
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
