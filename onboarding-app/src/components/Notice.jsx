/* Notice — a message about a whole form, panel or page.

   Use a field message (FormField) when the problem belongs to one field.
   Use a Notice when it belongs to more than one, or to none:
     - the top of a modal after a failed save, or listing fields to fix
     - beside a control whose change has a consequence (turning a key off)
     - a page banner: trial ending, read-only access, sync failed

   tone     error | warning | success | info | neutral
   title    one short bold line. Optional; a single sentence needs none.
   action   { label, onClick } — one action at most, named for what it does
   onDismiss shows a close button. Errors that block work are not dismissible.
   variant  'inline' (default, inside a modal or panel) | 'banner' (page top)
*/

import ToneIcon from './ToneIcon';
import './Notice.css';

const Notice = ({
    tone = 'info',
    title,
    children,
    action,
    onDismiss,
    variant = 'inline',
    compact = false,
    className = '',
}) => (
    <div
        className={`ntc ntc-${tone} ntc-${variant}${compact ? ' ntc-compact' : ''} ${className}`}
        role={tone === 'error' ? 'alert' : 'status'}
    >
        <span className="ntc-icon"><ToneIcon tone={tone === 'neutral' ? 'info' : tone} size={compact ? 15 : 17} /></span>
        <div className="ntc-body">
            {title && <p className="ntc-title">{title}</p>}
            {children && <div className="ntc-text">{children}</div>}
        </div>
        {action && (
            <button type="button" className="ntc-action" onClick={action.onClick}>{action.label}</button>
        )}
        {onDismiss && (
            <button type="button" className="ntc-close" onClick={onDismiss} aria-label="Dismiss">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
        )}
    </div>
);

export default Notice;
