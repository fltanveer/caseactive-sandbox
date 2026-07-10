import { useState } from 'react';
import './KeysView.css';

const DOMAIN_OPTIONS = ['app', 'hub', 'admin', 'portal'];

const SAMPLE_KEYS = [
    {
        id: 'key_a6f353d2efba0b',
        description: 'Test',
        sourceCidr: '0.0.0.0/0',
        domain: 'app',
        lastUsed: '',
        lastUsedIp: '',
        active: false,
    },
];

const generateApiKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const seg = (n) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const header = btoa(JSON.stringify({ alg: 'PBES2-HS512+A128KW', enc: 'A256CBC-HS512' })).replace(/=/g, '');
    return `${header}.${seg(86)}.${seg(43)}`;
};

const generateKeyId = () => {
    const hex = () => Math.floor(Math.random() * 16).toString(16);
    return `key_${Array.from({ length: 14 }, hex).join('')}`;
};

const EMPTY_FORM = { description: '', sourceCidr: '', domain: '', active: false };

const Toggle = ({ value, onChange }) => (
    <button
        type="button"
        className={`as-toggle${value ? ' on' : ''}`}
        onClick={() => onChange(!value)}
        aria-pressed={value}
    >
        <span className="as-toggle-knob" />
    </button>
);

/* ── Key form (body + footer as fragment) ── */
const KeyForm = ({ form, onChange, onSave, onCancel, isEdit }) => {
    const valid = form.description.trim() && form.domain;
    return (
        <>
            <div className="ccm-body">
                <div className="ccm-grid-2">
                    <div className="ccm-field">
                        <label className="ccm-label">Description <span className="ccm-req">*</span></label>
                        <input
                            className="ccm-input"
                            value={form.description}
                            onChange={e => onChange({ ...form, description: e.target.value })}
                            placeholder="e.g. Production API Key"
                        />
                    </div>
                    <div className="ccm-field">
                        <label className="ccm-label">Source CIDR</label>
                        <input
                            className="ccm-input"
                            value={form.sourceCidr}
                            onChange={e => onChange({ ...form, sourceCidr: e.target.value })}
                            placeholder="0.0.0.0/0"
                        />
                        <span className="ccm-hint">0.0.0.0/0 all IPs</span>
                    </div>
                </div>
                <div className="ccm-field">
                    <label className="ccm-label">Domain <span className="ccm-req">*</span></label>
                    <select
                        className="ccm-select"
                        value={form.domain}
                        onChange={e => onChange({ ...form, domain: e.target.value })}
                    >
                        <option value="">Select domain...</option>
                        {DOMAIN_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
                <div className="ccm-field ky-active-row">
                    <label className="ccm-label">Active</label>
                    <Toggle value={form.active} onChange={val => onChange({ ...form, active: val })} />
                </div>
            </div>
            <div className="ccm-footer">
                <button className="imp-cancel-btn" onClick={onCancel}>Cancel</button>
                <button className="imp-save-btn" disabled={!valid} onClick={() => valid && onSave(form)}>
                    {isEdit ? (
                        <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                            Save Changes
                        </>
                    ) : (
                        <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            Add Key
                        </>
                    )}
                </button>
            </div>
        </>
    );
};

/* ── Secret step (body + footer as fragment) ── */
const SecretStep = ({ secret, onClose }) => {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard.writeText(secret).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <>
            <div className="ccm-body ky-secret-body">
                <div className="ky-secret-warning">
                    <div className="ky-secret-warning-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    </div>
                    <p className="ky-secret-warning-text">
                        Make sure to copy your new secret key now. <strong>You won&apos;t be able to see it again!</strong>
                    </p>
                </div>
                <div className="ky-secret-field">
                    <input className="ccm-input ky-secret-input" type="text" readOnly value={secret} />
                    <button className={`ky-copy-btn${copied ? ' copied' : ''}`} onClick={copy} title="Copy to clipboard">
                        {copied ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                        )}
                    </button>
                </div>
                {copied && <span className="ky-copied-hint">Copied to clipboard!</span>}
            </div>
            <div className="ccm-footer">
                <button className="imp-save-btn" onClick={onClose}>Done</button>
            </div>
        </>
    );
};

/* ── Combined Add/Edit modal ── */
const KeyModal = ({ initial, onSave, onClose }) => {
    const isEdit = !!initial;
    const [step, setStep] = useState('form');
    const [secret, setSecret] = useState('');
    const [form, setForm] = useState(initial ? { ...initial } : { ...EMPTY_FORM });

    const handleFormSave = (data) => {
        onSave(data);
        if (!isEdit) {
            setSecret(generateApiKey());
            setStep('secret');
        } else {
            onClose();
        }
    };

    const title = step === 'secret' ? 'Secret Key' : isEdit ? 'Edit Key' : 'New Key';
    const breadcrumb = isEdit && step === 'form'
        ? `Integration · Keys · ${initial.id.replace('key_', 'key...')}`
        : 'Integration · Keys';

    return (
        <div className="modal-overlay" onClick={step === 'secret' ? undefined : onClose}>
            <div className="ccm ky-modal" onClick={e => e.stopPropagation()}>
                <div className="ccm-header">
                    <div>
                        <p className="ccm-breadcrumb">{breadcrumb}</p>
                        <h2 className="ccm-title">{title}</h2>
                    </div>
                    <button className="ccm-close" onClick={onClose} aria-label="Close">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
                {step === 'form' ? (
                    <KeyForm
                        form={form}
                        onChange={setForm}
                        onSave={handleFormSave}
                        onCancel={onClose}
                        isEdit={isEdit}
                    />
                ) : (
                    <SecretStep secret={secret} onClose={onClose} />
                )}
            </div>
        </div>
    );
};

/* ── Delete confirmation modal ── */
const DeleteModal = ({ keyObj, onConfirm, onCancel }) => (
    <div className="modal-overlay" onClick={onCancel}>
        <div className="confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="confirm-modal-header">
                <h3 className="confirm-modal-title">Delete Key</h3>
                <button className="confirm-modal-close" onClick={onCancel}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
            <div className="confirm-modal-body">
                <div className="ky-delete-icon-wrap">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6"/><path d="M14 11v6"/>
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                    </svg>
                </div>
                <p className="confirm-modal-text">
                    Are you sure you want to delete <strong>{keyObj.description}</strong>? This action cannot be undone and any applications using this key will lose access.
                </p>
            </div>
            <div className="confirm-modal-footer">
                <button className="confirm-modal-cancel" onClick={onCancel}>Cancel</button>
                <button className="confirm-modal-confirm ky-delete-confirm" onClick={onConfirm}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                    Delete Key
                </button>
            </div>
        </div>
    </div>
);

/* ── Main View ── */
const KeysView = ({ addOpen, onCloseAdd }) => {
    const [keys, setKeys] = useState(SAMPLE_KEYS);
    const [search, setSearch] = useState('');
    const [editKey, setEditKey] = useState(null);
    const [deleteKey, setDeleteKey] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    useState(() => {
        if (addOpen) setShowAddModal(true);
    }, [addOpen]);

    const filtered = keys.filter(k =>
        !search ||
        k.description.toLowerCase().includes(search.toLowerCase()) ||
        k.domain.toLowerCase().includes(search.toLowerCase()) ||
        (k.sourceCidr || '').includes(search)
    );

    const closeAdd = () => { setShowAddModal(false); onCloseAdd(); };
    const handleAdd = (data) => setKeys(prev => [...prev, { ...data, id: data.id || generateKeyId() }]);
    const handleEdit = (data) => setKeys(prev => prev.map(k => k.id === data.id ? data : k));
    const handleDelete = () => { setKeys(prev => prev.filter(k => k.id !== deleteKey.id)); setDeleteKey(null); };

    return (
        <div className="portal-content ky-content">
            <div className="ky-card">
                <div className="ky-toolbar">
                    <div className="ky-search-wrap">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#CBD5E1', flexShrink: 0 }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        <input
                            className="ky-search-input"
                            placeholder="Search keys..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div className="ky-table-wrap">
                    <table className="ky-table">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Source CIDR</th>
                                <th>Domain</th>
                                <th>Last Used</th>
                                <th>Last Used IP</th>
                                <th>Active</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan={7} className="ky-empty">No keys found</td></tr>
                            ) : filtered.map(k => (
                                <tr key={k.id}>
                                    <td data-label="Description" className="ky-desc-cell">{k.description}</td>
                                    <td data-label="Source CIDR" className="ky-cidr-cell">{k.sourceCidr || '—'}</td>
                                    <td data-label="Domain" className="ky-domain-cell">{k.domain || '—'}</td>
                                    <td data-label="Last Used" className="ky-meta-cell">{k.lastUsed || '—'}</td>
                                    <td data-label="Last Used IP" className="ky-meta-cell">{k.lastUsedIp || '—'}</td>
                                    <td data-label="Active">
                                        <span className={`ky-active-badge ${k.active ? 'yes' : 'no'}`}>
                                            {k.active ? 'Yes' : 'No'}
                                        </span>
                                    </td>
                                    <td data-label="Action">
                                        <div className="ky-actions">
                                            <button className="users-icon-btn" data-tooltip="Edit" onClick={() => setEditKey(k)}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                            </button>
                                            <button className="users-icon-btn ky-delete-btn" data-tooltip="Delete" onClick={() => setDeleteKey(k)}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {(addOpen || showAddModal) && (
                <KeyModal onSave={handleAdd} onClose={closeAdd} />
            )}
            {editKey && (
                <KeyModal initial={editKey} onSave={handleEdit} onClose={() => setEditKey(null)} />
            )}
            {deleteKey && (
                <DeleteModal keyObj={deleteKey} onConfirm={handleDelete} onCancel={() => setDeleteKey(null)} />
            )}
        </div>
    );
};

export default KeysView;
