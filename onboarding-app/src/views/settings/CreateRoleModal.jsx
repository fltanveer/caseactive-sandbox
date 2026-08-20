import { useMemo, useState } from 'react';
import './CreateRoleModal.css';

/* ── Permission catalog ──────────────────────────────────────────
   kind drives the presets: read | write | delete | moderate       */

const CASE_FIELDS = [
    { id: 'about', label: 'About' },
    { id: 'reference', label: 'Reference Id' },
    { id: 'opened', label: 'Date Opened' },
    { id: 'status', label: 'Status' },
    { id: 'types', label: 'Case Types' },
    { id: 'newform', label: 'New form for test' },
];

const MODULES = [
    {
        id: 'case', label: 'Case',
        icon: <><path d="M4 4h6l2 3h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></>,
        perms: [
            { id: 'case.read', label: 'Read all case fields specified in the role', kind: 'read', fields: CASE_FIELDS },
            { id: 'case.update', label: 'Update all case fields specified in the role', kind: 'write', fields: CASE_FIELDS },
        ],
    },
    {
        id: 'convos', label: 'Convos',
        icon: <><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></>,
        perms: [
            { id: 'convos.read', label: 'Get all convos', kind: 'read' },
            { id: 'convos.end', label: 'End a convo', kind: 'write' },
            { id: 'convos.moderate', label: 'Moderate a convos', kind: 'moderate' },
        ],
    },
    {
        id: 'events', label: 'Events',
        icon: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
        perms: [
            { id: 'events.read', label: 'Get all events', kind: 'read' },
            { id: 'events.write', label: 'Create or update an event', kind: 'write' },
            { id: 'events.delete', label: 'Delete an event', kind: 'delete' },
            { id: 'events.moderate', label: 'Moderate events', kind: 'moderate' },
        ],
    },
    {
        id: 'posts', label: 'Posts',
        icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
        perms: [
            { id: 'posts.read', label: 'Get all posts', kind: 'read' },
            { id: 'posts.write', label: 'Create or update a post', kind: 'write' },
            { id: 'posts.delete', label: 'Delete a post', kind: 'delete' },
            { id: 'posts.comment', label: 'Comment or update on a post', kind: 'write' },
            { id: 'posts.commentDelete', label: 'Delete a comment on a post', kind: 'delete' },
            { id: 'posts.moderate', label: 'Moderate posts', kind: 'moderate' },
        ],
    },
    {
        id: 'forms', label: 'Forms',
        icon: <><path d="M9 11H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-4"/><polyline points="9 7 12 4 15 7"/><line x1="12" y1="4" x2="12" y2="15"/></>,
        perms: [
            { id: 'forms.read', label: 'Get all forms', kind: 'read' },
            { id: 'forms.write', label: 'Create or update a form', kind: 'write' },
            { id: 'forms.delete', label: 'Delete a form', kind: 'delete' },
            { id: 'forms.deleteSubmitted', label: 'Delete a submitted form', kind: 'delete' },
            { id: 'forms.moderate', label: 'Moderate forms', kind: 'moderate' },
        ],
    },
    {
        id: 'esigns', label: 'E-Signs',
        icon: <><path d="M3 17c3.5 0 3.5-10 7-10s3.5 10 7 10c1.7 0 2.6-1 4-3"/><line x1="3" y1="21" x2="21" y2="21"/></>,
        perms: [
            { id: 'esigns.read', label: 'Get all signs', kind: 'read' },
            { id: 'esigns.write', label: 'Create or update a sign', kind: 'write' },
            { id: 'esigns.delete', label: 'Delete a sign', kind: 'delete' },
            { id: 'esigns.comment', label: 'Comment or update on a sign', kind: 'write' },
            { id: 'esigns.commentDelete', label: 'Delete a comment on a sign', kind: 'delete' },
            { id: 'esigns.deleteSigned', label: 'Delete a signed form', kind: 'delete' },
            { id: 'esigns.moderate', label: 'Moderate signs', kind: 'moderate' },
        ],
    },
    {
        id: 'invoices', label: 'Invoices',
        icon: <><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></>,
        perms: [
            { id: 'invoices.read', label: 'Get all invoices', kind: 'read' },
            { id: 'invoices.write', label: 'Create or update an invoice', kind: 'write' },
            { id: 'invoices.delete', label: 'Delete an invoice', kind: 'delete' },
            { id: 'invoices.pay', label: 'Pay an invoice', kind: 'write' },
            { id: 'invoices.moderate', label: 'Moderate invoices', kind: 'moderate' },
        ],
    },
    {
        id: 'notes', label: 'Notes',
        icon: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
        perms: [
            { id: 'notes.read', label: 'Get all notes', kind: 'read' },
            { id: 'notes.write', label: 'Create or update a note', kind: 'write' },
            { id: 'notes.delete', label: 'Delete a note', kind: 'delete' },
            { id: 'notes.moderate', label: 'Moderate notes', kind: 'moderate' },
        ],
    },
    {
        id: 'tasks', label: 'Tasks',
        icon: <><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></>,
        perms: [
            { id: 'tasks.read', label: 'Get all tasks', kind: 'read' },
            { id: 'tasks.write', label: 'Create or update a task', kind: 'write' },
            { id: 'tasks.delete', label: 'Delete a task', kind: 'delete' },
            { id: 'tasks.comment', label: 'Comment or update on a task', kind: 'write' },
            { id: 'tasks.commentDelete', label: 'Delete a comment on a task', kind: 'delete' },
            { id: 'tasks.moderate', label: 'Moderate tasks', kind: 'moderate' },
        ],
    },
    {
        id: 'team', label: 'Team',
        icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></>,
        perms: [
            { id: 'team.read', label: 'Get all teams', kind: 'read' },
        ],
    },
];

const FILE_TYPES = [
    { id: 'audios', label: 'Audios' },
    { id: 'documents', label: 'Documents' },
    { id: 'files', label: 'Files' },
    { id: 'images', label: 'Images' },
    { id: 'videos', label: 'Videos' },
    { id: 'schemas', label: 'Schemas' },
];

const ROLE_COLORS = ['#149EB1', '#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

/* Every togglable id — parent perms plus their nested field ids */
const ALL_PERMS = MODULES.flatMap(m => m.perms);
const permLeafIds = (perm) => (perm.fields ? perm.fields.map(f => `${perm.id}:${f.id}`) : []);

const PRESETS = [
    { id: 'blank', name: 'No access', desc: 'Start from scratch', match: () => false },
    { id: 'read', name: 'Read only', desc: 'View everything, change nothing', match: p => p.kind === 'read' },
    { id: 'standard', name: 'Standard', desc: 'Read and create, no deletes', match: p => p.kind === 'read' || p.kind === 'write' },
    { id: 'full', name: 'Full access', desc: 'Every permission enabled', match: () => true },
];

const buildPreset = (preset) => {
    const next = new Set();
    ALL_PERMS.forEach(p => {
        if (!preset.match(p)) return;
        next.add(p.id);
        permLeafIds(p).forEach(id => next.add(id));
    });
    return next;
};

/* ── Tri-state checkbox ── */
const Check = ({ state, onChange }) => (
    <button
        type="button"
        className={`crm-check ${state}`}
        onClick={onChange}
        role="checkbox"
        aria-checked={state === 'on' ? 'true' : state === 'mixed' ? 'mixed' : 'false'}
    >
        {state === 'on' && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        )}
        {state === 'mixed' && <span className="crm-check-dash" />}
    </button>
);

const CreateRoleModal = ({ onClose, onCreate }) => {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState(ROLE_COLORS[0]);
    const [presetId, setPresetId] = useState('standard');
    const [granted, setGranted] = useState(() => buildPreset(PRESETS[2]));
    const [activeModule, setActiveModule] = useState('case');
    const [search, setSearch] = useState('');
    const [limits, setLimits] = useState(() => {
        const init = {};
        FILE_TYPES.forEach(f => { init[f.id] = '10'; });
        return init;
    });

    const has = (id) => granted.has(id);

    const setMany = (ids, on) => {
        setGranted(prev => {
            const next = new Set(prev);
            ids.forEach(id => (on ? next.add(id) : next.delete(id)));
            return next;
        });
    };

    /* Parent perm state accounts for its nested fields */
    const permState = (perm) => {
        const leaves = permLeafIds(perm);
        if (!leaves.length) return has(perm.id) ? 'on' : 'off';
        const onCount = leaves.filter(has).length;
        if (has(perm.id) && onCount === leaves.length) return 'on';
        if (has(perm.id) || onCount > 0) return 'mixed';
        return 'off';
    };

    const togglePerm = (perm) => {
        const on = permState(perm) !== 'on';
        setMany([perm.id, ...permLeafIds(perm)], on);
        setPresetId(null);
    };

    const toggleField = (perm, fieldId) => {
        const leafId = `${perm.id}:${fieldId}`;
        const on = !has(leafId);
        setGranted(prev => {
            const next = new Set(prev);
            if (on) { next.add(leafId); next.add(perm.id); }
            else {
                next.delete(leafId);
                if (permLeafIds(perm).every(id => id === leafId || !prev.has(id))) next.delete(perm.id);
            }
            return next;
        });
        setPresetId(null);
    };

    const moduleIds = (mod) => mod.perms.flatMap(p => [p.id, ...permLeafIds(p)]);
    const moduleCount = (mod) => ({
        on: mod.perms.filter(p => permState(p) !== 'off').length,
        total: mod.perms.length,
    });

    const setModuleLevel = (mod, level) => {
        const off = moduleIds(mod);
        setGranted(prev => {
            const next = new Set(prev);
            off.forEach(id => next.delete(id));
            mod.perms.forEach(p => {
                const keep = level === 'all' || (level === 'read' && p.kind === 'read');
                if (keep) { next.add(p.id); permLeafIds(p).forEach(id => next.add(id)); }
            });
            return next;
        });
        setPresetId(null);
    };

    const applyPreset = (preset) => {
        setPresetId(preset.id);
        setGranted(buildPreset(preset));
    };

    const totalGranted = useMemo(
        () => ALL_PERMS.filter(p => permState(p) !== 'off').length,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [granted]
    );

    const searchResults = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return null;
        return MODULES
            .map(m => ({ module: m, perms: m.perms.filter(p => p.label.toLowerCase().includes(q)) }))
            .filter(g => g.perms.length > 0);
    }, [search]);

    const mod = MODULES.find(m => m.id === activeModule);

    const submit = () => {
        onCreate?.({
            name: name.trim() || 'Untitled Role',
            description: description.trim(),
            color,
            permissions: [...granted],
            limits,
        });
        onClose();
    };

    const renderPermRow = (perm) => {
        const state = permState(perm);
        return (
            <div key={perm.id} className="crm-perm-block">
                <div className={`crm-perm-row${state !== 'off' ? ' on' : ''}`} onClick={() => togglePerm(perm)}>
                    <span className="crm-perm-label">{perm.label}</span>
                    <span className={`crm-kind crm-kind-${perm.kind}`}>{perm.kind}</span>
                    <Check state={state} onChange={() => togglePerm(perm)} />
                </div>
                {perm.fields && state !== 'off' && (
                    <div className="crm-field-list">
                        {perm.fields.map(f => {
                            const leafId = `${perm.id}:${f.id}`;
                            return (
                                <div
                                    key={f.id}
                                    className={`crm-field-row${has(leafId) ? ' on' : ''}`}
                                    onClick={() => toggleField(perm, f.id)}
                                >
                                    <span className="crm-field-label">{f.label}</span>
                                    <Check state={has(leafId) ? 'on' : 'off'} onChange={() => toggleField(perm, f.id)} />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="ccm crm-modal" onClick={e => e.stopPropagation()}>

                <div className="ccm-header">
                    <div>
                        <p className="ccm-breadcrumb">Advanced Settings · Roles</p>
                        <h2 className="ccm-title">Create Role</h2>
                    </div>
                    <button className="ccm-close" onClick={onClose}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                {/* Step rail */}
                <div className="crm-steps">
                    {['Role details', 'Permissions', 'File limits'].map((label, i) => {
                        const n = i + 1;
                        return (
                            <button
                                key={label}
                                type="button"
                                className={`crm-step${step === n ? ' active' : ''}${step > n ? ' done' : ''}`}
                                onClick={() => setStep(n)}
                            >
                                <span className="crm-step-num">
                                    {step > n
                                        ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                        : n}
                                </span>
                                {label}
                            </button>
                        );
                    })}
                </div>

                <div className="ccm-body crm-body">

                    {/* ── Step 1: details + preset ── */}
                    {step === 1 && (
                        <>
                            <div className="crm-detail-grid">
                                <div className="ccm-field">
                                    <label className="ccm-label">Role name <span className="ccm-req">*</span></label>
                                    <input
                                        className="ccm-input"
                                        placeholder="e.g. Senior Paralegal"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        autoFocus
                                    />
                                    <span className="crm-hint">Can&apos;t be changed after the role is created.</span>
                                </div>
                                <div className="ccm-field">
                                    <label className="ccm-label">Label color</label>
                                    <div className="crm-swatches">
                                        {ROLE_COLORS.map(c => (
                                            <button
                                                key={c}
                                                type="button"
                                                className={`crm-swatch${color === c ? ' active' : ''}`}
                                                style={{ background: c }}
                                                onClick={() => setColor(c)}
                                                aria-label={`Color ${c}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="ccm-field">
                                <label className="ccm-label">Description</label>
                                <input
                                    className="ccm-input"
                                    placeholder="What is this role for?"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="gs-divider" />

                            <div className="ccm-field">
                                <label className="ccm-label">Start from a preset</label>
                                <span className="crm-hint">Sets all {ALL_PERMS.length} permissions at once — fine-tune them in the next step.</span>
                                <div className="crm-preset-grid">
                                    {PRESETS.map(p => {
                                        const count = ALL_PERMS.filter(perm => p.match(perm)).length;
                                        return (
                                            <button
                                                key={p.id}
                                                type="button"
                                                className={`crm-preset${presetId === p.id ? ' selected' : ''}`}
                                                onClick={() => applyPreset(p)}
                                            >
                                                <span className="crm-preset-name">{p.name}</span>
                                                <span className="crm-preset-desc">{p.desc}</span>
                                                <span className="crm-preset-count">{count} of {ALL_PERMS.length} permissions</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    )}

                    {/* ── Step 2: master-detail permissions ── */}
                    {step === 2 && (
                        <>
                            <div className="crm-perm-toolbar">
                                <div className="crm-search">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                                    <input
                                        placeholder="Search all permissions..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                    />
                                    {search && (
                                        <button className="crm-search-clear" onClick={() => setSearch('')}>
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                        </button>
                                    )}
                                </div>
                                <span className="crm-total">
                                    <strong>{totalGranted}</strong> of {ALL_PERMS.length} granted
                                </span>
                            </div>

                            {searchResults ? (
                                <div className="crm-search-results">
                                    {searchResults.length === 0 ? (
                                        <p className="crm-empty">No permissions match &ldquo;{search}&rdquo;.</p>
                                    ) : searchResults.map(g => (
                                        <div key={g.module.id} className="crm-search-group">
                                            <p className="crm-search-group-title">{g.module.label}</p>
                                            {g.perms.map(renderPermRow)}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="crm-perm-layout">
                                    <div className="crm-rail">
                                        {MODULES.map(m => {
                                            const { on, total } = moduleCount(m);
                                            return (
                                                <button
                                                    key={m.id}
                                                    type="button"
                                                    className={`crm-rail-item${activeModule === m.id ? ' active' : ''}`}
                                                    onClick={() => setActiveModule(m.id)}
                                                >
                                                    <svg className="crm-rail-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{m.icon}</svg>
                                                    <span className="crm-rail-label">{m.label}</span>
                                                    <span className={`crm-rail-count${on === 0 ? ' zero' : on === total ? ' full' : ''}`}>{on}/{total}</span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className="crm-pane">
                                        <div className="crm-pane-header">
                                            <h3 className="crm-pane-title">{mod.label}</h3>
                                            <div className="crm-bulk">
                                                <button type="button" onClick={() => setModuleLevel(mod, 'none')}>None</button>
                                                <button type="button" onClick={() => setModuleLevel(mod, 'read')}>Read only</button>
                                                <button type="button" onClick={() => setModuleLevel(mod, 'all')}>All</button>
                                            </div>
                                        </div>
                                        <div className="crm-pane-body">
                                            {mod.perms.map(renderPermRow)}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* ── Step 3: file limits ── */}
                    {step === 3 && (
                        <>
                            <div className="crm-limit-head">
                                <div>
                                    <p className="ccm-label">Allowed file sizes</p>
                                    <span className="crm-hint">Maximum upload size per file for this role.</span>
                                </div>
                                <button
                                    type="button"
                                    className="crm-apply-all"
                                    onClick={() => {
                                        const v = limits[FILE_TYPES[0].id];
                                        const next = {};
                                        FILE_TYPES.forEach(f => { next[f.id] = v; });
                                        setLimits(next);
                                    }}
                                >
                                    Apply {limits[FILE_TYPES[0].id] || 0} MB to all
                                </button>
                            </div>

                            <div className="crm-limit-grid">
                                {FILE_TYPES.map(f => (
                                    <div key={f.id} className="crm-limit-row">
                                        <span className="crm-limit-label">{f.label}</span>
                                        <div className="crm-limit-input">
                                            <input
                                                type="number"
                                                min="1"
                                                value={limits[f.id]}
                                                onChange={e => setLimits(prev => ({ ...prev, [f.id]: e.target.value }))}
                                            />
                                            <span>MB</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="crm-summary">
                                <p className="crm-summary-title">Summary</p>
                                <div className="crm-summary-row">
                                    <span>Role</span>
                                    <span className="crm-summary-val">
                                        <span className="crm-summary-dot" style={{ background: color }} />
                                        {name || '—'}
                                    </span>
                                </div>
                                <div className="crm-summary-row">
                                    <span>Permissions</span>
                                    <span className="crm-summary-val">{totalGranted} of {ALL_PERMS.length} granted</span>
                                </div>
                                <div className="crm-summary-row">
                                    <span>Modules touched</span>
                                    <span className="crm-summary-val">
                                        {MODULES.filter(m => moduleCount(m).on > 0).length} of {MODULES.length}
                                    </span>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="ccm-footer crm-footer">
                    {step > 1 && <button className="imp-cancel-btn crm-back" onClick={() => setStep(step - 1)}>Back</button>}
                    <button className="imp-cancel-btn" onClick={onClose}>Cancel</button>
                    {step < 3 ? (
                        <button className="imp-save-btn" onClick={() => setStep(step + 1)}>Next</button>
                    ) : (
                        <button className="imp-save-btn" onClick={submit}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            Create Role
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateRoleModal;
