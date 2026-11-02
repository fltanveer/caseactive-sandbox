/* ViewPage — the read-only view every grid's View button opens.

   It opens in the page, in place of the grid, so the app's menu and the
   case or Library header stay put: a header row with Back, the title and
   its status, and the buttons top right (Edit only while the row can still
   be edited, then Close); under it the document on a grey stage. Esc goes
   back too. Nothing on it saves.

   DocSheet draws the page itself for forms, e-signs and note templates:
   the sandbox has no real PDFs, so it shows the document's shape with its
   own title, description and answers, instead of an empty placeholder. */

import { useEffect } from 'react';
import StatusPill from './StatusPill';
import './Button.css';
import './ViewPage.css';

const BackIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
);
const EditIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
);

const ViewPage = ({ title, kind, meta, status, onClose, onEdit, children }) => {
    useEffect(() => {
        const onKey = e => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [onClose]);

    return (
        <section className="vp" aria-label={`${kind}: ${title}`}>
            <header className="vp-bar">
                <button type="button" className="vp-back" onClick={onClose} aria-label="Back to the list"><BackIcon /></button>
                <div className="vp-head">
                    <h2 className="vp-title" title={title}>{title}</h2>
                    <span className="vp-meta">
                        <span>{kind}{meta ? ` · ${meta}` : ''}</span>
                        {status && <StatusPill status={status} />}
                        <StatusPill status="viewOnly" />
                    </span>
                </div>
                <div className="vp-actions">
                    {onEdit && <button type="button" className="btn btn-secondary btn-sm vp-btn" onClick={onEdit}><EditIcon />Edit</button>}
                    <button type="button" className="btn btn-primary btn-sm" onClick={onClose}>Close</button>
                </div>
            </header>
            <div className="vp-stage">{children}</div>
        </section>
    );
};

/* kind: form | esign | note | text
   answers: show filled-in values (a completed form) or blank lines. */
const FORM_FIELDS = ['Full name', 'Date of incident', 'Where it happened', 'What happened'];
const FORM_ANSWERS = ['Maria Gonzalez', 'March 14, 2026', 'Sunset Blvd & Vine St, Los Angeles', 'Rear-ended at a red light. Neck and back pain the next day.'];

export const DocSheet = ({ kind = 'form', title, description, answers = false, signedBy, text, footer }) => (
    <article className="vp-sheet">
        <header className="vp-sheet-head">
            <img src="/assets/images/logo.svg" alt="" className="vp-sheet-logo" />
            <h3 className="vp-sheet-title">{title}</h3>
            {description && <p className="vp-sheet-desc">{description}</p>}
        </header>

        {kind === 'form' && (
            <dl className="vp-fields">
                {FORM_FIELDS.map((f, i) => (
                    <div key={f} className="vp-field">
                        <dt>{f}</dt>
                        <dd className={answers ? '' : 'is-empty'}>{answers ? FORM_ANSWERS[i] : 'Not filled in yet'}</dd>
                    </div>
                ))}
            </dl>
        )}

        {(kind === 'esign' || kind === 'note') && (
            <div className="vp-lines" aria-hidden="true">
                {[96, 100, 88, 100, 72, 100, 94, 60].map((w, i) => <span key={i} style={{ width: `${w}%` }} />)}
            </div>
        )}

        {kind === 'esign' && (
            <div className="vp-sign">
                <div className={`vp-sign-box${signedBy ? ' is-signed' : ''}`}>
                    {signedBy ? <span className="vp-sign-name">{signedBy}</span> : <span className="vp-sign-wait">Waiting for signature</span>}
                </div>
                <span className="vp-sign-label">{signedBy ? `Signed by ${signedBy}` : 'Signature'}</span>
            </div>
        )}

        {kind === 'text' && <p className="vp-text">{text}</p>}

        {footer && <footer className="vp-sheet-foot">{footer}</footer>}
    </article>
);

export default ViewPage;
