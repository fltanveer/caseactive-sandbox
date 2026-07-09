import { useState } from 'react';
import { PERMISSION_OPTIONS, MultiSelect } from '../../components/MultiSelect';
import InfoBanner from '../../components/InfoBanner';
import './LibraryViews.css';

const TASK_TEMPLATES_DATA = [
    {
        id: 'task-03bcbcc40a5f38',
        title: 'Review and Sign Your Case Documents',
        subtasks: [
            { id: 'st-1', title: 'Review the Retainer Agreement' },
            { id: 'st-2', title: 'Sign the Retainer Agreement' },
            { id: 'st-3', title: 'Review the Release Authorization' },
            { id: 'st-4', title: 'Sign the Release Authorization' },
        ],
        createdOn: 'May 16, 6:53 PM',
        updatedOn: 'Jun 12, 2:38 AM',
        permissions: ['staff', 'bots'],
        status: 'Ready',
        published: true,
        description: 'Client reviews and signs the core legal agreements.',
    },
    {
        id: 'task-68f95320542b11',
        title: 'Complete Your Intake Forms',
        subtasks: [
            { id: 'st-5', title: 'Fill out personal information' },
            { id: 'st-6', title: 'Provide insurance details' },
            { id: 'st-7', title: 'Sign consent form' },
        ],
        createdOn: 'May 16, 6:53 PM',
        updatedOn: 'May 16, 6:53 PM',
        permissions: ['staff', 'bots'],
        status: 'Ready',
        published: true,
        description: 'Client completes all required intake forms for case processing.',
    },
    {
        id: 'task-99c1d2e3f4a5b6',
        title: 'Complete Your Case Intake Form',
        subtasks: [
            { id: 'st-8', title: 'Complete accident information' },
            { id: 'st-9', title: 'List all injuries' },
            { id: 'st-10', title: 'Provide witness details' },
        ],
        createdOn: 'May 16, 6:53 PM',
        updatedOn: 'May 16, 6:53 PM',
        permissions: ['staff', 'bots'],
        status: 'Ready',
        published: false,
        description: '',
    },
];

const NOTIFICATION_OPTIONS = [
    'When event starts', '15 minutes before', '30 minutes before',
    '1 hour before', '1 day before',
];

const shortId = (id) => 'task...' + id.slice(-12);

const CloseIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
);

/* ── Shared settings form fields ── */
const TaskSettingsFields = ({ title, setTitle, perms, setPerms, notifications, setNotifs, description, setDesc }) => {
    const [notifOpen, setNotifOpen] = useState(false);
    const addNotif = (val) => { if (!notifications.includes(val)) setNotifs(prev => [...prev, val]); setNotifOpen(false); };
    const removeNotif = (val) => setNotifs(prev => prev.filter(n => n !== val));

    return (
        <>
            <div className="ccm-field">
                <label className="ccm-label">Title <span className="ccm-req">*</span></label>
                <input className="ccm-input" placeholder="e.g. Review and Sign Your Case Documents" value={title} onChange={e => setTitle(e.target.value)} />
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
                <textarea className="ccm-input afm-textarea" placeholder="Describe what this task involves..." value={description} onChange={e => setDesc(e.target.value)} />
            </div>
        </>
    );
};

/* ── Add Task Modal ── */
const AddTaskModal = ({ onClose, onSave }) => {
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
            <div className="afm-modal" onClick={e => e.stopPropagation()}>
                <div className="ccm-header">
                    <h2 className="ccm-title">Add Task</h2>
                    <button className="ccm-close" onClick={onClose}><CloseIcon /></button>
                </div>
                <div className="ccm-body">
                    <TaskSettingsFields title={title} setTitle={setTitle} perms={perms} setPerms={setPerms} notifications={notifications} setNotifs={setNotifs} description={description} setDesc={setDesc} />
                </div>
                <div className="ccm-footer">
                    <button className="ccm-cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="ccm-save-btn" disabled={!canSave} onClick={save}>SAVE</button>
                </div>
            </div>
        </div>
    );
};

/* ── View Task Settings Modal ── */
const TaskSettingsModal = ({ row, onClose, onSave }) => {
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
            <div className="afm-modal" onClick={e => e.stopPropagation()}>
                <div className="ccm-header">
                    <h2 className="ccm-title">View Task &gt; {shortId(row.id)}</h2>
                    <button className="ccm-close" onClick={onClose}><CloseIcon /></button>
                </div>
                <div className="ccm-body">
                    <TaskSettingsFields title={title} setTitle={setTitle} perms={perms} setPerms={setPerms} notifications={notifications} setNotifs={setNotifs} description={description} setDesc={setDesc} />
                </div>
                <div className="ccm-footer">
                    <button className="ccm-cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="ccm-save-btn" disabled={!canSave} onClick={save}>SAVE</button>
                </div>
            </div>
        </div>
    );
};

const GripIcon = () => (
    <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor">
        <circle cx="2" cy="3" r="1.5"/><circle cx="8" cy="3" r="1.5"/>
        <circle cx="2" cy="8" r="1.5"/><circle cx="8" cy="8" r="1.5"/>
        <circle cx="2" cy="13" r="1.5"/><circle cx="8" cy="13" r="1.5"/>
    </svg>
);

/* ── View Task Modal (two-column detail view, drag-to-reorder subtasks) ── */
const ViewTaskModal = ({ row, onClose, onReorderSubtasks }) => {
    const [subtasks, setSubtasks] = useState([...row.subtasks]);
    const [dragIdx, setDragIdx]   = useState(null);
    const [overIdx, setOverIdx]   = useState(null);

    const onDragStart = (i) => setDragIdx(i);
    const onDragOver  = (e, i) => { e.preventDefault(); setOverIdx(i); };
    const onDragEnd   = ()    => { setDragIdx(null); setOverIdx(null); };
    const onDrop      = (i)   => {
        if (dragIdx === null || dragIdx === i) return;
        const next = [...subtasks];
        const [moved] = next.splice(dragIdx, 1);
        next.splice(i, 0, moved);
        setSubtasks(next);
        onReorderSubtasks && onReorderSubtasks(row.id, next);
        setDragIdx(null);
        setOverIdx(null);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="vtm-modal" onClick={e => e.stopPropagation()}>
                <div className="vtm-header">
                    <div className="vtm-header-left">
                        <span className="vtm-breadcrumb">Task Template</span>
                        <h2 className="vtm-title">{row.title}</h2>
                    </div>
                    <button className="ccm-close" onClick={onClose}><CloseIcon /></button>
                </div>

                <div className="vtm-body">
                    {/* Left column */}
                    <div className="vtm-left">
                        {row.description && (
                            <div className="vtm-section">
                                <p className="vtm-section-label">Description</p>
                                <p className="vtm-desc">{row.description}</p>
                            </div>
                        )}

                        <div className="vtm-section">
                            <div className="vtm-subtask-header">
                                <p className="vtm-section-label">Child Tasks</p>
                                <span className="vtm-subtask-count">{subtasks.length}</span>
                            </div>
                            {subtasks.length > 0 ? (
                                <div className="vtm-subtask-list">
                                    {subtasks.map((st, i) => (
                                        <div
                                            key={st.id}
                                            className={`vtm-subtask-row${dragIdx === i ? ' dragging' : ''}${overIdx === i && dragIdx !== i ? ' drag-over' : ''}`}
                                            draggable
                                            onDragStart={() => onDragStart(i)}
                                            onDragOver={(e) => onDragOver(e, i)}
                                            onDrop={() => onDrop(i)}
                                            onDragEnd={onDragEnd}
                                        >
                                            <span className="vtm-drag-handle"><GripIcon /></span>
                                            <span className="vtm-subtask-num">{i + 1}</span>
                                            <span className="vtm-subtask-name">{st.title}</span>
                                            <span className="vtm-subtask-badge">Unassigned</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="vtm-empty">No child tasks defined.</p>
                            )}
                        </div>
                    </div>

                    {/* Right column */}
                    <div className="vtm-right">
                        <div className="vtm-section">
                            <p className="vtm-section-label">Who can be assigned? <span className="ccm-req">*</span></p>
                            <select className="vtm-select">
                                <option value="">Select assignee type</option>
                                <option>Staff</option>
                                <option>Clients</option>
                                <option>Bots</option>
                                <option>Any</option>
                            </select>
                        </div>

                        <div className="vtm-section">
                            <p className="vtm-section-label">Permissions</p>
                            <div className="vtm-perm-chips">
                                {row.permissions.map(p => (
                                    <span key={p} className="vtm-perm-chip">{p}</span>
                                ))}
                            </div>
                        </div>

                        <div className="vtm-meta-card">
                            <div className="vtm-meta-row">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                <span className="vtm-meta-label">Created</span>
                                <span className="vtm-meta-value">{row.createdOn}</span>
                            </div>
                            <div className="vtm-meta-row">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                <span className="vtm-meta-label">Updated</span>
                                <span className="vtm-meta-value">{row.updatedOn}</span>
                            </div>
                            <div className="vtm-meta-row">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                                <span className="vtm-meta-label">Status</span>
                                <span className="ft-status-badge" style={{ fontSize: '11px', padding: '2px 8px' }}>{row.status}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="vtm-footer">
                    <button className="ccm-cancel-btn" onClick={onClose}>Close</button>
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

/* ── Main View ── */
const TaskTemplatesView = ({ addOpen = false, onCloseAdd }) => {
    const [rows, setRows]            = useState(TASK_TEMPLATES_DATA.map(r => ({ ...r })));
    const [settingsRow, setSettings] = useState(null);
    const [viewRow, setViewRow]      = useState(null);
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
            const copy = { ...prev[idx], id: `task-${Date.now()}`, title: prev[idx].title + ' (copy)', subtasks: prev[idx].subtasks.map(s => ({ ...s, id: `st-${Date.now()}-${s.id}` })) };
            const next = [...prev];
            next.splice(idx + 1, 0, copy);
            return next;
        });
    };

    const addRow = ({ title, permissions, notifications, description }) => {
        setRows(prev => [...prev, {
            id: `task-${Date.now()}`, title,
            subtasks: [],
            createdOn: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
            updatedOn: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
            permissions, notifications, description, status: 'Ready', published: false,
        }]);
    };

    const saveSettings = (id, data) => {
        setRows(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
    };

    const reorderSubtasks = (id, newSubtasks) => {
        setRows(prev => prev.map(r => r.id === id ? { ...r, subtasks: newSubtasks } : r));
    };

    return (
        <div className="cases-view">
            {addOpen && <AddTaskModal onClose={onCloseAdd} onSave={addRow} />}
            {settingsRow && (
                <TaskSettingsModal
                    row={settingsRow}
                    onClose={() => setSettings(null)}
                    onSave={saveSettings}
                />
            )}
            {viewRow && (
                <ViewTaskModal row={viewRow} onClose={() => setViewRow(null)} onReorderSubtasks={reorderSubtasks} />
            )}
            {deleteTarget && (
                <DeleteConfirmModal
                    title={deleteTarget.title}
                    onConfirm={() => deleteRow(deleteTarget.id)}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}

            <InfoBanner message="Task Templates let you create reusable task structures with child steps — like document signing, intake completion, and case reviews." />

            <div className="hubs-table">
                <div className="hubs-toolbar">
                    <div className="hubs-search">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        <input type="text" className="hubs-search-input" placeholder="Search templates..." />
                    </div>
                </div>

                <div className="tt-table-head">
                    <span>TITLE</span>
                    <span>SUBTASKS</span>
                    <span>CREATED ON</span>
                    <span>PERMISSIONS</span>
                    <span>STATUS</span>
                    <span>PUBLISHED</span>
                    <span>ACTION</span>
                </div>

                {rows.map((r) => (
                    <div key={r.id} className="tt-table-row">
                        <span className="cases-title-cell" data-label="Title">{r.title}</span>
                        <span data-label="Subtasks">
                            <span className="tt-subtask-count">
                                <span className="tt-subtask-badge">{r.subtasks.length}</span>
                            </span>
                        </span>
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
                                <button className="ft-icon-btn" title="View Settings" onClick={() => setSettings(r)}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                                </button>
                                <button className="ft-icon-btn" title="View Task" onClick={() => setViewRow(r)}>
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

export default TaskTemplatesView;
