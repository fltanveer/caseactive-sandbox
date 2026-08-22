import { useState } from 'react';
import { MultiSelect } from '../components/MultiSelect';
import SearchableSelect from '../components/SearchableSelect';
import InfoBanner from '../components/InfoBanner';
import './library/LibraryViews.css';
import './EventsView.css';
import './FormsView.css';

const FORMS_DATA = [
    {
        id: 'frm-001', title: 'Case Intake Form', author: 'Ar Tanveer',
        date: '2026-08-23', time: '01:30', repeat: 'Does not repeat',
        recipients: ['Ar Tanveer'],
        notifications: ['When event starts', '15 minutes before'],
        description: 'Client provides case-specific information needed to start work.',
        published: false, submitted: 0, total: 1, completed: false,
    },
    {
        id: 'frm-002', title: 'Accident Details Questionnaire', author: 'Ar Tanveer',
        date: '2026-08-23', time: '01:30', repeat: 'Does not repeat',
        recipients: ['Ar Tanveer'],
        notifications: ['When event starts'],
        description: 'Where, when and how the collision happened, plus witness contacts.',
        published: false, submitted: 0, total: 1, completed: false,
    },
    {
        id: 'frm-003', title: 'Medical Provider Authorization', author: 'Virtual Assistant',
        date: '2026-06-03', time: '02:41', repeat: 'Does not repeat',
        recipients: ['Tech Support'],
        notifications: [],
        description: 'Authorizes us to request records from each treating provider.',
        published: true, submitted: 1, total: 1, completed: true,
    },
    {
        id: 'frm-004', title: 'Lost Wages Declaration', author: 'Sara Chen',
        date: '2026-07-14', time: '09:00', repeat: 'Monthly',
        recipients: ['Ar Tanveer', 'Sara Chen'],
        notifications: ['1 day before'],
        description: 'Employer, hourly rate and days missed since the date of loss.',
        published: true, submitted: 0, total: 2, completed: false,
    },
];

/* Library form templates a case form can be started from */
const FORM_TEMPLATES = [
    { id: 'tpl-1', title: 'Case Intake Form',              description: 'Client provides case-specific information needed to start work.' },
    { id: 'tpl-2', title: 'Accident Details Questionnaire', description: 'Where, when and how the collision happened, plus witness contacts.' },
    { id: 'tpl-3', title: 'Medical Provider Authorization', description: 'Authorizes us to request records from each treating provider.' },
    { id: 'tpl-4', title: 'Lost Wages Declaration',         description: 'Employer, hourly rate and days missed since the date of loss.' },
    { id: 'tpl-5', title: 'HIPAA Release',                  description: 'Standard release letting providers share records with the firm.' },
];

const RECIPIENT_OPTIONS = ['Ar Tanveer', 'Jordan Admin', 'Sara Chen', 'Mike Torres', 'Tech Support'];
const REPEAT_OPTIONS = ['Does not repeat', 'Daily', 'Weekly', 'Monthly'];
const NOTIFICATION_OPTIONS = [
    'When event starts', '15 minutes before', '30 minutes before',
    '1 hour before', '1 day before',
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/* Parse as local time — `new Date('2026-08-23')` is UTC and can slip a day. */
const parseDate = (iso) => {
    const [y, m, d] = (iso || '').split('-').map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
};

const dueLabel = ({ date, time }) => {
    const d = parseDate(date);
    const [h, min] = time.split(':').map(Number);
    const ampm = h < 12 ? 'AM' : 'PM';
    return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${h % 12 || 12}:${String(min).padStart(2, '0')} ${ampm}`;
};

const isOverdue = (row) => {
    const d = parseDate(row.date);
    const [h, min] = row.time.split(':').map(Number);
    d.setHours(h, min);
    return !row.completed && d < new Date();
};

const BLANK_FORM = {
    title: '', recipients: [], time: '09:00', repeat: 'Does not repeat',
    notifications: ['When event starts', '15 minutes before'], description: '',
};

/* One modal, three modes:
   'add'  — blank, with a New / Templates switch and a Create Form footer
   'edit' — prefilled draft, saves back to the row
   'view' — published form, every control read-only */
const FormSettingsModal = ({ row, mode = 'edit', onClose, onSave }) => {
    const readOnly = mode === 'view';
    const isAdd = mode === 'add';

    const [source, setSource]       = useState('new');
    const [title, setTitle]         = useState(row.title);
    const [recipients, setRecips]   = useState(row.recipients);
    const [date, setDate]           = useState(row.date);
    const [time, setTime]           = useState(row.time);
    const [repeat, setRepeat]       = useState(row.repeat);
    const [notifications, setNotifs] = useState(row.notifications);
    const [description, setDesc]    = useState(row.description);
    const [notifOpen, setNotifOpen] = useState(false);

    const canSave = title.trim() && recipients.length > 0;

    /* Picking a template fills the form and drops the user back on New, where
       they still have to choose recipients and a due date before it can save. */
    const useTemplate = (t) => {
        setTitle(t.title);
        setDesc(t.description);
        setSource('new');
    };

    const addNotif = (val) => {
        if (!notifications.includes(val)) setNotifs(prev => [...prev, val]);
        setNotifOpen(false);
    };
    const removeNotif = (val) => setNotifs(prev => prev.filter(n => n !== val));

    const save = () => {
        if (!canSave) return;
        onSave({ ...row, title: title.trim(), recipients, date, time, repeat, notifications, description });
        onClose();
    };

    const heading = isAdd ? 'Add Form' : readOnly ? 'View Settings' : 'Edit Settings';

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="ccm afm-modal" onClick={e => e.stopPropagation()}>

                <div className="ccm-header">
                    <div>
                        <p className="ccm-breadcrumb">Forms · {isAdd ? 'New' : row.title}</p>
                        <h2 className="ccm-title">{heading}</h2>
                    </div>
                    <button className="ccm-close" onClick={onClose}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                <div className="ccm-body">
                    {isAdd && (
                        <div className="ev-tabs-bar cfm-source-tabs">
                            <button className={`ev-tab${source === 'new' ? ' active' : ''}`} onClick={() => setSource('new')}>New</button>
                            <button className={`ev-tab${source === 'templates' ? ' active' : ''}`} onClick={() => setSource('templates')}>Templates</button>
                        </div>
                    )}

                    {isAdd && source === 'templates' ? (
                        <div className="cfm-template-list">
                            {FORM_TEMPLATES.map(t => (
                                <button key={t.id} className="cfm-template-card" onClick={() => useTemplate(t)}>
                                    <span className="cfm-template-icon">
                                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="m9 12 2 2 4-4"/></svg>
                                    </span>
                                    <span className="cfm-template-text">
                                        <span className="cfm-template-title">{t.title}</span>
                                        <span className="cfm-template-desc">{t.description}</span>
                                    </span>
                                    <svg className="cfm-template-arrow" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                                </button>
                            ))}
                        </div>
                    ) : (
                    <>
                    {readOnly && (
                        <div className="cfm-locked-note">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            This form is published and has been sent to its recipients. Unpublish it to make changes.
                        </div>
                    )}

                    <div className="ccm-field">
                        <label className="ccm-label">Title <span className="ccm-req">*</span></label>
                        <input className="ccm-input" value={title} disabled={readOnly} onChange={e => setTitle(e.target.value)} />
                    </div>

                    <div className="ccm-field">
                        <label className="ccm-label">Recipients <span className="ccm-req">*</span></label>
                        {readOnly ? (
                            <div className="cfm-readonly-chips">
                                {recipients.map(r => <span key={r} className="afm-notif-chip cfm-chip-static">{r}</span>)}
                            </div>
                        ) : (
                            <MultiSelect options={RECIPIENT_OPTIONS} value={recipients} onChange={setRecips} placeholder="Select recipients" />
                        )}
                    </div>

                    <div className="cfm-due-grid">
                        <div className="ccm-field">
                            <label className="ccm-label">Due Date <span className="ccm-req">*</span></label>
                            <input type="date" className="ccm-input" value={date} disabled={readOnly} onChange={e => setDate(e.target.value)} />
                        </div>
                        <div className="ccm-field">
                            <label className="ccm-label">Due Time <span className="ccm-req">*</span></label>
                            <input type="time" className="ccm-input" value={time} disabled={readOnly} onChange={e => setTime(e.target.value)} />
                        </div>
                        <div className="ccm-field">
                            <label className="ccm-label">Repeat</label>
                            {readOnly ? (
                                <input className="ccm-input" value={repeat} disabled />
                            ) : (
                                <SearchableSelect value={repeat} onChange={e => setRepeat(e.target.value)}>
                                    {REPEAT_OPTIONS.map(o => <option key={o}>{o}</option>)}
                                </SearchableSelect>
                            )}
                        </div>
                    </div>

                    <div className="ccm-field">
                        <label className="ccm-label">Notifications</label>
                        {readOnly ? (
                            <div className="cfm-readonly-chips">
                                {notifications.length === 0
                                    ? <span className="cfm-empty-note">No reminders set.</span>
                                    : notifications.map(n => <span key={n} className="afm-notif-chip cfm-chip-static">{n}</span>)}
                            </div>
                        ) : (
                            <div className="afm-notif-box">
                                {notifications.map(n => (
                                    <span key={n} className="afm-notif-chip">
                                        <button className="afm-chip-remove" onClick={() => removeNotif(n)}>
                                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                        </button>
                                        {n}
                                    </span>
                                ))}
                                <div className="afm-notif-add-wrap">
                                    <button className="afm-notif-add-btn" onClick={() => setNotifOpen(o => !o)}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                    </button>
                                    {notifOpen && (
                                        <div className="afm-notif-dropdown">
                                            {NOTIFICATION_OPTIONS.filter(o => !notifications.includes(o)).map(o => (
                                                <button key={o} className="afm-notif-opt" onClick={() => addNotif(o)}>{o}</button>
                                            ))}
                                            {NOTIFICATION_OPTIONS.every(o => notifications.includes(o)) && (
                                                <span className="afm-notif-opt" style={{ color: '#9CA3AF', cursor: 'default' }}>All added</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="ccm-field">
                        <label className="ccm-label">Description</label>
                        <textarea
                            className="ccm-input afm-textarea"
                            placeholder="What is this form for?"
                            value={description}
                            disabled={readOnly}
                            onChange={e => setDesc(e.target.value)}
                        />
                    </div>
                    </>
                    )}
                </div>

                <div className="ccm-footer">
                    <button className="imp-cancel-btn" onClick={onClose}>{readOnly ? 'Close' : 'Cancel'}</button>
                    {!readOnly && !(isAdd && source === 'templates') && (
                        <button className="imp-save-btn" disabled={!canSave} onClick={save}>
                            {isAdd ? (
                                <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Create Form</>
                            ) : (
                                <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Save Changes</>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ── Full-screen form editor — same shell as the Library form editor ── */
const FormEditorModal = ({ row, onClose }) => (
    <div className="fed-overlay">
        <div className="fed-topbar">
            <button className="fed-back-btn" onClick={onClose}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                Back
            </button>
            <div className="fed-topbar-title">
                <p className="fed-breadcrumb">Forms · Edit Form</p>
                <h2 className="fed-title">{row.title}</h2>
            </div>
            <button className="imp-save-btn" onClick={onClose}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Save Changes
            </button>
        </div>
        <div className="fed-body">
            <div className="fed-pdf-placeholder">
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <p className="fed-pdf-placeholder-text">PDF preview will appear here</p>
            </div>
        </div>
    </div>
);

const DeleteConfirmModal = ({ title, onConfirm, onCancel }) => (
    <div className="modal-overlay" onClick={onCancel}>
        <div className="confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="confirm-modal-header">
                <h3 className="confirm-modal-title">Delete Form</h3>
                <button className="confirm-modal-close" onClick={onCancel}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
            <div className="confirm-modal-body">
                <p className="confirm-modal-text">Are you sure you want to delete <strong>"{title}"</strong>? Any submissions collected on it are removed too. This action cannot be undone.</p>
            </div>
            <div className="confirm-modal-footer">
                <button className="confirm-modal-cancel" onClick={onCancel}>Cancel</button>
                <button className="confirm-modal-confirm" style={{ background: '#DC2626', borderColor: '#DC2626' }} onClick={onConfirm}>Delete</button>
            </div>
        </div>
    </div>
);

const TABS = [
    { id: 'uncompleted', label: 'Your Uncompleted Forms' },
    { id: 'completed',   label: 'Your Completed Forms'   },
    { id: 'all',         label: 'All Forms'              },
];

const FormsView = ({ embedded = false, createOpen = false, onCloseCreate }) => {
    const [tab, setTab]                 = useState('uncompleted');
    const [rows, setRows]               = useState(FORMS_DATA);
    const [settingsTarget, setSettings] = useState(null);
    const [localAddOpen, setLocalAddOpen] = useState(false);
    /* Embedded in the case view the NEW button sits in the page header, so the
       open flag is owned there; standalone, this view owns it. */
    const addOpen   = embedded ? createOpen : localAddOpen;
    const closeAdd  = embedded ? onCloseCreate : () => setLocalAddOpen(false);
    const [editorTarget, setEditor]     = useState(null);
    const [deleteTarget, setDelete]     = useState(null);
    const [search, setSearch]           = useState('');

    const filtered = rows
        .filter(r => (tab === 'all' ? true : tab === 'completed' ? r.completed : !r.completed))
        .filter(r => r.title.toLowerCase().includes(search.trim().toLowerCase()));

    const togglePublished = (id) => setRows(prev => prev.map(r => (r.id === id ? { ...r, published: !r.published } : r)));
    const updateRow = (data) => setRows(prev => prev.map(r => (r.id === data.id ? data : r)));
    const duplicateRow = (id) => setRows(prev => {
        const idx = prev.findIndex(r => r.id === id);
        /* A copy starts as an unsent draft — carrying submissions over would
           credit the new form with responses nobody gave it. */
        const copy = {
            ...prev[idx], id: `frm-${Date.now()}`, title: `${prev[idx].title} (copy)`,
            published: false, submitted: 0, completed: false,
        };
        const next = [...prev];
        next.splice(idx + 1, 0, copy);
        return next;
    });
    const removeRow = (id) => setRows(prev => prev.filter(r => r.id !== id));
    const addRow = (data) => setRows(prev => [
        { ...data, id: `frm-${Date.now()}`, author: 'Ar Tanveer', published: false, submitted: 0, total: data.recipients.length, completed: false },
        ...prev,
    ]);

    return (
        <div className="forms-page">
            {settingsTarget && (
                <FormSettingsModal
                    row={settingsTarget.row}
                    mode={settingsTarget.mode}
                    onClose={() => setSettings(null)}
                    onSave={updateRow}
                />
            )}
            {addOpen && (
                <FormSettingsModal
                    mode="add"
                    row={{ ...BLANK_FORM, date: new Date().toISOString().slice(0, 10) }}
                    onClose={closeAdd}
                    onSave={addRow}
                />
            )}
            {editorTarget && <FormEditorModal row={editorTarget} onClose={() => setEditor(null)} />}
            {deleteTarget && (
                <DeleteConfirmModal
                    title={deleteTarget.title}
                    onCancel={() => setDelete(null)}
                    onConfirm={() => { removeRow(deleteTarget.id); setDelete(null); }}
                />
            )}

            <InfoBanner message="Forms collect case information from clients and team members. Publish a form to send it to its recipients." />

            <div className="ev-tabs-outer-embedded">
                <div className="ev-tabs-bar">
                    {TABS.map(t => (
                        <button key={t.id} className={`ev-tab${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
                            {t.label}
                            <span className="cfm-tab-count">
                                {rows.filter(r => (t.id === 'all' ? true : t.id === 'completed' ? r.completed : !r.completed)).length}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="forms-view">
            <div className="hubs-table">
                <div className="hubs-toolbar">
                    <div className="hubs-search">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        <input type="text" className="hubs-search-input" placeholder="Search forms..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>

                <div className="cfm-table-wrap">
                    <div className="cfm-table-head">
                        <span>TITLE</span>
                        <span>AUTHOR</span>
                        <span>DUE DATE</span>
                        <span>PUBLISHED</span>
                        <span>SUBMISSIONS</span>
                        <span>ACTION</span>
                    </div>

                    {filtered.length === 0 ? (
                        <div className="cfm-empty">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="m9 12 2 2 4-4"/></svg>
                            <p>No forms found.</p>
                        </div>
                    ) : filtered.map(r => (
                        <div key={r.id} className="cfm-table-row">
                            <span className="cases-title-cell" data-label="Title">
                                {r.title}
                                {!r.published && <span className="cfm-draft-badge">Draft</span>}
                            </span>
                            <span className="cases-cell-muted" data-label="Author">{r.author}</span>
                            <span data-label="Due Date">
                                <span className={`cfm-due${isOverdue(r) ? ' overdue' : ''}`}>
                                    {dueLabel(r)}
                                    {r.repeat !== 'Does not repeat' && <span className="cfm-repeat-tag">{r.repeat}</span>}
                                </span>
                            </span>
                            <span data-label="Published">
                                <label className="user-switch" title={r.published ? 'Unpublish form' : 'Publish form'}>
                                    <input type="checkbox" checked={r.published} onChange={() => togglePublished(r.id)} />
                                    <span className="user-switch-slider" />
                                </label>
                            </span>
                            <span data-label="Submissions">
                                <span className={`cfm-submissions${r.submitted >= r.total ? ' done' : ''}`}>
                                    {r.submitted} of {r.total}
                                </span>
                            </span>
                            <span data-label="Action">
                                <span className="ft-action-wrap">
                                    {r.published ? (
                                        <button className="ft-icon-btn" title="View Settings" onClick={() => setSettings({ row: r, mode: 'view' })}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                        </button>
                                    ) : (
                                        <>
                                            <button className="ft-icon-btn" title="Edit Settings" onClick={() => setSettings({ row: r, mode: 'edit' })}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                                            </button>
                                            <button className="ft-icon-btn" title="Edit Form" onClick={() => setEditor(r)}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                            </button>
                                        </>
                                    )}
                                    <button className="ft-icon-btn" title="Duplicate Form" onClick={() => duplicateRow(r.id)}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                                    </button>
                                    <button className="ft-icon-btn delete" title="Delete Form" onClick={() => setDelete(r)}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                                    </button>
                                </span>
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            </div>{/* /forms-view */}
        </div>
    );
};

export default FormsView;
