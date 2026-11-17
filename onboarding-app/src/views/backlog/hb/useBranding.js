/* HB-1 · The website lookup as one small state machine, shared by the
   signup screen and the Create a Hub window.

   The field is debounced (600 ms), the lookup takes a moment, and the
   result decides the preview. Firm name is filled from the site only while
   it is empty or still holds a name we filled in. Use default look keeps
   the found branding, so it can come back without another lookup. */

import { useEffect, useRef, useState } from 'react';
import { resultFor, tidyDomain, isDomain, readLogo, BRANDS } from './brand';

const LOOKUP_MS = 1500;
const DEBOUNCE_MS = 600;

export const useBranding = (init = {}) => {
    const [site, setSiteRaw] = useState(init.site ?? '');
    const [mode, setMode] = useState(init.mode ?? 'field');          // field | none
    const [phase, setPhase] = useState(init.phase ?? 'idle');        // idle | looking | done
    const [result, setResult] = useState(init.result ?? null);       // {kind, brand?}
    const [look, setLook] = useState(init.look ?? 'brand');          // brand | default
    const [upload, setUpload] = useState(init.upload ?? null);       // {src,w,h,alt}
    const [uploadState, setUploadState] = useState(init.uploadState ?? null); // uploading | small | type | large
    const [uploadInfo, setUploadInfo] = useState(init.uploadInfo ?? null);
    const [firm, setFirmRaw] = useState(init.firm ?? '');
    const [firmAuto, setFirmAuto] = useState(init.firmAuto ?? false);
    const [touched, setTouched] = useState(init.touched ?? false);
    const timers = useRef([]);
    const firmRef = useRef(init.firm ?? '');
    const autoRef = useRef(init.firmAuto ?? false);

    const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
    useEffect(() => clear, []);

    const resolve = (domain) => {
        const r = resultFor(domain);
        setResult(r);
        setPhase('done');
        if (r.kind === 'found' && (firmRef.current.trim() === '' || autoRef.current)) {
            firmRef.current = r.brand.name; autoRef.current = true;
            setFirmRaw(r.brand.name); setFirmAuto(true);
        }
    };

    const run = (domain, delay = DEBOUNCE_MS) => {
        clear();
        if (!isDomain(domain)) { setPhase('idle'); setResult(null); return; }
        timers.current.push(setTimeout(() => {
            setPhase('looking');
            setResult(null);
            /* A name we filled from the old site no longer fits. */
            if (autoRef.current) { firmRef.current = ''; setFirmRaw(''); }
            setUpload(null); setUploadState(null);
            timers.current.push(setTimeout(() => resolve(domain), LOOKUP_MS));
        }, delay));
    };

    /* A screen that opens mid-lookup can keep going on its own. */
    useEffect(() => {
        if (init.phase === 'looking' && init.autoResolve) {
            timers.current.push(setTimeout(() => resolve(tidyDomain(init.site || '')), init.autoResolve));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const domain = tidyDomain(site);
    const invalid = touched && site.trim() !== '' && !isDomain(domain);

    const setSite = (v) => { setSiteRaw(v); setTouched(false); setLook('brand'); run(tidyDomain(v)); };
    const blurSite = () => { if (site.trim()) { setSiteRaw(tidyDomain(site)); setTouched(true); } };
    const noWebsite = () => { clear(); setMode('none'); setPhase('idle'); setResult(null); setLook('default'); };
    const addWebsite = () => { setMode('field'); setLook('brand'); if (isDomain(domain)) run(domain, 0); };
    const useDefault = () => { setLook('default'); setUploadState(null); };
    const useBrand = () => { setLook('brand'); setUpload(null); setUploadState(null); };
    const setFirm = (v) => { firmRef.current = v; autoRef.current = false; setFirmRaw(v); setFirmAuto(false); };

    const pickFile = async (file) => {
        if (!file) return;
        setUploadState('uploading');
        const [res] = await Promise.all([readLogo(file), new Promise(r => setTimeout(r, 700))]);
        if (res.logo) { setUpload(res.logo); setUploadState(null); setLook('brand'); setUploadInfo(null); }
        else { setUploadState(res.error); setUploadInfo(res.error === 'small' ? { w: res.w, h: res.h } : null); }
    };

    /* Which status line to show. */
    const brand = result?.kind === 'found' ? result.brand : null;
    let status;
    if (mode === 'none') status = upload ? 'uploaded' : uploadState === 'uploading' ? 'uploading' : 'nosite';
    else if (!domain || !isDomain(domain)) status = 'empty';
    else if (phase === 'looking') status = 'looking';
    else if (uploadState === 'uploading') status = 'uploading';
    else if (uploadState) status = uploadState === 'small' ? 'tooSmall' : uploadState === 'type' ? 'wrongType' : 'tooLarge';
    else if (look === 'default') status = 'default';
    else if (upload) status = 'uploaded';
    else if (phase === 'done' && result) status = { found: 'found', small: 'siteSmall', unreachable: 'unreachable', notfound: 'notfound' }[result.kind];
    else status = 'looking';

    /* What the preview draws. */
    const useBrandLook = look === 'brand' && mode === 'field';
    const appearance = {
        looking: status === 'looking',
        bg: useBrandLook && brand ? brand.bg : null,
        logo: (look === 'brand' && upload) || (useBrandLook && brand ? brand.logo : null),
        favicon: useBrandLook && brand ? brand.favicon : null,
    };

    return {
        site, domain, mode, phase, result, brand, look, upload, uploadState, uploadInfo,
        firm, firmAuto, invalid, status, appearance, hadBrand: !!brand,
        setSite, blurSite, noWebsite, addWebsite, useDefault, useBrand, setFirm, pickFile,
    };
};

/* Ready-made starting points for the static screens. */
export const START = {
    found: (d = 'johnsonlaw.com') => ({ site: d, phase: 'done', result: resultFor(d), firm: BRANDS[d]?.name ?? '', firmAuto: true }),
};
