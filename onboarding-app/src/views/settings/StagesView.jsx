import { useRef, useState } from 'react';
import StageLabel from '../../components/StageLabel';
import { MAX_STAGES, stageActions, useStages } from '../../data/stages';
import '../settings/AdvancedSettingsView.css';
import './CustomFieldsView.css';
import './AutomationsView.css';
import './StagesView.css';

const NAME_MAX = 40;
const DESC_MAX = 200;

const DragHandle = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cf-drag-handle">
        <circle cx="9" cy="6" r="1" fill="currentColor"/><circle cx="15" cy="6" r="1" fill="currentColor"/>
        <circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/>
        <circle cx="9" cy="18" r="1" fill="currentColor"/><circle cx="15" cy="18" r="1" fill="currentColor"/>
    </svg>
);

const CloseIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

const EyeIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
);

const CopyId = ({ id }) => {
    const [copied, setCopied] = useState(false);
    const copy = async () => {
        try { await navigator.clipboard.writeText(id); } catch { /* clipboard blocked; still show feedback */ }
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
    };
    return (
        <div className="stg-id-cell">
            <code className="stg-id">{id}</code>
            <button type="button" className={`stg-copy-btn${copied ? ' is-copied' : ''}`} onClick={copy} aria-label={`Copy stage id ${id}`}>
                {copied ? (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                ) : (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                )}
                <span className="stg-copy-label">{copied ? 'Copied' : 'Copy'}</span>
            </button>
        </div>
    );
};

/* ── Add / edit stage ── */
const StageModal = ({ initial, position, onSave, onClose }) => {
    const [name, setName] = useState(initial?.name || '');
    const [desc, setDesc] = useState(initial?.description || '');
    const canSave = name.trim().length > 0;
    const preview = { id: 'preview', name: name.trim() || 'Stage name', description: desc.trim() };

    const save = () => { if (canSave) onSave({ name: name.trim(), description: desc.trim() }); };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="ccm cf-field-modal stg-modal" onClick={e => e.stopPropagation()}>
                <div className="ccm-header">
                    <div>
                        <p className="ccm-breadcrumb">Settings &gt; Stages</p>
                        <h2 className="ccm-title">{initial ? 'Edit Stage' : 'Add Stage'}</h2>
                    </div>
                    <button className="ccm-close" onClick={onClose} aria-label="Close"><CloseIcon /></button>
                </div>

                <div className="cf-modal-body-split">
                    <div className="cf-modal-config">
                        <div className="ccm-field">
                            <label className="ccm-label" htmlFor="stg-name">Stage name <span className="cf-req">*</span></label>
                            <input
                                id="stg-name"
                                className="ccm-input"
                                placeholder="e.g. Demand sent"
                                value={name}
                                maxLength={NAME_MAX}
                                onChange={e => setName(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && save()}
                                autoFocus
                            />
                            <span className="ccm-hint">Short and plain. Clients see this name on every page of their case.</span>
                        </div>

                        <div className="ccm-field">
                            <div className="stg-desc-label-row">
                                <label className="ccm-label" htmlFor="stg-desc">Description <span className="stg-optional">optional</span></label>
                                <span className="stg-client-note"><EyeIcon /> Clients will see this</span>
                            </div>
                            <textarea
                                id="stg-desc"
                                className="ccm-textarea stg-textarea"
                                placeholder="Explain what happens at this stage, in words a client understands."
                                value={desc}
                                maxLength={DESC_MAX}
                                onChange={e => setDesc(e.target.value)}
                            />
                            <div className="stg-desc-foot">
                                <span className="ccm-hint">Shown when a client hovers or taps the stage.</span>
                                <span className="ccm-hint">{desc.length}/{DESC_MAX}</span>
                            </div>
                        </div>

                        {!initial && (
                            <div className="stg-modal-note">
                                This stage will be added at position {position}. Drag rows on the Stages page to reorder.
                            </div>
                        )}
                    </div>

                    <div className="cf-preview-pane">
                        <div className="cf-preview-head"><EyeIcon /> Client preview</div>
                        <div className="stg-preview-card">
                            <div className="stg-preview-crumb">Rear-End Collision, Downtown LA</div>
                            <div className="stg-preview-title-row">
                                <span className="stg-preview-title">Feed</span>
                                <StageLabel stage={{ ...preview, description: '' }} />
                            </div>
                            {preview.description ? (
                                <div className="stg-preview-pop">
                                    <div className="stage-pop-eyebrow">Case stage</div>
                                    <div className="stage-pop-title">{preview.name}</div>
                                    <p className="stage-pop-desc">{preview.description}</p>
                                </div>
                            ) : (
                                <div className="stg-preview-empty">No description. Clients see the name only.</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="ccm-footer">
                    <button className="ccm-cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="ccm-save-btn" disabled={!canSave} onClick={save}>{initial ? 'SAVE' : 'ADD STAGE'}</button>
                </div>
            </div>
        </div>
    );
};

/* ── Delete: confirm, or explain why it is blocked ── */
const DeleteStageModal = ({ stage, caseCount, automationCount, onCancel, onConfirm, onViewCases, onViewAutomations }) => {
    const blocked = caseCount > 0 || automationCount > 0;
    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="case-delete-modal stg-delete-modal" onClick={e => e.stopPropagation()}>
                <div className="case-delete-header">
                    <h2>{blocked ? "Can't delete this stage yet" : 'Delete Stage'}</h2>
                    <button className="case-delete-close" onClick={onCancel} aria-label="Close"><CloseIcon /></button>
                </div>
                <div className="case-delete-body">
                    {blocked ? (
                        <>
                            <p><strong>{stage.name}</strong> is still in use. Clear the items below, then try again.</p>
                            <ul className="stg-block-list">
                                {caseCount > 0 && (
                                    <li className="stg-block-item">
                                        <span className="stg-block-icon">
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                                        </span>
                                        <div className="stg-block-copy">
                                            <strong>{caseCount} {caseCount === 1 ? 'case is' : 'cases are'} at this stage</strong>
                                            <span>Move {caseCount === 1 ? 'it' : 'them'} to another stage, or to No stage.</span>
                                        </div>
                                        <button className="stg-block-link" onClick={onViewCases}>View cases</button>
                                    </li>
                                )}
                                {automationCount > 0 && (
                                    <li className="stg-block-item">
                                        <span className="stg-block-icon">
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                                        </span>
                                        <div className="stg-block-copy">
                                            <strong>{automationCount} milestone {automationCount === 1 ? 'automation uses' : 'automations use'} it</strong>
                                            <span>Change {automationCount === 1 ? 'its' : 'their'} stage, or remove {automationCount === 1 ? 'it' : 'them'}.</span>
                                        </div>
                                        <button className="stg-block-link" onClick={onViewAutomations}>View automations</button>
                                    </li>
                                )}
                            </ul>
                        </>
                    ) : (
                        <>
                            <p>You are about to delete this stage. No cases or automations use it. This cannot be undone.</p>
                            <div className="case-delete-meta">
                                <span>{stage.name}</span>
                                <strong>{stage.id}</strong>
                            </div>
                        </>
                    )}
                </div>
                <div className="case-delete-footer">
                    {blocked ? (
                        <button className="ccm-save-btn" onClick={onCancel}>GOT IT</button>
                    ) : (
                        <>
                            <button className="case-delete-cancel" onClick={onCancel}>Cancel</button>
                            <button className="case-delete-confirm" onClick={onConfirm}>DELETE</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const StagesView = ({ onNavigate }) => {
    const { stages, caseStages, milestones } = useStages();
    const [viewAs, setViewAs] = useState('admin');
    const [modal, setModal] = useState(null); // { stage? } — null stage = add
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [dragOverIdx, setDragOverIdx] = useState(null);
    const dragIdx = useRef(null);

    const isAdmin = viewAs === 'admin';
    const atLimit = stages.length >= MAX_STAGES;
    const caseCount = (id) => Object.values(caseStages).filter(s => s === id).length;
    const automationCount = (id) => milestones.filter(m => m.stageId === id).length;

    const saveStage = (data) => {
        if (modal.stage) stageActions.update(modal.stage.id, data);
        else stageActions.add(data);
        setModal(null);
    };

    const onDrop = (i) => {
        const from = dragIdx.current;
        if (from !== null && from !== i) stageActions.move(from, i);
        dragIdx.current = null;
        setDragOverIdx(null);
    };

    return (
        <div className="portal-content as-content">
            {modal && (
                <StageModal
                    initial={modal.stage}
                    position={stages.length + 1}
                    onSave={saveStage}
                    onClose={() => setModal(null)}
                />
            )}
            {deleteTarget && (
                <DeleteStageModal
                    stage={deleteTarget}
                    caseCount={caseCount(deleteTarget.id)}
                    automationCount={automationCount(deleteTarget.id)}
                    onCancel={() => setDeleteTarget(null)}
                    onConfirm={() => { stageActions.remove(deleteTarget.id); setDeleteTarget(null); }}
                    onViewCases={() => { const id = deleteTarget.id; setDeleteTarget(null); onNavigate?.('cases', { stageId: id }); }}
                    onViewAutomations={() => { setDeleteTarget(null); onNavigate?.('automations', { tab: 'Milestone' }); }}
                />
            )}

            <div className="stg-preview-bar" role="group" aria-label="Prototype preview">
                <span className="stg-preview-bar-label">Prototype · view as</span>
                <div className="stg-seg">
                    {['admin', 'manager'].map(r => (
                        <button key={r} className={`stg-seg-btn${viewAs === r ? ' active' : ''}`} onClick={() => setViewAs(r)}>
                            {r === 'admin' ? 'Admin' : 'Manager'}
                        </button>
                    ))}
                </div>
                <span className="stg-preview-bar-sep" />
                {atLimit ? (
                    <button className="stg-preview-bar-link" onClick={stageActions.resetDemo}>Reset to default stages</button>
                ) : (
                    <button className="stg-preview-bar-link" onClick={stageActions.fillDemo}>Fill to {MAX_STAGES} stages</button>
                )}
            </div>

            <div className="as-tab-panel cf-panel">
                <div className="stg-head">
                    <div className="as-panel-title-wrap">
                        <div className="auto-section-label stg-section-label">CASE STAGES</div>
                        <p className="as-panel-subtitle">
                            Stages show clients where their case is. Staff set each case's stage; clients see it at the top of every case page.
                        </p>
                    </div>
                    <div className="stg-head-actions">
                        <span className={`stg-count${atLimit ? ' is-full' : ''}`}>{stages.length} of {MAX_STAGES}</span>
                        {isAdmin && (
                            <button className="as-primary-btn as-btn-sm" disabled={atLimit} onClick={() => setModal({ stage: null })}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                Add Stage
                            </button>
                        )}
                    </div>
                </div>

                {isAdmin && atLimit && (
                    <div className="stg-limit-banner" role="status">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        <div>
                            <strong>You've reached the {MAX_STAGES}-stage limit.</strong>
                            <span> To add a stage, delete one you no longer use, or rename an existing one.</span>
                        </div>
                    </div>
                )}

                {!isAdmin && (
                    <div className="stg-readonly-banner">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        View only. Ask an admin to add, rename, reorder or delete stages.
                    </div>
                )}

                <div className="as-table-wrap">
                    <table className={`as-table cf-table stg-table${isAdmin ? '' : ' is-readonly'}`}>
                        <colgroup>
                            {isAdmin && <col style={{ width: 40 }} />}
                            <col style={{ width: 44 }} />
                            <col style={{ width: '20%' }} />
                            <col />
                            <col style={{ width: 190 }} />
                            <col style={{ width: 120 }} />
                            {isAdmin && <col style={{ width: 92 }} />}
                        </colgroup>
                        <thead>
                            <tr>
                                {isAdmin && <th aria-label="Reorder"></th>}
                                <th>#</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Stage ID</th>
                                <th>Automations</th>
                                {isAdmin && <th style={{ textAlign: 'right' }}>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {stages.map((s, i) => {
                                const autos = automationCount(s.id);
                                return (
                                    <tr
                                        key={s.id}
                                        className={dragOverIdx === i ? 'cf-drag-over' : ''}
                                        draggable={isAdmin}
                                        onDragStart={isAdmin ? () => { dragIdx.current = i; } : undefined}
                                        onDragOver={isAdmin ? (e) => { e.preventDefault(); setDragOverIdx(i); } : undefined}
                                        onDrop={isAdmin ? () => onDrop(i) : undefined}
                                        onDragEnd={isAdmin ? () => { dragIdx.current = null; setDragOverIdx(null); } : undefined}
                                    >
                                        {isAdmin && <td className="cf-drag-cell" aria-label="Drag to reorder"><DragHandle /></td>}
                                        <td className="stg-pos" data-label="Position">{i + 1}</td>
                                        <td data-label="Name"><span className="cf-label-name">{s.name}</span></td>
                                        <td data-label="Description">
                                            {s.description
                                                ? <span className="stg-desc">{s.description}</span>
                                                : <span className="cf-empty">No description</span>}
                                        </td>
                                        <td data-label="Stage ID"><CopyId id={s.id} /></td>
                                        <td data-label="Automations">
                                            {autos > 0 ? (
                                                <button className="stg-auto-count" onClick={() => onNavigate?.('automations', { tab: 'Milestone' })} title="Open Milestone automations">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                                                    {autos}
                                                </button>
                                            ) : <span className="cf-empty">0</span>}
                                        </td>
                                        {isAdmin && (
                                            <td data-label="Actions">
                                                <div className="cf-actions">
                                                    <button className="users-icon-btn" data-tooltip="Edit" aria-label={`Edit ${s.name}`} onClick={() => setModal({ stage: s })}>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                                    </button>
                                                    <button className="users-icon-btn cf-delete-btn" data-tooltip="Delete" aria-label={`Delete ${s.name}`} onClick={() => setDeleteTarget(s)}>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="cf-footer-note">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {isAdmin
                        ? 'Drag rows to change the order staff see in the stage picker. Clients only ever see their own case’s current stage.'
                        : 'Clients only ever see their own case’s current stage.'}
                </div>
            </div>
        </div>
    );
};

export default StagesView;
