import { useState, useRef } from 'react';
import '../settings/AdvancedSettingsView.css';
import './CustomFieldsView.css';

const FIELD_TYPES = ['Text', 'Single Choice', 'Multi Choice', 'Date', 'Time', 'Number', 'URL'];
const CHOICE_TYPES = ['Single Choice', 'Multi Choice', 'single_choice', 'multi_choice'];

const TYPE_META = {
    'Text':          { bg: '#EFF6FF', color: '#2563EB' },
    'Single Choice': { bg: '#F5F3FF', color: '#7C3AED' },
    'Multi Choice':  { bg: '#F0FDFA', color: '#0F766E' },
    'Date':          { bg: '#F0FDF4', color: '#16A34A' },
    'Time':          { bg: '#FFF7ED', color: '#EA580C' },
    'Number':        { bg: '#FEF9C3', color: '#CA8A04' },
    'URL':           { bg: '#FDF2F8', color: '#BE185D' },
    'dropdown':      { bg: '#F5F3FF', color: '#7C3AED' },
    'date':          { bg: '#F0FDF4', color: '#16A34A' },
    'text':          { bg: '#EFF6FF', color: '#2563EB' },
};

const TypeBadge = ({ type }) => {
    const meta = TYPE_META[type] || { bg: '#F1F5F9', color: '#475569' };
    const label = type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' ');
    return (
        <span className="cf-type-badge" style={{ background: meta.bg, color: meta.color }}>
            {label}
        </span>
    );
};

const Toggle = ({ value, onChange, disabled }) => (
    <button
        type="button"
        className={`as-toggle${value ? ' on' : ''}${disabled ? ' cf-toggle-disabled' : ''}`}
        onClick={() => !disabled && onChange(!value)}
        style={{ transform: 'scale(0.85)', transformOrigin: 'left center' }}
    >
        <span className="as-toggle-knob" />
    </button>
);

const DragHandle = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cf-drag-handle">
        <circle cx="9" cy="6" r="1" fill="currentColor"/><circle cx="15" cy="6" r="1" fill="currentColor"/>
        <circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/>
        <circle cx="9" cy="18" r="1" fill="currentColor"/><circle cx="15" cy="18" r="1" fill="currentColor"/>
    </svg>
);

/* ── Field Preview ── */
const FieldPreview = ({ fieldType, label, desc, options, defVal }) => {
    const displayLabel = label || 'Field Label';
    const displayDesc  = desc  || '';

    const previewInput = () => {
        switch (fieldType) {
            case 'Text':
                return <input className="cf-prev-input" type="text" placeholder={`Enter ${displayLabel.toLowerCase()}...`} readOnly />;
            case 'Number':
                return <input className="cf-prev-input" type="number" defaultValue={defVal || 0} readOnly />;
            case 'Date':
                return <input className="cf-prev-input" type="date" readOnly />;
            case 'Time':
                return <input className="cf-prev-input" type="time" readOnly />;
            case 'URL':
                return (
                    <div className="cf-prev-url-wrap">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                        <input className="cf-prev-input cf-prev-url" type="url" placeholder="https://" readOnly />
                    </div>
                );
            case 'Single Choice':
                return options.length === 0
                    ? <div className="cf-prev-hint">Add options to preview</div>
                    : <div className="cf-prev-choices">
                        {options.map(o => (
                            <label key={o} className="cf-prev-choice">
                                <input type="radio" name="cf-prev-radio" readOnly className="cf-prev-radio" />
                                <span>{o}</span>
                            </label>
                        ))}
                    </div>;
            case 'Multi Choice':
                return options.length === 0
                    ? <div className="cf-prev-hint">Add options to preview</div>
                    : <div className="cf-prev-choices">
                        {options.map(o => (
                            <label key={o} className="cf-prev-choice">
                                <input type="checkbox" readOnly className="cf-prev-checkbox" />
                                <span>{o}</span>
                            </label>
                        ))}
                    </div>;
            default:
                return <input className="cf-prev-input" type="text" placeholder="..." readOnly />;
        }
    };

    return (
        <div className="cf-preview-pane">
            <div className="cf-preview-head">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                Preview
            </div>
            <div className="cf-preview-card">
                <div className="cf-prev-field-label">
                    {displayLabel}
                    {displayDesc && <span className="cf-prev-field-desc">{displayDesc}</span>}
                </div>
                {previewInput()}
            </div>
            <div className="cf-preview-type-row">
                <TypeBadge type={fieldType} />
                <span className="cf-preview-type-note">as seen by users</span>
            </div>
        </div>
    );
};

/* ── Field Modal (add + edit) ── */
const FieldModal = ({ mode, fieldType, initial, onSave, onClose }) => {
    const [label, setLabel]       = useState(initial?.label || '');
    const [desc, setDesc]         = useState(initial?.description || '');
    const [defVal, setDefVal]     = useState(initial?.defaults || '');
    const [options, setOptions]   = useState(initial?.options || []);
    const [optInput, setOptInput] = useState('');

    const isChoice = CHOICE_TYPES.includes(fieldType);
    const canSave  = label.trim().length > 0;

    const addOption = () => {
        const v = optInput.trim();
        if (!v || options.includes(v)) return;
        setOptions(prev => [...prev, v]);
        setOptInput('');
    };

    const removeOption = (o) => setOptions(prev => prev.filter(x => x !== o));

    const handleSave = () => {
        onSave({ label: label.trim(), description: desc.trim(), defaults: defVal.trim(), options });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="ccm cf-field-modal" onClick={e => e.stopPropagation()}>
                <div className="ccm-header">
                    <h2 className="ccm-title">{mode === 'add' ? 'Add Field' : 'Edit Field'}</h2>
                    <button className="ccm-close" onClick={onClose}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                <div className="cf-modal-body-split">
                    {/* ── Left: config ── */}
                    <div className="cf-modal-config">
                        <div className="ccm-grid-2">
                            <div className="ccm-field">
                                <label className="ccm-label">Label Name <span className="cf-req">*</span></label>
                                <input
                                    className="ccm-input"
                                    placeholder="e.g. Case Status"
                                    value={label}
                                    onChange={e => setLabel(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="ccm-field">
                                <label className="ccm-label">Description</label>
                                <input
                                    className="ccm-input"
                                    placeholder="Optional hint for users"
                                    value={desc}
                                    onChange={e => setDesc(e.target.value)}
                                />
                            </div>
                        </div>

                        {isChoice && (
                            <div className="ccm-field">
                                <label className="ccm-label">Options</label>
                                <div className="cf-option-row">
                                    <input
                                        className="ccm-input"
                                        placeholder="Add option..."
                                        value={optInput}
                                        onChange={e => setOptInput(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && addOption()}
                                    />
                                    <button
                                        className="as-primary-btn as-btn-sm cf-option-add-btn"
                                        onClick={addOption}
                                        disabled={!optInput.trim()}
                                    >
                                        ADD
                                    </button>
                                </div>
                                {options.length === 0 ? (
                                    <div className="cf-options-empty">( options list is empty )</div>
                                ) : (
                                    <div className="cf-options-list">
                                        {options.map(o => (
                                            <div key={o} className="cf-option-chip">
                                                <span>{o}</span>
                                                <button className="cf-option-remove" onClick={() => removeOption(o)}>
                                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="ccm-field">
                            <label className="ccm-label">Default Value</label>
                            {isChoice && options.length > 0 ? (
                                <select className="ccm-input cf-def-select" value={defVal} onChange={e => setDefVal(e.target.value)}>
                                    <option value="">No default</option>
                                    {options.map(o => <option key={o} value={o}>{o}</option>)}
                                </select>
                            ) : fieldType === 'Date' ? (
                                <input className="ccm-input" type="date" value={defVal} onChange={e => setDefVal(e.target.value)} />
                            ) : fieldType === 'Time' ? (
                                <input className="ccm-input" type="time" value={defVal} onChange={e => setDefVal(e.target.value)} />
                            ) : fieldType === 'Number' ? (
                                <input className="ccm-input" type="number" placeholder="0" value={defVal} onChange={e => setDefVal(e.target.value)} />
                            ) : (
                                <input className="ccm-input" type="text" placeholder="Leave blank for no default" value={defVal} onChange={e => setDefVal(e.target.value)} />
                            )}
                        </div>
                    </div>

                    {/* ── Right: preview ── */}
                    <FieldPreview
                        fieldType={fieldType}
                        label={label}
                        desc={desc}
                        options={options}
                        defVal={defVal}
                    />
                </div>

                <div className="ccm-footer">
                    <button className="ccm-cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="ccm-save-btn" disabled={!canSave} onClick={handleSave}>SAVE</button>
                </div>
            </div>
        </div>
    );
};

const CASE_FIELDS_INIT = [
    { id: 1, label: 'Case Status',  type: 'dropdown', defaults: '',  required: true,  active: true,  system: true  },
    { id: 2, label: 'Case Types',   type: 'dropdown', defaults: '',  required: true,  active: true,  system: true  },
    { id: 3, label: 'Date Opened',  type: 'date',     defaults: '',  required: true,  active: true,  system: true  },
    { id: 4, label: 'Tag Id',       type: 'text',     defaults: '',  required: true,  active: true,  system: true  },
    { id: 5, label: 'Title',        type: 'text',     defaults: '',  required: true,  active: true,  system: true  },
    { id: 6, label: 'Description',  type: 'text',     defaults: '',  required: false, active: true,  system: true  },
];

const USER_FIELDS_INIT = [
    { id: 1, label: 'First Name',  type: 'text', defaults: '', required: true,  active: true, system: true },
    { id: 2, label: 'Last Name',   type: 'text', defaults: '', required: true,  active: true, system: true },
    { id: 3, label: 'Email',       type: 'text', defaults: '', required: true,  active: true, system: true },
    { id: 4, label: 'User Status', type: 'text', defaults: '', required: true,  active: true, system: true },
    { id: 5, label: 'User Type',   type: 'text', defaults: '', required: true,  active: true, system: true },
    { id: 6, label: 'Locale',      type: 'text', defaults: '', required: true,  active: true, system: false },
    { id: 7, label: 'Zoneinfo',    type: 'text', defaults: '', required: true,  active: true, system: false },
    { id: 8, label: 'Phone',       type: 'text', defaults: '', required: false, active: true, system: false },
];

const FieldsTab = ({ fields, setFields }) => {
    const [fieldType, setFieldType]   = useState('');
    const [modal, setModal]           = useState(null); // { mode: 'add'|'edit', fieldType, fieldId? }
    const [dragOverIdx, setDragOverIdx] = useState(null);
    const dragIdx = useRef(null);

    const openAdd  = () => { if (fieldType) setModal({ mode: 'add', fieldType }); };
    const openEdit = (f) => setModal({ mode: 'edit', fieldType: f.type, fieldId: f.id, initial: f });
    const closeModal = () => setModal(null);

    const handleSave = (data) => {
        if (modal.mode === 'add') {
            setFields(prev => [...prev, {
                id: Date.now(),
                label: data.label,
                description: data.description,
                defaults: data.defaults,
                options: data.options,
                type: modal.fieldType.toLowerCase().replace(/ /g, '_'),
                required: false,
                active: true,
                system: false,
            }]);
            setFieldType('');
        } else {
            setFields(prev => prev.map(f =>
                f.id === modal.fieldId
                    ? { ...f, label: data.label, description: data.description, defaults: data.defaults, options: data.options }
                    : f
            ));
        }
        closeModal();
    };

    const removeField  = (id) => setFields(prev => prev.filter(f => f.id !== id));
    const toggleField  = (id, key) => setFields(prev =>
        prev.map(f => f.id === id ? { ...f, [key]: !f[key] } : f)
    );

    const onDragStart = (i) => { dragIdx.current = i; };
    const onDragOver  = (e, i) => { e.preventDefault(); setDragOverIdx(i); };
    const onDrop = (i) => {
        const from = dragIdx.current;
        if (from === null || from === i) { setDragOverIdx(null); return; }
        setFields(prev => {
            const next = [...prev];
            const [moved] = next.splice(from, 1);
            next.splice(i, 0, moved);
            return next;
        });
        dragIdx.current = null;
        setDragOverIdx(null);
    };
    const onDragEnd = () => { dragIdx.current = null; setDragOverIdx(null); };

    return (
        <div className="as-tab-panel cf-panel">
            {modal && (
                <FieldModal
                    mode={modal.mode}
                    fieldType={modal.fieldType}
                    initial={modal.initial}
                    onSave={handleSave}
                    onClose={closeModal}
                />
            )}

            {/* Add field form */}
            <div className="cf-add-form">
                <div className="cf-add-form-label">Add new field</div>
                <div className="cf-add-form-row">
                    <div className="cf-select-wrap">
                        <select
                            className="cf-select"
                            value={fieldType}
                            onChange={e => setFieldType(e.target.value)}
                        >
                            <option value="">Select field type...</option>
                            {FIELD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <svg className="cf-select-caret" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                    <button
                        className="as-primary-btn as-btn-sm"
                        disabled={!fieldType}
                        onClick={openAdd}
                    >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Add Field
                    </button>
                </div>
            </div>

            {/* Fields table */}
            <div className="as-table-wrap">
                <table className="as-table cf-table">
                    <colgroup>
                        <col style={{ width: 40 }} />
                        <col />
                        <col style={{ width: '13%' }} />
                        <col style={{ width: '14%' }} />
                        <col style={{ width: '11%' }} />
                        <col style={{ width: '10%' }} />
                        <col style={{ width: 88 }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Label Name</th>
                            <th>Type</th>
                            <th>Defaults</th>
                            <th style={{ textAlign: 'center' }}>Required</th>
                            <th style={{ textAlign: 'center' }}>Active</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fields.map((f, i) => (
                            <tr
                                key={f.id}
                                className={[
                                    f.system ? 'cf-system-row' : '',
                                    dragOverIdx === i ? 'cf-drag-over' : '',
                                ].filter(Boolean).join(' ')}
                                draggable
                                onDragStart={() => onDragStart(i)}
                                onDragOver={e => onDragOver(e, i)}
                                onDrop={() => onDrop(i)}
                                onDragEnd={onDragEnd}
                            >
                                <td className="cf-drag-cell"><DragHandle /></td>
                                <td>
                                    <div className="cf-label-cell">
                                        <span className="cf-label-name">{f.label}</span>
                                        {f.system && <span className="cf-system-tag">system</span>}
                                    </div>
                                </td>
                                <td><TypeBadge type={f.type} /></td>
                                <td className="cf-defaults-cell">{f.defaults || <span className="cf-empty">—</span>}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <Toggle value={f.required} onChange={() => toggleField(f.id, 'required')} disabled={f.system} />
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <Toggle value={f.active} onChange={() => toggleField(f.id, 'active')} disabled={f.system} />
                                </td>
                                <td>
                                    {f.system ? (
                                        <div className="cf-locked">
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                            Locked
                                        </div>
                                    ) : (
                                        <div className="cf-actions">
                                            <button className="users-icon-btn" data-tooltip="Edit" onClick={() => openEdit(f)}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                            </button>
                                            <button className="users-icon-btn cf-delete-btn" data-tooltip="Delete" onClick={() => removeField(f.id)}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="cf-footer-note">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                System fields are locked and cannot be edited or deleted. Drag rows to reorder.
            </div>
        </div>
    );
};

const CustomFieldsView = () => {
    const [activeTab, setActiveTab]     = useState('Case Form');
    const [caseFields, setCaseFields]   = useState(CASE_FIELDS_INIT);
    const [userFields, setUserFields]   = useState(USER_FIELDS_INIT);

    return (
        <div className="portal-content as-content">
            <div className="as-tabs-bar">
                {['Case Form', 'User Form'].map(t => (
                    <button key={t} className={`as-tab${activeTab === t ? ' active' : ''}`} onClick={() => setActiveTab(t)}>
                        {t}
                    </button>
                ))}
            </div>
            {activeTab === 'Case Form' && <FieldsTab fields={caseFields} setFields={setCaseFields} />}
            {activeTab === 'User Form' && <FieldsTab fields={userFields} setFields={setUserFields} />}
        </div>
    );
};

export default CustomFieldsView;
