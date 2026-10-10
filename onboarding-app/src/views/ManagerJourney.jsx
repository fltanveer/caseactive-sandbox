import StateBlock from '../components/StateBlock';
import StatusPill from '../components/StatusPill';
import LockedControl from '../components/LockedControl';
import SearchableSelect from '../components/SearchableSelect';
import './ManagerJourney.css';

/* The Manager journey.

   A Manager is an account tier, not a case role: host_user_type on
   manage/whoami, sitting beside Admin. It decides what hub settings you can
   change. Staff and Client are the separate case-level roles, each with a
   designation, which is why "Staff · Lead Attorney" and "Admin vs Manager"
   are two different axes rather than two names for one thing.

   The journey is the order a Manager actually meets these screens, so the
   locked pattern can be judged by how often it fires rather than one card at
   a time. Tickets 1, 2, 6 and 9 all land somewhere on this path. */

const Stage = ({ n, title, lede, tickets, children }) => (
    <section className="mj-stage" id={`stage-${n}`}>
        <header className="mj-stage-head">
            <span className="mj-stage-no">{n}</span>
            <div className="mj-stage-headings">
                <h3 className="mj-stage-title">{title}</h3>
                {lede && <p className="mj-stage-lede">{lede}</p>}
            </div>
            <span className="mj-stage-tickets">
                {tickets.map(t => <span key={t} className="mj-ticket-tag">{t}</span>)}
            </span>
        </header>
        <div className="mj-stage-body">{children}</div>
    </section>
);

const Shot = ({ label, phone = false, children }) => (
    <div className={`mj-shot${phone ? ' mj-shot-phone' : ''}`}>
        <span className="mj-shot-label">{label}</span>
        {phone
            ? <div className="mj-phone"><div className="mj-phone-screen">{children}</div></div>
            : <div className="mj-shot-body">{children}</div>}
    </div>
);

const Panel = ({ title, sub, actions, children }) => (
    <div className="mj-panel">
        {(title || actions) && (
            <div className="mj-panel-head">
                <div>
                    {title && <div className="mj-panel-label">{title}</div>}
                    {sub && <p className="mj-panel-sub">{sub}</p>}
                </div>
                {actions}
            </div>
        )}
        {children}
    </div>
);

const Toggle = ({ on }) => <span className={`mj-toggle${on ? ' on' : ''}`}><span /></span>;

const Row = ({ name, hint, control }) => (
    <div className="mj-row">
        <div className="mj-row-main">
            <span className="mj-row-name">{name}</span>
            {hint && <span className="mj-row-hint">{hint}</span>}
        </div>
        {control}
    </div>
);

/* ── The account site header, which the phone build hides today ── */
const AccountHeader = ({ narrow = false }) => (
    <div className={`mj-hdr${narrow ? ' is-narrow' : ''}`}>
        <span className="mj-hdr-brand">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="14" height="12" rx="2"/><path d="M16 10h4a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-8"/></svg>
            CaseActive
        </span>
        <nav className="mj-hdr-nav">
            <span className="mj-hdr-link is-active">Hubs</span>
            <span className="mj-hdr-link">Profile</span>
            <span className="mj-hdr-link mj-hdr-slot">
                HF-71
                <span className="mj-hdr-slot-tag">slot</span>
            </span>
        </nav>
        <span className="mj-hdr-avatar">RG</span>
    </div>
);

const ManagerJourney = () => (
    <div className="mj">
        <div className="mj-intro">
            <span className="mj-eyebrow">Journey · Manager</span>
            <h2 className="mj-title">What a Manager meets, in the order they meet it</h2>
            <p className="mj-standfirst">
                Manager is an account tier, not a case role. It is <code>host_user_type</code> on manage/whoami, sitting
                beside Admin, and it decides what hub settings a person can change. Staff and Client are the separate
                case-level roles, each carrying a designation, which is why "Staff · Lead Attorney" in ticket 11 and
                "Admin vs Manager" in ticket 1 are two different things rather than two words for one.
            </p>
            <p className="mj-standfirst">
                Laid out as a path because the locked pattern is only worth judging by how often it fires. A Manager hits
                it nine times before lunch, so anything heavier than one grey line and a sentence becomes wallpaper.
            </p>
        </div>

        <Stage
            n={1}
            title="Sign in to the account site"
            lede="Hubs and Profile are hidden at every width on phones today, so the account site is unusable there. HF-71 adds a third item to the same header, so both are designed at once."
            tickets={['6.1']}
        >
            <Shot label="Computer">
                <AccountHeader />
            </Shot>
            <Shot label="Phone · all three items stay, nothing collapses into a burger" phone>
                <AccountHeader narrow />
                <div className="mj-phone-filler">
                    <div className="mj-phone-card" />
                    <div className="mj-phone-card" />
                </div>
            </Shot>
            <p className="mj-note">
                Three items fit at 360px without a menu, so they stay visible rather than hiding behind one. A burger here
                would cost a tap on every visit to save nothing, and it is what produced the current bug. The HF-71 slot is
                marked so that ticket drops into a decided place instead of reopening this one.
            </p>
        </Stage>

        <Stage
            n={2}
            title="The hubs list"
            lede="A hub whose access was taken away needs its own status, distinct from one that was rejected outright."
            tickets={['6.3']}
        >
            <Shot label="Rejected tab">
                <Panel>
                    <div className="mj-tabs">
                        <span className="mj-tab">Active</span>
                        <span className="mj-tab is-active">Rejected</span>
                        <span className="mj-tab">Disabled</span>
                    </div>
                    <table className="mj-table">
                        <thead><tr><th>Company name</th><th>Type</th><th>Status</th></tr></thead>
                        <tbody>
                            <tr>
                                <td>Sterling &amp; Brooks Injury Law</td>
                                <td>Law firm</td>
                                <td><StatusPill status="accessRemoved" dot /></td>
                            </tr>
                            <tr>
                                <td>Halvorsen Legal Group</td>
                                <td>Law firm</td>
                                <td><StatusPill label="Rejected" tone="neutral" dot /></td>
                            </tr>
                        </tbody>
                    </table>
                </Panel>
            </Shot>
            <p className="mj-note">
                Access removed is red because something was taken from you and you may want it back. Rejected is grey
                because the answer was no from the start and there is nothing to recover.
            </p>
        </Stage>

        <Stage
            n={3}
            title="Opening a hub they no longer have access to"
            lede="The Permissions tab has to say three things: access was removed, the firm kept the details as they were, and nothing changes until access is approved again."
            tickets={['6.2']}
        >
            <Shot label="Permissions tab of a removed hub">
                <Panel title="PERMISSIONS">
                    <StateBlock
                        tone="error"
                        title="Your access to this hub was removed."
                        message="The firm keeps your details as they were. Nothing here changes until they approve your access again."
                    />
                    <div className="mj-locked-wrap">
                        <LockedControl reason="Approval is the firm's to give. Nothing here can be changed meanwhile.">
                            <div className="mj-stack">
                                <Row name="Create cases" control={<Toggle on />} />
                                <Row name="Add people to a case" control={<Toggle on />} />
                                <Row name="Remove people from a case" control={<Toggle />} />
                            </div>
                        </LockedControl>
                    </div>
                </Panel>
            </Shot>
            <p className="mj-note">
                The permissions stay on screen at their old values rather than emptying out. Blanking them would read as
                "the firm revoked everything", which is a different and more alarming claim than the true one.
            </p>
        </Stage>

        <Stage
            n={4}
            title="Inside the hub, on a settings screen"
            lede="Modules, case types, custom fields, roles, billing, API keys and webhooks. Seven screens, one pattern."
            tickets={['1.1', '1.2']}
        >
            <Shot label="A locked table, the shape most of the seven take">
                <Panel
                    title="ROLES"
                    sub="Roles decide what each person can open and change."
                    actions={<button className="mj-btn mj-btn-primary" disabled>+ Add Role</button>}
                >
                    <LockedControl reason="Only an Admin can change this.">
                        <table className="mj-table">
                            <thead><tr><th>Role</th><th className="mj-num">Users</th><th>Scope</th></tr></thead>
                            <tbody>
                                <tr><td>Administrator</td><td className="mj-num">3</td><td>Everything</td></tr>
                                <tr><td>Lead Attorney</td><td className="mj-num">12</td><td>Cases and billing</td></tr>
                                <tr><td>Paralegal</td><td className="mj-num">8</td><td>Cases and documents</td></tr>
                            </tbody>
                        </table>
                    </LockedControl>
                </Panel>
            </Shot>
            <Shot label="A locked switch, for the screens that are a list of settings">
                <Panel title="MODULES">
                    <LockedControl reason="Only an Admin can change this.">
                        <div className="mj-stack">
                            <Row name="E-signatures" hint="Send documents for signing from a case." control={<Toggle on />} />
                            <Row name="Invoices" hint="Raise and collect invoices in the portal." control={<Toggle on />} />
                            <Row name="Video calls" hint="Start a call from a case." control={<Toggle />} />
                        </div>
                    </LockedControl>
                </Panel>
            </Shot>
            <p className="mj-note">
                One reason line per card, not per control. Three switches under one lock get one sentence; repeating it
                three times turns the explanation into noise and the Manager stops reading it by the second screen.
            </p>
        </Stage>

        <Stage
            n={5}
            title="Payments, where it currently breaks"
            lede="The Stripe calls are Admin-only, so today Invoices simply omits the Stripe card and Payments Settings spins forever. Both become the same locked state."
            tickets={['1.2', '9.5']}
        >
            <div className="mj-before-after">
                <Shot label="Today · Payments Settings">
                    <Panel title="PAYMENT PROVIDER">
                        <div className="mj-spinner-box">
                            <span className="mj-spinner" />
                            <span className="mj-spinner-text">Spins forever. The 403 never becomes a message.</span>
                        </div>
                    </Panel>
                </Shot>
                <Shot label="Designed">
                    <Panel title="PAYMENT PROVIDER" sub="Connect a provider to collect invoice payments online.">
                        <LockedControl reason="Only an Admin can connect or change a payment provider.">
                            <div className="mj-provider">
                                <span className="mj-stripe">stripe</span>
                                <div className="mj-row-main">
                                    <span className="mj-row-name">Stripe</span>
                                    <span className="mj-row-hint">Connected · payouts daily</span>
                                </div>
                                <Toggle on />
                            </div>
                        </LockedControl>
                    </Panel>
                </Shot>
            </div>
            <div className="mj-before-after">
                <Shot label="Today · Invoices">
                    <Panel title="ONLINE PAYMENT">
                        <div className="mj-absent">The Stripe card is not rendered at all. Nothing says why.</div>
                    </Panel>
                </Shot>
                <Shot label="Designed">
                    <Panel title="ONLINE PAYMENT">
                        <LockedControl reason="Only an Admin can change how this invoice is paid.">
                            <div className="mj-provider">
                                <span className="mj-stripe">stripe</span>
                                <div className="mj-row-main">
                                    <span className="mj-row-name">Let the client pay this invoice online</span>
                                    <span className="mj-row-hint">Card and bank transfer through Stripe.</span>
                                </div>
                                <Toggle on />
                            </div>
                        </LockedControl>
                    </Panel>
                </Shot>
            </div>
            <Shot label="9.5 · when Stripe itself refuses, the switch stays and Stripe's reason is shown">
                <Panel title="ONLINE PAYMENT">
                    <div className="mj-provider">
                        <span className="mj-stripe">stripe</span>
                        <div className="mj-row-main">
                            <span className="mj-row-name">Let the client pay this invoice online</span>
                            <span className="mj-row-hint">Card and bank transfer through Stripe.</span>
                        </div>
                        <Toggle />
                    </div>
                    <StateBlock
                        compact
                        tone="error"
                        title="Stripe could not enable online payment."
                        message="Your Stripe account cannot accept charges yet: business details are incomplete."
                        actionLabel="Try again"
                    />
                </Panel>
            </Shot>
            <p className="mj-note">
                Keeping the switch is the point. Removing it on refusal is what produced the missing-card bug: the setting
                becomes invisible, and the user cannot tell a refusal from a feature that does not exist.
            </p>
        </Stage>

        <Stage
            n={6}
            title="Support's intake settings"
            lede="Managers can edit these today and only discover otherwise on save, when the server returns 403 and the screen says Failed."
            tickets={['1.2']}
        >
            <div className="mj-before-after">
                <Shot label="Today · a refused save">
                    <Panel title="INTAKE QUESTION">
                        <input className="mj-input" defaultValue="What can we help you with?" readOnly />
                        <div className="mj-fail">Failed</div>
                    </Panel>
                </Shot>
                <Shot label="Designed · locked before the attempt">
                    <Panel title="INTAKE QUESTION">
                        <LockedControl reason="Only an Admin can change Support's intake settings.">
                            <div className="mj-stack">
                                <div className="mj-field">
                                    <span className="mj-field-label">Question shown to clients</span>
                                    <div className="mj-input mj-input-static">What can we help you with?</div>
                                </div>
                                <Row name="Categories" hint="Billing, My case, Documents, Something else" control={<span className="mj-count">4</span>} />
                                <Row name="Remove enquiry form" control={<button className="mj-btn mj-btn-danger" disabled>Remove</button>} />
                            </div>
                        </LockedControl>
                    </Panel>
                </Shot>
            </div>
            <Shot label="And where a save is still refused, the server's sentence, not the word Failed">
                <StateBlock
                    tone="error"
                    title="This question is used by an active intake form and cannot be blank."
                    message="Shown exactly as the server returned it. support.component.ts lines 375, 395 and 424 replace Failed with this."
                />
            </Shot>
            <p className="mj-note">
                Locking the screen is the fix; showing the server's sentence is the safety net. Both are needed, because
                ca-manage cannot tell the tiers apart until host_user_type lands on manage/whoami, so some Managers will
                still reach the save.
            </p>
        </Stage>

        <Stage
            n={7}
            title="A member's settings, where the tier is granted"
            lede="Admins can promote a Manager or demote another Admin. They cannot change themselves, and Managers never see the control."
            tickets={['1.3']}
        >
            <div className="mj-three">
                <Shot label="Admin viewing someone else">
                    <Panel title="ROLE">
                        <div className="mj-field">
                            <span className="mj-field-label">Hub role</span>
                            <SearchableSelect className="mj-input" defaultValue="manager">
                                <option value="admin">Admin</option>
                                <option value="manager">Manager</option>
                            </SearchableSelect>
                            <span className="mj-field-hint">Admins can change every setting in this hub. Managers can see them but not change them.</span>
                        </div>
                    </Panel>
                </Shot>
                <Shot label="Admin viewing themselves">
                    <Panel title="ROLE">
                        <LockedControl reason="You cannot change your own role. Ask another Admin.">
                            <div className="mj-field">
                                <span className="mj-field-label">Hub role</span>
                                <div className="mj-input mj-input-static">Admin</div>
                            </div>
                        </LockedControl>
                    </Panel>
                </Shot>
                <Shot label="Manager viewing anyone">
                    <Panel title="PROFILE">
                        <div className="mj-stack">
                            <div className="mj-field">
                                <span className="mj-field-label">Name</span>
                                <div className="mj-input mj-input-static">Elena Ramirez</div>
                            </div>
                        </div>
                        <p className="mj-absent-inline">No Role section renders at all.</p>
                    </Panel>
                </Shot>
            </div>
            <p className="mj-note">
                The one place hiding beats greying out. Everywhere else a locked control answers "what is this set to".
                Here it would answer "who could make me an Admin", which is a request, not a question, and the control
                exists to grant power rather than to hold a value.
            </p>
        </Stage>

        <Stage
            n={8}
            title="The invoice list"
            lede="A list that failed to load and a list with nothing in it are the same shape today, so a Manager reads a server fault as an empty ledger."
            tickets={['9.3']}
        >
            <div className="mj-before-after">
                <Shot label="No invoices yet">
                    <Panel title="INVOICES">
                        <StateBlock tone="empty" title="No invoices yet" message="Invoices raised for this case will appear here." />
                    </Panel>
                </Shot>
                <Shot label="Couldn't load">
                    <Panel title="INVOICES">
                        <StateBlock
                            tone="error"
                            title="Invoices couldn't be loaded"
                            message="Something went wrong at our end. Nothing has changed."
                            actionLabel="Try again"
                        />
                    </Panel>
                </Shot>
            </div>
        </Stage>

        <Stage
            n={9}
            title="Who holds a role"
            lede="A Manager cannot edit roles, but the holders list is a read, so it stays open to them. Only the delete is refused."
            tickets={['2.1', '2.2']}
        >
            <Shot label="Holders list, as a Manager sees it">
                <Panel title="WHO HOLDS LEAD ATTORNEY" sub="12 people hold this role. Closed cases are included.">
                    <table className="mj-table">
                        <thead><tr><th>Case</th><th>Tag ID</th><th>Status</th><th>Person</th></tr></thead>
                        <tbody>
                            <tr><td>Rear-End Collision, Downtown LA</td><td><code className="mj-code">a1b2c3d4e56789</code></td><td><StatusPill status="active" /></td><td>Marcus Bell</td></tr>
                            <tr><td>Bicycle Accident, Echo Park</td><td><code className="mj-code">c5d6e7f8091234</code></td><td><StatusPill status="closed" /></td><td>Elena Ramirez</td></tr>
                        </tbody>
                    </table>
                </Panel>
            </Shot>
            <Shot label="Delete refused, whoever asks">
                <Panel>
                    <StateBlock
                        tone="error"
                        title="12 people still hold this role."
                        message="Move them to another role first, then delete it."
                        actionLabel="See who holds it"
                    />
                </Panel>
            </Shot>
            <p className="mj-note">
                Two different refusals stack here for a Manager: the role cannot be deleted because people hold it, and a
                Manager could not delete it anyway. Show the one they can act on. "Only an Admin can change this" belongs
                on the delete button, not on top of the holders message.
            </p>
        </Stage>

        <div className="mj-foot">
            <h4>What this journey says about the pattern</h4>
            <p>
                A Manager meets the locked state nine times on an ordinary path, which is the argument for one grey line
                and one sentence rather than a banner or a modal. It also sets two exceptions worth agreeing explicitly:
                the role control at stage 7 is hidden rather than locked, and the permissions at stage 3 keep their values
                rather than emptying.
            </p>
            <p className="mj-foot-gap">
                Still missing: HF-71's content, so stage 1 leaves a marked slot rather than guessing at the item. And
                until <code>host_user_type</code> reaches manage/whoami, ca-manage cannot tell the tiers apart, so every
                locked screen here still needs the server-sentence fallback at stage 6.
            </p>
        </div>
    </div>
);

export default ManagerJourney;
