/* LockedControl — wraps a control the viewer is not allowed to change.

   The control stays on screen, visibly inert, with one line saying who can
   change it. Hiding it instead would be worse: a Manager who cannot see the
   setting cannot tell whether it is off, missing, or simply not theirs, and
   they end up asking an Admin to check. Showing it answers that without a
   conversation, and keeps both roles looking at the same page.

   Pointer events are blocked on the wrapped control so a greyed field cannot
   be focused or submitted by keyboard either.

   reasonFirst is for locking a whole page rather than one control. Under a
   single field the reason is the next thing you read; under a page it is
   below everything, so someone scans a table of dimmed rows and reaches the
   explanation last, if at all. Leading with it answers the question before it
   is asked.
*/

import './LockedControl.css';

const LockedControl = ({
    children,
    reason = 'Only an Admin can change this.',
    showReason = true,
    reasonFirst = false,
    inline = false,
    className = '',
}) => {
    const line = showReason && (
        <p className={`lkc-reason${reasonFirst ? ' lkc-reason-lead' : ''}`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
            {reason}
        </p>
    );

    return (
        <div className={`lkc${inline ? ' lkc-inline' : ''} ${className}`}>
            {reasonFirst && line}
            <div className="lkc-control" inert>{children}</div>
            {!reasonFirst && line}
        </div>
    );
};

export default LockedControl;
