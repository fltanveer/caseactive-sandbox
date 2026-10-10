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
        const next = [];
        pins.forEach((p) => {
            let el = null;
            try {
                el = frame.querySelector(p.at);
            } catch {
                /* A selector typo should not take the page down; the pin is
                   reported as unmatched in the rail instead. */
                el = null;
            }
            if (!el) return;
            const r = el.getBoundingClientRect();
            if (!r.width && !r.height) return;
            next.push({
                ...p,
                box: {
                    left: r.left - origin.left,
                    top: r.top - origin.top,
                    right: r.right - origin.left,
                    bottom: r.bottom - origin.top,
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

        /* Any scroller inside the shell moves targets without resizing them. */
        const onScroll = () => measure();
        frame.addEventListener('scroll', onScroll, true);
        window.addEventListener('resize', onScroll);

        return () => {
            ro.disconnect();
            clearTimeout(t);
            frame.removeEventListener('scroll', onScroll, true);
            window.removeEventListener('resize', onScroll);
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
