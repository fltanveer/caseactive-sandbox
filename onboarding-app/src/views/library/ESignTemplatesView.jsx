import { useState } from 'react';
import { PERMISSION_OPTIONS, MultiSelect } from '../../components/MultiSelect';
import InfoBanner from '../../components/InfoBanner';
import './LibraryViews.css';

const ESIGN_TEMPLATES_DATA = [
    { id: 'est-001', title: 'Retainer Agreement',   createdOn: 'May 16, 6:53 PM', permissions: ['staff', 'bots'], status: 'Ready', published: true,  description: 'Engagement agreement between the firm and the client.' },
    { id: 'est-002', title: 'Release Authorization', createdOn: 'May 16, 6:53 PM', permissions: ['staff', 'bots'], status: 'Ready', published: true,  description: '' },
];

const NOTIFICATION_OPTIONS = [
    'When event starts', '15 minutes before', '30 minutes before',
    '1 hour before', '1 day before',
];

const shortId = (id) => 'sign...' + id.slice(-12);

/* ── Shared modal body (used by both Add and Settings modals) ── */
const ESignModalBody = ({ title, setTitle, perms, setPerms, notifications, setNotifs, description, setDesc }) => {
    const [notifOpen, setNotifOpen] = useState(false);

    const addNotif = (val) => {
        if (!notifications.includes(val)) setNotifs(prev => [...prev, val]);
        setNotifOpen(false);
    };
    const removeNotif = (val) => setNotifs(prev => prev.filter(n => n !== val));

    return (
        <>
            <div className="ccm-field">
                <label className="ccm-label">Title <span className="ccm-req">*</span></label>
                <input className="ccm-input" placeholder="e.g. Retainer Agreement" value={title} onChange={e => setTitle(e.target.value)} />
            </div>

            <div className="ccm-field">
                <label className="ccm-label">Who can use this template? <span className="ccm-req">*</span></label>
                <MultiSelect options={PERMISSION_OPTIONS} value={perms} onChange={setPerms} placeholder="Select permissions" allValue="All" />
            </div>

            <div className="ccm-field">
                <label className="ccm-label">Notifications</label>
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
            </div>

            <div className="ccm-field">
                <label className="ccm-label">Description</label>
                <textarea
                    className="ccm-input afm-textarea"
                    placeholder="Describe this e-sign template..."
                    value={description}
                    onChange={e => setDesc(e.target.value)}
                />
            </div>
        </>
    );
};

/* ── Add E-Sign Modal ── */
const AddESignModal = ({ onClose, onSave }) => {
    const [title, setTitle]          = useState('');
    const [perms, setPerms]          = useState([]);
    const [notifications, setNotifs] = useState([]);
    const [description, setDesc]     = useState('');

    const canSave = title.trim() && perms.length > 0;

    const save = () => {
        if (!canSave) return;
        onSave({ title, permissions: perms.map(p => p.toLowerCase()), notifications, description });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="ccm afm-modal" onClick={e => e.stopPropagation()}>
                <div className="ccm-header">
                    <div>
                        <p className="ccm-breadcrumb">Library · E-Sign Templates</p>
                        <h2 className="ccm-title">Add E-Sign</h2>
                    </div>
                    <button className="ccm-close" onClick={onClose}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
                <div className="ccm-body">
                    <ESignModalBody
                        title={title} setTitle={setTitle}
                        perms={perms} setPerms={setPerms}
                        notifications={notifications} setNotifs={setNotifs}
                        description={description} setDesc={setDesc}
                    />
                </div>
                <div className="ccm-footer">
                    <button className="imp-cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="imp-save-btn" disabled={!canSave} onClick={save}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Add E-Sign
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ── Edit E-Sign Settings Modal ── */
const ESignSettingsModal = ({ row, onClose, onSave }) => {
    const initPerms = (arr) =>
        (arr || []).map(a => PERMISSION_OPTIONS.find(o => o.toLowerCase() === a.toLowerCase())).filter(Boolean);

    const [title, setTitle]          = useState(row.title);
    const [perms, setPerms]          = useState(initPerms(row.permissions));
    const [notifications, setNotifs] = useState(row.notifications || []);
    const [description, setDesc]     = useState(row.description || '');

    const canSave = title.trim() && perms.length > 0;

    const save = () => {
        if (!canSave) return;
        onSave(row.id, { title, permissions: perms.map(p => p.toLowerCase()), notifications, description });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="ccm afm-modal" onClick={e => e.stopPropagation()}>
                <div className="ccm-header">
                    <div>
                        <p className="ccm-breadcrumb">Library · E-Sign Templates · {shortId(row.id)}</p>
                        <h2 className="ccm-title">Edit E-Sign</h2>
                    </div>
                    <button className="ccm-close" onClick={onClose}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
                <div className="ccm-body">
                    <ESignModalBody
                        title={title} setTitle={setTitle}
                        perms={perms} setPerms={setPerms}
                        notifications={notifications} setNotifs={setNotifs}
                        description={description} setDesc={setDesc}
                    />
                </div>
                <div className="ccm-footer">
                    <button className="imp-cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="imp-save-btn" disabled={!canSave} onClick={save}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ── Full-screen E-Sign Editor ── */
const ESignEditorModal = ({ row, onClose }) => (
    <div className="fed-overlay">
        <div className="fed-topbar">
            <button className="fed-back-btn" onClick={onClose}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                Back
            </button>
            <div className="fed-topbar-title">
                <p className="fed-breadcrumb">Library · E-Sign Templates</p>
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
                <h3 className="confirm-modal-title">Delete Template</h3>
                <button className="confirm-modal-close" onClick={onCancel}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
            <div className="confirm-modal-body">
                <p className="confirm-modal-text">Are you sure you want to delete <strong>"{title}"</strong>? This action cannot be undone.</p>
            </div>
            <div className="confirm-modal-footer">
                <button className="confirm-modal-cancel" onClick={onCancel}>Cancel</button>
                <button className="confirm-modal-confirm" style={{ background: '#DC2626', borderColor: '#DC2626' }} onClick={onConfirm}>Delete</button>
            </div>
        </div>
    </div>
);

const ESignTemplatesView = ({ addOpen = false, onCloseAdd }) => {
    const [rows, setRows]            = useState(ESIGN_TEMPLATES_DATA.map(r => ({ ...r })));
    const [search, setSearch] = useState('');

    /* Templates differ field to field, so the haystack is every string value
       on the row rather than a hand-picked list that goes stale. */
    const templateQuery = search.trim().toLowerCase();
    const visibleRows = rows.filter(r => !templateQuery || Object.values(r)
        .filter(v => typeof v === 'string' || typeof v === 'number')
        .join(' ').toLowerCase().includes(templateQuery));
    const [settingsRow, setSettings] = useState(null);
    const [editorTarget, setEditorTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const togglePublished = (id) =>
        setRows(prev => prev.map(r => r.id === id ? { ...r, published: !r.published } : r));

    const deleteRow = (id) => {
        setRows(prev => prev.filter(r => r.id !== id));
        setDeleteTarget(null);
    };

    const duplicateRow = (id) => {
        setRows(prev => {
            const idx = prev.findIndex(r => r.id === id);
            const copy = { ...prev[idx], id: `est-${Date.now()}`, title: prev[idx].title + ' (copy)' };
            const next = [...prev];
            next.splice(idx + 1, 0, copy);
            return next;
        });
    };

    const addRow = ({ title, permissions, notifications, description }) => {
        setRows(prev => [...prev, {
            id: `est-${Date.now()}`, title,
            createdOn: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
            permissions, notifications, description, status: 'Ready', published: false,
        }]);
    };

    const saveSettings = (id, data) => {
        setRows(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
    };

    return (
        <div className="cases-view">
            {addOpen && <AddESignModal onClose={onCloseAdd} onSave={addRow} />}
            {settingsRow && (
                <ESignSettingsModal
                    row={settingsRow}
                    onClose={() => setSettings(null)}
                    onSave={saveSettings}
                />
            )}
            {editorTarget && <ESignEditorModal row={editorTarget} onClose={() => setEditorTarget(null)} />}
            {deleteTarget && (
                <DeleteConfirmModal
                    title={deleteTarget.title}
                    onConfirm={() => deleteRow(deleteTarget.id)}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}
            <InfoBanner message="E-Sign Templates let you create reusable signature documents like agreements, authorizations, and consent forms for clients and staff." />
            <div className="hubs-table">
                <div className="hubs-toolbar">
                    <div className="hubs-search">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        <input type="text" className="hubs-search-input" placeholder="Search templates..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>

                <div className="fot-table-head">
                    <span>TITLE</span>
                    <span>CREATED ON</span>
                    <span>PERMISSIONS</span>
                    <span>STATUS</span>
                    <span>PUBLISHED</span>
                    <span>ACTION</span>
                </div>

                {visibleRows.map((r) => (
                    <div key={r.id} className="fot-table-row">
                        <span className="cases-title-cell" data-label="Title">{r.title}</span>
                        <span className="cases-cell-muted" data-label="Created On">{r.createdOn}</span>
                        <span className="cases-cell-muted" data-label="Permissions">{r.permissions.join(', ')}</span>
                        <span data-label="Status"><span className="ft-status-badge">{r.status}</span></span>
                        <span data-label="Published">
                            <label className="user-switch">
                                <input type="checkbox" checked={r.published === true} onChange={() => togglePublished(r.id)} />
                                <span className="user-switch-slider" />
                            </label>
                        </span>
                        <span data-label="Action">
                            <span className="ft-action-wrap">
                                <button className="ft-icon-btn" title="Edit Settings" onClick={() => setSettings(r)}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                                </button>
                                <button className="ft-icon-btn" title="Edit E-Sign" onClick={() => setEditorTarget(r)}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                </button>
                                <button className="ft-icon-btn" title="Duplicate" onClick={() => duplicateRow(r.id)}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                                </button>
                                <button className="ft-icon-btn delete" title="Delete" onClick={() => setDeleteTarget(r)}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                                </button>
                            </span>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ESignTemplatesView;
