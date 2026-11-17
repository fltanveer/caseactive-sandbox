/* HB-1 · The firms the lookup can find, and the rules it runs by.

   Demo domains, so every state can be reached by typing:
     johnsonlaw.com   wide navy wordmark, navy brand colour (white text on it)
     riveralaw.com    square logo, light brand colour (black text on it)
     kellerlaw.com    the site has a logo, but it is 48 × 48, too small
     brightonlegal.co.uk  the site doesn't load
     anything else    nothing found

   Logos are drawn as SVG and passed around as data URIs, so a found logo
   and an uploaded file are the same thing to the preview: an <img>. */

const svg = (s) => `data:image/svg+xml;utf8,${encodeURIComponent(s)}`;

const JOHNSON_LOGO = svg(`<svg xmlns="http://www.w3.org/2000/svg" width="330" height="55" viewBox="0 0 330 55">
<g fill="none" stroke="#1B2B4B" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
<path d="M27 6v42M14 48h26M8 14h38M8 14l-6 16h12zM46 14l-6 16h12z"/><path d="M2 30a6 4 0 0 0 12 0M40 30a6 4 0 0 0 12 0"/></g>
<text x="66" y="31" fill="#1B2B4B" font-family="Georgia, 'Times New Roman', serif" font-size="25" font-weight="700" letter-spacing="2">JOHNSON</text>
<text x="67" y="48" fill="#5B6B86" font-family="Georgia, 'Times New Roman', serif" font-size="12.5" letter-spacing="4.2">&amp; ASSOCIATES</text>
</svg>`);

const JOHNSON_ICON = svg(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
<rect width="64" height="64" rx="14" fill="#1B2B4B"/><text x="32" y="44" text-anchor="middle" fill="#fff" font-family="Georgia, serif" font-size="34" font-weight="700">J</text></svg>`);

const RIVERA_LOGO = svg(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
<circle cx="60" cy="60" r="56" fill="#7A2E2A"/><circle cx="60" cy="60" r="47" fill="none" stroke="#F3EDE2" stroke-width="2"/>
<text x="60" y="78" text-anchor="middle" fill="#F3EDE2" font-family="Georgia, serif" font-size="54" font-weight="700">R</text></svg>`);

const RIVERA_ICON = svg(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
<circle cx="32" cy="32" r="32" fill="#7A2E2A"/><text x="32" y="44" text-anchor="middle" fill="#F3EDE2" font-family="Georgia, serif" font-size="32" font-weight="700">R</text></svg>`);

export const BRANDS = {
    'johnsonlaw.com': {
        domain: 'johnsonlaw.com', name: 'Johnson & Associates',
        logo: { src: JOHNSON_LOGO, w: 330, h: 55, alt: 'Johnson & Associates' },
        favicon: JOHNSON_ICON, bg: '#1B2B4B',
    },
    'riveralaw.com': {
        domain: 'riveralaw.com', name: 'Rivera Injury Law',
        logo: { src: RIVERA_LOGO, w: 120, h: 120, alt: 'Rivera Injury Law' },
        favicon: RIVERA_ICON, bg: '#F3EDE2',
    },
};

/* A logo the person picked with Change logo, for the static screens. */
export const SAMPLE_UPLOAD = {
    src: svg(`<svg xmlns="http://www.w3.org/2000/svg" width="360" height="72" viewBox="0 0 360 72">
<rect x="4" y="10" width="52" height="52" rx="10" fill="#1B2B4B"/>
<text x="30" y="47" text-anchor="middle" fill="#fff" font-family="Georgia, serif" font-size="22" font-weight="700">J&amp;A</text>
<text x="72" y="46" fill="#1B2B4B" font-family="Helvetica, Arial, sans-serif" font-size="27" font-weight="700" letter-spacing="1">Johnson Law</text></svg>`),
    w: 360, h: 72, alt: 'Your logo',
};

/* What the lookup returns for a domain: found, small, unreachable or none. */
export const resultFor = (domain) => {
    if (BRANDS[domain]) return { kind: 'found', brand: BRANDS[domain] };
    if (domain === 'kellerlaw.com') return { kind: 'small', name: 'Keller Law Group' };
    if (domain === 'brightonlegal.co.uk') return { kind: 'unreachable' };
    return { kind: 'notfound' };
};

/* The default look, as the client hub shows it today when nothing is set. */
export const DEFAULT_LOOK = { bg: '#FFFFFF', line: '#E5E7EB', button: '#149EB1', favicon: '/assets/images/logo-sm.svg' }; // button = the hub accent

/* Black or white text, whichever reads better on the background. */
const lum = (hex) => {
    const n = hex.replace('#', '');
    const [r, g, b] = [0, 2, 4].map(i => parseInt(n.slice(i, i + 2), 16) / 255)
        .map(c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const textOn = (hex) => ((lum(hex) + 0.05) / 0.05 > 1.05 / (lum(hex) + 0.05) ? '#000000' : '#FFFFFF');
export const textName = (hex) => (textOn(hex) === '#000000' ? 'black' : 'white');

/* The website field: johnsonlaw.com, www.johnsonlaw.com and
   https://johnsonlaw.com/about all tidy to johnsonlaw.com. */
export const tidyDomain = (raw) => raw.trim().toLowerCase()
    .replace(/^[a-z]+:\/\//, '').replace(/^www\./, '').replace(/[/?#].*$/, '');
export const isDomain = (d) => /^[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/.test(d);

/* The work email gives the website, unless it is a free email domain. */
const FREE = ['gmail.com', 'outlook.com', 'yahoo.com', 'icloud.com', 'hotmail.com', 'aol.com'];
export const domainFromEmail = (email) => {
    const d = (email.split('@')[1] || '').toLowerCase();
    return FREE.includes(d) ? '' : d;
};

/* Minimum logo size: 64 px tall, or 320 px wide for logos wider than 5:1.
   SVG always passes. Favicons need 32 × 32. */
export const MIN_H = 64;
export const MIN_W_WIDE = 320;
export const logoBigEnough = ({ w, h, svg: isSvg }) => isSvg || h >= MIN_H || (w / h > 5 && w >= MIN_W_WIDE);

export const TYPES = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];
export const MAX_MB = 5;

/* Read a picked file: type, size, then its pixel size. */
export const readLogo = (file) => new Promise((resolve) => {
    if (!TYPES.includes(file.type)) { resolve({ error: 'type' }); return; }
    if (file.size > MAX_MB * 1024 * 1024) { resolve({ error: 'large' }); return; }
    const src = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
        const logo = { src, w: img.naturalWidth || 0, h: img.naturalHeight || 0, svg: file.type === 'image/svg+xml', alt: 'Your logo' };
        resolve(logoBigEnough(logo) ? { logo } : { error: 'small', w: logo.w, h: logo.h });
    };
    img.onerror = () => resolve({ error: 'type' });
    img.src = src;
});
