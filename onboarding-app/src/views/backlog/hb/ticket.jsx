/* HB-1 · Design: brand a new hub from the firm's website.

   Built from the design canvas posted for this ticket, redrawn on the
   sandbox's own signup, done screen and Create a Hub window so it sits in
   the app as it is. Every screen is live: type a website and the lookup
   runs; Change logo takes a real file and applies the size rule. */

import { CreateScreen, DoneScreen } from './signup';
import { WindowScreen } from './window';
import { LogoSizes } from './sizes';
import { BRANDS, SAMPLE_UPLOAD, resultFor } from './brand';
import { START } from './useBranding';
import { Designed } from '../ms/parts';
import './hb.css';

const found = START.found;
const done = (d) => ({ site: d, phase: 'done', result: resultFor(d) });
const look = (b) => (b ? { looking: false, bg: b.bg, logo: b.logo, favicon: b.favicon } : { looking: false, bg: null, logo: null, favicon: null });

const create = (id, init, extra = {}) => () => <CreateScreen key={id} init={init} {...extra} />;
const win = (id, init, extra = {}) => () => <WindowScreen key={id} init={init} {...extra} />;

const DEMO = 'Try it: type johnsonlaw.com (wide wordmark on navy), riveralaw.com (square logo on a light colour, so black text), kellerlaw.com (logo too small), brightonlegal.co.uk (site doesn\'t load) or any other site (nothing found). Change logo takes a real file and applies the 64 px minimum.';

export const HB_TICKET = {
    no: 21,
    key: 'HB-1',
    ticketName: 'Design: brand a new hub from the firm\'s website',
    domain: 'ca-account',
    status: 'In Progress',
    severity: 'Medium',
    link: 'https://caseactive.slack.com/lists/TJQSXGPJB/F09M1DLSBC6?record_id=Rec0CHF7ZV2J3',
    title: 'Brand a new hub from the firm\'s website',
    roles: ['admin'],
    brief: [
        'When someone creates a hub, we read the firm\'s website and fill in the firm name, logo, favicon and the hub\'s two brand colours (background and text, the same pair set in Design settings). The website is guessed from the work email: jane@johnsonlaw.com gives johnsonlaw.com. It stays editable. The lookup runs while they type their name, so it is usually done when they reach the create-hub screen. If it finds nothing, the hub gets the default look, as today.',
        'A logged-in user creating another hub, often a demo hub for a prospect, gets the same lookup, but the website field starts empty. Logos come in any shape, from wide wordmarks to square icons; everything must handle both.',
        'Screens: the create-hub screen with Firm website first, a hint and a "We don\'t have a website" link; the hub preview in place of the left panel\'s illustration, in four states (looking up, found, nothing found, default look chosen); Change logo and Use default look, deciding between a plain file picker and the cropper; the done screen showing the branded hub with Customize Hub reworded to Adjust your branding; the Create a Hub window with the website first and empty, deciding between the preview and a "Logo found" line; the smallest logo size in pixels; copy for every state. Not needed: colour rules, since the text colour is picked automatically.',
    ],
    alsoKnown: 'The design canvas for this ticket (claude.ai artifact CygTMAwRgXsrRQyjAayZ39) draws the live signup. This ticket keeps its states, copy, size rule and decisions, and draws them on the sandbox\'s own step 4, step 5 and Create a Hub window, so labels follow the sandbox: "Launch my Hub" rather than Continue, "Your Company Website" in the window, and Settings → General → Design Settings as the place to adjust branding later. The default look is the sandbox\'s client hub with nothing set: a white header with the firm\'s name, the CaseActive favicon and the teal button.',
    decision: 'The left panel turns from black to a light CaseActive gradient (the accent\'s palest teal into soft blue) so the firm\'s own colours stand out in it, and becomes the preview: a small client hub with the tab\'s favicon, the header in the firm\'s background colour with its logo, and the lobby\'s own case card (stage tab, members, the accent corner) with the Open tab and the corner in the brand colour, plus a status card under it that says what happened and what to do. While the lookup runs, only the parts it will fill shimmer. Change logo is a plain file picker, no cropper: the header scales any logo into its box (200 × 40, 160 × 32 on phones), never cropped or stretched, so wordmarks and square icons both work; cropping stays in Design Settings. The Create a Hub window gets a one-line result with a thumbnail of the logo on its colour, not the full preview, so it stays small. Minimum logo size: 64 px tall, or 320 px wide for logos wider than 5:1; SVG always passes; smaller found logos fall back to the default look, smaller uploads are refused. Launch my Hub is never blocked: pressed while looking, it reads "Creating your Hub…" for up to 5 seconds, then creates the hub with whatever is ready. Firm name is filled from the site only while it is empty or still holds a name we filled. On a phone the left panel is hidden, so the preview sits under the website field. Added, for Welby to approve: a status card for "couldn\'t reach the site" and "logo too small" as their own nothing-found cases; "Use {site} branding" to undo Use default look without another lookup; a subtitle on the Create a Hub window; the done screen\'s checklist (Hub ready, Role configured, Practice areas saved) gives way to the preview.',
    items: [
        { id: '21.1', what: 'Firm website as the first field: hint, "We don\'t have a website" link, accepts johnsonlaw.com without https://, tidied on blur, error for anything that isn\'t a website. Firm name below it, filled from the site.', where: 'Signup → Last step — choose your Hub → Create new Hub', file: 'src/App.jsx (Step4)', roles: ['admin'] },
        { id: '21.2', what: 'Hub preview in place of the left panel: looking up, found, nothing found (with couldn\'t reach and logo too small), default look chosen, no website, no website guessed.', where: 'Signup → create-hub step, left panel', file: 'src/App.jsx (Step4 side panel)', roles: ['admin'] },
        { id: '21.3', what: 'Change logo and Use default look on the preview. Plain file picker, no cropper. States: uploading, uploaded, too small, wrong type, too large.', where: 'Hub preview status card', file: 'src/App.jsx (Step4)', roles: ['admin'] },
        { id: '21.4', what: 'Lookup behaviour: website guessed from the work email (free email domains give nothing), re-run 600 ms after typing stops, Launch my Hub never blocked ("Creating your Hub…" up to 5 s).', where: 'Signup, name step through create-hub step', file: 'src/App.jsx', roles: ['admin'] },
        { id: '21.5', what: 'Phone: the left panel is hidden, so "Your Hub preview" and its status sit under the website field; the hub uses its phone header.', where: 'Signup on a phone', file: 'src/App.jsx, src/index.css', roles: ['admin'] },
        { id: '21.6', what: 'Done screen: "Live now", "Your Hub is live" and the branded hub in the left panel; Customize Hub becomes "Adjust your branding", or "Add your branding" with the default look.', where: 'Signup → Hub launched', file: 'src/App.jsx (Step5)', roles: ['admin'] },
        { id: '21.7', what: 'Create a Hub window: Your Company Website first, empty, Optional; a one-line result with a thumbnail (Logo found, Change, Use default) and every lookup and upload state; Company Name filled from the site.', where: 'Account site → Hubs → NEW', file: 'src/views/HubsPage.jsx (CreateHubModal)', roles: ['admin'] },
        { id: '21.8', what: 'Minimum logo size: 64 px tall, or 320 px wide for logos wider than 5:1; SVG always passes; favicon 32 × 32. The fit rule for the header\'s logo box.', where: 'Lookup and Change logo', file: 'Server (lookup) and the upload check', roles: ['admin'] },
        { id: '21.9', what: 'Copy for every state above.', where: 'Everywhere above', file: 'See each item\'s build notes', roles: ['admin'] },
    ],
    screens: [
        /* ── Create-hub step ── */
        { id: 'create', label: 'Create hub · try it', roles: ['admin'], note: `Opens mid-lookup on johnsonlaw.com, guessed from jane@johnsonlaw.com, and lands on found. ${DEMO}`,
            render: create('create', { site: 'johnsonlaw.com', phase: 'looking', autoResolve: 2200 }) },
        { id: 'create-looking', label: 'Looking up', roles: ['admin'], note: 'Only what the lookup will fill shimmers: favicon, logo and links; the accent goes grey until the colour is known. Firm name says it will be filled in, or can be typed now.',
            render: create('create-looking', { site: 'johnsonlaw.com', phase: 'looking' }) },
        { id: 'create-found', label: 'Found · wide wordmark', roles: ['admin'], note: 'Navy background, so white text. Firm name filled in from the site.',
            render: create('create-found', found()) },
        { id: 'create-square', label: 'Found · square logo, light colour', roles: ['admin'], note: 'A square logo in the same 200 × 40 box, and a light background, so the text is black.',
            render: create('create-square', found('riveralaw.com')) },
        { id: 'create-notfound', label: 'Nothing found', roles: ['admin'], render: create('create-notfound', done('harlowmasstort.com')) },
        { id: 'create-unreachable', label: 'Nothing found · site didn\'t load', roles: ['admin'], render: create('create-unreachable', done('brightonlegal.co.uk')) },
        { id: 'create-site-small', label: 'Nothing found · logo too small', roles: ['admin'], render: create('create-site-small', done('kellerlaw.com')) },
        { id: 'create-default', label: 'Default look chosen', roles: ['admin'], note: 'Use default look keeps the found branding, so "Use johnsonlaw.com branding" brings it back without another lookup.',
            render: create('create-default', { ...found(), look: 'default' }) },
        { id: 'create-nowebsite', label: 'We don\'t have a website', roles: ['admin'], note: 'The field becomes a one-line note with Add a website to undo.',
            render: create('create-nowebsite', { mode: 'none', look: 'default' }) },
        { id: 'create-empty', label: 'No website guessed', roles: ['admin'], note: 'A free email address (gmail.com, outlook.com…) gives no website, so the field starts empty.',
            render: create('create-empty', {}) },
        { id: 'create-invalid', label: 'Not a website', roles: ['admin'], render: create('create-invalid', { site: 'johnson law', touched: true }) },
        { id: 'create-launching', label: 'Launch pressed while looking', roles: ['admin'], note: 'Never blocked: "Creating your Hub…" for up to 5 seconds, then the hub is created with the default look if the lookup hasn\'t finished.',
            render: create('create-launching', { site: 'johnsonlaw.com', phase: 'looking' }, { launching: true }) },

        /* ── Change logo ── */
        { id: 'logo-uploading', label: 'Change logo · uploading', roles: ['admin'], render: create('logo-uploading', { ...found(), uploadState: 'uploading' }) },
        { id: 'logo-uploaded', label: 'Change logo · uploaded', roles: ['admin'], note: 'The uploaded logo, with the colours still from the website.',
            render: create('logo-uploaded', { ...found(), upload: SAMPLE_UPLOAD }) },
        { id: 'logo-too-small', label: 'Change logo · too small', roles: ['admin'], note: 'Refused with its size, and the current logo is kept.',
            render: create('logo-too-small', { ...found(), uploadState: 'small', uploadInfo: { w: 48, h: 48 } }) },
        { id: 'logo-wrong-type', label: 'Change logo · wrong file type', roles: ['admin'], render: create('logo-wrong-type', { ...found(), uploadState: 'type' }) },

        /* ── Phone ── */
        { id: 'create-phone', label: 'Phone · found', roles: ['admin'], phone: true, note: 'The left panel is hidden on phones, so the preview sits under the website field, where the result appears.',
            render: create('create-phone', found(), { phone: true }) },
        { id: 'create-phone-looking', label: 'Phone · looking up', roles: ['admin'], phone: true, render: create('create-phone-looking', { site: 'johnsonlaw.com', phase: 'looking' }, { phone: true }) },
        { id: 'create-phone-notfound', label: 'Phone · nothing found', roles: ['admin'], phone: true, render: create('create-phone-notfound', done('harlowmasstort.com'), { phone: true }) },
        { id: 'create-phone-default', label: 'Phone · default look', roles: ['admin'], phone: true, render: create('create-phone-default', { ...found(), look: 'default' }, { phone: true }) },
        { id: 'create-phone-nowebsite', label: 'Phone · no website', roles: ['admin'], phone: true, render: create('create-phone-nowebsite', { mode: 'none', look: 'default' }, { phone: true }) },

        /* ── Done ── */
        { id: 'done', label: 'Done · branded hub', roles: ['admin'], note: 'The left panel shows the hub as clients will see it. Customize Hub becomes Adjust your branding.',
            render: () => <DoneScreen key="done" look={look(BRANDS['johnsonlaw.com'])} firm="Johnson & Associates" /> },
        { id: 'done-default', label: 'Done · default look', roles: ['admin'], render: () => <DoneScreen key="done-default" look={look(null)} firm="Harlow Mass Tort Group" /> },
        { id: 'done-phone', label: 'Done · phone', roles: ['admin'], phone: true, render: () => <DoneScreen key="done-phone" look={look(BRANDS['johnsonlaw.com'])} firm="Johnson & Associates" phone /> },

        /* ── Create a Hub window ── */
        { id: 'window', label: 'Create a Hub · starts empty', roles: ['admin'], note: `Logged-in, so nothing is guessed: the field starts empty and is Optional. ${DEMO}`,
            render: win('window', {}) },
        { id: 'window-looking', label: 'Create a Hub · looking up', roles: ['admin'], render: win('window-looking', { site: 'riveralaw.com', phase: 'looking' }) },
        { id: 'window-found', label: 'Create a Hub · logo found', roles: ['admin'], note: 'The thumbnail shows the logo on its own colour: enough to catch a wrong or unreadable logo without the full preview.',
            render: win('window-found', found('riveralaw.com')) },
        { id: 'window-notfound', label: 'Create a Hub · nothing found', roles: ['admin'], render: win('window-notfound', done('harlowmasstort.com')) },
        { id: 'window-default', label: 'Create a Hub · default look', roles: ['admin'], render: win('window-default', { ...found('riveralaw.com'), look: 'default' }) },
        { id: 'window-too-small', label: 'Create a Hub · upload too small', roles: ['admin'], render: win('window-too-small', { ...found('riveralaw.com'), uploadState: 'small', uploadInfo: { w: 48, h: 48 } }) },
        { id: 'window-phone', label: 'Create a Hub · phone', roles: ['admin'], phone: true, render: win('window-phone', found('riveralaw.com'), { phone: true }) },

        /* ── Rule ── */
        { id: 'logo-size', label: 'Minimum logo size', roles: ['admin'], note: 'Drawn at 1:1 in the header\'s logo box.',
            render: () => <Designed key="logo-size" what="logo size rule" today="Nothing checks a logo's size in the sandbox today."><LogoSizes /></Designed> },
    ],
};
