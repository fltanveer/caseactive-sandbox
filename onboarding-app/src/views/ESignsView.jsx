import { useState } from 'react';
import SearchableSelect from '../components/SearchableSelect';
import InfoBanner from '../components/InfoBanner';
import './library/LibraryViews.css';
import './EventsView.css';
import './FormsView.css';
import './ESignsView.css';

export const ESIGNS_DATA = [
    {
        id: 'esn-001', title: 'Retainer Agreement', author: 'Virtual Assistant',
        date: '2026-06-03', time: '02:41', repeat: 'Does not repeat',
        notifications: ['When event starts'],
        description: 'Engagement agreement between the firm and the client.',
        published: true, submitted: 0, total: 2, completed: false,
    },
    {
        id: 'esn-002', title: 'Release Authorization', author: 'Virtual Assistant',
        date: '2026-06-03', time: '02:41', repeat: 'Does not repeat',
        notifications: [],
        description: 'HIPAA-style records release authorization.',
        published: true, submitted: 2, total: 2, completed: true,
    },
    {
        id: 'esn-003', title: 'Contingency Fee Addendum', author: 'Ar Tanveer',
        date: '2026-08-23', time: '01:30', repeat: 'Does not repeat',
        notifications: ['When event starts', '15 minutes before'],
        description: 'Adjusts the fee split after the case moves into litigation.',
        published: false, submitted: 0, total: 1, completed: false,
    },
    {
        id: 'esn-004', title: 'Settlement Disbursement Authorization', author: 'Sara Chen',
        date: '2026-09-01', time: '09:00', repeat: 'Does not repeat',
        notifications: ['1 day before'],
        description: 'Authorizes the firm to disburse settlement funds per the statement.',
        published: false, submitted: 0, total: 1, completed: false,
    },
];

/* Library e-sign templates a case e-sign can be started from */
const ESIGN_TEMPLATES = [
    { id: 'etpl-1', title: 'Retainer Agreement',        description: 'Engagement agreement between the firm and the client.' },
    { id: 'etpl-2', title: 'Release Authorization',     description: 'HIPAA-style records release authorization.' },
    { id: 'etpl-3', title: 'Contingency Fee Addendum',  description: 'Adjusts the fee split after the case moves into litigation.' },
    { id: 'etpl-4', title: 'Medical Lien Acknowledgement', description: 'Client acknowledges provider liens against the recovery.' },
];

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

const BLANK_ESIGN = {
    title: '', time: '09:00', repeat: 'Does not repeat',
    notifications: ['When event starts', '15 minutes before'], description: '',
};

/* One modal, three modes:
   'add'  — blank, with a New / Templates switch and a Create Sign footer
   'edit' — prefilled draft, saves back to the row
   'view' — published e-sign, every control read-only */
const ESignSettingsModal = ({ row, mode = 'edit', onClose, onSave }) => {
    const readOnly = mode === 'view';
    const isAdd = mode === 'add';

    const [source, setSource]        = useState('new');
    const [title, setTitle]          = useState(row.title);
    const [date, setDate]            = useState(row.date);
    const [time, setTime]            = useState(row.time);
    const [repeat, setRepeat]        = useState(row.repeat);
    const [notifications, setNotifs] = useState(row.notifications);
    const [description, setDesc]     = useState(row.description);
    const [notifOpen, setNotifOpen]  = useState(false);

    const canSave = !!title.trim();

    /* Picking a template fills the form and drops the user back on New, where
       the due date still has to be confirmed before it can save. */
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
        onSave({ ...row, title: title.trim(), date, time, repeat, notifications, description });
        onClose();
    };

    const heading = isAdd ? 'Add E-Sign' : readOnly ? 'View Settings' : 'Edit E-Sign';

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="ccm afm-modal" onClick={e => e.stopPropagation()}>

                <div className="ccm-header">
                    <div>
                        <p className="ccm-breadcrumb">E-signs · {isAdd ? 'New' : row.title}</p>
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
                            {ESIGN_TEMPLATES.map(t => (
                                <button key={t.id} className="cfm-template-card" onClick={() => useTemplate(t)}>
                                    <span className="cfm-template-icon">
                                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
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
                            This e-sign is published and out for signature. Unpublish it to make changes.
                        </div>
                    )}

                    <div className="ccm-field">
                        <label className="ccm-label">Title <span className="ccm-req">*</span></label>
                        <input className="ccm-input" value={title} disabled={readOnly} onChange={e => setTitle(e.target.value)} />
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
                            placeholder="What is this document for?"
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
                                <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Create Sign</>
                            ) : (
                                <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Update Sign</>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ── Full-screen document editor — same shell as the Library form editor ── */
const ESignEditorModal = ({ row, signing = false, onClose, onSubmit }) => (
    <div className="fed-overlay">
        <div className="fed-topbar">
            <button className="fed-back-btn" onClick={onClose}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                Back
            </button>
            <div className="fed-topbar-title">
                <p className="fed-breadcrumb">E-signs · {signing ? 'Submit E-Sign' : 'Edit E-Sign'}</p>
                <h2 className="fed-title">{row.title}</h2>
            </div>
            {signing ? (
                <button className="imp-save-btn" onClick={() => { onSubmit(row.id); onClose(); }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17s3-6 6-6 3 4 6 4 6-6 6-6"/><path d="M3 21h18"/></svg> Submit E-Sign
                </button>
            ) : (
                <button className="imp-save-btn" onClick={onClose}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Save Changes
                </button>
            )}
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
                <h3 className="confirm-modal-title">Delete E-Sign</h3>
                <button className="confirm-modal-close" onClick={onCancel}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
            <div className="confirm-modal-body">
                <p className="confirm-modal-text">Are you sure you want to delete <strong>"{title}"</strong>? Any signatures already collected on it are removed too. This action cannot be undone.</p>
            </div>
            <div className="confirm-modal-footer">
                <button className="confirm-modal-cancel" onClick={onCancel}>Cancel</button>
                <button className="confirm-modal-confirm" style={{ background: '#DC2626', borderColor: '#DC2626' }} onClick={onConfirm}>Delete</button>
            </div>
        </div>
    </div>
);

const TABS = [
    { id: 'uncompleted', label: 'Your Uncompleted E-signs' },
    { id: 'completed',   label: 'Your Completed E-signs'   },
    { id: 'all',         label: 'All E-signs'              },
];

const ESignsView = ({ embedded = false, createOpen = false, onCloseCreate }) => {
    const [tab, setTab]                 = useState('uncompleted');
    const [rows, setRows]               = useState(ESIGNS_DATA);
    const [settingsTarget, setSettings] = useState(null);
    const [localAddOpen, setLocalAddOpen] = useState(false);
    /* Embedded in the case view the NEW button sits in the page header, so the
       open flag is owned there; standalone, this view owns it. */
    const addOpen   = embedded ? createOpen : localAddOpen;
    const closeAdd  = embedded ? onCloseCreate : () => setLocalAddOpen(false);
    const [editorTarget, setEditor]     = useState(null);
    const [deleteTarget, setDelete]     = useState(null);
    const [search, setSearch]           = useState('');

    const matchesTab = (r, id) => (id === 'all' ? true : id === 'completed' ? r.completed : !r.completed);

    const filtered = rows
        .filter(r => matchesTab(r, tab))
        .filter(r => r.title.toLowerCase().includes(search.trim().toLowerCase()));

    const togglePublished = (id) => setRows(prev => prev.map(r => (r.id === id ? { ...r, published: !r.published } : r)));
    const updateRow = (data) => setRows(prev => prev.map(r => (r.id === data.id ? data : r)));
    const addRow = (data) => setRows(prev => [
        { ...data, id: `esn-${Date.now()}`, author: 'Ar Tanveer', published: false, submitted: 0, total: 1, completed: false },
        ...prev,
    ]);
    const duplicateRow = (id) => setRows(prev => {
        const idx = prev.findIndex(r => r.id === id);
        /* A copy starts as an unsent draft — carrying signatures over would
           credit the new document with signatures nobody gave it. */
        const copy = {
            ...prev[idx], id: `esn-${Date.now()}`, title: `${prev[idx].title} (copy)`,
            published: false, submitted: 0, completed: false,
        };
        const next = [...prev];
        next.splice(idx + 1, 0, copy);
        return next;
    });
    const removeRow = (id) => setRows(prev => prev.filter(r => r.id !== id));
    const submitSignature = (id) => setRows(prev => prev.map(r => (
        r.id === id ? { ...r, submitted: Math.min(r.submitted + 1, r.total), completed: true } : r
    )));

    return (
        <div className="forms-page">
            {settingsTarget && (
                <ESignSettingsModal
                    row={settingsTarget.row}
                    mode={settingsTarget.mode}
                    onClose={() => setSettings(null)}
                    onSave={updateRow}
                />
            )}
            {addOpen && (
                <ESignSettingsModal
                    mode="add"
                    row={{ ...BLANK_ESIGN, date: new Date().toISOString().slice(0, 10) }}
                    onClose={closeAdd}
                    onSave={addRow}
                />
            )}
            {editorTarget && (
                <ESignEditorModal
                    row={editorTarget.row}
                    signing={editorTarget.signing}
                    onClose={() => setEditor(null)}
                    onSubmit={submitSignature}
                />
            )}
            {deleteTarget && (
                <DeleteConfirmModal
                    title={deleteTarget.title}
                    onCancel={() => setDelete(null)}
                    onConfirm={() => { removeRow(deleteTarget.id); setDelete(null); }}
                />
            )}

            <InfoBanner message="E-signs send documents out for signature. Publish one to make it available to its signers." />

            <div className="ev-tabs-outer-embedded">
                <div className="ev-tabs-bar">
                    {TABS.map(t => (
                        <button key={t.id} className={`ev-tab${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
                            {t.label}
                            <span className="cfm-tab-count">{rows.filter(r => matchesTab(r, t.id)).length}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="forms-view">
            <div className="hubs-table">
                <div className="hubs-toolbar">
                    <div className="hubs-search">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        <input type="text" className="hubs-search-input" placeholder="Search e-signs..." value={search} onChange={e => setSearch(e.target.value)} />
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
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            <p>No e-signs found.</p>
                        </div>
                    ) : filtered.map(r => (
                        <div key={r.id} className="cfm-table-row">
                            <span className="cases-title-cell" data-label="Title">
                                {r.title}
                                {!r.published && <span className="cfm-draft-badge">Draft</span>}
                                {r.completed && <span className="esn-signed-badge">Signed</span>}
                            </span>
                            <span className="cases-cell-muted" data-label="Author">{r.author}</span>
                            <span data-label="Due Date">
                                <span className={`cfm-due${isOverdue(r) ? ' overdue' : ''}`}>
                                    {dueLabel(r)}
                                    {r.repeat !== 'Does not repeat' && <span className="cfm-repeat-tag">{r.repeat}</span>}
                                </span>
                            </span>
                            <span data-label="Published">
                                <label className="user-switch" title={r.published ? 'Unpublish e-sign' : 'Publish e-sign'}>
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
                                        <>
                                            <button
                                                className="ft-icon-btn sign"
                                                title={r.completed ? 'Already signed' : 'Submit E-Sign'}
                                                disabled={r.completed}
                                                onClick={() => setEditor({ row: r, signing: true })}
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17s3-6 6-6 3 4 6 4 6-6 6-6"/><path d="M3 21h18"/></svg>
                                            </button>
                                            <button className="ft-icon-btn" title="View Settings" onClick={() => setSettings({ row: r, mode: 'view' })}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button className="ft-icon-btn" title="Edit Settings" onClick={() => setSettings({ row: r, mode: 'edit' })}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                                            </button>
                                            <button className="ft-icon-btn" title="Edit E-Sign" onClick={() => setEditor({ row: r, signing: false })}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                            </button>
                                        </>
                                    )}
                                    <button className="ft-icon-btn" title="Duplicate E-Sign" onClick={() => duplicateRow(r.id)}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                                    </button>
                                    <button className="ft-icon-btn delete" title="Delete E-Sign" onClick={() => setDelete(r)}>
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

export default ESignsView;
