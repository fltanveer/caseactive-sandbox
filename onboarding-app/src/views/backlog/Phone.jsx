/* A phone screen that is actually a phone screen.
 *
 * The app's responsive rules are viewport media queries. A 390px-wide box
 * inside a 1920px window is not a 390px viewport, so the desktop layout just
 * gets squeezed and the phone design under review is not the phone design at
 * all. An iframe has its own viewport, so the real rules fire: the cases
 * table becomes cards, the sidebar becomes a drawer, the hub bar appears.
 *
 * The screen is rendered into that iframe with a portal, so it is still one
 * React tree and the pin layer still measures it.
 */

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './Phone.css';

/* Vite serves styles as <style> in dev and <link> in a build, and adds more
   as lazily imported modules arrive, so the iframe mirrors whatever the host
   document has and keeps watching. */
const useMirroredStyles = (doc) => {
    useEffect(() => {
        if (!doc) return undefined;

        const copy = () => {
            const want = [...document.querySelectorAll('style, link[rel="stylesheet"]')];
            const have = new Set([...doc.head.querySelectorAll('[data-mirrored]')].map(n => n.dataset.mirrored));
            want.forEach((node, i) => {
                const key = `${node.tagName}-${i}-${node.getAttribute('href') || node.textContent.length}`;
                if (have.has(key)) return;
                const clone = node.cloneNode(true);
                clone.dataset.mirrored = key;
                doc.head.appendChild(clone);
            });
        };

        copy();
        const mo = new MutationObserver(copy);
        mo.observe(document.head, { childList: true, subtree: true });
        return () => mo.disconnect();
    }, [doc]);
};

export const Phone = ({ width = 390, height = 760, children }) => {
    const frameRef = useRef(null);
    const [doc, setDoc] = useState(null);

    const attach = () => {
        const d = frameRef.current?.contentDocument;
        if (!d) return;
        d.documentElement.style.height = '100%';
        d.body.style.cssText = 'margin:0;height:100%;background:#F1F5F9;';
        let mount = d.getElementById('phone-root');
        if (!mount) {
            mount = d.createElement('div');
            mount.id = 'phone-root';
            mount.style.cssText = 'height:100%;';
            d.body.appendChild(mount);
        }
        setDoc(d);
    };

    useEffect(attach, []);
    useMirroredStyles(doc);

    const mount = doc?.getElementById('phone-root');

    return (
        <div className="phone" style={{ width: width + 16 }}>
            <iframe
                ref={frameRef}
                onLoad={attach}
                title="Phone preview"
                className="phone-frame"
                style={{ width, height }}
            />
            {mount && createPortal(
                <div className="phone-screen" style={{ height }}>{children}</div>,
                mount,
            )}
        </div>
    );
};

export default Phone;
