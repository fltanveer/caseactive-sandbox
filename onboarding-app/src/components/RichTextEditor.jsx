import { useRef, useState, useEffect } from 'react';

const TEXT_COLORS = ['#0F172A', '#EF4444', '#F59E0B', '#10B981', '#149EB1', '#6366F1', '#EC4899'];
const FILL_COLORS = ['transparent', '#FEF3C7', '#DCFCE7', '#DBEAFE', '#FCE7F3', '#F3E8FF', '#FEE2E2'];
const EMOJIS = ['😀', '😂', '😍', '👍', '🙏', '🎉', '🔥', '✅', '⚠️', '❤️', '👏', '🤔', '😅', '🚀', '📌', '💡'];
const HEADINGS = [
    { value: 'P', label: 'Paragraph' },
    { value: 'H1', label: 'Heading 1' },
    { value: 'H2', label: 'Heading 2' },
    { value: 'H3', label: 'Heading 3' },
];

const ToolIcon = ({ children }) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);

export const RichTextEditor = ({ value, onChange, placeholder = 'Write something...', minHeight = 110 }) => {
    const editorRef = useRef(null);
    const wrapRef = useRef(null);
    const initialized = useRef(false);
    const [headingOpen, setHeadingOpen] = useState(false);
    const [colorOpen, setColorOpen] = useState(false);
    const [fillOpen, setFillOpen] = useState(false);
    const [emojiOpen, setEmojiOpen] = useState(false);

    useEffect(() => {
        if (!initialized.current && editorRef.current) {
            editorRef.current.innerHTML = value || '';
            initialized.current = true;
        }
    }, [value]);

    useEffect(() => {
        const handler = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) {
                setHeadingOpen(false); setColorOpen(false); setFillOpen(false); setEmojiOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const triggerChange = () => onChange && onChange(editorRef.current.innerHTML);

    const exec = (cmd, val = null) => {
        editorRef.current.focus();
        document.execCommand(cmd, false, val);
        triggerChange();
    };

    const closeAllPopovers = () => { setHeadingOpen(false); setColorOpen(false); setFillOpen(false); setEmojiOpen(false); };

    const applyHeading = (tag) => {
        editorRef.current.focus();
        document.execCommand('formatBlock', false, tag === 'P' ? 'p' : tag.toLowerCase());
        triggerChange();
        setHeadingOpen(false);
    };

    const insertCode = () => {
        const sel = window.getSelection();
        if (!sel || !sel.rangeCount || sel.isCollapsed) return;
        const range = sel.getRangeAt(0);
        const codeEl = document.createElement('code');
        codeEl.className = 'rte-code';
        codeEl.appendChild(range.extractContents());
        range.insertNode(codeEl);
        triggerChange();
    };

    const insertLink = () => {
        const url = window.prompt('Enter URL');
        if (url) exec('createLink', url);
    };

    const insertEmoji = (emoji) => {
        editorRef.current.focus();
        document.execCommand('insertText', false, emoji);
        triggerChange();
        setEmojiOpen(false);
    };

    const insertMention = () => {
        editorRef.current.focus();
        document.execCommand('insertText', false, '@');
        triggerChange();
    };

    return (
        <div className="rte-wrap" ref={wrapRef}>
            <div className="rte-toolbar">
                <button type="button" className="rte-btn" title="Bold" onClick={() => exec('bold')}>
                    <ToolIcon><path d="M6 4h8a4 4 0 0 1 0 8H6z"/><path d="M6 12h9a4 4 0 0 1 0 8H6z"/></ToolIcon>
                </button>
                <button type="button" className="rte-btn" title="Italic" onClick={() => exec('italic')}>
                    <ToolIcon><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></ToolIcon>
                </button>
                <button type="button" className="rte-btn" title="Underline" onClick={() => exec('underline')}>
                    <ToolIcon><path d="M6 3v7a6 6 0 0 0 12 0V3"/><line x1="4" y1="21" x2="20" y2="21"/></ToolIcon>
                </button>
                <button type="button" className="rte-btn" title="Strikethrough" onClick={() => exec('strikeThrough')}>
                    <ToolIcon><line x1="4" y1="12" x2="20" y2="12"/><path d="M16 6.5C15.2 5.3 13.7 4.5 12 4.5c-2.5 0-4.5 1.3-4.5 3S9.5 10.5 12 10.5"/><path d="M8 17.5c.8 1.2 2.3 2 4 2 2.5 0 4.5-1.3 4.5-3"/></ToolIcon>
                </button>

                <span className="rte-divider" />

                <button type="button" className="rte-btn" title="Code" onClick={insertCode}>
                    <ToolIcon><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></ToolIcon>
                </button>
                <button type="button" className="rte-btn" title="Quote" onClick={() => exec('formatBlock', 'blockquote')}>
                    <ToolIcon><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v4z"/></ToolIcon>
                </button>
                <button type="button" className="rte-btn" title="Numbered list" onClick={() => exec('insertOrderedList')}>
                    <ToolIcon><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></ToolIcon>
                </button>
                <button type="button" className="rte-btn" title="Bulleted list" onClick={() => exec('insertUnorderedList')}>
                    <ToolIcon><line x1="9" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="9" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1.4" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1.4" fill="currentColor" stroke="none"/></ToolIcon>
                </button>

                <div className="rte-dropdown-wrap">
                    <button type="button" className="rte-btn rte-heading-btn" onClick={() => { closeAllPopovers(); setHeadingOpen(o => !o); }}>
                        Heading
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                    </button>
                    {headingOpen && (
                        <div className="rte-popover rte-heading-menu">
                            {HEADINGS.map(h => (
                                <button type="button" key={h.value} className="rte-menu-item" onClick={() => applyHeading(h.value)}>{h.label}</button>
                            ))}
                        </div>
                    )}
                </div>

                <span className="rte-divider" />

                <button type="button" className="rte-btn" title="Link" onClick={insertLink}>
                    <ToolIcon><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></ToolIcon>
                </button>

                <div className="rte-dropdown-wrap">
                    <button type="button" className="rte-btn" title="Text color" onClick={() => { closeAllPopovers(); setColorOpen(o => !o); }}>
                        <ToolIcon><polyline points="4 20 8 9 12 20"/><line x1="5.5" y1="15" x2="10.5" y2="15"/><path d="M14 20l4-11 4 11" opacity="0"/></ToolIcon>
                    </button>
                    {colorOpen && (
                        <div className="rte-popover rte-swatch-menu">
                            {TEXT_COLORS.map(c => (
                                <button type="button" key={c} className="rte-swatch" style={{ background: c }} onClick={() => { exec('foreColor', c); setColorOpen(false); }} />
                            ))}
                        </div>
                    )}
                </div>

                <div className="rte-dropdown-wrap">
                    <button type="button" className="rte-btn" title="Highlight" onClick={() => { closeAllPopovers(); setFillOpen(o => !o); }}>
                        <ToolIcon><path d="M19 11l-8-8-8.5 8.5a2 2 0 0 0 0 2.83l5.17 5.17a2 2 0 0 0 2.83 0z"/><path d="M5 21h14"/></ToolIcon>
                    </button>
                    {fillOpen && (
                        <div className="rte-popover rte-swatch-menu">
                            {FILL_COLORS.map(c => (
                                <button type="button" key={c} className="rte-swatch" style={{ background: c === 'transparent' ? '#fff' : c, border: c === 'transparent' ? '1.5px dashed #CBD5E1' : '1px solid #E2E8F0' }} onClick={() => { exec('hiliteColor', c); setFillOpen(false); }} />
                            ))}
                        </div>
                    )}
                </div>

                <span className="rte-divider" />

                <button type="button" className="rte-btn" title="Align left" onClick={() => exec('justifyLeft')}>
                    <ToolIcon><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></ToolIcon>
                </button>
                <button type="button" className="rte-btn" title="Align center" onClick={() => exec('justifyCenter')}>
                    <ToolIcon><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></ToolIcon>
                </button>
                <button type="button" className="rte-btn" title="Align right" onClick={() => exec('justifyRight')}>
                    <ToolIcon><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/></ToolIcon>
                </button>
                <button type="button" className="rte-btn" title="Justify" onClick={() => exec('justifyFull')}>
                    <ToolIcon><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></ToolIcon>
                </button>

                <span className="rte-divider" />

                <div className="rte-dropdown-wrap">
                    <button type="button" className="rte-btn" title="Emoji" onClick={() => { closeAllPopovers(); setEmojiOpen(o => !o); }}>
                        <ToolIcon><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></ToolIcon>
                    </button>
                    {emojiOpen && (
                        <div className="rte-popover rte-emoji-menu">
                            {EMOJIS.map(e => (
                                <button type="button" key={e} className="rte-emoji-item" onClick={() => insertEmoji(e)}>{e}</button>
                            ))}
                        </div>
                    )}
                </div>
                <button type="button" className="rte-btn" title="Mention" onClick={insertMention}>
                    <ToolIcon><circle cx="12" cy="12" r="4"/><path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-5.5 8.28"/></ToolIcon>
                </button>
            </div>
            <div
                ref={editorRef}
                className="rte-editor"
                contentEditable
                suppressContentEditableWarning
                data-placeholder={placeholder}
                style={{ minHeight }}
                onInput={triggerChange}
                onBlur={triggerChange}
            />
        </div>
    );
};

export default RichTextEditor;
