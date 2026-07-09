import { useState } from 'react';
import { PERMISSION_OPTIONS, MultiSelect } from '../../components/MultiSelect';
import InfoBanner from '../../components/InfoBanner';
import './LibraryViews.css';

const NOTE_TEMPLATES_DATA = [
    { id: 'nt-68f95320542b38', title: 'Case Representation Letter', createdOn: 'May 16, 6:53 PM', media: 0, permissions: ['staff', 'bots'], status: 'Ready', published: true },
];

const shortId = (id) => 'note...' + id.slice(-12);

const CloseIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
);

/* ── Shared modal fields ── */
const NoteModalFields = ({ title, setTitle, perms, setPerms }) => (
    <>
        <div className="ccm-field">
            <label className="ccm-label">Title <span className="ccm-req">*</span></label>
            <input className="ccm-input" placeholder="e.g. Case Representation Letter" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="ccm-field">
            <label className="ccm-label">Who can use this template? <span className="ccm-req">*</span></label>
            <MultiSelect options={PERMISSION_OPTIONS} value={perms} onChange={setPerms} placeholder="Select permissions" allValue="All" />
        </div>
    </>
);

/* ── Add Note Modal ── */
const AddNoteModal = ({ onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [perms, setPerms] = useState([]);
    const canSave = title.trim() && perms.length > 0;

    const save = () => {
        if (!canSave) return;
        onSave({ title, permissions: perms.map(p => p.toLowerCase()) });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="afm-modal" onClick={e => e.stopPropagation()}>
                <div className="ccm-header">
                    <h2 className="ccm-title">Add Note</h2>
                    <button className="ccm-close" onClick={onClose}><CloseIcon /></button>
                </div>
                <div className="ccm-body">
                    <NoteModalFields title={title} setTitle={setTitle} perms={perms} setPerms={setPerms} />
                </div>
                <div className="ccm-footer">
                    <button className="ccm-cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="ccm-save-btn" disabled={!canSave} onClick={save}>SAVE</button>
                </div>
            </div>
        </div>
    );
};

/* ── View Note Settings Modal ── */
const NoteSettingsModal = ({ row, onClose, onSave }) => {
    const initPerms = (arr) =>
        (arr || []).map(a => PERMISSION_OPTIONS.find(o => o.toLowerCase() === a.toLowerCase())).filter(Boolean);

    const [title, setTitle] = useState(row.title);
    const [perms, setPerms] = useState(initPerms(row.permissions));
    const canSave = title.trim() && perms.length > 0;

    const save = () => {
        if (!canSave) return;
        onSave(row.id, { title, permissions: perms.map(p => p.toLowerCase()) });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="afm-modal" onClick={e => e.stopPropagation()}>
                <div className="ccm-header">
                    <h2 className="ccm-title">View Note &gt; {shortId(row.id)}</h2>
                    <button className="ccm-close" onClick={onClose}><CloseIcon /></button>
                </div>
                <div className="ccm-body">
                    <NoteModalFields title={title} setTitle={setTitle} perms={perms} setPerms={setPerms} />
                </div>
                <div className="ccm-footer">
                    <button className="ccm-cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="ccm-save-btn" disabled={!canSave} onClick={save}>SAVE</button>
                </div>
            </div>
        </div>
    );
};

/* ── Delete Confirm Modal ── */
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

const NoteTemplatesView = ({ addOpen = false, onCloseAdd }) => {
    const [rows, setRows]            = useState(NOTE_TEMPLATES_DATA.map(r => ({ ...r })));
    const [settingsRow, setSettings] = useState(null);
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
            const copy = { ...prev[idx], id: `nt-${Date.now()}`, title: prev[idx].title + ' (copy)' };
            const next = [...prev];
            next.splice(idx + 1, 0, copy);
            return next;
        });
    };

    const addRow = ({ title, permissions }) => {
        setRows(prev => [...prev, {
            id: `nt-${Date.now()}`, title,
            createdOn: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
            media: 0, permissions, status: 'Ready', published: false,
        }]);
    };

    const saveSettings = (id, data) => {
        setRows(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
    };

    return (
        <div className="cases-view">
            {addOpen && <AddNoteModal onClose={onCloseAdd} onSave={addRow} />}
            {settingsRow && (
                <NoteSettingsModal
                    row={settingsRow}
                    onClose={() => setSettings(null)}
                    onSave={saveSettings}
                />
            )}
            {deleteTarget && (
                <DeleteConfirmModal
                    title={deleteTarget.title}
                    onConfirm={() => deleteRow(deleteTarget.id)}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}
            <InfoBanner message="Note Templates let you create reusable note formats for cases, clients, and team members — like representation letters, case summaries, and follow-ups." />
            <div className="hubs-table">
                <div className="hubs-toolbar">
                    <div className="hubs-search">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        <input type="text" className="hubs-search-input" placeholder="Search templates..." />
                    </div>
                </div>

                <div className="ft-table-head">
                    <span>TITLE</span>
                    <span>CREATED ON</span>
                    <span>MEDIA</span>
                    <span>PERMISSION</span>
                    <span>STATUS</span>
                    <span>PUBLISHED</span>
                    <span>ACTION</span>
                </div>

                {rows.map((r) => (
                    <div key={r.id} className="ft-table-row">
                        <span className="cases-title-cell" data-label="Title">{r.title}</span>
                        <span className="cases-cell-muted" data-label="Created On">{r.createdOn}</span>
                        <span data-label="Media">
                            <span className="ft-media-cell">
                                {r.media}
                                {r.media > 0 && (
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 5 }}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                )}
                            </span>
                        </span>
                        <span className="cases-cell-muted" data-label="Permission">{r.permissions.join(', ')}</span>
                        <span data-label="Status"><span className="ft-status-badge">{r.status}</span></span>
                        <span data-label="Published">
                            <label className="user-switch">
                                <input type="checkbox" checked={r.published === true} onChange={() => togglePublished(r.id)} />
                                <span className="user-switch-slider" />
                            </label>
                        </span>
                        <span data-label="Action">
                            <span className="ft-action-wrap">
                                <button className="ft-icon-btn" title="View Settings" onClick={() => setSettings(r)}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                                </button>
                                <button className="ft-icon-btn" title="View Note">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
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

export default NoteTemplatesView;
