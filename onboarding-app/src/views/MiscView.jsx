/* MiscView — the component reference for CaseActive.

   Every message, state and highlight the product uses, drawn from the
   shared components so this page can't drift from the app: FormField,
   Notice, ConfirmModal, DeleteConfirmModal, StatusPill, StateBlock and the
   snackbar. Each section says when to use the thing, not only what it is.
*/

import { useState, useRef, useEffect } from 'react';
import FormField from '../components/FormField';
import Notice from '../components/Notice';
import ConfirmModal from '../components/ConfirmModal';
import DeleteConfirmModal, { TrashIcon } from '../components/DeleteConfirmModal';
import StatusPill from '../components/StatusPill';
import StateBlock from '../components/StateBlock';
import Breadcrumb from '../components/Breadcrumb';
import { STATUS } from '../components/statuses';
import KeyModalDemo from './misc/KeyModalDemo';
import { Section, Sub, Specimen } from './misc/parts';
import { LoadingSection, PageStatesSection, FieldEdgeSection, FlowsSection, SystemSection, ContentSection, ChecklistSection } from './misc/EdgeCases';
import '../components/Button.css';
import './settings/AdvancedSettingsView.css';
import './MiscView.css';

const SNACKBAR_VARIANTS = [
    { type: 'default', label: 'Default', message: 'Draft saved on this device.' },
    { type: 'success', label: 'Success', message: 'Case saved.' },
    { type: 'error',   label: 'Error',   message: "Couldn't save the case. Try again." },
    { type: 'warning', label: 'Warning', message: 'Your session ends in 2 minutes.' },
    { type: 'info',    label: 'Info',    message: 'A new version of CaseActive is ready.' },
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

const SECTIONS = [
    { id: 'tones',       label: 'Colours & tones' },
    { id: 'buttons',     label: 'Buttons' },
    { id: 'fields',      label: 'Form fields' },
    { id: 'field-edge',  label: 'Field edge cases' },
    { id: 'controls',    label: 'Choice controls' },
    { id: 'field-msg',   label: 'Field messages' },
    { id: 'flows',       label: 'Sign-in code & uploads' },
    { id: 'notices',     label: 'Notices' },
    { id: 'banners',     label: 'Page banners' },
    { id: 'system',      label: 'System & team' },
    { id: 'crumbs',      label: 'Breadcrumbs' },
    { id: 'modals',      label: 'Modals' },
    { id: 'loading',     label: 'Loading' },
    { id: 'page-states', label: 'Page states' },
    { id: 'pills',       label: 'Status pills' },
    { id: 'states',      label: 'Empty & error panels' },
    { id: 'content',     label: 'Long content & numbers' },
    { id: 'highlight',   label: 'Highlights' },
    { id: 'snackbar',    label: 'Snackbars' },
    { id: 'checklist',   label: 'Edge-case checklist' },
];

const TONES = [
    { key: 'accent',  name: 'Accent',  use: 'Primary actions, links, focus, selection',     solid: '#149EB1', bg: '#E8F6F8', border: '#C4E8EE', text: '#0A6473' },
    { key: 'error',   name: 'Error',   use: 'Blocks the person: invalid input, failed save', solid: '#DC2626', bg: '#FEF2F2', border: '#FECACA', text: '#B91C1C' },
    { key: 'warning', name: 'Warning', use: 'Allowed, but has a consequence',               solid: '#D97706', bg: '#FFFBEB', border: '#FDE68A', text: '#92400E' },
    { key: 'success', name: 'Success', use: 'Finished, verified, active',                    solid: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0', text: '#15803D' },
    { key: 'pending', name: 'Pending', use: 'Still moving: processing, waiting',             solid: '#7C3AED', bg: '#EDE9FE', border: '#DDD6FE', text: '#5B21B6' },
    { key: 'neutral', name: 'Neutral', use: 'Draft, closed, read-only, empty',               solid: '#64748B', bg: '#F8FAFC', border: '#E2E8F0', text: '#334155' },
];

const PlusIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const PowerIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>;
const DownloadIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;

const Toggle = ({ on, onChange, label }) => (
    <button type="button" role="switch" aria-checked={on} aria-label={label} className={`as-toggle${on ? ' on' : ''}`} onClick={() => onChange(!on)}>
        <span className="as-toggle-knob" />
    </button>
);

const MODAL_SCENARIOS = [
    { key: 'validation', tone: 'error',   title: 'Validation error',      desc: 'Save pressed with a bad value. Field turns red, message says what to enter, a summary at the top links to each field.', open: 'Open Edit Key' },
    { key: 'server',     tone: 'error',   title: 'Save failed',           desc: "Every field is fine but the request fails. Error notice at the top with Try again; the form keeps what was typed.", open: 'Open, then press Save' },
    { key: 'warning',    tone: 'warning', title: 'Warning on a field',    desc: 'The value is allowed but risky (0.0.0.0/0). Amber field message; Save still works. Toggle Active off for the inline warning.', open: 'Open Edit Key' },
    { key: 'confirm',    tone: 'warning', title: 'Confirm with a consequence', desc: 'An action that changes behaviour but can be reversed. Amber tile, question names the action, button repeats it.', open: 'Open confirm' },
    { key: 'discard',    tone: 'warning', title: 'Unsaved changes',       desc: 'Closing a form with edits. Ask before throwing work away; "Keep editing" is the safe default.', open: 'Open confirm' },
    { key: 'blocked',    tone: 'error',   title: "Can't do that yet",     desc: 'The action is blocked by something the person has to fix first. One button, and the message says what to fix.', open: 'Open blocked' },
    { key: 'delete',     tone: 'error',   title: 'Delete',                desc: 'Destroys something. Shared DeleteConfirmModal: red tile, red button with the trash icon.', open: 'Open delete' },
    { key: 'typed',      tone: 'error',   title: 'Delete with typed name', desc: 'For deletes that take a lot with them (a hub, a case with documents). The button stays off until the name is typed exactly.', open: 'Open delete' },
    { key: 'conflict',   tone: 'warning', title: 'Someone else saved first', desc: 'Two staff on one case. Saving would overwrite a colleague. Say who and what, and let them choose.', open: 'Open conflict' },
    { key: 'session',    tone: 'warning', title: 'Session ending',        desc: 'Client data is confidential, so idle sessions end. Warn with a live countdown; typed work is kept.', open: 'Open session' },
    { key: 'info',       tone: 'info',    title: 'Routine check',         desc: 'A plain confirmation before something ordinary, like sending an invite again.', open: 'Open confirm' },
];

const TypedDelete = ({ onClose, onDone }) => {
    const NAME = 'Smith v. Jordan Trucking';
    const [typed, setTyped] = useState('');
    const match = typed.trim() === NAME;
    return (
        <DeleteConfirmModal title="Delete Case" name={NAME} wide
            detail="Its 34 documents, 12 e-signs and all messages with the client go with it. It can be restored for 30 days."
            confirmLabel="Delete case" confirmDisabled={!match}
            onCancel={onClose} onConfirm={onDone}>
            <FormField label={<>Type <strong>{NAME}</strong> to confirm</>}
                error={typed && !match && typed.length >= NAME.length ? "That doesn't match the case name." : null}>
                <input className="ccm-input" value={typed} onChange={e => setTyped(e.target.value)} autoComplete="off" spellCheck={false} />
            </FormField>
        </DeleteConfirmModal>
    );
};

const SessionModal = ({ onClose, onEnd }) => {
    const [left, setLeft] = useState(59);
    useEffect(() => {
        if (left <= 0) { onEnd(); return; }
        const t = setTimeout(() => setLeft(l => l - 1), 1000);
        return () => clearTimeout(t);
    }, [left, onEnd]);
    return (
        <ConfirmModal tone="warning" title="Still there?"
            question={<>You'll be signed out in <span className="ec-countdown">0:{String(left).padStart(2, '0')}</span></>}
            detail="To keep client information safe, CaseActive signs you out after 30 minutes without activity. Anything you've typed is saved as a draft."
            confirmLabel="Stay signed in" cancelLabel="Sign out now"
            onCancel={onEnd} onConfirm={onClose} />
    );
};

const MiscView = () => {
    const [snacks, setSnacks] = useState([]);
    const idRef = useRef(0);
    const [modal, setModal] = useState(null);
    const [active, setActive] = useState('tones');
    const [notices, setNotices] = useState({ dismiss: true });
    const [toggles, setToggles] = useState({ a: true, b: false });
    const [flash, setFlash] = useState(0);
    const [query, setQuery] = useState('smith');

    const dismiss = (id) => setSnacks(prev => prev.filter(s => s.id !== id));
    const showSnack = (variant) => {
        const id = ++idRef.current;
        setSnacks(prev => [...prev, { id, ...variant }]);
    };

    // Highlight the section in view in the side index.
    useEffect(() => {
        const els = SECTIONS.map(s => document.getElementById(`misc-${s.id}`)).filter(Boolean);
        const io = new IntersectionObserver(entries => {
            const top = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
            if (top) setActive(top.target.id.replace('misc-', ''));
        }, { rootMargin: '-10% 0px -70% 0px' });
        els.forEach(el => io.observe(el));
        return () => io.disconnect();
    }, []);

    const jump = (id) => {
        document.getElementById(`misc-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActive(id);
    };

    const closeModal = () => setModal(null);

    const people = ['Jordan Smith', 'Avery Smithson', 'Riley Chen', 'Sam Goldsmith'];
    const mark = (text) => {
        const q = query.trim();
        if (!q) return text;
        const i = text.toLowerCase().indexOf(q.toLowerCase());
        if (i < 0) return text;
        return <>{text.slice(0, i)}<mark className="hl-mark">{text.slice(i, i + q.length)}</mark>{text.slice(i + q.length)}</>;
    };

    return (
        <div className="portal-content misc-content">
            <header className="misc-intro">
                <h2 className="misc-intro-title">Components</h2>
                <p className="misc-intro-desc">
                    Every message, state and highlight in CaseActive, built from the shared components.
                    Use these instead of drawing new ones, so an error looks like an error on every screen.
                </p>
            </header>

            <div className="misc-layout">
                <nav className="misc-index" aria-label="Components">
                    {SECTIONS.map(s => (
                        <button key={s.id} type="button" className={`misc-index-link${active === s.id ? ' is-active' : ''}`} onClick={() => jump(s.id)}>
                            {s.label}
                        </button>
                    ))}
                </nav>

                <div className="misc-main">
                    {/* ── Tones ── */}
                    <Section id="tones" title="Colours & tones"
                        desc="Six tones carry every state. Pick by what it asks of the person, not how it sounds: red only when something blocks them, amber when they should read before going on.">
                        <div className="misc-tone-grid">
                            {TONES.map(t => (
                                <div key={t.key} className="misc-tone">
                                    <div className="misc-tone-swatches">
                                        <span style={{ background: t.solid }} title={`Solid ${t.solid}`} />
                                        <span style={{ background: t.bg, borderColor: t.border }} title={`Surface ${t.bg}`} />
                                        <span style={{ background: t.text }} title={`Text ${t.text}`} />
                                    </div>
                                    <p className="misc-tone-name">{t.name}</p>
                                    <p className="misc-tone-use">{t.use}</p>
                                    <code className="misc-tone-code">{t.solid} · {t.bg} · {t.text}</code>
                                </div>
                            ))}
                        </div>
                    </Section>

                    {/* ── Buttons ── */}
                    <Section id="buttons" title="Buttons"
                        desc="One primary button per screen or modal. Labels name the action (Save key, Turn off key), never Yes or OK. Classes live in components/Button.css.">
                        <Sub title="Variants">
                            <div className="misc-row">
                                <button className="btn btn-primary"><PlusIcon />New key</button>
                                <button className="btn btn-secondary"><DownloadIcon />Export</button>
                                <button className="btn btn-danger"><TrashIcon />Delete key</button>
                                <button className="btn btn-warning"><PowerIcon />Turn off key</button>
                                <button className="btn btn-ghost">Clear filters</button>
                                <button className="btn btn-link">View activity</button>
                            </div>
                        </Sub>
                        <Sub title="States" note="Disabled only when the reason is visible next to it. A form with errors keeps Save enabled and explains on click.">
                            <div className="misc-row">
                                <Specimen label="Default"><button className="btn btn-primary">Save</button></Specimen>
                                <Specimen label="Focus"><button className="btn btn-primary misc-force-focus">Save</button></Specimen>
                                <Specimen label="Loading"><button className="btn btn-primary is-loading">Save</button></Specimen>
                                <Specimen label="Disabled"><button className="btn btn-primary" disabled>Save</button></Specimen>
                                <Specimen label="Small"><button className="btn btn-secondary btn-sm">Cancel</button></Specimen>
                            </div>
                        </Sub>
                    </Section>

                    {/* ── Fields ── */}
                    <Section id="fields" title="Form fields"
                        desc="FormField wraps any .ccm-input, .ccm-select or .ccm-textarea. It owns the label, the required star, and the single message line under the control.">
                        <div className="misc-field-grid">
                            <FormField label="Default" hint="Hint: what a good value looks like.">
                                <input className="ccm-input" placeholder="Placeholder text" />
                            </FormField>
                            <FormField label="Focus" hint="Accent border and ring.">
                                <input className="ccm-input misc-force-focus-input" defaultValue="Jordan Smith" />
                            </FormField>
                            <FormField label="Required" required error="Enter the client's full name.">
                                <input className="ccm-input" defaultValue="" placeholder="Full name" />
                            </FormField>
                            <FormField label="Error" error="Enter an email address, like name@firm.com.">
                                <input className="ccm-input" defaultValue="jordan@firm" />
                            </FormField>
                            <FormField label="Warning" warning="This date is in the past. The reminder sends straight away.">
                                <input className="ccm-input" type="text" defaultValue="Oct 2, 2026" />
                            </FormField>
                            <FormField label="Success" success="Domain verified.">
                                <input className="ccm-input" defaultValue="portal.smithlaw.com" />
                            </FormField>
                            <FormField label="Read-only" readOnly hint="Set when the case was created. It can't be changed.">
                                <input className="ccm-input" value="CASE-20419" />
                            </FormField>
                            <FormField label="Disabled" hint="Turn on reminders to choose a time.">
                                <input className="ccm-input" disabled defaultValue="9:00 AM" />
                            </FormField>
                            <FormField label="Optional" optional hint="Shown on the client's portal.">
                                <input className="ccm-input" placeholder="Nickname" />
                            </FormField>
                            <FormField label="Edited (unsaved)" changed hint="Marks a change in a long form until it's saved.">
                                <input className="ccm-input" defaultValue="Motor vehicle accident" />
                            </FormField>
                            <FormField label="Select with error" required error="Choose a practice area.">
                                <select className="ccm-select" defaultValue="">
                                    <option value="">Select…</option>
                                    <option>Personal injury</option>
                                    <option>Mass tort</option>
                                </select>
                            </FormField>
                            <FormField label="Textarea with warning" warning="Clients can see this note.">
                                <textarea className="ccm-textarea" defaultValue="Waiting on medical records from St. Mary's." />
                            </FormField>
                        </div>
                    </Section>

                    <FieldEdgeSection />

                    {/* ── Choice controls ── */}
                    <Section id="controls" title="Choice controls"
                        desc="Checkboxes, radios and toggles use the accent when on. Their errors sit under the group, not under each option.">
                        <div className="misc-field-grid">
                            <div className="misc-choice-group">
                                <span className="ff-label">Checkbox</span>
                                <label className="misc-check"><input type="checkbox" defaultChecked /> Send case updates by email</label>
                                <label className="misc-check"><input type="checkbox" /> Send case updates by text</label>
                                <label className="misc-check is-disabled"><input type="checkbox" disabled /> Send by post (not available)</label>
                            </div>
                            <div className="misc-choice-group ff ff-error">
                                <span className="ff-label">Radio with error <span className="ff-req">*</span></span>
                                <label className="misc-check"><input type="radio" name="misc-r" /> Plaintiff</label>
                                <label className="misc-check"><input type="radio" name="misc-r" /> Defendant</label>
                                <p className="ff-msg" role="alert"><span className="ff-msg-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><line x1="12" y1="7.5" x2="12" y2="13"/><line x1="12" y1="16.5" x2="12.01" y2="16.5"/></svg></span><span>Choose which side the client is on.</span></p>
                            </div>
                            <div className="misc-choice-group">
                                <span className="ff-label">Toggle</span>
                                <div className="misc-toggle-row"><Toggle on={toggles.a} onChange={v => setToggles(t => ({ ...t, a: v }))} label="Portal access" /><span>Portal access</span></div>
                                <div className="misc-toggle-row"><Toggle on={toggles.b} onChange={v => setToggles(t => ({ ...t, b: v }))} label="Text reminders" /><span>Text reminders</span></div>
                                {!toggles.a && <Notice tone="warning" compact>The client can't sign in until portal access is back on.</Notice>}
                            </div>
                        </div>
                    </Section>

                    {/* ── Field messages: don't / do ── */}
                    <Section id="field-msg" title="Field messages"
                        desc="What the Edit Key modal does today, and what it should do. Same field, same mistake.">
                        <div className="misc-dodont">
                            <div className="misc-dd is-dont">
                                <span className="misc-dd-tag">Don't</span>
                                <div className="misc-old-field">
                                    <label className="ccm-label">Source CIDR</label>
                                    <input className="ccm-input" value="203.0.113.1500" readOnly />
                                    <span className="misc-old-hint">An IPv4 address or range. 0.0.0.0/0 allows every IPv4 address.</span>
                                    <span className="misc-old-err">Address block is invalid. Example: 203.0.113.10 or 203.0.113.0/24.</span>
                                </div>
                                <div className="misc-old-foot"><button className="btn btn-secondary btn-sm">Cancel</button><button className="btn btn-primary btn-sm" disabled>Save</button></div>
                                <ul className="misc-dd-list">
                                    <li>Input border stays grey, so the eye doesn't find the field.</li>
                                    <li>Hint and error both show, with tall line spacing between them.</li>
                                    <li>"Address block is invalid" says what's wrong, not what to type.</li>
                                    <li>Save is greyed out with no reason given.</li>
                                </ul>
                            </div>
                            <div className="misc-dd is-do">
                                <span className="misc-dd-tag">Do</span>
                                <FormField label="Source CIDR" optional error="Each part of the address must be 0 to 255, like 203.0.113.10.">
                                    <input className="ccm-input" value="203.0.113.1500" readOnly />
                                </FormField>
                                <div className="misc-old-foot"><button className="btn btn-secondary btn-sm">Cancel</button><button className="btn btn-primary btn-sm">Save</button></div>
                                <ul className="misc-dd-list">
                                    <li>Red border and a red ring on focus.</li>
                                    <li>One message line. The error replaces the hint.</li>
                                    <li>Says what to enter, with an example built from their own value.</li>
                                    <li>Save stays enabled. Pressing it moves focus to the first bad field.</li>
                                </ul>
                            </div>
                        </div>
                        <Sub title="When to show it">
                            <ul className="misc-rules">
                                <li><strong>On leaving the field or pressing Save,</strong> not on every keystroke. Nobody has finished typing an email after three letters.</li>
                                <li><strong>Clear it the moment the value is fixed,</strong> without another blur.</li>
                                <li><strong>Error</strong> stops the save. <strong>Warning</strong> lets it through. If it can be saved, it isn't an error.</li>
                                <li><strong>Write the fix:</strong> "Enter a date after the incident date", not "Invalid date".</li>
                                <li><strong>Never put the message in the placeholder</strong> or only in a tooltip.</li>
                            </ul>
                        </Sub>
                    </Section>

                    <FlowsSection />

                    {/* ── Notices ── */}
                    <Section id="notices" title="Notices"
                        desc="For a message about a whole form, panel or step rather than one field. Inline in modals, panels and side sheets.">
                        <div className="misc-stack">
                            <Notice tone="error" title="Couldn't save the key" action={{ label: 'Try again', onClick: () => {} }}>
                                The connection dropped before CaseActive replied. Your changes are still here.
                            </Notice>
                            <Notice tone="warning" title="This client has no email address">
                                They won't get case updates until one is added.
                            </Notice>
                            <Notice tone="success">Invite sent to jordan@smithlaw.com.</Notice>
                            <Notice tone="info" action={{ label: 'Learn more', onClick: () => {} }}>
                                Keys are shown once. Copy the secret before closing this window.
                            </Notice>
                            <Notice tone="neutral">Changes here apply to new cases only.</Notice>
                            {notices.dismiss && (
                                <Notice tone="info" compact onDismiss={() => setNotices(n => ({ ...n, dismiss: false }))}>
                                    Compact, dismissible. Use for tips the person can close for good.
                                </Notice>
                            )}
                            {!notices.dismiss && (
                                <button className="btn btn-link misc-restore" onClick={() => setNotices(n => ({ ...n, dismiss: true }))}>Show the dismissed notice again</button>
                            )}
                        </div>
                    </Section>

                    {/* ── Banners ── */}
                    <Section id="banners" title="Page banners"
                        desc="Same notice, with a strong left edge, at the top of a page under its title. One at a time; the most serious wins.">
                        <div className="misc-stack">
                            <Notice variant="banner" tone="error" title="Calendar sync stopped" action={{ label: 'Reconnect', onClick: () => {} }}>
                                Google Calendar rejected the connection on Oct 11. New events aren't being added.
                            </Notice>
                            <Notice variant="banner" tone="warning" title="Your trial ends in 3 days" action={{ label: 'Choose a plan', onClick: () => {} }}>
                                After Oct 15 the hub becomes read-only until a plan is chosen.
                            </Notice>
                            <Notice variant="banner" tone="neutral" title="View only">
                                Your role can see stages but not change them. Ask an admin for edit access.
                            </Notice>
                            <Notice variant="banner" tone="success" onDismiss={() => {}}>
                                Import finished. 248 contacts added, 3 skipped.
                            </Notice>
                        </div>
                    </Section>

                    <SystemSection />

                    {/* ── Breadcrumbs ── */}
                    <Section id="crumbs" title="Breadcrumbs"
                        desc="A breadcrumb tells you where a page sits and gets you back up. Pages only. Chevrons between items, every parent clickable, the current page in bold and not a link.">
                        <Sub title="Page header">
                            <div className="misc-page-head">
                                <Breadcrumb items={[{ label: 'Settings', onClick: () => {} }, { label: 'Hubs' }]} />
                                <h1>Hubs</h1>
                            </div>
                        </Sub>
                        <Sub title="Inside a record" note="Name the record, not its id.">
                            <div className="misc-page-head">
                                <Breadcrumb items={[{ label: 'Cases', onClick: () => {} }, { label: 'Smith v. Jordan Trucking', onClick: () => {} }, { label: 'Documents' }]} />
                                <h1>Documents</h1>
                            </div>
                        </Sub>
                        <Sub title="Long path" note="More than four levels: first, then …, then the last two. Click … to expand.">
                            <div className="misc-page-head">
                                <Breadcrumb items={[
                                    { label: 'Library', onClick: () => {} },
                                    { label: 'Form Templates', onClick: () => {} },
                                    { label: 'Intake', onClick: () => {} },
                                    { label: 'Motor vehicle', onClick: () => {} },
                                    { label: 'Witness statement' },
                                ]} />
                                <h1>Witness statement</h1>
                            </div>
                        </Sub>
                        <Sub title="Phone" note="Under 640px the path becomes a back link to the parent.">
                            <div className="misc-page-head misc-phone-head">
                                <Breadcrumb className="is-back" items={[{ label: 'Cases', onClick: () => {} }, { label: 'Smith v. Jordan Trucking', onClick: () => {} }, { label: 'Documents' }]} />
                                <h1>Documents</h1>
                            </div>
                        </Sub>
                        <Sub title="Modal headers: no breadcrumb" note="A modal is a moment on top of the page, not a place. Title, and a subtitle only when the title can't say which record is open.">
                            <div className="misc-dodont">
                                <div className="misc-dd is-dont">
                                    <span className="misc-dd-tag">Don't</span>
                                    <div className="misc-mh">
                                        <div className="ccm-header">
                                            <div>
                                                <p className="ccm-breadcrumb-old">Integration · Keys · key...584a0720341757</p>
                                                <h2 className="ccm-title">Edit Key</h2>
                                            </div>
                                            <span className="ccm-close"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></span>
                                        </div>
                                        <div className="misc-mh-body">Form…</div>
                                    </div>
                                    <ul className="misc-dd-list">
                                        <li>Repeats the page the person is already on.</li>
                                        <li>Looks clickable, isn't.</li>
                                        <li>Separators differ screen to screen: ·, &gt; and ›.</li>
                                    </ul>
                                </div>
                                <div className="misc-dd is-do">
                                    <span className="misc-dd-tag">Do</span>
                                    <div className="misc-mh">
                                        <div className="ccm-header">
                                            <div>
                                                <h2 className="ccm-title">Edit Key</h2>
                                                <p className="ccm-subtitle is-id">key...584a0720341757</p>
                                            </div>
                                            <span className="ccm-close"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></span>
                                        </div>
                                        <div className="misc-mh-body">Form…</div>
                                    </div>
                                    <ul className="misc-dd-list">
                                        <li>The title says what the modal does.</li>
                                        <li>The subtitle says which record: an id, a case, an author and date.</li>
                                        <li>No subtitle when the title is enough (New Key).</li>
                                    </ul>
                                </div>
                            </div>
                        </Sub>
                    </Section>

                    {/* ── Modals ── */}
                    <Section id="modals" title="Modals"
                        desc="Every scenario opens live. Form modals use FormField and Notice; confirms use ConfirmModal or DeleteConfirmModal, which share one layout.">
                        <div className="misc-modal-grid">
                            {MODAL_SCENARIOS.map(m => (
                                <div key={m.key} className={`misc-modal-card tone-${m.tone}`}>
                                    <div className="misc-modal-card-head">
                                        <span className={`misc-modal-dot tone-${m.tone}`} aria-hidden="true" />
                                        <p className="misc-modal-card-title">{m.title}</p>
                                    </div>
                                    <p className="misc-modal-card-desc">{m.desc}</p>
                                    <button className="btn btn-secondary btn-sm" onClick={() => setModal(m.key)}>{m.open}</button>
                                </div>
                            ))}
                        </div>
                        <Sub title="Where messages go in a modal">
                            <ul className="misc-rules">
                                <li><strong>Field problem</strong> → under the field. If Save was pressed, also a summary at the top of the body listing the fields.</li>
                                <li><strong>Save or server problem</strong> → error notice at the top of the body, with Try again. Never close the modal on failure.</li>
                                <li><strong>Consequence of a setting</strong> → warning notice right under that setting.</li>
                                <li><strong>Success</strong> → close the modal and show a snackbar. Don't leave a green notice inside a modal that's finished.</li>
                            </ul>
                        </Sub>
                    </Section>

                    <LoadingSection />
                    <PageStatesSection />

                    {/* ── Pills ── */}
                    <Section id="pills" title="Status pills"
                        desc="StatusPill, keyed by status. Add new statuses to components/statuses.js, never as a one-off badge class.">
                        <Sub title="Tones">
                            <div className="misc-row">
                                {['neutral', 'info', 'success', 'warning', 'danger', 'pending'].map(t => (
                                    <StatusPill key={t} tone={t} label={t[0].toUpperCase() + t.slice(1)} />
                                ))}
                                <StatusPill tone="success" label="With dot" dot />
                            </div>
                        </Sub>
                        <Sub title="Every status in the product">
                            <div className="misc-row">
                                {Object.keys(STATUS).map(k => <StatusPill key={k} status={k} />)}
                            </div>
                        </Sub>
                    </Section>

                    {/* ── Panel states ── */}
                    <Section id="states" title="Empty & error panels"
                        desc="StateBlock, for a list or panel with nothing to show. Empty is calm, failed has a retry, locked explains who can change it.">
                        <div className="misc-stack">
                            <StateBlock tone="empty" title="No invoices yet" message="Invoices you send to this client show up here." />
                            <StateBlock tone="error" title="Invoices couldn't be loaded" message="Something went wrong on our side. Your invoices are safe." actionLabel="Try again" onAction={() => {}} />
                            <StateBlock tone="locked" title="Only admins can change billing" message="Ask an admin on this hub to update the card." />
                        </div>
                    </Section>

                    <ContentSection />

                    {/* ── Highlights ── */}
                    <Section id="highlight" title="Highlights"
                        desc="Ways to point at something without calling it an error. All use the accent, so they never compete with red or amber.">
                        <div className="misc-field-grid">
                            <Sub title="Search match">
                                <input className="ccm-input misc-hl-search" value={query} onChange={e => setQuery(e.target.value)} aria-label="Search people" />
                                <ul className="misc-hl-list">
                                    {people.map(p => <li key={p}>{mark(p)}</li>)}
                                </ul>
                            </Sub>
                            <Sub title="Just added / updated row" note="Fades back to white after 3 seconds.">
                                <table className="misc-hl-table">
                                    <tbody>
                                        <tr><td>Production API</td><td><StatusPill status="active" /></td></tr>
                                        <tr key={flash} className="hl-row-new"><td>Partner sync</td><td><StatusPill status="active" /></td></tr>
                                        <tr><td>Legacy import</td><td><StatusPill status="closed" /></td></tr>
                                    </tbody>
                                </table>
                                <button className="btn btn-link misc-restore" onClick={() => setFlash(f => f + 1)}>Replay</button>
                            </Sub>
                            <Sub title="Selected row">
                                <table className="misc-hl-table">
                                    <tbody>
                                        <tr><td><input type="checkbox" aria-label="Select" /></td><td>Riley Chen</td></tr>
                                        <tr className="hl-row-selected"><td><input type="checkbox" defaultChecked aria-label="Select" /></td><td>Jordan Smith</td></tr>
                                        <tr><td><input type="checkbox" aria-label="Select" /></td><td>Sam Goldsmith</td></tr>
                                    </tbody>
                                </table>
                            </Sub>
                            <Sub title="Recommended option">
                                <div className="misc-hl-cards">
                                    <div className="hl-card"><p className="hl-card-title">Monthly</p><p className="hl-card-sub">$49 / month</p></div>
                                    <div className="hl-card is-featured"><span className="hl-card-tag">Recommended</span><p className="hl-card-title">Yearly</p><p className="hl-card-sub">$470 / year</p></div>
                                </div>
                            </Sub>
                            <Sub title="Count & new badge">
                                <div className="misc-row">
                                    <span className="hl-nav-item">Inquiries <span className="hl-count">3</span></span>
                                    <span className="hl-nav-item">Payments <span className="hl-new">New</span></span>
                                    <span className="hl-nav-item">Tasks <span className="hl-count is-alert">12</span></span>
                                </div>
                            </Sub>
                            <Sub title="Keyboard focus">
                                <div className="misc-row">
                                    <button className="btn btn-secondary misc-force-focus">Focused button</button>
                                    <a className="misc-force-focus-link" href="#misc-highlight" onClick={e => e.preventDefault()}>Focused link</a>
                                </div>
                            </Sub>
                        </div>
                    </Section>

                    {/* ── Snackbar ── */}
                    <Section id="snackbar" title="Snackbars"
                        desc="Short confirmation after something finished, top right. Stay until dismissed. For errors that need action, use a notice where the work is.">
                        <div className="misc-row">
                            {SNACKBAR_VARIANTS.map(v => (
                                <button key={v.type} className={`misc-snack-btn ${v.type}`} onClick={() => showSnack(v)}>
                                    <SnackIcon type={v.type} />
                                    {v.label}
                                </button>
                            ))}
                        </div>
                    </Section>

                    <ChecklistSection />
                </div>
            </div>

            {/* ── Live modals ── */}
            {['validation', 'server', 'warning'].includes(modal) && (
                <KeyModalDemo
                    scenario={modal}
                    onClose={closeModal}
                    onSaved={() => { closeModal(); showSnack({ type: 'success', message: 'Key saved.' }); }}
                />
            )}
            {modal === 'confirm' && (
                <ConfirmModal tone="warning" title="Turn off key"
                    question="Turn off this key?"
                    detail="Integrations using it stop working straight away. You can turn it back on at any time."
                    confirmLabel="Turn off key"
                    onCancel={closeModal}
                    onConfirm={() => { closeModal(); showSnack({ type: 'default', message: 'Key turned off.' }); }} />
            )}
            {modal === 'discard' && (
                <ConfirmModal tone="warning" title="Unsaved changes"
                    question="Discard your changes?"
                    detail="You edited this case but didn't save. Closing now loses those edits."
                    confirmLabel="Discard changes" cancelLabel="Keep editing"
                    onCancel={closeModal} onConfirm={closeModal} />
            )}
            {modal === 'blocked' && (
                <ConfirmModal tone="error" title="Delete domain"
                    question={<>Can't delete <strong>manage</strong> yet</>}
                    detail="2 keys still use this domain. Move or delete those keys first, then try again."
                    onCancel={closeModal}>
                    <ul className="misc-blocked-list">
                        <li>Production API</li>
                        <li>Partner sync</li>
                    </ul>
                </ConfirmModal>
            )}
            {modal === 'delete' && (
                <DeleteConfirmModal title="Delete Key" name="Production API"
                    detail="Integrations using this key stop working straight away. This can't be undone."
                    confirmLabel="Delete key"
                    onCancel={closeModal}
                    onConfirm={() => { closeModal(); showSnack({ type: 'default', message: 'Key deleted.' }); }} />
            )}
            {modal === 'typed' && <TypedDelete onClose={closeModal} onDone={() => { closeModal(); showSnack({ type: 'default', message: 'Case deleted. It can be restored for 30 days.' }); }} />}
            {modal === 'conflict' && (
                <ConfirmModal tone="warning" title="Case changed"
                    question="Riley Chen saved this case while you were editing"
                    detail="They changed Stage to Negotiation and Next court date to Nov 4. Your edits are to Notes and Assigned staff."
                    confirmLabel="Save mine too" cancelLabel="Review their changes"
                    onCancel={closeModal}
                    onConfirm={() => { closeModal(); showSnack({ type: 'success', message: 'Saved. Riley’s changes were kept.' }); }}>
                    <Notice tone="neutral" compact>No field was changed by both of you, so both sets of edits can be kept.</Notice>
                </ConfirmModal>
            )}
            {modal === 'session' && <SessionModal onClose={closeModal} onEnd={() => { closeModal(); showSnack({ type: 'warning', message: 'Signed out for inactivity. Your draft was saved.' }); }} />}
            {modal === 'info' && (
                <ConfirmModal tone="info" title="Resend invite"
                    question="Send the invite again?"
                    detail="Jordan Smith gets a fresh link at jordan@smithlaw.com. The old link stops working."
                    confirmLabel="Resend invite"
                    onCancel={closeModal}
                    onConfirm={() => { closeModal(); showSnack({ type: 'success', message: 'Invite sent again.' }); }} />
            )}

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
