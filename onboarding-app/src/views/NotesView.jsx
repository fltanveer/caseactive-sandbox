import { useRef, useState } from 'react';
import SearchableSelect from '../components/SearchableSelect';
import RichTextEditor from '../components/RichTextEditor';
import InfoBanner from '../components/InfoBanner';
import './library/LibraryViews.css';
import './EventsView.css';
import './FormsView.css';
import './NotesView.css';

export const NOTES_DATA = [
    {
        id: 'not-001', title: 'Client call — 12 May', author: 'Ar Tanveer', visibility: 'clients',
        body: '<p>Client reports ongoing neck pain and two missed weeks of work. Confirmed the ER visit on <strong>3 May</strong> and gave us the treating chiropractor.</p><ul><li>Follow up on the wage letter</li><li>Request the ER records</li></ul>',
        media: [], updated: 'May 12, 2026',
    },
    {
        id: 'not-002', title: 'Scene photos and notes', author: 'Sara Chen', visibility: 'staff',
        body: '<p>Intersection has a partly obscured stop sign — worth an early site visit before the hedge is cut back.</p>',
        media: [
            { name: 'intersection-wide.jpg', isImage: false },
            { name: 'stop-sign-detail.jpg', isImage: false },
            { name: 'skid-marks.jpg', isImage: false },
        ],
        updated: 'May 9, 2026',
    },
    {
        id: 'not-003', title: 'Adjuster conversation log', author: 'Jordan Admin', visibility: 'staff',
        body: '<p>Adjuster opened at <strong>$8,500</strong>. Told them we would not respond before the treatment record is complete.</p>',
        media: [{ name: 'call-recording.m4a', isImage: false }], updated: 'May 6, 2026',
    },
    {
        id: 'not-004', title: 'What to expect next', author: 'Virtual Assistant', visibility: 'clients',
        body: '<p>A short summary of the next 30 days: records collection, demand package, then negotiation. No court date is set yet.</p>',
        media: [], updated: 'Apr 28, 2026',
    },
];

const NOTE_TEMPLATES = [
    { id: 'ntpl-1', title: 'Client Call Log',        description: 'Who called, what was said, and what we owe them next.' },
    { id: 'ntpl-2', title: 'Adjuster Conversation',  description: 'Offer, position and the response we gave.' },
    { id: 'ntpl-3', title: 'Site Visit Notes',       description: 'Scene conditions, photos taken and measurements.' },
    { id: 'ntpl-4', title: 'Treatment Summary',      description: 'Providers seen, dates of service and current status.' },
    { id: 'ntpl-5', title: 'What to Expect Next',    description: 'Plain-language update written for the client.' },
];

const VISIBILITY_OPTIONS = [
    { id: 'clients',  label: 'clients'  },
    { id: 'staff',    label: 'staff'    },
    { id: 'admin',    label: 'admin'    },
    { id: 'everyone', label: 'everyone' },
];

const BLANK_NOTE = { title: '', visibility: '', body: '', media: [] };

/* Client-visible notes are the ones that carry risk if written carelessly,
   so the table separates them from internal ones. */
const TABS = [
    { id: 'all',      label: 'All Notes'      },
    { id: 'clients',  label: 'Client Visible' },
    { id: 'internal', label: 'Internal'       },
];

/* ── Add / Edit settings modal ── */
const NoteSettingsModal = ({ row, mode = 'edit', onClose, onSave }) => {
    const isAdd = mode === 'add';
    const [source, setSource]         = useState('new');
    const [title, setTitle]           = useState(row.title);
    const [visibility, setVisibility] = useState(row.visibility);

    const canSave = title.trim() && visibility;

    /* A template fills the title and seeds the body; visibility is still the
       author's call, since it decides whether the client ever sees this. */
    const useTemplate = (t) => {
        setTitle(t.title);
        setSource('new');
    };

    const save = () => {
        if (!canSave) return;
        onSave({ ...row, title: title.trim(), visibility });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="ccm afm-modal" onClick={e => e.stopPropagation()}>
                <div className="ccm-header">
                    <div>
                        <p className="ccm-breadcrumb">Notes · {isAdd ? 'New' : row.title}</p>
                        <h2 className="ccm-title">{isAdd ? 'Add Note' : 'Edit Settings'}</h2>
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
                            {NOTE_TEMPLATES.map(t => (
                                <button key={t.id} className="cfm-template-card" onClick={() => useTemplate(t)}>
                                    <span className="cfm-template-icon">
                                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
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
                            <div className="ccm-field">
                                <label className="ccm-label">Title <span className="ccm-req">*</span></label>
                                <input className="ccm-input" placeholder="e.g. Client call — 12 May" value={title} onChange={e => setTitle(e.target.value)} autoFocus />
                            </div>
                            <div className="ccm-field">
                                <label className="ccm-label">Visibility <span className="ccm-req">*</span></label>
                                <SearchableSelect value={visibility} onChange={e => setVisibility(e.target.value)}>
                                    <option value="">Select who can see this note</option>
                                    {VISIBILITY_OPTIONS.map(v => <option key={v.id} value={v.id}>{v.label}</option>)}
                                </SearchableSelect>
                                <span className="nv-note-hint">
                                    {visibility === 'clients' || visibility === 'everyone'
                                        ? 'The client will be able to read this note.'
                                        : 'Internal only — the client never sees this note.'}
                                </span>
                            </div>
                        </>
                    )}
                </div>

                <div className="ccm-footer">
                    <button className="imp-cancel-btn" onClick={onClose}>Cancel</button>
                    {!(isAdd && source === 'templates') && (
                        <button className="imp-save-btn" disabled={!canSave} onClick={save}>
                            {isAdd ? (
                                <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Create Note</>
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

/* ── View Note — read-only ── */
const ViewNoteModal = ({ row, onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
        <div className="ccm afm-modal" onClick={e => e.stopPropagation()}>
            <div className="ccm-header">
                <div>
                    <p className="ccm-breadcrumb">Notes · {row.author} · {row.updated}</p>
                    <h2 className="ccm-title">{row.title}</h2>
                </div>
                <button className="ccm-close" onClick={onClose}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>

            <div className="ccm-body">
                <div className="nt-view-meta">
                    <span className={`nt-vis-badge nt-vis-${row.visibility}`}>{row.visibility}</span>
                    <span className="nt-view-meta-dot">·</span>
                    <span>{row.media.length} {row.media.length === 1 ? 'attachment' : 'attachments'}</span>
                </div>

                {row.body
                    ? <div className="rte-content nt-view-body" dangerouslySetInnerHTML={{ __html: row.body }} />
                    : <p className="nt-view-empty">This note has no content yet.</p>}

                {row.media.length > 0 && (
                    <div className="ccm-field">
                        <label className="ccm-label">Attachments</label>
                        <div className="enm-media-grid">
                            {row.media.map((f, i) => (
                                <div className="enm-media-thumb" key={i}>
                                    {f.isImage ? <img src={f.url} alt={f.name} /> : (
                                        <div className="enm-media-thumb-file">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                            <span>{f.name}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="ccm-footer">
                <button className="imp-cancel-btn" onClick={onClose}>Close</button>
            </div>
        </div>
    </div>
);

/* ── Edit Media ── */
const EditMediaModal = ({ row, onClose, onSave }) => {
    const [files, setFiles] = useState(row.media);
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

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="ccm afm-modal" onClick={e => e.stopPropagation()}>
                <div className="ccm-header">
                    <div>
                        <p className="ccm-breadcrumb">Notes · {row.title}</p>
                        <h2 className="ccm-title">Edit Media</h2>
                    </div>
                    <button className="ccm-close" onClick={onClose}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
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
                                    {f.isImage ? <img src={f.url} alt={f.name} /> : (
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
                        <span className="nv-note-hint">Images preview here; other files show as named attachments.</span>
                    </div>
                </div>
                <div className="ccm-footer">
                    <button className="imp-cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="imp-save-btn" onClick={() => { onSave({ ...row, media: files }); onClose(); }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ── Edit Note — full-screen writing surface ── */
const NoteEditorModal = ({ row, onClose, onSave }) => {
    const [title, setTitle] = useState(row.title);
    const [body, setBody]   = useState(row.body);

    return (
        <div className="fed-overlay">
            <div className="fed-topbar">
                <button className="fed-back-btn" onClick={onClose}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                    Back
                </button>
                <div className="fed-topbar-title">
                    <p className="fed-breadcrumb">Notes · Edit Note</p>
                    <h2 className="fed-title">{title || 'Untitled note'}</h2>
                </div>
                <span className={`nt-vis-badge nt-vis-${row.visibility}`}>{row.visibility}</span>
                <button className="imp-save-btn" onClick={() => { onSave({ ...row, title: title.trim() || 'Untitled note', body }); onClose(); }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Save Changes
                </button>
            </div>

            <div className="fed-body nt-editor-body">
                <div className="nt-sheet">
                    <input
                        className="nt-title-input"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Note title"
                    />
                    <RichTextEditor value={body} onChange={setBody} placeholder="Write the note..." minHeight={420} />
                </div>
            </div>
        </div>
    );
};

const DeleteConfirmModal = ({ title, onConfirm, onCancel }) => (
    <div className="modal-overlay" onClick={onCancel}>
        <div className="confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="confirm-modal-header">
                <h3 className="confirm-modal-title">Delete Note</h3>
                <button className="confirm-modal-close" onClick={onCancel}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
            <div className="confirm-modal-body">
                <p className="confirm-modal-text">Are you sure you want to delete <strong>"{title}"</strong>? Its attachments go with it. This action cannot be undone.</p>
            </div>
            <div className="confirm-modal-footer">
                <button className="confirm-modal-cancel" onClick={onCancel}>Cancel</button>
                <button className="confirm-modal-confirm" style={{ background: '#DC2626', borderColor: '#DC2626' }} onClick={onConfirm}>Delete</button>
            </div>
        </div>
    </div>
);

const NotesView = ({ embedded = false, createOpen = false, onCloseCreate }) => {
    const [tab, setTab]                 = useState('all');
    const [rows, setRows]               = useState(NOTES_DATA);
    const [settingsTarget, setSettings] = useState(null);
    const [viewTarget, setView]         = useState(null);
    const [mediaTarget, setMedia]       = useState(null);
    const [editorTarget, setEditor]     = useState(null);
    const [deleteTarget, setDelete]     = useState(null);
    const [search, setSearch]           = useState('');
    const [localAddOpen, setLocalAddOpen] = useState(false);

    /* Embedded in the case view the NEW button sits in the page header, so the
       open flag is owned there; standalone, this view owns it. */
    const addOpen  = embedded ? createOpen : localAddOpen;
    const closeAdd = embedded ? onCloseCreate : () => setLocalAddOpen(false);

    const isClientVisible = (r) => r.visibility === 'clients' || r.visibility === 'everyone';
    const matchesTab = (r, id) => (id === 'all' ? true : id === 'clients' ? isClientVisible(r) : !isClientVisible(r));

    const filtered = rows
        .filter(r => matchesTab(r, tab))
        .filter(r => `${r.title} ${r.author}`.toLowerCase().includes(search.trim().toLowerCase()));

    const updateRow = (data) => setRows(prev => prev.map(r => (r.id === data.id ? data : r)));
    const addRow = (data) => setRows(prev => [
        {
            ...data, id: `not-${Date.now()}`, author: 'Ar Tanveer', media: [], body: '',
            updated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        },
        ...prev,
    ]);
    const duplicateRow = (id) => setRows(prev => {
        const idx = prev.findIndex(r => r.id === id);
        const copy = { ...prev[idx], id: `not-${Date.now()}`, title: `${prev[idx].title} (copy)` };
        const next = [...prev];
        next.splice(idx + 1, 0, copy);
        return next;
    });
    const removeRow = (id) => setRows(prev => prev.filter(r => r.id !== id));

    return (
        <div className="forms-page">
            {settingsTarget && (
                <NoteSettingsModal row={settingsTarget} mode="edit" onClose={() => setSettings(null)} onSave={updateRow} />
            )}
            {addOpen && (
                <NoteSettingsModal row={BLANK_NOTE} mode="add" onClose={closeAdd} onSave={addRow} />
            )}
            {viewTarget && <ViewNoteModal row={viewTarget} onClose={() => setView(null)} />}
            {mediaTarget && <EditMediaModal row={mediaTarget} onClose={() => setMedia(null)} onSave={updateRow} />}
            {editorTarget && <NoteEditorModal row={editorTarget} onClose={() => setEditor(null)} onSave={updateRow} />}
            {deleteTarget && (
                <DeleteConfirmModal
                    title={deleteTarget.title}
                    onCancel={() => setDelete(null)}
                    onConfirm={() => { removeRow(deleteTarget.id); setDelete(null); }}
                />
            )}

            <InfoBanner message="Notes keep the written record for this case. Visibility decides whether the client can read a note or whether it stays internal." />

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
                        <input type="text" className="hubs-search-input" placeholder="Search notes..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>

                <div className="cfm-table-wrap">
                    <div className="cfm-table-head nt-table-head">
                        <span>TITLE</span>
                        <span>AUTHOR</span>
                        <span>UPDATED</span>
                        <span>MEDIA</span>
                        <span>VISIBILITY</span>
                        <span>ACTION</span>
                    </div>

                    {filtered.length === 0 ? (
                        <div className="cfm-empty">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                            <p>No notes found.</p>
                        </div>
                    ) : filtered.map(r => (
                        <div key={r.id} className="cfm-table-row nt-table-row">
                            <span className="cases-title-cell" data-label="Title">{r.title}</span>
                            <span className="cases-cell-muted" data-label="Author">{r.author}</span>
                            <span className="cases-cell-muted" data-label="Updated">{r.updated}</span>
                            <span data-label="Media">
                                {r.media.length > 0 ? (
                                    <span className="nt-media-count">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                                        {r.media.length}
                                    </span>
                                ) : <span className="nt-media-none">0</span>}
                            </span>
                            <span data-label="Visibility">
                                <span className={`nt-vis-badge nt-vis-${r.visibility}`}>{r.visibility}</span>
                            </span>
                            <span data-label="Action">
                                <span className="ft-action-wrap">
                                    <button className="ft-icon-btn" title="View Note" onClick={() => setView(r)}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                    </button>
                                    <button className="ft-icon-btn" title="Edit Media" onClick={() => setMedia(r)}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                                    </button>
                                    <button className="ft-icon-btn" title="Edit Note" onClick={() => setEditor(r)}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                    </button>
                                    <button className="ft-icon-btn" title="Duplicate Note" onClick={() => duplicateRow(r.id)}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                                    </button>
                                    <button className="ft-icon-btn delete" title="Delete Note" onClick={() => setDelete(r)}>
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

export default NotesView;
