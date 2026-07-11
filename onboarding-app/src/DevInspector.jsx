import { useState, useEffect, useRef, useCallback } from 'react';

const CSS_PROPS = [
    'display', 'position', 'width', 'height', 'min-width', 'max-width', 'min-height', 'max-height',
    'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
    'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
    'color', 'background-color', 'font-size', 'font-weight', 'font-family', 'line-height',
    'letter-spacing', 'text-align', 'text-decoration', 'text-transform',
    'border', 'border-radius', 'border-color', 'border-width', 'border-style',
    'box-shadow', 'opacity', 'z-index', 'overflow', 'overflow-x', 'overflow-y',
    'transform', 'transition', 'cursor', 'pointer-events',
    'flex', 'flex-direction', 'flex-wrap', 'align-items', 'align-self', 'justify-content', 'gap',
    'grid-template-columns', 'grid-template-rows',
    'top', 'right', 'bottom', 'left',
    'white-space', 'word-break', 'vertical-align',
];

const SKIP_VALS = new Set(['none', 'normal', 'auto', '0px', 'rgba(0, 0, 0, 0)', 'initial', '', '0', 'static', 'visible', 'inline']);

const rgbToHex = (val) =>
    val.replace(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/g, (_, r, g, b) =>
        '#' + [r, g, b].map(n => parseInt(n).toString(16).padStart(2, '0')).join('')
    );

const formatHTML = (html) => {
    const lines = [];
    let indent = 0;
    html.replace(/></g, '>\n<').split('\n').forEach(line => {
        const closing = line.match(/^<\//);
        const selfClose = line.match(/\/>$/) || line.match(/<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)[^>]*>/i);
        if (closing) indent = Math.max(0, indent - 1);
        lines.push('  '.repeat(indent) + line);
        if (!closing && !selfClose && line.match(/^<[^!?/]/)) indent++;
    });
    return lines.join('\n');
};

const VOID_TAGS = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);

const formatAngular = (el, depth = 0) => {
    if (el.nodeType === Node.TEXT_NODE) {
        const t = el.textContent.trim();
        return t ? '  '.repeat(depth) + t : '';
    }
    if (el.nodeType !== Node.ELEMENT_NODE) return '';

    const tag = el.tagName.toLowerCase();
    const pad = '  '.repeat(depth);
    const attrs = [];

    for (const { name, value } of el.attributes) {
        if (name.startsWith('on')) {
            attrs.push(`(${name.slice(2)})="${value || '$event'}"`);
        } else if (name === 'class') {
            attrs.push(`[class]="'${value}'"`);
        } else if (name === 'style') {
            attrs.push(`[ngStyle]="{ ${value.replace(/:\s*/g,': ').replace(/;\s*/g, ', ').replace(/,\s*$/,'')} }"`);
        } else if (name.startsWith('data-')) {
            attrs.push(`[attr.${name}]="'${value}'"`);
        } else if (name.startsWith('aria-')) {
            attrs.push(`[attr.${name}]="'${value}'"`);
        } else {
            attrs.push(value ? `${name}="${value}"` : name);
        }
    }

    const attrBlock = attrs.length > 2
        ? '\n' + attrs.map(a => `${pad}  ${a}`).join('\n') + '\n' + pad
        : attrs.length ? ' ' + attrs.join(' ') : '';

    if (VOID_TAGS.has(tag)) return `${pad}<${tag}${attrBlock} />`;

    const lines = [`${pad}<${tag}${attrBlock}>`];
    for (const child of el.childNodes) {
        const s = formatAngular(child, depth + 1);
        if (s) lines.push(s);
    }
    lines.push(`${pad}</${tag}>`);
    return lines.join('\n');
};

const elSelector = (el) => {
    if (!el) return '';
    let s = el.tagName.toLowerCase();
    if (el.id) s += `#${el.id}`;
    if (el.className && typeof el.className === 'string' && el.className.trim()) {
        s += '.' + el.className.trim().split(/\s+/).join('.');
    }
    return s;
};

const primaryClass = (el) => {
    if (!el) return null;
    if (el.className && typeof el.className === 'string' && el.className.trim()) {
        return '.' + el.className.trim().split(/\s+/)[0];
    }
    if (el.id) return `#${el.id}`;
    return el.tagName.toLowerCase();
};

const DevInspector = () => {
    const [active, setActive] = useState(false);
    const [target, setTarget] = useState(null);
    const [hoverSel, setHoverSel] = useState('');
    const [tab, setTab] = useState('css');
    const [copied, setCopied] = useState(false);
    const panelRef = useRef(null);
    const hlRef = useRef(null);
    const hlLabelRef = useRef(null);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') setActive(false);
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, []);

    useEffect(() => {
        if (!active) {
            setTarget(null);
            setHoverSel('');
            if (hlRef.current) hlRef.current.style.display = 'none';
            if (hlLabelRef.current) hlLabelRef.current.style.display = 'none';
            document.body.style.cursor = '';
            return;
        }
        document.body.style.cursor = 'crosshair';

        const onOver = (e) => {
            if (panelRef.current?.contains(e.target)) return;
            const r = e.target.getBoundingClientRect();
            const hl = hlRef.current;
            const lbl = hlLabelRef.current;
            if (hl) {
                hl.style.display = 'block';
                hl.style.top = `${r.top}px`;
                hl.style.left = `${r.left}px`;
                hl.style.width = `${r.width}px`;
                hl.style.height = `${r.height}px`;
            }
            if (lbl) {
                const sel = elSelector(e.target);
                lbl.textContent = sel;
                lbl.style.display = 'block';
                const lblTop = r.top - 24 < 4 ? r.top + r.height + 4 : r.top - 24;
                lbl.style.top = `${lblTop}px`;
                lbl.style.left = `${Math.min(r.left, window.innerWidth - 260)}px`;
            }
            setHoverSel(elSelector(e.target));
        };

        const onClick = (e) => {
            if (panelRef.current?.contains(e.target)) return;
            e.preventDefault();
            e.stopPropagation();
            setTarget(e.target);
            setTab('css');
        };

        document.addEventListener('mouseover', onOver, true);
        document.addEventListener('click', onClick, true);
        return () => {
            document.removeEventListener('mouseover', onOver, true);
            document.removeEventListener('click', onClick, true);
            document.body.style.cursor = '';
            if (hlRef.current) hlRef.current.style.display = 'none';
            if (hlLabelRef.current) hlLabelRef.current.style.display = 'none';
        };
    }, [active]);

    const getElProps = (el) => {
        const computed = window.getComputedStyle(el);
        const lines = [];
        for (const prop of CSS_PROPS) {
            const val = computed.getPropertyValue(prop);
            if (val && !SKIP_VALS.has(val)) lines.push([prop, val]);
        }
        return lines;
    };

    const getProps = useCallback(() => {
        if (!target) return [];
        return getElProps(target);
    }, [target]);

    const cssText = useCallback(() => {
        const props = getProps();
        if (!props.length) return '/* no notable styles */';
        const sel = primaryClass(target);
        const body = props.map(([p, v]) => `  ${p}: ${v};`).join('\n');
        return `${sel} {\n${body}\n}`;
    }, [target, getProps]);

    const buildScss = (el, depth = 0, maxDepth = 3) => {
        const props = getElProps(el);
        const children = Array.from(el.children).slice(0, 6);
        if (!props.length && !children.length) return '';
        const sel = depth === 0 ? primaryClass(el) : primaryClass(el);
        const pad = '  '.repeat(depth);
        const lines = [`${pad}${sel} {`];
        for (const [p, v] of props) {
            lines.push(`${pad}  ${p}: ${rgbToHex(v)};`);
        }
        if (depth < maxDepth) {
            for (const child of children) {
                const nested = buildScss(child, depth + 1, maxDepth);
                if (nested) {
                    if (props.length) lines.push('');
                    lines.push(nested);
                }
            }
        }
        lines.push(`${pad}}`);
        return lines.join('\n');
    };

    const scssText = useCallback(() => {
        if (!target) return '/* no notable styles */';
        const result = buildScss(target);
        return result || '/* no notable styles */';
    }, [target]);

    const htmlText = useCallback(() => {
        if (!target) return '';
        try { return formatHTML(target.outerHTML); } catch { return target.outerHTML; }
    }, [target]);

    const angularText = useCallback(() => {
        if (!target) return '';
        try { return formatAngular(target); } catch (e) { return `/* error: ${e.message} */`; }
    }, [target]);

    const getTabText = () => {
        if (tab === 'css') return cssText();
        if (tab === 'scss') return scssText();
        if (tab === 'angular') return angularText();
        return htmlText();
    };

    return (
        <>
            {/* Hover highlight */}
            <div
                ref={hlRef}
                style={{
                    display: 'none',
                    position: 'fixed',
                    pointerEvents: 'none',
                    background: 'rgba(59,130,246,0.12)',
                    border: '2px solid rgba(59,130,246,0.55)',
                    outline: '1px solid rgba(255,255,255,0.5)',
                    zIndex: 999997,
                    boxSizing: 'border-box',
                    transition: 'all 0.05s',
                }}
            />

            {/* Hover label */}
            <div
                ref={hlLabelRef}
                style={{
                    display: 'none',
                    position: 'fixed',
                    pointerEvents: 'none',
                    zIndex: 999998,
                    background: '#1e293b',
                    color: '#7dd3fc',
                    fontSize: '11px',
                    fontFamily: '"SF Mono", "Fira Code", monospace',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    whiteSpace: 'nowrap',
                    maxWidth: '260px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                }}
            />

            {/* Toggle button */}
            <button
                onClick={() => setActive(a => !a)}
                title={active ? 'Disable inspector' : 'Enable inspector'}
                style={{
                    position: 'fixed',
                    bottom: '80px',
                    right: '24px',
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: active ? '#1e293b' : '#fff',
                    border: '1px solid ' + (active ? '#1e293b' : '#e5e7eb'),
                    boxShadow: '0 2px 12px rgba(0,0,0,0.14)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 999999,
                    color: active ? '#fff' : '#149EB1',
                    transition: 'background 0.15s, color 0.15s',
                }}
            >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4l7.07 17 2.51-7.39L21 11.07z"/>
                </svg>
            </button>

            {/* Active selector pill */}
            {active && !target && hoverSel && (
                <div style={{
                    position: 'fixed',
                    bottom: '138px',
                    right: '24px',
                    background: '#1e293b',
                    color: '#7dd3fc',
                    fontSize: '11px',
                    fontFamily: '"SF Mono", "Fira Code", monospace',
                    padding: '5px 12px',
                    borderRadius: '8px',
                    zIndex: 999998,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                    pointerEvents: 'none',
                    maxWidth: '300px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}>
                    {hoverSel}
                </div>
            )}

            {/* Panel */}
            {target && (
                <div
                    ref={panelRef}
                    style={{
                        position: 'fixed',
                        bottom: '138px',
                        right: '24px',
                        width: '460px',
                        maxHeight: '62vh',
                        background: '#fff',
                        borderRadius: '14px',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
                        zIndex: 999998,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        fontFamily: 'system-ui, sans-serif',
                    }}
                >
                    {/* Header */}
                    <div style={{ padding: '12px 14px 0', borderBottom: '1px solid #f3f4f6' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <code style={{
                                fontSize: '11px', color: '#6b7280',
                                background: '#f9fafb', padding: '3px 8px',
                                borderRadius: '5px', border: '1px solid #e5e7eb',
                                maxWidth: '360px', overflow: 'hidden',
                                textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                display: 'block',
                            }}>
                                {elSelector(target)}
                            </code>
                            <button
                                onClick={() => setTarget(null)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '2px', flexShrink: 0 }}
                            >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex' }}>
                                {[['css', 'CSS'], ['scss', 'SCSS'], ['structure', 'Structure'], ['angular', 'Angular']].map(([val, label]) => (
                                    <button
                                        key={val}
                                        onClick={() => { setTab(val); setCopied(false); }}
                                        style={{
                                            background: 'none', border: 'none', cursor: 'pointer',
                                            padding: '6px 14px 10px',
                                            fontSize: '13px',
                                            fontWeight: tab === val ? '600' : '400',
                                            color: tab === val ? '#149EB1' : '#6b7280',
                                            borderBottom: tab === val ? '2px solid #149EB1' : '2px solid transparent',
                                            marginBottom: '-1px',
                                        }}
                                    >{label}</button>
                                ))}
                            </div>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(getTabText()).then(() => {
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 1800);
                                    });
                                }}
                                style={{
                                    background: 'none', border: '1px solid #e5e7eb',
                                    borderRadius: '5px', cursor: 'pointer',
                                    padding: '3px 10px', fontSize: '11px',
                                    color: copied ? '#16a34a' : '#6b7280',
                                    display: 'flex', alignItems: 'center', gap: '4px',
                                    marginBottom: '6px', transition: 'color 0.15s',
                                }}
                            >
                                {copied ? (
                                    <>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                        Copied
                                    </>
                                ) : (
                                    <>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                                        Copy
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Exit hint */}
                    <div style={{ padding: '8px 16px', background: '#fef3c7', borderBottom: '1px solid #fde68a', display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', color: '#92400e', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <kbd style={{ background: '#fff', borderRadius: '4px', padding: '2px 7px', fontSize: '11px', fontFamily: 'monospace', color: '#b45309', border: '1px solid #f59e0b', fontWeight: '700', boxShadow: '0 1px 0 #f59e0b' }}>Esc</kbd>
                            exit inspector
                        </span>
                        <span style={{ color: '#d97706', fontSize: '12px' }}>·</span>
                        <span style={{ fontSize: '12px', color: '#92400e', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <kbd style={{ background: '#fff', borderRadius: '4px', padding: '2px 7px', fontSize: '11px', fontFamily: 'monospace', color: '#b45309', border: '1px solid #f59e0b', fontWeight: '700', boxShadow: '0 1px 0 #f59e0b' }}>Click</kbd>
                            cursor icon to toggle
                        </span>
                    </div>

                    {/* Body */}
                    <div style={{ flex: 1, overflow: 'auto', padding: '14px 16px' }}>
                        <pre style={{
                            margin: 0, fontSize: '11.5px',
                            fontFamily: '"SF Mono", "Fira Code", monospace',
                            lineHeight: '1.75', whiteSpace: 'pre-wrap',
                            wordBreak: 'break-all', color: '#1f2937',
                        }}>
                            {getTabText()}
                        </pre>
                    </div>
                </div>
            )}
        </>
    );
};

export default DevInspector;
