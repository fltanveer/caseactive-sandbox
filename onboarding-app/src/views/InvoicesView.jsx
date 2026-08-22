import { useState } from 'react';
import { MultiSelect } from '../components/MultiSelect';
import SearchableSelect from '../components/SearchableSelect';
import InfoBanner from '../components/InfoBanner';
import './library/LibraryViews.css';
import './EventsView.css';
import './FormsView.css';
import './InvoicesView.css';

const blankItem = () => ({ type: 'charge', description: '', qty: 1, price: 0 });

const INVOICES_DATA = [
    {
        id: 'inv-001', title: 'Filing Fees — Superior Court', author: 'Ar Tanveer',
        date: '2026-08-23', time: '02:00', repeat: 'Does not repeat',
        recipients: ['Ar Tanveer'],
        notifications: ['When event starts', '15 minutes before'],
        description: 'Court filing and service costs advanced by the firm.',
        published: false, status: 'open',
        invoiceNo: 'INV-1041', poNo: '', refId: 'johnson-filing',
        term: 'Due on receipt.', note: 'Costs advanced are reimbursed from the settlement.',
        items: [
            { type: 'charge', description: 'Complaint filing fee', qty: 1, price: 435 },
            { type: 'charge', description: 'Service of process', qty: 2, price: 85 },
        ],
        discount: 0, tax: 0,
    },
    {
        id: 'inv-002', title: 'Records Retrieval — Kim Clinic', author: 'Sara Chen',
        date: '2026-07-30', time: '09:00', repeat: 'Does not repeat',
        recipients: ['Ar Tanveer'],
        notifications: ['1 day before'],
        description: 'Medical records requested from the treating clinic.',
        published: true, status: 'paid',
        invoiceNo: 'INV-1038', poNo: 'PO-77', refId: 'kim-records',
        term: 'Net 15.', note: '',
        items: [{ type: 'charge', description: 'Records request + copy fee', qty: 1, price: 120 }],
        discount: 0, tax: 0,
    },
    {
        id: 'inv-003', title: 'Expert Review — Accident Reconstruction', author: 'Virtual Assistant',
        date: '2026-09-10', time: '14:00', repeat: 'Monthly',
        recipients: ['Ar Tanveer', 'Sara Chen'],
        notifications: [],
        description: 'Retained expert to review the scene data and vehicle telemetry.',
        published: true, status: 'processing',
        invoiceNo: 'INV-1044', poNo: '', refId: 'expert-recon',
        term: 'Net 30.', note: 'Second half billed after the deposition.',
        items: [
            { type: 'charge', description: 'Expert retainer', qty: 1, price: 2500 },
            { type: 'charge', description: 'Site visit', qty: 3, price: 240 },
        ],
        discount: 5, tax: 0,
    },
];

const RECIPIENT_OPTIONS = ['Ar Tanveer', 'Jordan Admin', 'Sara Chen', 'Mike Torres', 'Tech Support'];
const REPEAT_OPTIONS = ['Does not repeat', 'Daily', 'Weekly', 'Monthly'];
const NOTIFICATION_OPTIONS = [
    'When event starts', '15 minutes before', '30 minutes before',
    '1 hour before', '1 day before',
];
const ITEM_TYPES = ['charge', 'credit', 'expense'];

/* Only a published invoice carries a working status; a draft is always Open. */
const STATUSES = [
    { id: 'open',          label: 'Open'          },
    { id: 'paid',          label: 'Paid'          },
    { id: 'processing',    label: 'Processing'    },
    { id: 'void',          label: 'Void'          },
    { id: 'uncollectible', label: 'Uncollectable' },
];
const statusLabel = (id) => STATUSES.find(s => s.id === id)?.label || 'Open';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/* Parse as local time — `new Date('2026-08-23')` is UTC and can slip a day. */
const parseDate = (iso) => {
    const [y, m, d] = (iso || '').split('-').map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
};

const dueLabel = ({ date, time }) => {
    const d = parseDate(date);
    const [h, min] = time.split(':').map(Number);
    const ampm = h < 12 ? 'AM' : 'PM';
    return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${h % 12 || 12}:${String(min).padStart(2, '0')} ${ampm}`;
};

/* Overdue only means something while money is still owed */
const isOverdue = (row) => {
    if (row.status !== 'open') return false;
    const d = parseDate(row.date);
    const [h, min] = row.time.split(':').map(Number);
    d.setHours(h, min);
    return d < new Date();
};

const money = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const totalsFor = ({ items, discount, tax }) => {
    const subtotal = items.reduce((sum, it) => sum + (Number(it.qty) || 0) * (Number(it.price) || 0), 0);
    const afterDiscount = subtotal - subtotal * ((Number(discount) || 0) / 100);
    const total = afterDiscount + afterDiscount * ((Number(tax) || 0) / 100);
    return { subtotal, total };
};

const BLANK_INVOICE = {
    title: '', recipients: [], time: '09:00', repeat: 'Does not repeat',
    notifications: ['When event starts', '15 minutes before'], description: '',
    status: 'open', invoiceNo: '', poNo: '', refId: '', term: '', note: '',
    items: [blankItem()], discount: 0, tax: 0,
};

/* ── Settings modal — one component, three modes ── */
const InvoiceSettingsModal = ({ row, mode = 'edit', onClose, onSave }) => {
    const readOnly = mode === 'view';
    const isAdd = mode === 'add';

    const [title, setTitle]          = useState(row.title);
    const [recipients, setRecips]    = useState(row.recipients);
    const [date, setDate]            = useState(row.date);
    const [time, setTime]            = useState(row.time);
    const [repeat, setRepeat]        = useState(row.repeat);
    const [notifications, setNotifs] = useState(row.notifications);
    const [description, setDesc]     = useState(row.description);
    const [notifOpen, setNotifOpen]  = useState(false);

    const canSave = title.trim() && recipients.length > 0;

    const addNotif = (val) => {
        if (!notifications.includes(val)) setNotifs(prev => [...prev, val]);
        setNotifOpen(false);
    };
    const removeNotif = (val) => setNotifs(prev => prev.filter(n => n !== val));

    const save = () => {
        if (!canSave) return;
        onSave({ ...row, title: title.trim(), recipients, date, time, repeat, notifications, description });
        onClose();
    };

    const heading = isAdd ? 'Add Invoice' : readOnly ? 'View Settings' : 'Edit Invoice';

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="ccm afm-modal" onClick={e => e.stopPropagation()}>

                <div className="ccm-header">
                    <div>
                        <p className="ccm-breadcrumb">Invoices · {isAdd ? 'New' : row.title}</p>
                        <h2 className="ccm-title">{heading}</h2>
                    </div>
                    <button className="ccm-close" onClick={onClose}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                <div className="ccm-body">
                    {readOnly && (
                        <div className="cfm-locked-note">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            This invoice is published, so its settings are locked. You can still change its status from the table.
                        </div>
                    )}

                    <div className="ccm-field">
                        <label className="ccm-label">Title <span className="ccm-req">*</span></label>
                        <input className="ccm-input" value={title} disabled={readOnly} onChange={e => setTitle(e.target.value)} />
                    </div>

                    <div className="ccm-field">
                        <label className="ccm-label">Recipients <span className="ccm-req">*</span></label>
                        {readOnly ? (
                            <div className="cfm-readonly-chips">
                                {recipients.map(r => <span key={r} className="afm-notif-chip cfm-chip-static">{r}</span>)}
                            </div>
                        ) : (
                            <MultiSelect options={RECIPIENT_OPTIONS} value={recipients} onChange={setRecips} placeholder="Select recipients" />
                        )}
                    </div>

                    <div className="cfm-due-grid">
                        <div className="ccm-field">
                            <label className="ccm-label">Due Date <span className="ccm-req">*</span></label>
                            <input type="date" className="ccm-input" value={date} disabled={readOnly} onChange={e => setDate(e.target.value)} />
                        </div>
                        <div className="ccm-field">
                            <label className="ccm-label">Due Time <span className="ccm-req">*</span></label>
                            <input type="time" className="ccm-input" value={time} disabled={readOnly} onChange={e => setTime(e.target.value)} />
                        </div>
                        <div className="ccm-field">
                            <label className="ccm-label">Repeat</label>
                            {readOnly ? (
                                <input className="ccm-input" value={repeat} disabled />
                            ) : (
                                <SearchableSelect value={repeat} onChange={e => setRepeat(e.target.value)}>
                                    {REPEAT_OPTIONS.map(o => <option key={o}>{o}</option>)}
                                </SearchableSelect>
                            )}
                        </div>
                    </div>

                    <div className="ccm-field">
                        <label className="ccm-label">Notifications</label>
                        {readOnly ? (
                            <div className="cfm-readonly-chips">
                                {notifications.length === 0
                                    ? <span className="cfm-empty-note">No reminders set.</span>
                                    : notifications.map(n => <span key={n} className="afm-notif-chip cfm-chip-static">{n}</span>)}
                            </div>
                        ) : (
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
                        )}
                    </div>

                    <div className="ccm-field">
                        <label className="ccm-label">Description</label>
                        <textarea
                            className="ccm-input afm-textarea"
                            placeholder="What is this invoice for?"
                            value={description}
                            disabled={readOnly}
                            onChange={e => setDesc(e.target.value)}
                        />
                    </div>
                </div>

                <div className="ccm-footer">
                    <button className="imp-cancel-btn" onClick={onClose}>{readOnly ? 'Close' : 'Cancel'}</button>
                    {!readOnly && (
                        <button className="imp-save-btn" disabled={!canSave} onClick={save}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                            {isAdd ? 'Create Invoice' : 'Update Invoice'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ── Full-screen invoice builder / preview ── */
const InvoiceEditorModal = ({ row, readOnly = false, onClose, onSave }) => {
    const [invoiceNo, setInvoiceNo] = useState(row.invoiceNo);
    const [poNo, setPoNo]           = useState(row.poNo);
    const [refId, setRefId]         = useState(row.refId);
    const [term, setTerm]           = useState(row.term);
    const [note, setNote]           = useState(row.note);
    const [items, setItems]         = useState(row.items);
    const [discount, setDiscount]   = useState(row.discount);
    const [tax, setTax]             = useState(row.tax);
    /* A published invoice opens straight into the read-only document */
    const [preview, setPreview]     = useState(readOnly);

    const { subtotal, total } = totalsFor({ items, discount, tax });

    const setItem = (i, patch) => setItems(prev => prev.map((it, j) => (j === i ? { ...it, ...patch } : it)));
    const addItem = () => setItems(prev => [...prev, blankItem()]);
    const removeItem = (i) => setItems(prev => (prev.length === 1 ? prev : prev.filter((_, j) => j !== i)));

    const saveAndClose = () => {
        if (!readOnly) onSave({ ...row, invoiceNo, poNo, refId, term, note, items, discount, tax });
        onClose();
    };

    return (
        <div className="fed-overlay">
            <div className="fed-topbar">
                <button className="fed-back-btn" onClick={onClose}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                    Back
                </button>
                <div className="fed-topbar-title">
                    <p className="fed-breadcrumb">Invoices · {readOnly ? 'View Invoice' : 'Edit Invoice'}</p>
                    <h2 className="fed-title">{row.title}</h2>
                </div>
                {!readOnly && (
                    <button className="imp-cancel-btn inv-topbar-btn" onClick={() => setPreview(p => !p)}>
                        {preview ? (
                            <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Edit</>
                        ) : (
                            <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> Preview</>
                        )}
                    </button>
                )}
                <button className="imp-save-btn" onClick={saveAndClose}>
                    {readOnly ? 'Close' : 'Save & Close'}
                </button>
            </div>

            <div className="fed-body inv-body">
                <div className="inv-sheet">
                    {preview ? (
                        <>
                            <h3 className="inv-preview-title">{row.title}</h3>
                            {invoiceNo && <p className="inv-preview-sub">Invoice No: {invoiceNo}</p>}
                            <table className="inv-preview-table">
                                <thead>
                                    <tr>
                                        <th>TYPE</th>
                                        <th>DESCRIPTION</th>
                                        <th className="inv-num">QUANTITY</th>
                                        <th className="inv-num">PRICE ($)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((it, i) => (
                                        <tr key={i}>
                                            <td>{it.type}</td>
                                            <td>{it.description || <span className="inv-muted">—</span>}</td>
                                            <td className="inv-num">{it.qty}</td>
                                            <td className="inv-num">{money((Number(it.qty) || 0) * (Number(it.price) || 0))}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="inv-preview-totals">
                                <div className="inv-preview-total-row"><span>Subtotal ($)</span><span>{money(subtotal)}</span></div>
                                {Number(discount) > 0 && <div className="inv-preview-total-row"><span>Discount ({discount}%)</span><span>−{money(subtotal * (discount / 100))}</span></div>}
                                {Number(tax) > 0 && <div className="inv-preview-total-row"><span>Tax ({tax}%)</span><span>{money(total - (subtotal - subtotal * (discount / 100)))}</span></div>}
                                <div className="inv-preview-total-row grand"><span>Total ($)</span><span>{money(total)}</span></div>
                            </div>
                            {(term || note) && (
                                <div className="inv-preview-notes">
                                    {term && <div><span className="inv-preview-note-label">Term</span><p>{term}</p></div>}
                                    {note && <div><span className="inv-preview-note-label">Note</span><p>{note}</p></div>}
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="ccm-field">
                                <label className="ccm-label">Invoice No</label>
                                <input className="ccm-input" value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} placeholder="INV-1042" />
                            </div>

                            <div className="inv-grid-2">
                                <div className="ccm-field">
                                    <label className="ccm-label">PO No</label>
                                    <input className="ccm-input" value={poNo} onChange={e => setPoNo(e.target.value)} />
                                </div>
                                <div className="ccm-field">
                                    <label className="ccm-label">Reference ID</label>
                                    <input className="ccm-input" value={refId} onChange={e => setRefId(e.target.value)} />
                                    <span className="crm-hint">A permanent label to easily find a case. (a-z, 0-9, -, /) are allowed</span>
                                </div>
                            </div>

                            <div className="inv-grid-2">
                                <div className="ccm-field">
                                    <label className="ccm-label">Term</label>
                                    <textarea className="ccm-input afm-textarea" value={term} onChange={e => setTerm(e.target.value)} />
                                </div>
                                <div className="ccm-field">
                                    <label className="ccm-label">Note</label>
                                    <textarea className="ccm-input afm-textarea" value={note} onChange={e => setNote(e.target.value)} />
                                </div>
                            </div>

                            <div className="inv-items">
                                <div className="inv-items-head">
                                    <span>TYPE</span>
                                    <span>DESCRIPTION</span>
                                    <span>QTY</span>
                                    <span>PRICE</span>
                                    <span />
                                </div>
                                {items.map((it, i) => (
                                    <div key={i} className="inv-items-row">
                                        <SearchableSelect value={it.type} onChange={e => setItem(i, { type: e.target.value })}>
                                            {ITEM_TYPES.map(t => <option key={t}>{t}</option>)}
                                        </SearchableSelect>
                                        <input className="ccm-input" placeholder="Your description" value={it.description} onChange={e => setItem(i, { description: e.target.value })} />
                                        <input className="ccm-input" type="number" min="0" value={it.qty} onChange={e => setItem(i, { qty: e.target.value })} />
                                        <input className="ccm-input" type="number" min="0" step="0.01" value={it.price} onChange={e => setItem(i, { price: e.target.value })} />
                                        <button
                                            className="inv-item-remove"
                                            onClick={() => removeItem(i)}
                                            disabled={items.length === 1}
                                            title={items.length === 1 ? 'An invoice needs at least one line' : 'Remove line'}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                                        </button>
                                    </div>
                                ))}
                                <button className="inv-add-more" onClick={addItem}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                    Add more
                                </button>
                            </div>

                            <div className="inv-totals">
                                <div className="inv-total-row"><span>Subtotal ($)</span><strong>{money(subtotal)}</strong></div>
                                <div className="inv-total-row">
                                    <span>Discount (%)</span>
                                    <input className="ccm-input inv-total-input" type="number" min="0" max="100" value={discount} onChange={e => setDiscount(e.target.value)} />
                                </div>
                                <div className="inv-total-row">
                                    <span>Tax (%)</span>
                                    <input className="ccm-input inv-total-input" type="number" min="0" max="100" value={tax} onChange={e => setTax(e.target.value)} />
                                </div>
                                <div className="inv-total-row grand"><span>Total ($)</span><strong>{money(total)}</strong></div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

/* Publishing sends the invoice out for payment, so it can't be undone */
const PublishInvoiceModal = ({ title, onConfirm, onCancel }) => (
    <div className="modal-overlay" onClick={onCancel}>
        <div className="confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="confirm-modal-header">
                <h3 className="confirm-modal-title">Publish Invoice</h3>
                <button className="confirm-modal-close" onClick={onCancel}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
            <div className="confirm-modal-body">
                <p className="confirm-modal-text">
                    Publish <strong>"{title}"</strong>? It goes out to its recipients for payment.
                    This can't be undone — a published invoice can no longer be edited or deleted,
                    only voided.
                </p>
            </div>
            <div className="confirm-modal-footer">
                <button className="confirm-modal-cancel" onClick={onCancel}>Later</button>
                <button className="confirm-modal-confirm" onClick={onConfirm}>Publish</button>
            </div>
        </div>
    </div>
);

const DeleteConfirmModal = ({ title, onConfirm, onCancel }) => (
    <div className="modal-overlay" onClick={onCancel}>
        <div className="confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="confirm-modal-header">
                <h3 className="confirm-modal-title">Delete Invoice</h3>
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

const TABS = [
    { id: 'unpaid', label: 'Your Unpaid Invoices' },
    { id: 'paid',   label: 'Your Paid Invoices'   },
    { id: 'all',    label: 'All Invoices'         },
];

const InvoicesView = ({ embedded = false, createOpen = false, onCloseCreate }) => {
    const [tab, setTab]                 = useState('unpaid');
    const [rows, setRows]               = useState(INVOICES_DATA);
    const [settingsTarget, setSettings] = useState(null);
    const [editorTarget, setEditor]     = useState(null);
    const [publishTarget, setPublish]   = useState(null);
    const [deleteTarget, setDelete]     = useState(null);
    const [search, setSearch]           = useState('');
    const [localAddOpen, setLocalAddOpen] = useState(false);

    /* Embedded in the case view the NEW button sits in the page header, so the
       open flag is owned there; standalone, this view owns it. */
    const addOpen  = embedded ? createOpen : localAddOpen;
    const closeAdd = embedded ? onCloseCreate : () => setLocalAddOpen(false);

    const matchesTab = (r, id) => (id === 'all' ? true : id === 'paid' ? r.status === 'paid' : r.status !== 'paid');

    const filtered = rows
        .filter(r => matchesTab(r, tab))
        .filter(r => r.title.toLowerCase().includes(search.trim().toLowerCase()));

    const updateRow = (data) => setRows(prev => prev.map(r => (r.id === data.id ? data : r)));
    const setStatus = (id, status) => setRows(prev => prev.map(r => (r.id === id ? { ...r, status } : r)));
    const publishRow = (id) => setRows(prev => prev.map(r => (r.id === id ? { ...r, published: true } : r)));
    const addRow = (data) => setRows(prev => [
        { ...data, id: `inv-${Date.now()}`, author: 'Ar Tanveer', published: false, status: 'open' },
        ...prev,
    ]);
    const duplicateRow = (id) => setRows(prev => {
        const idx = prev.findIndex(r => r.id === id);
        /* A copy starts as an unpublished draft — cloning a published invoice's
           paid status would invent a payment nobody made. */
        const copy = {
            ...prev[idx], id: `inv-${Date.now()}`, title: `${prev[idx].title} (copy)`,
            published: false, status: 'open', invoiceNo: '',
        };
        const next = [...prev];
        next.splice(idx + 1, 0, copy);
        return next;
    });
    const removeRow = (id) => setRows(prev => prev.filter(r => r.id !== id));

    return (
        <div className="forms-page">
            {settingsTarget && (
                <InvoiceSettingsModal
                    row={settingsTarget.row}
                    mode={settingsTarget.mode}
                    onClose={() => setSettings(null)}
                    onSave={updateRow}
                />
            )}
            {addOpen && (
                <InvoiceSettingsModal
                    mode="add"
                    row={{ ...BLANK_INVOICE, date: new Date().toISOString().slice(0, 10) }}
                    onClose={closeAdd}
                    onSave={addRow}
                />
            )}
            {editorTarget && (
                <InvoiceEditorModal
                    row={editorTarget.row}
                    readOnly={editorTarget.readOnly}
                    onClose={() => setEditor(null)}
                    onSave={updateRow}
                />
            )}
            {publishTarget && (
                <PublishInvoiceModal
                    title={publishTarget.title}
                    onCancel={() => setPublish(null)}
                    onConfirm={() => { publishRow(publishTarget.id); setPublish(null); }}
                />
            )}
            {deleteTarget && (
                <DeleteConfirmModal
                    title={deleteTarget.title}
                    onCancel={() => setDelete(null)}
                    onConfirm={() => { removeRow(deleteTarget.id); setDelete(null); }}
                />
            )}

            <InfoBanner message="Invoices bill case costs and fees. Publishing one sends it out for payment and locks it from further edits." />

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
                        <input type="text" className="hubs-search-input" placeholder="Search invoices..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>

                <div className="cfm-table-wrap">
                    <div className="cfm-table-head inv-table-head">
                        <span>TITLE</span>
                        <span>AUTHOR</span>
                        <span>DUE DATE</span>
                        <span>AMOUNT</span>
                        <span>STATUS</span>
                        <span>PUBLISHED</span>
                        <span>ACTION</span>
                    </div>

                    {filtered.length === 0 ? (
                        <div className="cfm-empty">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2H6a1 1 0 0 0-1 1v18l3-2 2 2 2-2 2 2 2-2 3 2V3a1 1 0 0 0-1-1z"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/></svg>
                            <p>No invoices found.</p>
                        </div>
                    ) : filtered.map(r => (
                        <div key={r.id} className="cfm-table-row inv-table-row">
                            <span className="cases-title-cell" data-label="Title">
                                {r.title}
                                {!r.published && <span className="cfm-draft-badge">Draft</span>}
                            </span>
                            <span className="cases-cell-muted" data-label="Author">{r.author}</span>
                            <span data-label="Due Date">
                                <span className={`cfm-due${isOverdue(r) ? ' overdue' : ''}`}>
                                    {dueLabel(r)}
                                    {r.repeat !== 'Does not repeat' && <span className="cfm-repeat-tag">{r.repeat}</span>}
                                </span>
                            </span>
                            <span className="inv-amount" data-label="Amount">${money(totalsFor(r).total)}</span>
                            <span data-label="Status">
                                {r.published ? (
                                    /* Status is only meaningful once the invoice is out */
                                    <span className={`inv-status-wrap inv-status-${r.status}`}>
                                        <SearchableSelect
                                            className="inv-status-select"
                                            value={r.status}
                                            onChange={e => setStatus(r.id, e.target.value)}
                                        >
                                            {STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                                        </SearchableSelect>
                                    </span>
                                ) : (
                                    <span className="inv-status-static">{statusLabel(r.status)}</span>
                                )}
                            </span>
                            <span data-label="Published">
                                <label className="user-switch" title={r.published ? 'Published invoices stay published' : 'Publish invoice'}>
                                    <input
                                        type="checkbox"
                                        checked={r.published}
                                        disabled={r.published}
                                        onChange={() => setPublish(r)}
                                    />
                                    <span className="user-switch-slider" />
                                </label>
                            </span>
                            <span data-label="Action">
                                <span className="ft-action-wrap">
                                    {r.published ? (
                                        <>
                                            <button className="ft-icon-btn" title="View Settings" onClick={() => setSettings({ row: r, mode: 'view' })}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                            </button>
                                            <button className="ft-icon-btn" title="View Invoice" onClick={() => setEditor({ row: r, readOnly: true })}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2H6a1 1 0 0 0-1 1v18l3-2 2 2 2-2 2 2 2-2 3 2V3a1 1 0 0 0-1-1z"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/></svg>
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button className="ft-icon-btn" title="Edit Settings" onClick={() => setSettings({ row: r, mode: 'edit' })}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                                            </button>
                                            <button className="ft-icon-btn" title="Edit Invoice" onClick={() => setEditor({ row: r, readOnly: false })}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                            </button>
                                        </>
                                    )}
                                    <button className="ft-icon-btn" title="Duplicate Invoice" onClick={() => duplicateRow(r.id)}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                                    </button>
                                    {!r.published && (
                                        <button className="ft-icon-btn delete" title="Delete Invoice" onClick={() => setDelete(r)}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                                        </button>
                                    )}
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

export default InvoicesView;
