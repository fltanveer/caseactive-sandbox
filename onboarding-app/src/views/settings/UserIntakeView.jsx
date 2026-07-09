import { useState, useRef, useEffect } from 'react';
import InfoBanner from '../../components/InfoBanner';
import './UserIntakeView.css';

const INTAKE_FORMS_DATA = [
    { id: 'intake-a1b2c3ca433fa5d67a01', title: 'E-Sign Consent',   createdOn: 'May 16, 6:53 PM', published: true,  media: 1, status: 'Ready', description: '' },
    { id: 'intake-b2c3d4ca433fa5d67b02', title: 'User Intake Form', createdOn: 'May 16, 6:53 PM', published: true,  media: 1, status: 'Ready', description: '' },
    { id: 'intake-c3d4e5ca433fa5d67c03', title: 'New Intake',       createdOn: 'May 18, 2:52 PM', published: true,  media: 1, status: 'Ready', description: '' },
];

const MAPPING_DATA = [
    { userType: 'Admin',  active: true, intakes: [
        { id: 'mi-1', formId: 'intake-a1b2c3ca433fa5d67a01', formName: 'E-Sign Consent',   completeAfter: 'May 16, 6:53 PM' },
        { id: 'mi-2', formId: 'intake-b2c3d4ca433fa5d67b02', formName: 'User Intake Form', completeAfter: 'May 16, 6:53 PM' },
    ]},
    { userType: 'Manage', active: true,  intakes: [] },
    { userType: 'Staff',  active: true,  intakes: [] },
    { userType: 'User',   active: true,  intakes: [] },
];

const shortId = (id) => 'intake...' + id.slice(-12);

const CloseIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
);

/* ── Teal action dropdown ── */
const ActionDropdown = ({ options }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    return (
        <div className="ui-action-wrap" ref={ref}>
            <button className="ui-action-btn" onClick={() => setOpen(o => !o)}>
                <span>--</span>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {open && (
                <div className="ui-action-dropdown">
                    {options.map(opt => (
                        <button key={opt.label} className={`ui-action-opt${opt.danger ? ' danger' : ''}`}
                            onClick={() => { opt.onClick(); setOpen(false); }}>
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

/* ── Pink active toggle (Mapping tab) ── */
const PinkToggle = ({ value, onChange }) => (
    <div className={`ui-pink-toggle${value ? ' on' : ''}`} onClick={() => onChange(!value)}>
        <span className="ui-pink-knob">
            {value && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
            )}
        </span>
    </div>
);

/* ── Add Intake Modal ── */
const AddIntakeModal = ({ onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [description, setDesc] = useState('');
    const canSave = title.trim();

    const save = () => { if (!canSave) return; onSave({ title, description }); onClose(); };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="afm-modal" onClick={e => e.stopPropagation()}>
                <div className="ccm-header">
                    <h2 className="ccm-title">Add Intake</h2>
                    <button className="ccm-close" onClick={onClose}><CloseIcon /></button>
                </div>
                <div className="ccm-body">
                    <div className="ccm-field">
                        <label className="ccm-label">Title <span className="ccm-req">*</span></label>
                        <input className="ccm-input" placeholder="e.g. E-Sign Consent" value={title} onChange={e => setTitle(e.target.value)} />
                    </div>
                    <div className="ccm-field">
                        <label className="ccm-label">Description</label>
                        <textarea className="ccm-input afm-textarea" placeholder="Describe this intake form..." value={description} onChange={e => setDesc(e.target.value)} />
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

/* ── Edit Intake Modal (View Settings action) ── */
const EditIntakeModal = ({ row, onClose, onSave }) => {
    const [title, setTitle] = useState(row.title);
    const [description, setDesc] = useState(row.description || '');
    const canSave = title.trim();

    const save = () => { if (!canSave) return; onSave(row.id, { title, description }); onClose(); };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="afm-modal" onClick={e => e.stopPropagation()}>
                <div className="ccm-header">
                    <h2 className="ccm-title">Edit Intake &gt; {shortId(row.id)}</h2>
                    <button className="ccm-close" onClick={onClose}><CloseIcon /></button>
                </div>
                <div className="ccm-body">
                    <div className="ccm-field">
                        <label className="ccm-label">Title <span className="ccm-req">*</span></label>
                        <input className="ccm-input" value={title} onChange={e => setTitle(e.target.value)} />
                    </div>
                    <div className="ccm-field">
                        <label className="ccm-label">Description</label>
                        <textarea className="ccm-input afm-textarea" placeholder="Describe this intake form..." value={description} onChange={e => setDesc(e.target.value)} />
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

/* ── Delete Form Confirm Modal ── */
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
                <p className="confirm-modal-text">Are you sure you want to delete <strong>"{title}"</strong>? This action cannot be undone.</p>
            </div>
            <div className="confirm-modal-footer">
                <button className="confirm-modal-cancel" onClick={onCancel}>Cancel</button>
                <button className="confirm-modal-confirm" style={{ background: '#DC2626', borderColor: '#DC2626' }} onClick={onConfirm}>Delete</button>
            </div>
        </div>
    </div>
);

/* ── Edit Mapping Modal ("Edit Admin Intakes") ── */
const EditMappingModal = ({ mapping, forms, onClose, onSave }) => {
    const [saved, setSaved] = useState(mapping.intakes.map(i => ({ ...i })));
    const [newRows, setNewRows] = useState([]);

    const addRow = () => setNewRows(prev => [...prev, { key: Date.now(), formId: '', dueDate: '', dueTime: '08:30 PM' }]);
    const removeNew = (key) => setNewRows(prev => prev.filter(r => r.key !== key));
    const updateNew = (key, field, val) => setNewRows(prev => prev.map(r => r.key === key ? { ...r, [field]: val } : r));
    const deleteSaved = (id) => setSaved(prev => prev.filter(i => i.id !== id));

    const save = () => {
        const added = newRows.filter(r => r.formId).map(r => ({
            id: `mi-${Date.now()}-${r.key}`,
            formId: r.formId,
            formName: forms.find(f => f.id === r.formId)?.title || '',
            completeAfter: [r.dueDate, r.dueTime].filter(Boolean).join(' '),
        }));
        onSave(mapping.userType, [...saved, ...added]);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="eim-modal" onClick={e => e.stopPropagation()}>
                <div className="ccm-header">
                    <h2 className="ccm-title">Edit {mapping.userType} Intakes</h2>
                    <button className="ccm-close" onClick={onClose}><CloseIcon /></button>
                </div>
                <div className="eim-body">
                    <div className="eim-table-head">
                        <span>INTAKE FORM</span>
                        <span>COMPLETE AFTER</span>
                        <span>ACTION</span>
                    </div>

                    {saved.map(si => (
                        <div key={si.id} className="eim-table-row">
                            <span className="eim-form-name">{si.formName}</span>
                            <span className="eim-date">{si.completeAfter}</span>
                            <button className="eim-delete-link" onClick={() => deleteSaved(si.id)}>Delete</button>
                        </div>
                    ))}

                    {newRows.map(r => (
                        <div key={r.key} className="eim-new-row">
                            <select className="eim-select" value={r.formId} onChange={e => updateNew(r.key, 'formId', e.target.value)}>
                                <option value=""></option>
                                {forms.map(f => <option key={f.id} value={f.id}>{f.title}</option>)}
                            </select>
                            <input type="text" className="eim-date-input" placeholder="Due date" value={r.dueDate} onChange={e => updateNew(r.key, 'dueDate', e.target.value)} />
                            <input type="text" className="eim-time-input" placeholder="08:30 PM" value={r.dueTime} onChange={e => updateNew(r.key, 'dueTime', e.target.value)} />
                            <button className="eim-remove-btn" onClick={() => removeNew(r.key)}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>
                    ))}

                    <button className="eim-add-link" onClick={addRow}>+ Add Intake Form</button>
                </div>
                <div className="ccm-footer">
                    <button className="ccm-cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="ccm-save-btn" onClick={save}>SAVE</button>
                </div>
            </div>
        </div>
    );
};

/* ── Forms Tab ── */
const FormsTab = ({ forms, onToggle, onEdit, onDelete }) => (
    <>
        <div className="ui-forms-head">
            <span>TITLE</span>
            <span>CREATED ON</span>
            <span>PUBLISHED</span>
            <span>MEDIA</span>
            <span>STATUS</span>
            <span>ACTION</span>
        </div>
        {forms.map(r => (
            <div key={r.id} className="ui-forms-row">
                <span className="cases-title-cell" data-label="Title">{r.title}</span>
                <span className="cases-cell-muted" data-label="Created On">{r.createdOn}</span>
                <span data-label="Published">
                    <label className="user-switch">
                        <input type="checkbox" checked={r.published} onChange={() => onToggle(r.id)} />
                        <span className="user-switch-slider" />
                    </label>
                </span>
                <span className="cases-cell-muted" data-label="Media">{r.media}</span>
                <span className="cases-cell-muted" data-label="Status">{r.status}</span>
                <span data-label="Action">
                    <ActionDropdown options={[
                        { label: 'View Settings',      onClick: () => onEdit(r) },
                        { label: 'View Intake Builder', onClick: () => {} },
                        { label: 'Delete Form',         onClick: () => onDelete(r), danger: true },
                    ]} />
                </span>
            </div>
        ))}
    </>
);

/* ── Mapping Tab ── */
const MappingTab = ({ mapping, onToggle, onEdit }) => (
    <>
        <div className="ui-map-head">
            <span>USER TYPE</span>
            <span>ACTIVE</span>
            <span>ACTION</span>
        </div>
        {mapping.map(r => (
            <div key={r.userType} className="ui-map-row">
                <span className="cases-title-cell" data-label="User Type">{r.userType}</span>
                <span data-label="Active">
                    <PinkToggle value={r.active} onChange={() => onToggle(r.userType)} />
                </span>
                <span data-label="Action">
                    <ActionDropdown options={[
                        { label: 'Edit', onClick: () => onEdit(r) },
                    ]} />
                </span>
            </div>
        ))}
    </>
);

/* ── Main View ── */
const UserIntakeView = ({ addOpen = false, onCloseAdd }) => {
    const [activeTab, setActiveTab]   = useState('forms');
    const [forms, setForms]           = useState(INTAKE_FORMS_DATA.map(r => ({ ...r })));
    const [mapping, setMapping]       = useState(MAPPING_DATA.map(r => ({ ...r })));
    const [editRow, setEditRow]       = useState(null);
    const [deleteTarget, setDelete]   = useState(null);
    const [editMap, setEditMap]       = useState(null);

    const togglePublished = (id) => setForms(prev => prev.map(r => r.id === id ? { ...r, published: !r.published } : r));
    const toggleActive = (t) => setMapping(prev => prev.map(r => r.userType === t ? { ...r, active: !r.active } : r));

    const addForm = ({ title, description }) => setForms(prev => [...prev, {
        id: `intake-${Date.now()}`, title, description,
        createdOn: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
        published: false, media: 0, status: 'Ready',
    }]);

    const saveForm = (id, data) => setForms(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
    const deleteForm = (id) => { setForms(prev => prev.filter(r => r.id !== id)); setDelete(null); };
    const saveMapping = (userType, intakes) => setMapping(prev => prev.map(r => r.userType === userType ? { ...r, intakes } : r));

    return (
        <div className="cases-view">
            {addOpen && <AddIntakeModal onClose={onCloseAdd} onSave={addForm} />}
            {editRow && <EditIntakeModal row={editRow} onClose={() => setEditRow(null)} onSave={saveForm} />}
            {deleteTarget && <DeleteConfirmModal title={deleteTarget.title} onConfirm={() => deleteForm(deleteTarget.id)} onCancel={() => setDelete(null)} />}
            {editMap && <EditMappingModal mapping={editMap} forms={forms} onClose={() => setEditMap(null)} onSave={saveMapping} />}

            <InfoBanner message="User Intake lets you configure intake forms and map them to user types so the right forms are presented to the right people." />

            <div className="hubs-table">
                <div className="ui-tab-bar">
                    <button className={`ui-tab-btn${activeTab === 'forms' ? ' active' : ''}`} onClick={() => setActiveTab('forms')}>Forms</button>
                    <button className={`ui-tab-btn${activeTab === 'mapping' ? ' active' : ''}`} onClick={() => setActiveTab('mapping')}>Mapping</button>
                </div>

                {activeTab === 'forms' ? (
                    <FormsTab forms={forms} onToggle={togglePublished} onEdit={setEditRow} onDelete={setDelete} />
                ) : (
                    <MappingTab mapping={mapping} onToggle={toggleActive} onEdit={setEditMap} />
                )}
            </div>
        </div>
    );
};

export default UserIntakeView;
