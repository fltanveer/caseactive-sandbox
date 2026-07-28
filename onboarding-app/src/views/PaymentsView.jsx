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
    {
        id: 4,
        caseId: 'cc-9a2b3c4d5e6f7081',
        invoiceId: 'invoice...4a7bd2e91c05f338',
        title: 'Deposition Costs — Martinez',
        author: 'Sam Paralegal',
        dueDate: 'Jun 28, 10:00 AM',
        total: '$680.00',
        status: 'paid',
    },
    {
        id: 5,
        caseId: 'cc-2f3e4d5c6b7a8091',
        invoiceId: 'invoice...8e1f45c72da09b16',
        title: 'Expert Witness Fee — Kim Clinic',
        author: 'Priya Kapoor',
        dueDate: 'Jul 5, 3:00 PM',
        total: '$1,200.00',
        status: 'open',
    },
    {
        id: 6,
        caseId: 'cc-6b7c8d9e0f1a2b34',
        invoiceId: 'invoice...c93a58f16e0247bd',
        title: 'Court Filing — Auto Accident',
        author: 'Jordan Admin',
        dueDate: 'Jun 20, 9:00 AM',
        total: '$95.00',
        status: 'overdue',
    },
    {
        id: 7,
        caseId: 'cc-4d5e6f7a8b9c0d12',
        invoiceId: 'invoice...1b6d94e0a7f38c52',
        title: 'Mediation Session — Slip and Fall',
        author: 'Mike Torres',
        dueDate: 'Jul 22, 1:00 PM',
        total: '$350.00',
        status: 'open',
    },
    {
        id: 8,
        caseId: 'cc-8c9d0e1f2a3b4c56',
        invoiceId: 'invoice...5f02c8b91e6a743d',
        title: 'Retainer — Workers Comp',
        author: 'Chris Lee',
        dueDate: 'Jun 15, 11:00 AM',
        total: '$800.00',
        status: 'paid',
    },
    {
        id: 9,
        caseId: 'cc-0e1f2a3b4c5d6e78',
        invoiceId: 'invoice...7a3e05d18f92b6c4',
        title: 'Records Request Fee',
        author: 'Sara Chen',
        dueDate: 'Jul 9, 4:00 PM',
        total: '$45.00',
        status: 'paid',
    },
    {
        id: 10,
        caseId: 'cc-2a3b4c5d6e7f8091',
        invoiceId: 'invoice...9c05a7e13d68f240',
        title: 'Settlement Processing Fee',
        author: 'Jordan Admin',
        dueDate: 'Jun 30, 2:00 PM',
        total: '$275.00',
        status: 'overdue',
    },
    {
        id: 11,
        caseId: 'cc-5c6d7e8f9a0b1c23',
        invoiceId: 'invoice...3d68f0a25c917be4',
        title: 'Medical Records Copy Fee',
        author: 'Mike Torres',
        dueDate: 'Jul 14, 10:00 AM',
        total: '$60.00',
        status: 'open',
    },
    {
        id: 12,
        caseId: 'cc-7e8f9a0b1c2d3e45',
        invoiceId: 'invoice...6f209b7d34e81ca5',
        title: 'Consultation — Malpractice Intake',
        author: 'Priya Kapoor',
        dueDate: 'Jun 24, 9:30 AM',
        total: '$300.00',
        status: 'paid',
    },
];

const PAGE_SIZE = 5;

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

const Pagination = ({ page, totalPages, totalItems, pageSize, onChange }) => {
    if (totalItems === 0) return null;
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, totalItems);

    const pages = [];
    for (let p = 1; p <= totalPages; p++) {
        if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) pages.push(p);
        else if (pages[pages.length - 1] !== '…') pages.push('…');
    }

    return (
        <div className="pay-pagination">
            <span className="pay-pagination-summary">
                Showing <strong>{start}–{end}</strong> of <strong>{totalItems}</strong> invoices
            </span>
            <div className="pay-pagination-controls">
                <button
                    className="pay-page-btn"
                    disabled={page === 1}
                    onClick={() => onChange(page - 1)}
                    aria-label="Previous page"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                {pages.map((p, i) => p === '…' ? (
                    <span key={`ellipsis-${i}`} className="pay-page-ellipsis">…</span>
                ) : (
                    <button
                        key={p}
                        className={`pay-page-btn${p === page ? ' active' : ''}`}
                        onClick={() => onChange(p)}
                    >
                        {p}
                    </button>
                ))}
                <button
                    className="pay-page-btn"
                    disabled={page === totalPages}
                    onClick={() => onChange(page + 1)}
                    aria-label="Next page"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
            </div>
        </div>
    );
};

const downloadInvoice = (invoice) => {
    const lines = [
        'CaseActive Legal Group',
        '123 Market St, Suite 400 · San Francisco, CA',
        '',
        `INVOICE — ${invoice.status.toUpperCase()}`,
        '',
        `Invoice ID:  ${invoice.invoiceId}`,
        `Case ID:     ${invoice.caseId}`,
        `Issued By:   ${invoice.author}`,
        `Due Date:    ${invoice.dueDate}`,
        '',
        '----------------------------------------',
        `${invoice.title}`,
        `Amount: ${invoice.total}`,
        '----------------------------------------',
        `Total Due: ${invoice.total}`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${invoice.invoiceId.replace(/[^a-z0-9]/gi, '-')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

const InvoicePreviewModal = ({ invoice, onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
        <div className="ccm pay-modal pay-preview-modal" onClick={e => e.stopPropagation()}>
            <div className="ccm-header">
                <div>
                    <p className="ccm-breadcrumb">Payments · Invoices</p>
                    <h2 className="ccm-title">Invoice Preview</h2>
                </div>
                <button className="ccm-close" onClick={onClose}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
            <div className="ccm-body pay-preview-body">
                <div className="pay-preview-sheet">
                    <div className="pay-preview-top">
                        <div className="pay-preview-brand">
                            <div className="pay-preview-logo">CA</div>
                            <div>
                                <div className="pay-preview-firm">CaseActive Legal Group</div>
                                <div className="pay-preview-firm-sub">123 Market St, Suite 400 · San Francisco, CA</div>
                            </div>
                        </div>
                        <div className="pay-preview-heading">
                            <span className="pay-preview-heading-label">Invoice</span>
                            <StatusBadge status={invoice.status} />
                        </div>
                    </div>

                    <div className="pay-preview-meta-grid">
                        <div className="pay-preview-meta-item">
                            <span className="pay-preview-meta-label">Invoice ID</span>
                            <span className="pay-preview-meta-value pay-preview-mono">{invoice.invoiceId}</span>
                        </div>
                        <div className="pay-preview-meta-item">
                            <span className="pay-preview-meta-label">Case ID</span>
                            <span className="pay-preview-meta-value pay-preview-mono">{invoice.caseId}</span>
                        </div>
                        <div className="pay-preview-meta-item">
                            <span className="pay-preview-meta-label">Issued By</span>
                            <span className="pay-preview-meta-value">{invoice.author}</span>
                        </div>
                        <div className="pay-preview-meta-item">
                            <span className="pay-preview-meta-label">Due Date</span>
                            <span className="pay-preview-meta-value">{invoice.dueDate}</span>
                        </div>
                    </div>

                    <table className="pay-preview-table">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{invoice.title}</td>
                                <td>{invoice.total}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td>Total Due</td>
                                <td>{invoice.total}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
            <div className="ccm-footer">
                <button className="imp-cancel-btn" onClick={onClose}>Close</button>
                <button className="imp-cancel-btn pay-preview-download-btn" onClick={() => downloadInvoice(invoice)}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Download
                </button>
                <button className="imp-save-btn" onClick={() => window.print()}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                    Print
                </button>
            </div>
        </div>
    </div>
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
    const [page, setPage] = useState(1);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [previewTarget, setPreviewTarget] = useState(null);
    const [stripeEnabled, setStripeEnabled] = useState(false);

    const filtered = invoices.filter(inv => {
        const q = search.toLowerCase();
        return !q
            || inv.title.toLowerCase().includes(q)
            || inv.caseId.toLowerCase().includes(q)
            || inv.invoiceId.toLowerCase().includes(q)
            || inv.author.toLowerCase().includes(q);
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const handleSearch = (value) => {
        setSearch(value);
        setPage(1);
    };

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
                            onChange={e => handleSearch(e.target.value)}
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
                            {paged.length === 0 ? (
                                <tr><td className="pay-empty" colSpan={8}>No invoices found</td></tr>
                            ) : paged.map(inv => (
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
                                            <button className="users-icon-btn" data-tooltip="View Invoice" onClick={() => setPreviewTarget(inv)}>
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

            <Pagination
                page={currentPage}
                totalPages={totalPages}
                totalItems={filtered.length}
                pageSize={PAGE_SIZE}
                onChange={setPage}
            />

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

            {previewTarget && (
                <InvoicePreviewModal
                    invoice={previewTarget}
                    onClose={() => setPreviewTarget(null)}
                />
            )}
        </div>
    );
};

export default PaymentsView;
