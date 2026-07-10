import { useState, useRef, useEffect } from 'react';
import './WebhooksView.css';

/* ── Data ── */
const EVENTS_LIST = [
    'post is created', 'post is modified', 'post is deleted',
    'case is created', 'case is updated', 'case is closed',
    'user is created', 'user is updated',
    'form is submitted', 'task is completed',
];

const INITIAL_WEBHOOKS = [
    {
        id: 1,
        url: 'https://www.youtube.com',
        events: ['post is created', 'post is modified', 'post is deleted'],
        description: 'Test',
        active: true,
    },
];

const generateSecret = () => {
    const hex = () => Math.floor(Math.random() * 16).toString(16);
    const seg = (n) => Array.from({ length: n }, hex).join('');
    return `whsec_${seg(8)}${seg(8)}${seg(8)}${seg(8)}${seg(8)}${seg(8)}${seg(4)}`;
};

/* ── Toggle (reuses existing as-toggle CSS) ── */
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

/* ── Events multi-select ── */
const EventsSelect = ({ selected, onChange }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const remaining = EVENTS_LIST.filter(e => !selected.includes(e));

    return (
        <div className="wh-events-wrap" ref={ref}>
            <div className="wh-events-input" onClick={() => setOpen(p => !p)}>
                <div className="wh-chips-row">
                    {selected.map(ev => (
                        <span key={ev} className="wh-event-chip">
                            <button
                                type="button"
                                className="wh-chip-remove"
                                onClick={e => { e.stopPropagation(); onChange(selected.filter(s => s !== ev)); }}
                                aria-label={`Remove ${ev}`}
                            >
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                            {ev}
                        </span>
                    ))}
                    {selected.length === 0 && <span className="wh-events-placeholder">Select events…</span>}
                </div>
                <svg className="wh-events-caret" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            {open && (
                <div className="wh-events-dropdown">
                    {remaining.length === 0 ? (
                        <div className="wh-events-all-selected">All events selected</div>
                    ) : remaining.map(ev => (
                        <button
                            key={ev}
                            type="button"
                            className="wh-event-option"
                            onClick={() => { onChange([...selected, ev]); }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            {ev}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

/* ── Webhook Form (Add / Edit) ── */
const WebhookForm = ({ initial, onSave, onCancel, isEdit }) => {
    const [url, setUrl]           = useState(initial?.url || '');
    const [desc, setDesc]         = useState(initial?.description || '');
    const [events, setEvents]     = useState(initial?.events || []);
    const [active, setActive]     = useState(initial?.active ?? false);

    const canSave = url.trim() && events.length > 0;

    return (
        <>
            <div className="ccm-body">
                <div className="ccm-grid-2">
                    <div className="ccm-field">
                        <label className="ccm-label">URL <span className="ccm-req">*</span></label>
                        <input
                            className="ccm-input"
                            type="url"
                            placeholder="https://www.example.com/webhook"
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                        />
                        <span className="ccm-hint">http(s)://www.domain-sample.com</span>
                    </div>
                    <div className="ccm-field">
                        <label className="ccm-label">Description</label>
                        <input
                            className="ccm-input"
                            type="text"
                            placeholder="e.g. Slack notification"
                            value={desc}
                            onChange={e => setDesc(e.target.value)}
                        />
                    </div>
                </div>

                <div className="ccm-field">
                    <label className="ccm-label">Events <span className="ccm-req">*</span></label>
                    <EventsSelect selected={events} onChange={setEvents} />
                </div>

                <div className="ccm-field wh-active-row">
                    <label className="ccm-label">Active</label>
                    <Toggle value={active} onChange={setActive} />
                </div>
            </div>

            <div className="ccm-footer">
                <button className="imp-cancel-btn" onClick={onCancel}>Cancel</button>
                <button
                    className="imp-save-btn"
                    disabled={!canSave}
                    onClick={() => onSave({ url: url.trim(), description: desc.trim(), events, active })}
                >
                    {isEdit ? (
                        <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                            Save Changes
                        </>
                    ) : (
                        <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            Add Webhook
                        </>
                    )}
                </button>
            </div>
        </>
    );
};

/* ── Secret Step ── */
const SecretStep = ({ secret, onClose }) => {
    const [copied, setCopied] = useState(false);

    const copy = () => {
        navigator.clipboard.writeText(secret).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <div className="ccm-body wh-secret-body">
                <div className="wh-secret-warning">
                    <div className="wh-secret-warning-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    </div>
                    <p className="wh-secret-warning-text">
                        Make sure to copy your new secret webhook now. <strong>You won't be able to see it again!</strong>
                    </p>
                </div>

                <div className="wh-secret-field">
                    <input
                        className="ccm-input wh-secret-input"
                        type="text"
                        readOnly
                        value={secret}
                    />
                    <button
                        className={`wh-copy-btn${copied ? ' copied' : ''}`}
                        onClick={copy}
                        title="Copy to clipboard"
                    >
                        {copied ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                        )}
                    </button>
                </div>
                {copied && <span className="wh-copied-hint">Copied to clipboard!</span>}
            </div>

            <div className="ccm-footer">
                <button className="imp-save-btn" onClick={onClose}>
                    Done
                </button>
            </div>
        </>
    );
};

/* ── Combined Add/Edit modal ── */
const WebhookModal = ({ webhook, onClose, onSave }) => {
    const isEdit = !!webhook;
    const [step, setStep] = useState('form');
    const [secret, setSecret] = useState('');

    const handleFormSave = (data) => {
        onSave(data);
        if (!isEdit) {
            setSecret(generateSecret());
            setStep('secret');
        } else {
            onClose();
        }
    };

    const title = step === 'secret'
        ? 'Secret Webhook'
        : isEdit
            ? `Edit Webhook`
            : 'New Webhook';

    const breadcrumb = isEdit && step === 'form'
        ? `Integration · Webhooks · ${webhook.url.replace(/^https?:\/\//, '').slice(0, 30)}`
        : 'Integration · Webhooks';

    return (
        <div className="modal-overlay" onClick={step === 'secret' ? undefined : onClose}>
            <div className="ccm wh-modal" onClick={e => e.stopPropagation()}>
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
                    <WebhookForm
                        initial={webhook}
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
const DeleteModal = ({ webhook, onClose, onConfirm }) => (
    <div className="modal-overlay" onClick={onClose}>
        <div className="confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="confirm-modal-header">
                <h2 className="confirm-modal-title">Delete Webhook</h2>
                <button className="confirm-modal-close" onClick={onClose} aria-label="Close">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
            <div className="confirm-modal-body">
                <div className="wh-delete-icon-wrap">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                </div>
                <p className="confirm-modal-text">
                    Are you sure you want to delete the webhook for <strong>{webhook.url}</strong>?
                    <br /><br />
                    This action cannot be undone. Any service relying on this webhook will stop receiving events immediately.
                </p>
            </div>
            <div className="confirm-modal-footer">
                <button className="confirm-modal-cancel" onClick={onClose}>Cancel</button>
                <button className="confirm-modal-confirm wh-delete-confirm" onClick={onConfirm}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                    Delete Webhook
                </button>
            </div>
        </div>
    </div>
);

/* ── Main View ── */
const WebhooksView = ({ addOpen, onCloseAdd }) => {
    const [webhooks, setWebhooks] = useState(INITIAL_WEBHOOKS);
    const [search, setSearch] = useState('');
    const [editWebhook, setEditWebhook] = useState(null);
    const [deleteWebhook, setDeleteWebhook] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        if (addOpen) setShowAddModal(true);
    }, [addOpen]);

    const filtered = webhooks.filter(wh =>
        !search ||
        wh.url.toLowerCase().includes(search.toLowerCase()) ||
        wh.events.some(e => e.toLowerCase().includes(search.toLowerCase())) ||
        (wh.description || '').toLowerCase().includes(search.toLowerCase())
    );

    const closeAdd = () => {
        setShowAddModal(false);
        onCloseAdd?.();
    };

    const handleSave = (data) => {
        if (editWebhook) {
            setWebhooks(prev => prev.map(w => w.id === editWebhook.id ? { ...w, ...data } : w));
            setEditWebhook(null);
        } else {
            setWebhooks(prev => [{ id: Date.now(), ...data }, ...prev]);
        }
    };

    const handleDelete = () => {
        setWebhooks(prev => prev.filter(w => w.id !== deleteWebhook.id));
        setDeleteWebhook(null);
    };

    return (
        <div className="portal-content wh-content">
            <div className="wh-card">
                <div className="wh-toolbar">
                    <div className="wh-search-wrap">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        <input
                            className="wh-search-input"
                            type="text"
                            placeholder="Search webhooks…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div className="wh-table-wrap">
                    <table className="wh-table">
                        <thead>
                            <tr>
                                <th>URL</th>
                                <th>Events</th>
                                <th>Description</th>
                                <th>Active</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', color: '#94A3B8', padding: '40px 0' }}>
                                        {search ? 'No webhooks match your search' : 'No webhooks yet — click + NEW to add one'}
                                    </td>
                                </tr>
                            ) : filtered.map(wh => (
                                <tr key={wh.id}>
                                    <td data-label="URL">
                                        <span className="wh-url-cell">{wh.url}</span>
                                    </td>
                                    <td data-label="Events">
                                        <span className="wh-events-cell">{wh.events.join(', ')}</span>
                                    </td>
                                    <td data-label="Description">
                                        <span className="wh-desc-cell">{wh.description || '—'}</span>
                                    </td>
                                    <td data-label="Active">
                                        <span className={`wh-active-badge${wh.active ? ' yes' : ' no'}`}>
                                            {wh.active ? 'Yes' : 'No'}
                                        </span>
                                    </td>
                                    <td data-label="Action">
                                        <div className="wh-actions">
                                            <button
                                                className="users-icon-btn"
                                                data-tooltip="Edit"
                                                onClick={() => setEditWebhook(wh)}
                                                aria-label="Edit webhook"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                            </button>
                                            <button
                                                className="users-icon-btn wh-delete-btn"
                                                data-tooltip="Delete"
                                                onClick={() => setDeleteWebhook(wh)}
                                                aria-label="Delete webhook"
                                            >
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

            {showAddModal && (
                <WebhookModal onClose={closeAdd} onSave={handleSave} />
            )}
            {editWebhook && (
                <WebhookModal webhook={editWebhook} onClose={() => setEditWebhook(null)} onSave={handleSave} />
            )}
            {deleteWebhook && (
                <DeleteModal webhook={deleteWebhook} onClose={() => setDeleteWebhook(null)} onConfirm={handleDelete} />
            )}
        </div>
    );
};

export default WebhooksView;
