import { useState, useRef } from 'react';
import './ImportsView.css';

const IMPORT_TYPES = [
    {
        id: 'assign-users',
        label: 'Assign users to cases',
        desc: 'Map existing users to specific cases in bulk. Use this when users already exist in your hub and you want to link them to one or more cases at once.',
        icon: (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <polyline points="16 11 18 13 22 9"/>
            </svg>
        ),
        columns: [
            { name: 'user_id', required: true,  note: 'Internal user ID' },
            { name: 'case_id', required: true,  note: 'Internal case ID' },
            { name: 'role',    required: false, note: 'Optional — defaults to "Viewer"' },
        ],
        sampleHeader: 'user_id,case_id,role',
        sampleRows: [
            'USR-001,CASE-100,Staff',
            'USR-002,CASE-101,Viewer',
            'USR-003,CASE-100,Attorney',
        ],
    },
    {
        id: 'import-users',
        label: 'Import users',
        desc: 'Create multiple user accounts from a spreadsheet. Imported users receive an invitation email with portal access instructions.',
        icon: (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="20" y1="8" x2="20" y2="14"/>
                <line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
        ),
        columns: [
            { name: 'email',      required: true,  note: 'Must be unique' },
            { name: 'first_name', required: true,  note: '' },
            { name: 'last_name',  required: true,  note: '' },
            { name: 'phone',      required: false, note: 'Optional' },
            { name: 'role',       required: false, note: 'Optional — defaults to "Client"' },
        ],
        sampleHeader: 'email,first_name,last_name,phone,role',
        sampleRows: [
            'sarah@example.com,Sarah,Johnson,+12025550100,Client',
            'marcus@example.com,Marcus,Lee,,Staff',
            'emily@example.com,Emily,Martinez,+13105550182,Client',
        ],
    },
    {
        id: 'import-cases',
        label: 'Import cases',
        desc: 'Bulk-create cases from a spreadsheet. Existing case types must already be configured in your hub before importing.',
        icon: (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                <line x1="12" y1="11" x2="12" y2="17"/>
                <line x1="9" y1="14" x2="15" y2="14"/>
            </svg>
        ),
        columns: [
            { name: 'title',        required: true,  note: '' },
            { name: 'type',         required: true,  note: 'Must match existing case type' },
            { name: 'client_email', required: true,  note: 'User must already exist' },
            { name: 'status',       required: false, note: 'Optional — defaults to "Active"' },
            { name: 'opened_date',  required: false, note: 'Optional — YYYY-MM-DD' },
        ],
        sampleHeader: 'title,type,client_email,status,opened_date',
        sampleRows: [
            'Johnson v. City Transit,Personal Injury,sarah@example.com,Active,2025-01-15',
            'Lee v. Metro Health,Medical,marcus@example.com,Discovery,2025-02-03',
        ],
    },
    {
        id: 'import-contacts',
        label: 'Import contacts',
        desc: 'Add contact records (witnesses, insurers, medical providers, etc.) to your hub in bulk without creating user accounts.',
        icon: (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
        ),
        columns: [
            { name: 'first_name', required: true,  note: '' },
            { name: 'last_name',  required: true,  note: '' },
            { name: 'email',      required: false, note: 'Optional' },
            { name: 'phone',      required: false, note: 'Optional' },
            { name: 'address',    required: false, note: 'Optional' },
        ],
        sampleHeader: 'first_name,last_name,email,phone,address',
        sampleRows: [
            'Robert,Taylor,robert.t@email.com,+17185550174,"123 Main St, NY"',
            'Lisa,Chen,lisa.chen@email.com,,',
        ],
    },
];

const STATUS_STYLES = {
    Queued:     { color: '#B45309', bg: '#FEF3C7' },
    Processing: { color: '#1D4ED8', bg: '#DBEAFE' },
    Completed:  { color: '#065F46', bg: '#D1FAE5' },
    Failed:     { color: '#991B1B', bg: '#FEE2E2' },
};

const StatusBadge = ({ status }) => {
    const s = STATUS_STYLES[status] || { color: '#64748B', bg: '#F1F5F9' };
    return (
        <span className="imp-status-badge" style={{ color: s.color, background: s.bg }}>
            {status}
        </span>
    );
};

const INITIAL_IMPORTS = [
    { id: 1, name: 'new import',      createdOn: 'Jul 9, 8:16 PM',  source: 'ca-manage', type: 'Assign users to cases', stats: null,       status: 'Queued'     },
    { id: 2, name: 'user-bulk-july',  createdOn: 'Jul 7, 3:42 PM',  source: 'ca-manage', type: 'Import users',          stats: '124 / 125', status: 'Completed'  },
    { id: 3, name: 'cases-q2',        createdOn: 'Jun 28, 11:20 AM', source: 'ca-manage', type: 'Import cases',          stats: '0 / 88',    status: 'Failed'     },
    { id: 4, name: 'contacts-batch1', createdOn: 'Jun 20, 9:05 AM',  source: 'ca-manage', type: 'Import contacts',       stats: '312 / 312', status: 'Completed'  },
];


const downloadSample = (typeObj) => {
    const csv = [typeObj.sampleHeader, ...typeObj.sampleRows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sample-${typeObj.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
};

/* ── Type Preview Panel ── */
const TypePreview = ({ typeObj }) => {
    if (!typeObj) return (
        <div className="imp-preview-empty">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p>Select an import type to see column requirements and download a sample file</p>
        </div>
    );

    return (
        <div className="imp-preview-content">
            <div className="imp-preview-type-header">
                <div className="imp-preview-icon">{typeObj.icon}</div>
                <div>
                    <div className="imp-preview-type-name">{typeObj.label}</div>
                </div>
            </div>
            <p className="imp-preview-desc">{typeObj.desc}</p>

            <div className="imp-preview-cols-wrap">
                <div className="imp-preview-cols-title">Required columns</div>
                <div className="imp-preview-cols-list">
                    {typeObj.columns.map(col => (
                        <div key={col.name} className="imp-preview-col-row">
                            <div className="imp-preview-col-name-wrap">
                                <span className="imp-preview-col-name">{col.name}</span>
                                {col.required
                                    ? <span className="imp-col-req">required</span>
                                    : <span className="imp-col-opt">optional</span>
                                }
                            </div>
                            {col.note && <span className="imp-preview-col-note">{col.note}</span>}
                        </div>
                    ))}
                </div>
            </div>

            <button className="imp-download-btn" onClick={() => downloadSample(typeObj)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download Sample CSV
            </button>
        </div>
    );
};

/* ── Add Import Modal ── */
const AddImportModal = ({ onClose, onSave }) => {
    const [selectedTypeId, setSelectedTypeId] = useState('');
    const [name, setName] = useState('');
    const [file, setFile] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const typeObj = IMPORT_TYPES.find(t => t.id === selectedTypeId) || null;
    const canSave = selectedTypeId && file;

    const handleFile = (f) => {
        if (!f) return;
        const ext = f.name.split('.').pop().toLowerCase();
        if (!['csv', 'xlsx', 'xls'].includes(ext)) return;
        setFile(f);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        handleFile(e.dataTransfer.files[0]);
    };

    const handleSave = () => {
        if (!canSave) return;
        const now = new Date();
        const createdOn = now.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
        onSave({
            name: name.trim() || file.name.replace(/\.[^/.]+$/, ''),
            createdOn,
            source: 'ca-manage',
            type: typeObj.label,
            stats: null,
            status: 'Queued',
        });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="ccm imp-modal" onClick={e => e.stopPropagation()}>
                <div className="ccm-header">
                    <div>
                        <p className="ccm-breadcrumb">Integration · Imports</p>
                        <h2 className="ccm-title">New Import</h2>
                    </div>
                    <button className="ccm-close" onClick={onClose} aria-label="Close">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                <div className="ccm-body imp-modal-body">

                    {/* Left: form */}
                    <div className="imp-form-col">

                        {/* Import Type dropdown */}
                        <div className="ccm-field">
                            <label className="ccm-label">Import Type <span className="ccm-req">*</span></label>
                            <div className="imp-select-wrap">
                                <select
                                    className="ccm-select imp-type-select"
                                    value={selectedTypeId}
                                    onChange={e => setSelectedTypeId(e.target.value)}
                                >
                                    <option value="">Select an import type…</option>
                                    {IMPORT_TYPES.map(t => (
                                        <option key={t.id} value={t.id}>{t.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Name */}
                        <div className="ccm-field">
                            <label className="ccm-label">
                                Import Name
                                <span className="imp-optional">Optional</span>
                            </label>
                            <input
                                className="ccm-input"
                                type="text"
                                placeholder="e.g. July bulk user import"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                            <span className="ccm-hint">Leave blank to use the uploaded file name</span>
                        </div>

                        {/* File Upload */}
                        <div className="ccm-field">
                            <label className="ccm-label">Upload File <span className="ccm-req">*</span></label>
                            <div
                                className={`imp-drop-zone${dragOver ? ' drag-over' : ''}${file ? ' has-file' : ''}`}
                                onClick={() => !file && fileInputRef.current?.click()}
                                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".csv,.xlsx,.xls"
                                    style={{ display: 'none' }}
                                    onChange={e => handleFile(e.target.files[0])}
                                />
                                {file ? (
                                    <div className="imp-drop-file">
                                        <div className="imp-drop-file-icon">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                        </div>
                                        <div className="imp-drop-file-info">
                                            <div className="imp-drop-file-name">{file.name}</div>
                                            <div className="imp-drop-file-size">{(file.size / 1024).toFixed(1)} KB</div>
                                        </div>
                                        <button
                                            className="imp-drop-remove"
                                            type="button"
                                            onClick={e => { e.stopPropagation(); setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                                            aria-label="Remove file"
                                        >
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="imp-drop-empty">
                                        <div className="imp-drop-icon">
                                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                                        </div>
                                        <div className="imp-drop-text">
                                            <span className="imp-drop-primary">Drag &amp; drop your file here</span>
                                            <span className="imp-drop-or">or</span>
                                            <span className="imp-drop-browse">Browse file</span>
                                        </div>
                                        <div className="imp-drop-formats">Accepts: .csv, .xlsx, .xls</div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Right: preview */}
                    <div className="imp-preview-col">
                        <div className="imp-preview-panel">
                            <div className="imp-preview-panel-label">Preview</div>
                            <TypePreview typeObj={typeObj} />
                        </div>
                    </div>

                </div>

                <div className="ccm-footer">
                    <button className="imp-cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="imp-save-btn" onClick={handleSave} disabled={!canSave}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Create Import
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ── View Import Detail Modal ── */
const ViewImportModal = ({ imp, onClose }) => {
    const statusStyle = STATUS_STYLES[imp.status] || { color: '#64748B', bg: '#F1F5F9' };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="ccm imp-detail-modal" onClick={e => e.stopPropagation()}>
                <div className="ccm-header">
                    <div>
                        <p className="ccm-breadcrumb">Integration · Imports</p>
                        <h2 className="ccm-title">{imp.name}</h2>
                    </div>
                    <button className="ccm-close" onClick={onClose} aria-label="Close">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
                <div className="ccm-body">
                    <div className="imp-detail-meta">
                        <div className="imp-detail-row">
                            <span className="imp-detail-key">Status</span>
                            <span className="imp-status-badge" style={{ color: statusStyle.color, background: statusStyle.bg }}>{imp.status}</span>
                        </div>
                        <div className="imp-detail-row">
                            <span className="imp-detail-key">Type</span>
                            <span className="imp-detail-val">{imp.type}</span>
                        </div>
                        <div className="imp-detail-row">
                            <span className="imp-detail-key">Source</span>
                            <span className="imp-detail-val imp-detail-mono">{imp.source}</span>
                        </div>
                        <div className="imp-detail-row">
                            <span className="imp-detail-key">Created</span>
                            <span className="imp-detail-val">{imp.createdOn}</span>
                        </div>
                        {imp.stats && (
                            <div className="imp-detail-row">
                                <span className="imp-detail-key">Records</span>
                                <span className="imp-detail-val">{imp.stats}</span>
                            </div>
                        )}
                    </div>

                    <div className="imp-detail-log-wrap">
                        <div className="ccm-section-label" style={{ marginBottom: 10 }}>Import Log</div>
                        {imp.status === 'Queued' && (
                            <div className="imp-log-empty">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                <span>Import queued — log appears once processing starts</span>
                            </div>
                        )}
                        {imp.status === 'Processing' && (
                            <div className="imp-log-item processing">Processing rows…</div>
                        )}
                        {imp.status === 'Completed' && (
                            <>
                                <div className="imp-log-item success">✓ File validated successfully</div>
                                <div className="imp-log-item success">✓ All rows processed</div>
                                <div className="imp-log-item success">✓ Import completed — {imp.stats} records updated</div>
                            </>
                        )}
                        {imp.status === 'Failed' && (
                            <>
                                <div className="imp-log-item success">✓ File validated successfully</div>
                                <div className="imp-log-item error">✗ Processing failed: column mismatch on row 3</div>
                                <div className="imp-log-item error">✗ Import aborted — 0 records updated</div>
                            </>
                        )}
                    </div>
                </div>
                <div className="ccm-footer">
                    <button className="imp-cancel-btn" onClick={onClose}>Close</button>
                    {imp.status === 'Failed' && (
                        <button className="imp-save-btn">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/></svg>
                            Retry Import
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ── Main View ── */
const ImportsView = ({ addOpen, onCloseAdd }) => {
    const [imports, setImports] = useState(INITIAL_IMPORTS);
    const [typeFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [viewImport, setViewImport] = useState(null);

    const handleSave = (newImp) => {
        setImports(prev => [{ id: Date.now(), ...newImp }, ...prev]);
    };

    const filtered = imports.filter(imp => {
        const matchType = typeFilter === 'All' || imp.type === typeFilter;
        const matchSearch = !search || imp.name.toLowerCase().includes(search.toLowerCase()) || imp.type.toLowerCase().includes(search.toLowerCase());
        return matchType && matchSearch;
    });

    return (
        <div className="portal-content imp-content">
            <div className="imp-card">
                {/* Toolbar */}
                <div className="imp-toolbar">
                    <div className="imp-search-wrap">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        <input
                            className="imp-search-input"
                            type="text"
                            placeholder="Search imports…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="imp-table-wrap">
                    <table className="imp-table as-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Created On</th>
                                <th>Source</th>
                                <th>Type</th>
                                <th>Stats</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center', color: '#94A3B8', padding: '40px 0' }}>
                                        No imports found
                                    </td>
                                </tr>
                            ) : filtered.map(imp => (
                                <tr key={imp.id}>
                                    <td data-label="Name"><span className="imp-name-cell">{imp.name}</span></td>
                                    <td data-label="Created On"><span className="imp-date-cell">{imp.createdOn}</span></td>
                                    <td data-label="Source"><span className="imp-source-badge">{imp.source}</span></td>
                                    <td data-label="Type"><span className="imp-type-text">{imp.type}</span></td>
                                    <td data-label="Stats"><span className="imp-stats-cell">{imp.stats || '—'}</span></td>
                                    <td data-label="Status"><StatusBadge status={imp.status} /></td>
                                    <td data-label="Action">
                                        <button className="imp-view-btn" onClick={() => setViewImport(imp)}>
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                            View Import
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {addOpen && <AddImportModal onClose={onCloseAdd} onSave={handleSave} />}
            {viewImport && <ViewImportModal imp={viewImport} onClose={() => setViewImport(null)} />}
        </div>
    );
};

export default ImportsView;
