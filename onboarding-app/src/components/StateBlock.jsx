/* StateBlock — the three states a panel can be in when it has nothing to show.

   They are one component because the whole point is that they must not look
   alike: "No invoices yet" is a normal, calm fact, while "Invoices couldn't be
   loaded" is a fault the viewer can act on. Keeping them in separate one-off
   markup per view is how those two ended up indistinguishable.

   tone: 'empty'  — nothing here yet, nothing wrong
         'error'  — it failed to load, offer a retry
         'locked' — it exists but this viewer cannot change it
*/

import './StateBlock.css';

const ICONS = {
    empty: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
    ),
    error: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="13"/><line x1="12" y1="16.5" x2="12.01" y2="16.5"/></svg>
    ),
    locked: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
    ),
};

const StateBlock = ({
    tone = 'empty',
    title,
    message,
    actionLabel,
    onAction,
    compact = false,
    className = '',
}) => (
    <div className={`sb sb-${tone}${compact ? ' sb-compact' : ''} ${className}`} role={tone === 'error' ? 'alert' : undefined}>
        <span className="sb-icon">{ICONS[tone]}</span>
        <div className="sb-body">
            {title && <p className="sb-title">{title}</p>}
            {message && <p className="sb-message">{message}</p>}
        </div>
        {actionLabel && (
            <button type="button" className="sb-action" onClick={onAction}>{actionLabel}</button>
        )}
    </div>
);

export default StateBlock;
