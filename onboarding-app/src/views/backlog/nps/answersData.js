/* NPS-1 demo data, shared by the dashboard row and every answers list, so
   the chart, the summary and the lists agree to the last answer.

   MONTHS is what GET /metrics/nps returns: oldest first, empty months filled.
   ANSWERS is what GET /surveys pages through: one row per answer, newest
   first, generated to match each month's band counts exactly. Today is
   Oct 22, 2026. */

export const NOW = { y: 2026, m: 10, d: 22 };
export const MAX_MONTHS = 24;

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const monthName = (m) => MONTH_NAMES[m - 1];

export const bandOf = (score) => (score == null ? null : score >= 9 ? 'promoter' : score >= 7 ? 'passive' : 'detractor');
export const npsOf = (p, d, n) => (n ? Math.round(((p - d) / n) * 100) : null);

/* "YYYY-MM" keys compare as strings, which is all the filtering needs. */
export const ym = (y, m) => `${y}-${String(m).padStart(2, '0')}`;
export const addMonths = (key, n) => {
    const [y, m] = key.split('-').map(Number);
    const t = y * 12 + (m - 1) + n;
    return ym(Math.floor(t / 12), (t % 12) + 1);
};
export const NOW_KEY = ym(NOW.y, NOW.m);
export const keyLabel = (key) => {
    const [y, m] = key.split('-').map(Number);
    return `${monthName(m)} ${y}`;
};

/* [year, month, sent, promoters, passives, detractors] */
const RAW = [
    [2024, 11, 10, 2, 1, 1], [2024, 12, 8, 1, 1, 1], [2025, 1, 12, 2, 2, 1],
    [2025, 2, 9, 1, 1, 1], [2025, 3, 14, 3, 1, 2], [2025, 4, 11, 2, 2, 1],
    [2025, 5, 13, 3, 1, 1], [2025, 6, 7, 0, 0, 0], [2025, 7, 15, 3, 2, 1],
    [2025, 8, 12, 2, 2, 1], [2025, 9, 16, 4, 1, 2], [2025, 10, 13, 3, 2, 1],
    [2025, 11, 9, 0, 0, 0], [2025, 12, 13, 2, 2, 1], [2026, 1, 15, 3, 2, 1],
    [2026, 2, 11, 2, 1, 1], [2026, 3, 6, 0, 0, 0], [2026, 4, 14, 3, 1, 1],
    [2026, 5, 19, 4, 3, 1], [2026, 6, 16, 4, 1, 1], [2026, 7, 22, 5, 3, 1],
    [2026, 8, 16, 4, 1, 1], [2026, 9, 13, 4, 2, 1], [2026, 10, 14, 3, 1, 2],
];

export const MONTHS = RAW.map(([y, m, sent, promoters, passives, detractors]) => {
    const answered = promoters + passives + detractors;
    return { key: ym(y, m), y, m: monthName(m), sent, promoters, passives, detractors, answered, nps: npsOf(promoters, detractors, answered) };
});

/* ── Answers ─────────────────────────────────────────────────────────── */
const CASE = 'Rear-End Collision — Downtown LA';

/* The answers the other screens already show: the alert, the case tab. */
const KNOWN = [
    { y: 2026, m: 10, d: 22, name: 'Alexandra Reyes', case: CASE, ref: '260602/1545', score: 4, comment: 'It took three weeks to hear back after the settlement call. The result was fine, the silence was not.' },
    { y: 2026, m: 10, d: 21, name: 'Daniel Reyes', case: CASE, ref: '260602/1545', score: 9, testimonial: 'Marcus explained every step and never made us feel rushed.', consent: true },
    { y: 2026, m: 10, d: 20, name: null, case: 'Johnson v. City Transit', ref: '251118/0932', score: 7, testimonial: 'Good outcome. Updates were slow in the middle.', consent: false },
    { y: 2026, m: 10, d: 18, name: 'Priya Shah', case: 'Settlement Conference — Martinez', ref: '250921/1110', score: 10 },
    { y: 2026, m: 10, d: 15, name: 'Tom Alvarez', case: 'Expert Review', ref: '250807/1402', score: 6, comment: 'Nobody told me the medical liens would come out before my share.' },
    { y: 2026, m: 10, d: 12, name: 'Grace Kim', case: 'Kim Clinic records', ref: '250630/0815', score: 9, testimonial: 'They picked up the phone every single time.', consent: true },
    { y: 2026, m: 9, d: 29, name: 'Owen Brooks', case: 'Slip and Fall — Main St', ref: '250511/1630', score: 8 },
    { y: 2026, m: 9, d: 24, name: 'Hana Ito', case: 'Workplace Injury — Ito', ref: '250402/0950', score: 3, comment: 'I had to chase every document myself.' },
];

const FIRST = ['Maria', 'James', 'Aisha', 'Luis', 'Chen', 'Fatima', 'Noah', 'Olivia', 'Samuel', 'Grace', 'Diego', 'Hannah', 'Kwame', 'Elif', 'Ryan', 'Sofia', 'Ibrahim', 'Mei', 'Lucas', 'Zara'];
const LAST = ['Lopez', 'Carter', 'Okafor', 'Nguyen', 'Patel', 'Haddad', 'Fischer', 'Morales', 'Ward', 'Bennett', 'Silva', 'Kowalski', 'Mensah', 'Yilmaz', 'Brooks', 'Rossi', 'Khan', 'Tanaka'];
const CASES = [
    ['Rear-End Collision — I-10', 'RC'], ['Slip and Fall — Grocery', 'SF'], ['Dog Bite — Elm Park', 'DB'],
    ['Truck Collision — Route 9', 'TC'], ['Workplace Injury — Warehouse', 'WI'], ['Premises Liability — Hotel', 'PL'],
    ['Motorcycle Crash — 5th Ave', 'MC'], ['Pedestrian Struck — Main St', 'PS'], ['Medical Malpractice — Clinic', 'MM'],
];
const PRAISE = [
    'Always knew where my case stood.', 'They answered every question, even the silly ones.',
    'Honest about what to expect from day one.', 'Settled faster than I thought possible.',
    'Felt like a person, not a file number.',
];
const MIXED = ['Good result, but the middle months were quiet.', 'Fine overall. I wish I had heard more often.', 'Helpful team, slow paperwork.'];
const COMPLAINTS = [
    'I never knew who to call.', 'Calls went unreturned for weeks.', 'The fee breakdown surprised me at the end.',
    'Felt rushed into the settlement.', 'Had to repeat my story to three different people.',
];

/* Same inputs, same output: the data has to be identical on every render
   and in every screen. */
const seq = (i, n) => ((i * 7919) % 104729) % n;

const generated = [];
let i = 0;
MONTHS.forEach(({ key, promoters, passives, detractors }) => {
    const [y, m] = key.split('-').map(Number);
    const known = KNOWN.filter(k => k.y === y && k.m === m);
    const need = {
        promoter: promoters - known.filter(k => bandOf(k.score) === 'promoter').length,
        passive: passives - known.filter(k => bandOf(k.score) === 'passive').length,
        detractor: detractors - known.filter(k => bandOf(k.score) === 'detractor').length,
    };
    const lastDay = y === NOW.y && m === NOW.m ? NOW.d : 28;
    ['promoter', 'passive', 'detractor'].forEach((band) => {
        for (let k = 0; k < need[band]; k += 1) {
            i += 1;
            const score = band === 'promoter' ? 9 + (i % 2) : band === 'passive' ? 7 + (i % 2) : [2, 4, 5, 6, 3][i % 5];
            const [title, code] = CASES[seq(i, CASES.length)];
            const words = i % 3;
            const row = {
                y, m, d: 1 + seq(i + 3, lastDay - 1),
                name: i % 11 === 0 ? null : `${FIRST[seq(i, FIRST.length)]} ${LAST[seq(i + 5, LAST.length)]}`,
                case: title, ref: `${String(y).slice(2)}${String(m).padStart(2, '0')}${code}/${String(1000 + seq(i, 8999))}`, score,
            };
            if (band === 'detractor' && words !== 2) row.comment = COMPLAINTS[seq(i, COMPLAINTS.length)];
            if (band === 'promoter' && words === 0) { row.testimonial = PRAISE[seq(i, PRAISE.length)]; row.consent = i % 4 !== 0; }
            if (band === 'passive' && words === 1) { row.testimonial = MIXED[seq(i, MIXED.length)]; row.consent = false; }
            generated.push(row);
        }
    });
});

export const ANSWERS = [...KNOWN, ...generated]
    .map((r, n) => ({ ...r, id: `a${n}`, key: ym(r.y, r.m), on: `${monthName(r.m)} ${r.d}${r.y === NOW.y ? '' : `, ${r.y}`}` }))
    .sort((a, b) => (b.y - a.y) || (b.m - a.m) || (b.d - a.d));
