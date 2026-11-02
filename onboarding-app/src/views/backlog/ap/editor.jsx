/* AP-1 · 3 · The template editor, from the upload window to a published
   template.

   Kept from today: Blank page or From Upload; the header with Preview/Edit
   and Close; the toolbar with undo, redo, align, page editor and add field,
   page tools off for an uploaded file; Field Logic and Duplicate on a
   field; prefill data and, on e-signs, the participant. The work is the
   states and their words, and a real placeholder for an unnamed template. */

import { useState } from 'react';
import StatusPill from '../../../components/StatusPill';
import Notice from '../../../components/Notice';
import SearchableSelect from '../../../components/SearchableSelect';
import FormTemplatesView from '../../library/FormTemplatesView';
import ESignTemplatesView from '../../library/ESignTemplatesView';
import { AdminFrame, Phone } from '../Shell';
import { usePatched } from '../patchContext';
import { Icon, Ico, Dialog, NotBuilt } from '../ms/parts';
import { Lines } from '../cw/doc';

const KIND = {
    form: { sub: 'Form Templates', noun: 'form', name: 'Client Intake Questionnaire', file: 'Client Intake Questionnaire.pdf' },
    esign: { sub: 'E-Sign Templates', noun: 'e-sign', name: 'Retainer Agreement', file: 'Retainer Agreement.docx' },
};

/* ══ The upload window ══════════════════════════════════════════════════ */

const PageIcon = ({ tag }) => (
    <span className="ap-up-ic">
        <Ico size={40} w={1.5}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></Ico>
        {tag && <span className="ap-up-tag">{tag}</span>}
    </span>
);

/* state: choose | preparing | failed */
const UploadDialog = ({ kind, state }) => {
    const k = KIND[kind];
    if (state === 'choose') {
        return (
            <Dialog title="Add a new page" width={560} onClose={() => {}}>
                <div className="ap-up-cards">
                    <button type="button" className="ap-up-card"><PageIcon /><span className="ap-up-label">Blank page</span><span className="ms-muted ms-small">Start from nothing and add fields.</span></button>
                    <button type="button" className="ap-up-card"><PageIcon tag="PDF · DOC" /><span className="ap-up-label">From Upload</span><span className="ms-muted ms-small">A PDF or Word document.</span></button>
                </div>
            </Dialog>
        );
    }
    return (
        <Dialog title="Add a new page" width={560} onClose={() => {}}
            footer={state === 'failed' ? (<>
                <button type="button" className="btn btn-secondary">Cancel</button>
                <button type="button" className="btn btn-primary"><Icon name="upload" size={14} />Choose another file</button>
            </>) : <button type="button" className="btn btn-secondary">Cancel</button>}>
            <div className="ap-up-file">
                <span className={`ap-up-file-ic${state === 'failed' ? ' is-err' : ''}`}><Icon name={state === 'failed' ? 'alert' : 'file'} size={22} /></span>
                <div>
                    <p className="ap-up-file-name">{k.file}</p>
                    <p className="ms-muted ms-small">184 KB</p>
                </div>
            </div>
            {state === 'preparing' ? (
                <div className="ap-up-progress" role="status">
                    <span className="ms-progress-bar is-wide" aria-hidden="true"><i style={{ width: '60%' }} /></span>
                    <p className="ms-p">Preparing your document…</p>
                    <p className="ms-muted ms-small">It opens in the editor when it&apos;s ready. Large files can take a minute.</p>
                </div>
            ) : (
                <Notice tone="error" title="This document couldn't be converted">
                    Check that it opens on your computer, then try again. If it&apos;s a Word file, saving it as a PDF first usually works.
                </Notice>
            )}
        </Dialog>
    );
};

export const TemplateUpload = ({ kind = 'form', state = 'choose' }) => {
    const on = usePatched();
    const View = kind === 'esign' ? ESignTemplatesView : FormTemplatesView;
    return (
        <AdminFrame nav="Library" sub={KIND[kind].sub} newBtn height={720} modal={on && <UploadDialog kind={kind} state={state} />}>
            <div className="tk-mount"><View /></div>
        </AdminFrame>
    );
};

/* ══ The editor ═════════════════════════════════════════════════════════ */

const FIELDS = {
    form: [
        { id: 'f1', label: 'Full name', top: 24, left: 8, w: 40, prefill: 'Client full name' },
        { id: 'f2', label: 'Date of birth', top: 24, left: 52, w: 26 },
        { id: 'f3', label: 'Case number', top: 36, left: 8, w: 30, prefill: 'Case number' },
        { id: 'f4', label: 'What happened', top: 48, left: 8, w: 84, h: 15 },
        { id: 'f5', label: 'Police called?', top: 69, left: 8, w: 22 },
    ],
    esign: [
        { id: 's1', label: 'Fee percentage', top: 28, left: 8, w: 22, who: 'Attorney' },
        { id: 's2', label: 'Client initials', top: 40, left: 70, w: 18, who: 'Client' },
        { id: 's3', label: 'Client signature', top: 64, left: 8, w: 38, who: 'Client' },
        { id: 's4', label: 'Attorney signature', top: 64, left: 54, w: 38, who: null },
        { id: 's5', label: 'Date signed', top: 76, left: 8, w: 24, who: null },
    ],
};

const TEXT = [92, 88, 70, 0, 94, 90, 86, 62, 0, 90, 84, 92, 76, 0, 88, 93, 58, 0, 0, 90, 80, 0, 0, 72];

const Tool = ({ label, children, disabled, title, caret }) => (
    <button type="button" className="ap-tool" aria-label={label} title={title || label} disabled={disabled}>
        {children}{caret && <Ico size={11} w={2.6}><polyline points="6 9 12 15 18 9" /></Ico>}
    </button>
);

const Toolbar = ({ uploaded }) => (
    <div className="ap-toolbar" role="toolbar" aria-label="Editor">
        <Tool label="Undo"><Ico size={16}><path d="M9 14 4 9l5-5" /><path d="M4 9h11a5 5 0 0 1 0 10h-3" /></Ico></Tool>
        <Tool label="Redo"><Ico size={16}><path d="m15 14 5-5-5-5" /><path d="M20 9H9a5 5 0 0 0 0 10h3" /></Ico></Tool>
        <span className="ap-tool-sep" />
        <Tool label="Align" caret><Ico size={16}><line x1="12" y1="2" x2="12" y2="22" /><rect x="6" y="6" width="12" height="4" rx="1" /><rect x="8" y="14" width="8" height="4" rx="1" /></Ico></Tool>
        <Tool label="Page editor" disabled={uploaded} title={uploaded ? 'Pages can\'t be added, moved or removed on an uploaded document' : 'Page editor'}>
            <Ico size={16}><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="9" rx="1" /><line x1="6" y1="17" x2="18" y2="17" /><line x1="12" y1="14" x2="12" y2="20" /></Ico>
            <span className="ap-tool-text">Pages</span>
        </Tool>
        <span className="ap-tool-sep" />
        <button type="button" className="btn btn-secondary btn-sm ap-addfield"><Icon name="plus" size={14} w={2.6} />Add field<Ico size={11} w={2.6}><polyline points="6 9 12 15 18 9" /></Ico></button>
        {uploaded && <span className="ap-tool-note"><Icon name="lock" size={12} />Page tools are off for an uploaded document</span>}
    </div>
);

const SaveState = ({ state }) => {
    if (state === 'failed') {
        return (
            <span className="ap-sign is-err" role="alert">
                <Icon name="alert" size={13} />Couldn&apos;t save
                <button type="button" className="btn btn-link ap-retry"><Icon name="refresh" size={12} />Retry</button>
            </span>
        );
    }
    if (state === 'saving') return <span className="ap-sign" role="status"><span className="cw-spin" aria-hidden="true" />Saving…</span>;
    return <span className="ap-sign is-ok" role="status"><Icon name="check" size={13} w={2.8} />All changes saved</span>;
};

const PREFILL = ['None', 'Client full name', 'Client email', 'Client phone', 'Case number', 'Case title', 'Today\'s date'];

const FieldLogic = ({ kind, field, onClose }) => {
    const [who, setWho] = useState(field.who || '');
    return (
        <Dialog title="Field Logic" sub={field.label} width={520} onClose={onClose}
            footer={<>
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={onClose}>Save</button>
            </>}>
            <div className="ccm-field">
                <label className="ccm-label" htmlFor="ap-prefill">Prefill data</label>
                <SearchableSelect id="ap-prefill" className="ccm-select" defaultValue={field.prefill || 'None'}>
                    {PREFILL.map(p => <option key={p}>{p}</option>)}
                </SearchableSelect>
                <span className="ccm-hint">Filled in from the case when the {KIND[kind].noun} is sent. The person can still change it.</span>
            </div>
            {kind === 'esign' && (
                <div className="ccm-field">
                    <label className="ccm-label" htmlFor="ap-who">Participant</label>
                    <SearchableSelect id="ap-who" className="ccm-select" value={who} onChange={e => setWho(e.target.value)}>
                        <option value="">Choose who fills it in</option>
                        <option>Client</option>
                        <option>Attorney</option>
                    </SearchableSelect>
                    {!who && (
                        <Notice tone="warning">No participant is set, so nobody can fill in this field. You can save now and choose one later; the template can&apos;t be sent until every field has one.</Notice>
                    )}
                </div>
            )}
        </Dialog>
    );
};

const LeaveDialog = () => (
    <Dialog title="Leave without saving?" width={480} onClose={() => {}}
        footer={<>
            <button type="button" className="btn btn-secondary ms-danger-outline">Leave anyway</button>
            <button type="button" className="btn btn-primary"><Icon name="refresh" size={14} />Retry</button>
        </>}>
        <p className="ms-p">Your last changes couldn&apos;t be saved. Retry to save them, or leave and lose them.</p>
    </Dialog>
);

/* state: editing | failed | leaving | logic | published
   untitled: the name was never set */
export const TemplateEditor = ({ kind = 'form', state = 'editing', untitled = false, phone = false }) => {
    const on = usePatched();
    const k = KIND[kind];
    const fields = FIELDS[kind];
    const published = state === 'published';
    const [mode, setMode] = useState('edit');
    const [sel, setSel] = useState(published ? null : fields[kind === 'esign' ? 3 : 0].id);
    const [logic, setLogic] = useState(state === 'logic');
    const field = fields.find(f => f.id === sel);
    const unassigned = kind === 'esign' ? fields.filter(f => !f.who) : [];
    const preview = mode === 'preview' || published;

    const title = untitled
        ? <span className="ap-title is-untitled">Untitled {k.noun} template<button type="button" className="ap-rename" aria-label="Name this template"><Icon name="pen" size={13} /></button></span>
        : <span className="ap-title">{k.name}{!published && <button type="button" className="ap-rename" aria-label={`Rename ${k.name}`}><Icon name="pen" size={13} /></button>}</span>;

    const body = (
        <>
            {published && <Notice tone="info">This template is published, so it&apos;s read-only.</Notice>}
            {state === 'failed' && <Notice tone="error" title="Your last change couldn't be saved">Check your connection, then Retry. Everything before it is saved.</Notice>}
            {!published && unassigned.length > 0 && (
                <Notice tone="warning">{unassigned.length} fields have no participant, so nobody can fill them in. Click one, then Field Logic, to choose who does.</Notice>
            )}
            <div className="ap-editor">
                {!preview && <Toolbar uploaded />}
                <div className="ap-canvas">
                    <div className="ms-paper ap-page">
                        <p className="ms-paper-heading">{untitled ? k.file.replace(/\.\w+$/, '') : k.name}</p>
                        <Lines widths={TEXT} />
                        {fields.map(f => (
                            <button key={f.id} type="button"
                                className={`ap-field${f.id === sel && !preview ? ' is-sel' : ''}${kind === 'esign' && !f.who ? ' is-nobody' : ''}${preview ? ' is-preview' : ''}`}
                                style={{ top: `${f.top}%`, left: `${f.left}%`, width: `${f.w}%`, height: f.h ? `${f.h}%` : undefined }}
                                onClick={() => !preview && setSel(f.id)} disabled={published} aria-pressed={f.id === sel}>
                                <span>{f.label}</span>
                                {kind === 'esign' && !preview && <em>{f.who || 'No participant'}</em>}
                            </button>
                        ))}
                        {field && !preview && (
                            <div className="ap-fieldbar" style={{
                                top: `calc(${field.top}% - 40px)`,
                                /* Fields on the right half anchor the bar to their right edge, so it stays on the page. */
                                ...(field.left > 50 ? { right: `${100 - field.left - field.w}%` } : { left: `${field.left}%` }),
                            }}>
                                <button type="button" onClick={() => setLogic(true)}><Ico size={13}><circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" /></Ico>Field Logic</button>
                                <button type="button"><Icon name="copy" size={13} />Duplicate</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );

    const frame = (
        <AdminFrame
            nav="Library" sub={k.sub} height={phone ? undefined : 860}
            title={title} breadcrumb={`Library · ${k.sub}${untitled ? ' · New' : ''}`}
            actions={on && (
                <div className="ap-head-actions">
                    {published ? <StatusPill status="published" /> : <span className="cw-hide-phone"><SaveState state={state === 'failed' || state === 'leaving' ? 'failed' : 'saved'} /></span>}
                    {!published && (
                        <div className="ms-seg" role="tablist" aria-label="Mode">
                            <button type="button" role="tab" aria-selected={mode === 'edit'} className={mode === 'edit' ? 'is-on' : ''} onClick={() => setMode('edit')}>Edit</button>
                            <button type="button" role="tab" aria-selected={mode === 'preview'} className={mode === 'preview' ? 'is-on' : ''} onClick={() => setMode('preview')}>Preview</button>
                        </div>
                    )}
                    <button type="button" className="btn btn-secondary">Close</button>
                </div>
            )}
            modal={on && ((state === 'leaving' && <LeaveDialog />) || (logic && field && <FieldLogic kind={kind} field={field} onClose={() => setLogic(false)} />))}
        >
            {on ? body : <NotBuilt what="editor body" today={'In the sandbox the editor opens on "PDF preview will appear here", with no fields. Live, an unnamed template is titled "Create New Doc Form Builder".'} />}
        </AdminFrame>
    );
    return phone ? <Phone>{frame}</Phone> : frame;
};
