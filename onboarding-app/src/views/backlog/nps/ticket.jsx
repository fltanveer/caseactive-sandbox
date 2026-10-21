/* eslint-disable react-refresh/only-export-components --
   Same arrangement as tickets.jsx: a data module holding one ticket record
   whose screens are render functions. It lives in its own file because it is
   one ticket with seventeen changes and the main file is already long. */

/* NPS-1 · Post-settlement NPS.

   Three sites. The client answers on the account site (ca-account), which is
   not in this codebase, so the answer page, the email and the text are
   drawings. Staff see answers on the case (ca-app), and an Admin sets it up
   and reads the results in the Admin Panel (ca-manage); those mount the real
   views wherever one exists and patch the change into them.

   Every client screen shows a computer and a phone side by side, as asked on
   the ticket thread, because the page is one responsive layout and the two
   must be reviewed together or they drift. */

import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import StateBlock from '../../../components/StateBlock';
import StatusPill from '../../../components/StatusPill';
import StageLabel from '../../../components/StageLabel';
import LockedControl from '../../../components/LockedControl';
import { NOTIFICATIONS, KINDS, relativeTime } from '../../../components/NotificationsPopover';
import { CASE_TYPES, findStage, useStages } from '../../../data/stages';
import { AdminFrame, CaseFrame, Phone, Patch, New, Proposal, ModalField, Select, Toggle } from '../Shell';
import { usePatched } from '../patchContext';
import { AutoOpen } from '../Drive';
import AutomationsView from '../../settings/AutomationsView';
import ProfileView from '../../ProfileView';
import DashboardView from '../../DashboardView';
import NpsRow from './NpsRow';
import AnswersTable, { ScoreCell, Words } from './AnswersTable';
import '../../../components/NotificationsPopover.css';
import './nps.css';

const FIRM = 'Sterling & Brooks Injury Law';
const SHORT = 'Sterling & Brooks';
const ACCOUNT = 'account.caseactive.com';
const CASE_TITLE = 'Rear-End Collision — Downtown LA';

const bandOf = (score) => (score == null ? null : score >= 9 ? 'promoter' : score >= 7 ? 'passive' : 'detractor');

/* ── The client's side: copy ─────────────────────────────────────────────
   The server sends locale, and a null question or message, which means use
   ours. These are ours, in each language the page ships with. Whatever the
   firm writes in settings replaces them as written, in every language. */
const COPY = {
    en: {
        question: `How likely are you to recommend ${FIRM} to a friend or family member?`,
        low: 'Not at all likely',
        high: 'Extremely likely',
        saving: 'Saving your score…',
        saved: 'Score saved. You can close this page, or tell us more below.',
        savedPromoter: 'Score saved. You can close this page.',
        promoter: 'Thank you! We\'re so glad we could help. Would you share your experience in a review? It helps people in your position find us.',
        review: 'Leave a review',
        reviewHint: 'Opens in a new tab',
        passive: 'Thank you. Is there anything you\'d tell others about working with us?',
        quoteLabel: 'Your words (optional)',
        consent: `${SHORT} may share these words publicly, with my first name.`,
        refer: 'Know someone who needs help?',
        referLink: 'Refer a friend',
        detractor: 'We\'re sorry we let you down.',
        detractorMsg: 'What went wrong? Your answer goes straight to the team on your case.',
        commentLabel: 'What went wrong (optional)',
        send: 'Send',
        update: 'Save changes',
        answered: (on, until) => `You answered on ${on}. You can change your answer until ${until}.`,
        thanksTitle: 'Thank you. Your answer is saved.',
        thanksMsg: (until) => `You can change it until ${until}.`,
        change: 'Change my answer',
        expiredTitle: 'This survey has closed.',
        expiredMsg: `Surveys stay open for 30 days after they're sent. Thank you for choosing ${FIRM}.`,
        expiredScore: (n) => `You picked ${n}. It wasn't saved, because the survey had already closed.`,
        invalidTitle: 'This link doesn\'t work.',
        invalidMsg: 'It may be incomplete, or no longer in use.',
        invalidTips: [
            'Open it again straight from the email or text. Some apps cut long links in two.',
            'Still not working? Ask your law firm to send the survey again.',
        ],
        count: (n) => `${n.toLocaleString('en-US')} / 2,000`,
        powered: 'Powered by CaseActive',
        on: 'Oct 22, 2026',
        until: 'Nov 21, 2026',
    },
    es: {
        question: `¿Qué probabilidad hay de que recomiende ${FIRM} a un amigo o familiar?`,
        low: 'Nada probable',
        high: 'Muy probable',
        saving: 'Guardando su puntuación…',
        saved: 'Puntuación guardada. Puede cerrar esta página o contarnos más abajo.',
        savedPromoter: 'Puntuación guardada. Puede cerrar esta página.',
        promoter: '¡Gracias! Nos alegra mucho haberle ayudado. ¿Compartiría su experiencia en una reseña? Ayuda a personas en su situación a encontrarnos.',
        review: 'Dejar una reseña',
        reviewHint: 'Se abre en una pestaña nueva',
        passive: 'Gracias. ¿Hay algo que le contaría a otras personas sobre trabajar con nosotros?',
        quoteLabel: 'Sus palabras (opcional)',
        consent: `${SHORT} puede compartir estas palabras públicamente, con mi nombre de pila.`,
        refer: '¿Conoce a alguien que necesite ayuda?',
        referLink: 'Recomiende a un amigo',
        detractor: 'Lamentamos no haber estado a la altura.',
        detractorMsg: '¿Qué salió mal? Su respuesta llega directamente al equipo de su caso.',
        commentLabel: 'Qué salió mal (opcional)',
        send: 'Enviar',
        update: 'Guardar cambios',
        answered: (on, until) => `Respondió el ${on}. Puede cambiar su respuesta hasta el ${until}.`,
        thanksTitle: 'Gracias. Su respuesta está guardada.',
        thanksMsg: (until) => `Puede cambiarla hasta el ${until}.`,
        change: 'Cambiar mi respuesta',
        expiredTitle: 'Esta encuesta está cerrada.',
        expiredMsg: `Las encuestas están abiertas durante 30 días después de enviarse. Gracias por elegir a ${FIRM}.`,
        expiredScore: (n) => `Eligió ${n}. No se guardó porque la encuesta ya estaba cerrada.`,
        invalidTitle: 'Este enlace no funciona.',
        invalidMsg: 'Puede estar incompleto o ya no estar en uso.',
        invalidTips: [
            'Ábralo de nuevo directamente desde el correo o el mensaje de texto. Algunas aplicaciones cortan los enlaces largos.',
            '¿Sigue sin funcionar? Pida a su bufete que le envíe la encuesta otra vez.',
        ],
        count: (n) => `${n.toLocaleString('es-ES')} / 2000`,
        powered: 'Con la tecnología de CaseActive',
        on: '22 oct 2026',
        until: '21 nov 2026',
    },
};

/* The firm's logo_url, drawn. A real hub uploads its own. */
const FirmLogo = ({ size = 36 }) => (
    <svg className="nps-logo" width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
        <rect width="40" height="40" rx="9" fill="#1E3A5F" />
        <text x="20" y="25.5" textAnchor="middle" fill="#fff" fontFamily="Georgia, 'Times New Roman', serif" fontSize="14" fontWeight="700" letterSpacing="-0.3">S&amp;B</text>
    </svg>
);

const Icon = ({ d, size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
);
const CHECK = <polyline points="20 6 9 17 4 12" />;
const CLOCK = <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>;
const BROKEN = <><path d="M9 17H7A5 5 0 0 1 7 7h2" /><path d="M15 7h2a5 5 0 0 1 4 8" /><line x1="8" y1="12" x2="12" y2="12" /><line x1="2" y1="2" x2="22" y2="22" /></>;
const EXTERNAL = <><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></>;

/* ── The answer page (ca-account /survey) ────────────────────────────────
   One card that grows. The score stays at the top and stays changeable; the
   follow-up for its band opens underneath, so moving a 6 to an 8 swaps the
   follow-up in place instead of sending the client somewhere else.

   state: open | answered | thanks | expired | invalid */
const ScoreRow = ({ t, score, onPick }) => (
    <div className="nps-scale-wrap">
        <div className="nps-scale" role="radiogroup" aria-label={t.question}>
            {Array.from({ length: 11 }, (_, n) => (
                <button
                    key={n} type="button" role="radio" aria-checked={score === n}
                    className={`nps-scale-btn${score === n ? ' is-on' : ''}`}
                    onClick={() => onPick(n)}
                >{n}</button>
            ))}
        </div>
        <div className="nps-scale-ends" aria-hidden="true">
            <span>0 · {t.low}</span>
            <span>10 · {t.high}</span>
        </div>
    </div>
);

const Counted = ({ t, label, value, onChange, placeholder }) => (
    <label className="nps-field">
        <span className="nps-label">{label}</span>
        <textarea
            className="nps-textarea" rows={4} maxLength={2000}
            value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)}
        />
        <span className="nps-count">{t.count(value.length)}</span>
    </label>
);

const FollowUp = ({ t, band, editing, answer, onSend }) => {
    const [quote, setQuote] = useState(answer.testimonial || '');
    const [consent, setConsent] = useState(Boolean(answer.consent));
    const [comment, setComment] = useState(answer.comment || '');

    if (band === 'promoter') {
        return (
            <div className="nps-follow">
                <p className="nps-follow-lede">{t.promoter}</p>
                <a className="nps-review" href="#review" onClick={e => e.preventDefault()}>
                    {t.review}
                    <Icon d={EXTERNAL} size={17} />
                </a>
                <span className="nps-review-hint">{t.reviewHint}</span>
            </div>
        );
    }
    if (band === 'passive') {
        return (
            <div className="nps-follow">
                <p className="nps-follow-lede">{t.passive}</p>
                <Counted t={t} label={t.quoteLabel} value={quote} onChange={setQuote} />
                <label className="nps-consent">
                    <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} />
                    <span>{t.consent}</span>
                </label>
                <button type="button" className="nps-send" onClick={onSend}>{editing ? t.update : t.send}</button>
                <p className="nps-refer">
                    {t.refer}{' '}
                    <a href="#refer" onClick={e => e.preventDefault()}>{t.referLink}<Icon d={EXTERNAL} size={13} /></a>
                </p>
            </div>
        );
    }
    return (
        <div className="nps-follow">
            <p className="nps-follow-title">{t.detractor}</p>
            <p className="nps-follow-lede">{t.detractorMsg}</p>
            <Counted t={t} label={t.commentLabel} value={comment} onChange={setComment} />
            <button type="button" className="nps-send" onClick={onSend}>{editing ? t.update : t.send}</button>
        </div>
    );
};

/* urlScore is the score= in the link, which an expired page still has even
   though the server sends nothing else back. */
const SurveyPage = ({ score: initialScore = null, state = 'open', locale = 'en', answer = {}, urlScore = null }) => {
    const t = COPY[locale];
    const [score, setScore] = useState(initialScore);
    const [view, setView] = useState(state);
    const band = bandOf(score);
    const branded = view !== 'invalid';

    let body;
    if (view === 'expired') {
        body = (
            <div className="nps-end">
                <span className="nps-end-icon"><Icon d={CLOCK} /></span>
                <h1 className="nps-end-title">{t.expiredTitle}</h1>
                <p className="nps-end-msg">{t.expiredMsg}</p>
                {urlScore != null && <p className="nps-end-note" role="status">{t.expiredScore(urlScore)}</p>}
            </div>
        );
    } else if (view === 'invalid') {
        body = (
            <div className="nps-end">
                <span className="nps-end-icon"><Icon d={BROKEN} /></span>
                <h1 className="nps-end-title">{t.invalidTitle}</h1>
                <p className="nps-end-msg">{t.invalidMsg}</p>
                <ol className="nps-end-tips">
                    {t.invalidTips.map(tip => <li key={tip}>{tip}</li>)}
                </ol>
            </div>
        );
    } else if (view === 'thanks') {
        body = (
            <div className="nps-end">
                <span className="nps-end-icon is-ok"><Icon d={CHECK} /></span>
                <h1 className="nps-end-title">{t.thanksTitle}</h1>
                <p className="nps-end-msg">{t.thanksMsg(t.until)}</p>
                <button type="button" className="nps-link" onClick={() => setView('answered')}>{t.change}</button>
            </div>
        );
    } else {
        body = (
            <>
                {view === 'answered' && (
                    <p className="nps-notice" role="status">{t.answered(t.on, t.until)}</p>
                )}
                <h1 className="nps-q">{t.question}</h1>
                <ScoreRow t={t} score={score} onPick={setScore} />
                {/* Reopened, the notice above already says it is saved. */}
                {score != null && (view === 'open' || score !== initialScore) && (
                    <p className="nps-saved" role="status">
                        <Icon d={CHECK} size={15} />
                        {band === 'promoter' ? t.savedPromoter : t.saved}
                    </p>
                )}
                {band && (
                    <FollowUp
                        key={band} t={t} band={band} editing={view === 'answered'}
                        answer={answer} onSend={() => setView('thanks')}
                    />
                )}
            </>
        );
    }

    return (
        <div className={`nps-page${view === 'expired' || view === 'invalid' ? ' is-end' : ''}`} lang={locale}>
            {/* A bad link does not know its firm, so it has no header at all
               rather than an empty one. */}
            {branded && (
                <header className="nps-head">
                    <FirmLogo />
                    <span className="nps-firm">{FIRM}</span>
                </header>
            )}
            <main className="nps-card">{body}</main>
            <footer className="nps-foot">{t.powered}</footer>
        </div>
    );
};

/* ── Frames for the client's screens ───────────────────────────────────── */
const BrowserBox = ({ url, height = 640, children }) => (
    <div className="nps-browser">
        <div className="nps-browser-bar">
            <span className="nps-browser-dots" aria-hidden="true"><i /><i /><i /></span>
            <span className="nps-browser-url">{url}</span>
        </div>
        <div className="nps-browser-body" style={{ height }}>{children}</div>
    </div>
);

/* A computer and a phone, side by side when there is room. The screen is
   rendered twice, so each copy keeps its own state. */
const Pair = ({ url, height, phoneOnly = false, aside, children }) => (
    <>
        <div className="nps-pair">
            {!phoneOnly && (
                <figure className="nps-pair-col is-wide">
                    <figcaption>Computer</figcaption>
                    <BrowserBox url={url} height={height}>{children}</BrowserBox>
                </figure>
            )}
            <figure className="nps-pair-col">
                <figcaption>Phone</figcaption>
                <Phone>{children}</Phone>
            </figure>
        </div>
        {aside && <p className="tk-aside">{aside}</p>}
    </>
);

/* None of the client's side exists today. */
const NotBuilt = ({ what }) => (
    <div className="nps-today">
        <StateBlock tone="empty" title={`There is no ${what} today.`} message="Switch to Proposed to see the design." />
    </div>
);

const ClientScreen = ({ what, ...rest }) => (
    <Proposal instead={<NotBuilt what={what} />}><Pair {...rest} /></Proposal>
);

/* ── The email and the text ──────────────────────────────────────────────
   Drawn as the message, not as markup: the template is the server's. */
const SurveyEmail = () => (
    <div className="nps-mail">
        <div className="nps-mail-meta">
            <p className="nps-mail-subject">How did we do, Alexandra?</p>
            <p className="nps-mail-from">
                <strong>{FIRM}</strong>
                <span>to alexandra@example.com · 10:00 AM</span>
            </p>
        </div>
        <div className="nps-mail-canvas">
            <div className="nps-mail-card">
                <div className="nps-mail-brand"><FirmLogo size={40} /><span>{FIRM}</span></div>
                <p className="nps-mail-p">Hi Alexandra,</p>
                <p className="nps-mail-p">Thank you for trusting us with your case. One quick question:</p>
                <p className="nps-mail-q">How likely are you to recommend {FIRM} to a friend or family member?</p>
                <div className="nps-mail-scale">
                    {Array.from({ length: 11 }, (_, n) => (
                        <a key={n} href={`#score-${n}`} onClick={e => e.preventDefault()} className="nps-mail-btn">{n}</a>
                    ))}
                </div>
                <div className="nps-mail-ends"><span>Not at all likely</span><span>Extremely likely</span></div>
                <p className="nps-mail-small">Tap a number to answer. It opens a page where you can add a comment if you&apos;d like.</p>
            </div>
            <p className="nps-mail-foot">
                You&apos;re getting this email because {FIRM} is handling your case.{' '}
                <a href="#unsubscribe" onClick={e => e.preventDefault()}>Unsubscribe</a>
            </p>
        </div>
    </div>
);

const SurveyText = () => (
    <div className="nps-sms">
        <div className="nps-sms-head">
            <span className="nps-sms-avatar">SB</span>
            <span className="nps-sms-name">{SHORT}</span>
        </div>
        <div className="nps-sms-thread">
            <span className="nps-sms-time">Text Message · Today 10:00 AM</span>
            <p className="nps-sms-bubble">
                {FIRM}: Thank you for trusting us with your case. How likely are you to recommend us to a friend, 0 to 10?
                Answer here: <a href="#survey" onClick={e => e.preventDefault()}>{ACCOUNT}/survey?t=7Hk2qP9x</a>
            </p>
        </div>
    </div>
);

/* ── Staff: the case's Surveys tab (ca-app) ──────────────────────────────── */
const SURVEYS_ICON = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
);

const CASE_SURVEYS = [
    {
        name: 'Alexandra Reyes', status: 'surveyAnswered', score: 4,
        comment: 'It took three weeks to hear back after the settlement call. The result was fine, the silence was not.',
        sent: 'Oct 21, 10:00 AM', answered: 'Oct 22, 8:14 AM',
    },
    {
        name: 'Daniel Reyes', status: 'surveyAnswered', score: 9,
        testimonial: 'Marcus explained every step and never made us feel rushed.', consent: true,
        sent: 'Oct 21, 10:00 AM', answered: 'Oct 21, 12:40 PM',
    },
    { name: 'Sofia Reyes', status: 'surveySent', sent: 'Oct 21, 10:00 AM', expires: 'Nov 20' },
    { name: 'Luis Reyes', status: 'surveyScheduled', sendAfter: 'Oct 24, 10:00 AM' },
];

const CaseSurveys = () => (
    <div className="as-tab-panel">
        <div className="as-panel-header">
            <div className="as-panel-title-wrap">
                <h3 className="as-panel-title">Client surveys</h3>
                <p className="as-panel-subtitle">Each client on this case gets one survey when the case enters a trigger stage. Only staff see this tab.</p>
            </div>
        </div>
        <div className="as-table-wrap">
            <table className="as-table nps-table">
                <thead>
                    <tr><th>Client</th><th>Status</th><th>Score</th><th>Comment or quote</th><th>Sent</th><th>Answered</th></tr>
                </thead>
                <tbody>
                    {CASE_SURVEYS.map(r => (
                        <tr key={r.name}>
                            <td data-label="Client" className="nps-strong">{r.name}</td>
                            <td data-label="Status">
                                <StatusPill status={r.status} dot />
                                {r.sendAfter && <span className="nps-sub">Sends {r.sendAfter}</span>}
                                {r.expires && <span className="nps-sub">Open until {r.expires}</span>}
                            </td>
                            <td data-label="Score"><ScoreCell score={r.score} /></td>
                            <td data-label="Words"><Words row={r} /></td>
                            <td data-label="Sent" className="nps-when">{r.sent || <span className="cf-empty">—</span>}</td>
                            <td data-label="Answered" className="nps-when">{r.answered || <span className="cf-empty">—</span>}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const CaseSurveysScreen = () => {
    const on = usePatched();
    return (
        <CaseFrame
            caseTitle={CASE_TITLE} nav={on ? 'Surveys' : 'Overview'} height={700}
            who="Marcus Bell" role="Staff · Lead Attorney"
            patch={<Patch edits={[
                {
                    at: '.case-sidebar .case-nav-item:last-of-type', mode: 'after', pin: '14.8',
                    children: (
                        <New>
                            <button type="button" className="case-nav-item active">
                                <span className="case-nav-icon">{SURVEYS_ICON}</span>
                                <span>Surveys</span>
                            </button>
                        </New>
                    ),
                },
            ]} />}
        >
            {on ? <CaseSurveys /> : <NotBuilt what="Surveys tab on a case" />}
        </CaseFrame>
    );
};

/* ── The bell (ca-app and ca-manage) ─────────────────────────────────────
   The popover is drawn with the real popover's classes and its real seed
   rows, with the survey alert on top. It is portalled into the real bell's
   wrapper so it hangs from the bell exactly as the live one does. */
const IntoBell = ({ children }) => {
    const ref = useRef(null);
    const [host, setHost] = useState(null);
    useLayoutEffect(() => {
        setHost(ref.current?.closest('.af')?.querySelector('.portal-notif-wrap') || null);
    }, []);
    return (
        <>
            <span ref={ref} hidden />
            {host && createPortal(children, host)}
        </>
    );
};

const SURVEY_KIND = {
    tint: 'red',
    icon: <><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></>,
};
const SURVEY_ALERT = {
    id: 'nps', kind: 'survey', minutesAgo: 6, unread: true,
    actor: 'Alexandra Reyes', text: 'scored the firm 4 out of 10', case: CASE_TITLE,
    quote: 'It took three weeks to hear back after the settlement call…',
};

const BellItem = ({ n }) => {
    const kind = n.kind === 'survey' ? SURVEY_KIND : KINDS[n.kind];
    return (
        <button type="button" className={`np-item np-tint-${kind.tint}${n.unread ? ' unread' : ''}`}>
            <span className="np-item-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{kind.icon}</svg>
            </span>
            <span className="np-item-body">
                <span className="np-item-text"><strong>{n.actor}</strong> {n.text}</span>
                {n.quote && <span className="nps-bell-quote">“{n.quote}”</span>}
                <span className="np-item-meta">
                    <span className="np-item-case">{n.case}</span>
                    <span className="np-item-dot">·</span>
                    <span>{relativeTime(n.minutesAgo)}</span>
                </span>
            </span>
            <span className="np-item-right">{n.unread && <span className="np-item-unread-dot" />}</span>
        </button>
    );
};

const BellPopover = () => {
    const on = usePatched();
    const rows = [...(on ? [SURVEY_ALERT] : []), ...NOTIFICATIONS.filter(n => n.minutesAgo < 1440)];
    const unread = rows.filter(n => n.unread).length;
    return (
        <div className="np-popover">
            <div className="np-header">
                <div className="np-header-top">
                    <h3 className="np-title">Notifications <span className="np-unread-pill">{unread} new</span></h3>
                </div>
                <div className="np-filters">
                    <button type="button" className="np-filter active">All <span className="np-filter-count">{rows.length}</span></button>
                    <button type="button" className="np-filter">Unread <span className="np-filter-count">{unread}</span></button>
                </div>
            </div>
            <div className="np-list">
                <div className="np-group">
                    <div className="np-group-label">Today</div>
                    {rows.map(n => <BellItem key={n.id} n={n} />)}
                </div>
            </div>
            <div className="np-footer">
                <button type="button" className="np-footer-btn">View all notifications</button>
            </div>
        </div>
    );
};

/* ── Notification settings (Settings → Profile → Notifications) ──────────── */
const NotifGroup = () => (
    <div className="pv3-notif-group">
        <div className="pv3-notif-group-label">Surveys</div>
        <div className="pv3-notif-grid">
            <label className="pv3-notif-item">
                <span className="pv3-checkbox checked">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </span>
                <span className="pv3-notif-text">A client scores the firm 0 to 6</span>
            </label>
        </div>
    </div>
);

const NotifSettings = ({ who, role, email }) => (
    <AdminFrame
        nav="Settings" sub="Profile" title="Profile" breadcrumb="Settings · Profile"
        who={who} role={role} height={1330}
        patch={<Patch edits={[{ at: '.pv3-notif-list', mode: 'inside', pin: '14.10', children: <New><NotifGroup /></New> }]} />}
    >
        <div className="tk-mount">
            <AutoOpen clicks={['.pv3-tab:nth-child(3)']}>
                <ProfileView
                    onBack={() => {}}
                    userPrefill={{ firstName: who.split(' ')[0], lastName: who.split(' ')[1], email, role, memberSince: 'Mar 2023' }}
                />
            </AutoOpen>
        </div>
    </AdminFrame>
);

/* ── Admin: Settings → Automations → Survey (ca-manage) ──────────────────
   A sixth tab on the real Automations view. The trigger is a stage, as it is
   on Milestone next door, and the endpoint is /automations/cases/survey, so
   this is where an Admin already looks for "when a case enters a stage". */
const DEFAULTS = COPY.en;

const SurveyPanel = ({ on = true, rows = [{ stageId: 'stg-a85f12', caseType: 'All case types' }], refused, locked }) => {
    const { stages } = useStages();
    return (
        <>
            <div className="as-tab-panel">
                <div className="as-panel-header">
                    <div className="as-panel-title-wrap">
                        <div className="auto-section-label" style={{ margin: 0 }}>WHEN A CASE ENTERS A STAGE, ASK EACH CLIENT FOR A SCORE</div>
                        <p className="as-panel-subtitle">One question, by email and text, at 10am the next morning in the firm&apos;s time zone: how likely are they to recommend you, from 0 to 10. A score of 0 to 6 alerts the team straight away.</p>
                    </div>
                    <span className="nps-switch">
                        <span className="nps-switch-label">{on ? 'Surveys on' : 'Surveys off'}</span>
                        <Toggle on={on} />
                    </span>
                </div>
                {refused && (
                    <div className="auto-dup-warning nps-refused" role="alert">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                        <div>
                            <strong>{refused.title}</strong>
                            <span> {refused.message}</span>
                        </div>
                    </div>
                )}
                <div className="as-table-wrap">
                    <table className="as-table">
                        <thead><tr><th>Trigger stage</th><th>Case Type</th><th className="auto-action-cell">Action</th></tr></thead>
                        <tbody>
                            {rows.length === 0 && (
                                <tr><td colSpan={3} className="auto-empty-cell">No trigger stage yet. Click NEW to choose the stage that sends the survey.</td></tr>
                            )}
                            {rows.map(r => (
                                <tr key={r.stageId + r.caseType}>
                                    <td data-label="Stage"><StageLabel stage={findStage(stages, r.stageId)} variant="text" /></td>
                                    <td data-label="Case Type">{r.caseType}</td>
                                    <td className="auto-action-cell" data-label="Action">
                                        <div className="auto-row-actions">
                                            <button type="button" className="users-icon-btn auto-edit-icon" data-tooltip="Change stage">
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4Z" /></svg>
                                            </button>
                                            <button type="button" className="users-icon-btn auto-remove-icon" data-tooltip="Remove">
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="nps-hint">A case type with its own stage uses that one instead of the All case types stage.</p>
            </div>

            <div className="as-tab-panel">
                <div className="as-panel-header">
                    <div className="as-panel-title-wrap">
                        <h3 className="as-panel-title">Links</h3>
                        <p className="as-panel-subtitle">Where the follow-up buttons go. Leave one blank and its button is not shown.</p>
                    </div>
                </div>
                <div className="ccm-grid-2 nps-grid">
                    <ModalField label="Review link" hint="Shown to clients who score 9 or 10.">
                        <input className="ccm-input" defaultValue="https://g.page/r/sterling-brooks/review" readOnly />
                    </ModalField>
                    <ModalField label="Refer-a-friend link" hint="Shown to clients who score 7 or 8.">
                        <input className="ccm-input" defaultValue="https://sterlingbrooks.law/refer" readOnly />
                    </ModalField>
                </div>
            </div>

            <div className="as-tab-panel">
                <div className="as-panel-header">
                    <div className="as-panel-title-wrap">
                        <h3 className="as-panel-title">Wording</h3>
                        <p className="as-panel-subtitle">Leave a box blank to use ours, which is translated into each client&apos;s language. Anything you write is sent exactly as written, in every language.</p>
                    </div>
                </div>
                <div className="nps-wording">
                    <ModalField label="Question">
                        <input className="ccm-input" placeholder={DEFAULTS.question} readOnly />
                    </ModalField>
                    <ModalField label="Thank-you for 9 and 10">
                        <textarea className="ccm-input nps-ta" rows={2} placeholder={DEFAULTS.promoter} readOnly />
                    </ModalField>
                    <ModalField label="Thank-you for 7 and 8">
                        <textarea className="ccm-input nps-ta" rows={2} placeholder={DEFAULTS.passive} readOnly />
                    </ModalField>
                    <ModalField label="Apology for 0 to 6">
                        <textarea
                            className="ccm-input nps-ta" rows={2} readOnly
                            defaultValue="We're sorry we let you down. Tell us what went wrong and a partner will read it today."
                        />
                    </ModalField>
                </div>
            </div>

            {/* A Manager has nothing to save, so the row goes rather than dims. */}
            {!locked && (
                <div className="nps-actions">
                    <button type="button" className="as-text-btn sh-btn-danger">Turn off and clear settings</button>
                    <button type="button" className="as-primary-btn">Save</button>
                </div>
            )}
        </>
    );
};

const SurveySettings = ({ who = 'Robert Grant', role = 'Administrator', locked, modal, ...panel }) => (
    <AdminFrame
        nav="Settings" sub="Automations" newBtn={!locked} who={who} role={role} height={1180} modal={modal}
        patch={<Patch edits={[
            { at: '.as-tabs-bar', mode: 'inside', pin: '14.11', children: <New><button type="button" className="as-tab active">Survey</button></New> },
            { at: '.as-tabs-bar .as-tab.active', mode: 'mark', removeClass: 'active' },
            {
                at: '.as-content > .as-tab-panel', mode: 'replace',
                children: (
                    <New>
                        {locked
                            ? (
                                <LockedControl reason="Only an Admin can change survey settings." reasonFirst className="nps-locked">
                                    <SurveyPanel {...panel} locked />
                                </LockedControl>
                            )
                            : <SurveyPanel {...panel} />}
                    </New>
                ),
            },
        ]} />}
    >
        <div className="tk-mount"><AutomationsView /></div>
    </AdminFrame>
);

/* NEW on the Survey tab. Built on the Milestone window beside it. */
const AddStageModal = () => {
    const { stages } = useStages();
    const stage = findStage(stages, 'stg-a85f12');
    return (
        <div className="modal-overlay sh-scrim">
            <div className="ccm auto-idle-modal">
                <div className="ccm-header">
                    <h2 className="ccm-title">Add Trigger Stage</h2>
                    <span className="ccm-close">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </span>
                </div>
                <div className="ccm-body">
                    <div className="auto-modal-section">
                        <div className="auto-ms-rule-card">
                            <div className="ccm-section-label">Rule summary</div>
                            <p className="auto-ms-sentence">
                                When a case moves into <span className="auto-ms-slot is-set">{stage.name}</span>,
                                {' '}each client on it gets the survey at 10am the next morning.
                            </p>
                            <p className="auto-ms-scope">Applies to <span className="auto-ms-slot">all case types</span>.</p>
                        </div>
                        <div className="ccm-grid-2 auto-idle-grid">
                            <ModalField label={<>Stage <span className="ccm-req">*</span></>} hint={stage.description}>
                                <Select value={stage.name} options={stages.map(s => s.name)} />
                            </ModalField>
                            <ModalField label={<>Case type <span className="ccm-req">*</span></>} hint="A case type's own stage replaces the All case types stage.">
                                <Select value="All case types" options={['All case types', ...CASE_TYPES]} />
                            </ModalField>
                        </div>
                    </div>
                </div>
                <div className="ccm-footer">
                    <button type="button" className="ccm-cancel-btn">Cancel</button>
                    <button type="button" className="ccm-save-btn">SAVE</button>
                </div>
            </div>
        </div>
    );
};

/* ── Admin: NPS on the dashboard ─────────────────────────────────────────
   The real dashboard, mounted, with the Client NPS row patched in between the
   tiles and the chart. The row itself is in NpsRow.jsx. */
const Dashboard = ({ who, role, phone, answersOpen = false, month = null }) => {
    const frame = (
        <AdminFrame
            nav="Home" sub="Dashboard" who={who} role={role} height={phone ? undefined : 1180}
            patch={<Patch edits={[{
                at: '.portal-stats-row', mode: 'after', pin: '14.14',
                children: <New><NpsRow initialOpen={answersOpen} initialMonth={month} /></New>,
            }]} />}
        >
            <div className="tk-mount"><DashboardView /></div>
        </AdminFrame>
    );
    return phone ? <Phone>{frame}</Phone> : frame;
};

/* ── Admin and Manager: Home → Surveys, the answers list ─────────────────── */
const AnswersList = ({ band }) => <AnswersTable initialBand={band} framed />;

const AnswersScreen = ({ who, role, band, phone }) => {
    const on = usePatched();
    const frame = (
        <AdminFrame
            nav="Home" sub="Surveys" title="Surveys" breadcrumb="Home · Surveys"
            who={who} role={role} height={phone ? undefined : 1500}
            patch={<Patch edits={[{
                at: '.portal-subnav .portal-subnav-item:last-of-type', mode: 'after', pin: '14.16',
                children: <New><button type="button" className="portal-subnav-item active">Surveys</button></New>,
            }]} />}
        >
            {on ? <AnswersList band={band} /> : <NotBuilt what="answers list" />}
        </AdminFrame>
    );
    return phone ? <Phone>{frame}</Phone> : frame;
};

/* ── The ticket ─────────────────────────────────────────────────────────── */
export const NPS_TICKET = {
    no: 14,
    key: 'NPS-1',
    ticketName: 'Post-settlement NPS: client answer page, survey settings and results',
    domain: 'ca-account, ca-manage, ca-app',
    status: 'To Do',
    severity: 'Medium',
    link: 'https://caseactive.slack.com/lists/TJQSXGPJB/F09M1DLSBC6?record_id=Rec0C7V638STZ',
    title: 'Post-settlement NPS',
    roles: ['client', 'staff', 'admin', 'manager'],
    brief: [
        'The survey email and text: the question with 0–10 buttons inside the email itself, in the firm\'s branding.',
        'The answer page, on computer and phone: the score row, then the three follow-ups. 9–10: a review button. 7–8: a quote box with a permission tick and a refer-a-friend link. 0–6: an apology and a "what went wrong" box.',
        'The answer page\'s other states: thank you after submitting, link expired, already answered. Reached without signing in, like the unsubscribe page: no app header, menu or profile, just the firm\'s logo and name, in the client\'s language. From the email the page opens on the follow-up; from the text it opens on the 0–10 row; a bad link gets a generic page with no firm branding.',
        'On the case page, where staff see a client\'s score, comment and quote. Clients never see it.',
        'The survey settings page alongside the other automations: on or off, trigger stage, review link, refer-a-friend link, wording.',
        'The NPS tile on the dashboard and the monthly NPS chart.',
        'The answers list: date, client, case, score, comment, quote permission, with a filter by score band.',
    ],
    alsoKnown: 'GET /v1/survey returns host_name, logo_url and locale and no brand colour, so the client\'s pages are branded by logo and name and keep CaseActive\'s accent. The ticket\'s example trigger is "Settlement paid"; this hub\'s stages run Intake to Resolved, so the screens use Resolved. The alert also goes to every Admin, but the ticket gives the mute switch to staff and Managers only (see 14.10).',
    decision: 'The client\'s 0–10 row is neutral: no red, amber or green on the numbers, because colouring 0–6 red tells the client which answer the firm wants. Band colours appear only on staff screens. The page is one card that grows rather than a sequence of pages: the score stays on top and stays changeable, the follow-up for its band opens beneath it, and "Score saved" under the row tells the client the follow-up is optional and they can leave. On phones the row breaks 0–5 over 6–10 so every number is a 48px target; eleven across a 358px screen would be 28px. On the dashboard NPS gets a full-width row of its own under the four tiles, with its monthly chart inside it, instead of a fifth tile that squeezed the other four and a chart option hidden behind the Overview select. Settings are a sixth Automations tab, because the trigger is a stage like Milestone beside it and the endpoint lives under /automations. The answers list sits under Home beside Inquiries, since it is read and acted on rather than configured.',
    items: [
        { id: '14.1', what: 'Survey email: firm logo and name, the question, and 0–10 as eleven links, each opening the answer page with its score.', where: 'Email, sent at 10am firm time the day after the trigger stage', file: 'Not in this codebase (server template)', roles: ['client'], missing: true },
        { id: '14.2', what: 'Survey text: the question and one link, with no score in it.', where: 'Text message', file: 'Not in this codebase (server template)', roles: ['client'], missing: true },
        { id: '14.3', what: 'Answer page at {account}/survey under AlwaysAllowGuard: no app chrome, firm logo and name, in the client\'s locale.', where: 'Account site → /survey?t=&score=', file: 'Not in this codebase (ca-account)', roles: ['client'], missing: true },
        { id: '14.4', what: 'Score row: eleven neutral buttons. From the email the score is set and saved once the page is visible; from the text the page opens on the row.', where: '/survey', file: 'Not in this codebase (ca-account)', roles: ['client'], missing: true },
        { id: '14.5', what: 'Follow-ups by band: review button for 9–10; quote box, consent tick and referral link for 7–8; apology and comment box for 0–6.', where: '/survey', file: 'Not in this codebase (ca-account)', roles: ['client'], missing: true },
        { id: '14.6', what: 'Thank you after sending, and an answered survey reopening with its saved answer, changeable until the link expires.', where: '/survey', file: 'Not in this codebase (ca-account)', roles: ['client'], missing: true },
        { id: '14.7', what: 'Expired: a closed page with the firm\'s logo and name. Bad link: a generic page with no firm branding.', where: '/survey', file: 'Not in this codebase (ca-account)', roles: ['client'], missing: true },
        { id: '14.8', what: 'Surveys tab on the case: every client\'s survey including scheduled ones, with status, score, band, comment and quote. Staff only.', where: 'Case → Surveys ({app}/{case_id}/surveys)', file: 'src/views/caseNav.jsx, new src/views/SurveysView.jsx', roles: ['staff'] },
        { id: '14.9', what: 'Bell alert app_detractor_surveys: score and the start of the comment. Opens the case tab for people on the case, the answers list filtered to detractors for everyone else.', where: 'Bell, both sites', file: 'src/components/NotificationsPopover.jsx (KINDS, KIND_FILTERS)', roles: ['staff', 'manager', 'admin'] },
        { id: '14.10', what: 'A Surveys group in notification settings with one switch, app_detractor_surveys.', where: 'Settings → Profile → Notifications', file: 'src/views/ProfileView.jsx (NOTIF_GROUPS)', roles: ['staff', 'manager'] },
        { id: '14.11', what: 'Automations → Survey tab: on or off, trigger stages by case type, review and referral links, and the four pieces of wording.', where: 'Settings → Automations → Survey', file: 'src/views/settings/AutomationsView.jsx', roles: ['admin', 'manager'] },
        { id: '14.12', what: 'SurveyStageRequiredException, said in words: turning on with no stage, and removing the last stage while on.', where: 'Settings → Automations → Survey', file: 'src/views/settings/AutomationsView.jsx', roles: ['admin'] },
        { id: '14.13', what: 'Add Trigger Stage window, built on the Milestone window.', where: 'Automations → Survey → NEW', file: 'src/views/settings/AutomationsView.jsx', roles: ['admin'] },
        { id: '14.14', what: 'Client NPS row on the dashboard, full width under the tiles: NPS with its change on the year before, answered of sent, and Promoters, Passives and Detractors with count and share.', where: 'Home → Dashboard', file: 'src/views/DashboardView.jsx', roles: ['admin', 'manager'] },
        { id: '14.15', what: 'Monthly NPS chart inside the NPS row: bars on a fixed -100 to 100 axis, a dash for months with no answers.', where: 'Home → Dashboard → Client NPS', file: 'src/views/DashboardView.jsx', roles: ['admin', 'manager'] },
        { id: '14.16', what: 'Answers list at {manage}/surveys: band and period filters, a summary of what they add up to, numbered pages of ten, each row opens its case.', where: 'Home → Surveys', file: 'src/adminNav.jsx, new src/views/SurveysListView.jsx', roles: ['admin', 'manager'] },
        { id: '14.18', what: 'View answers, or a click on a month in the chart, opens the answers in a window over the dashboard, on that period: the 14.16 list and a link to the full page.', where: 'Home → Dashboard → Client NPS → View answers', file: 'src/views/DashboardView.jsx, the list from 14.16', roles: ['admin', 'manager'] },
        { id: '14.17', what: 'Survey statuses and band pills in the shared status vocabulary.', where: 'Everywhere a survey shows', file: 'src/components/statuses.js', roles: ['staff', 'admin', 'manager'] },
    ],
    screens: [
        /* ── Client ── */
        {
            id: 'email', label: 'Survey email', roles: ['client'],
            note: 'Each number is its own link to /survey?t=<token>&score=<n>. Opening the email changes nothing; tapping a number opens the page with that score.',
            render: () => (
                <ClientScreen what="survey email" url="Mail" height={620}
                    aside="The buttons are links, not a form: most email apps strip forms. On a phone the eleven cells share the width, each at least 44px tall.">
                    <SurveyEmail />
                </ClientScreen>
            ),
        },
        {
            id: 'text', label: 'Survey text', roles: ['client'], phone: true,
            note: 'The text carries one link with no score, so it opens the page on the 0–10 row.',
            render: () => (
                <ClientScreen what="survey text" phoneOnly>
                    <SurveyText />
                </ClientScreen>
            ),
        },
        {
            id: 'from-email', label: 'Answer page · from the email', roles: ['client'],
            note: 'Opened by tapping 10 in the email. The score is already picked and saved, so the page opens on the follow-up. Every number on the row still works: tap one to see its band.',
            render: () => (
                <ClientScreen what="survey answer page" url={`${ACCOUNT}/survey?t=7Hk2qP9x&score=10`} height={600}>
                    <SurveyPage score={10} />
                </ClientScreen>
            ),
        },
        {
            id: 'from-text', label: 'Answer page · from the text', roles: ['client'],
            note: 'No score in the link, so nothing is saved until the client taps a number. Then it saves at once and the follow-up opens.',
            render: () => (
                <ClientScreen what="survey answer page" url={`${ACCOUNT}/survey?t=7Hk2qP9x`} height={420}>
                    <SurveyPage />
                </ClientScreen>
            ),
        },
        {
            id: 'passive', label: 'Answer page · 7 or 8', roles: ['client'],
            note: 'A quote box, the permission tick, and the referral link. No review button: the server sends review_url to promoters only.',
            render: () => (
                <ClientScreen what="survey answer page" url={`${ACCOUNT}/survey?t=7Hk2qP9x&score=8`} height={780}>
                    <SurveyPage score={8} />
                </ClientScreen>
            ),
        },
        {
            id: 'detractor', label: 'Answer page · 0 to 6', roles: ['client'],
            note: 'An apology and one box. No review link, no referral link. The score has already alerted the team by the time the client reads this.',
            render: () => (
                <ClientScreen what="survey answer page" url={`${ACCOUNT}/survey?t=7Hk2qP9x&score=4`} height={660}>
                    <SurveyPage score={4} />
                </ClientScreen>
            ),
        },
        {
            id: 'thanks', label: 'Thank you', roles: ['client'],
            note: 'After Send. Change my answer reopens the form with what they wrote.',
            render: () => (
                <ClientScreen what="survey answer page" url={`${ACCOUNT}/survey?t=7Hk2qP9x&score=4`} height={420}>
                    <SurveyPage score={4} state="thanks" answer={{ comment: 'It took three weeks to hear back after the settlement call.' }} />
                </ClientScreen>
            ),
        },
        {
            id: 'answered', label: 'Already answered', roles: ['client'],
            note: 'The link opened again inside the 30 days. The saved answer is filled in and every part of it can change. A closed case makes no difference.',
            render: () => (
                <ClientScreen what="survey answer page" url={`${ACCOUNT}/survey?t=7Hk2qP9x`} height={760}>
                    <SurveyPage
                        score={8} state="answered"
                        answer={{ testimonial: 'Good outcome. Updates were slow in the middle.', consent: true }}
                    />
                </ClientScreen>
            ),
        },
        {
            id: 'expired', label: 'Link expired', roles: ['client'],
            note: 'Opened from an old email by tapping 9. GET answers 200 with expired: true and only host_name, logo_url and locale, so the page is branded and closed, and says the 9 it was given was not saved.',
            render: () => (
                <ClientScreen what="survey answer page" url={`${ACCOUNT}/survey?t=7Hk2qP9x&score=9`} height={600}>
                    <SurveyPage state="expired" urlScore={9} />
                </ClientScreen>
            ),
        },
        {
            id: 'invalid', label: 'Bad link', roles: ['client'],
            note: 'SurveyLinkInvalidException: a bad, unsent or deleted token. The page does not know which firm it is, so it names none and has no header, and gives two things to try.',
            render: () => (
                <ClientScreen what="survey answer page" url={`${ACCOUNT}/survey?t=xx`} height={600}>
                    <SurveyPage state="invalid" />
                </ClientScreen>
            ),
        },
        {
            id: 'spanish', label: 'In the client\'s language', roles: ['client'],
            note: 'locale: es. Every word on the page is ours and translated, except the firm\'s name and anything the firm wrote in settings.',
            render: () => (
                <ClientScreen what="survey answer page" url={`${ACCOUNT}/survey?t=7Hk2qP9x&score=8`} height={720}>
                    <SurveyPage score={8} locale="es" />
                </ClientScreen>
            ),
        },

        /* ── Staff ── */
        {
            id: 'case', label: 'Case → Surveys', roles: ['staff'],
            note: 'A new case tab, after Overview. Scheduled surveys are listed before they send, so staff can see one is coming. Clients get 403 on this endpoint and never see the tab.',
            render: () => <CaseSurveysScreen />,
        },
        {
            id: 'case-phone', label: 'Case → Surveys · phone', roles: ['staff'], phone: true,
            note: 'The same table at phone width, where each row becomes a card and each cell carries its label.',
            render: () => (
                <Proposal instead={<NotBuilt what="Surveys tab on a case" />}>
                    <Phone><CaseSurveysScreen /></Phone>
                </Proposal>
            ),
        },
        {
            id: 'bell', label: 'Bell · low score alert', roles: ['staff', 'manager', 'admin'],
            note: 'The real popover\'s rows with the survey alert on top. For someone on the case it opens Case → Surveys; for a Manager or the Admin who is not, it opens Home → Surveys filtered to detractors.',
            render: (role) => (
                <AdminFrame
                    nav="Home" sub="Dashboard" height={640}
                    who={role === 'staff' ? 'Marcus Bell' : role === 'manager' ? 'Elena Ramirez' : 'Robert Grant'}
                    role={role === 'staff' ? 'Staff · Lead Attorney' : role === 'manager' ? 'Manager' : 'Administrator'}
                    overlay={<IntoBell><BellPopover /></IntoBell>}
                >
                    <div className="portal-content" />
                </AdminFrame>
            ),
        },
        {
            id: 'notif', label: 'Notification settings', roles: ['staff', 'manager'],
            note: 'The real Profile → Notifications tab with a Surveys group at the end. Unticking it stops the bell, email and text alert for that person.',
            render: (role) => (role === 'manager'
                ? <NotifSettings who="Elena Ramirez" role="Manager" email="elena.ramirez@sterlingbrooks.law" />
                : <NotifSettings who="Marcus Bell" role="Staff · Lead Attorney" email="marcus.bell@sterlingbrooks.law" />),
        },

        /* ── Admin and Manager ── */
        {
            id: 'settings', label: 'Automations → Survey', roles: ['admin', 'manager'],
            note: 'The real Automations view with a sixth tab. A Manager sees the same tab locked, per HF-15.',
            render: (role) => (role === 'manager'
                ? <SurveySettings who="Elena Ramirez" role="Manager" locked />
                : <SurveySettings />),
        },
        {
            id: 'required', label: 'Survey · no trigger stage', roles: ['admin'],
            note: 'SurveyStageRequiredException after switching on with no stage. The switch stays off and the reason sits right under it.',
            render: () => (
                <SurveySettings
                    on={false} rows={[]}
                    refused={{
                        title: 'Add a trigger stage first.',
                        message: 'Surveys go out when a case enters one, so with none they would never send.',
                    }}
                />
            ),
        },
        {
            id: 'last', label: 'Survey · removing the last stage', roles: ['admin'],
            note: 'The same exception from DELETE on the last stage while surveys are on. The row stays.',
            render: () => (
                <SurveySettings
                    refused={{
                        title: 'Resolved is the only trigger stage.',
                        message: 'Add another stage before removing it, or turn surveys off.',
                    }}
                />
            ),
        },
        {
            id: 'add', label: 'Add Trigger Stage', roles: ['admin'],
            note: 'NEW on the Survey tab. The Milestone window\'s rule summary, saying what will happen in one sentence.',
            render: () => <SurveySettings modal={<Proposal><AddStageModal /></Proposal>} />,
        },
        {
            id: 'dashboard', label: 'Dashboard · NPS', roles: ['admin', 'manager'],
            note: 'The real dashboard with a full-width Client NPS row between the tiles and Overview. Pick 6, 12 or 24 months; hover or tab across the chart to read any month. Months with no answers break the line and show a dash, never 0.',
            render: (role) => (role === 'manager'
                ? <Dashboard who="Elena Ramirez" role="Manager" />
                : <Dashboard who="Robert Grant" role="Administrator" />),
        },
        {
            id: 'dashboard-answers', label: 'Dashboard · View answers', roles: ['admin', 'manager'],
            note: 'View answers opens the answers in a window over the dashboard, on the period the chart is showing. Band and period filters, a summary of what they add up to, and pages of ten: the same list as Home → Surveys. Close, Escape or a click outside puts you back on the dashboard.',
            render: (role) => <Dashboard answersOpen who={role === 'manager' ? 'Elena Ramirez' : 'Robert Grant'} role={role === 'manager' ? 'Manager' : 'Administrator'} />,
        },
        {
            id: 'dashboard-month', label: 'Dashboard · a month\'s answers', roles: ['admin', 'manager'],
            note: 'Clicking a month on the chart opens the window on that month alone, as a custom range. Widen it from the period menu or the two month pickers.',
            render: (role) => <Dashboard month="2026-07" who={role === 'manager' ? 'Elena Ramirez' : 'Robert Grant'} role={role === 'manager' ? 'Manager' : 'Administrator'} />,
        },
        {
            id: 'dashboard-answers-phone', label: 'Dashboard · View answers · phone', roles: ['admin', 'manager'], phone: true,
            note: 'On a phone the window fills the screen and the rows become cards.',
            render: (role) => <Dashboard phone answersOpen who={role === 'manager' ? 'Elena Ramirez' : 'Robert Grant'} role={role === 'manager' ? 'Manager' : 'Administrator'} />,
        },
        {
            id: 'dashboard-phone', label: 'Dashboard · NPS · phone', roles: ['admin', 'manager'], phone: true,
            note: 'The row stacks: score, then the split, then the months. The chart keeps its size and scrolls sideways rather than shrinking its labels away.',
            render: (role) => (role === 'manager'
                ? <Dashboard phone who="Elena Ramirez" role="Manager" />
                : <Dashboard phone who="Robert Grant" role="Administrator" />),
        },
        {
            id: 'answers', label: 'Home → Surveys', roles: ['admin', 'manager'],
            note: 'Newest first, filtered by band and period, ten to a page. The filters and pages work.',
            render: (role) => (role === 'manager'
                ? <AnswersScreen who="Elena Ramirez" role="Manager" />
                : <AnswersScreen who="Robert Grant" role="Administrator" />),
        },
        {
            id: 'answers-detractors', label: 'Home → Surveys · from the alert', roles: ['admin', 'manager'],
            note: 'Where the alert lands for someone not on the case: ?band=detractor.',
            render: (role) => <AnswersScreen band="detractor" who={role === 'manager' ? 'Elena Ramirez' : 'Robert Grant'} role={role === 'manager' ? 'Manager' : 'Administrator'} />,
        },
        {
            id: 'answers-phone', label: 'Home → Surveys · phone', roles: ['admin', 'manager'], phone: true,
            note: 'At phone width the table becomes cards, so the comment gets the full width.',
            render: (role) => <AnswersScreen phone who={role === 'manager' ? 'Elena Ramirez' : 'Robert Grant'} role={role === 'manager' ? 'Manager' : 'Administrator'} />,
        },
    ],
};
