/* Pins that find their target by selector.
 *
 * The old pins wrapped the markup they pointed at, which only works when the
 * markup is ours. Now that a screen mounts the app's real view component,
 * there is nothing to wrap: a pin has to go and find .as-table th:nth-child(5)
 * inside a component this page does not own. So a pin is declared as a
 * selector and positioned over whatever it matches, re-measured whenever the
 * frame scrolls or resizes.
 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import './Pins.css';

/* Where a pin sits relative to its target. */
const PLACES = {
    tr: (b) => ({ left: b.right, top: b.top }),
    tl: (b) => ({ left: b.left, top: b.top }),
    br: (b) => ({ left: b.right, top: b.bottom }),
    bl: (b) => ({ left: b.left, top: b.bottom }),
};

export const PinLayer = ({ pins = [] }) => {
    /* The pin list is written inline in tickets.jsx, so it is a fresh array on
       every render. Its contents are what matter, so they are the dependency. */
    const spec = JSON.stringify(pins.map(p => [p.n, p.at, p.place, p.ring, p.label]));
    const hostRef = useRef(null);
    const [boxes, setBoxes] = useState([]);
    /* Measuring sets state, and a layout effect runs after every render, so
       the two have to agree on when nothing moved or they loop forever. */
    const lastRef = useRef('');

    const measure = useCallback(() => {
        const host = hostRef.current;
        if (!host) return;
        const frame = host.parentElement;
        if (!frame) return;
        const origin = frame.getBoundingClientRect();

        /* A phone screen renders in an iframe so the app's media queries get a
           real viewport, which puts its markup in another document. Pins have
           to look there too, and their coordinates are relative to that
           document, so the iframe's own position is added back. */
        const scopes = [{ root: frame, dx: 0, dy: 0 }];
        frame.querySelectorAll('iframe').forEach((f) => {
            let inner = null;
            try { inner = f.contentDocument; } catch { inner = null; }
            if (!inner) return;
            const fr = f.getBoundingClientRect();
            scopes.push({ root: inner, dx: fr.left - origin.left, dy: fr.top - origin.top });
        });

        const find = (sel) => {
            for (const scope of scopes) {
                let el = null;
                try {
                    el = scope.root.querySelector(sel);
                } catch {
                    /* A selector typo should not take the page down; the pin is
                       reported as unmatched in the rail instead. */
                    return null;
                }
                if (el) return { el, scope };
            }
            return null;
        };

        const next = [];
        pins.forEach((p) => {
            const hit = find(p.at);
            if (!hit) return;
            const { el, scope } = hit;
            const r = el.getBoundingClientRect();
            if (!r.width && !r.height) return;
            /* An element scrolled out of its own frame should not leave a pin
               floating over the chrome. */
            const left = (scope.root === frame ? r.left - origin.left : r.left + scope.dx);
            const top = (scope.root === frame ? r.top - origin.top : r.top + scope.dy);
            next.push({
                ...p,
                box: {
                    left,
                    top,
                    right: left + r.width,
                    bottom: top + r.height,
                    width: r.width,
                    height: r.height,
                },
            });
        });
        const sig = JSON.stringify(next.map(b => [b.n, b.at, b.box]));
        if (sig === lastRef.current) return;
        lastRef.current = sig;
        setBoxes(next);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [spec]);

    useLayoutEffect(measure, [measure]);

    useEffect(() => {
        const host = hostRef.current;
        const frame = host?.parentElement;
        if (!frame) return undefined;

        const ro = new ResizeObserver(measure);
        ro.observe(frame);
        /* Mounted views lay out over a tick or two (fonts, images, their own
           effects), so settle once more shortly after mount. */
        const t = setTimeout(measure, 120);

        /* Any scroller inside the shell moves targets without resizing them,
           and a phone screen's scroller lives in its own document. */
        const onScroll = () => measure();
        frame.addEventListener('scroll', onScroll, true);
        window.addEventListener('resize', onScroll);
        const inners = [...frame.querySelectorAll('iframe')]
            .map(f => { try { return f.contentDocument; } catch { return null; } })
            .filter(Boolean);
        inners.forEach(d => d.addEventListener('scroll', onScroll, true));

        return () => {
            ro.disconnect();
            clearTimeout(t);
            frame.removeEventListener('scroll', onScroll, true);
            window.removeEventListener('resize', onScroll);
            inners.forEach(d => d.removeEventListener('scroll', onScroll, true));
        };
    }, [measure]);

    return (
        <div className="pinlayer" ref={hostRef} aria-hidden="true">
            {boxes.map(({ n, label, place = 'tr', box, ring = true }, i) => {
                const spot = (PLACES[place] || PLACES.tr)(box);
                return (
                    <span key={`${n}-${i}`} className="pinlayer-group">
                        {ring && (
                            <span
                                className="pinlayer-ring"
                                data-pin={n}
                                style={{ left: box.left, top: box.top, width: box.width, height: box.height }}
                            />
                        )}
                        <span className="sh-pin pinlayer-pin" data-pin={n} title={label} style={{ left: spot.left, top: spot.top }}>{n}</span>
                    </span>
                );
            })}
        </div>
    );
};

export default PinLayer;
