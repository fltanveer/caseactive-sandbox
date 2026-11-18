/* HB-1 · The hub preview and the status line under it.

   The preview is a small client hub: the browser tab with its favicon, the
   header with the firm's logo, and the lobby's case card. The header banner
   keeps the hub's own white (Welby, 17 Nov: we change the logo and the
   rest, not the banner), so the brand colour goes where the hub's accent
   goes: the Open tab and the case card's corner, with black or white text
   on it. While the lookup runs, the parts it will fill shimmer. The logo
   sits in the header's logo box (200 × 40, 160 × 32 on phones), scaled to
   fit, never cropped. */

import StageLabel from '../../../components/StageLabel';
import { DEFAULT_LOOK, textOn, textName } from './brand';

/* The lobby's own case card, as a client sees it: title, last update,
   members, the stage tab in the corner and the accent corner. */
const STAGE = { name: 'Demand sent', description: 'We have sent a demand letter to the insurance company and are waiting for their reply.' };
const MEMBERS = [['JR', '#149EB1'], ['KW', '#6366F1'], ['CW', '#64748B']];

const Ico = ({ children, size = 16, w = 2 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);

export const HubPreview = ({ look, firm, phone = false }) => {
    const { looking, bg, logo, favicon } = look;
    /* The accent: the brand colour, or teal for the default look; grey
       until the lookup knows. Text on it is picked for contrast. */
    const accent = looking ? '#CBD5E1' : bg || DEFAULT_LOOK.button;
    const accentText = looking ? '#FFFFFF' : textOn(accent);
    const name = firm.trim() || 'Your firm';

    return (
        <figure className={`hbp${phone ? ' is-phone' : ''}`} aria-label="Preview of your Hub">
            <div className="hbp-bar">
                <span className="hbp-dots" aria-hidden="true"><i /><i /><i /></span>
                <span className="hbp-tab">
                    {looking
                        ? <span className="hbp-skel hbp-skel-fav" />
                        : <img src={favicon || DEFAULT_LOOK.favicon} alt="" className="hbp-fav" />}
                    <span className="hbp-tab-title">{name} · Client Hub</span>
                </span>
            </div>
            <div className="hbp-head">
                <span className="hbp-logo">
                    {looking ? <span className="hbp-skel hbp-skel-logo" />
                        : logo ? <img src={logo.src} alt={logo.alt || name} />
                            : <span className="hbp-logo-text">{name}</span>}
                </span>
                <span className="hbp-right">
                    {looking
                        ? <span className="hbp-skel hbp-skel-nav" />
                        : <span className="hbp-nav"><b>My case</b><span>Messages</span></span>}
                    <span className="hbp-menu"><Ico size={18}><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></Ico></span>
                    <span className="hbp-avatar">AR</span>
                </span>
            </div>
            <div className="hbp-body" style={{ '--accent': accent, '--accent-text': accentText }}>
                <div className="hbp-sec">
                    <h3 className="lobby-section-title">Cases</h3>
                    <div className="lobby-tabs-row">
                        <span className="lobby-tab-pill active">Open <span className="lobby-tab-count">3</span></span>
                        <span className="lobby-tab-pill">Closed <span className="lobby-tab-count">1</span></span>
                    </div>
                </div>
                <div className="lobby-case-card hbp-case">
                    <div className="lobby-case-head">
                        <div className="lobby-case-head-text">
                            <div className="lobby-case-title">Rear-End Collision, Downtown LA</div>
                            <span className="lobby-case-updated">Updated yesterday</span>
                        </div>
                        <StageLabel stage={STAGE} className="lobby-case-stage stage-tab" />
                    </div>
                    <div className="lc-members">
                        {MEMBERS.map(([ini, color], i) => (
                            <div key={ini} className="lc-avatar" style={{ background: color, zIndex: MEMBERS.length - i }}>{ini}</div>
                        ))}
                        <div className="lc-avatar lc-avatar-more" style={{ zIndex: 0 }}>+1</div>
                    </div>
                    <div className="lobby-case-corner" />
                </div>
            </div>
        </figure>
    );
};

/* ── The status line ───────────────────────────────────────────────────── */

const ICONS = {
    spin: <span className="hbs-spin" aria-hidden="true" />,
    ok: <Ico size={18}><circle cx="12" cy="12" r="10" /><polyline points="16 9 10.5 15 8 12.5" /></Ico>,
    info: <Ico size={18}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></Ico>,
};

/* Title, body, icon tone and actions for each status. No logo upload or
   change at signup: whenever the Hub falls back to the default look, the
   card says where the logo can be uploaded later. */
const SETTINGS_PATH = 'Settings → General → Design Settings';
const uploadTip = (status) => ({
    siteSmall: 'You can upload a larger logo any time in',
    notfound: 'You can upload your logo any time in',
    unreachable: 'You can upload your logo any time in',
    default: 'You can upload your logo any time in',
    nosite: 'You can upload your logo any time in',
}[status]);

export const UploadTip = ({ status, className = 'hbs-tip' }) => {
    const lead = uploadTip(status);
    if (!lead) return null;
    return (
        <p className={className}>
            <Ico size={15}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" /></Ico>
            <span>{lead} <b>{SETTINGS_PATH}</b>.</span>
        </p>
    );
};
const statusCopy = (b) => {
    const d = b.domain;
    const map = {
        empty: ['info', 'Add your website to see your Hub', 'We\'ll show it here with your logo and colours.', []],
        looking: ['spin', `Looking up ${d}…`, 'Finding your logo and colours. This usually takes a few seconds.', []],
        found: ['ok', 'Found your logo and colours', `From ${d}. Fine-tune them any time in Design Settings.`, ['default']],
        notfound: ['info', `We couldn't find a logo on ${d}`, 'Your Hub will start with the default look.', []],
        unreachable: ['info', `We couldn't reach ${d}`, 'Check the address, or carry on. Your Hub will start with the default look.', []],
        siteSmall: ['info', `The logo on ${d} is too small`, 'It wouldn\'t look sharp in your Hub, so we\'ll use the default look.', []],
        default: ['info', 'Using the default look', 'Your Hub will start with your firm\'s name in the header and the default colours.', b.hadBrand ? ['brand'] : []],
        nosite: ['info', 'No website? No problem.', 'Your Hub will start with the default look.', []],
    };
    return map[b.status] || map.empty;
};

export const StatusCard = ({ b }) => {
    const [tone, title, body, actions] = statusCopy(b);
    const label = { default: 'Use default look', brand: `Use ${b.domain} branding` };
    const run = { default: b.useDefault, brand: b.useBrand };
    const showSwatch = b.status === 'found' && b.brand;

    return (
        <div className={`hbs is-${tone}`} role="status">
            <span className="hbs-ic">{ICONS[tone]}</span>
            <div className="hbs-text">
                <p className="hbs-title">{title}</p>
                <p className="hbs-body">{body}</p>
                {showSwatch && (
                    <p className="hbs-swatch">
                        <span className="hbs-chip" style={{ background: b.brand.bg }} aria-hidden="true" />
                        {b.brand.bg} brand colour · {textName(b.brand.bg)} text on it, picked for contrast
                    </p>
                )}
                <UploadTip status={b.status} />
                {actions.length > 0 && (
                    <div className="hbs-actions">
                        {actions.map(a => (
                            <button key={a} type="button" className="hbs-btn is-quiet" onClick={run[a]}>{label[a]}</button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
