import { useState, useRef } from 'react';
import { PERMISSION_OPTIONS, MultiSelect } from '../../components/MultiSelect';
import InfoBanner from '../../components/InfoBanner';
import './LibraryViews.css';

const NOTE_TEMPLATES_DATA = [
    { id: 'nt-68f95320542b38', title: 'Case Representation Letter', createdOn: 'May 16, 6:53 PM', media: 0, mediaFiles: [], permissions: ['staff', 'bots'], status: 'Ready', published: true },
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

/* ── Add Note Modal (also handles Edit Settings) ── */
const AddNoteModal = ({ onClose, onSave, initialData = null }) => {
    const initPerms = (arr) =>
        (arr || []).map(a => PERMISSION_OPTIONS.find(o => o.toLowerCase() === a.toLowerCase())).filter(Boolean);

    const [title, setTitle] = useState(initialData?.title || '');
    const [perms, setPerms] = useState(initPerms(initialData?.permissions));
    const canSave = title.trim() && perms.length > 0;

    const isEdit = !!initialData;
    const breadcrumb = isEdit ? `Library · Note Templates · ${shortId(initialData.id)}` : 'Library · Note Templates';

    const save = () => {
        if (!canSave) return;
        if (isEdit) onSave(initialData.id, { title, permissions: perms.map(p => p.toLowerCase()) });
        else onSave({ title, permissions: perms.map(p => p.toLowerCase()) });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="ccm afm-modal" onClick={e => e.stopPropagation()}>
                <div className="ccm-header">
                    <div>
                        <p className="ccm-breadcrumb">{breadcrumb}</p>
                        <h2 className="ccm-title">{isEdit ? 'Edit Note' : 'Add Note'}</h2>
                    </div>
                    <button className="ccm-close" onClick={onClose}><CloseIcon /></button>
                </div>
                <div className="ccm-body">
                    <NoteModalFields title={title} setTitle={setTitle} perms={perms} setPerms={setPerms} />
                </div>
                <div className="ccm-footer">
                    <button className="imp-cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="imp-save-btn" disabled={!canSave} onClick={save}>
                        {isEdit ? (
                            <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Save Changes</>
                        ) : (
                            <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add Note</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ── Edit Note Content (Add a new page) Modal ── */
const NotePageModal = ({ onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
        <div className="anp-modal" onClick={e => e.stopPropagation()}>
            <div className="ccm-header">
                <h2 className="ccm-title">Add a new page</h2>
                <button className="ccm-close" onClick={onClose}><CloseIcon /></button>
            </div>
            <div className="anp-body">
                <button className="anp-card" onClick={onClose}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <span className="anp-card-label">Blank page</span>
                </button>
                <button className="anp-card" onClick={onClose}>
                    <span style={{ position: 'relative', display: 'inline-flex' }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        <span style={{ position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)', fontSize: 9, fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.04em' }}>pdf</span>
                    </span>
                    <span className="anp-card-label">From Upload</span>
                </button>
            </div>
        </div>
    </div>
);

/* ── Edit Media Modal ── */
const EditMediaModal = ({ row, onClose, onSave }) => {
    const [files, setFiles] = useState(row.mediaFiles || []);
    const inputRef = useRef(null);

    const handleFiles = (e) => {
        const picked = Array.from(e.target.files || []);
        picked.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                setFiles(prev => [...prev, { name: file.name, url: reader.result, isImage: file.type.startsWith('image/') }]);
            };
            reader.readAsDataURL(file);
        });
        e.target.value = '';
    };

    const removeFile = (idx) => setFiles(prev => prev.filter((_, i) => i !== idx));

    const save = () => {
        onSave(row.id, files);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="ccm afm-modal" onClick={e => e.stopPropagation()}>
                <div className="ccm-header">
                    <div>
                        <p className="ccm-breadcrumb">Library · Note Templates · {shortId(row.id)}</p>
                        <h2 className="ccm-title">Edit Media</h2>
                    </div>
                    <button className="ccm-close" onClick={onClose}><CloseIcon /></button>
                </div>
                <div className="ccm-body">
                    <div className="ccm-field">
                        <label className="ccm-label">Attachments</label>
                        <div className="enm-media-grid">
                            <button className="enm-media-add" onClick={() => inputRef.current?.click()}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            </button>
                            {files.map((f, idx) => (
                                <div className="enm-media-thumb" key={idx}>
                                    {f.isImage ? (
                                        <img src={f.url} alt={f.name} />
                                    ) : (
                                        <div className="enm-media-thumb-file">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                            <span>{f.name}</span>
                                        </div>
                                    )}
                                    <button className="apm-media-remove" onClick={() => removeFile(idx)}>
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <input ref={inputRef} type="file" multiple style={{ display: 'none' }} onChange={handleFiles} />
                    </div>
                </div>
                <div className="ccm-footer">
                    <button className="imp-cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="imp-save-btn" onClick={save}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Save Changes
                    </button>
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
    const [editTarget, setEditTarget] = useState(null);
    const [pageTarget, setPageTarget] = useState(null);
    const [mediaTarget, setMediaTarget] = useState(null);
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
            media: 0, mediaFiles: [], permissions, status: 'Ready', published: false,
        }]);
    };

    const saveSettings = (id, data) => {
        setRows(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
    };

    const saveMedia = (id, files) => {
        setRows(prev => prev.map(r => r.id === id ? { ...r, media: files.length, mediaFiles: files } : r));
    };

    return (
        <div className="cases-view">
            {addOpen && <AddNoteModal onClose={onCloseAdd} onSave={addRow} />}
            {editTarget && (
                <AddNoteModal
                    initialData={editTarget}
                    onClose={() => setEditTarget(null)}
                    onSave={saveSettings}
                />
            )}
            {pageTarget && <NotePageModal onClose={() => setPageTarget(null)} />}
            {mediaTarget && (
                <EditMediaModal
                    row={mediaTarget}
                    onClose={() => setMediaTarget(null)}
                    onSave={saveMedia}
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
                                <button className="ft-icon-btn" title="Edit Settings" onClick={() => setEditTarget(r)}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                                </button>
                                <button className="ft-icon-btn" title="Edit Note" onClick={() => setPageTarget(r)}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                </button>
                                <button className="ft-icon-btn" title="Edit Media" onClick={() => setMediaTarget(r)}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
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
