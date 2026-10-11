/* The proposed design, rendered into the real screen.
 *
 * Showing the real screen with a pin on it, and the change in a panel
 * underneath, leaves the dev to assemble the result in their head. That is
 * the job this page is supposed to be doing. So a change is applied in place:
 * the real view mounts, and the proposed markup is portalled into the exact
 * spot it belongs, replacing or joining what is there.
 *
 * It is still the app's own component underneath. Nothing is forked, and the
 * Today switch takes every patch back out, so what exists now and what is
 * proposed are one toggle apart rather than one scroll apart.
 *
 * A patch cannot be applied once and forgotten. The view it lands in is live:
 * AutoOpen may still be clicking it into position, and React will replace a
 * whole subtree when a tab changes, taking the slot with it. So the slots are
 * kept in sync with the DOM rather than placed into it.
 */

import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePatched } from './patchContext';
import './Patch.css';

/* mode:
     replace  hide the target, put this where it was
     before   insert ahead of the target
     after    insert behind the target
     inside   append as the target's last child
     prepend  insert as the target's first child
     mark     leave the target alone and put `addClass` on it, or take
              `removeClass` off it

   A selector has to survive its own patch. `before` with :nth-child(1) does
   not: the slot becomes child 1, the selector stops matching the original,
   and the slot is torn out and put back on every sweep. Anchor on the parent
   with prepend, or on something the patch does not introduce. A mark is held
   by node identity for the same reason, since removing a class usually stops
   the selector that found it from matching.

   mark is for a change that is a state rather than markup: dimming a group of
   real fields keeps them the real fields, where replacing them with a drawing
   of the same fields would not. */
const place = (host, target, mode) => {
    switch (mode) {
        case 'before':
            target.parentNode.insertBefore(host, target);
            break;
        case 'inside':
            target.appendChild(host);
            break;
        case 'prepend':
            target.insertBefore(host, target.firstChild);
            break;
        case 'replace':
            target.classList.add('is-patched-out');
            target.parentNode.insertBefore(host, target.nextSibling);
            break;
        case 'mark':
            /* The host is never placed; the class on the target is the patch. */
            break;
        case 'after':
        default:
            target.parentNode.insertBefore(host, target.nextSibling);
    }
};

const unplace = (slot) => {
    if (!slot) return;
    if (slot.target?.isConnected) {
        if (slot.mode === 'replace') slot.target.classList.remove('is-patched-out');
        if (slot.addClass) slot.target.classList.remove(...slot.addClass.split(' '));
        if (slot.removeClass) slot.target.classList.add(...slot.removeClass.split(' '));
    }
    slot.host?.remove();
};

/* Every document the screen might be living in. A phone screen renders in an
   iframe so the app's media queries get a real viewport. */
const documentsIn = (frame) => {
    const roots = [frame];
    frame.querySelectorAll('iframe').forEach((f) => {
        try { if (f.contentDocument) roots.push(f.contentDocument); } catch { /* cross origin */ }
    });
    return roots;
};

export const Patch = ({ edits = [] }) => {
    const on = usePatched();
    const anchorRef = useRef(null);
    const slotsRef = useRef([]);
    const [hosts, setHosts] = useState([]);

    /* The edit list is written inline in tickets.jsx, so it is a new array on
       every render and its contents are what matter. */
    const spec = JSON.stringify(edits.map(e => [e.at, e.mode, e.as, e.pin, e.className, e.addClass, e.removeClass]));

    useLayoutEffect(() => {
        const frame = anchorRef.current?.parentElement;
        if (!frame || !on) {
            slotsRef.current.forEach(unplace);
            slotsRef.current = [];
            setHosts([]);
            return undefined;
        }

        let settling = false;
        let timer = null;

        const sync = () => {
            const roots = documentsIn(frame);
            let changed = false;

            edits.forEach((edit, i) => {
                const slot = slotsRef.current[i];

                /* A mark belongs to a node, not to a live selector. Once the
                   node is found it is held by identity until React replaces
                   it, because the mark itself usually stops the selector
                   matching: removing `active` from .hub-wizard-tab.active
                   makes the next query miss, and the class would be put back
                   and taken off again on every sweep for ever. */
                if (edit.mode === 'mark' && slot?.target?.isConnected) {
                    if (edit.addClass) slot.target.classList.add(...edit.addClass.split(' '));
                    if (edit.removeClass) slot.target.classList.remove(...edit.removeClass.split(' '));
                    return;
                }

                let target = null;
                for (const root of roots) {
                    try { target = root.querySelector(edit.at); } catch { target = null; }
                    /* A patch often contains markup that matches its own
                       selector. Landing on our own output would make the slot
                       move every sweep and never settle, so skip it. */
                    if (target?.closest('.patch-slot')) target = null;
                    if (target) break;
                }

                /* Still where we left it: the one case that does nothing.
                   A mark has no host to check, only its target. */
                const held = slot && slot.target === target
                    && (edit.mode === 'mark' ? target?.isConnected : slot.host.isConnected);
                if (held) {
                    /* React rewrites className on its own elements, so the
                       flags have to be put back after every render. */
                    if (edit.mode === 'replace' && !target.classList.contains('is-patched-out')) {
                        target.classList.add('is-patched-out');
                    }
                    if (edit.addClass) target.classList.add(...edit.addClass.split(' '));
                    if (edit.removeClass) target.classList.remove(...edit.removeClass.split(' '));
                    return;
                }

                unplace(slot);
                slotsRef.current[i] = null;
                changed = true;

                if (!target) return;
                const doc = target.ownerDocument;
                const host = doc.createElement(edit.as || 'div');
                host.className = `patch-slot${edit.className ? ` ${edit.className}` : ''}`;
                if (edit.pin) host.dataset.patchPin = edit.pin;
                if (edit.addClass) target.classList.add(...edit.addClass.split(' '));
                if (edit.removeClass) target.classList.remove(...edit.removeClass.split(' '));
                place(host, target, edit.mode);
                slotsRef.current[i] = {
                    host, target, mode: edit.mode,
                    addClass: edit.addClass, removeClass: edit.removeClass,
                };
            });

            if (!changed) return;
            setHosts(slotsRef.current.map((slot, i) => (
                slot && edits[i].mode !== 'mark'
                    ? { key: `${edits[i].at}-${i}`, host: slot.host, children: edits[i].children }
                    : null
            )).filter(Boolean));
        };

        const schedule = () => {
            if (settling) return;
            settling = true;
            timer = setTimeout(() => { settling = false; sync(); }, 24);
        };

        sync();

        /* The view keeps moving under the patch: AutoOpen is still clicking,
           a tab change swaps a whole subtree, a modal opens. Follow it. */
        const mo = new MutationObserver(schedule);
        mo.observe(frame, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });

        /* An iframe's document is a separate tree, and it does not exist yet
           when this runs, so it gets picked up on the first sweep after load. */
        const inner = setInterval(() => {
            documentsIn(frame).slice(1).forEach((d) => {
                if (d.__patchWatched) return;
                d.__patchWatched = true;
                new MutationObserver(schedule).observe(d, {
                    childList: true, subtree: true, attributes: true, attributeFilter: ['class'],
                });
                schedule();
            });
        }, 120);

        return () => {
            mo.disconnect();
            clearInterval(inner);
            clearTimeout(timer);
            slotsRef.current.forEach(unplace);
            slotsRef.current = [];
            setHosts([]);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [spec, on]);

    return (
        <>
            <span className="patch-anchor" ref={anchorRef} aria-hidden="true" />
            {hosts.map(({ key, host, children }) => createPortal(children, host, key))}
        </>
    );
};

/* A proposal that is a whole new window rather than a change to one. It
   cannot be patched into anything, so it simply is not there on Today.
   `instead` is for the rare case where today has something of its own. */
export const Proposal = ({ children, instead = null }) => (usePatched() ? children : instead);

/* Wraps the part of a patch the ticket is actually about. It draws nothing
   and takes no space: it is there so the markup says which bit is new to
   anyone reading the file. Pass className="is-box" on the rare occasion the
   patch needs a box of its own. */
export const New = ({ children, className = '' }) => (
    <span className={`patch-new ${className}`}>{children}</span>
);

export default Patch;
