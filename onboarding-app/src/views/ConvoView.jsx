import { useEffect, useRef, useState } from 'react';
import SearchableSelect from '../components/SearchableSelect';
import InfoBanner from '../components/InfoBanner';
import './library/LibraryViews.css';
import './EventsView.css';
import './FormsView.css';
import './ConvoView.css';

/* ── Icons ───────────────────────────────────────────────────────────── */
const I = {
    cam:      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
    camOff:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
    mic:      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>,
    micOff:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/><line x1="12" y1="19" x2="12" y2="23"/></svg>,
    blur:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="4" r="1"/><circle cx="12" cy="20" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="20" cy="12" r="1"/><circle cx="6.3" cy="6.3" r="1"/><circle cx="17.7" cy="17.7" r="1"/><circle cx="17.7" cy="6.3" r="1"/><circle cx="6.3" cy="17.7" r="1"/></svg>,
    present:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/><polyline points="9 10 12 7 15 10"/><line x1="12" y1="7" x2="12" y2="13"/></svg>,
    share:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
    expand:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>,
    collapse: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>,
    gear:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    phoneOff: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 3.92 1.4h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91"/><line x1="23" y1="1" x2="1" y2="23"/></svg>,
    chat:     <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
    people:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    send:     <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    copy:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
    check:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    arrow:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    back:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
    smallCam: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
    smallMic: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>,
    speaker:  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>,
    caption:  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 13h3"/><path d="M14 13h3"/><path d="M7 10h3"/><path d="M14 10h3"/></svg>,
    spark:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M18.5 16.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/></svg>,
    flag:     <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V4s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>,
    note:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    record:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4" fill="currentColor"/></svg>,
};

const MODES = [
    {
        id: 'video', label: 'Video & Audio', hint: 'Camera and microphone. Best for client meetings.',
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
    },
    {
        id: 'audio', label: 'Audio only', hint: 'Microphone only. Lighter on a weak connection.',
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>,
    },
    {
        id: 'present', label: 'Present', hint: 'Start on a shared screen — good for walking a document.',
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
    },
];

const TEAM = [
    { id: 'mb', name: 'Marcus Bell',    role: 'Lead Attorney',     initials: 'MB' },
    { id: 'er', name: 'Elena Ramirez',  role: 'Case Manager',      initials: 'ER' },
    { id: 'sl', name: 'Sarah Lee',      role: 'Paralegal',         initials: 'SL' },
    { id: 'do', name: 'Danielle Okafor', role: 'Intake Specialist', initials: 'DO' },
    { id: 'jr', name: 'James Rivera',   role: 'Client',            initials: 'JR' },
];

const STEPS = [
    { id: 'setup',   label: 'Set up'        },
    { id: 'devices', label: 'Check devices' },
    { id: 'call',    label: 'In call'       },
];

const CAMERA_FALLBACK = [{ id: 'default-cam', label: 'Built-in camera' }];
const MIC_FALLBACK    = [{ id: 'default-mic', label: 'Built-in microphone' }];
const SPK_FALLBACK    = [{ id: 'default-spk', label: 'System output' }];

/* OS device names carry a hardware id nobody reads — "FaceTime HD Camera
   (D288:CE50)". Drop that, keep the parts that tell devices apart. */
const prettyDevice = label => label
    .replace(/\s*\([^)]*[0-9a-f]{4}[:\-][0-9a-f]{4}[^)]*\)/gi, '')
    .replace(/^Default\s*[-–—]\s*/i, '')
    .trim() || label;

const CALL_LINK = 'https://sterlingbrooks.caseactive.app/convo/9K4-22F-QTX';

/* Transcript is a timed script rather than a ticking queue: lines are simply
   the ones whose timestamp has passed, so the panel stays correct even if the
   component re-mounts mid-call. */
const TRANSCRIPT = [
    { t: 4,   who: 'Marcus Bell',   initials: 'MB', text: 'Thanks for making time, James. We wanted to walk you through where the claim stands.' },
    { t: 11,  who: 'James Rivera',  initials: 'JR', text: 'No problem. The neck pain is still there, and I have missed another week of work.' },
    { t: 19,  who: 'Marcus Bell',   initials: 'MB', text: 'That matters for the wage claim. Are you still seeing the chiropractor on Tuesdays?' },
    { t: 27,  who: 'James Rivera',  initials: 'JR', text: 'Twice a week now. He said about six more weeks.' },
    { t: 35,  who: 'Elena Ramirez', initials: 'ER', text: 'I will request the updated treatment records so the demand reflects the full course.' },
    { t: 44,  who: 'Marcus Bell',   initials: 'MB', text: 'The adjuster opened at eight thousand five hundred. We are not responding to that.' },
    { t: 53,  who: 'James Rivera',  initials: 'JR', text: 'Is that normal? It sounds low for what I have been through.' },
    { t: 61,  who: 'Marcus Bell',   initials: 'MB', text: 'It is an opening number. We answer once treatment is complete and the records support it.' },
    { t: 72,  who: 'Elena Ramirez', initials: 'ER', text: 'James, I will also need the wage letter from your employer — payroll can email it.' },
    { t: 81,  who: 'James Rivera',  initials: 'JR', text: 'I will ask them this week.' },
    { t: 90,  who: 'Marcus Bell',   initials: 'MB', text: 'Good. No court date is set. Next milestone is the demand package once records are in.' },
];

/* Each point names the timestamp it is drawn from, so a call that ends early
   summarises only what was actually said. */
const SUMMARY_POINTS = [
    { after: 11, text: 'Client reports ongoing neck pain and a further week of missed work.' },
    { after: 27, text: 'Chiropractic care is twice weekly with roughly six weeks of treatment remaining.' },
    { after: 44, text: 'Adjuster has opened at $8,500; the firm is not responding at that figure.' },
    { after: 61, text: 'Position is to answer only once treatment is complete and records support the demand.' },
    { after: 90, text: 'No court date set — next milestone is the demand package.' },
];

const SUMMARY_ACTIONS = [
    { after: 35, text: 'Request updated treatment records from the chiropractor', owner: 'Elena Ramirez' },
    { after: 72, text: 'Obtain the wage letter from the employer\u2019s payroll', owner: 'James Rivera' },
    { after: 90, text: 'Draft the demand package once records are complete', owner: 'Marcus Bell' },
];

const clock = secs => {
    const s = secs % 60, m = Math.floor(secs / 60) % 60, h = Math.floor(secs / 3600);
    const mm = `${m}`.padStart(h ? 2 : 1, '0');
    return `${h ? `${h}:` : ''}${mm}:${`${s}`.padStart(2, '0')}`;
};

/* ── Live preview ─────────────────────────────────────────────────────
   Real getUserMedia, because the whole point of this step is answering
   "is my camera actually working". Denied or absent hardware is a normal
   outcome, not an error state — the user can still join without video. */
const usePreview = (wantVideo, wantAudio) => {
    const videoRef = useRef(null);
    const levelRef = useRef(null);
    const streamRef = useRef(null);
    const [state, setState] = useState('idle');   // idle | live | denied | unsupported
    const [streamTick, setStreamTick] = useState(0);
    const [devices, setDevices] = useState({ cameras: CAMERA_FALLBACK, mics: MIC_FALLBACK, speakers: SPK_FALLBACK });

    useEffect(() => {
        if (!wantVideo && !wantAudio) { setState('idle'); return; }
        if (!navigator.mediaDevices?.getUserMedia) { setState('unsupported'); return; }

        let stream, audioCtx, raf, dead = false;

        navigator.mediaDevices.getUserMedia({ video: wantVideo, audio: wantAudio }).then(async s => {
            if (dead) { s.getTracks().forEach(t => t.stop()); return; }
            stream = s;
            streamRef.current = s;
            setState('live');
            setStreamTick(n => n + 1);

            /* Labels only come back once permission is granted. */
            const list = await navigator.mediaDevices.enumerateDevices().catch(() => []);
            const pick = (kind, fallback) => {
                const found = list.filter(d => d.kind === kind && d.label)
                    .map(d => ({ id: d.deviceId, label: prettyDevice(d.label) }));
                return found.length ? found : fallback;
            };
            if (!dead) setDevices({
                cameras:  pick('videoinput',  CAMERA_FALLBACK),
                mics:     pick('audioinput',  MIC_FALLBACK),
                speakers: pick('audiooutput', SPK_FALLBACK),
            });

            if (!wantAudio || !s.getAudioTracks().length) return;
            const Ctx = window.AudioContext || window.webkitAudioContext;
            if (!Ctx) return;
            audioCtx = new Ctx();
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 512;
            audioCtx.createMediaStreamSource(s).connect(analyser);
            const buf = new Uint8Array(analyser.frequencyBinCount);
            /* Written straight to the node — a state update per frame would
               re-render the whole step 60 times a second for a 4px bar. */
            const tick = () => {
                analyser.getByteTimeDomainData(buf);
                let peak = 0;
                for (let i = 0; i < buf.length; i++) peak = Math.max(peak, Math.abs(buf[i] - 128));
                if (levelRef.current) levelRef.current.style.width = `${Math.min(100, (peak / 70) * 100)}%`;
                raf = requestAnimationFrame(tick);
            };
            tick();
        }).catch(() => { if (!dead) setState('denied'); });

        return () => {
            dead = true;
            streamRef.current = null;
            if (raf) cancelAnimationFrame(raf);
            if (audioCtx) audioCtx.close().catch(() => {});
            if (stream) stream.getTracks().forEach(t => t.stop());
        };
    }, [wantVideo, wantAudio]);

    /* The <video> is mounted by the render that `state` triggers, so the
       stream can only be attached on the pass after it goes live. */
    useEffect(() => {
        if (state === 'live' && videoRef.current) videoRef.current.srcObject = streamRef.current;
    }, [state, streamTick]);

    return { videoRef, levelRef, state, devices };
};

/* One row per device: OS names are long, and three of them side by side
   wrapped onto two lines. */
const DeviceRow = ({ icon, label, list, value, onChange }) => (
    <div className="cv-device">
        <span className="cv-device-icon">{icon}</span>
        <span className="cv-device-label">{label}</span>
        <SearchableSelect value={value || list[0].label} onChange={e => onChange(e.target.value)} placeholder={label}>
            {list.map(d => <option key={d.id} value={d.label}>{d.label}</option>)}
        </SearchableSelect>
    </div>
);

/* ── Step 1 · Set up ─────────────────────────────────────────────────── */
const SetupStep = ({ mode, setMode, invited, toggleInvite, record, setRecord, notify, setNotify, ai, setAi, onStart }) => (
    <div className="cv-card">
        <div className="cv-card-head">
            <h3 className="cv-card-title">Start a Convo call</h3>
            <p className="cv-card-sub">Everyone you pick gets a link. Nothing is dialled until you join.</p>
        </div>

        <div className="cv-section">
            <span className="cv-section-label">Start with</span>
            <div className="cv-mode-grid">
                {MODES.map(m => (
                    <button key={m.id} className={`cv-mode${mode === m.id ? ' active' : ''}`} onClick={() => setMode(m.id)}>
                        <span className="cv-mode-icon">{m.icon}</span>
                        <span className="cv-mode-label">{m.label}</span>
                        <span className="cv-mode-hint">{m.hint}</span>
                        <span className="cv-mode-tick">{I.check}</span>
                    </button>
                ))}
            </div>
        </div>

        <div className="cv-section">
            <div className="cv-section-row">
                <span className="cv-section-label">Invite from this case</span>
                <span className="cv-count">{invited.length} selected</span>
            </div>
            <div className="cv-people-grid">
                {TEAM.map(p => {
                    const on = invited.includes(p.id);
                    return (
                        <button key={p.id} className={`cv-person${on ? ' active' : ''}`} onClick={() => toggleInvite(p.id)}>
                            <span className="cv-avatar">{p.initials}</span>
                            <span className="cv-person-text">
                                <span className="cv-person-name">{p.name}</span>
                                <span className="cv-person-role">{p.role}</span>
                            </span>
                            <span className="cv-person-tick">{on ? I.check : '+'}</span>
                        </button>
                    );
                })}
            </div>
        </div>

        <div className="cv-section">
            <span className="cv-section-label">Options</span>
            <label className="cv-opt">
                <span className="user-switch"><input type="checkbox" checked={record} onChange={e => setRecord(e.target.checked)} /><span className="user-switch-slider" /></span>
                <span className="cv-opt-text">
                    <span className="cv-opt-title">Record this call</span>
                    <span className="cv-opt-hint">Saved to the case file. Everyone is told the call is recorded.</span>
                </span>
            </label>
            <label className="cv-opt">
                <span className="user-switch"><input type="checkbox" checked={ai} onChange={e => setAi(e.target.checked)} /><span className="user-switch-slider" /></span>
                <span className="cv-opt-text">
                    <span className="cv-opt-title">AI notetaker <span className="cv-tag">{I.spark} Transcript + summary</span></span>
                    <span className="cv-opt-hint">Live transcript during the call, then a summary with action items you can file as a case note. Participants are told it is on.</span>
                </span>
            </label>
            <label className="cv-opt">
                <span className="user-switch"><input type="checkbox" checked={notify} onChange={e => setNotify(e.target.checked)} /><span className="user-switch-slider" /></span>
                <span className="cv-opt-text">
                    <span className="cv-opt-title">Email the invite link</span>
                    <span className="cv-opt-hint">Sends the join link to everyone selected above.</span>
                </span>
            </label>
        </div>

        <div className="cv-card-foot">
            <span className="cv-foot-note">Step 1 of 3 · you can still change devices next</span>
            <button className="imp-save-btn" onClick={onStart}>Continue {I.arrow}</button>
        </div>
    </div>
);

/* ── Step 2 · Check devices ──────────────────────────────────────────── */
const DevicesStep = ({ mode, camOn, setCamOn, micOn, setMicOn, invited, camera, setCamera, mic, setMic, speaker, setSpeaker, onBack, onJoin }) => {
    const wantVideo = mode !== 'audio' && camOn;
    const { videoRef, levelRef, state, devices } = usePreview(wantVideo, micOn);
    const joining = TEAM.filter(p => invited.includes(p.id));

    return (
        <div className="cv-card cv-card-split">
            <div className="cv-preview-col">
                <div className="cv-preview">
                    {state === 'live' && wantVideo ? (
                        <video ref={videoRef} className="cv-preview-video" autoPlay playsInline muted />
                    ) : (
                        <div className="cv-preview-off">
                            <span className="cv-avatar cv-avatar-lg">AT</span>
                            <p className="cv-preview-off-text">
                                {mode === 'audio' ? 'Audio only — no camera on this call'
                                    : !camOn ? 'Camera is off'
                                    : state === 'denied' ? 'Camera blocked by the browser'
                                    : state === 'unsupported' ? 'No camera available on this device'
                                    : 'Starting camera…'}
                            </p>
                        </div>
                    )}
                    <div className="cv-preview-toggles">
                        <button className={`cv-fab${micOn ? '' : ' off'}`} title={micOn ? 'Mute' : 'Unmute'} onClick={() => setMicOn(v => !v)}>{micOn ? I.mic : I.micOff}</button>
                        <button className={`cv-fab${wantVideo ? '' : ' off'}`} title={wantVideo ? 'Turn camera off' : 'Turn camera on'} disabled={mode === 'audio'} onClick={() => setCamOn(v => !v)}>{wantVideo ? I.cam : I.camOff}</button>
                    </div>
                </div>

                {/* A meter beats a device name — it answers "can they hear me". */}
                <div className="cv-meter">
                    <span className="cv-meter-icon">{micOn ? I.mic : I.micOff}</span>
                    <span className="cv-meter-track"><span ref={levelRef} className="cv-meter-fill" /></span>
                    <span className="cv-meter-label">{micOn ? 'Say something to test' : 'Muted'}</span>
                </div>

                <div className="cv-devices">
                    <DeviceRow icon={I.smallCam} label="Camera"     list={devices.cameras}  value={camera}  onChange={setCamera} />
                    <DeviceRow icon={I.smallMic} label="Microphone" list={devices.mics}     value={mic}     onChange={setMic} />
                    <DeviceRow icon={I.speaker}  label="Speaker"    list={devices.speakers} value={speaker} onChange={setSpeaker} />
                </div>
            </div>

            <div className="cv-join-col">
                <h3 className="cv-join-title">Ready to join?</h3>
                <p className="cv-join-sub">
                    You will join {mode === 'audio' ? 'with audio only' : wantVideo ? 'with your camera on' : 'with your camera off'}
                    {micOn ? '' : ' and muted'}.
                </p>

                <div className="cv-join-people">
                    <span className="cv-section-label">Invited</span>
                    {joining.length === 0 ? (
                        <p className="cv-join-empty">Nobody invited — you can share the link once you are in.</p>
                    ) : joining.map(p => (
                        <div key={p.id} className="cv-join-person">
                            <span className="cv-avatar cv-avatar-sm">{p.initials}</span>
                            <span className="cv-join-person-name">{p.name}</span>
                            <span className="cv-pill">waiting</span>
                        </div>
                    ))}
                </div>

                <button className="imp-save-btn cv-join-btn" onClick={onJoin}>Join now</button>
                <button className="cv-text-btn" onClick={onBack}>{I.back} Back to set up</button>

                {state === 'denied' && (
                    <p className="cv-warn">Your browser blocked the camera or microphone. Allow access in the address bar, or join without them.</p>
                )}
            </div>
        </div>
    );
};

/* ── Step 3 · In call ────────────────────────────────────────────────── */
const CallStep = ({ mode, camOn, setCamOn, micOn, setMicOn, record, ai, invited, seconds, marks, onMark, onLeave, onOpenSettings }) => {
    const wantVideo = mode !== 'audio' && camOn;
    const { videoRef, state } = usePreview(wantVideo, false);
    const [blur, setBlur] = useState(false);
    const [presenting, setPresenting] = useState(mode === 'present');
    const [full, setFull] = useState(false);
    const [panel, setPanel] = useState('chat');
    const [shareOpen, setShareOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [draft, setDraft] = useState('');
    const [captions, setCaptions] = useState(true);
    const transcriptEndRef = useRef(null);
    const [messages, setMessages] = useState([
        { id: 1, who: 'Elena Ramirez', initials: 'ER', text: 'Pulling up the treatment summary now.', at: '00:12' },
        { id: 2, who: 'Marcus Bell',   initials: 'MB', text: 'Thanks — start with the ER visit on 3 May.', at: '00:31' },
    ]);

    const spoken = ai ? TRANSCRIPT.filter(l => l.t <= seconds) : [];
    const latest = spoken[spoken.length - 1];

    useEffect(() => {
        if (panel === 'transcript') transcriptEndRef.current?.scrollIntoView({ block: 'end' });
    }, [panel, spoken.length]);

    /* Invitees do not all arrive at once; staggering them makes the People
       list mean something instead of being fully populated at t=0. */
    const [joined, setJoined] = useState([]);
    useEffect(() => {
        const timers = invited.map((id, i) => setTimeout(() => setJoined(p => [...p, id]), 1200 + i * 1600));
        return () => timers.forEach(clearTimeout);
    }, [invited]);

    const guests = TEAM.filter(p => invited.includes(p.id));
    const inCall = guests.filter(p => joined.includes(p.id));

    const send = () => {
        if (!draft.trim()) return;
        setMessages(prev => [...prev, { id: Date.now(), who: 'You', initials: 'AT', text: draft.trim(), at: clock(seconds), mine: true }]);
        setDraft('');
    };

    const copyLink = () => {
        navigator.clipboard?.writeText(CALL_LINK).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
    };

    return (
        <div className={`cv-call${full ? ' cv-call-full' : ''}`}>
            <div className="cv-call-bar">
                <div className="cv-call-id">
                    <span className="cv-live"><span className="cv-live-dot" />Live</span>
                    <span className="cv-timer">{clock(seconds)}</span>
                    {record && <span className="cv-rec">{I.record} Recording</span>}
                    {ai && <span className="cv-ai-pill">{I.spark} AI notes</span>}
                </div>
                <div className="cv-call-bar-right">
                    <span className="cv-call-count">{inCall.length + 1} in call</span>
                    <button className="cv-leave-btn" onClick={onLeave}>{I.phoneOff} LEAVE CALL</button>
                </div>
            </div>

            <div className="cv-call-body">
                <div className="cv-stage">
                    {presenting && (
                        <div className="cv-tile cv-tile-present">
                            <span className="cv-present-badge">{I.present} You are presenting</span>
                            <div className="cv-present-sheet">
                                <span className="cv-present-sheet-line" /><span className="cv-present-sheet-line short" /><span className="cv-present-sheet-line" />
                            </div>
                            <span className="cv-tile-name">Screen — Demand package.pdf</span>
                        </div>
                    )}
                    <div className={`cv-tile-grid${presenting ? ' cv-tile-grid-strip' : ''}`}>
                        <div className={`cv-tile cv-tile-self${blur ? ' blurred' : ''}`}>
                            {state === 'live' && wantVideo
                                ? <video ref={videoRef} className="cv-tile-video" autoPlay playsInline muted />
                                : <span className="cv-avatar cv-avatar-lg">AT</span>}
                            <span className="cv-tile-name">You{micOn ? '' : ' · muted'}</span>
                            {!micOn && <span className="cv-tile-mic off">{I.micOff}</span>}
                        </div>
                        {inCall.map(p => (
                            <div key={p.id} className="cv-tile">
                                <span className="cv-avatar cv-avatar-lg">{p.initials}</span>
                                <span className="cv-tile-name">{p.name}</span>
                            </div>
                        ))}
                        {guests.filter(p => !joined.includes(p.id)).map(p => (
                            <div key={p.id} className="cv-tile cv-tile-waiting">
                                <span className="cv-avatar cv-avatar-lg">{p.initials}</span>
                                <span className="cv-tile-name">{p.name} · ringing…</span>
                            </div>
                        ))}
                    </div>
                    {ai && captions && latest && (
                        <div className="cv-captions">
                            <span className="cv-caption-who">{latest.who}</span>
                            <span className="cv-caption-text">{latest.text}</span>
                        </div>
                    )}
                </div>

                <aside className="cv-panel">
                    <div className="cv-panel-tabs">
                        <button className={`cv-panel-tab${panel === 'chat' ? ' active' : ''}`} onClick={() => setPanel('chat')}>{I.chat} Chat</button>
                        <button className={`cv-panel-tab${panel === 'people' ? ' active' : ''}`} onClick={() => setPanel('people')}>{I.people} People <span className="cv-tab-count">{inCall.length + 1}</span></button>
                        {ai && (
                            <button className={`cv-panel-tab${panel === 'transcript' ? ' active' : ''}`} onClick={() => setPanel('transcript')}>{I.caption} Transcript</button>
                        )}
                    </div>

                    {panel === 'transcript' ? (
                        <div className="cv-transcript">
                            <div className="cv-transcript-head">
                                <span className="cv-ai-tag">{I.spark} AI notetaker is listening</span>
                                <button className="cv-mini-btn" onClick={() => navigator.clipboard?.writeText(spoken.map(l => `[${clock(l.t)}] ${l.who}: ${l.text}`).join('\n')).catch(() => {})} disabled={!spoken.length}>
                                    {I.copy} Copy
                                </button>
                            </div>
                            <div className="cv-transcript-list">
                                {spoken.length === 0 ? (
                                    <p className="cv-transcript-empty">Nothing said yet. Lines appear here as people speak.</p>
                                ) : spoken.map(l => (
                                    <div key={l.t} className={`cv-line${marks.includes(l.t) ? ' marked' : ''}`}>
                                        <span className="cv-line-at">{clock(l.t)}</span>
                                        <div className="cv-line-body">
                                            <span className="cv-line-who">{l.who}</span>
                                            <p className="cv-line-text">{l.text}</p>
                                        </div>
                                        <button className={`cv-line-flag${marks.includes(l.t) ? ' on' : ''}`} title={marks.includes(l.t) ? 'Unmark' : 'Mark key moment'} onClick={() => onMark(l.t)}>{I.flag}</button>
                                    </div>
                                ))}
                                <div ref={transcriptEndRef} />
                            </div>
                            <label className="cv-transcript-foot">
                                <span className="user-switch"><input type="checkbox" checked={captions} onChange={e => setCaptions(e.target.checked)} /><span className="user-switch-slider" /></span>
                                Show live captions on the video
                            </label>
                        </div>
                    ) : panel === 'chat' ? (
                        <>
                            <div className="cv-chat-list">
                                {messages.map(m => (
                                    <div key={m.id} className={`cv-msg${m.mine ? ' mine' : ''}`}>
                                        <span className="cv-avatar cv-avatar-sm">{m.initials}</span>
                                        <div className="cv-msg-body">
                                            <div className="cv-msg-top"><span className="cv-msg-who">{m.who}</span><span className="cv-msg-at">{m.at}</span></div>
                                            <p className="cv-msg-text">{m.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="cv-chat-compose">
                                <input className="ccm-input" placeholder="Write a message…" value={draft}
                                    onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} />
                                <button className="imp-save-btn cv-send" onClick={send} disabled={!draft.trim()}>{I.send}</button>
                            </div>
                        </>
                    ) : (
                        <div className="cv-people-list">
                            <div className="cv-join-person">
                                <span className="cv-avatar cv-avatar-sm">AT</span>
                                <span className="cv-join-person-name">You <span className="cv-person-role">Host</span></span>
                                <span className={`cv-mic-state${micOn ? '' : ' off'}`}>{micOn ? I.mic : I.micOff}</span>
                            </div>
                            {inCall.map(p => (
                                <div key={p.id} className="cv-join-person">
                                    <span className="cv-avatar cv-avatar-sm">{p.initials}</span>
                                    <span className="cv-join-person-name">{p.name} <span className="cv-person-role">{p.role}</span></span>
                                    <span className="cv-mic-state">{I.mic}</span>
                                </div>
                            ))}
                            {guests.filter(p => !joined.includes(p.id)).map(p => (
                                <div key={p.id} className="cv-join-person">
                                    <span className="cv-avatar cv-avatar-sm">{p.initials}</span>
                                    <span className="cv-join-person-name">{p.name} <span className="cv-person-role">{p.role}</span></span>
                                    <span className="cv-pill">ringing</span>
                                </div>
                            ))}
                            <button className="cv-text-btn cv-invite-more" onClick={() => setShareOpen(true)}>{I.share} Copy invite link</button>
                        </div>
                    )}
                </aside>
            </div>

            <div className="cv-controls">
                <button className={`cv-ctl${micOn ? '' : ' danger'}`} onClick={() => setMicOn(v => !v)}>
                    <span className="cv-ctl-icon">{micOn ? I.mic : I.micOff}</span><span className="cv-ctl-label">{micOn ? 'Mute' : 'Unmute'}</span>
                </button>
                <button className={`cv-ctl${wantVideo ? '' : ' danger'}`} disabled={mode === 'audio'} onClick={() => setCamOn(v => !v)}>
                    <span className="cv-ctl-icon">{wantVideo ? I.cam : I.camOff}</span><span className="cv-ctl-label">{wantVideo ? 'Video' : 'Video off'}</span>
                </button>
                <button className={`cv-ctl${blur ? ' on' : ''}`} disabled={!wantVideo} onClick={() => setBlur(v => !v)}>
                    <span className="cv-ctl-icon">{I.blur}</span><span className="cv-ctl-label">Blur</span>
                </button>
                <button className={`cv-ctl${presenting ? ' on' : ''}`} onClick={() => setPresenting(v => !v)}>
                    <span className="cv-ctl-icon">{I.present}</span><span className="cv-ctl-label">{presenting ? 'Stop' : 'Present'}</span>
                </button>
                <div className="cv-ctl-wrap">
                    <button className={`cv-ctl${shareOpen ? ' on' : ''}`} onClick={() => setShareOpen(v => !v)}>
                        <span className="cv-ctl-icon">{I.share}</span><span className="cv-ctl-label">Share</span>
                    </button>
                    {shareOpen && (
                        <div className="cv-share-pop">
                            <span className="cv-section-label">Invite link</span>
                            <div className="cv-share-row">
                                <input className="ccm-input" readOnly value={CALL_LINK} onFocus={e => e.target.select()} />
                                <button className="imp-save-btn cv-copy" onClick={copyLink}>{copied ? I.check : I.copy}{copied ? 'Copied' : 'Copy'}</button>
                            </div>
                            <p className="cv-share-hint">Anyone on this case can use this link while the call is live.</p>
                        </div>
                    )}
                </div>
                <button className={`cv-ctl${full ? ' on' : ''}`} onClick={() => setFull(v => !v)}>
                    <span className="cv-ctl-icon">{full ? I.collapse : I.expand}</span><span className="cv-ctl-label">{full ? 'Exit full' : 'Fullscreen'}</span>
                </button>
                <button className="cv-ctl" onClick={onOpenSettings}>
                    <span className="cv-ctl-icon">{I.gear}</span><span className="cv-ctl-label">Settings</span>
                </button>
            </div>
        </div>
    );
};

/* ── Step 4 · Ended ──────────────────────────────────────────────────── */
/* The summary is written from the lines that were actually spoken, so a call
   cut short cannot be summarised into things nobody said. */
const AiSummary = ({ seconds, marks }) => {
    const [phase, setPhase] = useState('working');
    const [openTranscript, setOpenTranscript] = useState(false);
    const [saved, setSaved] = useState(false);
    const [copied, setCopied] = useState(false);

    const spoken = TRANSCRIPT.filter(l => l.t <= seconds);
    const points = SUMMARY_POINTS.filter(p => p.after <= seconds);
    const actions = SUMMARY_ACTIONS.filter(a => a.after <= seconds);
    const marked = spoken.filter(l => marks.includes(l.t));

    useEffect(() => {
        const t = setTimeout(() => setPhase('ready'), 1600);
        return () => clearTimeout(t);
    }, []);

    const plain = [
        `Convo summary — Smith v. Redline Logistics (${clock(seconds)})`,
        '', ...points.map(p => `• ${p.text}`),
        '', 'Action items:', ...actions.map(a => `• ${a.text} — ${a.owner}`),
    ].join('\n');

    const copy = () => {
        navigator.clipboard?.writeText(plain).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
    };

    if (phase === 'working') {
        return (
            <div className="cv-summary">
                <div className="cv-summary-head">
                    <span className="cv-ai-tag">{I.spark} AI summary</span>
                </div>
                <p className="cv-summary-working">Reading the transcript and pulling out what was decided…</p>
                <div className="cv-skeleton"><span /><span className="short" /><span /><span className="short" /></div>
            </div>
        );
    }

    if (spoken.length < 2) {
        return (
            <div className="cv-summary">
                <div className="cv-summary-head"><span className="cv-ai-tag">{I.spark} AI summary</span></div>
                <p className="cv-summary-working">The call was too short to summarise. The transcript is still filed against the case.</p>
            </div>
        );
    }

    return (
        <div className="cv-summary">
            <div className="cv-summary-head">
                <span className="cv-ai-tag">{I.spark} AI summary</span>
                <span className="cv-summary-meta">{spoken.length} lines · {clock(seconds)}</span>
            </div>

            <p className="cv-summary-overview">
                Case update call with the client. Treatment is ongoing, the insurer has made a low opening offer,
                and the firm is holding its response until the record is complete.
            </p>

            <div className="cv-summary-block">
                <span className="cv-section-label">Key points</span>
                <ul className="cv-summary-list">
                    {points.map(p => <li key={p.after}>{p.text}</li>)}
                </ul>
            </div>

            {actions.length > 0 && (
                <div className="cv-summary-block">
                    <span className="cv-section-label">Action items</span>
                    <ul className="cv-action-list">
                        {actions.map(a => (
                            <li key={a.after}>
                                <span className="cv-action-text">{a.text}</span>
                                <span className="cv-pill">{a.owner}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {marked.length > 0 && (
                <div className="cv-summary-block">
                    <span className="cv-section-label">Moments you marked</span>
                    <ul className="cv-summary-list">
                        {marked.map(l => <li key={l.t}><strong>{clock(l.t)}</strong> — {l.text}</li>)}
                    </ul>
                </div>
            )}

            <button className="cv-transcript-toggle" onClick={() => setOpenTranscript(v => !v)}>
                {I.caption} {openTranscript ? 'Hide' : 'Show'} full transcript ({spoken.length} lines)
            </button>
            {openTranscript && (
                <div className="cv-transcript-list cv-transcript-static">
                    {spoken.map(l => (
                        <div key={l.t} className="cv-line">
                            <span className="cv-line-at">{clock(l.t)}</span>
                            <div className="cv-line-body">
                                <span className="cv-line-who">{l.who}</span>
                                <p className="cv-line-text">{l.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="cv-summary-actions">
                <button className="imp-save-btn" onClick={() => setSaved(true)} disabled={saved}>
                    {saved ? I.check : I.note} {saved ? 'Saved to case notes' : 'Save as case note'}
                </button>
                <button className="imp-cancel-btn" onClick={copy}>{copied ? I.check : I.copy} {copied ? 'Copied' : 'Copy summary'}</button>
            </div>
            <p className="cv-summary-disclaimer">AI-generated from the call transcript. Check anything you rely on before it leaves the firm.</p>
        </div>
    );
};

const EndedStep = ({ seconds, record, ai, invited, marks, onRestart }) => (
    <div className="cv-ended-wrap">
        <div className="cv-card cv-ended">
            <span className="cv-ended-mark">{I.phoneOff}</span>
            <h3 className="cv-card-title">Call ended</h3>
            <p className="cv-card-sub">The convo has been logged against this case.</p>
            <div className="cv-ended-stats">
                <div className="cv-stat"><span className="cv-stat-value">{clock(seconds)}</span><span className="cv-stat-label">Duration</span></div>
                <div className="cv-stat"><span className="cv-stat-value">{invited.length + 1}</span><span className="cv-stat-label">Participants</span></div>
                <div className="cv-stat"><span className="cv-stat-value">{record ? 'Saved' : 'Off'}</span><span className="cv-stat-label">Recording</span></div>
                <div className="cv-stat"><span className="cv-stat-value">{ai ? 'On' : 'Off'}</span><span className="cv-stat-label">AI notes</span></div>
            </div>
            <div className="cv-ended-actions">
                <button className="imp-save-btn" onClick={onRestart}>Start another convo</button>
            </div>
        </div>

        {ai && <AiSummary seconds={seconds} marks={marks} />}
    </div>
);

const LeaveModal = ({ onCancel, onConfirm }) => (
    <div className="modal-overlay" onClick={onCancel}>
        <div className="confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="confirm-modal-header">
                <h3 className="confirm-modal-title">Leave convo</h3>
                <button className="confirm-modal-close" onClick={onCancel}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
            <div className="confirm-modal-body">
                <p className="confirm-modal-text">You are about to leave convo. The call stays open for everyone else.</p>
            </div>
            <div className="confirm-modal-footer">
                <button className="confirm-modal-cancel" onClick={onCancel}>Cancel</button>
                <button className="confirm-modal-confirm" onClick={onConfirm}>Leave call</button>
            </div>
        </div>
    </div>
);

const SettingsModal = ({ camera, setCamera, mic, setMic, speaker, setSpeaker, onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
        <div className="ccm cv-settings-modal" onClick={e => e.stopPropagation()}>
            <div className="ccm-header">
                <div>
                    <div className="ccm-breadcrumb">Convo · In call</div>
                    <h3 className="ccm-title">Call settings</h3>
                </div>
                <button className="ccm-close" onClick={onClose}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
            <div className="ccm-body">
                <div className="cv-devices">
                    <DeviceRow icon={I.smallCam} label="Camera"     list={CAMERA_FALLBACK} value={camera}  onChange={setCamera} />
                    <DeviceRow icon={I.smallMic} label="Microphone" list={MIC_FALLBACK}    value={mic}     onChange={setMic} />
                    <DeviceRow icon={I.speaker}  label="Speaker"    list={SPK_FALLBACK}    value={speaker} onChange={setSpeaker} />
                </div>
            </div>
            <div className="ccm-footer">
                <button className="imp-cancel-btn" onClick={onClose}>Close</button>
            </div>
        </div>
    </div>
);

/* ── View ────────────────────────────────────────────────────────────── */
const ConvoView = ({ embedded = false }) => {
    const [stage, setStage] = useState('setup');
    const [mode, setMode] = useState('video');
    const [invited, setInvited] = useState(['mb', 'jr']);
    const [record, setRecord] = useState(false);
    const [notify, setNotify] = useState(true);
    const [ai, setAi] = useState(true);
    const [marks, setMarks] = useState([]);
    const [camOn, setCamOn] = useState(true);
    const [micOn, setMicOn] = useState(true);
    const [camera, setCamera] = useState('');
    const [mic, setMic] = useState('');
    const [speaker, setSpeaker] = useState('');
    const [seconds, setSeconds] = useState(0);
    const [leaveOpen, setLeaveOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);

    useEffect(() => {
        if (stage !== 'call') return;
        const t = setInterval(() => setSeconds(s => s + 1), 1000);
        return () => clearInterval(t);
    }, [stage]);

    const toggleInvite = id => setInvited(p => (p.includes(id) ? p.filter(x => x !== id) : [...p, id]));

    const restart = () => {
        setStage('setup');
        setSeconds(0);
        setMarks([]);
        setCamOn(true);
        setMicOn(true);
    };

    const stepIndex = stage === 'setup' ? 0 : stage === 'devices' ? 1 : 2;

    return (
        <div className={`forms-page cv-page${embedded ? ' cv-page-embedded' : ''}`}>
            {stage !== 'call' && (
                <InfoBanner message="Convo runs the call inside the case, so the recording, chat and attendance are filed against Smith v. Redline Logistics automatically." />
            )}

            {stage !== 'ended' && (
                <ol className="cv-steps">
                    {STEPS.map((s, i) => (
                        <li key={s.id} className={`cv-step${i === stepIndex ? ' current' : ''}${i < stepIndex ? ' done' : ''}`}>
                            <span className="cv-step-pill">
                                <span className="cv-step-dot">{i < stepIndex ? I.check : i + 1}</span>
                                <span className="cv-step-label">{s.label}</span>
                            </span>
                        </li>
                    ))}
                </ol>
            )}

            {stage === 'setup' && (
                <SetupStep
                    mode={mode} setMode={setMode}
                    invited={invited} toggleInvite={toggleInvite}
                    record={record} setRecord={setRecord}
                    notify={notify} setNotify={setNotify}
                    ai={ai} setAi={setAi}
                    onStart={() => { setCamOn(mode !== 'audio'); setStage('devices'); }}
                />
            )}

            {stage === 'devices' && (
                <DevicesStep
                    mode={mode} camOn={camOn} setCamOn={setCamOn} micOn={micOn} setMicOn={setMicOn}
                    invited={invited}
                    camera={camera} setCamera={setCamera} mic={mic} setMic={setMic} speaker={speaker} setSpeaker={setSpeaker}
                    onBack={() => setStage('setup')}
                    onJoin={() => { setSeconds(0); setStage('call'); }}
                />
            )}

            {stage === 'call' && (
                <CallStep
                    mode={mode} camOn={camOn} setCamOn={setCamOn} micOn={micOn} setMicOn={setMicOn}
                    record={record} ai={ai} invited={invited} seconds={seconds}
                    marks={marks} onMark={t => setMarks(p => (p.includes(t) ? p.filter(x => x !== t) : [...p, t]))}
                    onLeave={() => setLeaveOpen(true)}
                    onOpenSettings={() => setSettingsOpen(true)}
                />
            )}

            {stage === 'ended' && <EndedStep seconds={seconds} record={record} ai={ai} invited={invited} marks={marks} onRestart={restart} />}

            {leaveOpen && <LeaveModal onCancel={() => setLeaveOpen(false)} onConfirm={() => { setLeaveOpen(false); setStage('ended'); }} />}
            {settingsOpen && (
                <SettingsModal camera={camera} setCamera={setCamera} mic={mic} setMic={setMic} speaker={speaker} setSpeaker={setSpeaker} onClose={() => setSettingsOpen(false)} />
            )}
        </div>
    );
};

export default ConvoView;
