/* HB-1 · The hub preview and the status line under it.

   The preview is a small client hub: the browser tab with its favicon, the
   header in the firm's background colour with its logo, and the case card a
   client lands on, with the button in the brand colour. While the lookup
   runs, the parts it will fill shimmer. The logo sits in the header's logo
   box (200 × 40, 160 × 32 on phones), scaled to fit, never cropped. */

import { useRef } from 'react';
import StageLabel from '../../../components/StageLabel';
import { DEFAULT_LOOK, textOn, textName } from './brand';

/* The lobby's own case card, as a client sees it: title, last update,
   members, the stage tab in the corner and the accent corner. */
const STAGE = { name: 'Demand sent', description: 'We have sent a demand letter to the insurance company and are waiting for their reply.' };
const MEMBERS = [['JR', '#149EB1'], ['KW', '#6366F1'], ['CW', '#64748B']];

const Ico = ({ children, size = 16, w = 2 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);

const light = (hex) => textOn(hex) === '#000000';

export const HubPreview = ({ look, firm, phone = false }) => {
    const { looking, bg, logo, favicon } = look;
    const headBg = bg || DEFAULT_LOOK.bg;
    const headText = bg ? textOn(bg) : '#0F172A';
    /* The hub's accent: the brand colour when white text reads on it,
       otherwise a dark neutral; teal for the default look. */
    const accent = looking ? '#CBD5E1' : bg ? (light(bg) ? '#1F2937' : bg) : DEFAULT_LOOK.button;
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
            <div className="hbp-head" style={{ background: headBg, color: headText, borderBottomColor: bg ? 'transparent' : DEFAULT_LOOK.line }}>
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
                    <span className="hbp-avatar" style={{ background: bg ? (light(bg) ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.16)') : '#E6F6F8', color: bg ? headText : '#0B7C8C' }}>AR</span>
                </span>
            </div>
            <div className="hbp-body" style={{ '--accent': accent }}>
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
    err: <Ico size={18}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></Ico>,
};

/* Title, body, icon tone and actions for each status. */
const statusCopy = (b) => {
    const d = b.domain;
    const colours = b.brand ? `Colours still come from ${d}. Crop or resize it later in Design Settings.` : 'Your Hub keeps the default colours. Change them any time in Design Settings.';
    const map = {
        empty: ['info', 'Add your website to see your Hub', 'We\'ll show it here with your logo and colours.', []],
        looking: ['spin', `Looking up ${d}…`, 'Finding your logo and colours. This usually takes a few seconds.', []],
        found: ['ok', 'Found your logo and colours', `From ${d}. Change them now, or fine-tune later in Design Settings.`, ['change', 'default']],
        notfound: ['info', `We couldn't find a logo on ${d}`, 'Your Hub will start with the default look. Upload your logo now, or add it later in Design Settings.', ['upload']],
        unreachable: ['info', `We couldn't reach ${d}`, 'Check the address, or carry on. Your Hub will start with the default look.', ['upload']],
        siteSmall: ['info', `The logo on ${d} is too small`, 'It wouldn\'t look sharp in your Hub, so we\'ll use the default look. Upload a larger logo now, or add one later in Design Settings.', ['upload']],
        default: ['info', 'Using the default look', 'Add your logo and colours any time in Design Settings.', b.hadBrand ? ['brand'] : ['upload']],
        nosite: ['info', 'No website? No problem.', 'Your Hub will start with the default look. Upload your logo now, or add it later in Design Settings.', ['upload']],
        uploading: ['spin', 'Uploading your logo…', 'Checking it will look sharp in your Hub\'s header.', []],
        uploaded: ['ok', 'Using your uploaded logo', colours, ['change', 'default']],
        tooSmall: ['err', 'That logo is too small', `It's ${b.uploadInfo?.w ?? 48} × ${b.uploadInfo?.h ?? 48} px. Logos need to be at least 64 px tall (or 320 px wide if they're very wide) to look sharp. We kept your current logo.`, ['another', 'default']],
        wrongType: ['err', 'That file type isn\'t supported', 'Use a PNG, JPG, SVG or WebP file.', ['another']],
        tooLarge: ['err', 'That file is too large', 'Logos can be up to 5 MB. Try a smaller file.', ['another']],
    };
    return map[b.status] || map.empty;
};

export const LogoInput = ({ inputRef, onPick }) => (
    <input ref={inputRef} type="file" hidden accept=".png,.jpg,.jpeg,.svg,.webp,image/png,image/jpeg,image/svg+xml,image/webp"
        onChange={e => { onPick(e.target.files?.[0]); e.target.value = ''; }} />
);

export const StatusCard = ({ b }) => {
    const file = useRef(null);
    const [tone, title, body, actions] = statusCopy(b);
    const pick = () => file.current?.click();
    const label = { change: 'Change logo', upload: 'Upload logo', another: 'Choose another file', default: 'Use default look', brand: `Use ${b.domain} branding` };
    const run = { change: pick, upload: pick, another: pick, default: b.useDefault, brand: b.useBrand };
    const showSwatch = (b.status === 'found' || (b.status === 'uploaded' && b.brand)) && b.brand;

    return (
        <div className={`hbs is-${tone}`} role="status">
            <span className="hbs-ic">{ICONS[tone]}</span>
            <div className="hbs-text">
                <p className="hbs-title">{title}</p>
                <p className="hbs-body">{body}</p>
                {showSwatch && (
                    <p className="hbs-swatch">
                        <span className="hbs-chip" style={{ background: b.brand.bg }} aria-hidden="true" />
                        {b.brand.bg} background · {textName(b.brand.bg)} text, picked for contrast
                    </p>
                )}
                {actions.length > 0 && (
                    <div className="hbs-actions">
                        {actions.map(a => (
                            <button key={a} type="button" className={`hbs-btn${a === 'default' || a === 'brand' ? ' is-quiet' : ''}`} onClick={run[a]}>{label[a]}</button>
                        ))}
                    </div>
                )}
            </div>
            <LogoInput inputRef={file} onPick={b.pickFile} />
        </div>
    );
};
