/* The survey answers list (NPS-1, item 14.16), shared by Home → Surveys and
   the View answers window on the dashboard, so the two cannot drift apart.

   Two filters, band and period, then numbered pages of ten. The period
   offers the same spans the dashboard chart does, whole years, and a custom
   month range, so whatever the chart showed can be read here answer by
   answer. A summary line says what the filters add up to. */

import { useRef, useState } from 'react';
import StatusPill from '../../../components/StatusPill';
import SearchableSelect from '../../../components/SearchableSelect';
import {
    ANSWERS, MONTHS, NOW, NOW_KEY, addMonths, bandOf, keyLabel, npsOf,
} from './answersData';
import '../../PaymentsView.css';

const PAGE_SIZE = 10;
const FIRST_KEY = MONTHS[0].key;

const BANDS = [['all', 'All'], ['promoter', 'Promoters'], ['passive', 'Passives'], ['detractor', 'Detractors']];

const PERIODS = [
    ['6m', 'Last 6 months'],
    ['12m', 'Last 12 months'],
    ['24m', 'Last 24 months'],
    [`y${NOW.y}`, `${NOW.y}`],
    [`y${NOW.y - 1}`, `${NOW.y - 1}`],
    [`y${NOW.y - 2}`, `${NOW.y - 2}`],
    ['all', 'All time'],
    ['custom', 'Custom range'],
];

/* A period as the [from, to] month keys the endpoint would be sent. */
const spanOf = (period, custom) => {
    if (period === 'custom') return custom;
    if (period === 'all') return [FIRST_KEY, NOW_KEY];
    if (period.startsWith('y')) {
        const y = Number(period.slice(1));
        return [`${y}-01`, y === NOW.y ? NOW_KEY : `${y}-12`];
    }
    const n = Number(period.slice(0, -1));
    return [addMonths(NOW_KEY, -(n - 1)), NOW_KEY];
};

export const ScoreCell = ({ score }) => (score == null
    ? <span className="cf-empty">—</span>
    : (
        <span className="nps-score-cell">
            <span className={`nps-score nps-score-${bandOf(score)}`}>{score}</span>
            <StatusPill status={bandOf(score)} />
        </span>
    ));

export const Words = ({ row }) => {
    if (row.comment) return <span className="nps-words">{row.comment}</span>;
    if (row.testimonial) {
        return (
            <span className="nps-words">
                <q>{row.testimonial}</q>
                <span className={`nps-consent-tag${row.consent ? ' is-yes' : ''}`}>{row.consent ? 'May be shared' : 'Private'}</span>
            </span>
        );
    }
    return <span className="cf-empty">—</span>;
};

/* The app's pager, as Payments draws it. */
const Pager = ({ page, pages, total, onPage }) => {
    const start = (page - 1) * PAGE_SIZE + 1;
    const end = Math.min(page * PAGE_SIZE, total);
    const list = [];
    for (let p = 1; p <= pages; p += 1) {
        if (p === 1 || p === pages || Math.abs(p - page) <= 1) list.push(p);
        else if (list[list.length - 1] !== '…') list.push('…');
    }
    return (
        <nav className="pay-pagination nps-pager" aria-label="Answers pages">
            <span className="pay-pagination-summary">
                Showing <strong>{start}–{end}</strong> of <strong>{total}</strong> answers
            </span>
            <div className="pay-pagination-controls">
                <button type="button" className="pay-page-btn" disabled={page === 1} onClick={() => onPage(page - 1)} aria-label="Previous page">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                </button>
                {list.map((p, i) => (p === '…'
                    ? <span key={`e${i}`} className="pay-page-ellipsis">…</span>
                    : (
                        <button key={p} type="button" className={`pay-page-btn${p === page ? ' active' : ''}`}
                            aria-current={p === page ? 'page' : undefined} onClick={() => onPage(p)}>{p}</button>
                    )))}
                <button type="button" className="pay-page-btn" disabled={page === pages} onClick={() => onPage(page + 1)} aria-label="Next page">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
            </div>
        </nav>
    );
};

/* framed: the Home → Surveys page, with the list inside a panel. Unframed
   is for a window, whose own header already says what this is.
   initialPeriod is a PERIODS id; initialSpan sets a custom [from, to]. */
const AnswersTable = ({ initialBand = 'all', initialPeriod = '12m', initialSpan, framed = false }) => {
    const [band, setBand] = useState(initialBand);
    const [period, setPeriod] = useState(initialSpan ? 'custom' : initialPeriod);
    const [custom, setCustom] = useState(initialSpan || spanOf('12m'));
    const [page, setPage] = useState(1);
    const topRef = useRef(null);

    const [from, to] = spanOf(period, custom);
    const inSpan = ANSWERS.filter(r => r.key >= from && r.key <= to);
    const rows = inSpan.filter(r => band === 'all' || bandOf(r.score) === band);
    const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
    const shown = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const p = inSpan.filter(r => bandOf(r.score) === 'promoter').length;
    const d = inSpan.filter(r => bandOf(r.score) === 'detractor').length;
    const nps = npsOf(p, d, inSpan.length);
    const spanLabel = from === to ? keyLabel(from) : `${keyLabel(from)} – ${keyLabel(to)}`;

    const go = (n) => {
        setPage(n);
        topRef.current?.scrollIntoView({ block: 'nearest' });
    };
    const pickBand = (id) => { setBand(id); setPage(1); };
    const pickPeriod = (id) => {
        /* Custom starts from whatever was showing, so it is a tweak rather
           than a blank form. */
        if (id === 'custom') setCustom([from, to]);
        setPeriod(id);
        setPage(1);
    };
    const setEnd = (i, value) => {
        if (!value) return;
        const next = [...custom];
        next[i] = value;
        if (next[0] > next[1]) next[i === 0 ? 1 : 0] = value;
        setCustom(next);
        setPage(1);
    };

    const filters = (
        <div className="nps-filters" ref={topRef}>
            <div className="as-tabs-bar nps-band-tabs" role="tablist" aria-label="Score band">
                {BANDS.map(([id, label]) => (
                    <button key={id} type="button" role="tab" aria-selected={band === id}
                        className={`as-tab${band === id ? ' active' : ''}`}
                        onClick={() => pickBand(id)}
                    >{label}</button>
                ))}
            </div>
            <div className="nps-period">
                <SearchableSelect
                    className="portal-chart-select nps-period-select" aria-label="Period"
                    value={period} onChange={e => pickPeriod(e.target.value)}
                >
                    {PERIODS.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
                </SearchableSelect>
                {period === 'custom' && (
                    <div className="portal-chart-date-controls nps-period-range" aria-label="Custom range">
                        <input className="portal-chart-date-input" type="month" aria-label="From month"
                            min={FIRST_KEY} max={NOW_KEY} value={custom[0]} onChange={e => setEnd(0, e.target.value)} />
                        <span className="portal-chart-date-separator">to</span>
                        <input className="portal-chart-date-input" type="month" aria-label="To month"
                            min={FIRST_KEY} max={NOW_KEY} value={custom[1]} onChange={e => setEnd(1, e.target.value)} />
                    </div>
                )}
            </div>
        </div>
    );

    const summary = (
        <p className="nps-list-sum" role="status">
            <span>{spanLabel}</span>
            <span>NPS <strong>{nps == null ? '—' : nps < 0 ? `−${Math.abs(nps)}` : nps}</strong></span>
            <span><strong>{inSpan.length}</strong> answers</span>
            {band !== 'all' && <span><strong>{rows.length}</strong> {BANDS.find(b => b[0] === band)[1].toLowerCase()}</span>}
        </p>
    );

    const table = (
        <>
            <div className="as-table-wrap">
                <table className="as-table nps-table nps-answers">
                    <thead>
                        <tr><th>Answered</th><th>Client</th><th>Case</th><th>Score</th><th>Comment or quote</th></tr>
                    </thead>
                    <tbody>
                        {shown.length === 0 && (
                            <tr>
                                <td colSpan={5} className="auto-empty-cell">
                                    {inSpan.length === 0
                                        ? `No answers in ${spanLabel}.`
                                        : `No ${BANDS.find(b => b[0] === band)[1].toLowerCase()} in ${spanLabel}.`}
                                </td>
                            </tr>
                        )}
                        {shown.map(r => (
                            <tr key={r.id} className="nps-row" title={`Open ${r.case}`}>
                                <td data-label="Answered" className="nps-when">{r.on}</td>
                                <td data-label="Client" className="nps-strong">{r.name || <span className="nps-former">Former client</span>}</td>
                                <td data-label="Case">
                                    <span className="nps-case-stack">
                                        <span className="nps-case">{r.case}</span>
                                        <span className="nps-ref">{r.ref}</span>
                                    </span>
                                </td>
                                <td data-label="Score"><ScoreCell score={r.score} /></td>
                                <td data-label="Words"><Words row={r} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {rows.length > PAGE_SIZE && <Pager page={page} pages={pages} total={rows.length} onPage={go} />}
        </>
    );

    if (!framed) return <>{filters}{summary}{table}</>;
    return (
        <div className="portal-content as-content">
            {filters}
            <div className="as-tab-panel">
                <div className="as-panel-header">
                    <div className="as-panel-title-wrap">
                        <h3 className="as-panel-title">Survey answers</h3>
                        <p className="as-panel-subtitle">Newest first. Open a row to go to its case.</p>
                    </div>
                </div>
                {summary}
                {table}
            </div>
        </div>
    );
};

export default AnswersTable;
