/* ConfirmModal — a confirm step that isn't a delete.

   Same layout as DeleteConfirmModal (tile, bold question, one line on what
   happens, a button that names the action), so every confirm in the product
   reads the same way. Only the tone changes.

   tone     warning — the action has a consequence but can be undone or
                      redone (turn a key off, discard changes, regenerate)
            error   — the action can't happen right now. Pass no onConfirm;
                      the modal shows a single button that closes it.
            info    — a plain check before something routine
   question the bold line. Phrase it as the action: "Turn off this key?"
   detail   what happens, in one or two sentences.
   confirmLabel names the action ("Turn off key"), never "Yes" or "OK".

   For deletes use DeleteConfirmModal.
*/

import { useId } from 'react';
import ToneIcon from './ToneIcon';
import './DeleteConfirmModal.css';
import './ConfirmModal.css';

const ConfirmModal = ({
    tone = 'warning',
    title,
    question,
    detail,
    confirmLabel = 'Continue',
    cancelLabel = 'Cancel',
    closeLabel = 'Got it',
    onConfirm,
    onCancel,
    children,
}) => {
    const titleId = useId();
    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div
                className={`confirm-modal cfm cfm-${tone}`}
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
                        <span className="cm-danger-icon cfm-icon"><ToneIcon tone={tone} size={19} /></span>
                        <div className="cm-danger-copy">
                            <p className="cm-danger-q">{question}</p>
                            {detail && <p className="confirm-modal-text">{detail}</p>}
                        </div>
                    </div>
                    {children && <div className="cm-danger-extra">{children}</div>}
                </div>
                <div className="confirm-modal-footer">
                    {onConfirm ? (
                        <>
                            <button className="confirm-modal-cancel" onClick={onCancel}>{cancelLabel}</button>
                            <button className="confirm-modal-confirm cfm-confirm" onClick={onConfirm}>{confirmLabel}</button>
                        </>
                    ) : (
                        <button className="confirm-modal-confirm" onClick={onCancel}>{closeLabel}</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
