import { useState } from 'react';
import InfoBanner from '../components/InfoBanner';
import './RoadmapView.css';

/* Future actions — the plan behind the product, kept in the product.
   Sequence comes first because each initiative produces the raw material the
   next one needs; a status here is a claim about that chain, not a mood. */

const INITIATIVES = [
    {
        id: 'templates',
        rank: 1,
        shortName: 'the template library',
        title: 'More templates, across every section',
        why: 'Highest leverage, lowest cost. Blocks nothing, unblocks everything.',
        dependsOn: [],
        produces: 'Written client-facing language across the case lifecycle',
        body: 'The gap between a firm signing up and actually using the portal is where this product proves itself or goes quiet — and right now that gap is blank text fields. Every empty template picker asks a paralegal to invent client-facing copy from scratch, so it does not get written, the portal stays silent, and the firm concludes nothing changed.',
        detail: [
            ['Covers', 'Status updates by case phase, document requests, appointment and deposition reminders, re-engagement sequences, milestone notifications, mass tort cohort broadcasts, task checklists per case type.'],
            ['Approach', 'Audit the empty sections, define a taxonomy mapped to the case lifecycle rather than to our UI, then write and design the library in one pass so the voice stays consistent.'],
            ['Done when', 'A new firm can send its first client message without writing a word of it themselves.'],
        ],
        eng: false,
    },
    {
        id: 'tickets',
        rank: 2,
        shortName: 'the ticketing system',
        title: 'A real ticketing system for support',
        why: 'Everything downstream is guesswork until questions are captured somewhere countable.',
        dependsOn: [],
        produces: 'A counted log of what users actually ask, and somewhere for the chatbot to escalate to',
        body: 'Support currently arrives as email and Slack messages, which means nothing is counted, nothing is categorised, and the same question can be answered five times without anyone noticing it is the same question. That is the gap under three of the items on this page: the knowledge base is written from assumption, the blog guesses at topics, and the chatbot has nowhere to hand off when it is out of scope.',
        detail: [
            ['Covers', 'Intake from email and in-app, categories that match the knowledge base tracks, assignment and status, canned replies drawn from the template library, and a report of what gets asked most.'],
            ['Approach', 'Take an off-the-shelf tool rather than building one. The value is in the categorisation and the reporting, not in owning the software — and a bought tool is running this month rather than next quarter.'],
            ['Done when', 'Every support request lands in one place with a category, and the top ten questions are a list we can read.'],
        ],
        eng: false,
    },
    {
        id: 'kb',
        rank: 3,
        shortName: 'the knowledge base',
        title: 'Knowledge base for users',
        why: 'Looks like a content project. It is infrastructure — three things wait on it.',
        dependsOn: ['templates', 'tickets'],
        produces: 'Indexed documentation, written against questions that were actually asked',
        body: 'Support load drops because staff stop asking what they could look up. Search visibility rises because these are exactly the long-tail pages that rank for the questions buyers type. And the chatbot has nothing to answer from until this corpus exists. It is written from the ticket log rather than from what we imagine people find confusing.',
        detail: [
            ['Structure', 'Four tracks — firm admin, staff and paralegal, claimant-facing, white-label setup — plus a troubleshooting track fed by what support actually receives.'],
            ['Approach', 'Information architecture first, then cornerstone articles per role, then in-app help hooks specced for engineering. Each article answers one question completely.'],
            ['Done when', 'The repeat questions in support stop repeating.'],
        ],
        eng: false,
    },
    {
        id: 'blog',
        rank: 4,
        shortName: 'the blog',
        title: 'Use the blog for visibility',
        why: 'The only channel that compounds — a late start hurts more than a slow one.',
        dependsOn: ['kb'],
        produces: 'Search demand aimed at questions we know are real',
        body: 'Everything else here improves the product for people who already found us. This is the one item that brings new firms in on its own and keeps doing it after we stop pushing. It sits behind the knowledge base because the knowledge base tells us what users genuinely ask, and those are the highest-intent topics we will ever get.',
        detail: [
            ['Approach', 'Five content pillars with clusters underneath, a keyword map, a fixed publishing rhythm, and a visual system so posts look like us at a glance.'],
            ['Leverage', 'Researched once, published three ways — the article, a LinkedIn post, and a short-form video script. One piece of thinking, three surfaces.'],
            ['Done when', 'Non-brand search produces demo requests, not just sessions.'],
        ],
        eng: false,
    },
    {
        id: 'chatbot',
        rank: 5,
        shortName: 'the AI chatbot',
        title: 'AI chatbot to answer user questions',
        why: 'Fourth is a strength, not a demotion — it launches with something to say.',
        dependsOn: ['kb', 'tickets'],
        produces: 'Answers with citations, and an escalation log that becomes next quarter’s roadmap',
        body: 'A chatbot is a retrieval layer, and its quality is a direct function of the corpus underneath it. There is also category risk worth naming: a legal platform that improvises an answer about a filing deadline or case status is exposure for the firm using us. Scope stays tight — product help only, retrieval over our own documentation, cited answers, hard escalation to a human. No case advice, ever.',
        detail: [
            ['Rollout', 'Internal first, then staff and admin users, then client-facing only once the escalation numbers say it is safe.'],
            ['Escalates to', 'A ticket, which is why the ticketing system has to exist before this ships rather than after.'],
            ['Blocked on', 'An engineering read on the retrieval layer, so the interface is scoped to what is buildable.'],
            ['Done when', 'Deflection is measurable and the escalation log is short enough to read.'],
        ],
        eng: true,
    },
];

const PHASES = [
    {
        id: 'p1', days: 'Days 1–30', title: 'Fill the product',
        thesis: 'Make the product feel finished before inviting anyone new to look at it. Traffic sent to a half-empty product is traffic wasted.',
        items: [
            'Template taxonomy defined against the case lifecycle, then library v1 written and designed',
            'Knowledge base information architecture, plus cornerstone articles for each of the four tracks',
            'Editorial system stood up: pillars, keyword map, post structure, visual treatment',
            'In-app help hooks specced — which empty states deep-link to which article',
            'Ticketing tool chosen and live, with categories mapped to the knowledge base tracks',
        ],
        learn: 'Which sections firms leave empty tells us where activation actually breaks — and the first weeks of tickets tell us what to document first.',
    },
    {
        id: 'p2', days: 'Days 31–60', title: 'Fill the funnel',
        thesis: 'Now that the product holds its own, bring people to it and make each piece of work pay out more than once.',
        items: [
            'Knowledge base to full coverage, published and indexed',
            'Blog live and publishing against the pillar and cluster map',
            'Internal linking wired: blog → knowledge base → product pages',
            'Repurposing loop running — each post becomes a LinkedIn post and a video script',
            'Templates v2, revised from what firms actually use and edit',
        ],
        learn: 'Which pillar pulls. That single answer decides where phase three spends its effort.',
    },
    {
        id: 'p3', days: 'Days 61–90', title: 'Close the loop',
        thesis: 'Turn the corpus into leverage, so the work runs without someone pushing it every week.',
        items: [
            'Chatbot pilot: retrieval over the knowledge base and template library, cited answers, escalation path',
            'Lifecycle email sequences built from content already written',
            'Content engine on a repeatable weekly rhythm instead of ad-hoc pushes',
            'Review: what to double down on for days 91–180, and what to drop',
        ],
        learn: 'The chatbot’s escalation log becomes the roadmap for next quarter. Everything it cannot answer is a gap we can now see.',
    },
];

const PILLARS = [
    { name: 'Client silence and case attrition',    answers: 'Why clients stop responding, and why they leave for another firm mid-case.', intent: 'Top of funnel' },
    { name: 'Intake and case onboarding operations', answers: 'How to move a signed client into a working case file without a week of phone tag.', intent: 'Mid funnel' },
    { name: 'Mass tort cohort management',           answers: 'How to keep hundreds of claimants informed without hundreds of calls.', intent: 'High intent' },
    { name: 'Practice tech stack and portals',       answers: 'What a client portal should do, and what to ask before buying one.', intent: 'Bottom of funnel' },
    { name: 'Client communication duties',           answers: 'What a firm owes a client in keeping them informed, and how documenting it protects the firm.', intent: 'Evergreen' },
];

const SIGNALS = [
    { label: 'Activation', text: 'A new firm reaching its first sent client message without writing the copy itself.' },
    { label: 'Support',    text: 'Repeat questions declining in the categories we have documented — countable only once tickets exist.' },
    { label: 'Organic',    text: 'Non-brand impressions and clicks appearing on knowledge base and blog URLs.' },
    { label: 'Leverage',   text: 'One research effort reliably producing an article, a social post and a script.' },
    { label: 'Chatbot',    text: 'Deflection rate, and more usefully, what it fails on.' },
    { label: 'Product',    text: 'Which templates get used unedited, which get rewritten every time.' },
];

const TABS = [
    { id: 'sequence', label: 'Sequence' },
    { id: 'phases',   label: '90-day plan' },
    { id: 'content',  label: 'Content strategy' },
    { id: 'signals',  label: 'Measurement' },
];

/* Read-only on purpose. This is a document people open to understand the
   plan, not a board anyone is going to keep up to date — a checkbox nobody
   ticks reads as work that stalled. */
const RoadmapView = ({ standalone = false }) => {
    const [tab, setTab] = useState('sequence');
    const items = INITIATIVES;
    const byId = Object.fromEntries(items.map(i => [i.id, i]));

    return (
        <div className={standalone ? 'rm-standalone' : 'portal-content rm-page'}>
            {standalone && (
                <header className="rm-topbar">
                    <span className="rm-brand">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="14" height="12" rx="2"/><path d="M16 10h4a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-8"/></svg>
                        CaseActive
                    </span>
                    <span className="rm-topbar-meta">Internal · Future actions</span>
                </header>
            )}
            <div className={standalone ? 'rm-page rm-page-inner' : 'rm-contents'}>
            <InfoBanner message="Future actions for CaseActive — the work in dependency order, and the 90-day plan it sits inside. Sequence is the argument: each initiative produces what the next one consumes." />

            <div className="rm-hero">
                <div className="rm-hero-main">
                    <span className="rm-eyebrow">Plan of record · 7 Sep 2026</span>
                    <h2 className="rm-title">Templates → ticketing → knowledge base → blog → AI chatbot</h2>
                    <p className="rm-standfirst">
                        The order is not preference. Each item produces the raw material the next one needs, which is why the
                        chatbot — the most exciting idea on the list — belongs last: built first, it is a confident guesser with
                        nothing to retrieve.
                    </p>
                </div>
            </div>

            <div className="ev-tabs-outer-embedded">
                <div className="ev-tabs-bar">
                    {TABS.map(t => (
                        <button key={t.id} className={`ev-tab${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
                    ))}
                </div>
            </div>

            {tab === 'sequence' && (
                <>
                    <div className="rm-chain">
                        {items.map((i, idx) => (
                            <div key={i.id} className="rm-chain-node">
                                <span className="rm-chain-n">{`0${idx + 1}`}</span>
                                <span className="rm-chain-t">{i.shortName}</span>
                                <span className="rm-chain-o">Produces <strong>{i.produces}</strong></span>
                            </div>
                        ))}
                    </div>
                    <p className="rm-chain-caption">
                        Move any card left and it starts without its input. A knowledge base written before tickets are
                        captured documents what we imagine people ask; a chatbot before either has no corpus to answer from
                        and nowhere to escalate to.
                    </p>

                    <div className="rm-stack">
                        {items.map(item => (
                            <article key={item.id} className="rm-item">
                                <div className="rm-item-head">
                                    <span className="rm-rank">0{item.rank}</span>
                                    <div className="rm-item-title">
                                        <h3>{item.title}</h3>
                                        <p className="rm-why">{item.why}</p>
                                    </div>
                                    {item.eng && <span className="rm-pill rm-pill-eng">Needs eng scope</span>}
                                </div>

                                {/* Dependencies are a property of the work, not a status someone
                                    has to maintain — they read the same on any day. */}
                                <div className="rm-dep-row">
                                    <span className={`rm-dep${item.dependsOn.length === 0 ? ' rm-dep-free' : ''}`}>
                                        {item.dependsOn.length === 0
                                            ? 'Starts today — nothing has to exist first'
                                            : `Needs ${item.dependsOn.map(d => byId[d].shortName).join(' and ')} first`}
                                    </span>
                                </div>

                                <div className="rm-item-body">
                                    <p>{item.body}</p>
                                    <dl className="rm-detail">
                                        {item.detail.map(([k, v]) => (
                                            <div key={k} className="rm-drow">
                                                <dt>{k}</dt>
                                                <dd>{v}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                </div>
                            </article>
                        ))}

                        <article className="rm-item rm-item-frame">
                            <div className="rm-item-head">
                                <span className="rm-rank rm-rank-muted">06</span>
                                <div className="rm-item-title">
                                    <h3>Planning to reach more people</h3>
                                    <p className="rm-why">Not the fifth thing on the list — the shape the other four move in.</p>
                                </div>
                            </div>
                            <div className="rm-item-body">
                                <p>Not work to be scheduled after the chatbot. It is the sequencing, the review points, and the decisions about what we stop doing. This page is that plan.</p>
                            </div>
                        </article>
                    </div>
                </>
            )}

            {tab === 'phases' && (
                <div className="rm-phases">
                    {PHASES.map(p => (
                        <section key={p.id} className="rm-phase">
                            <span className="rm-days">{p.days}</span>
                            <h3>{p.title}</h3>
                            <p className="rm-thesis">{p.thesis}</p>
                            <ul className="rm-phase-list">
                                {p.items.map(i => <li key={i}>{i}</li>)}
                            </ul>
                            <p className="rm-learn"><b>What we learn</b>{p.learn}</p>
                        </section>
                    ))}
                </div>
            )}

            {tab === 'content' && (
                <div className="rm-card">
                    <div className="rm-card-head">
                        <h3 className="rm-card-title">Five pillars, chosen for intent</h3>
                        <span className="rm-card-note">Each pillar is a cluster — one anchor article with supporting pieces linking into it and into the matching knowledge base track.</span>
                    </div>
                    <div className="rm-table-wrap">
                        <div className="rm-table-head">
                            <span>PILLAR</span><span>WHAT IT ANSWERS FOR A FIRM</span><span>FUNNEL INTENT</span>
                        </div>
                        {PILLARS.map(p => (
                            <div key={p.name} className="rm-table-row">
                                <span className="rm-pillar" data-label="Pillar">{p.name}</span>
                                <span className="rm-answers" data-label="Answers">{p.answers}</span>
                                <span data-label="Intent"><span className="rm-intent">{p.intent}</span></span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {tab === 'signals' && (
                <div className="rm-card">
                    <div className="rm-card-head">
                        <h3 className="rm-card-title">What I would watch</h3>
                        <span className="rm-card-note">Signals rather than targets — numbers set once there is a baseline, not invented now.</span>
                    </div>
                    <dl className="rm-signals rm-signals-2">
                        {SIGNALS.map(s => (
                            <div key={s.label} className="rm-signal">
                                <dt>{s.label}</dt>
                                <dd>{s.text}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            )}

            {standalone && (
                <footer className="rm-footer">
                    <span>CaseActive</span>
                    <span>Prepared by AR Tanveer</span>
                    <span>7 September 2026</span>
                </footer>
            )}
            </div>
        </div>
    );
};

export default RoadmapView;
