import { useState, useRef } from 'react';
import { PERMISSION_OPTIONS, MultiSelect } from '../../components/MultiSelect';
import InfoBanner from '../../components/InfoBanner';
import './LibraryViews.css';

const FEED_TEMPLATES_DATA = [
    { id: 'ft-001', title: 'post for idle cases',     createdOn: 'April 1, 2026',  media: 0, permissions: ['bots'],           status: 'Ready', published: true  },
    { id: 'ft-002', title: 'post for birthday users', createdOn: 'April 1, 2026',  media: 0, permissions: ['bots'],           status: 'Ready', published: false },
    { id: 'ft-003', title: 'married-coffee-possum',   createdOn: 'May 14, 2026',   media: 1, permissions: ['bots', 'clients'], status: 'Ready', published: null  },
];

const AddPostModal = ({ onClose, onSave, initialData = null }) => {
    const initPerms = (arr) => {
        if (!arr || arr.length === 0) return [];
        return arr.map(a => PERMISSION_OPTIONS.find(o => o.toLowerCase() === a.toLowerCase())).filter(Boolean);
    };

    const [title, setTitle]         = useState(initialData?.title || '');
    const [perms, setPerms]         = useState(initPerms(initialData?.permissions));
    const [message, setMessage]     = useState(initialData?.message || '');
    const [mediaUrl, setMediaUrl]   = useState(null);
    const fileRef = useRef(null);

    const canSave = title.trim() && perms.length > 0 && message.trim();

    const handleFile = (e) => {
        const f = e.target.files[0];
        if (f) setMediaUrl(URL.createObjectURL(f));
    };

    const save = () => {
        if (!canSave) return;
        onSave({ title, permissions: perms.map(p => p.toLowerCase()), message, media: mediaUrl ? 1 : 0 });
        onClose();
    };

    const isEdit = !!initialData;

    const previewName  = 'Jordan Admin';
    const previewDate  = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const [dragging, setDragging] = useState(false);

    const handleDrop = (e) => {
        e.preventDefault(); setDragging(false);
        const f = e.dataTransfer.files[0];
        if (f && f.type.startsWith('image/')) setMediaUrl(URL.createObjectURL(f));
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="apm-modal" onClick={e => e.stopPropagation()}>

                {/* Full-width header */}
                <div className="apm-header">
                    <h2 className="apm-title">{isEdit ? 'Edit Post' : 'Add Post'}</h2>
                    <button className="apm-close-btn" onClick={onClose}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                {/* 2-col body */}
                <div className="apm-body">
                    {/* Left — fields */}
                    <div className="apm-form">
                        <div className="ccm-field">
                            <label className="ccm-label">Title <span className="ccm-req">*</span></label>
                            <input className="ccm-input" placeholder="e.g. Welcome message" value={title} onChange={e => setTitle(e.target.value)} />
                        </div>
                        <div className="ccm-field">
                            <label className="ccm-label">Who can use this template? <span className="ccm-req">*</span></label>
                            <MultiSelect options={PERMISSION_OPTIONS} value={perms} onChange={setPerms} placeholder="Select permissions" allValue="All" />
                        </div>
                        <div className="ccm-field">
                            <label className="ccm-label">Post Message <span className="ccm-req">*</span></label>
                            <textarea
                                className="ccm-input apm-textarea"
                                placeholder="Write your post message here..."
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                            />
                        </div>
                        <div className="ccm-field">
                            <label className="ccm-label">Post Media</label>
                            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
                            {mediaUrl ? (
                                <div className="apm-dropzone apm-dropzone-filled">
                                    <img src={mediaUrl} alt="media" className="apm-dropzone-img" />
                                    <button className="apm-media-remove" onClick={() => { setMediaUrl(null); if (fileRef.current) fileRef.current.value = ''; }}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                    </button>
                                </div>
                            ) : (
                                <div
                                    className={`apm-dropzone${dragging ? ' drag-over' : ''}`}
                                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                                    onDragLeave={() => setDragging(false)}
                                    onDrop={handleDrop}
                                    onClick={() => fileRef.current.click()}
                                >
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                                    <span className="apm-dropzone-text">Drag &amp; drop or <span className="apm-dropzone-link">browse</span></span>
                                    <span className="apm-dropzone-hint">PNG, JPG, GIF up to 10MB</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right — live preview */}
                    <div className="apm-preview">
                        <p className="apm-preview-label">Preview</p>
                        <div className="apm-preview-card">
                            <div className="apm-preview-card-header">
                                <div className="apm-preview-avatar">J</div>
                                <div>
                                    <div className="apm-preview-name">{previewName}</div>
                                    <div className="apm-preview-date">{previewDate}</div>
                                </div>
                            </div>
                            {(message || mediaUrl) ? (
                                <>
                                    {message ? (
                                        <p className="apm-preview-message">{message}</p>
                                    ) : (
                                        <p className="apm-preview-placeholder">Post message will appear here...</p>
                                    )}
                                    {mediaUrl && <img src={mediaUrl} alt="preview" className="apm-preview-media" />}
                                </>
                            ) : (
                                <div className="apm-preview-empty">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                                    <p>Fill in the form to see a preview</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Full-width footer */}
                <div className="apm-footer">
                    <button className="apm-cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="ccm-save-btn" disabled={!canSave} onClick={save}>SAVE</button>
                </div>
            </div>
        </div>
    );
};

const FeedTemplatesView = ({ addOpen = false, onCloseAdd }) => {
    const [rows, setRows] = useState(FEED_TEMPLATES_DATA.map(r => ({ ...r })));
    const [editTarget, setEditTarget] = useState(null);

    const togglePublished = (id) => {
        setRows(prev => prev.map(r => r.id === id ? { ...r, published: r.published === null ? true : !r.published } : r));
    };
    const deleteRow = (id) => setRows(prev => prev.filter(r => r.id !== id));
    const duplicateRow = (id) => {
        setRows(prev => {
            const idx = prev.findIndex(r => r.id === id);
            const copy = { ...prev[idx], id: `ft-${Date.now()}`, title: prev[idx].title + ' (copy)' };
            const next = [...prev];
            next.splice(idx + 1, 0, copy);
            return next;
        });
    };

    const updateRow = (id, data) => {
        setRows(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
    };

    const addRow = ({ title, permissions, media }) => {
        setRows(prev => [...prev, {
            id: `ft-${Date.now()}`, title,
            createdOn: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            media, permissions, status: 'Ready', published: false,
        }]);
    };

    return (
        <div className="cases-view">
            {addOpen && <AddPostModal onClose={onCloseAdd} onSave={addRow} />}
            {editTarget && <AddPostModal initialData={editTarget} onClose={() => setEditTarget(null)} onSave={(data) => updateRow(editTarget.id, data)} />}
            <InfoBanner message="Feed Templates let you create reusable post formats for your Hub's feed. Use them to standardize announcements, updates, and client communications." />
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
                    <span>PERMISSIONS</span>
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
                        <span className="cases-cell-muted" data-label="Permissions">{r.permissions.join(', ')}</span>
                        <span data-label="Status"><span className="ft-status-badge">{r.status}</span></span>
                        <span data-label="Published">
                            <label className="user-switch">
                                <input type="checkbox" checked={r.published === true} onChange={() => togglePublished(r.id)} />
                                <span className={`user-switch-slider${r.published === null ? ' indeterminate' : ''}`} />
                            </label>
                        </span>
                        <span data-label="Action">
                            <span className="ft-action-wrap">
                                <button className="ft-icon-btn" title="View Post" onClick={() => setEditTarget(r)}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                </button>
                                <button className="ft-icon-btn" title="Duplicate Post" onClick={() => duplicateRow(r.id)}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                                </button>
                                <button className="ft-icon-btn delete" title="Delete Post" onClick={() => deleteRow(r.id)}>
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

export default FeedTemplatesView;
