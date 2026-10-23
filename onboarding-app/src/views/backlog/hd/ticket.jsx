/* eslint-disable react-refresh/only-export-components --
   A data module holding JSX, like ../tickets.jsx: one ticket record whose
   screens are render functions. */

/* HD-1: page headings. The editor first.

   Today the form and e-sign editor opens inside the case with a heading of
   its own: the document name in an underlined field whose label is clipped
   by the top bar, flush against the sidebar, with Preview and Close floating
   above the line. Every other case page has one title bar: the page name,
   the case path under it ending in a pill, the actions on the right. The
   editor gets that same bar, with the document name as the title. */

import { useEffect, useRef, useState } from 'react';
import StatusPill from '../../../components/StatusPill';
import InfoBanner from '../../../components/InfoBanner';
import { CaseFrame, Phone, Patch, New } from '../Shell';
import { usePatched } from '../patchContext';
import { CaseRightPanel } from '../../LobbyView';
import FeedView from '../../FeedView';
import './hd.css';

const CASE = 'Rear-End Collision — Downtown LA';
const LONG = 'Settlement Disbursement Authorization and Medical Lien Acknowledgement — Alexandra Reyes';

const KINDS = {
    esign: { nav: 'E-signs', label: 'E-sign name', name: 'Retainer Agreement', status: 'draft' },
    form: { nav: 'Forms', label: 'Form name', name: 'Intake Questionnaire', status: 'published' },
};

const NOTE = 'Click a field, then Field Logic, and choose under Participants who may fill it in.';

const PEOPLE = {
    staff: ['Marcus Bell', 'Staff · Lead Attorney'],
    admin: ['Robert Grant', 'Administrator'],
    client: ['Alexandra Reyes', 'Client'],
};

/* The forms the signed-in person still owes the hub. */
const ONBOARDING = ['Client Intake Questionnaire', 'HIPAA Authorization'];

/* ── Icons ──────────────────────────────────────────────────────────────── */
const Ico = ({ size = 20, w = 1.8, children }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);
const Caret = () => <Ico size={13} w={2.2}><polyline points="6 9 12 15 18 9" /></Ico>;
const Eye = () => <Ico size={15} w={2.2}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></Ico>;
const Cross = () => <Ico size={15} w={2.4}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Ico>;
const Pencil = () => <Ico size={14} w={2.2}><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></Ico>;
const Back = () => <Ico size={15} w={2.4}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></Ico>;

/* The document tools belong to the PDF editor and are not in scope. They are
   drawn so the heading is judged against what sits under it. */
const TOOLS = [
    [<><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>, 'Layout', true],
    'pager',
    [<><path d="M9 14 4 9l5-5" /><path d="M4 9h11a5 5 0 0 1 0 10h-3" /></>, 'Undo'],
    [<><path d="m15 14 5-5-5-5" /><path d="M20 9H9a5 5 0 0 0 0 10h3" /></>, 'Redo'],
    [<><line x1="12" y1="2" x2="12" y2="22" /><rect x="6" y="6" width="12" height="4" rx="1" /><rect x="8" y="14" width="8" height="4" rx="1" /></>, 'Align'],
    [<><line x1="2" y1="12" x2="22" y2="12" /><rect x="6" y="6" width="4" height="12" rx="1" /><rect x="14" y="8" width="4" height="8" rx="1" /></>, 'Distribute'],
    [<><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16" y2="16" /><line x1="8" y1="11" x2="14" y2="11" /></>, 'Zoom out'],
    [<><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16" y2="16" /><line x1="8" y1="11" x2="14" y2="11" /><line x1="11" y1="8" x2="11" y2="14" /></>, 'Zoom in'],
    'gap',
    [<path d="M4 20 12 4l8 16" />, 'Draw', true],
    [<><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="m21 16-5-5-9 9" /></>, 'Image', true],
    [<><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><line x1="8" y1="9" x2="16" y2="9" /><line x1="8" y1="13" x2="13" y2="13" /></>, 'Comment'],
    [<><polyline points="4 6 4 4 14 4 14 6" /><line x1="9" y1="4" x2="9" y2="20" /><line x1="18" y1="5" x2="18" y2="19" /></>, 'Text', true],
    [<rect x="4" y="4" width="16" height="16" rx="1" />, 'Shape', true],
    [<><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></>, 'Print'],
    [<><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16" y2="16" /></>, 'Search'],
    [<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>, 'Download'],
    [<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><rect x="8" y="12" width="8" height="6" rx="1" /></>, 'Form fields', false, true],
];
const FIELDS = [
    [<><rect x="2" y="7" width="20" height="10" rx="2" /><text x="12" y="14.5" fontSize="6" textAnchor="middle" fill="currentColor" stroke="none" fontWeight="700">OK</text></>, 'Button'],
    [<><rect x="2" y="7" width="20" height="10" rx="1" /><line x1="12" y1="3" x2="12" y2="21" /></>, 'Text field'],
    [<><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" fill="currentColor" /></>, 'Radio'],
    [<><rect x="4" y="4" width="16" height="16" rx="2" /><polyline points="8 12 11 15 16 9" /></>, 'Checkbox'],
    [<><rect x="2" y="7" width="20" height="10" rx="1" /><polyline points="15 11 17 13 19 11" /><line x1="6" y1="10" x2="6" y2="14" /></>, 'Dropdown'],
    [<><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="8" y1="8" x2="17" y2="8" /><line x1="8" y1="12" x2="17" y2="12" /><line x1="8" y1="16" x2="17" y2="16" /></>, 'List'],
    [<><rect x="2" y="5" width="20" height="13" rx="2" /><path d="M6 14c2-4 3-4 4-1s2 2 4-2 3 1 4 1" /></>, 'Signature'],
    [<><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>, 'Date'],
];

const Toolbar = () => (
    <div className="hd-tools">
        <div className="hd-tools-row">
            {TOOLS.map((t, i) => {
                if (t === 'gap') return <span key={i} className="hd-tools-gap" />;
                if (t === 'pager') {
                    return (
                        <span key={i} className="hd-tool-pager">
                            Page
                            <span className="hd-tool-pager-box"><span>‹</span><b>1</b><span>›</span></span>
                            1 / 1
                        </span>
                    );
                }
                const [paths, label, caret, on] = t;
                return (
                    <button key={i} type="button" className={`hd-tool${on ? ' is-on' : ''}`} aria-label={label} title={label}>
                        <Ico>{paths}</Ico>{caret && <Caret />}
                    </button>
                );
            })}
        </div>
        <div className="hd-tools-row hd-tools-fields">
            {FIELDS.map(([paths, label]) => (
                <button key={label} type="button" className="hd-tool" aria-label={label} title={label}><Ico>{paths}</Ico></button>
            ))}
        </div>
    </div>
);

/* One page of the document, with a field on it. */
const Page = ({ preview }) => (
    <div className="hd-canvas">
        <div className="hd-page">
            <span className="hd-line" style={{ width: '42%' }} />
            <span className="hd-line" style={{ width: '88%' }} />
            <span className="hd-line" style={{ width: '80%' }} />
            <span className="hd-line" style={{ width: '64%' }} />
            {preview
                ? <span className="hd-field is-fill">Sign here</span>
                : <span className="hd-field" />}
            <span className="hd-field-label">Client signature</span>
        </div>
    </div>
);

/* ── Today ──────────────────────────────────────────────────────────────── */
const TodayHead = ({ kind, name }) => (
    <div className="hd-old-head">
        <div className="hd-old-name">
            <span className="hd-old-label">{KINDS[kind].label}</span>
            <h2 className="hd-old-title">{name}</h2>
        </div>
        <div className="hd-old-actions">
            <button type="button">Preview</button>
            <button type="button">Close</button>
        </div>
    </div>
);

/* ── Proposed ───────────────────────────────────────────────────────────── */
const Name = ({ name, status, setName, editing, setEditing }) => {
    const [draft, setDraft] = useState(name);
    const [blank, setBlank] = useState(false);
    const input = useRef(null);
    const pencil = useRef(null);

    useEffect(() => {
        if (editing) input.current?.select();
    }, [editing]);

    const done = (save) => {
        if (save && !draft.trim()) { setBlank(true); input.current?.focus(); return; }
        if (save) setName(draft.trim());
        else setDraft(name);
        setBlank(false);
        setEditing(false);
        requestAnimationFrame(() => pencil.current?.focus());
    };

    if (editing) {
        return (
            <div className="hd-name-edit">
                <input
                    ref={input} className={`hd-name-input${blank ? ' is-error' : ''}`} value={draft}
                    aria-label="Document name" aria-invalid={blank || undefined}
                    aria-describedby="hd-name-hint"
                    onChange={e => { setDraft(e.target.value); if (blank) setBlank(false); }}
                    onKeyDown={e => {
                        if (e.key === 'Enter') done(true);
                        if (e.key === 'Escape') done(false);
                    }}
                    onBlur={() => { if (draft.trim()) done(true); }}
                />
                <span id="hd-name-hint" className={`hd-name-hint${blank ? ' is-error' : ''}`}>
                    {blank ? 'Give it a name.' : 'Enter to save · Esc to cancel'}
                </span>
            </div>
        );
    }
    return (
        <div className="hd-name">
            <h2 className="portal-page-title hd-title" title={name}>{name}</h2>
            <button ref={pencil} type="button" className="hd-rename" aria-label={`Rename ${name}`} title="Rename"
                onClick={() => { setDraft(name); setEditing(true); }}>
                <Pencil />
            </button>
            <StatusPill status={status} className="hd-doc-status" />
        </div>
    );
};

/* One line: the document's name with its status, and the way out. The case
   is already named in the sidebar, so the editor does not repeat its path. */
const NewHead = ({ kind, name, setName, editing, setEditing, preview, setPreview }) => {
    const status = KINDS[kind].status;
    return (
        <div className="case-content-title hd-head">
            <div className="case-title-block hd-head-block">
                {preview ? (
                    <div className="hd-name">
                        <h2 className="portal-page-title hd-title" title={name}>{name}</h2>
                        <StatusPill status={status} className="hd-doc-status" />
                    </div>
                ) : <Name name={name} status={status} setName={setName} editing={editing} setEditing={setEditing} />}
            </div>
            <div className="hd-actions">
                {preview ? (
                    <button type="button" className="hd-btn" onClick={() => setPreview(false)} aria-label="Back to editing">
                        <Back /><span className="hd-btn-text">Back to editing</span>
                    </button>
                ) : (
                    <button type="button" className="hd-btn" onClick={() => setPreview(true)} aria-label="Preview">
                        <Eye /><span className="hd-btn-text">Preview</span>
                    </button>
                )}
                <button type="button" className="hd-btn" aria-label="Close">
                    <Cross /><span className="hd-btn-text">Close</span>
                </button>
            </div>
        </div>
    );
};

/* ── Onboarding reminder ─────────────────────────────────────────────────
   Today a teal strip is laid over the top of every page until the person's
   onboarding forms are done, covering whatever heading is under it. Proposed:
   the same always-there strip, but in the flow under the top bar, so it
   pushes the page down instead of covering it. On every page, the editor
   included, until the last form is in. */
const Clipboard = ({ size = 16 }) => (
    <Ico size={size} w={2.2}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" /><line x1="9" y1="12" x2="15" y2="12" /><line x1="9" y1="16" x2="13" y2="16" /></Ico>
);
const Bulb = () => (
    <Ico size={13} w={2.2}><path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" /></Ico>
);

const ObToday = () => (
    <div className="hd-ob-old" role="status">
        <Bulb /><a href="#onboarding" onClick={e => e.preventDefault()}>You still have onboarding forms to complete. Click here to fill them in.</a>
    </div>
);

const formsLabel = (n) => `${n} onboarding form${n === 1 ? '' : 's'}`;

const ObStrip = () => (
    <div className="hd-ob-strip" role="region" aria-label="Onboarding forms">
        <span className="hd-ob-strip-icon"><Clipboard /></span>
        <p className="hd-ob-strip-text">
            <strong>{formsLabel(ONBOARDING.length)}</strong> still to fill in
            <span className="hd-ob-strip-names">: {ONBOARDING.join(' and ')}.</span>
        </p>
        <a href="#onboarding" className="hd-ob-go" onClick={e => e.preventDefault()}>Fill in forms</a>
    </div>
);

/* The patch that puts the strip under the real top bar. */
const OB_EDITS = [
    { at: '.lobby-shell > .portal-topbar', mode: 'after', className: 'hd-ob-strip-host', children: <New><ObStrip /></New> },
];

/* An ordinary case page, for the reminder on its own. */
const CasePage = ({ role = 'client', phone = false }) => {
    const on = usePatched();
    const [who, title] = PEOPLE[role] || PEOPLE.client;
    const frame = (
        <div className={on ? 'hd-new' : 'hd-today'}>
            <CaseFrame
                caseTitle={CASE} nav="Feed" who={who} role={title}
                height={phone ? undefined : 720}
                aside={<CaseRightPanel collapsed={phone} onToggle={() => {}} />}
                head={on ? undefined : (
                    <>
                        <ObToday />
                        <div className="case-content-title">
                            <div className="case-title-block">
                                <h2 className="portal-page-title">Feed</h2>
                                <div className="case-title-meta"><p className="portal-breadcrumb">{CASE} · Feed</p></div>
                            </div>
                        </div>
                    </>
                )}
                patch={<Patch edits={OB_EDITS} />}
            >
                <div className="tk-mount"><FeedView /></div>
            </CaseFrame>
        </div>
    );
    return phone ? <Phone>{frame}</Phone> : frame;
};

/* ── The screen ─────────────────────────────────────────────────────────── */
const Editor = ({ kind = 'esign', role = 'staff', initialName, initialEditing = false, initialPreview = false, phone = false }) => {
    const on = usePatched();
    const [name, setName] = useState(initialName || KINDS[kind].name);
    const [editing, setEditing] = useState(initialEditing);
    const [preview, setPreview] = useState(initialPreview);
    const [who, title] = PEOPLE[role] || PEOPLE.staff;

    const frame = (
        <div className={on ? 'hd-new' : 'hd-today'}>
            <CaseFrame
                caseTitle={CASE} nav={KINDS[kind].nav} who={who} role={title}
                height={phone ? undefined : 820}
                aside={<CaseRightPanel collapsed={phone} onToggle={() => {}} />}
                head={on
                    ? <NewHead kind={kind} name={name} setName={setName} editing={editing} setEditing={setEditing} preview={preview} setPreview={setPreview} />
                    : <><ObToday /><TodayHead kind={kind} name={name} /></>}
                patch={<Patch edits={OB_EDITS} />}
            >
                {on ? (
                    <>
                        {preview
                            ? <InfoBanner key="p" message="This is the document as a participant sees it. Nothing you type here is saved." />
                            : <InfoBanner key="e" message={NOTE} />}
                        <div className="hd-editor">
                            {!preview && <Toolbar />}
                            <Page preview={preview} />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="hd-old-note">Note: Click on each field, then Field Logic, and select the participants allowed to fill in the field under Participants.</div>
                        <div className="hd-old-editor">
                            <Toolbar />
                            <Page />
                        </div>
                    </>
                )}
            </CaseFrame>
        </div>
    );
    return phone ? <Phone>{frame}</Phone> : frame;
};

/* ── The ticket ─────────────────────────────────────────────────────────── */
export const HD_TICKET = {
    no: 15,
    key: 'HD-1',
    ticketName: 'Client Side Page Heading Design and Editor Screen Heading Design',
    domain: 'ca-app',
    status: 'To Do',
    severity: 'Suggestion',
    link: 'https://caseactive.slack.com/lists/TJQSXGPJB/F09M1DLSBC6?record_id=Rec0CBGNZAABG',
    title: 'Page headings: the editor, and the onboarding reminder',
    roles: ['client', 'staff', 'admin'],
    brief: [
        'Client side page heading design.',
        'Editor screen heading design.',
    ],
    alsoKnown: 'The live form and e-sign editor opens inside the case page, with the case sidebar and right rail still around it. The sandbox\'s FormEditorModal and ESignEditorModal are a different, full-screen shell with Back and Save Changes, so the screens here draw the live layout from a screenshot and mount the sandbox\'s real case chrome around it. The PDF tools under the heading belong to the embedded editor and are out of scope.',
    decision: 'The editor uses the title bar every case page already has, instead of a heading of its own. The document name is the page title at 22px, in the same place a page name sits on Feed or Tasks, so moving into the editor does not move the eye. The bar is one line. The case path and stage line that other case pages carry is left out: the case is already named in the sidebar, the stage says nothing about the document, and the editor needs the height. The document\'s own status, Draft or Published, sits beside its name, because it describes the document. Renaming stays one click away, as a pencil beside the name rather than an always-open underlined field, because a field reads as a form to fill in and its floating label was what the top bar clipped. Preview and Close become outlined buttons in the bar\'s right end, at its vertical centre. The instruction note becomes the app\'s InfoBanner, which can be dismissed, instead of a solid teal bar that outweighs the title. The onboarding reminder stays a strip across the top of every page until the forms are done, but it moves into the flow under the top bar: today it is laid over the page and covers whatever heading is there, the editor\'s name included. In the flow it pushes the page down instead, so every heading stays whole. It names the forms and has one button, and it cannot be dismissed.',
    items: [
        { id: '15.1', what: 'Editor title bar: the document name as the page title, a Draft or Published pill beside the name, Preview and Close on the right. One line, with no case path or stage under it. The same .case-content-title every case page uses.', where: 'Case → Forms or E-signs → open a document to edit', file: 'Not in this codebase (ca-app document editor)', roles: ['staff', 'admin'], missing: true },
        { id: '15.2', what: 'Rename in place: a pencil beside the name opens an input at the title\'s size. Enter or leaving the field saves, Esc cancels, and a blank name is refused.', where: 'Editor title bar', file: 'Not in this codebase (ca-app document editor)', roles: ['staff', 'admin'], missing: true },
        { id: '15.3', what: 'The instruction note as the shared InfoBanner, dismissible, and remembered per person.', where: 'Under the title bar', file: 'src/components/InfoBanner.jsx', roles: ['staff', 'admin'] },
        { id: '15.4', what: 'Preview: the same bar, with Back to editing in place of Preview, a note saying nothing typed is saved, and the tools hidden.', where: 'Editor → Preview', file: 'Not in this codebase (ca-app document editor)', roles: ['staff', 'admin'], missing: true },
        { id: '15.5', what: 'Long names: one line with an ellipsis and the full name on hover. The status pill, the pencil and the actions never wrap or shrink.', where: 'Editor title bar', file: 'Not in this codebase (ca-app document editor)', roles: ['staff', 'admin'], missing: true },
        { id: '15.6', what: 'Phone: the actions turn into 40px icon buttons on the title\'s row, and the tools scroll sideways in one row.', where: 'Editor title bar, ≤640px', file: 'Not in this codebase (ca-app document editor)', roles: ['staff', 'admin'], missing: true },
        { id: '15.7', what: 'Draft and Published in the shared status vocabulary.', where: 'Editor title bar', file: 'src/components/statuses.js', roles: ['staff', 'admin'] },
        { id: '15.8', what: 'Onboarding strip in the flow under the top bar, on every page including the editor, until the last form is in: how many forms and which, and Fill in forms. It cannot be dismissed.', where: 'Under the top bar, both sites', file: 'Not in this codebase (app shell)', roles: ['client', 'staff', 'admin'], missing: true },
        { id: '15.9', what: 'The strip on a phone: the count and Fill in forms, without the form names.', where: 'Under the top bar, ≤640px', file: 'Not in this codebase (app shell)', roles: ['client', 'staff', 'admin'], missing: true },
    ],
    screens: [
        {
            id: 'esign', label: 'E-sign editor', roles: ['staff', 'admin'],
            note: 'Today is drawn from screenshots of the live editor, with the onboarding strip laid over its name. On Proposed the strip sits above the title bar; the pencil renames and Preview switches the bar to its preview state.',
            render: (role) => <Editor key="esign" kind="esign" role={role} />,
        },
        {
            id: 'form', label: 'Form editor', roles: ['staff', 'admin'],
            note: 'The same bar for a form. This one is published, so the pill beside its name says so.',
            render: (role) => <Editor key="form" kind="form" role={role} />,
        },
        {
            id: 'rename', label: 'Renaming', roles: ['staff', 'admin'],
            note: 'After the pencil. The input takes the title\'s place at the title\'s size, so the bar does not jump. Clear it and press Enter to see a blank name refused.',
            render: (role) => <Editor key="rename" kind="esign" role={role} initialEditing />,
        },
        {
            id: 'preview', label: 'Preview', roles: ['staff', 'admin'],
            note: 'The bar stays put. Back to editing replaces Preview, the note says nothing is saved, and the tools are gone, so it is clear which mode the document is in.',
            render: (role) => <Editor key="preview" kind="esign" role={role} initialPreview />,
        },
        {
            id: 'long', label: 'Long name', roles: ['staff', 'admin'],
            note: 'A name longer than the bar. It cuts off with an ellipsis and shows in full on hover; the status, the pencil, Preview and Close keep their size.',
            render: (role) => <Editor key="long" kind="esign" role={role} initialName={LONG} />,
        },
        {
            id: 'ob-page', label: 'Onboarding · case page', roles: ['client', 'staff'],
            note: 'Today the strip is laid over the top of the page and covers the title bar. Proposed: the same strip, always there, but in the flow under the top bar, so the page starts below it.',
            render: (role) => <CasePage key="ob-page" role={role} />,
        },
        {
            id: 'ob-phone', label: 'Onboarding · phone', roles: ['client', 'staff'], phone: true,
            note: 'On a phone the strip drops the form names and keeps the count and Fill in forms.',
            render: (role) => <CasePage key="ob-phone" role={role} phone />,
        },
        {
            id: 'phone', label: 'Editor · phone', roles: ['staff', 'admin'], phone: true,
            note: 'At phone width Preview and Close become icon buttons on the title\'s row, and the name gives way to them.',
            render: (role) => <Editor key="phone" kind="esign" role={role} phone />,
        },
    ],
};
