/* Page furniture for the design backlog, built on the app's own classes.
 *
 * This file used to draw its own shells and its own panels, tables, inputs and
 * modals with their own values. That was the mistake: a 9px panel radius, a
 * 12.5px table row and a 160px sidebar read fine on their own and then do not
 * match anything a dev opens in the app. Every primitive here now renders the
 * markup the app renders, so a spec measured on this page is measured on the
 * real thing:
 *
 *   Panel  -> .as-tab-panel + .as-panel-header   (Advanced Settings)
 *   Table  -> .as-table-wrap + .as-table         (Advanced Settings, Roles)
 *   Modal  -> .modal-overlay + .ev-create-modal  (Create Event)
 *   Btn    -> .as-primary-btn / .as-text-btn
 *   Field  -> .as-form-field
 *   Toggle -> .as-toggle + .as-toggle-knob
 *
 * The frames themselves live in AppFrame, which mounts the real chrome.
 */

import SearchableSelect from '../../components/SearchableSelect';
import { AdminFrame, CaseFrame, BareFrame } from './AppFrame';
import '../settings/AdvancedSettingsView.css';
import '../EventsView.css';
import './Shell.css';

export { AdminFrame, CaseFrame, BareFrame };
export { PinLayer } from './Pins';
export { Patch, New, Proposal } from './Patch';

/* A numbered marker tying a spot on the screen to its row in the change list.
   Used where the markup is ours; PinLayer does the same job by selector where
   the markup belongs to a real view. */
export const Pin = ({ n, label, place = 'tr' }) => (
    <span className={`sh-pin sh-pin-${place}`} title={label}>{n}</span>
);

/* Wrap anything to put a numbered pin on it. No ring: see Pins.css. */
export const Change = ({ n, label, place, children, block = false }) => (
    <span className={`sh-change${block ? ' is-block' : ''}`}>
        <Pin n={n} label={label} place={place} />
        {children}
    </span>
);

/* ── Shells ──────────────────────────────────────────────────────────── */

/* The account site (ca-account). It is not in this codebase, so this is the
   one shell with no original to copy. It borrows the app's topbar values so
   the two sites do not look like different products. */
export const AccountShell = ({ nav = 'Hubs', narrow = false, children, headerPin }) => (
    <div className={`sh-account${narrow ? ' is-narrow' : ''}`}>
        <header className="sh-acct-top">
            <img src="/assets/images/logo.svg" alt="CaseActive" style={{ height: 26, width: 'auto' }} />
            <nav className="sh-acct-nav">
                {headerPin}
                <span className={`sh-acct-link${nav === 'Hubs' ? ' is-active' : ''}`}>Hubs</span>
                <span className={`sh-acct-link${nav === 'Profile' ? ' is-active' : ''}`}>Profile</span>
                <span className="sh-acct-link sh-acct-slot">HF-71<span className="sh-slot-tag">slot</span></span>
            </nav>
            <span className="portal-avatar">RG</span>
        </header>
        <div className="sh-acct-body">{children}</div>
    </div>
);

/* ── Shared page furniture, on the app's classes ─────────────────────── */

export const Panel = ({ label, sub, actions, children, flush = false }) => (
    <div className={`as-tab-panel${flush ? ' sh-flush' : ''}`}>
        {(label || actions) && (
            <div className="as-panel-header">
                <div className="as-panel-title-wrap">
                    {label && <h3 className="as-panel-title">{label}</h3>}
                    {sub && <p className="as-panel-subtitle">{sub}</p>}
                </div>
                {actions}
            </div>
        )}
        {children}
    </div>
);

export const Table = ({ cols, rows, align = {} }) => (
    <div className="as-table-wrap">
        <table className="as-table">
            <thead>
                <tr>{cols.map(c => <th key={c} style={align[c] ? { textAlign: align[c] } : undefined}>{c}</th>)}</tr>
            </thead>
            <tbody>
                {rows.map((r, i) => (
                    <tr key={i}>{cols.map(c => <td key={c} style={align[c] ? { textAlign: align[c] } : undefined}>{r[c]}</td>)}</tr>
                ))}
            </tbody>
        </table>
    </div>
);

/* The app's create and edit modal: breadcrumb above the title, close on the
   right, cancel as a text link on the left of the footer and the save button
   on the right. */
export const Modal = ({ title, crumb, children, footer, width = 560 }) => (
    <div className="modal-overlay sh-scrim">
        <div className="ev-create-modal" style={{ width }}>
            <div className="ev-modal-header">
                <div>
                    {crumb && <p className="ev-modal-breadcrumb">{crumb}</p>}
                    <h3 className="ev-modal-title">{title}</h3>
                </div>
                <span className="ev-modal-close">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </span>
            </div>
            <div className="ev-modal-body">{children}</div>
            {footer && <div className="ev-modal-footer">{footer}</div>}
        </div>
    </div>
);

/* kind: primary is the accent action, ghost is the quiet one, link is the
   footer cancel, danger is destructive. */
export const Btn = ({ children, kind = 'ghost', ...rest }) => {
    const cls = kind === 'primary' ? 'as-primary-btn'
        : kind === 'link' ? 'ev-modal-close-btn'
        : kind === 'danger' ? 'as-text-btn sh-btn-danger'
        : 'as-text-btn sh-btn-ghost';
    return <button type="button" className={cls} {...rest}>{children}</button>;
};

export const Input = ({ value, placeholder, as = 'input' }) => (
    as === 'static'
        ? <div className="sh-static">{value}</div>
        : <input defaultValue={value} placeholder={placeholder} readOnly />
);

/* The app's select, which is SearchableSelect wearing the modal's class.
   A bare <select> next to a real screen is the exact kind of near-miss this
   page exists to stop. */
export const Select = ({ value, options, className = 'ccm-select', disabled }) => (
    <SearchableSelect className={className} defaultValue={value} disabled={disabled}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
    </SearchableSelect>
);

/* A field as the app's modals draw one: 12px label above a 14px control. */
export const ModalField = ({ label, hint, children }) => (
    <div className="ccm-field">
        {label && <label className="ccm-label">{label}</label>}
        {children}
        {hint && <span className="ccm-hint">{hint}</span>}
    </div>
);

export const Toggle = ({ on }) => (
    <span className={`as-toggle${on ? ' on' : ''}`}><span className="as-toggle-knob" /></span>
);

export const Row = ({ name, hint, control }) => (
    <div className="sh-row">
        <div className="sh-row-main">
            <span className="sh-row-name">{name}</span>
            {hint && <span className="sh-row-hint">{hint}</span>}
        </div>
        {control}
    </div>
);

export const Code = ({ children }) => <code className="sh-code">{children}</code>;

export { Phone } from './Phone';
