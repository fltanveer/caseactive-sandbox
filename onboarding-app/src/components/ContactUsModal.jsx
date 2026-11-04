/* ContactUsModal — Support Center → Contact Us.

   Keeps everything the live "Leave us a message" panel has: first and last
   name and email filled in from the signed-in person, Topic, Impact,
   Description, Attachments, and Send, which stays off until every
   required field has something in it.
   Drawn in the app's own modal (.ccm) instead of a side panel, with a
   sending state and a "Message sent" confirmation that says where the
   reply will go. */

import { useEffect, useRef, useState } from 'react';
import SearchableSelect from './SearchableSelect';
import './Button.css';
import './ContactUsModal.css';

const TOPICS = ['Question about a feature', 'Something isn’t working', 'Billing and plan', 'Account and sign-in', 'Feature request', 'Something else'];
const IMPACTS = [
    ['low', 'Low · a small issue'],
    ['medium', 'Medium · slows me down'],
    ['high', 'High · I’m blocked'],
    ['urgent', 'Urgent · clients affected'],
];
const MAX_FILES = 5;
const MAX_MB = 10;

const Close = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

const ContactUsModal = ({ user, onClose }) => {
    const [first, setFirst] = useState(user.firstName);
    const [last, setLast] = useState(user.lastName);
    const [email, setEmail] = useState(user.email);
    const [topic, setTopic] = useState('');
    const [impact, setImpact] = useState('');
    const [text, setText] = useState('');
    const [files, setFiles] = useState([]);
    const [fileError, setFileError] = useState('');
    const [state, setState] = useState('form'); // form | sending | sent
    const fileRef = useRef(null);
    const timer = useRef(null);

    useEffect(() => {
        const onKey = e => { if (e.key === 'Escape' && state !== 'sending') onClose(); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [onClose, state]);
    useEffect(() => () => clearTimeout(timer.current), []);

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    const ready = first.trim() && last.trim() && emailOk && topic && impact && text.trim();

    const pick = (e) => {
        const picked = [...e.target.files];
        e.target.value = '';
        const tooBig = picked.filter(f => f.size > MAX_MB * 1024 * 1024);
        const ok = picked.filter(f => f.size <= MAX_MB * 1024 * 1024);
        const next = [...files, ...ok.map(f => ({ name: f.name, size: f.size }))];
        if (tooBig.length) setFileError(`${tooBig[0].name} is over ${MAX_MB} MB, so it wasn’t added.`);
        else if (next.length > MAX_FILES) setFileError(`Up to ${MAX_FILES} files. The rest weren’t added.`);
        else setFileError('');
        setFiles(next.slice(0, MAX_FILES));
    };

    const send = () => {
        if (!ready) return;
        setState('sending');
        timer.current = setTimeout(() => setState('sent'), 1100);
    };

    const sizeLabel = (b) => (b >= 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

    return (
        <div className="modal-overlay cu-overlay" onClick={() => state !== 'sending' && onClose()}>
            <div className="ccm cu-modal" role="dialog" aria-modal="true" aria-labelledby="cu-title" onClick={e => e.stopPropagation()}>
                <div className="ccm-header cu-header">
                    <div>
                        <h2 className="ccm-title" id="cu-title">{state === 'sent' ? 'Message sent' : 'Contact us'}</h2>
                        {state !== 'sent' && <p className="ccm-subtitle">Tell us what&apos;s going on. We usually reply in under 2 hours.</p>}
                    </div>
                    <button type="button" className="ccm-close" onClick={onClose} aria-label="Close" disabled={state === 'sending'}><Close /></button>
                </div>

                {state === 'sent' ? (
                    <>
                        <div className="ccm-body cu-sent" role="status">
                            <span className="cu-sent-ic" aria-hidden="true">
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            </span>
                            <p className="cu-sent-title">Thanks, {first.trim()}. We have your message.</p>
                            <p className="cu-sent-text">We&apos;ll reply to <strong>{email.trim()}</strong>, usually in under 2 hours.</p>
                            <dl className="cu-sent-sum">
                                <div><dt>Topic</dt><dd>{topic}</dd></div>
                                <div><dt>Impact</dt><dd>{IMPACTS.find(i => i[0] === impact)?.[1].split(' · ')[0]}</dd></div>
                                {files.length > 0 && <div><dt>Attachments</dt><dd>{files.length} {files.length === 1 ? 'file' : 'files'}</dd></div>}
                            </dl>
                        </div>
                        <div className="ccm-footer">
                            <button type="button" className="imp-save-btn" onClick={onClose}>Done</button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="ccm-body cu-body">
                            <div className="ccm-grid-2 cu-names">
                                <div className="ccm-field">
                                    <label className="ccm-label" htmlFor="cu-first">First name <span className="ccm-req">*</span></label>
                                    <input id="cu-first" className="ccm-input" value={first} onChange={e => setFirst(e.target.value)} autoComplete="given-name" />
                                </div>
                                <div className="ccm-field">
                                    <label className="ccm-label" htmlFor="cu-last">Last name <span className="ccm-req">*</span></label>
                                    <input id="cu-last" className="ccm-input" value={last} onChange={e => setLast(e.target.value)} autoComplete="family-name" />
                                </div>
                            </div>
                            <div className="ccm-field">
                                <label className="ccm-label" htmlFor="cu-email">Email <span className="ccm-req">*</span></label>
                                <input id="cu-email" type="email" className={`ccm-input${email && !emailOk ? ' cu-invalid' : ''}`} value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
                                {email && !emailOk
                                    ? <span className="cu-error">Enter an email address like name@firm.com.</span>
                                    : <span className="ccm-hint">We&apos;ll reply here.</span>}
                            </div>
                            <div className="ccm-grid-2 cu-names">
                                <div className="ccm-field">
                                    <label className="ccm-label" htmlFor="cu-topic">Topic <span className="ccm-req">*</span></label>
                                    <SearchableSelect id="cu-topic" className="cu-select" value={topic} onChange={e => setTopic(e.target.value)} placeholder="Choose a topic">
                                        {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                                    </SearchableSelect>
                                </div>
                                <div className="ccm-field">
                                    <label className="ccm-label" htmlFor="cu-impact">Impact <span className="ccm-req">*</span></label>
                                    <SearchableSelect id="cu-impact" className="cu-select" value={impact} onChange={e => setImpact(e.target.value)} placeholder="How much it affects you">
                                        {IMPACTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                                    </SearchableSelect>
                                </div>
                            </div>
                            <div className="ccm-field">
                                <label className="ccm-label" htmlFor="cu-text">Description <span className="ccm-req">*</span></label>
                                <textarea id="cu-text" className="ccm-input ccm-textarea cu-text" rows={5} value={text} onChange={e => setText(e.target.value)}
                                    placeholder="What happened, where in CaseActive, and what you expected instead." />
                            </div>
                            <div className="ccm-field">
                                <span className="ccm-label">Attachments <span className="cu-optional">(optional)</span></span>
                                <button type="button" className="ltm-drop cu-drop" onClick={() => fileRef.current?.click()} disabled={files.length >= MAX_FILES}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                                    <span>Choose files <span className="cu-drop-hint">Screenshots help. Up to {MAX_FILES} files, {MAX_MB} MB each.</span></span>
                                </button>
                                <input ref={fileRef} type="file" multiple hidden onChange={pick} />
                                {fileError && <span className="cu-error">{fileError}</span>}
                                {files.length > 0 && (
                                    <ul className="cu-files">
                                        {files.map((f, i) => (
                                            <li key={`${f.name}-${i}`} className="cu-file">
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                                <span className="cu-file-name">{f.name}</span>
                                                <span className="cu-file-size">{sizeLabel(f.size)}</span>
                                                <button type="button" className="cu-file-x" aria-label={`Remove ${f.name}`} onClick={() => { setFiles(p => p.filter((_, j) => j !== i)); setFileError(''); }}><Close /></button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                        <div className="ccm-footer cu-footer">
                            {!ready && <span className="cu-foot-hint">Fill in the fields marked * to send.</span>}
                            <button type="button" className="imp-cancel-btn" onClick={onClose} disabled={state === 'sending'}>Cancel</button>
                            <button type="button" className="imp-save-btn cu-send" onClick={send} disabled={!ready || state === 'sending'}>
                                {state === 'sending' ? <><span className="cu-spin" aria-hidden="true" />Sending…</> : 'Send'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ContactUsModal;
