/* CW-1 · Design the missing case workspace screens: forms, e-signs,
   paying, events, intake.

   The brief keeps every feature, state and message each screen has today
   and asks for the sandbox's look on top. Anything added or dropped is
   listed in `decision` and raised on the ticket's thread for Welby. */

import { Designed } from '../ms/parts';
import { FillForm, SignDoc, SignedCopy, Intake, IntakeDone, IntakeBanner } from './doc';
import { PayInvoice } from './pay';
import { EventDetails } from './event';
import './cw.css';

const T = {
    form: 'In the sandbox, opening a form shows a blank viewer that says "PDF preview will appear here".',
    sign: 'In the sandbox, opening an e-sign shows a blank viewer with a Submit E-Sign button and nothing to sign.',
    pay: 'The sandbox has the admin\'s invoice editor only. A client has no view of an invoice and no way to pay.',
    intake: 'The sandbox sign-up has no intake step.',
    signed: 'There is no signed copy in the sandbox.',
};

const d = (what, today, el) => <Designed key={el.key} what={what} today={today}>{el}</Designed>;
const form = (key, props = {}) => (role) => d('way to fill in a form', T.form, <FillForm key={key} role={role} {...props} />);
const sign = (key, props = {}) => (role) => d('way to sign an e-sign', T.sign, <SignDoc key={key} role={role} {...props} />);
const pay = (key, props = {}) => () => d('way to pay an invoice', T.pay, <PayInvoice key={key} {...props} />);
const signed = (key, props = {}) => (role) => d('signed copy', T.signed, <SignedCopy key={key} role={role} {...props} />);

export const CW_TICKET = {
    no: 17,
    key: 'CW-1',
    ticketName: 'Design the missing case workspace screens: forms, e-signs, paying, events, intake',
    domain: 'ca-app',
    status: 'To Do',
    severity: 'Medium',
    link: 'https://caseactive.slack.com/lists/TJQSXGPJB/F09M1DLSBC6?record_id=Rec0CDT90BUA1',
    title: 'Case workspace screens',
    roles: ['client', 'staff', 'admin'],
    brief: [
        'Use the sandbox\'s look. Keep every feature, state and message the screen has today. If you would add or drop something, say so in this ticket\'s thread so Welby can decide.',
        'Filling in a form: the document viewer with its toolbar (pages, zoom, search, print, download) and a bottom bar with Cancel and Submit. States: loading, still converting, conversion failed, required fields left empty, submitted. Fields assigned to someone else are locked; someone who can\'t fill it in only views it. Add a saving and saved sign.',
        'Signing an e-sign: the same viewer and bottom bar. States as for forms, plus signature fields the signer missed, outlined and scrolled to.',
        'Paying an invoice: the invoice beside a payment panel with saved cards, Remove, add a new card, a summary and Pay now; the panel goes under the invoice on a phone. States: no saved card, several cards with none picked, paying, declined, may have been charged, paid; the read-only invoice in each of its eight statuses; payments not set up.',
        'Event details: map or date tile, name, Attending, Add to calendar, organiser, place or call link, date and repeat, duration, who is attending, maybe or not with +N more, description. Empty sections hidden; in a closed case Attending is hidden and Add to calendar disabled; only invited people see Attending.',
        'Intake on sign-up: an Onboarding header with one dot per form owed and a clear "form 2 of 3", the document, Cancel and Submit, then the Lobby. Also the reminder banner elsewhere with Fill in forms.',
        'Signed copy: the read-only document with a "Signed by N people" panel (signer, signed at, IP address, Hide and Show details). States: locked copy being made, failed, may not show the latest signatures. Moderators see every IP; a signer sees only their own; a signer who left shows as Former member.',
    ],
    alsoKnown: 'These six replace the first drafts of the same screens on MS-1. The reminder banner is HD-1\'s strip (15.8), reused as it is, so there is one design for it. How the live viewer takes a signature isn\'t written down anywhere in this codebase; the screens draw a Draw / Type pad and that is the first question on the thread.',
    decision: 'Nothing on the viewer moves: the toolbar keeps its five tools and the bottom bar keeps Cancel and Submit, with the saving sign on the bar\'s left so it sits next to the action it protects. On a phone the toolbar\'s zoom, search, print and download go behind one More button rather than being dropped. Submit stays live while anything is missing; pressing it outlines what\'s missing in red, scrolls the first one into view and says how many, because a greyed-out Submit can\'t say why. Loading, converting and failed replace the page inside the viewer, so the person stays on the screen they opened. View-only says why in one line: not yours to fill in, case closed, or already submitted. The pay panel shows a summary above Pay now so the amount is in view at the moment of paying; "may have been charged" asks the client not to pay again and takes Pay now away, because a second charge is the worst outcome. The read-only invoice puts its status and one plain sentence where the panel was. Onboarding\'s dots get a check when done and the header says "Form 2 of 3", with "1 done · 2 to go" by the form name. Things added that were not asked for, for Welby to approve: Remove asks once inline before removing a card; "Choose a card, or add a new one" when Pay now is pressed with none picked; the last onboarding form\'s button reads "Submit and go to Lobby"; a one-line toast in the Lobby after the last form.',
    items: [
        { id: '17.1', what: 'Filling in a form: the viewer with its toolbar and Cancel / Submit, locked fields for someone else, view-only with its reason, and loading, converting, failed, missing and submitted.', where: 'Lobby → a case → Forms → a form assigned to you', file: 'Not in this codebase (ca-app document viewer)', roles: ['client', 'staff'], missing: true },
        { id: '17.2', what: 'Signing an e-sign: the same viewer; places to sign; missed places outlined in red and scrolled to; the same loading, converting, failed, view-only and submitted states.', where: 'Case → E-signs → an e-sign assigned to you', file: 'Not in this codebase (ca-app document viewer)', roles: ['client', 'staff'], missing: true },
        { id: '17.3', what: 'Paying an invoice: saved cards with Remove, Add a new card, summary and Pay now; no saved card, none picked, paying, declined, may have been charged, paid; payments not set up.', where: 'Client · Case → Invoices or To Do → a published invoice', file: 'src/views/InvoicesView.jsx has the admin editor only', roles: ['client'], missing: true },
        { id: '17.4', what: 'The read-only invoice in each status: Open, Paid, Void, Processing, Uncollectible, Refund pending, Refunded, Refund failed, each with one sentence.', where: 'Client · Case → Invoices → an invoice', file: 'src/components/statuses.js', roles: ['client'] },
        { id: '17.5', what: 'Event details pop-up: map or date tile, name, Attending (invited only), Add to calendar, organiser, place or call link, date and repeat, duration, attending, maybe and not with +N more, description; empty sections hidden; closed case.', where: 'Case → Events → View details', file: 'src/views/EventsView.jsx', roles: ['client', 'staff'] },
        { id: '17.6', what: 'Intake on sign-up: Onboarding header with a dot per form and "Form 2 of 3", the viewer with Cancel and Submit, the Lobby after the last form, and the reminder banner (HD-1 15.8).', where: 'Sign up as a client to a hub with an intake form', file: 'Not in this codebase (onboarding flow)', roles: ['client'], missing: true },
        { id: '17.7', what: 'Signed copy: the read-only document and "Signed by N people" with signed at and IP address, Hide and Show details; IPs by role; Former member; locked copy being made, failed, and may not show the latest signatures.', where: 'Case → E-signs → one everyone has signed', file: 'Not in this codebase (ca-app document viewer)', roles: ['client', 'staff', 'admin'], missing: true },
        { id: '17.8', what: 'The saving and saved sign on forms, e-signs and intake.', where: 'Viewer bottom bar, left', file: 'Not in this codebase (ca-app document viewer)', roles: ['client', 'staff'], missing: true },
    ],
    screens: [
        /* ── Forms ── */
        { id: 'form', label: 'Form', roles: ['client'],
            note: 'Type in any field to see Saving… then Draft saved. Attorney notes belongs to Marcus Bell, so it is locked. Clear a required field and Submit to see the missing state.',
            render: form('form') },
        { id: 'form-missing', label: 'Form · fields empty', roles: ['client'],
            note: 'Submit pressed with required fields empty: outlined in red, the first scrolled into view, and the count above the viewer.',
            render: form('form-missing', { state: 'missing' }) },
        { id: 'form-loading', label: 'Form · loading', roles: ['client'], render: form('form-loading', { state: 'loading' }) },
        { id: 'form-converting', label: 'Form · converting', roles: ['client'], render: form('form-converting', { state: 'converting' }) },
        { id: 'form-failed', label: 'Form · conversion failed', roles: ['client'], render: form('form-failed', { state: 'failed' }) },
        { id: 'form-submitted', label: 'Form · submitted', roles: ['client'], render: form('form-submitted', { state: 'submitted' }) },
        { id: 'form-view', label: 'Form · view only', roles: ['staff'],
            note: 'Staff who aren\'t a participant only view. Every field is read-only, the bar has Close only, and the line says why.',
            render: form('form-view', { view: 'notParticipant' }) },
        { id: 'form-closed', label: 'Form · closed case', roles: ['client'], render: form('form-closed', { view: 'closed' }) },
        { id: 'form-phone', label: 'Form · phone', roles: ['client'], phone: true,
            note: 'Zoom, search, print and download sit behind More. Cancel and Submit share the bottom bar.',
            render: form('form-phone', { phone: true }) },

        /* ── E-signs ── */
        { id: 'sign', label: 'E-sign', roles: ['client'],
            note: 'Click Initial or Sign to add it. Submit with one missing to see it outlined and scrolled to.',
            render: sign('sign') },
        { id: 'sign-missed', label: 'E-sign · missed a place', roles: ['client'], render: sign('sign-missed', { state: 'missing' }) },
        { id: 'sign-loading', label: 'E-sign · loading', roles: ['client'], render: sign('sign-loading', { state: 'loading' }) },
        { id: 'sign-converting', label: 'E-sign · converting', roles: ['client'], render: sign('sign-converting', { state: 'converting' }) },
        { id: 'sign-failed', label: 'E-sign · conversion failed', roles: ['client'], render: sign('sign-failed', { state: 'failed' }) },
        { id: 'sign-submitted', label: 'E-sign · signed', roles: ['client'], render: sign('sign-submitted', { state: 'submitted' }) },
        { id: 'sign-view', label: 'E-sign · view only', roles: ['staff'], render: sign('sign-view', { view: 'notParticipant' }) },
        { id: 'sign-closed', label: 'E-sign · closed case', roles: ['client'], render: sign('sign-closed', { view: 'closed' }) },
        { id: 'sign-phone', label: 'E-sign · phone', roles: ['client'], phone: true, render: sign('sign-phone', { phone: true }) },

        /* ── Paying ── */
        { id: 'pay', label: 'Pay · choose a card', roles: ['client'],
            note: 'Two saved cards, none picked. Pay now asks for a card; pick one and Pay now to see paying, then paid. Remove asks once.',
            render: pay('pay') },
        { id: 'pay-nocard', label: 'Pay · no saved card', roles: ['client'], render: pay('pay-nocard', { state: 'nocard' }) },
        { id: 'pay-paying', label: 'Pay · paying', roles: ['client'], render: pay('pay-paying', { state: 'paying' }) },
        { id: 'pay-declined', label: 'Pay · declined', roles: ['client'], render: pay('pay-declined', { state: 'declined' }) },
        { id: 'pay-unconfirmed', label: 'Pay · may have been charged', roles: ['client'],
            note: 'Pay now is gone so the client can\'t pay twice. The invoice reads Processing until the payment is confirmed.',
            render: pay('pay-unconfirmed', { state: 'unconfirmed' }) },
        { id: 'pay-paid', label: 'Pay · paid', roles: ['client'], render: pay('pay-paid', { state: 'paid' }) },
        { id: 'pay-statuses', label: 'Invoice · every status', roles: ['client'],
            note: 'The read-only invoice. Pick a status above it to see the pill and the sentence that goes with it.',
            render: pay('pay-statuses', { state: 'open', switcher: true }) },
        { id: 'pay-not-setup', label: 'Pay · payments not set up', roles: ['client'],
            note: 'Today the invoice shows with nothing to pay and no reason. Now it says why and who to ask.',
            render: pay('pay-not-setup', { state: 'notSetUp' }) },
        { id: 'pay-phone', label: 'Pay · phone', roles: ['client'], phone: true,
            note: 'The payment panel goes under the invoice.',
            render: pay('pay-phone', { phone: true }) },

        /* ── Events ── */
        { id: 'event', label: 'Event details', roles: ['client', 'staff'],
            note: 'A place, so a map tile. Answer Attending to move yourself into a list. Attending (6) shows three and +3 more.',
            render: (role) => <EventDetails key="event" role={role} /> },
        { id: 'event-call', label: 'Event · call, little data', roles: ['client'],
            note: 'A call, so a date tile and the link. No description and almost no guests, so those sections are gone rather than empty.',
            render: () => <EventDetails key="event-call" kind="call" /> },
        { id: 'event-not-invited', label: 'Event · not invited', roles: ['staff'],
            note: 'Not invited: no Attending. Add to calendar still works.',
            render: () => <EventDetails key="event-not-invited" role="staff" invited={false} /> },
        { id: 'event-closed', label: 'Event · closed case', roles: ['client'],
            render: () => <EventDetails key="event-closed" closed /> },
        { id: 'event-phone', label: 'Event · phone', roles: ['client'], phone: true,
            render: () => <EventDetails key="event-phone" phone /> },

        /* ── Intake ── */
        { id: 'intake', label: 'Intake · form 2 of 3', roles: ['client'],
            note: 'One dot per form owed: a check when done, a ring on the current one. Type to see the saving sign; Submit moves to the next form.',
            render: () => d('onboarding page', T.intake, <Intake key="intake" at={1} />) },
        { id: 'intake-last', label: 'Intake · last form', roles: ['client'],
            render: () => d('onboarding page', T.intake, <Intake key="intake-last" at={2} />) },
        { id: 'intake-done', label: 'Intake · into the Lobby', roles: ['client'],
            render: () => d('onboarding page', T.intake, <IntakeDone key="intake-done" />) },
        { id: 'intake-banner', label: 'Intake · reminder banner', roles: ['client'],
            note: 'HD-1\'s strip (15.8), unchanged: the count, the forms\' names and Fill in forms.',
            render: () => <IntakeBanner key="intake-banner" /> },
        { id: 'intake-banner-phone', label: 'Intake · reminder banner · phone', roles: ['client'], phone: true,
            render: () => <IntakeBanner key="intake-banner-phone" phone /> },

        /* ── Signed copy ── */
        { id: 'signed', label: 'Signed copy', roles: ['client', 'admin'],
            note: 'As the client: their own IP, "IP address not shown" for the others. Switch to Admin to see every IP. The witness has left the firm, so shows as Former member.',
            render: signed('signed') },
        { id: 'signed-making', label: 'Signed copy · being made', roles: ['client', 'admin'], render: signed('signed-making', { state: 'making' }) },
        { id: 'signed-failed', label: 'Signed copy · failed', roles: ['client', 'admin'], render: signed('signed-failed', { state: 'failed' }) },
        { id: 'signed-stale', label: 'Signed copy · may be out of date', roles: ['client', 'admin'], render: signed('signed-stale', { state: 'stale' }) },
        { id: 'signed-phone', label: 'Signed copy · phone', roles: ['client', 'admin'], phone: true,
            note: 'The panel goes under the document.',
            render: signed('signed-phone', { phone: true }) },
    ],
};
