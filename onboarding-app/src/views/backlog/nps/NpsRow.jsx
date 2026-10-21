/* The Client NPS row on the dashboard (NPS-1, items 14.14 and 14.15).

   Full width under the four tiles. Left, the score for the chosen range and
   what it is made of; right, how it moved month by month, with the number of
   answers under each month so a thin month reads as thin. The range control
   is the only filter /metrics/nps takes: whole months, at most 24. */

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import AnswersTable from './AnswersTable';
import { MAX_MONTHS, MONTHS, npsOf } from './answersData';

const total = (rows) => {
    const t = rows.reduce((a, r) => ({
        sent: a.sent + r.sent, answered: a.answered + r.answered,
        promoters: a.promoters + r.promoters, passives: a.passives + r.passives, detractors: a.detractors + r.detractors,
    }), { sent: 0, answered: 0, promoters: 0, passives: 0, detractors: 0 });
    return { ...t, nps: npsOf(t.promoters, t.detractors, t.answered) };
};

const RANGES = [6, 12, 24];

/* A typographic minus, never a hyphen. */
const fmt = (n) => (n == null ? '—' : n < 0 ? `−${Math.abs(n)}` : `${n}`);

/* Draws at the width it is given rather than scaling a viewBox, so the
   labels stay 11px whether the column is 400px or 1000px wide. */
const useWidth = () => {
    const ref = useRef(null);
    const [width, setWidth] = useState(0);
    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return undefined;
        const RO = el.ownerDocument.defaultView.ResizeObserver;
        const ro = new RO(([entry]) => setWidth(Math.round(entry.contentRect.width)));
        ro.observe(el);
        return () => ro.disconnect();
    }, []);
    return [ref, width];
};

/* ── The chart ───────────────────────────────────────────────────────────
   The axis always runs to 100 and starts at 0, or at −100 once any month
   goes below zero. It never fits itself to the data: NPS has a fixed scale,
   and a chart that stretches 38 to 52 across its whole height turns a quiet
   year into a dramatic one. */
const PLOT_H = 168;
const VOL_H = 34;
const LEFT = 34;
const RIGHT = 8;
const TOP = 12;

const TrendChart = ({ months, active, onActive, onPick }) => {
    const [ref, width] = useWidth();
    const W = Math.max(width, 320);
    const floor = months.some(r => r.nps != null && r.nps < 0) ? -100 : 0;
    const ticks = floor < 0 ? [100, 50, 0, -50, -100] : [100, 75, 50, 25, 0];
    const slot = (W - LEFT - RIGHT) / months.length;
    const cx = (i) => LEFT + slot * i + slot / 2;
    const cy = (v) => TOP + ((100 - v) / (100 - floor)) * PLOT_H;
    const maxAns = Math.max(...months.map(r => r.answered), 1);
    const volTop = TOP + PLOT_H + 14;

    /* The line breaks where a month has no answers: joining across the gap
       would draw a score nobody gave. */
    const runs = [];
    months.forEach((r, i) => {
        if (r.nps == null) return;
        const prev = runs[runs.length - 1];
        if (prev && prev.at(-1) === i - 1) prev.push(i);
        else runs.push([i]);
    });
    const path = (run) => run.map((i, k) => `${k ? 'L' : 'M'}${cx(i)},${cy(months[i].nps)}`).join(' ');
    const area = (run) => `${path(run)} L${cx(run.at(-1))},${cy(floor)} L${cx(run[0])},${cy(floor)} Z`;

    const a = months[active];
    /* The readout centres on its month, and turns to face inward near
       either edge so it never runs off the card. */
    const x = cx(active);
    const tip = x < 150 ? { left: x - 18, transform: 'none' }
        : x > W - 150 ? { left: x + 18, transform: 'translateX(-100%)' }
        : { left: x, transform: 'translateX(-50%)' };

    return (
        <div className="nps-trend" ref={ref}>
            {width > 0 && (
                <svg width={W} height={volTop + VOL_H + 24} className="nps-trend-svg" role="img"
                    aria-label={`NPS by month, ${months[0].m} ${months[0].y} to ${months.at(-1).m} ${months.at(-1).y}`}>
                    <defs>
                        <linearGradient id="nps-area" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#149EB1" stopOpacity="0.16" />
                            <stop offset="100%" stopColor="#149EB1" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {ticks.map(v => (
                        <g key={v}>
                            <line x1={LEFT} x2={W - RIGHT} y1={cy(v)} y2={cy(v)}
                                stroke={v === 0 ? '#CBD5E1' : '#EEF2F6'} />
                            <text x={LEFT - 8} y={cy(v) + 3.5} textAnchor="end" className="nps-trend-tick">{fmt(v)}</text>
                        </g>
                    ))}

                    {/* The month under the pointer. */}
                    <rect x={LEFT + slot * active} y={TOP} width={slot} height={volTop + VOL_H - TOP} rx="6" className="nps-trend-band" />

                    {runs.map(run => <path key={`a${run[0]}`} d={area(run)} fill="url(#nps-area)" />)}
                    {runs.map(run => (
                        <path key={`l${run[0]}`} d={path(run)} fill="none" stroke="#149EB1" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                    ))}
                    {months.map((r, i) => (r.nps == null
                        ? <text key={i} x={cx(i)} y={cy(floor) - 6} textAnchor="middle" className="nps-trend-none">—</text>
                        : (
                            <circle key={i} cx={cx(i)} cy={cy(r.nps)} r={i === active ? 5 : 3.5}
                                fill={i === active ? '#149EB1' : '#fff'} stroke="#149EB1" strokeWidth="2" />
                        )))}

                    {/* Answers per month, on their own scale under the line. */}
                    {months.map((r, i) => {
                        const h = r.answered ? Math.max(3, (r.answered / maxAns) * VOL_H) : 0;
                        return (
                            <rect key={`v${i}`} x={cx(i) - Math.min(slot * 0.28, 9)} width={Math.min(slot * 0.56, 18)}
                                y={volTop + VOL_H - h} height={h} rx="2"
                                className={`nps-trend-vol${i === active ? ' is-on' : ''}`} />
                        );
                    })}

                    {months.map((r, i) => (
                        (months.length <= 12 || i % 2 === (months.length - 1) % 2) && (
                            <text key={`m${i}`} x={cx(i)} y={volTop + VOL_H + 17} textAnchor="middle"
                                className={`nps-trend-month${i === active ? ' is-on' : ''}`}>
                                {r.m === 'Jan' || i === 0 ? `${r.m} ’${String(r.y).slice(2)}` : r.m}
                            </text>
                        )
                    ))}

                    {/* Hit areas: one per month, reachable by keyboard too. */}
                    {months.map((r, i) => (
                        <rect key={`h${i}`} x={LEFT + slot * i} y={TOP} width={slot} height={volTop + VOL_H - TOP}
                            fill="transparent" tabIndex={0} className="nps-trend-hit"
                            role="button"
                            aria-label={`${r.m} ${r.y}: ${r.nps == null ? 'no answers' : `NPS ${fmt(r.nps)}, ${r.answered} answered. Open its answers.`}`}
                            onMouseEnter={() => onActive(i)} onFocus={() => onActive(i)}
                            onClick={() => r.answered && onPick(i)}
                            onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && r.answered) { e.preventDefault(); onPick(i); } }} />
                    ))}
                </svg>
            )}

            {width > 0 && (
                <div className="nps-tip" style={tip} role="status">
                    <span className="nps-tip-when">{a.m} {a.y}</span>
                    {a.nps == null ? (
                        <span className="nps-tip-none">No answers · {a.sent} sent</span>
                    ) : (
                        <>
                            <span className="nps-tip-score">NPS <strong>{fmt(a.nps)}</strong></span>
                            <span className="nps-tip-mix">
                                <i className="is-promoter" />{a.promoters}
                                <i className="is-passive" />{a.passives}
                                <i className="is-detractor" />{a.detractors}
                                <span className="nps-tip-of">· {a.answered} of {a.sent}</span>
                            </span>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

/* ── The summary ────────────────────────────────────────────────────────── */
const BANDS = [
    ['promoters', 'Promoters', '9–10'],
    ['passives', 'Passives', '7–8'],
    ['detractors', 'Detractors', '0–6'],
];

const Summary = ({ t, change, months }) => (
    <div className="nps-sum">
        <div className="nps-sum-top">
            <span className="nps-sum-label">NPS · last {months} months</span>
            <div className="nps-sum-score">
                <span className="nps-sum-value">{fmt(t.nps)}</span>
                {change != null && (
                    <span className={`nps-sum-change ${change >= 0 ? 'is-up' : 'is-down'}`}
                        title={`Compared with the ${months} months before`}>
                        {change >= 0 ? '▲' : '▼'} {Math.abs(change)}
                    </span>
                )}
            </div>
            <span className="nps-sum-sub">
                {change != null ? `vs the ${months} months before` : 'No earlier period to compare'}
            </span>
        </div>

        <div className="nps-sum-mix" aria-hidden="true">
            {BANDS.map(([k]) => <span key={k} className={`is-${k.slice(0, -1)}`} style={{ flexGrow: t[k] }} />)}
        </div>
        <dl className="nps-bands">
            {BANDS.map(([k, label, range]) => (
                <div key={k} className="nps-band-row">
                    <dt><i className={`is-${k.slice(0, -1)}`} />{label} <span className="nps-band-range">{range}</span></dt>
                    <dd className="nps-band-n">{t[k]}</dd>
                    <dd className="nps-band-pct">{t.answered ? `${Math.round((t[k] / t.answered) * 100)}%` : '—'}</dd>
                </div>
            ))}
        </dl>
        <p className="nps-sum-rate">
            <strong>{t.sent ? Math.round((t.answered / t.sent) * 100) : 0}%</strong> response rate · {t.answered} of {t.sent} answered
        </p>
    </div>
);

/* ── View answers ───────────────────────────────────────────────────────
   The answers, in a window over the dashboard, so reading what clients said
   does not cost the place on the page. Same list as Home → Surveys.

   In the app it mounts on document.body like every other window. Here it
   mounts on the review frame, or it would cover the whole review page. */
const useFrameHost = (ref, open) => {
    const [host, setHost] = useState(null);
    useLayoutEffect(() => {
        if (open) setHost(ref.current?.closest('.af') || null);
    }, [ref, open]);
    return host;
};

const AnswersWindow = ({ months, span, onClose }) => {
    const closeRef = useRef(null);
    useEffect(() => {
        closeRef.current?.focus();
        const doc = closeRef.current?.ownerDocument;
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        doc?.addEventListener('keydown', onKey);
        return () => doc?.removeEventListener('keydown', onKey);
    }, [onClose]);

    return (
        <div className="modal-overlay nps-modal-overlay" onClick={onClose}>
            <div className="ccm nps-modal" role="dialog" aria-modal="true" aria-labelledby="nps-modal-title" onClick={e => e.stopPropagation()}>
                <div className="ccm-header">
                    <div className="nps-modal-titles">
                        <h2 className="ccm-title" id="nps-modal-title">Survey answers</h2>
                        <p className="nps-modal-sub">Newest first. Open a row to go to its case.</p>
                    </div>
                    <button type="button" className="ccm-close" ref={closeRef} onClick={onClose} aria-label="Close">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>
                <div className="ccm-body nps-modal-body">
                    <AnswersTable initialPeriod={`${months}m`} initialSpan={span} />
                </div>
                <div className="ccm-footer nps-modal-foot">
                    <a className="nps-modal-full" href="#surveys" onClick={e => e.preventDefault()}>Open in Home → Surveys</a>
                    <button type="button" className="ccm-cancel-btn" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

/* ── The row ───────────────────────────────────────────────────────────── */
const NpsRow = ({ initialRange = 12, initialOpen = false, initialMonth = null }) => {
    const [range, setRange] = useState(initialRange);
    /* false, or what the window opens on: the row's period, or one month. */
    const [open, setOpen] = useState(initialMonth ? { span: [initialMonth, initialMonth] } : initialOpen ? { span: null } : false);
    const rowRef = useRef(null);
    const viewRef = useRef(null);
    const close = () => { setOpen(false); viewRef.current?.focus(); };
    const host = useFrameHost(rowRef, open);
    const months = MONTHS.slice(-range);
    const lastAnswered = months.reduce((at, r, i) => (r.nps == null ? at : i), months.length - 1);
    const [active, setActive] = useState(lastAnswered);
    const t = total(months);
    /* The period before needs as many months again, and the endpoint stops
       at 24, so the longest range has nothing to compare with. */
    const before = range * 2 <= MAX_MONTHS ? total(MONTHS.slice(-range * 2, -range)) : null;
    const change = before?.nps != null && t.nps != null ? t.nps - before.nps : null;

    const pick = (r) => {
        setRange(r);
        const next = MONTHS.slice(-r);
        setActive(next.reduce((at, row, i) => (row.nps == null ? at : i), next.length - 1));
    };

    return (
        <section className="portal-card nps-row" aria-label="Client NPS" ref={rowRef}>
            <div className="nps-row-head">
                <div className="nps-row-titles">
                    <h2 className="portal-card-title">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                        Client NPS
                    </h2>
                    <p className="nps-row-sub">How likely clients are to recommend the firm.</p>
                </div>
                <div className="nps-row-controls">
                    <div className="nps-seg" role="radiogroup" aria-label="Period">
                        {RANGES.map(r => (
                            <button key={r} type="button" role="radio" aria-checked={range === r}
                                className={`nps-seg-btn${range === r ? ' is-on' : ''}`} onClick={() => pick(r)}>
                                {r} months
                            </button>
                        ))}
                    </div>
                    <button type="button" className="nps-row-btn" aria-haspopup="dialog" ref={viewRef} onClick={() => setOpen({ span: null })}>
                        View answers
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
                    </button>
                </div>
            </div>

            <div className="nps-row-body">
                <Summary t={t} change={change} months={range} />
                <div className="nps-row-chart">
                    <div className="nps-row-legend">
                        <span><i className="is-line" />NPS</span>
                        <span><i className="is-vol" />Answers</span>
                        <span className="nps-row-legend-note">— no answers that month · click a month to read its answers</span>
                    </div>
                    <TrendChart
                        months={months} active={Math.min(active, months.length - 1)} onActive={setActive}
                        onPick={(i) => setOpen({ span: [months[i].key, months[i].key] })}
                    />
                </div>
            </div>
            {open && host && createPortal(<AnswersWindow months={range} span={open.span} onClose={close} />, host)}
        </section>
    );
};

export default NpsRow;
