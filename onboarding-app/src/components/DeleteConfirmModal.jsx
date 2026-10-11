/* DeleteConfirmModal — the one confirm step for anything destructive.

   Every delete in the app used to draw its own: some had a red button and
   some a teal one, some said YES, one floated a big trash icon over the text.
   They all ask the same thing, so they now look the same: the trash tile
   beside a bold question, one line on what happens, and a red button that
   names the action.

   name     what is being deleted; the question becomes "Delete <name>?"
   question replaces that question outright, for wording like
            "Remove the Visa card ending in 4242?"
   detail   the consequence. End it with "This can't be undone." when true.
   children anything a heavier delete needs below the question: what is
            lost, a type-to-confirm field.
   secondaryAction  an extra footer button left of Cancel, such as
            "Cancel subscription instead".
*/

import { useId } from 'react';
import './DeleteConfirmModal.css';

export const TrashIcon = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
        <path d="M10 11v6"/><path d="M14 11v6"/>
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
);

const DeleteConfirmModal = ({
    title,
    name,
    question,
    detail,
    confirmLabel = 'Delete',
    cancelLabel = 'Cancel',
    confirmDisabled = false,
    secondaryAction,
    wide = false,
    onConfirm,
    onCancel,
    children,
}) => {
    const titleId = useId();
    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div
                className={`confirm-modal dcm${wide ? ' is-wide' : ''}`}
                role="alertdialog" aria-modal="true" aria-labelledby={titleId}
                onClick={e => e.stopPropagation()}
            >
                <div className="confirm-modal-header">
                    <h3 className="confirm-modal-title" id={titleId}>{title}</h3>
                    <button className="confirm-modal-close" onClick={onCancel} aria-label="Close">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
                <div className="confirm-modal-body">
                    <div className="cm-danger">
                        <span className="cm-danger-icon"><TrashIcon size={18} /></span>
                        <div className="cm-danger-copy">
                            <p className="cm-danger-q">{question ?? <>Delete <strong className="cm-danger-name">{name}</strong>?</>}</p>
                            {detail && <p className="confirm-modal-text">{detail}</p>}
                        </div>
                    </div>
                    {children && <div className="cm-danger-extra">{children}</div>}
                </div>
                <div className="confirm-modal-footer">
                    {secondaryAction}
                    <button className="confirm-modal-cancel" onClick={onCancel}>{cancelLabel}</button>
                    <button className="confirm-modal-confirm is-danger" disabled={confirmDisabled} onClick={onConfirm}>
                        <TrashIcon />
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;
