/* eslint-disable react-refresh/only-export-components --
   Shared furniture for the missing-screens tickets (CW-1, AP-1, AC-1, ER-1):
   constants, icons and frames they all draw with. It began as MS-1's,
   hence the folder. Not a component module fast refresh could swap. */

import { useEffect, useRef } from 'react';
import StateBlock from '../../../components/StateBlock';
import StatusPill from '../../../components/StatusPill';
import { CaseFrame, Phone, Proposal } from '../Shell';
import { CaseRightPanel } from '../../LobbyView';
import '../../../components/Button.css';
import './ms.css';

export const FIRM = 'Sterling & Brooks Injury Law';
export const SHORT = 'Sterling & Brooks';
export const CASE = 'Rear-End Collision — Downtown LA';
export const CLIENT = 'Alexandra Reyes';
export const CLIENT_EMAIL = 'alexandra@example.com';
export const ATTORNEY = 'Marcus Bell';
export const ACCOUNT = 'account.caseactive.com';
export const APP = 'sterlingbrooks.app.caseactive.com';

export const PEOPLE = {
    client: [CLIENT, 'Client'],
    staff: [ATTORNEY, 'Staff · Lead Attorney'],
    admin: ['Robert Grant', 'Administrator'],
};

/* ── Icons ──────────────────────────────────────────────────────────────── */
export const Ico = ({ size = 16, w = 2, children, className }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);
export const I = {
    check: <polyline points="20 6 9 17 4 12" />,
    x: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
    down: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>,
    arrowR: <><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>,
    arrowL: <><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></>,
    lock: <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
    alert: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>,
    clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
    pin: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></>,
    video: <><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></>,
    user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
    bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>,
    cal: <><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>,
    copy: <><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>,
    pen: <><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></>,
    upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></>,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    globe: <><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>,
    card: <><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></>,
    bank: <><line x1="3" y1="22" x2="21" y2="22" /><line x1="6" y1="18" x2="6" y2="11" /><line x1="10" y1="18" x2="10" y2="11" /><line x1="14" y1="18" x2="14" y2="11" /><line x1="18" y1="18" x2="18" y2="11" /><polygon points="12 2 20 7 4 7" /></>,
    search: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
    mail: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>,
    trash: <><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></>,
    refresh: <><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></>,
    ext: <><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></>,
    caret: <polyline points="6 9 12 15 18 9" />,
};
export const Icon = ({ name, size, w }) => <Ico size={size} w={w}>{I[name]}</Ico>;

/* The firm's mark, from its uploaded favicon. */
export const FirmMark = ({ size = 32 }) => (
    <img className="ms-firm-mark" src="/assets/images/hubs/sterling-brooks-favicon.svg" alt="" width={size} height={size} />
);

/* ── Today, for screens that do not exist ──────────────────────────────── */
export const NotBuilt = ({ what, today }) => (
    <div className="ms-today">
        <StateBlock tone="empty" title={`There is no ${what} today.`} message={today || 'Switch to Proposed to see the design.'} />
    </div>
);

/* The proposed screen, or the Today note in its place. */
export const Designed = ({ what, today, children }) => (
    <Proposal instead={<NotBuilt what={what} today={today} />}>{children}</Proposal>
);

/* ── Frames ─────────────────────────────────────────────────────────────── */

/* A page outside the app's chrome: the account site's signed-out pages, an
   email, a 404 before sign-in. */
export const BrowserBox = ({ url, height = 640, children }) => (
    <div className="ms-browser">
        <div className="ms-browser-bar">
            <span className="ms-browser-dots" aria-hidden="true"><i /><i /><i /></span>
            <span className="ms-browser-url">{url}</span>
        </div>
        <div className="ms-browser-body" style={{ height }}>{children}</div>
    </div>
);

/* Computer and phone side by side. The screen renders twice, so each copy
   keeps its own state. */
export const Pair = ({ url, height, children }) => (
    <div className="ms-pair">
        <figure className="ms-pair-col is-wide">
            <figcaption>Computer</figcaption>
            <BrowserBox url={url} height={height}>{children}</BrowserBox>
        </figure>
        <figure className="ms-pair-col">
            <figcaption>Phone</figcaption>
            <Phone>{children}</Phone>
        </figure>
    </div>
);

/* A case page as the given role sees it, on a computer or in a phone. */
export const CasePage = ({ role = 'client', nav, head, phone = false, height = 760, modal, patch, children }) => {
    const [who, title] = PEOPLE[role] || PEOPLE.client;
    const frame = (
        <CaseFrame
            caseTitle={CASE} nav={nav} who={who} role={title}
            height={phone ? undefined : height}
            aside={<CaseRightPanel collapsed={phone} onToggle={() => {}} />}
            head={head}
            modal={modal}
            patch={patch}
        >
            {children}
        </CaseFrame>
    );
    return phone ? <Phone>{frame}</Phone> : frame;
};

/* The one title bar every case page has, carrying a document: its name as
   the page title and its status beside it, actions on the right. HD-1 set
   this for the editor; a person filling, signing or paying gets the same. */
export const DocBar = ({ title, status, label, actions }) => (
    <div className="case-content-title ms-docbar">
        <div className="case-title-block ms-docbar-block">
            <div className="ms-docbar-name">
                <h2 className="portal-page-title ms-docbar-title" title={title}>{title}</h2>
                {status && <StatusPill status={status} label={label} />}
            </div>
        </div>
        {actions && <div className="ms-docbar-actions">{actions}</div>}
    </div>
);

/* One page of a PDF. Lines stand in for the document's own text. */
export const Paper = ({ heading, children, lines = [92, 86, 90, 64], className = '' }) => (
    <div className={`ms-paper ${className}`}>
        {heading && <p className="ms-paper-heading">{heading}</p>}
        {lines.map((w, i) => <span key={i} className="ms-paper-line" style={{ width: `${w}%` }} />)}
        {children}
    </div>
);

/* Scroll a frame's own scroller so the part of a long real view the screen
   is about is in view, without moving the review page. */
export const ScrollTo = ({ selector, offset = 24 }) => {
    const ref = useRef(null);
    useEffect(() => {
        let tries = 0;
        const t = setInterval(() => {
            const frame = ref.current?.closest('.tb-canvas') || document;
            const target = frame.querySelector(selector);
            tries += 1;
            if (!target && tries < 40) return;
            clearInterval(t);
            if (!target) return;
            let box = target.parentElement;
            while (box && !(box.scrollHeight > box.clientHeight + 4 && /(auto|scroll)/.test(getComputedStyle(box).overflowY))) box = box.parentElement;
            if (box) box.scrollTop += target.getBoundingClientRect().top - box.getBoundingClientRect().top - offset;
        }, 100);
        return () => clearInterval(t);
    }, [selector, offset]);
    return <span ref={ref} hidden />;
};

/* A window over a screen: the app's .ccm shell. */
export const Dialog = ({ title, sub, onClose, footer, width = 520, children, className = '' }) => (
    <div className="modal-overlay ms-scrim">
        <div className={`ccm ms-dialog ${className}`} style={{ maxWidth: width }} role="dialog" aria-label={title}>
            <div className="ccm-header">
                <div>
                    <h2 className="ccm-title">{title}</h2>
                    {sub && <p className="ccm-subtitle">{sub}</p>}
                </div>
                <button type="button" className="ccm-close" onClick={onClose} aria-label="Close"><Icon name="x" /></button>
            </div>
            <div className="ccm-body">{children}</div>
            {footer && <div className="ccm-footer">{footer}</div>}
        </div>
    </div>
);
