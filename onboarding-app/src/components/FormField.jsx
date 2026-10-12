/* FormField — label, control and one message line.

   A field has exactly one message slot under the control. Whatever matters
   most fills it: an error beats a warning, a warning beats a success, and
   any of them replaces the hint. Stacking the hint and then the error below
   it (the old Source CIDR pattern) makes people read two lines to find the
   one that matters.

   error    blocks saving. Say what to enter, not what went wrong:
            "Enter an IPv4 address or range, like 203.0.113.10."
   warning  saving is allowed, but the value has a consequence.
   success  only when a check ran and passed (a domain verified).
   hint     what a good value looks like. Shown when nothing else is.
   readOnly the value can't be changed here; the hint says why.
   changed  marks an unsaved edit in a long form.

   The control is passed as the only child. It gets the id, aria-invalid and
   aria-describedby, so screen readers read the message with the field.
*/

import { Children, cloneElement, isValidElement, useId } from 'react';
import ToneIcon from './ToneIcon';
import './FormField.css';

const LockIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
);

const FormField = ({
    label,
    required = false,
    optional = false,
    hint,
    error,
    warning,
    success,
    readOnly = false,
    changed = false,
    id: idProp,
    className = '',
    children,
}) => {
    const autoId = useId();
    const id = idProp ?? autoId;
    const msgId = `${id}-msg`;

    const tone = error ? 'error' : warning ? 'warning' : success ? 'success' : null;
    const message = error || warning || success || hint;
    const state = tone ?? (readOnly ? 'readonly' : null);

    const child = Children.only(children);
    const control = isValidElement(child)
        ? cloneElement(child, {
            id,
            'aria-invalid': tone === 'error' || undefined,
            'aria-describedby': message ? msgId : undefined,
            ...(readOnly ? { readOnly: true, tabIndex: child.props.tabIndex } : null),
        })
        : child;

    return (
        <div className={`ff${state ? ` ff-${state}` : ''}${changed ? ' ff-changed' : ''} ${className}`}>
            <label className="ff-label" htmlFor={id}>
                {label}
                {required && <span className="ff-req" aria-hidden="true">*</span>}
                {optional && <span className="ff-optional">Optional</span>}
                {readOnly && <span className="ff-lock" title="Can't be changed"><LockIcon /></span>}
                {changed && <span className="ff-edited">Edited</span>}
            </label>
            {control}
            {message && (
                <p id={msgId} className="ff-msg" role={tone === 'error' ? 'alert' : undefined}>
                    {tone && <span className="ff-msg-icon"><ToneIcon tone={tone} size={14} /></span>}
                    <span>{message}</span>
                </p>
            )}
        </div>
    );
};

export default FormField;
