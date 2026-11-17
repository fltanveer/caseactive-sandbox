/* HB-1 · Creating another hub from inside the app (Welby, 17 Nov: "how
   does it look when I create a new hub inside?").

   The window steps are window.jsx. After Create Hub, these two screens show
   where the branding lands: the new hub's row in the Hubs list carries its
   favicon instead of a letter tile, and the hub itself opens with its logo
   in the header (the header keeps its white) and its colour on the accent.
   Today, the same hub is added with a letter tile and the default look. */

import HubsPage from '../../HubsPage';
import { AccountShell, BareFrame, Phone, Proposal } from '../Shell';
import { HubPreview } from './preview';
import { BRANDS } from './brand';

const RIVERA = BRANDS['riveralaw.com'];

const newHub = (branded) => ({
    name: RIVERA.name, type: 'admin', status: 'active',
    industry: 'legal', website: branded ? `https://${RIVERA.domain}` : '', favicon: branded ? RIVERA.favicon : null,
    planId: 'growth', interval: 'monthly', sub: 'trial', discount: null, pausedUntil: null,
    card: null, cases: 0, documents: 0, clients: 0, automations: 0,
});

export const HubsAfter = ({ phone = false }) => {
    const frame = (
        <BareFrame height={phone ? undefined : 620}>
            <AccountShell narrow={phone}>
                <div className="tk-mount">
                    <Proposal instead={<HubsPage key="today" embedded extraHubs={[newHub(false)]} />}>
                        <HubsPage key="proposed" embedded extraHubs={[newHub(true)]} />
                    </Proposal>
                </div>
            </AccountShell>
        </BareFrame>
    );
    return phone ? <Phone height={844}>{frame}</Phone> : frame;
};

const DEFAULT = { looking: false, bg: null, logo: null, favicon: null };
const BRANDED = { looking: false, bg: RIVERA.bg, logo: RIVERA.logo, favicon: RIVERA.favicon };

export const NewHub = ({ phone = false }) => {
    const body = (
        <div className="hbi">
            <div className="hbi-head">
                <p className="hbi-kicker">{RIVERA.name} · just created</p>
                <h3 className="hbi-title">What its clients see when they sign in</h3>
                <p className="hbi-sub">
                    <Proposal instead={<>Today: the default look, with the firm&apos;s name as text and the CaseActive favicon, until someone uploads a logo in Design Settings.</>}>
                        Logo and favicon from {RIVERA.domain}. The header keeps its white; the brand colour {RIVERA.bg} goes on the accent, with black text on it.
                    </Proposal>
                </p>
            </div>
            <div className="hbi-stage">
                <Proposal instead={<HubPreview look={DEFAULT} firm={RIVERA.name} phone={phone} />}>
                    <HubPreview look={BRANDED} firm={RIVERA.name} phone={phone} />
                </Proposal>
            </div>
        </div>
    );
    return phone ? <Phone height={844}>{body}</Phone> : body;
};
