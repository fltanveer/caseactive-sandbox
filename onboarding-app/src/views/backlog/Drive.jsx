/* Driving a real view into the state a ticket is about.
 *
 * The screens here mount the app's own components, which keep their state
 * privately: UsersView decides when the Edit User modal is open, EventsView
 * decides which tab is showing. There is no prop for it and adding one to
 * every view to serve this page would be the tail wagging the dog. So a
 * screen says which controls to click after mount and this clicks them, the
 * way a person would, and the view arrives at the state honestly.
 */

import { useEffect, useRef, useState } from 'react';
import './Drive.css';

/* clicks: a list of selectors, clicked in order, each one waited for. */
export const AutoOpen = ({ clicks = [], children }) => {
    const ref = useRef(null);
    const [missed, setMissed] = useState(null);

    useEffect(() => {
        const root = ref.current;
        if (!root || !clicks.length) return undefined;

        let i = 0;
        let timer = null;
        let tries = 0;

        const step = () => {
            if (i >= clicks.length) return;
            const sel = clicks[i];
            let el = null;
            try {
                el = root.querySelector(sel);
            } catch {
                setMissed(sel);
                return;
            }
            if (el) {
                el.click();
                i += 1;
                tries = 0;
                timer = setTimeout(step, 30);
                return;
            }
            /* The view may still be laying out, so wait a few frames before
               deciding the control is genuinely not there. */
            tries += 1;
            if (tries > 25) {
                setMissed(sel);
                return;
            }
            timer = setTimeout(step, 40);
        };

        timer = setTimeout(step, 40);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clicks.join('|')]);

    return (
        <div className="drive" ref={ref}>
            {missed && (
                <p className="drive-missed">
                    This screen opens itself by clicking <code>{missed}</code>, which is no longer
                    in the view. The selector needs updating in tickets.jsx.
                </p>
            )}
            {children}
        </div>
    );
};

export default AutoOpen;
