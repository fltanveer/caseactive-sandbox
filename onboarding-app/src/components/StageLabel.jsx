import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './StageLabel.css';

const canHover = () => typeof window !== 'undefined' && window.matchMedia?.('(hover: hover) and (pointer: fine)').matches;

/* A stage name that reveals its description: on hover with a mouse, on tap
   with touch. The popover is portalled with fixed positioning so tables with
   overflow scrolling never clip it.
   variant: 'chip' (client header pill) | 'text' (plain table cell text). */
const StageLabel = ({ stage, variant = 'chip', className = '' }) => {
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState(null);
    const triggerRef = useRef(null);
    const popRef = useRef(null);
    const hasDesc = Boolean(stage?.description?.trim());

    useLayoutEffect(() => {
        if (!open || !triggerRef.current || !popRef.current) return;
        const r = triggerRef.current.getBoundingClientRect();
        const p = popRef.current.getBoundingClientRect();
        const margin = 12;
        let left = r.left + r.width / 2 - p.width / 2;
        left = Math.max(margin, Math.min(left, window.innerWidth - p.width - margin));
        const below = r.bottom + 8;
        const flip = below + p.height > window.innerHeight - margin;
        setPos({
            left,
            top: flip ? r.top - p.height - 8 : below,
            arrow: r.left + r.width / 2 - left,
            flip,
        });
    }, [open]);

    useEffect(() => {
        if (!open) return undefined;
        const close = (e) => {
            if (triggerRef.current?.contains(e.target) || popRef.current?.contains(e.target)) return;
            setOpen(false);
            setPos(null);
        };
        const onKey = (e) => { if (e.key === 'Escape') { setOpen(false); setPos(null); } };
        const onScroll = () => { setOpen(false); setPos(null); };
        document.addEventListener('pointerdown', close);
        document.addEventListener('keydown', onKey);
        window.addEventListener('scroll', onScroll, true);
        window.addEventListener('resize', onScroll);
        return () => {
            document.removeEventListener('pointerdown', close);
            document.removeEventListener('keydown', onKey);
            window.removeEventListener('scroll', onScroll, true);
            window.removeEventListener('resize', onScroll);
        };
    }, [open]);

    if (!stage) return null;

    const show = () => setOpen(true);
    const hide = () => { setOpen(false); setPos(null); };

    // Just the name: no status dot, no info icon. The chip itself is the
    // hover/tap target for the description.
    const label = <span className="stage-label-name">{stage.name}</span>;

    if (!hasDesc) {
        return <span className={`stage-label stage-label--${variant} ${className}`}>{label}</span>;
    }

    return (
        <>
            <button
                type="button"
                ref={triggerRef}
                className={`stage-label stage-label--${variant} is-interactive${open ? ' is-open' : ''} ${className}`}
                aria-expanded={open}
                aria-label={`Stage: ${stage.name}. Show what this stage means`}
                onMouseEnter={() => canHover() && show()}
                onMouseLeave={() => canHover() && hide()}
                onFocus={() => canHover() && show()}
                onBlur={() => canHover() && hide()}
                onClick={(e) => { e.stopPropagation(); if (!canHover()) (open ? hide() : show()); }}
            >
                {label}
            </button>
            {open && createPortal(
                <div
                    ref={popRef}
                    role="tooltip"
                    className={`stage-pop${pos?.flip ? ' is-flipped' : ''}`}
                    style={pos ? { left: pos.left, top: pos.top, '--arrow-x': `${pos.arrow}px` } : { left: -9999, top: 0, visibility: 'hidden' }}
                >
                    <div className="stage-pop-eyebrow">Case stage</div>
                    <div className="stage-pop-title">{stage.name}</div>
                    <p className="stage-pop-desc">{stage.description}</p>
                </div>,
                document.body,
            )}
        </>
    );
};

export default StageLabel;
