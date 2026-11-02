/* ER-1 · Page not found, Access denied and the error pop-ups, in the case
   workspace (ca-app) and the Admin Panel (ca-manage).

   Kept from today: every window keeps its Close, and the messages keep
   their meaning. What changes is that each says what happened in its own
   title instead of "Access Denied", and each gives one way forward. */

import { useState } from 'react';
import Toast from '../../../components/Toast';
import LobbyView from '../../LobbyView';
import DashboardView from '../../DashboardView';
import FeedView from '../../FeedView';
import { AdminFrame, BareFrame, Phone, Proposal } from '../Shell';
import { usePatched } from '../patchContext';
import { FIRM, APP, Icon, Dialog, NotBuilt, Pair, CasePage } from '../ms/parts';

/* One quiet picture for the not-found and no-access states. */
const Picture = ({ kind = 'lock' }) => (
    <svg className="er-pic" width="120" height="96" viewBox="0 0 120 96" fill="none" aria-hidden="true">
        <rect x="22" y="10" width="62" height="78" rx="6" fill="#fff" stroke="#CBD5E1" strokeWidth="2" />
        <path d="M34 28h38M34 38h38M34 48h24" stroke="#E2E8F0" strokeWidth="4" strokeLinecap="round" />
        <circle cx="80" cy="62" r="20" fill="#E8F6F8" stroke="#149EB1" strokeWidth="2" />
        {kind === 'lock' ? (
            <>
                <rect x="72" y="60" width="16" height="12" rx="2" fill="#149EB1" />
                <path d="M75 60v-3a5 5 0 0 1 10 0v3" stroke="#149EB1" strokeWidth="2.4" fill="none" />
            </>
        ) : (
            <text x="80" y="69" textAnchor="middle" fontSize="20" fontWeight="700" fill="#149EB1">?</text>
        )}
    </svg>
);

/* ══ 1 · Page not found ═════════════════════════════════════════════════ */

const Lost = ({ home, path }) => (
    <div className="er-lost">
        <Picture kind="lost" />
        <span className="er-code">404</span>
        <h1 className="er-title">Page not found</h1>
        <p className="ms-p">The link may be old, or the page has moved. Check the address, or carry on from {home === 'Lobby' ? 'the Lobby' : 'your dashboard'}.</p>
        <code className="ms-code">{path}</code>
        <button type="button" className="btn btn-primary">{home === 'Lobby' ? 'Go to the Lobby' : 'Go to the Dashboard'}</button>
    </div>
);

const TODAY_404 = 'Today it is only the heading "Page Not Found 404": no picture, link or button.';

/* Case workspace: the Lobby's top bar stays; the page under it is the 404. */
export const NotFoundApp = ({ phone = false }) => {
    const on = usePatched();
    const frame = (
        <BareFrame height={phone ? undefined : 680}>
            <LobbyView onToggle={() => {}} onHubs={() => {}} />
            <div className="er-cover">
                {on ? <Lost home="Lobby" path={`${APP}/cases/8812/old-link`} /> : <div className="er-today-404"><h1>Page Not Found 404</h1></div>}
            </div>
        </BareFrame>
    );
    return phone ? <Phone>{frame}</Phone> : frame;
};

export const NotFoundAdmin = ({ phone = false }) => {
    const on = usePatched();
    const frame = (
        <AdminFrame nav="" title={on ? 'Page not found' : 'Page Not Found 404'} breadcrumb="sterlingbrooks.manage.caseactive.com/settings/old-page" height={phone ? undefined : 680}>
            {on ? <Lost home="Dashboard" path="/settings/old-page" /> : <NotBuilt what="way back from a wrong address" today={TODAY_404} />}
        </AdminFrame>
    );
    return phone ? <Phone>{frame}</Phone> : frame;
};

/* ══ 2 · Access denied ══════════════════════════════════════════════════ */

/* Each reason gets its own title; today all are "Access Denied". The two
   case reasons keep the picture, the account reasons are text only. */
const REASONS = {
    notMember: { title: 'You don\'t have access to this case', body: 'Only the people working on it can open it. Ask your legal team if you think you should.', pic: true },
    removed: { title: 'You were removed from this case', body: 'You don\'t have access to this case anymore. Ask your legal team if you think that\'s a mistake.', pic: true },
    disabled: { title: 'Your account is turned off', body: `An admin at ${FIRM} turned off your account. Contact them to turn it back on.` },
    wrongType: { title: 'This account can\'t open this page', body: 'You\'re signed in as staff, and this page is for clients. Sign in with the right account to open it.' },
    session: { title: 'Your sign-in has expired', body: 'For your security you were signed out. Sign in again to carry on.', action: 'Sign in again' },
};

const DeniedDialog = ({ reason }) => {
    const r = REASONS[reason];
    return (
        <Dialog title={r.title} width={460} onClose={() => {}} className="er-denied"
            footer={<>
                <button type="button" className={`btn ${r.action ? 'btn-secondary' : 'btn-primary'}`}>Close</button>
                {r.action && <button type="button" className="btn btn-primary">{r.action}</button>}
            </>}>
            {r.pic && <div className="er-pic-wrap"><Picture /></div>}
            <p className="ms-p">{r.body}</p>
        </Dialog>
    );
};

export const DeniedApp = ({ reason = 'notMember', phone = false }) => {
    const on = usePatched();
    const frame = (
        <BareFrame height={phone ? undefined : 680} modal={on && <DeniedDialog reason={reason} />}>
            <LobbyView onToggle={() => {}} onHubs={() => {}} />
            {!on && <div className="ms-today-float"><NotBuilt what="fitting title" today={'Today this window is titled "Access Denied" for every reason.'} /></div>}
        </BareFrame>
    );
    return phone ? <Phone>{frame}</Phone> : frame;
};

/* Admin Panel: a page, not a window, since there is nothing behind it to
   go back to. A Client is told where they belong. */
const AdminDenied = ({ client }) => (
    <div className="ms-auth">
        <div className="ms-auth-card is-wide er-admin-denied">
            <img src="/assets/images/logo.svg" alt="CaseActive" className="ms-auth-logo" />
            <Picture />
            <h1 className="ms-auth-title">{client ? 'The Admin Panel is only for this hub\'s Admins and Managers' : 'You do not have access to this account'}</h1>
            <p className="ms-p">{client
                ? 'Your cases, documents and messages are in the Lobby.'
                : `You're signed in as marcus.bell@gmail.com, which isn't an Admin or Manager on ${FIRM}. Ask an Admin to give you access, or sign in with another account.`}</p>
            {client
                ? <button type="button" className="btn btn-primary ms-block">Go to the Lobby</button>
                : <button type="button" className="btn btn-secondary ms-block">Use another account</button>}
        </div>
    </div>
);

export const DeniedAdmin = ({ client }) => (
    <Proposal instead={<NotBuilt what="way forward" today={client ? 'Today it is titled "Access Denied", with "The Admin Panel is only for this hub\'s Admins and Managers." and Go to the Lobby.' : 'Today it is titled "Access Denied", with "You do not have access to this account".'} />}>
        <Pair url="sterlingbrooks.manage.caseactive.com" height={560}><AdminDenied client={client} /></Pair>
    </Proposal>
);

/* ══ Join this portal? ══════════════════════════════════════════════════ */

const JoinCard = ({ allowed }) => (
    <div className="ms-auth">
        <div className="ms-auth-card is-wide">
            <span className="ms-unsub-brand"><img src="/assets/images/hubs/sterling-brooks-favicon.svg" alt="" width="34" height="34" className="ms-firm-mark" /><strong>{FIRM}</strong></span>
            <h1 className="ms-auth-title">Join this portal?</h1>
            <p className="ms-p">You&apos;re signed in as <strong>alexandra@example.com</strong>, which isn&apos;t part of {FIRM}&apos;s portal yet.</p>
            {allowed ? (
                <p className="ms-p ms-muted">Joining as a client lets {FIRM} share your case, documents and messages with you here.</p>
            ) : (
                <div className="er-explain">
                    <p className="ms-p">{FIRM} only adds people by invitation, so this account can&apos;t join on its own.</p>
                    <p className="ms-p ms-muted">If they invited you at a different email address, sign in with that one. Otherwise ask {FIRM} to send an invitation to alexandra@example.com.</p>
                </div>
            )}
            {allowed && <button type="button" className="btn btn-primary ms-block">Join as a client</button>}
            <button type="button" className={`btn ${allowed ? 'btn-secondary' : 'btn-primary'} ms-block`}>Use another account</button>
        </div>
    </div>
);

export const Join = ({ allowed = true }) => (
    <Proposal instead={<NotBuilt what="new look" today="ca-app's join page isn't in this codebase." />}>
        <Pair url={`${APP}/join`} height={560}><JoinCard allowed={allowed} /></Pair>
    </Proposal>
);

/* ══ 3 · Error pop-ups ══════════════════════════════════════════════════ */

const ServerError = () => (
    <Dialog title="Something went wrong" width={460} onClose={() => {}} className="er-denied"
        footer={<button type="button" className="btn btn-primary">Close</button>}>
        <div className="er-pic-wrap"><span className="er-err-ic"><Icon name="alert" size={30} /></span></div>
        <p className="ms-p">It&apos;s on our side, not yours. Close this and try again in a moment.</p>
        <p className="ms-small ms-muted">If it keeps happening, tell support the time it happened.</p>
    </Dialog>
);

const OutOfDate = () => (
    <Dialog title="A new version of CaseActive is ready" width={460} onClose={() => {}}
        footer={<>
            <button type="button" className="btn btn-secondary">Later</button>
            <button type="button" className="btn btn-primary"><Icon name="refresh" size={14} />Refresh</button>
        </>}>
        <p className="ms-p">Press Refresh to get it. Save anything you&apos;re working on first.</p>
    </Dialog>
);

const Billing = () => (
    <Dialog title="Add a payment method" width={460} onClose={() => {}}
        footer={<button type="button" className="btn btn-primary"><Icon name="card" size={15} />Add Payment</button>}>
        <p className="ms-p">Please enter valid payment information to keep {FIRM} running. The card on file didn&apos;t work.</p>
    </Dialog>
);

/* kind: server | outdated | billing */
export const Popup = ({ kind = 'server', where = 'admin', phone = false }) => {
    const on = usePatched();
    const modal = on && (kind === 'server' ? <ServerError /> : kind === 'outdated' ? <OutOfDate /> : <Billing />);
    const today = !on && (
        <div className="ms-today-float"><NotBuilt what="new look" today={{
            server: 'Today: "Oops, Something went wrong." with a picture and Close. Ask Welby for a screenshot of the live one.',
            outdated: 'Today: "Press refresh", with Refresh and Later.',
            billing: 'Today: "Please enter valid payment information" with Add Payment.',
        }[kind]} /></div>
    );
    const frame = where === 'app' ? (
        <CasePage nav="Feed" phone={phone} height={680} modal={modal}>
            <div className="tk-mount"><FeedView /></div>
            {today}
        </CasePage>
    ) : (
        <AdminFrame nav="Home" sub="Dashboard" title="Dashboard" height={phone ? undefined : 680} modal={modal}>
            <div className="tk-mount"><DashboardView /></div>
            {today}
        </AdminFrame>
    );
    return phone && where !== 'app' ? <Phone>{frame}</Phone> : frame;
};

/* The read-only hub banner, at the top of every page while it applies. */
const ReadOnlyBanner = ({ admin }) => (
    <div className="er-ro" role="status">
        <span className="er-ro-ic"><Icon name="lock" size={16} /></span>
        <p className="er-ro-text">
            <strong>This hub is read-only because its subscription ended on Jun 30, 2026.</strong>{' '}
            {admin ? 'Renew it to make changes again. Everything is still here.' : 'You can still see everything. Ask an Admin to renew it.'}
        </p>
        {admin && <button type="button" className="btn btn-primary btn-sm">Renew subscription</button>}
    </div>
);

export const ReadOnly = ({ where = 'admin', phone = false }) => {
    const on = usePatched();
    if (where === 'app') {
        return (
            <CasePage nav="Feed" phone={phone} height={640}>
                {on && <ReadOnlyBanner />}
                <div className="tk-mount"><FeedView /></div>
            </CasePage>
        );
    }
    const frame = (
        <AdminFrame nav="Home" sub="Dashboard" title="Dashboard" height={phone ? undefined : 680}>
            {on && <ReadOnlyBanner admin />}
            <div className="tk-mount"><DashboardView /></div>
        </AdminFrame>
    );
    return phone ? <Phone>{frame}</Phone> : frame;
};

/* ══ Corner notices ═════════════════════════════════════════════════════ */

const Progress = ({ message }) => (
    <div className="toast toast-info er-toast-progress" role="status">
        <span className="toast-icon"><span className="cw-spin" aria-hidden="true" /></span>
        <span className="toast-msg">{message}</span>
    </div>
);

export const Notices = ({ phone = false }) => {
    const on = usePatched();
    const [shown, setShown] = useState({ success: true, error: true, progress: true });
    const hide = (k) => () => setShown(s => ({ ...s, [k]: false }));
    /* Held at the frame's level, not inside the page, so nothing clips them.
       Top right on a computer; along the bottom on a phone, where the thumb
       and the eye already are and the top bar stays clear. */
    const toasts = (
        <div className={`er-toasts${on ? '' : ' is-today'}`}>
            {on ? (
                <>
                    {shown.success && <Toast tone="success" duration={0} message="Note saved." onClose={hide('success')} />}
                    {shown.error && <Toast tone="error" duration={0} message="Couldn't upload Police report.pdf. Try again." onClose={hide('error')} />}
                    {shown.progress && <Progress message="Uploading Police report.pdf…" />}
                </>
            ) : (
                <>
                    <div className="er-old-toast">Note saved.<span aria-hidden="true">×</span></div>
                    <div className="er-old-toast">Upload failed.<span aria-hidden="true">×</span></div>
                </>
            )}
        </div>
    );
    return (
        <CasePage nav="Feed" phone={phone} height={640} modal={toasts}>
            <div className="tk-mount"><FeedView /></div>
        </CasePage>
    );
};
