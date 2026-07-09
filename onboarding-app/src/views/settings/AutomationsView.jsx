import { useState, useRef } from 'react';
import MultiSelect from '../../components/MultiSelect';
import SearchableSelect from '../../components/SearchableSelect';
import '../settings/AdvancedSettingsView.css';
import '../library/LibraryViews.css';
import './AutomationsView.css';

const Tab = ({ label, active, onClick }) => (
    <button className={`as-tab${active ? ' active' : ''}`} onClick={onClick}>{label}</button>
);

const RemoveBtn = ({ onClick }) => (
    <button className="users-icon-btn auto-remove-icon" onClick={onClick} data-tooltip="Remove">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
    </button>
);

const EditBtn = ({ onClick, tooltip = 'Edit' }) => (
    <button className="users-icon-btn auto-edit-icon" onClick={onClick} data-tooltip={tooltip}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4Z"/></svg>
    </button>
);

const RowActions = ({ onEdit, onRemove, editTooltip = 'Edit' }) => (
    <div className="auto-row-actions">
        <EditBtn onClick={onEdit} tooltip={editTooltip} />
        <RemoveBtn onClick={onRemove} />
    </div>
);

const NewBtn = ({ onClick }) => (
    <button className="as-primary-btn as-btn-sm" onClick={onClick}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        New
    </button>
);

const Toggle = ({ value, onChange, label }) => (
    <button
        type="button"
        className={`as-toggle${value ? ' on' : ''}`}
        onClick={() => onChange(!value)}
        aria-pressed={value}
        aria-label={label}
    >
        <span className="as-toggle-knob" />
    </button>
);

/* ── Assign User Modal ── */
const USER_SEARCH_TYPES = ['Email', 'Phone'];
const ROLE_OPTIONS = ['', 'staff', 'admin', 'client'];
const CASE_TYPE_OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'general', label: 'General' },
];
const getCaseTypeLabel = (value) => CASE_TYPE_OPTIONS.find((option) => option.value === value)?.label || value;

const AssignUserModal = ({ onClose, onSave, initialData = null }) => {
    const [searchType, setSearchType] = useState('Email');
    const [typeOpen, setTypeOpen]     = useState(false);
    const [searchValue, setSearchValue] = useState(initialData?.name || '');
    const [role, setRole]             = useState(initialData?.role || '');
    const [caseType, setCaseType]     = useState(initialData?.caseType || '');
    const [notify, setNotify]         = useState(initialData?.notify || false);
    const typeWrapRef = useRef(null);
    const [dropUp, setDropUp] = useState(false);

    const toggleTypeDropdown = () => {
        if (typeWrapRef.current) {
            const rect = typeWrapRef.current.getBoundingClientRect();
            setDropUp(window.innerHeight - rect.bottom < 220);
        }
        setTypeOpen(p => !p);
    };

    const canSave = searchValue.trim() && role && caseType;
    const save = () => {
        if (!canSave) return;
        onSave({
            userId: initialData?.userId || `cu-${Date.now().toString(36)}`,
            name: searchValue.trim(),
            caseType,
            role,
            notify,
        });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="ccm ccm-narrow" onClick={e => e.stopPropagation()}>
                <div className="ccm-header">
                    <h2 className="ccm-title">{initialData ? 'Edit Assignment Rule' : 'Assign User'}</h2>
                    <button className="ccm-close" onClick={onClose}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                <div className="ccm-body ccm-user-body">
                    <div className="auto-idle-rule-card">
                        <div className="ccm-section-label">Rule summary</div>
                        <p className="auto-idle-rule-copy">Automatically assign the right team member when a new case matches this case type.</p>
                    </div>
                    <div className="ccm-assign-input-wrap">
                        <div className="ccm-search-type-wrap" ref={typeWrapRef}>
                            <button className="ccm-search-type-btn" onClick={toggleTypeDropdown}>
                                {searchType}
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                            </button>
                            {typeOpen && (
                                <div className={`ccm-type-dropdown${dropUp ? ' drop-up' : ''}`}>
                                    {USER_SEARCH_TYPES.map(t => (
                                        <button key={t} className={`ccm-type-option${searchType === t ? ' active' : ''}`}
                                            onClick={() => { setSearchType(t); setTypeOpen(false); setSearchValue(''); }}>
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="ccm-assign-divider" />
                        <div className="ccm-assign-input-right">
                            <input
                                type="text"
                                className="ccm-assign-text-input"
                                placeholder="Search value..."
                                value={searchValue}
                                onChange={e => setSearchValue(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="ccm-field">
                        <label className="ccm-label">Role <span className="auto-required">*</span></label>
                        <SearchableSelect className="ccm-select" value={role} onChange={e => setRole(e.target.value)}>
                            {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r || ''}</option>)}
                        </SearchableSelect>
                    </div>

                    <div className="ccm-field">
                        <label className="ccm-label">Case Type <span className="auto-required">*</span></label>
                        <SearchableSelect className="ccm-select" value={caseType} onChange={e => setCaseType(e.target.value)}>
                            <option value="">No case type selected</option>
                            {CASE_TYPE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                        </SearchableSelect>
                    </div>

                    <div className="auto-toggle-row">
                        <div className="auto-toggle-copy">
                            <div className="auto-toggle-title">Notify assigned user</div>
                            <div className="auto-toggle-desc">Send an email when this automation adds them to a matching case.</div>
                        </div>
                        <Toggle
                            value={notify}
                            onChange={setNotify}
                            label="Notify assigned user when they are added to a matching case"
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

/* ── Assign Cases ── */
const ASSIGN_DATA_INIT = [
    { userId: 'cu-fe493b85f08789', name: 'Ar Tanveer', caseType: 'all', role: 'staff', notify: true },
];

const AssignCasesTab = () => {
    const [data, setData] = useState(ASSIGN_DATA_INIT);
    const [editingIndex, setEditingIndex] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const activeRow = editingIndex !== null ? data[editingIndex] : null;

    const saveRow = (row) => {
        if (editingIndex !== null) {
            setData((current) => current.map((item, index) => index === editingIndex ? row : item));
            setEditingIndex(null);
            return;
        }
        setData((current) => [...current, row]);
    };

    return (
        <div className="as-tab-panel">
            {(showModal || editingIndex !== null) && (
                <AssignUserModal
                    initialData={activeRow}
                    onClose={() => { setShowModal(false); setEditingIndex(null); }}
                    onSave={saveRow}
                />
            )}
            <div className="as-panel-header">
                <div className="as-panel-title-wrap">
                    <div className="auto-section-label" style={{ margin: 0 }}>WHEN A CASE IS CREATED, AUTO ASSIGN THESE USERS</div>
                    <p className="as-panel-subtitle">Route new cases to the right staff automatically based on case type and assignment rules.</p>
                </div>
                <NewBtn onClick={() => setShowModal(true)} />
            </div>
            <div className="as-table-wrap">
                <table className="as-table">
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Name</th>
                            <th>Case Type</th>
                            <th>Role</th>
                            <th>Notify</th>
                            <th className="auto-action-cell">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, i) => (
                            <tr key={i}>
                                <td className="auto-mono" data-label="User ID">{row.userId}</td>
                                <td className="auto-link" data-label="Name">{row.name}</td>
                                <td data-label="Case Type">{getCaseTypeLabel(row.caseType)}</td>
                                <td data-label="Role">{row.role}</td>
                                <td data-label="Notify">{row.notify ? 'true' : 'false'}</td>
                                <td className="auto-action-cell" data-label="Action">
                                    <RowActions
                                        editTooltip="Edit assignment"
                                        onEdit={() => setEditingIndex(i)}
                                        onRemove={() => setData(d => d.filter((_, j) => j !== i))}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

/* ── Bootstrap Cases ── */
const BOOTSTRAP_ROLE_OPTIONS = ['', 'clients', 'staff', 'admin'];
const BOOTSTRAP_CASE_TYPE_OPTIONS = CASE_TYPE_OPTIONS;
const POST_TEMPLATE_OPTIONS = ['Welcome to Case', 'Case Status Overview', 'Next Steps After Intake'];
const FORM_TEMPLATE_OPTIONS = ['Case Intake Form', 'Medical History Form', 'Incident Details Form', 'Expense Log'];
const ESIGN_TEMPLATE_OPTIONS = ['Retainer Agreement', 'Release Authorization', 'HIPAA Authorization'];
const TASK_TEMPLATE_OPTIONS = [
    'Complete Your Intake Forms',
    'Review and Sign Your Case Documents',
    'Complete Your Case Intake Form',
    'Schedule and Attend Your Initial Consultation',
    'Provide Supporting Documents',
    'Case Review and Closing',
];
const NOTE_TEMPLATE_OPTIONS = ['Case Representation Letter', 'Initial Case Summary', 'Document Request Note'];
const OPERATION_ORDER_OPTIONS = ['Forms', 'E-Signs', 'Notes', 'Tasks', 'Posts'];

const BOOTSTRAP_DATA = [
    {
        role: 'clients',
        caseType: 'all',
        operationOrder: ['Forms', 'E-Signs', 'Notes', 'Tasks', 'Posts'],
        posts: ['Welcome to Case'],
        forms: ['Case Intake Form'],
        eSigns: ['Retainer Agreement', 'Release Authorization'],
        tasks: [
            'Complete Your Intake Forms',
            'Review and Sign Your Case Documents',
            'Complete Your Case Intake Form',
            'Schedule and Attend Your Initial Consultation',
            'Provide Supporting Documents',
            'Case Review and Closing',
        ],
        notes: ['Case Representation Letter'],
    },
];

const BootstrapGroup = ({ label, items, tone = 'default' }) => {
    if (!items?.length) return null;
    return (
        <div className="auto-template-group">
            <span className={`auto-template-group-label ${tone}`}>{label}</span>
            <div className="auto-chip-list">
                {items.map(item => <span key={item} className="auto-chip">{item}</span>)}
            </div>
        </div>
    );
};

const BootstrapTemplatesCell = ({ row }) => (
    <div className="auto-template-stack">
        <BootstrapGroup label="Posts" items={row.posts} tone="posts" />
        <BootstrapGroup label="Forms" items={row.forms} tone="forms" />
        <BootstrapGroup label="E-Signs" items={row.eSigns} tone="signs" />
        <BootstrapGroup label="Tasks" items={row.tasks} tone="tasks" />
        <BootstrapGroup label="Notes" items={row.notes} tone="notes" />
    </div>
);

const AddBootstrapModal = ({ onClose, onSave, initialData = null }) => {
    const [role, setRole] = useState(initialData?.role || '');
    const [caseType, setCaseType] = useState(initialData?.caseType || '');
    const [posts, setPosts] = useState(initialData?.posts || []);
    const [forms, setForms] = useState(initialData?.forms || []);
    const [eSigns, setESigns] = useState(initialData?.eSigns || []);
    const [tasks, setTasks] = useState(initialData?.tasks || []);
    const [notes, setNotes] = useState(initialData?.notes || []);
    const [operationOrder, setOperationOrder] = useState(initialData?.operationOrder || []);

    const templateCount = posts.length + forms.length + eSigns.length + tasks.length + notes.length;
    const canSave = role && caseType && operationOrder.length > 0 && templateCount > 0;

    const save = () => {
        if (!canSave) return;
        onSave({ role, caseType, posts, forms, eSigns, tasks, notes, operationOrder });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="ccm auto-bootstrap-modal" onClick={e => e.stopPropagation()}>
                <div className="ccm-header">
                    <h2 className="ccm-title">{initialData ? 'Edit Case Bootstrap Rule' : 'Add Case Bootstrap Rule'}</h2>
                    <button className="ccm-close" onClick={onClose}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                <div className="ccm-body">
                    <div className="auto-modal-section">
                        <div className="auto-idle-rule-card">
                            <div className="ccm-section-label">Rule summary</div>
                            <p className="auto-idle-rule-copy">Bundle together the posts, forms, e-signs, notes, and tasks that should appear the moment a matching user is assigned.</p>
                        </div>
                        <div className="ccm-section-label">Trigger</div>
                        <div className="ccm-grid-2">
                            <div className="ccm-field">
                                <label className="ccm-label">Assigned role <span className="ccm-req">*</span></label>
                                <SearchableSelect className="ccm-select" value={role} onChange={e => setRole(e.target.value)}>
                                    <option value="">No role selected</option>
                                    {BOOTSTRAP_ROLE_OPTIONS.slice(1).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </SearchableSelect>
                                <span className="ccm-hint">Apply this rule when a user with this role is added to a case.</span>
                            </div>
                            <div className="ccm-field">
                                <label className="ccm-label">Case type <span className="ccm-req">*</span></label>
                                <SearchableSelect className="ccm-select" value={caseType} onChange={e => setCaseType(e.target.value)}>
                                    <option value="">No case type selected</option>
                                    {BOOTSTRAP_CASE_TYPE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                                </SearchableSelect>
                                <span className="ccm-hint">Use all to run this rule for every case type.</span>
                            </div>
                        </div>
                    </div>

                    <hr className="ccm-divider" />

                    <div className="auto-modal-section">
                        <div className="auto-modal-section-head">
                            <div>
                                <div className="ccm-section-label">Templates to add</div>
                                <p className="auto-modal-section-copy">Choose the case materials that should be created automatically.</p>
                            </div>
                            <span className="auto-count-pill">{templateCount} selected</span>
                        </div>
                        <div className="auto-template-picker-grid">
                            <div className="ccm-field">
                                <label className="ccm-label">Add posts</label>
                                <MultiSelect options={POST_TEMPLATE_OPTIONS} value={posts} onChange={setPosts} placeholder="No post selected" />
                            </div>
                            <div className="ccm-field">
                                <label className="ccm-label">Add forms</label>
                                <MultiSelect options={FORM_TEMPLATE_OPTIONS} value={forms} onChange={setForms} placeholder="No form selected" />
                            </div>
                            <div className="ccm-field">
                                <label className="ccm-label">Add e-signs</label>
                                <MultiSelect options={ESIGN_TEMPLATE_OPTIONS} value={eSigns} onChange={setESigns} placeholder="No e-sign selected" />
                            </div>
                            <div className="ccm-field">
                                <label className="ccm-label">Add tasks</label>
                                <MultiSelect options={TASK_TEMPLATE_OPTIONS} value={tasks} onChange={setTasks} placeholder="No task selected" />
                            </div>
                            <div className="ccm-field">
                                <label className="ccm-label">Add notes</label>
                                <MultiSelect options={NOTE_TEMPLATE_OPTIONS} value={notes} onChange={setNotes} placeholder="No note selected" />
                            </div>
                            <div className="ccm-field">
                                <label className="ccm-label">Operation order <span className="ccm-req">*</span></label>
                                <MultiSelect options={OPERATION_ORDER_OPTIONS} value={operationOrder} onChange={setOperationOrder} placeholder="No operation order selected" />
                                <span className="ccm-hint">CaseActive runs the selected groups in this order.</span>
                            </div>
                        </div>
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

const BootstrapCasesTab = () => {
    const [data, setData] = useState(BOOTSTRAP_DATA);
    const [showModal, setShowModal] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const activeRow = editingIndex !== null ? data[editingIndex] : null;

    const saveRow = (row) => {
        if (editingIndex !== null) {
            setData((current) => current.map((item, index) => index === editingIndex ? row : item));
            setEditingIndex(null);
            return;
        }
        setData((current) => [...current, row]);
    };

    return (
        <div className="as-tab-panel">
            {(showModal || editingIndex !== null) && (
                <AddBootstrapModal
                    initialData={activeRow}
                    onClose={() => { setShowModal(false); setEditingIndex(null); }}
                    onSave={saveRow}
                />
            )}
            <div className="as-panel-header">
                <div className="as-panel-title-wrap">
                    <div className="auto-section-label" style={{ margin: 0 }}>WHEN A USER IS ASSIGNED TO A CASE, AUTO ADD TEMPLATES</div>
                    <p className="as-panel-subtitle">Create the starter posts, forms, e-signs, notes, and tasks for matching case assignments.</p>
                </div>
                <NewBtn onClick={() => setShowModal(true)} />
            </div>
            <div className="as-table-wrap auto-no-scroll">
                <table className="as-table auto-bootstrap-table">
                    <thead>
                        <tr>
                            <th className="auto-col-role">Role</th>
                            <th className="auto-col-templates">Templates</th>
                            <th className="auto-col-case-type">Case Type</th>
                            <th className="auto-col-order">Operation Order</th>
                            <th className="auto-col-action auto-action-cell">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, i) => (
                            <tr key={i}>
                                <td className="auto-valign-top auto-col-role" data-label="Role">
                                    <span className="auto-role-pill">{row.role}</span>
                                </td>
                                <td className="auto-col-templates" data-label="Templates">
                                    <BootstrapTemplatesCell row={row} />
                                </td>
                                <td className="auto-valign-top auto-col-case-type" data-label="Case Type">
                                    <span className="auto-case-type-pill">{getCaseTypeLabel(row.caseType)}</span>
                                </td>
                                <td className="auto-valign-top auto-col-order" data-label="Order">
                                    <div className="auto-order-list">
                                        {row.operationOrder.map((item, index) => (
                                            <span key={item} className="auto-order-chip">{index + 1}. {item}</span>
                                        ))}
                                    </div>
                                </td>
                                <td className="auto-valign-top auto-col-action auto-action-cell" data-label="Action">
                                    <RowActions
                                        editTooltip="Edit bootstrap rule"
                                        onEdit={() => setEditingIndex(i)}
                                        onRemove={() => setData(d => d.filter((_, j) => j !== i))}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

/* ── Idle Cases ── */
const IDLE_DATA_INIT = [
    { caseType: 'all', idleDays: 15, postTemplate: 'Case Status Update' },
];
const IDLE_POST_OPTIONS = [
    { value: 'Case Closing Notice', label: 'Case Closing Notice' },
    { value: 'Welcome to Case', label: 'Welcome to Case' },
    { value: 'post for idle cases', label: 'post for idle cases' },
    { value: 'Case Status Update', label: 'Case Status Update' },
    { value: 'Missing Information Follow-Up', label: 'Missing Information Follow-Up' },
];

const AddIdleMessageModal = ({ onClose, onSave, initialData = null }) => {
    const [caseType, setCaseType] = useState(initialData?.caseType || '');
    const [idleDays, setIdleDays] = useState(initialData?.idleDays?.toString() || '');
    const [postTemplate, setPostTemplate] = useState(initialData?.postTemplate || '');

    const canSave = caseType && Number(idleDays) > 0 && postTemplate;

    const save = () => {
        if (!canSave) return;
        onSave({
            caseType,
            idleDays: Number(idleDays),
            postTemplate,
        });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="ccm auto-idle-modal" onClick={(e) => e.stopPropagation()}>
                <div className="ccm-header">
                    <h2 className="ccm-title">{initialData ? 'Edit Idle Message Rule' : 'Set Idle Message'}</h2>
                    <button className="ccm-close" onClick={onClose}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                <div className="ccm-body">
                    <div className="auto-modal-section">
                        <div className="auto-idle-rule-card">
                            <div className="ccm-section-label">Rule summary</div>
                            <p className="auto-idle-rule-copy">Send a follow-up post template when a case has gone quiet longer than your team wants.</p>
                        </div>

                        <div className="ccm-grid-2 auto-idle-grid">
                            <div className="ccm-field">
                                <label className="ccm-label">Case type <span className="ccm-req">*</span></label>
                                <SearchableSelect className="ccm-select" value={caseType} onChange={(e) => setCaseType(e.target.value)}>
                                    <option value="">No case type selected</option>
                                    {CASE_TYPE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                                </SearchableSelect>
                                <span className="ccm-hint">Choose which cases should receive this idle follow-up.</span>
                            </div>

                            <div className="ccm-field">
                                <label className="ccm-label">Idle days <span className="ccm-req">*</span></label>
                                <input
                                    type="number"
                                    min="1"
                                    step="1"
                                    className="ccm-input"
                                    value={idleDays}
                                    onChange={(e) => setIdleDays(e.target.value)}
                                    placeholder="e.g. 15"
                                />
                                <span className="ccm-hint">CaseActive will post after this many days without activity.</span>
                            </div>
                        </div>

                        <div className="ccm-field">
                            <label className="ccm-label">Post template <span className="ccm-req">*</span></label>
                            <SearchableSelect className="ccm-select" value={postTemplate} onChange={(e) => setPostTemplate(e.target.value)}>
                                <option value="">No post template selected</option>
                                {IDLE_POST_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                            </SearchableSelect>
                            <span className="ccm-hint">Choose the message that should go out automatically once a case hits the idle threshold.</span>
                        </div>
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

const IdleCasesTab = () => {
    const [data, setData] = useState(IDLE_DATA_INIT);
    const [showModal, setShowModal] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const activeRow = editingIndex !== null ? data[editingIndex] : null;

    const saveRow = (row) => {
        if (editingIndex !== null) {
            setData((current) => current.map((item, index) => index === editingIndex ? row : item));
            setEditingIndex(null);
            return;
        }
        setData((current) => [...current, row]);
    };

    return (
        <div className="as-tab-panel">
            {(showModal || editingIndex !== null) && (
                <AddIdleMessageModal
                    initialData={activeRow}
                    onClose={() => { setShowModal(false); setEditingIndex(null); }}
                    onSave={saveRow}
                />
            )}
            <div className="as-panel-header">
                <div className="as-panel-title-wrap">
                    <div className="auto-section-label" style={{ margin: 0 }}>WHEN A CASE IS IDLE, POST THIS MESSAGE</div>
                    <p className="as-panel-subtitle">Follow up automatically when a case has been quiet longer than your team allows.</p>
                </div>
                <NewBtn onClick={() => setShowModal(true)} />
            </div>
            <div className="as-table-wrap">
                <table className="as-table">
                    <thead>
                        <tr>
                            <th>Case Type</th>
                            <th>Idle Days</th>
                            <th>Post Template</th>
                            <th className="auto-action-cell">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, i) => (
                            <tr key={i}>
                                <td data-label="Case Type">{getCaseTypeLabel(row.caseType)}</td>
                                <td data-label="Idle Days">{row.idleDays}</td>
                                <td data-label="Post Template">{row.postTemplate}</td>
                                <td className="auto-action-cell" data-label="Action">
                                    <RowActions
                                        editTooltip="Edit idle rule"
                                        onEdit={() => setEditingIndex(i)}
                                        onRemove={() => setData(d => d.filter((_, j) => j !== i))}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

/* ── Birthday Users ── */
const BIRTHDAY_DATA_INIT = [
    { caseType: 'all', postTemplate: 'Birthday Greeting' },
];
const BIRTHDAY_POST_OPTIONS = [
    { value: 'Birthday Greeting', label: 'Birthday Greeting' },
    { value: 'Happy Birthday from Your Legal Team', label: 'Happy Birthday from Your Legal Team' },
    { value: 'Birthday Check-In', label: 'Birthday Check-In' },
    { value: 'Celebrating Your Birthday', label: 'Celebrating Your Birthday' },
];

const AddBirthdayMessageModal = ({ onClose, onSave, initialData = null }) => {
    const [caseType, setCaseType] = useState(initialData?.caseType || '');
    const [postTemplate, setPostTemplate] = useState(initialData?.postTemplate || '');

    const canSave = caseType && postTemplate;

    const save = () => {
        if (!canSave) return;
        onSave({ caseType, postTemplate });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="ccm auto-idle-modal" onClick={(e) => e.stopPropagation()}>
                <div className="ccm-header">
                    <h2 className="ccm-title">{initialData ? 'Edit Birthday Message Rule' : 'Set Birthday Message'}</h2>
                    <button className="ccm-close" onClick={onClose}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                <div className="ccm-body">
                    <div className="auto-modal-section">
                        <div className="auto-idle-rule-card">
                            <div className="ccm-section-label">Rule summary</div>
                            <p className="auto-idle-rule-copy">Send a birthday post template automatically when a matching user reaches their birthday.</p>
                        </div>

                        <div className="ccm-grid-2 auto-idle-grid">
                            <div className="ccm-field">
                                <label className="ccm-label">Case type <span className="ccm-req">*</span></label>
                                <SearchableSelect className="ccm-select" value={caseType} onChange={(e) => setCaseType(e.target.value)}>
                                    <option value="">No case type selected</option>
                                    {CASE_TYPE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                                </SearchableSelect>
                                <span className="ccm-hint">Choose which case type should receive this birthday message.</span>
                            </div>

                            <div className="ccm-field">
                                <label className="ccm-label">Post template <span className="ccm-req">*</span></label>
                                <SearchableSelect className="ccm-select" value={postTemplate} onChange={(e) => setPostTemplate(e.target.value)}>
                                    <option value="">No post template selected</option>
                                    {BIRTHDAY_POST_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                                </SearchableSelect>
                                <span className="ccm-hint">Choose the birthday message template that best fits your firm’s tone.</span>
                            </div>
                        </div>
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

const BirthdayUsersTab = () => {
    const [data, setData] = useState(BIRTHDAY_DATA_INIT);
    const [showModal, setShowModal] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const activeRow = editingIndex !== null ? data[editingIndex] : null;

    const saveRow = (row) => {
        if (editingIndex !== null) {
            setData((current) => current.map((item, index) => index === editingIndex ? row : item));
            setEditingIndex(null);
            return;
        }
        setData((current) => [...current, row]);
    };

    return (
        <div className="as-tab-panel">
            {(showModal || editingIndex !== null) && (
                <AddBirthdayMessageModal
                    initialData={activeRow}
                    onClose={() => { setShowModal(false); setEditingIndex(null); }}
                    onSave={saveRow}
                />
            )}
            <div className="as-panel-header">
                <div className="as-panel-title-wrap">
                    <div className="auto-section-label" style={{ margin: 0 }}>WHEN A BIRTHDAY, POST THIS MESSAGE</div>
                    <p className="as-panel-subtitle">Keep birthday outreach consistent with a post that goes out automatically for matching users.</p>
                </div>
                <NewBtn onClick={() => setShowModal(true)} />
            </div>
            <div className="as-table-wrap">
                <table className="as-table">
                    <thead>
                        <tr>
                            <th>Case Type</th>
                            <th>Post Template</th>
                            <th className="auto-action-cell">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, i) => (
                            <tr key={i}>
                                <td data-label="Case Type">{getCaseTypeLabel(row.caseType)}</td>
                                <td data-label="Post Template">{row.postTemplate}</td>
                                <td className="auto-action-cell" data-label="Action">
                                    <RowActions
                                        editTooltip="Edit birthday rule"
                                        onEdit={() => setEditingIndex(i)}
                                        onRemove={() => setData(d => d.filter((_, j) => j !== i))}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

/* ── Main View ── */
const TABS = ['Assign Cases', 'Bootstrap Cases', 'Idle Cases', 'Birthday Users'];

const AutomationsView = () => {
    const [activeTab, setActiveTab] = useState('Assign Cases');

    return (
        <div className="portal-content as-content">
            <div className="as-tabs-bar">
                {TABS.map(t => (
                    <Tab key={t} label={t} active={activeTab === t} onClick={() => setActiveTab(t)} />
                ))}
            </div>

            {activeTab === 'Assign Cases'    && <AssignCasesTab />}
            {activeTab === 'Bootstrap Cases' && <BootstrapCasesTab />}
            {activeTab === 'Idle Cases'      && <IdleCasesTab />}
            {activeTab === 'Birthday Users'  && <BirthdayUsersTab />}
        </div>
    );
};

export default AutomationsView;
