/* Breadcrumb — where this page sits, for pages only.

   Breadcrumbs belong in a page header, never in a modal. A modal is a
   moment on top of the page, not a place in the app, so it has a title and,
   when the title can't say which record is open, a subtitle (.ccm-subtitle).

   items    [{ label, onClick }]. Every item but the last is a link back up.
            The last is the current page and is not clickable.
   max      paths longer than this keep the first item and the last two, and
            fold the middle into a "…" button that expands them.

   On phones only the parent shows, as a back link ("‹ Cases"), because a
   full path wraps and pushes the title down.
*/

import { useState } from 'react';
import './Breadcrumb.css';

const Chevron = () => (
    <svg className="bc-sep" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 6 15 12 9 18"/></svg>
);

const Breadcrumb = ({ items, max = 4, className = '' }) => {
    const [open, setOpen] = useState(false);
    const folded = !open && items.length > max;
    const shown = folded
        ? [items[0], { ellipsis: true }, ...items.slice(-2)]
        : items;
    const parent = items.length > 1 ? items[items.length - 2] : null;

    return (
        <nav className={`bc ${className}`} aria-label="Breadcrumb">
            <ol className="bc-list">
                {shown.map((it, i) => {
                    const last = i === shown.length - 1;
                    return (
                        <li key={i} className="bc-item">
                            {it.ellipsis ? (
                                <button type="button" className="bc-more" onClick={() => setOpen(true)} aria-label="Show full path">…</button>
                            ) : last ? (
                                <span className="bc-current" aria-current="page">{it.label}</span>
                            ) : (
                                <button type="button" className="bc-link" onClick={it.onClick}>{it.label}</button>
                            )}
                            {!last && <Chevron />}
                        </li>
                    );
                })}
            </ol>
            {parent && (
                <button type="button" className="bc-back" onClick={parent.onClick}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
                    {parent.label}
                </button>
            )}
        </nav>
    );
};

export default Breadcrumb;
