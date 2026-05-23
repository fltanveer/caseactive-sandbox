import { useState } from 'react';

/* Gradient palettes for placeholder image tiles */
const IMG_GRADIENTS = [
    'linear-gradient(135deg,#cde8ed,#a8d8e0)',
    'linear-gradient(135deg,#d4e8c2,#b8dba0)',
    'linear-gradient(135deg,#e8d4c2,#d9b896)',
    'linear-gradient(135deg,#d4c2e8,#bba8d8)',
    'linear-gradient(135deg,#e8c2c2,#d8a8a8)',
    'linear-gradient(135deg,#c2dce8,#a0c8d8)',
];

const FEED_POSTS = [
    {
        id: 1,
        author: 'Virtual Assistant',
        roleIcon: 'bot',
        time: '6 days ago',
        body: "Hi Alex, welcome! We're glad to have you here and are committed to supporting you through this process.\n\nYour case portal is now active. You'll find important documents waiting for your review and signature, as well as intake forms to complete. Please take a moment to go through each item at your earliest convenience.",
        attachments: [],
        comments: [],
    },
    {
        id: 2,
        author: 'Casey Staff',
        roleIcon: 'paralegal',
        time: '5 days ago',
        body: "Hi Alex, I've attached photo documentation from the accident scene — 5 photos total covering the vehicle damage, road markings, and intersection. Please review and let us know if anything looks incorrect.",
        attachments: [
            { type: 'image', name: 'Scene_Front_Impact.jpg',   size: '3.1 MB' },
            { type: 'image', name: 'Scene_Rear_Damage.jpg',    size: '2.8 MB' },
            { type: 'image', name: 'Intersection_View.jpg',    size: '4.2 MB' },
            { type: 'image', name: 'Road_Markings.jpg',        size: '1.9 MB' },
            { type: 'image', name: 'Skid_Marks_Detail.jpg',    size: '2.3 MB' },
        ],
        comments: [
            { id: 1, author: 'Alex Demo', initials: 'AD', time: '5 days ago', text: 'Got it, the photos look accurate. Thank you for sharing.' },
        ],
    },
    {
        id: 3,
        author: 'Jordan Admin',
        roleIcon: 'attorney',
        time: '4 days ago',
        body: "I've uploaded the medical records received from St. Mary's Hospital. Please review the attached PDF and sign the authorization on page 3 at your earliest convenience.",
        attachments: [
            { type: 'doc', name: 'Medical_Records_StMarys.pdf', size: '1.8 MB' },
        ],
        comments: [],
    },
    {
        id: 4,
        author: 'Casey Staff',
        roleIcon: 'paralegal',
        time: '3 days ago',
        body: "We obtained footage from two cameras near the incident — a business dashcam covering the intersection and a traffic camera from the city feed. Both clearly show the sequence of events.",
        attachments: [
            { type: 'video', name: 'Dashcam_Business_Angle.mp4',  size: '87.3 MB', duration: '2:14' },
            { type: 'video', name: 'Traffic_Cam_Overhead.mp4',    size: '54.1 MB', duration: '1:47' },
            { type: 'video', name: 'Dashcam_Followup_Clip.mp4',   size: '31.6 MB', duration: '0:52' },
        ],
        comments: [
            { id: 1, author: 'Alex Demo', initials: 'AD', time: '3 days ago', text: "Yes, that's the intersection. The light was clearly red when the other vehicle entered." },
            { id: 2, author: 'Casey Staff', initials: 'CS', time: '2 days ago', text: "Noted — we've flagged that timestamp for the liability report." },
        ],
    },
    {
        id: 5,
        author: 'Jordan Admin',
        roleIcon: 'attorney',
        time: '2 days ago',
        body: "Attached is the audio recording of the witness interview conducted on Oct 9th. The witness confirms the sequence of events consistent with your account.",
        attachments: [
            { type: 'audio', name: 'Witness_Interview_Oct9.m4a', size: '12.6 MB', duration: '4:38' },
        ],
        comments: [],
    },
    {
        id: 6,
        author: 'Casey Staff',
        roleIcon: 'paralegal',
        time: 'Yesterday',
        body: "Uploading the full case file bundle for your records. This includes all submitted forms, correspondence, and signed documents to date.",
        attachments: [
            { type: 'file', name: 'CaseBundle_JohnsonTransit_v3.zip', size: '23.1 MB' },
        ],
        comments: [],
    },
];

const AVATAR_COLORS = {
    AD: { bg: 'rgba(20,158,177,0.12)', color: '#149EB1' },
    CS: { bg: 'rgba(20,158,177,0.12)', color: '#149EB1' },
    JA: { bg: 'rgba(124,58,237,0.12)', color: '#7C3AED' },
};

/* ── Shared UI ────────────────────────────────────────────────────── */

const DownloadBtn = ({ name }) => (
    <button className="cf-preview-dl-btn" title={`Download ${name}`}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Download
    </button>
);

/* ── Photo List (same style as video list) ────────────────────────── */

const PhotoThumbBg = ({ index }) => {
    const bg = IMG_GRADIENTS[index % IMG_GRADIENTS.length];
    return (
        <div className="cf-photo-thumb" style={{ background: bg }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        </div>
    );
};

const PhotoItem = ({ image, index, onClick }) => (
    <div className="cf-photo-item" onClick={onClick}>
        <PhotoThumbBg index={index} />
        <div className="cf-photo-item-info">
            <span className="cf-preview-filename">{image.name}</span>
            <span className="cf-preview-filesize">{image.size}</span>
        </div>
        <DownloadBtn name={image.name} />
    </div>
);

const PhotoList = ({ images }) => {
    const [lightbox, setLightbox] = useState(null);
    const count = images.length;

    return (
        <div className="cf-preview-wrap cf-photo-list-wrap">
            {images.map((img, i) => (
                <PhotoItem key={i} image={img} index={i} onClick={() => setLightbox(i)} />
            ))}
            {count > 1 && (
                <div className="cf-photo-list-footer">
                    <span className="cf-preview-filesize">{count} photos</span>
                    <DownloadBtn name="all photos" />
                </div>
            )}
            {lightbox !== null && (
                <div className="cf-lightbox" onClick={() => setLightbox(null)}>
                    <button className="cf-lightbox-close" onClick={() => setLightbox(null)}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                    <button className="cf-lightbox-nav cf-lightbox-prev" onClick={e => { e.stopPropagation(); setLightbox(i => Math.max(0, i - 1)); }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                    </button>
                    <div className="cf-lightbox-img" style={{ background: IMG_GRADIENTS[lightbox % IMG_GRADIENTS.length] }} onClick={e => e.stopPropagation()}>
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        <div className="cf-lightbox-caption">{images[lightbox].name} · {images[lightbox].size}</div>
                    </div>
                    <button className="cf-lightbox-nav cf-lightbox-next" onClick={e => { e.stopPropagation(); setLightbox(i => Math.min(images.length - 1, i + 1)); }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                    <div className="cf-lightbox-dots">
                        {images.map((_, i) => <div key={i} className={`cf-lightbox-dot${i === lightbox ? ' active' : ''}`} onClick={e => { e.stopPropagation(); setLightbox(i); }} />)}
                    </div>
                </div>
            )}
        </div>
    );
};

/* ── Video List ───────────────────────────────────────────────────── */

const VideoItem = ({ video, index, onClick }) => (
    <div className="cf-video-item" onClick={onClick}>
        <div className="cf-video-thumb" style={{ background: `linear-gradient(135deg, ${['#1a1a2e','#0f3460','#1a2a1a'][index % 3]} 0%, ${['#16213e','#16213e','#0f1a0f'][index % 3]} 100%)` }}>
            <div className="cf-preview-video-bg" />
            <button className="cf-preview-play-btn" onClick={e => { e.stopPropagation(); onClick(); }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </button>
            {video.duration && <span className="cf-preview-duration">{video.duration}</span>}
        </div>
        <div className="cf-video-item-info">
            <span className="cf-preview-filename">{video.name}</span>
            <span className="cf-preview-filesize">{video.size}</span>
        </div>
        <DownloadBtn name={video.name} />
    </div>
);

const VideoList = ({ videos }) => {
    const [preview, setPreview] = useState(null);
    const [playing, setPlaying] = useState(false);

    const cur = preview !== null ? videos[preview] : null;
    const bg = preview !== null
        ? `linear-gradient(135deg, ${['#1a1a2e','#0f3460','#1a2a1a'][preview % 3]} 0%, ${['#16213e','#16213e','#0f1a0f'][preview % 3]} 100%)`
        : '';

    return (
        <div className="cf-preview-wrap cf-video-list-wrap">
            {videos.map((v, i) => (
                <VideoItem key={i} video={v} index={i} onClick={() => { setPreview(i); setPlaying(false); }} />
            ))}
            {videos.length > 1 && (
                <div className="cf-video-list-footer">
                    <span className="cf-preview-filesize">{videos.length} videos</span>
                    <DownloadBtn name="all videos" />
                </div>
            )}
            {preview !== null && (
                <div className="cf-lightbox" onClick={() => { setPreview(null); setPlaying(false); }}>
                    <button className="cf-lightbox-close" onClick={() => { setPreview(null); setPlaying(false); }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                    <button className="cf-lightbox-nav cf-lightbox-prev" onClick={e => { e.stopPropagation(); setPreview(i => Math.max(0, i - 1)); setPlaying(false); }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                    </button>
                    <div className="cf-lightbox-img cf-video-preview-box" style={{ background: bg }} onClick={e => e.stopPropagation()}>
                        <div className="cf-preview-video-bg" />
                        <button className="cf-preview-play-btn cf-lightbox-play-btn" onClick={() => setPlaying(p => !p)}>
                            {playing
                                ? <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                                : <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                            }
                        </button>
                        {cur.duration && <span className="cf-preview-duration">{cur.duration}</span>}
                        <div className="cf-lightbox-caption">{cur.name} · {cur.size}</div>
                    </div>
                    <button className="cf-lightbox-nav cf-lightbox-next" onClick={e => { e.stopPropagation(); setPreview(i => Math.min(videos.length - 1, i + 1)); setPlaying(false); }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                    <div className="cf-lightbox-dots">
                        {videos.map((_, i) => (
                            <div key={i} className={`cf-lightbox-dot${i === preview ? ' active' : ''}`} onClick={e => { e.stopPropagation(); setPreview(i); setPlaying(false); }} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

/* ── Audio ────────────────────────────────────────────────────────── */

const AudioPreview = ({ attachment }) => {
    const [playing, setPlaying] = useState(false);
    const [progress] = useState(0);
    const BARS = [3, 6, 9, 7, 4, 8, 10, 6, 3, 7, 9, 5, 8, 4, 6, 10, 7, 3, 8, 6, 9, 4, 7, 5, 8, 10, 4, 6, 9, 7, 3, 5];

    return (
        <div className="cf-preview-wrap cf-preview-audio-wrap">
            <div className="cf-audio-player">
                <button className="cf-audio-play-btn" onClick={() => setPlaying(p => !p)}>
                    {playing
                        ? <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                        : <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    }
                </button>
                <div className="cf-waveform">
                    {BARS.map((h, i) => (
                        <div key={i} className="cf-waveform-bar" style={{ height: `${h * 3}px`, opacity: i / BARS.length < progress / 100 ? 1 : 0.3 }} />
                    ))}
                </div>
                <span className="cf-audio-duration">{attachment.duration ?? '0:00'}</span>
            </div>
            <div className="cf-preview-footer" style={{ borderTop: '1px solid #f0f0f0', paddingTop: 10 }}>
                <div className="cf-preview-file-info">
                    <span className="cf-preview-filename">{attachment.name}</span>
                    <span className="cf-preview-filesize">{attachment.size}</span>
                </div>
                <DownloadBtn name={attachment.name} />
            </div>
        </div>
    );
};

/* ── Doc / File ───────────────────────────────────────────────────── */

const DocFilePreview = ({ attachment }) => {
    const isDoc = attachment.type === 'doc';
    const color = isDoc ? '#EF4444' : '#6B7280';
    const bg = isDoc ? 'rgba(239,68,68,0.08)' : 'rgba(107,114,128,0.08)';
    const icon = isDoc ? (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
    ) : (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
    );
    return (
        <div className="cf-preview-wrap cf-preview-doc-wrap">
            <div className="cf-preview-doc-row">
                <div className="cf-preview-doc-icon" style={{ background: bg, color }}>{icon}</div>
                <div className="cf-preview-file-info">
                    <span className="cf-preview-filename">{attachment.name}</span>
                    <span className="cf-preview-filesize">{isDoc ? 'Document' : 'File'} · {attachment.size}</span>
                </div>
                <DownloadBtn name={attachment.name} />
            </div>
        </div>
    );
};

/* ── Attachments dispatcher ───────────────────────────────────────── */

const AttachmentsPreview = ({ attachments }) => {
    if (!attachments?.length) return null;

    const images = attachments.filter(a => a.type === 'image');
    const videos = attachments.filter(a => a.type === 'video');
    const others = attachments.filter(a => a.type !== 'image' && a.type !== 'video');

    return (
        <div className="cf-attachments-block">
            {images.length > 0 && <PhotoList images={images} />}
            {videos.length > 0 && <VideoList videos={videos} />}
            {others.map((a, i) =>
                a.type === 'audio'
                    ? <AudioPreview key={i} attachment={a} />
                    : <DocFilePreview key={i} attachment={a} />
            )}
        </div>
    );
};

/* ── Avatar / Badge ───────────────────────────────────────────────── */

const AvatarIcon = ({ size = 28 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
    </svg>
);

const InitialAvatar = ({ initials, size = 28 }) => {
    const c = AVATAR_COLORS[initials] ?? { bg: 'rgba(20,158,177,0.12)', color: '#149EB1' };
    return (
        <div style={{ width: size, height: size, borderRadius: '50%', background: c.bg, color: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.36, fontWeight: 700, flexShrink: 0 }}>
            {initials}
        </div>
    );
};

const RoleBadge = ({ icon }) => {
    if (icon === 'bot') return (
        <span className="cf-role-badge bot">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M12 11V7"/><circle cx="12" cy="5" r="2"/></svg>
            Virtual Assistant
        </span>
    );
    if (icon === 'paralegal') return (
        <span className="cf-role-badge paralegal">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Paralegal
        </span>
    );
    return (
        <span className="cf-role-badge attorney">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Attorney
        </span>
    );
};

/* ── Post ─────────────────────────────────────────────────────────── */

const FeedPost = ({ post }) => {
    const [comment, setComment] = useState('');
    const [liked, setLiked] = useState(false);

    return (
        <div className="cf-post-card">
            <div className="cf-post-header">
                <div className="cf-post-avatar-wrap"><AvatarIcon /></div>
                <div className="cf-post-meta">
                    <span className="cf-post-author">{post.author}</span>
                    <div className="cf-post-sub">
                        <RoleBadge icon={post.roleIcon} />
                        <span className="cf-post-time">{post.time}</span>
                    </div>
                </div>
            </div>
            <div className="cf-post-divider" />
            <div className="cf-post-body">
                {post.body.split('\n\n').map((para, i) => <p key={i}>{para}</p>)}
            </div>

            <AttachmentsPreview attachments={post.attachments} />

            <div className="cf-post-reactions">
                <button className={`cf-react-btn${liked ? ' liked' : ''}`} onClick={() => setLiked(p => !p)}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    {liked ? 'Liked' : 'Like'}
                </button>
                <button className="cf-react-btn">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    Comment
                </button>
            </div>

            {post.comments.length > 0 && (
                <div className="cf-post-comments">
                    {post.comments.map(c => (
                        <div key={c.id} className="cf-comment-item">
                            <InitialAvatar initials={c.initials} size={30} />
                            <div className="cf-comment-bubble">
                                <div className="cf-comment-bubble-header">
                                    <span className="cf-comment-author">{c.author}</span>
                                    <span className="cf-comment-time">{c.time}</span>
                                </div>
                                <p className="cf-comment-text">{c.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="cf-comment-compose">
                <InitialAvatar initials="AD" size={30} />
                <input
                    className="cf-comment-input"
                    placeholder="Write a comment...."
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                />
                <div className="cf-comment-compose-actions">
                    <button className="cf-comment-icon-btn" title="AI assist">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                    </button>
                    <button className="cf-comment-icon-btn" title="Attach image">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    </button>
                    <button className="cf-comment-post-btn">POST</button>
                </div>
            </div>
        </div>
    );
};

/* ── Feed ─────────────────────────────────────────────────────────── */

const FeedView = () => {
    const [composeText, setComposeText] = useState('');
    const [composeFocused, setComposeFocused] = useState(false);
    const [filterVal, setFilterVal] = useState('All');

    const TYPE_MAP = { Audios: 'audio', Images: 'image', Videos: 'video', Docs: 'doc', Files: 'file' };
    const filtered = filterVal === 'All'
        ? FEED_POSTS
        : FEED_POSTS.filter(p => p.attachments?.some(a => a.type === TYPE_MAP[filterVal]));

    return (
        <div className="cf-feed-wrap">
            <div className={`cf-compose-card${composeFocused ? ' focused' : ''}`}>
                <div className="cf-compose-top">
                    <div className="cf-compose-avatar"><AvatarIcon /></div>
                    <textarea
                        className="cf-compose-textarea"
                        placeholder="Write something..."
                        value={composeText}
                        onFocus={() => setComposeFocused(true)}
                        onBlur={() => { if (!composeText) setComposeFocused(false); }}
                        onChange={e => setComposeText(e.target.value)}
                        rows={composeFocused ? 3 : 1}
                    />
                    <div className="cf-compose-top-icons">
                        <button className="cf-compose-icon-btn" title="AI assist">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                        </button>
                        <button className="cf-compose-icon-btn" title="Grammar check">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
                        </button>
                    </div>
                </div>
                <div className="cf-compose-toolbar">
                    <div className="cf-compose-toolbar-left">
                        <button className="cf-toolbar-btn">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                            Attach File
                        </button>
                        <button className="cf-toolbar-btn">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                            Template
                        </button>
                        <button className="cf-toolbar-btn">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                            Using AI
                        </button>
                    </div>
                    <div className="cf-compose-toolbar-right">
                        <button className="cf-visibility-btn">
                            Everybody can see
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                        </button>
                        <button className="cf-post-btn">POST</button>
                    </div>
                </div>
            </div>

            <div className="cf-feed-controls">
                <button className="cf-feed-search-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </button>
                <select className="cf-feed-filter" value={filterVal} onChange={e => setFilterVal(e.target.value)}>
                    <option>All</option>
                    <option>Audios</option>
                    <option>Images</option>
                    <option>Videos</option>
                    <option>Docs</option>
                    <option>Files</option>
                </select>
            </div>

            <div className="cf-posts-list">
                {filtered.map(post => <FeedPost key={post.id} post={post} />)}
            </div>
        </div>
    );
};

export default FeedView;
