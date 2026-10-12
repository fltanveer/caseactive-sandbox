/* ToneIcon — the one icon per tone, shared by field messages, notices and
   confirm modals so an error always carries the same mark wherever it shows.

   error   circle with a bang — something is wrong and blocks you
   warning triangle           — allowed, but read this first
   success circle with tick   — done
   info    circle with an i   — worth knowing, nothing to fix
   neutral circle with an i, drawn in grey
*/

const PATHS = {
    error: (
        <><circle cx="12" cy="12" r="9.5"/><line x1="12" y1="7.5" x2="12" y2="13"/><line x1="12" y1="16.5" x2="12.01" y2="16.5"/></>
    ),
    warning: (
        <><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>
    ),
    success: (
        <><circle cx="12" cy="12" r="9.5"/><polyline points="8 12.5 11 15.5 16.5 9.5"/></>
    ),
    info: (
        <><circle cx="12" cy="12" r="9.5"/><line x1="12" y1="16" x2="12" y2="11"/><line x1="12" y1="7.5" x2="12.01" y2="7.5"/></>
    ),
};

const ToneIcon = ({ tone = 'info', size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {PATHS[tone] ?? PATHS.info}
    </svg>
);

export default ToneIcon;
