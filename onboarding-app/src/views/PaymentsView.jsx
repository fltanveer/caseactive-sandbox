import { useState } from 'react';
import './PaymentsView.css';

const INVOICES = [
    {
        id: 1,
        caseId: 'cc-3eaaaa9d7a5034',
        invoiceId: 'invoice...cc62367def7f57',
        title: 'Test Invoice 2',
        author: 'Jordan Admin',
        dueDate: 'Jul 12, 6:00 AM',
        total: '$0.00',
        status: 'open',
    },
    {
        id: 2,
        caseId: 'cc-8b21fc0e4d19a2c7',
        invoiceId: 'invoice...a91d44e08bc31f02',
        title: 'Consultation Retainer',
        author: 'Jordan Admin',
        dueDate: 'Jul 18, 12:00 PM',
        total: '$450.00',
        status: 'paid',
    },
    {
        id: 3,
        caseId: 'cc-51e7d20a9f3b8c44',
        invoiceId: 'invoice...f27c09b1d5ae6631',
        title: 'Filing Fees — Case #2',
        author: 'Sam Paralegal',
        dueDate: 'Jul 2, 9:00 AM',
        total: '$120.00',
        status: 'overdue',
    },
];

const StatusBadge = ({ status }) => (
    <span className={`pay-status-badge ${status}`}>{status}</span>
);

const CopyableId = ({ value }) => {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
    };
    return (
        <button
            className={`pay-copy-id${copied ? ' copied' : ''}`}
            onClick={copy}
            data-tooltip={copied ? 'Copied!' : 'Copy'}
        >
            <span className="pay-copy-id-text">{value}</span>
            {copied ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            )}
        </button>
    );
};

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

const DeleteModal = ({ invoice, onConfirm, onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
        <div className="ccm pay-modal" onClick={e => e.stopPropagation()}>
            <div className="ccm-header">
                <div>
                    <p className="ccm-breadcrumb">Payments · Invoices</p>
                    <h2 className="ccm-title">Delete Invoice</h2>
                </div>
                <button className="ccm-close" onClick={onClose}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
            <div className="ccm-body">
                <p className="pay-delete-text">
                    Are you sure you want to delete <strong>{invoice.title}</strong>? This action cannot be undone.
                </p>
            </div>
            <div className="ccm-footer">
                <button className="imp-cancel-btn" onClick={onClose}>Cancel</button>
                <button className="imp-save-btn pay-delete-confirm" onClick={onConfirm}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    Delete
                </button>
            </div>
        </div>
    </div>
);

const PaymentsView = () => {
    const [invoices, setInvoices] = useState(INVOICES);
    const [search, setSearch] = useState('');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [stripeEnabled, setStripeEnabled] = useState(false);

    const filtered = invoices.filter(inv => {
        const q = search.toLowerCase();
        return !q
            || inv.title.toLowerCase().includes(q)
            || inv.caseId.toLowerCase().includes(q)
            || inv.invoiceId.toLowerCase().includes(q)
            || inv.author.toLowerCase().includes(q);
    });

    return (
        <div className="portal-content pay-content">
            {/* ── Invoices datagrid ── */}
            <div className="pay-card">
                <div className="pay-toolbar">
                    <div className="pay-search-wrap">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        <input
                            className="pay-search-input"
                            placeholder="Search invoices..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div className="pay-table-wrap">
                    <table className="pay-table">
                        <thead>
                            <tr>
                                <th>Case ID</th>
                                <th>Invoice ID</th>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Due Date</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td className="pay-empty" colSpan={8}>No invoices found</td></tr>
                            ) : filtered.map(inv => (
                                <tr key={inv.id}>
                                    <td className="pay-id-cell" data-label="Case ID"><CopyableId value={inv.caseId} /></td>
                                    <td className="pay-id-cell" data-label="Invoice ID"><CopyableId value={inv.invoiceId} /></td>
                                    <td className="pay-title-cell" data-label="Title">{inv.title}</td>
                                    <td className="pay-meta-cell" data-label="Author">{inv.author}</td>
                                    <td className="pay-meta-cell" data-label="Due Date">{inv.dueDate}</td>
                                    <td className="pay-total-cell" data-label="Total">{inv.total}</td>
                                    <td data-label="Status"><StatusBadge status={inv.status} /></td>
                                    <td data-label="Action">
                                        <div className="pay-actions">
                                            <button className="users-icon-btn" data-tooltip="View Invoice" onClick={() => {}}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                            </button>
                                            <button className="users-icon-btn pay-delete-btn" data-tooltip="Delete" onClick={() => setDeleteTarget(inv)}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Payment settings ── */}
            <div className="pay-settings-card">
                <div className="pay-settings-header">
                    <h3 className="pay-settings-title">Payment Settings</h3>
                    <p className="pay-settings-desc">Connect a payment provider to collect invoice payments online.</p>
                </div>
                <div className="pay-provider-row">
                    <div className="pay-provider-logo stripe">stripe</div>
                    <div className="pay-provider-info">
                        <span className="pay-provider-name">Stripe</span>
                        <span className="pay-provider-desc">Accept card and bank payments via Stripe.</span>
                    </div>
                    {stripeEnabled && <span className="pay-provider-badge">Connected</span>}
                    <Toggle value={stripeEnabled} onChange={setStripeEnabled} />
                </div>
            </div>

            {deleteTarget && (
                <DeleteModal
                    invoice={deleteTarget}
                    onConfirm={() => {
                        setInvoices(prev => prev.filter(i => i.id !== deleteTarget.id));
                        setDeleteTarget(null);
                    }}
                    onClose={() => setDeleteTarget(null)}
                />
            )}
        </div>
    );
};

export default PaymentsView;
