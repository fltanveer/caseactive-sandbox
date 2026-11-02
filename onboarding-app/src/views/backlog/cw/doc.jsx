/* CW-1 · The document viewer, and the four screens built on it: filling
   in a form, signing an e-sign, the intake forms on sign-up, and the signed
   copy.

   The viewer is the one forms and e-signs already have: a toolbar with
   pages, zoom, search, print and download, and the document. Its buttons
   (Cancel and Submit, or Close) sit top right in the page header, the way
   the app's preview pages already place them, with the saving sign beside
   them. Nothing else is added but the states it was missing words for. */

import { useEffect, useRef, useState } from 'react';
import Notice from '../../../components/Notice';
import LobbyView from '../../LobbyView';
import FeedView from '../../FeedView';
import { BareFrame, Patch } from '../Shell';
import { OB_EDITS } from '../hd/ticket';
import {
    FIRM, SHORT, CLIENT, ATTORNEY, APP,
    Icon, Ico, FirmMark, CasePage, DocBar, Dialog, Pair,
} from '../ms/parts';

/* ── The viewer ─────────────────────────────────────────────────────────── */

const ToolBtn = ({ label, children, disabled }) => (
    <button type="button" className="cw-tool" aria-label={label} title={label} disabled={disabled}>{children}</button>
);

const Toolbar = ({ pages = 1, disabled }) => {
    const [more, setMore] = useState(false);
    return (
        <div className="cw-toolbar" role="toolbar" aria-label="Document">
            <div className="cw-tool-group">
                <ToolBtn label="Previous page" disabled><Ico size={15} w={2.4}><polyline points="15 18 9 12 15 6" /></Ico></ToolBtn>
                <span className="cw-pager">{disabled ? '–' : 1} / {disabled ? '–' : pages}</span>
                <ToolBtn label="Next page" disabled={disabled || pages < 2}><Ico size={15} w={2.4}><polyline points="9 18 15 12 9 6" /></Ico></ToolBtn>
            </div>
            <div className="cw-tool-group cw-hide-phone">
                <ToolBtn label="Zoom out" disabled={disabled}><Ico size={15} w={2.4}><line x1="5" y1="12" x2="19" y2="12" /></Ico></ToolBtn>
                <span className="cw-zoom">100%</span>
                <ToolBtn label="Zoom in" disabled={disabled}><Icon name="plus" size={15} w={2.4} /></ToolBtn>
            </div>
            <span className="cw-tool-spacer" />
            <div className="cw-tool-group cw-hide-phone">
                <ToolBtn label="Search" disabled={disabled}><Icon name="search" size={15} /></ToolBtn>
                <ToolBtn label="Print" disabled={disabled}><Ico size={15}><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></Ico></ToolBtn>
                <ToolBtn label="Download" disabled={disabled}><Icon name="down" size={15} /></ToolBtn>
            </div>
            {/* On a phone the same four tools sit behind one button. */}
            <div className="cw-tool-group cw-show-phone ms-addcal">
                <button type="button" className="cw-tool" aria-label="More tools" aria-expanded={more} disabled={disabled} onClick={() => setMore(m => !m)}>
                    <Ico size={16} w={2.4}><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></Ico>
                </button>
                {more && (
                    <div className="ms-menu cw-menu-right">
                        <button type="button">Zoom</button><button type="button">Search</button>
                        <button type="button">Print</button><button type="button">Download</button>
                    </div>
                )}
            </div>
        </div>
    );
};

/* Saving and saved. Drafts save on every change; this is the only sign. */
export const SaveSign = ({ state }) => {
    if (state === 'saving') return <span className="cw-save" role="status"><span className="cw-spin" aria-hidden="true" />Saving…</span>;
    if (state === 'saved') return <span className="cw-save is-saved" role="status"><Icon name="check" size={13} w={2.8} />Draft saved</span>;
    return <span className="cw-save" />;
};

const useSaving = (initial = 'saved') => {
    const [save, setSave] = useState(initial);
    const t = useRef(null);
    useEffect(() => () => clearTimeout(t.current), []);
    const touch = () => {
        setSave('saving');
        clearTimeout(t.current);
        t.current = setTimeout(() => setSave('saved'), 900);
    };
    return [save, touch];
};

/* A page's worth of text, before the fields. */
export const Lines = ({ widths = [92, 86, 90, 64] }) => widths.map((w, i) => <span key={i} className="ms-paper-line" style={{ width: `${w}%` }} />);

/* What the stage shows before there is a document to show. */
const StageState = ({ state, kind }) => {
    if (state === 'loading') {
        return (
            <div className="ms-paper cw-skel" aria-busy="true" aria-label="Loading the document">
                <span className="cw-skel-bar" style={{ width: '46%', height: 12 }} />
                {[94, 88, 92, 70, 0, 90, 86, 60].map((w, i) => <span key={i} className="cw-skel-bar" style={{ width: `${w}%`, opacity: w ? 1 : 0 }} />)}
                <span className="cw-skel-box" />
            </div>
        );
    }
    if (state === 'converting') {
        return (
            <div className="cw-stage-msg" role="status">
                <span className="cw-spin is-lg" aria-hidden="true" />
                <p className="cw-stage-title">Getting this {kind} ready</p>
                <p className="ms-p ms-muted">The file is still being converted so it can be {kind === 'e-sign' ? 'signed' : 'filled in'} here. It usually takes under a minute, and the page updates by itself.</p>
            </div>
        );
    }
    return (
        <div className="cw-stage-msg" role="alert">
            <span className="cw-stage-ic is-err"><Icon name="alert" size={22} /></span>
            <p className="cw-stage-title">This {kind} couldn&apos;t be opened</p>
            <p className="ms-p ms-muted">The file couldn&apos;t be converted. Try again, and if it still won&apos;t open, ask {SHORT} to upload it again.</p>
            <button type="button" className="btn btn-secondary"><Icon name="refresh" size={14} />Try again</button>
        </div>
    );
};

/* The frame every document screen shares: toolbar and document. Its
   buttons go in the page header through TopActions, not under the page. */
export const Viewer = ({ state = 'ready', kind = 'form', pages, stageRef, children }) => (
    <div className="cw-viewer">
        <Toolbar pages={pages} disabled={state !== 'ready'} />
        <div className="cw-stage" ref={stageRef}>
            {state === 'ready' ? children : <StageState state={state} kind={kind} />}
        </div>
    </div>
);

/* Top-right of the page header: a quiet note (the saving sign, or what a
   locked copy is) and then the buttons, main action last. */
export const TopActions = ({ note, children }) => (
    <div className="ms-docbar-actions cw-top-actions">
        {note && <span className="cw-top-note">{note}</span>}
        {children}
    </div>
);

/* Scroll the stage, not the page, to a field. */
const scrollStageTo = (stage, el) => {
    if (!stage || !el) return;
    stage.scrollTop += el.getBoundingClientRect().top - stage.getBoundingClientRect().top - 60;
};

/* Why a person can only look. Shown as the first thing under the bar. */
const VIEW_ONLY = {
    notParticipant: (kind) => `Only ${CLIENT} fills in this ${kind}. You can view it.`,
    closed: (kind) => `This case is closed, so the ${kind} can't be changed. You can view and download it.`,
    answered: (kind) => `You've already submitted this ${kind}. You can view and download it.`,
};

/* ══ 1 · Filling in a form ══════════════════════════════════════════════ */

const FORM = 'Accident Details Questionnaire';

const FIELDS = [
    { id: 'date', label: 'Date of the accident', type: 'date', required: true },
    { id: 'where', label: 'Where did it happen?', type: 'text', required: true },
    { id: 'what', label: 'What happened, in your own words', type: 'area', required: true },
    { id: 'police', label: 'Did the police come?', type: 'radio', options: ['Yes', 'No'], required: true },
    { id: 'notes', label: 'Attorney notes', type: 'area', owner: ATTORNEY },
];

const START = { date: '2026-05-12', where: 'Wilshire Blvd & S Grand Ave, Los Angeles', what: '', police: '', notes: 'Rear impact at low speed. Ask about prior neck treatment.' };
const DONE = { ...START, what: 'Stopped at a red light; a delivery truck hit the back of my car.', police: 'Yes' };

const filled = (v) => Boolean(String(v || '').trim());

const Field = ({ f, value, onChange, error, readOnly }) => {
    const theirs = Boolean(f.owner);
    const locked = readOnly || theirs;
    const id = `cw-${f.id}`;
    return (
        <div className={`cw-field${error ? ' is-error' : ''}${theirs ? ' is-theirs' : ''}${readOnly && !theirs ? ' is-read' : ''}`} data-field={f.id}>
            <label className="cw-field-label" htmlFor={id}>
                {f.label}{f.required && !locked && <span className="ms-req" aria-hidden="true"> *</span>}
                {theirs && <span className="cw-field-owner"><Icon name="lock" size={11} />For {f.owner}</span>}
            </label>
            {f.type === 'radio' ? (
                <div className="ms-pdf-choices" role="radiogroup" aria-label={f.label}>
                    {f.options.map(o => (
                        <label key={o} className="ms-pdf-choice">
                            <input type="radio" name={id} checked={value === o} disabled={locked} onChange={() => onChange(o)} /> {o}
                        </label>
                    ))}
                </div>
            ) : f.type === 'area' ? (
                <textarea id={id} className="cw-input" rows={theirs ? 2 : 3} value={value} readOnly={locked} onChange={e => onChange(e.target.value)} aria-invalid={error || undefined} />
            ) : (
                <input id={id} className="cw-input" type={f.type} value={value} readOnly={locked} onChange={e => onChange(e.target.value)} aria-invalid={error || undefined} />
            )}
            {error && <p className="cw-field-error">Required. Fill this in to submit.</p>}
        </div>
    );
};

/* state: ready | loading | converting | failed | missing | submitted
   view:  null | notParticipant | closed */
export const FillForm = ({ role = 'client', phone = false, state = 'ready', view = null }) => {
    const [values, setValues] = useState(state === 'submitted' ? DONE : START);
    const [tried, setTried] = useState(state === 'missing');
    const [done, setDone] = useState(state === 'submitted');
    const [save, touch] = useSaving();
    const stage = useRef(null);
    const readOnly = done || Boolean(view);
    const missing = FIELDS.filter(f => f.required && !filled(values[f.id]));

    useEffect(() => {
        if (state !== 'missing') return;
        const el = stage.current?.querySelector('.cw-field.is-error');
        setTimeout(() => scrollStageTo(stage.current, el), 200);
    }, [state]);

    const set = (id) => (v) => { setValues(p => ({ ...p, [id]: v })); touch(); };
    const submit = () => {
        if (missing.length) {
            setTried(true);
            requestAnimationFrame(() => scrollStageTo(stage.current, stage.current?.querySelector('.cw-field.is-error')));
            return;
        }
        setDone(true);
    };

    const ready = state !== 'loading' && state !== 'converting' && state !== 'failed';
    const status = view ? 'viewOnly' : done ? 'submitted' : 'toFill';

    return (
        <CasePage role={role} nav="Forms" phone={phone} height={phone ? undefined : 860}
            head={<DocBar title={FORM} status={status} actions={
                <TopActions note={readOnly ? null : ready && <SaveSign state={save} />}>
                    {readOnly ? (
                        <button type="button" className="btn btn-secondary">Close</button>
                    ) : (
                        <>
                            <button type="button" className="btn btn-secondary">Cancel</button>
                            <button type="button" className="btn btn-primary" disabled={!ready} onClick={submit}>Submit</button>
                        </>
                    )}
                </TopActions>
            } />}>
            {view && <Notice tone="info">{VIEW_ONLY[view]('form')}</Notice>}
            {done && !view && <Notice tone="success" title="Submitted">{SHORT} has your answers. Submitted Jun 4, 2026 at 10:12 AM.</Notice>}
            {tried && !done && missing.length > 0 && (
                <Notice tone="error">{missing.length === 1 ? '1 required field is empty.' : `${missing.length} required fields are empty.`} They&apos;re outlined in red.</Notice>
            )}
            <Viewer state={ready ? 'ready' : state} kind="form" pages={2} stageRef={stage}>
                <div className="ms-paper cw-page">
                    <p className="ms-paper-heading">{FIRM} · {FORM}</p>
                    <Lines widths={[70, 92, 84]} />
                    {FIELDS.map(f => (
                        <Field key={f.id} f={f} value={values[f.id]} onChange={set(f.id)} readOnly={readOnly}
                            error={tried && !done && f.required && !filled(values[f.id])} />
                    ))}
                    <span className="ms-paper-pageno">Page 1 of 2</span>
                </div>
            </Viewer>
        </CasePage>
    );
};

/* ══ 2 · Signing an e-sign ══════════════════════════════════════════════ */

const ESIGN = 'Retainer Agreement';

const Script = ({ children, small }) => <span className={`ms-script${small ? ' is-small' : ''}`}>{children}</span>;

/* The signature pad. How the live viewer takes a signature is to be
   confirmed on the thread; this draws the common Draw / Type pad. */
const SignaturePad = ({ initials, onClose, onAdd }) => {
    const [mode, setMode] = useState('draw');
    const [typed, setTyped] = useState(initials ? 'AR' : CLIENT);
    return (
        <Dialog title={initials ? 'Add your initials' : 'Add your signature'} width={520} onClose={onClose}
            footer={<>
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={onAdd}>Add</button>
            </>}>
            <div className="ms-seg" role="tablist">
                <button type="button" role="tab" aria-selected={mode === 'draw'} className={mode === 'draw' ? 'is-on' : ''} onClick={() => setMode('draw')}>Draw</button>
                <button type="button" role="tab" aria-selected={mode === 'type'} className={mode === 'type' ? 'is-on' : ''} onClick={() => setMode('type')}>Type</button>
            </div>
            {mode === 'draw' ? (
                <div className="ms-draw">
                    <svg viewBox="0 0 420 120" className="ms-draw-ink" aria-hidden="true">
                        <path d={initials ? 'M150 85c10-40 25-55 30-35s-20 40 5 30 20-45 35-40 0 40 20 35' : 'M30 80c20-40 40-50 50-30s-10 40 10 30 30-50 45-40-5 40 15 35 25-30 40-28 10 25 30 20 30-20 50-18 40 10 60 8'} />
                    </svg>
                    <span className="ms-draw-line" />
                    <div className="ms-draw-foot"><span>Draw with your mouse or finger</span><button type="button" className="btn btn-link">Clear</button></div>
                </div>
            ) : (
                <div className="ccm-field">
                    <label className="ccm-label" htmlFor="cw-typed">{initials ? 'Initials' : 'Full name'}</label>
                    <input id="cw-typed" className="ccm-input" value={typed} onChange={e => setTyped(e.target.value)} />
                    <div className="cw-typed-preview"><Script small={initials}>{typed || ' '}</Script></div>
                </div>
            )}
        </Dialog>
    );
};

const SPOTS = [['init', 'Initials', true], ['sig', 'Signature', false]];

const Spot = ({ id, label, small, signed, error, readOnly, onClick }) => {
    if (signed) {
        return (
            <span className={`ms-sign-spot is-done${small ? ' is-initials' : ''}`}>
                <Script small={small}>{small ? 'AR' : CLIENT}</Script>
                <span className="ms-sign-meta">Signed electronically · Jun 4, 2026</span>
            </span>
        );
    }
    if (readOnly) return <span className={`ms-sign-spot is-theirs${small ? ' is-initials' : ''}`}>Not signed</span>;
    return (
        <button type="button" data-spot={id} className={`ms-sign-spot cw-spot${small ? ' is-initials' : ''}${error ? ' is-error' : ''}`} onClick={onClick}>
            <span className="ms-sign-flag"><Icon name="pen" size={12} />{small ? 'Initial' : 'Sign'}</span>
            <span className="ms-sign-ph">{label}</span>
        </button>
    );
};

/* state: ready | loading | converting | failed | missing | submitted
   view:  null | notParticipant | closed */
export const SignDoc = ({ role = 'client', phone = false, state = 'ready', view = null }) => {
    const [signed, setSigned] = useState(state === 'submitted' ? ['init', 'sig'] : state === 'missing' ? ['init'] : []);
    const [pad, setPad] = useState(null);
    const [tried, setTried] = useState(state === 'missing');
    const [done, setDone] = useState(state === 'submitted');
    const [save, touch] = useSaving();
    const stage = useRef(null);
    const readOnly = done || Boolean(view);
    const left = SPOTS.filter(([id]) => !signed.includes(id));

    useEffect(() => {
        if (state !== 'missing') return;
        setTimeout(() => scrollStageTo(stage.current, stage.current?.querySelector('.cw-spot.is-error')), 200);
    }, [state]);

    const submit = () => {
        if (left.length) {
            setTried(true);
            requestAnimationFrame(() => scrollStageTo(stage.current, stage.current?.querySelector('.cw-spot.is-error')));
            return;
        }
        setDone(true);
    };
    const ready = state !== 'loading' && state !== 'converting' && state !== 'failed';
    const spot = (id) => {
        const [, label, small] = SPOTS.find(s => s[0] === id);
        return <Spot id={id} label={label} small={small} signed={signed.includes(id)} readOnly={readOnly}
            error={tried && !done && !signed.includes(id)} onClick={() => setPad(id)} />;
    };

    return (
        <CasePage role={role} nav="E-signs" phone={phone} height={phone ? undefined : 860}
            head={<DocBar title={ESIGN} status={view ? 'viewOnly' : done ? 'waitingOthers' : 'toSign'} actions={
                <TopActions note={readOnly ? null : ready && <SaveSign state={save} />}>
                    {readOnly ? (
                        <button type="button" className="btn btn-secondary">Close</button>
                    ) : (
                        <>
                            <button type="button" className="btn btn-secondary">Cancel</button>
                            <button type="button" className="btn btn-primary" disabled={!ready} onClick={submit}>Submit</button>
                        </>
                    )}
                </TopActions>
            } />}
            modal={pad && <SignaturePad initials={pad === 'init'} onClose={() => setPad(null)} onAdd={() => { setSigned(p => [...p, pad]); setPad(null); touch(); }} />}>
            {view && <Notice tone="info">{VIEW_ONLY[view]('e-sign')}</Notice>}
            {done && !view && <Notice tone="success" title="Signed">{ATTORNEY} signs next. You&apos;ll get the signed copy when everyone has signed.</Notice>}
            {tried && !done && left.length > 0 && (
                <Notice tone="error">{left.length === 1 ? 'You missed 1 place to sign.' : `You missed ${left.length} places to sign.`} It&apos;s outlined in red.</Notice>
            )}
            <Viewer state={ready ? 'ready' : state} kind="e-sign" pages={2} stageRef={stage}>
                <div className="ms-paper cw-page">
                    <p className="ms-paper-heading">{FIRM} · {ESIGN}</p>
                    <Lines widths={[92, 88, 95, 90, 72]} />
                    <p className="ms-paper-clause">3. Fees. The firm is paid 33⅓% of any recovery before suit is filed, and 40% after.</p>
                    <div className="ms-sign-row">{spot('init')}<span className="ms-sign-cap">Client initials, section 3</span></div>
                    <Lines widths={[90, 84, 92, 66, 88, 80]} />
                    <span className="ms-paper-pageno">Page 1 of 2</span>
                </div>
                <div className="ms-paper cw-page">
                    <Lines widths={[90, 94, 80, 60]} />
                    <div className="ms-sign-grid">
                        <div>{spot('sig')}<span className="ms-sign-cap">{CLIENT}, Client</span></div>
                        <div>
                            <span className="ms-sign-spot is-theirs">For {ATTORNEY}</span>
                            <span className="ms-sign-cap">{ATTORNEY}, Attorney</span>
                        </div>
                    </div>
                    <span className="ms-paper-pageno">Page 2 of 2</span>
                </div>
            </Viewer>
        </CasePage>
    );
};

/* ══ 6 · The signed copy ════════════════════════════════════════════════ */

const SIGNERS = [
    { name: CLIENT, role: 'Client', at: 'Jun 4, 2026 · 10:12 AM PT', ip: '73.162.41.208', self: true },
    { name: ATTORNEY, role: 'Attorney', at: 'Jun 4, 2026 · 11:30 AM PT', ip: '12.180.77.15' },
    { name: 'Former member', role: 'Witness', at: 'Jun 4, 2026 · 11:41 AM PT', ip: '12.180.77.22', former: true },
];

const SignedPanel = ({ moderator }) => {
    const [open, setOpen] = useState(true);
    return (
        <aside className="cw-signed-panel" aria-label="Signers">
            <div className="cw-signed-head">
                <h3 className="cw-signed-title">Signed by {SIGNERS.length} people</h3>
                <button type="button" className="btn btn-link" aria-expanded={open} onClick={() => setOpen(o => !o)}>{open ? 'Hide details' : 'Show details'}</button>
            </div>
            <ul className="cw-signers">
                {SIGNERS.map(s => {
                    const showIp = moderator || s.self;
                    return (
                        <li key={s.name}>
                            <span className={`ms-avatar is-sm${s.former ? ' is-former' : ''}`}>{s.former ? <Icon name="user" size={13} /> : s.name.split(' ').map(w => w[0]).join('')}</span>
                            <div className="cw-signer">
                                <strong className={s.former ? 'is-former' : ''}>{s.name}{s.self && <em> (you)</em>}</strong>
                                <span>{s.role}</span>
                                {open && (
                                    <dl className="cw-signer-meta">
                                        <dt>Signed at</dt><dd>{s.at}</dd>
                                        <dt>IP address</dt><dd className={showIp ? 'cw-ip' : 'ms-muted'}>{showIp ? s.ip : 'IP address not shown'}</dd>
                                    </dl>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </aside>
    );
};

/* state: ready | making | failed | stale */
export const SignedCopy = ({ role = 'client', phone = false, state = 'ready' }) => {
    const moderator = role !== 'client';
    return (
        <CasePage role={role} nav="E-signs" phone={phone} height={phone ? undefined : 860}
            head={<DocBar title={ESIGN} status="completed" actions={
                <TopActions note={state === 'ready' ? <span className="cw-save is-saved"><Icon name="lock" size={13} />Locked copy · ID 4F2A-9C1E</span> : null}>
                    {state === 'failed' && <button type="button" className="btn btn-secondary"><Icon name="refresh" size={14} />Try again</button>}
                    {state === 'stale' && <button type="button" className="btn btn-secondary"><Icon name="refresh" size={14} />Reload</button>}
                    <button type="button" className="btn btn-secondary">Close</button>
                </TopActions>
            } />}>
            {state === 'making' && <Notice tone="info" title="Making the signed copy">This is the live document until the locked copy is ready. It usually takes a minute or two.</Notice>}
            {state === 'failed' && <Notice tone="warning" title="The locked copy couldn't be made">You&apos;re seeing the live document, with the same signatures. Download it from here, or try making the copy again.</Notice>}
            {state === 'stale' && <Notice tone="warning">This copy may not show the latest signatures. Reload to check for a newer one.</Notice>}
            <div className="cw-signed">
                <Viewer pages={2}>
                    <div className="ms-paper cw-page">
                        <Lines widths={[90, 94, 80, 60]} />
                        <div className="ms-sign-grid">
                            {SIGNERS.map(s => (
                                <div key={s.name}>
                                    <span className="ms-sign-spot is-done is-signature">
                                        <Script>{s.former ? 'D. Ortiz' : s.name}</Script>
                                        <span className="ms-sign-meta">Signed electronically · {s.at.replace(' PT', '')}</span>
                                    </span>
                                    <span className="ms-sign-cap">{s.name}, {s.role}</span>
                                </div>
                            ))}
                        </div>
                        <span className="ms-paper-pageno">Page 2 of 2</span>
                    </div>
                </Viewer>
                <SignedPanel moderator={moderator} />
            </div>
        </CasePage>
    );
};

/* ══ 5 · Intake forms on sign-up ════════════════════════════════════════ */

const OWED = ['Client Intake Questionnaire', 'HIPAA Authorization', 'Medical Records Release'];

const Onboarding = ({ at = 1 }) => {
    const [i, setI] = useState(at);
    const [save, touch] = useSaving();
    const last = i === OWED.length - 1;
    return (
        <div className="cw-onb">
            <header className="cw-onb-head">
                <span className="ms-intake-brand"><FirmMark size={28} /><strong className="cw-hide-phone">{FIRM}</strong></span>
                <div className="cw-onb-progress">
                    <span className="cw-onb-title">Onboarding</span>
                    <ol className="cw-onb-dots" aria-label={`Form ${i + 1} of ${OWED.length}`}>
                        {OWED.map((f, j) => (
                            <li key={f} className={j < i ? 'is-done' : j === i ? 'is-now' : ''} title={f}>
                                {j < i ? <Icon name="check" size={10} w={3.4} /> : null}
                            </li>
                        ))}
                    </ol>
                    <span className="cw-onb-count">Form {i + 1} of {OWED.length}</span>
                </div>
                <span className="cw-onb-spacer" />
            </header>
            <div className="cw-onb-body">
                <div className="cw-onb-name ms-docbar">
                    <div className="ms-docbar-block">
                        <h1 className="portal-page-title">{OWED[i]}</h1>
                        <span className="ms-muted">{i} done · {OWED.length - i} to go</span>
                    </div>
                    <TopActions note={<SaveSign state={save} />}>
                        <button type="button" className="btn btn-secondary">Cancel</button>
                        <button type="button" className="btn btn-primary" onClick={() => (last ? null : setI(i + 1))}>{last ? 'Submit and go to Lobby' : 'Submit'}</button>
                    </TopActions>
                </div>
                <Viewer pages={1}>
                    <div className="ms-paper cw-page">
                        <p className="ms-paper-heading">{FIRM} · {OWED[i]}</p>
                        <Lines widths={[88, 94, 70]} />
                        <div className="cw-field">
                            <label className="cw-field-label" htmlFor="cw-onb-a">Mobile phone<span className="ms-req"> *</span></label>
                            <input id="cw-onb-a" className="cw-input" defaultValue="(213) 555-0148" onChange={touch} />
                        </div>
                        <div className="cw-field">
                            <label className="cw-field-label" htmlFor="cw-onb-b">Your car insurance company</label>
                            <input id="cw-onb-b" className="cw-input" placeholder="" onChange={touch} />
                        </div>
                        <Lines widths={[90, 82]} />
                    </div>
                </Viewer>
            </div>
        </div>
    );
};

export const Intake = ({ at }) => (
    <Pair url={`${APP}/onboarding`} height={720}><Onboarding key={at} at={at} /></Pair>
);

/* After the last form: the Lobby, with one line saying it worked. */
export const IntakeDone = () => (
    <BareFrame height={640}>
        <div className="cw-toast" role="status"><Icon name="check" size={15} w={2.8} />Onboarding done. {SHORT} has all three forms.</div>
        <LobbyView onToggle={() => {}} onHubs={() => {}} />
    </BareFrame>
);

/* The reminder elsewhere in the app is HD-1's strip (15.8), reused as is. */
export const IntakeBanner = ({ phone = false }) => (
    <CasePage nav="Feed" phone={phone} height={640} patch={<Patch edits={OB_EDITS} />}>
        <div className="tk-mount"><FeedView /></div>
    </CasePage>
);

