import { useState } from 'react';
import { PERMISSION_OPTIONS, MultiSelect } from '../../components/MultiSelect';

const FORM_TEMPLATES_DATA = [
    { id: 'fot-001', title: 'Case Form',  createdOn: 'April 10, 2026', permissions: ['bots', 'clients'],         status: 'Ready', published: null  },
    { id: 'fot-002', title: 'New',        createdOn: 'May 12, 2026',   permissions: ['staff', 'bots', 'clients'], status: 'Ready', published: null  },
];

const NOTIFICATION_OPTIONS = [
    'When event starts', '15 minutes before', '30 minutes before',
    '1 hour before', '1 day before',
];

const AddFormModal = ({ onClose, onSave, initialData = null }) => {
    const initPerms = (arr) => {
        if (!arr || arr.length === 0) return [];
        return arr.map(a => PERMISSION_OPTIONS.find(o => o.toLowerCase() === a.toLowerCase())).filter(Boolean);
    };

    const [title, setTitle]           = useState(initialData?.title || '');
    const [perms, setPerms]           = useState(initPerms(initialData?.permissions));
    const [notifications, setNotifs]  = useState(initialData?.notifications || ['When event starts', '15 minutes before']);
    const [description, setDesc]      = useState(initialData?.description || '');
    const [notifOpen, setNotifOpen]   = useState(false);

    const canSave = title.trim() && perms.length > 0;

    const addNotif = (val) => {
        if (!notifications.includes(val)) setNotifs(prev => [...prev, val]);
        setNotifOpen(false);
    };
    const removeNotif = (val) => setNotifs(prev => prev.filter(n => n !== val));

    const save = () => {
        if (!canSave) return;
        onSave({ title, permissions: perms.map(p => p.toLowerCase()), notifications, description });
        onClose();
    };

    const isEdit = !!initialData;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="afm-modal" onClick={e => e.stopPropagation()}>

                <div className="ccm-header">
                    <h2 className="ccm-title">{isEdit ? 'Edit Form' : 'Add Form'}</h2>
                    <button className="ccm-close" onClick={onClose}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                <div className="ccm-body">
                    <div className="ccm-field">
                        <label className="ccm-label">Title <span className="ccm-req">*</span></label>
                        <input className="ccm-input" placeholder="e.g. Case Form" value={title} onChange={e => setTitle(e.target.value)} />
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
                            placeholder="Describe this form template..."
                            value={description}
                            onChange={e => setDesc(e.target.value)}
                        />
                    </div>
                </div>

                <div className="ccm-footer">
                    <button className="ccm-cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="ccm-save-btn" disabled={!canSave} onClick={save}>SAVE</button>
                </div>
            </div>
        </div>
    );
};

const AddPageModal = ({ onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
        <div className="anp-modal" onClick={e => e.stopPropagation()}>
            <div className="ccm-header">
                <h2 className="ccm-title">Add a new page</h2>
                <button className="ccm-close" onClick={onClose}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
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

const FormTemplatesView = () => {
    const [rows, setRows] = useState(FORM_TEMPLATES_DATA.map(r => ({ ...r })));
    const [addOpen, setAddOpen] = useState(false);
    const [addPageOpen, setAddPageOpen] = useState(false);

    const togglePublished = (id) => {
        setRows(prev => prev.map(r => r.id === id ? { ...r, published: r.published === null ? true : !r.published } : r));
    };
    const deleteRow = (id) => setRows(prev => prev.filter(r => r.id !== id));
    const duplicateRow = (id) => {
        setRows(prev => {
            const idx = prev.findIndex(r => r.id === id);
            const copy = { ...prev[idx], id: `fot-${Date.now()}`, title: prev[idx].title + ' (copy)' };
            const next = [...prev];
            next.splice(idx + 1, 0, copy);
            return next;
        });
    };
    const addRow = ({ title, permissions, notifications, description }) => {
        setRows(prev => [...prev, {
            id: `fot-${Date.now()}`, title,
            createdOn: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            permissions, notifications, description, status: 'Ready', published: false,
        }]);
        setAddPageOpen(true);
    };

    return (
        <div className="cases-view">
            {addOpen && <AddFormModal onClose={() => setAddOpen(false)} onSave={addRow} />}
            {addPageOpen && <AddPageModal onClose={() => setAddPageOpen(false)} />}
            <div className="cases-page-header">
                <h1 className="cases-title">Form Templates</h1>
                <button className="hubs-new-btn" onClick={() => setAddOpen(true)}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    NEW
                </button>
            </div>
            <div className="hubs-table" style={{ overflow: 'visible' }}>
                <div className="hubs-toolbar">
                    <div className="hubs-search">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        <input type="text" className="hubs-search-input" placeholder="Search templates..." />
                    </div>
                </div>
                <div className="fot-table-head">
                    <span>TITLE</span>
                    <span>CREATED ON</span>
                    <span>PERMISSION</span>
                    <span>STATUS</span>
                    <span>PUBLISH</span>
                    <span>ACTION</span>
                </div>
                {rows.map((r) => (
                    <div key={r.id} className="fot-table-row">
                        <span className="cases-title-cell">{r.title}</span>
                        <span className="cases-cell-muted">{r.createdOn}</span>
                        <span className="cases-cell-muted">{r.permissions.join(', ')}</span>
                        <span className="ft-status-badge">{r.status}</span>
                        <span>
                            <label className="user-switch">
                                <input type="checkbox" checked={r.published === true} onChange={() => togglePublished(r.id)} />
                                <span className={`user-switch-slider${r.published === null ? ' indeterminate' : ''}`} />
                            </label>
                        </span>
                        <span className="ft-action-wrap">
                            <button className="ft-icon-btn" title="Edit Settings">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                            </button>
                            <button className="ft-icon-btn" title="Edit Form">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            </button>
                            <button className="ft-icon-btn" title="Duplicate Form" onClick={() => duplicateRow(r.id)}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                            </button>
                            <button className="ft-icon-btn delete" title="Delete Form" onClick={() => deleteRow(r.id)}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                            </button>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FormTemplatesView;
