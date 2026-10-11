/* Per-item build notes, keyed by item id.

   A picture of a state tells a dev what it looks like and nothing about what
   it does at 2am when the request fails. Each entry answers the questions
   that come after "looks fine": what it is made of, which states exist, what
   the exact words are, what the thing must do, and how you know it is done.

   today     what the screen does now, read off the real component rather
             than remembered. Present only where that turned out to differ
             from what the ticket assumed.
   why       one paragraph on the reasoning, so a dev can judge a trade-off
             we did not anticipate instead of guessing
   anatomy   the parts, in render order
   states    every state that must exist, including the ones easy to forget
   tokens    exact values, so nothing is eyeballed
   copy      strings verbatim, since these are reviewed by non-designers
   rules     behaviour, including what must NOT happen
   done      the acceptance line
*/

export const SPECS = {
    /* ── HF-15 · Admin vs Manager ──────────────────────────────────── */
    '1.1': {
        why: 'A Manager who meets a hidden control cannot tell the difference between a setting that is off, a feature the hub does not have, and a setting that is simply not theirs. All three look like nothing. Dimming the real control answers the first two by showing the current value, and the reason line answers the third. The cost is one line of text; the alternative costs a message to an Admin.',
        anatomy: ['The real control, rendered normally', 'A dimming layer over it', 'One reason line below, with a small lock icon'],
        states: [
            ['Locked', 'Control dimmed to 55% and desaturated, reason line below.'],
            ['Locked, whole card', 'When every control in a card is Admin-only, lock the card and show one reason at the card instead of one per control.'],
            ['Locked, whole page', 'The reason moves above the content. Under one field it is the next thing read; under a page it is below everything, so someone scans a table of dimmed rows and reaches the explanation last. Pass reasonFirst.'],
            ['Unlocked', 'Nothing renders. No placeholder, no empty reason line.'],
        ],
        tokens: [
            ['opacity', '0.55'],
            ['filter', 'grayscale(0.35)'],
            ['pointer-events', 'none'],
            ['gap, control to reason', '7px'],
            ['reason size / colour', '12.5px / #64748B'],
            ['lock icon', '12px, #94A3B8'],
        ],
        copy: ['Only an Admin can change this.'],
        rules: [
            'The control keeps its real value. Never substitute a placeholder or an empty state.',
            'The wrapper carries inert, so the control cannot be focused, tabbed to or submitted by keyboard.',
            'One reason per card, not per control. Three switches under one lock get one sentence.',
            'The reason sits under the control it explains, never at the top of the page.',
            'Do not disable the control with the disabled attribute alone: a disabled input is skipped by some screen readers, so the viewer loses the value too.',
        ],
        done: 'A Manager can read every current setting value on a locked screen, cannot change any of them by mouse or keyboard, and can say who can.',
        component: 'LockedControl',
    },
    '1.2': {
        why: 'Roles and Modules are the two shapes every other locked screen reduces to: a table of things, and a list of switches. Settling both here means the remaining five screens are an application rather than a decision.',
        anatomy: ['The screen as an Admin sees it', 'Locked wrapper around the table or the switch list', 'One reason line per card', 'Primary action disabled, not removed'],
        states: [
            ['Table locked', 'Rows readable, row actions dimmed with the rest.'],
            ['Switch list locked', 'Every switch shows its real position.'],
            ['Add button', 'Disabled and still visible, so the capability is discoverable.'],
        ],
        copy: ['Only an Admin can change this.'],
        rules: [
            'One reason per card. A table and a switch list in the same screen get one each, not one per row.',
            'The Add action stays rendered and disabled. Removing it hides that the hub can have more roles at all.',
            'Row-level actions inherit the card lock rather than carrying their own reason.',
        ],
        done: 'A Manager can read every role and module setting, and change none of them.',
        component: 'LockedControl',
    },
    '1.3': {
        why: 'Custom Fields is the same pattern on a screen with a drag handle, which is the one control that looks interactive even when dimmed. It has to be inert as well as dimmed, or a Manager will drag a row and watch it snap back.',
        anatomy: ['Fields table, locked', 'Drag handles dimmed and inert', 'Reason line'],
        states: [['Locked'], ['Unlocked for an Admin']],
        copy: ['Only an Admin can change this.'],
        rules: [
            'Drag must be disabled, not just dimmed. A row that moves and reverts is worse than one that cannot move.',
            'System rows keep their existing Locked treatment. The two locks stack visually but only one reason line is shown.',
        ],
        done: 'A Manager cannot reorder, edit or delete a custom field, and nothing appears to move when they try.',
        component: 'LockedControl',
    },
    '1.4': {
        why: 'Billing, API keys and webhooks hold secrets and money, so the instinct is to hide them from a Manager entirely. The same argument as 1.1 applies: a Manager who cannot see that a webhook exists cannot tell an Admin it is the one that broke. Values that are actually secret are masked for everyone, which is a separate concern from the tier.',
        anatomy: ['The screen, locked', 'Reason line', 'Secrets masked independently of the lock'],
        states: [['Locked'], ['Secret masked', 'Applies to every tier, including Admin.']],
        copy: ['Only an Admin can change this.'],
        rules: [
            'Masking a key is not the same as locking the screen. Keep the two separate: an Admin also sees a masked key.',
            'A Manager can see that a key exists, its label and its last use, but not reveal, rotate or delete it.',
            'Billing shows the current plan and card last four. It does not show the full billing history to a Manager if the endpoint refuses it; render the locked empty state rather than a spinner.',
        ],
        done: 'A Manager can describe the hub\'s integrations and plan accurately without being able to change or reveal anything.',
        component: 'LockedControl',
    },
    '1.5': {
        why: 'The screen spins because a 403 is being treated as "still loading". A failed permission check is a final answer, not a pending one. Resolving it to the locked state gives the Manager the same information an Admin has, minus the ability to act.',
        anatomy: ['Payment provider card as an Admin sees it', 'Locked wrapper', 'Reason line'],
        states: [
            ['Connected, locked', 'Provider name, connection status, switch on, all dimmed.'],
            ['Not connected, locked', 'Same card with the empty provider state, still dimmed.'],
            ['Loading', 'Spinner, but it must resolve. On 403 go to locked, never stay spinning.'],
        ],
        copy: ['Only an Admin can connect or change a payment provider.'],
        rules: [
            'Treat 403 from the Stripe endpoints as a terminal state that renders locked.',
            'Do not retry a 403. Retrying is what makes it look like loading.',
            'The card renders from whatever the read endpoint returns. If the read is also Admin-only, render the locked card with the provider name only.',
        ],
        done: 'A Manager opening Payments Settings sees a resolved screen within one request, never an indefinite spinner.',
        component: 'LockedControl',
    },
    '1.6': {
        why: 'Today the card is simply not rendered, so a Manager looking at an invoice cannot tell whether online payment is off for this invoice, unavailable in this hub, or just not theirs to set. Rendering it locked answers all three at once.',
        anatomy: ['Stripe row: logo, label, hint, switch', 'Locked wrapper', 'Reason line'],
        states: [['Locked, on'], ['Locked, off'], ['Unlocked for an Admin']],
        copy: ['Only an Admin can change how this invoice is paid.'],
        rules: [
            'Render the card for every tier. Visibility is not the permission.',
            'The switch shows the invoice\'s real setting, not a default.',
        ],
        done: 'The Stripe card appears on an invoice for a Manager, dimmed, showing the invoice\'s real setting.',
        component: 'LockedControl',
    },
    '1.7': {
        why: 'Two fixes, and both are needed. Locking the screen stops the attempt. Showing the server sentence catches the attempts that still get through, because ca-manage cannot tell the tiers apart until host_user_type reaches manage/whoami, so some Managers will reach the save regardless.',
        anatomy: ['Intake settings form, locked', 'On a refused save, an error block carrying the server message'],
        states: [
            ['Locked', 'Before any attempt.'],
            ['Refused', 'Error block, server sentence verbatim as the title.'],
        ],
        copy: ['Only an Admin can change Support\'s intake settings.', 'Server message, verbatim. Never the word "Failed".'],
        rules: [
            'Put the server sentence in the error title, not a generic heading with the detail hidden below.',
            'If the server returns no message, fall back to "That change was refused." and log the raw response.',
            'Replaces the "Failed" strings at support.component.ts lines 375, 395 and 424.',
        ],
        done: 'A refused save shows the sentence the server returned, and the screen is locked before the attempt where the tier is known.',
        component: 'StateBlock tone="error"',
    },
    '1.8': {
        today: 'The control already exists. Edit User, opened from the pencil on a row, has a Settings tab whose HOST USER ATTRIBUTES section holds a User Type select offering User, Admin and Staff. So this item changes that select\'s options rather than adding a field. Two oddities come with it: the select offers Staff, which the TYPE column on the Users list never shows, and it cannot offer bot, which the column does show.',
        why: 'The tier already has a column on the Users list and a field in Edit User: Type, carrying admin, user or bot. It has no value for a Manager, which is the whole ticket. Putting the change on the existing Type field rather than inventing a Hub role control keeps one concept in one place, and means the list and the modal agree. Everywhere else a locked control answers "what is this set to"; here it would answer "who could make me an Admin", which is a request rather than a question, so for a Manager the field is removed instead of dimmed. The self case is locked rather than hidden, because an Admin already knows their own tier and the lock explains why they cannot drop it.',
        anatomy: ['Users list: Type column, showing the tier', 'Edit User modal, opened from the pencil', 'Type select inside it, beside Role', 'Hint line under Type'],
        states: [
            ['Admin editing another member', 'Type select enabled, with manager among the options.'],
            ['Admin editing themselves', 'Type locked, with the self reason. Role stays editable.'],
            ['Manager editing anyone', 'The Type field does not render. Role renders, locked.'],
            ['Bot row', 'Type reads bot and is not editable by anyone.'],
        ],
        tokens: [['Type column values', 'admin | manager | user | bot'], ['Role column values', 'admin | staff | client | custom role | N/A']],
        copy: [
            'Type',
            'Admins can change every hub setting. Managers see them but cannot change them.',
            'You cannot change your own type. Ask another Admin.',
            'Only an Admin can change this.',
        ],
        rules: [
            'manager becomes a fourth value of host_user_type alongside admin, user and bot. The Users list Type column must render it.',
            'Type is the account tier; Role is the hub role. They are separate columns and separate fields, and a change to one never changes the other.',
            'The Type field is removed for Managers, not dimmed. This is the documented exception to 1.1.',
            'An Admin cannot change their own Type even if they are not the last Admin. The rule is about the self, not the count.',
            'A tier change takes effect on the member\'s next request. Say so if it is not immediate.',
            'Role stays visible and locked for a Manager, because a role is a value rather than a grant of power.',
        ],
        done: 'The Users list can show a Manager in Type, an Admin can change anyone\'s Type but their own, and a Manager never sees the field.',
        data: 'host_user_type needs a manager value, and manage/whoami needs to return it so the Admin Panel can tell the tiers apart.',
    },
    '2.1': {
        why: 'The count is already the answer to "how many", so it is the natural place to ask "which ones". Adding a separate View button would put two controls on a row that needs one.',
        anatomy: ['The count, rendered as a link'],
        states: [['0 holders', 'Plain text, not a link. There is nothing to open.'], ['1 or more', 'Link.']],
        copy: [],
        rules: ['Underline it. A bare coloured number does not read as clickable in a numeric column.', 'Keep the column right-aligned and tabular.'],
        done: 'Clicking a non-zero count opens the holders window for that role.',
    },
    '2.2': {
        why: 'Each row has to answer "who, on what, and is it still live", because the reason someone opens this list is usually to move people off the role before deleting it. Closed cases are included for the same reason: a holder on a closed case still blocks the delete.',
        anatomy: ['Window headed by the role name', 'Count line', 'Table: Case, Tag ID, Status, Person'],
        states: [
            ['Loaded'], ['Empty', 'Should not occur from a non-zero count, but handle it.'],
            ['Couldn\'t load', 'Error block with Try again.'],
        ],
        copy: ['Who holds {role}', '{n} people hold this role. Closed cases are included.'],
        rules: [
            'Whole row is the click target, not just the title.',
            'Closed cases are listed, with the Closed status pill, and are not dimmed: they count towards the delete block.',
            'Sort live cases before closed, then by case title.',
            'Paginate past 50 rows.',
        ],
        done: 'Every holder appears once per case they hold the role on, and clicking a row opens that case.',
        data: 'Needs holders-by-role: case id, case title, tag id, case status, person name. Must include closed cases.',
    },
    '2.3': {
        why: 'The refusal is only useful if it leads somewhere. Naming the number without a way to see who they are leaves the Admin to go and find them by hand.',
        anatomy: ['Error block', 'Count in the title', 'Action opening the holders list'],
        states: [['Blocked by holders'], ['Blocked by something else', 'Different sentence, same shape.']],
        copy: ['{n} people still hold this role.', 'Move them to another role first, then delete it.', 'See who holds it'],
        rules: ['Count people, not rows: one person on three cases is one person.', 'The action opens the same window as 2.2.'],
        done: 'A refused delete names the number and opens the list in one click.',
        component: 'StateBlock tone="error"',
    },

    /* ── HF-54 · Add Inquiry For ────────────────────────────────────── */
    '3.1': {
        why: 'Staff raise inquiries for clients who phoned in. The field goes first because it changes who everything below is about: subject, message and the resulting email all belong to whoever is chosen.',
        anatomy: ['Label "For"', 'Searchable select', 'Hint line'],
        states: [['Myself, the default'], ['Someone else'], ['No members to pick', 'Select shows Myself only.']],
        copy: ['For', 'This inquiry will be raised in your name.'],
        rules: [
            'Myself is pinned first, always, regardless of search.',
            'The field is first in the form, above Subject.',
            'Clients never see this field. They can only raise for themselves.',
        ],
        done: 'A staff member can raise an inquiry in another member\'s name, and Myself is the default.',
        data: 'Needs the hub member list with the signed-in user identifiable.',
    },
    '3.2': {
        why: 'Raising something in someone else\'s name sends them an email they did not ask for and routes replies away from you. That is a surprise worth one sentence at the moment of choosing, not in a confirmation afterwards.',
        anatomy: ['Helper line, directly under the For field'],
        states: [['Myself', 'Plain hint.'], ['Someone else', 'Tinted helper naming them.']],
        copy: ['{name} will be emailed about this inquiry, and replies go to her.'],
        rules: [
            'Name the person. "They will be emailed" is weaker than "Alexandra Reyes will be emailed".',
            'Use the person\'s own pronoun where known; otherwise rewrite to avoid one.',
            'Appears on selection, not on submit.',
        ],
        done: 'Choosing another member shows a line naming them and saying replies go to them.',
    },
    '3.3': {
        why: 'The reply box on a closed inquiry is a trap: people type into it and lose the text. Replacing it with the reason and the way out costs nothing and removes the trap.',
        anatomy: ['Locked state block in place of the composer', 'Reopen action'],
        states: [['Closed, viewer may reopen', 'Action shown.'], ['Closed, viewer may not', 'Same sentence, no action.']],
        copy: ['This inquiry is closed.', 'Reopen it to reply.', 'Reopen'],
        rules: ['Remove the composer from the DOM, do not just disable it.', 'The thread above stays readable and scrollable.'],
        done: 'A closed inquiry has no composer, and says how to get one back.',
        component: 'StateBlock tone="locked"',
    },
    '3.4': {
        why: 'An empty form is worse than a clear refusal: the person fills it in and then finds out. Say it before they type.',
        anatomy: ['Empty state in place of the form', 'Close only'],
        states: [['No form configured']],
        copy: ['This hub has no inquiry form.', 'An Admin removed it. Ask them to add one before raising inquiries here.'],
        rules: ['No Send button. There is nothing to send.', 'Empty tone, not error: nothing failed.'],
        done: 'Opening Add Inquiry in a hub with no form explains why instead of showing an empty form.',
        component: 'StateBlock tone="empty"',
    },

    /* ── HF-42 · E-signs ───────────────────────────────────────────── */
    '4.1': {
        today: 'There is no signed copy screen to add this to. On a published, completed e-sign the row offers a disabled signature button and View Settings, and nothing that opens the document. So this item builds the viewer as well as the record.',
        why: 'A signed copy is evidence. Who signed and when has to be on the same screen as the document, because the two are only meaningful together. It is collapsed by default because people open the page to read the document, and an IP address is noise until someone is specifically checking one.',
        anatomy: ['Summary line with the signer count', 'Show/Hide details toggle', 'Table: Signer, Signed at, IP address', 'The document below'],
        states: [
            ['Collapsed, the default', 'Summary line only.'],
            ['Expanded', 'Full table.'],
            ['Partly signed', 'Counts signed of total, unsigned signers listed with a dash.'],
        ],
        tokens: [['strip background', '#FBFCFD'], ['strip border', '1px solid #E2E8F0'], ['radius', '9px'], ['gap to document', '12px']],
        copy: ['Signed by {n} people', 'Show details', 'Hide details', 'Signer', 'Signed at', 'IP address'],
        rules: [
            'Times in the reader\'s time zone with the zone abbreviation shown, since this is evidence.',
            'IP in monospace so digits align and can be compared.',
            'The strip stays above the document at every width. Do not move it below on phones.',
            'Expanded state is remembered per viewer for the session only.',
        ],
        done: 'Every signer on a signed copy is listed with name, local signing time and IP, above the document.',
        data: 'Not captured today. Needs name, ISO timestamp and IP per signer on the signed document record.',
    },
    '4.2': {
        today: 'Status is one .ft-status-badge per row on .fot-table-row, reading Ready whether or not a document was ever attached.',
        why: 'Ready is a promise the template cannot keep without a document. The status is the only place that promise is made, so it is the place to correct it.',
        anatomy: ['Status pill in the templates table'],
        states: [['Needs a document', 'Warning tone.'], ['Ready'], ['Draft']],
        copy: ['Needs a document'],
        rules: [
            'Replaces Ready entirely for these templates. The two are never shown together.',
            'Warning tone, not danger: nothing is broken, something is missing.',
            'Attaching a document flips it to Ready without a save.',
        ],
        done: 'No template without a document reads Ready anywhere in the product.',
        component: 'StatusPill status="needsDocument"',
    },
    '4.3': {
        why: 'Field Logic is edited part-way through a longer task. A disabled Save with nothing saying why is a dead end people screenshot and send to support, and it also throws away whatever else they changed in the window. Saving keeps that work and turns the problem into a visible, fixable state. The hard stop belongs at send, which is the only moment an unassigned field actually breaks something.',
        anatomy: ['Participant select', 'Notice under it when empty', 'Save, enabled'],
        states: [
            ['No participant', 'Notice shown, Save enabled.'],
            ['Participant chosen', 'No notice.'],
            ['Send attempted with unassigned fields', 'Blocked, naming each field.'],
        ],
        copy: [
            'This field will be saved without a participant.',
            'It stays on the template but nobody is asked to fill it. You cannot send the template until it has one.',
            'This template has {n} fields with nobody assigned: {list}. Assign them before sending.',
        ],
        rules: [
            'Save is never disabled by this condition.',
            'The unassigned field shows as Unassigned in the field list, warning tone.',
            'Send is blocked and names every offending field, not just the first.',
        ],
        done: 'A field can be saved with no participant, is visibly unassigned afterwards, and blocks send until assigned.',
    },

    /* ── HF-70 · Tag ID and View Cases ─────────────────────────────── */
    '5.1': {
        today: 'The second column is headed CASE ID and renders the internal id as plain text in .cases-id-text, with no copy control and nothing searchable about it.',
        why: 'People read and search Tag IDs; integrations paste internal ids. Showing both as text doubles the width of the widest column to serve the rarer need, and a value that only gets pasted does not need to be legible first. Putting the internal id behind a copy button keeps it one click away and costs no width.',
        anatomy: ['Tag ID in monospace', 'Copy button, labelled, to its right'],
        states: [
            ['Default'], ['Hover', 'Copy button border darkens.'],
            ['Copied', 'Button reads Copied for 2s, then reverts.'],
            ['No Tag ID', 'Dash, with copy still offering the internal id.'],
        ],
        tokens: [['Tag ID font', 'ui-monospace, 12px'], ['Tag ID chip', '#F1F5F9, radius 5px, padding 2px 6px'], ['copy button', '10.5px, 600']],
        copy: ['copy id', 'Copied', 'Copy internal id {internalId}'],
        rules: [
            'The column header reads Tag ID, not Case ID.',
            'Copy puts the internal id on the clipboard, not the Tag ID.',
            'The button carries the internal id in its title, so it is discoverable without clicking.',
            'Search matches both the Tag ID and the internal id.',
        ],
        done: 'The list shows Tag IDs, search finds a case by either id, and the internal id is one click from every row.',
    },
    '5.2': {
        why: 'Same decision, less room. On a card the Tag ID sits on its own line rather than being squeezed next to the title.',
        anatomy: ['Card title', 'Tag ID row with copy', 'Status row'],
        states: [['Default'], ['Copied']],
        rules: ['Copy target stays at least 32px tall.', 'Tag ID never truncates. Truncate the title instead.'],
        done: 'A case card on a phone shows its Tag ID in full with a thumb-sized copy control.',
    },
    '5.3': {
        today: 'The window is titled View Cases rather than the person. Its columns are CASE ID, STATUS, ROLE, ACTION: no case title, and a role with no designation. The person appears only as an id in a banner above the table.',
        why: 'The window answers "what is this person on, and as what". Role without designation does not answer the second half, since Staff covers an attorney and a paralegal alike.',
        anatomy: ['Window headed by the person\'s name', 'Table: Case, Tag ID, Status, Role'],
        states: [['Loaded'], ['Empty'], ['Couldn\'t load']],
        copy: ['No cases assigned', 'Cases this person is added to will appear here.'],
        rules: [
            'The person\'s name is the window title, not a line inside it.',
            'Role renders as Role · Designation using the shared component.',
            'Closed cases included, with their status.',
        ],
        done: 'The window names the person and shows role and designation per case.',
        component: 'DesignationLabel',
    },
    '5.4': {
        today: 'There is one empty state, .view-cases-empty reading \'No cases assigned.\', and it is what shows when the request failed too.',
        why: 'An empty list and a failed list look identical today, so a server fault reads as "this person has no cases" and nobody retries.',
        anatomy: ['Error block with Try again'],
        states: [['Couldn\'t load'], ['Empty, for contrast']],
        copy: ['{name}\'s cases couldn\'t be loaded', 'Something went wrong at our end.', 'Try again'],
        rules: ['Error tone, never the empty tone.', 'Try again refetches without closing the window.'],
        done: 'A failed load is visibly different from an empty list and offers a retry.',
        component: 'StateBlock tone="error"',
    },

    /* ── HF-72 · Account header and removed hubs ───────────────────── */
    '6.1': {
        why: 'Three items fit at 360px without a menu. A burger would cost a tap on every visit to save nothing, and collapsing is what produced the current bug, where the links ended up hidden at every width rather than only the narrow ones. The HF-71 slot is marked so that ticket lands in a decided place instead of reopening this one.',
        anatomy: ['Logo, mark only below 420px', 'Hubs', 'Profile', 'HF-71 slot', 'Avatar'],
        states: [
            ['Wide', 'Wordmark and all links.'],
            ['Narrow, 360 to 420px', 'Logo mark only, all links still shown.'],
            ['Active link', 'Tinted pill.'],
        ],
        tokens: [['link padding wide', '5px 10px'], ['link padding narrow', '5px 7px'], ['active pill', '#E8F6F8 bg, #0A6473 text'], ['header padding narrow', '10px 11px']],
        copy: ['Hubs', 'Profile'],
        rules: [
            'Delete the rule that hides .portal-hub-wrap, it is the bug.',
            'Never collapse these into a menu at any width.',
            'The logo drops to its mark below 420px. The links do not drop.',
            'Leave the HF-71 slot in the markup so that ticket does not re-litigate placement.',
        ],
        done: 'Hubs and Profile are reachable at 320px and above, with no menu.',
        file: 'src/PortalDashboard.css:2992 hides .portal-hub-wrap',
    },
    '6.2': {
        today: 'Hub settings has two tabs, About Hub and Billing Info. Permissions is a third tab, not a change to an existing one.',
        why: 'Three claims have to land in order: access was removed, your details are intact, and nothing changes until they say so. Blanking the permissions would imply the firm revoked them individually, which is a stronger and different claim than what happened.',
        anatomy: ['Error block at the top of the tab', 'The permissions below, at their old values, locked'],
        states: [['Access removed'], ['Access pending re-approval', 'Same shape, different sentence.']],
        copy: [
            'Your access to this hub was removed.',
            'The firm keeps your details as they were. Nothing here changes until they approve your access again.',
            'Approval is the firm\'s to give. Nothing here can be changed meanwhile.',
        ],
        rules: [
            'Permissions keep their last known values. Do not clear or zero them.',
            'No Save button on this tab while access is removed.',
            'Error tone for the notice, locked tone for the controls. They are different claims.',
        ],
        done: 'A removed hub shows why, keeps the old permission values visible, and offers nothing to change.',
    },
    '6.3': {
        today: 'Status is a .sf-chip driven by the subscription state, so its values describe billing. There is nothing in it for a hub whose access the firm withdrew, and Rejected is doing that job.',
        why: 'Rejected and Access removed are different events. Rejected was never granted; access removed was taken back, which is the one a person may want to act on.',
        anatomy: ['Status pill in the hub row'],
        states: [['Access removed', 'Danger tone.'], ['Rejected', 'Neutral tone.']],
        copy: ['Access removed'],
        rules: ['Danger tone for removed, neutral for rejected. The difference is the point.', 'Both live on the Rejected tab.'],
        done: 'A hub whose access was removed is distinguishable at a glance from one that was rejected.',
        component: 'StatusPill status="accessRemoved"',
    },

    /* ── HF-62 · Video calls ───────────────────────────────────────── */
    '7.1': {
        why: 'Phones, Safari and Firefox cannot float the video, so leaving the call page today means losing the call with no way back. A bar is the one thing that survives navigation without needing picture-in-picture, and it works identically on every browser instead of degrading on three of them.',
        anatomy: ['Live dot', 'Call name and running timer', 'Back to call', 'Leave'],
        states: [
            ['In call, off the call page', 'Bar shown.'],
            ['On the call page', 'Bar hidden, it would be redundant.'],
            ['Reconnecting', 'Amber dot, "Reconnecting".'],
            ['Call ended', 'Bar removed, ended state shown.'],
        ],
        tokens: [['background', '#0F172A'], ['live dot', '#34D399, 8px, 3px ring at 25%'], ['height', '38px'], ['z-index', 'above page content, below modals']],
        copy: ['Call in progress', 'Back to call', 'Leave', 'Reconnecting'],
        rules: [
            'Call state must live above the view so it survives navigation.',
            'The timer counts from join, not from page load.',
            'Full width and sticky at the top on phones. Leave is still reachable.',
            'Leave ends your participation only. It does not end the call for others.',
        ],
        done: 'Leaving the call page keeps the call running with a visible way back, on every supported browser.',
        data: 'Needs call state lifted above the view, with join time and connection status.',
    },
    '7.2': {
        today: 'The app already knows the browser refused and already says so, twice: a caption inside the preview reading \'Camera blocked by the browser\', and a .cv-warn under Join now reading \'Your browser blocked the camera or microphone. Allow access in the address bar, or join without them.\' Neither can be acted on, and the warning sits below the button it should inform.',
        why: 'A blocked device is a browser permission, not an app failure, so the fix is in a place the app cannot reach. The notice has to say that plainly and then make clear the call is still joinable without them, or people give up on the call entirely.',
        anatomy: ['Dead preview area', 'Error block', 'Try again', 'Join with both off, still available'],
        states: [['Both blocked'], ['Camera only'], ['Mic only'], ['No hardware', 'Different sentence: absent, not blocked.']],
        copy: [
            'Your browser is blocking the camera and microphone.',
            'Allow access for this site in your browser settings, then try again. You can also join with both off.',
            'Try again',
        ],
        rules: [
            'Name only what is actually blocked. Do not say both when one works.',
            'Joining with both off stays available. A blocked device never blocks the call.',
            'Try again re-requests permission rather than reloading.',
            'Distinguish blocked from absent: "No camera on this device" is a different sentence.',
        ],
        done: 'A person with a blocked camera understands it is a browser setting and can still join.',
        component: 'StateBlock tone="error"',
    },
    '7.3': {
        today: 'There is already a Call ended screen, reached by leaving, which offers Start another convo. This is the other ending, the one nobody in this browser chose, and it should not read like a thing you did.',
        why: 'When a call closes for everyone the page has nothing left to show, and an empty call frame looks like a failure. Saying it ended, how long it ran and what happens next turns a dead end into a completed thing.',
        anatomy: ['Empty state', 'Duration', 'What happens next', 'Back to the case'],
        states: [['Ended normally'], ['Ended by the host'], ['Dropped', 'Different sentence, offers rejoin.']],
        copy: ['The call has ended.', 'It ran for {duration}. The recording and summary will appear in the case feed shortly.', 'Back to the case'],
        rules: [
            'Only mention the recording and summary if they were actually on.',
            'Distinguish ended from dropped. A dropped call offers rejoin; an ended one does not.',
            'Removes the call bar from 7.1.',
        ],
        done: 'A call that closes for everyone shows an ended state, not an empty frame.',
    },
    '7.4': {
        why: 'Notify looks like it reached everyone. If two people have the case muted, the sender needs to know before they rely on it, not after the client misses the call.',
        anatomy: ['Notice above the action, listing who is excluded and why'],
        states: [['Some excluded'], ['Nobody excluded', 'No notice at all.'], ['Everyone excluded', 'Stronger wording, action disabled.']],
        copy: [
            '{n} people will not be notified.',
            '{names} have notifications muted for this case. Tell them another way if they need to join.',
            'Notify {n} people',
        ],
        rules: [
            'Name them. A count alone is not actionable.',
            'The action button counts only who will actually be notified.',
            'No notice when nobody is excluded. Do not say "0 people will not be notified".',
        ],
        done: 'The sender can see who will not get the notification before sending it.',
    },

    /* ── HF-58 · Imports ───────────────────────────────────────────── */
    '8.1': {
        today: 'The demo data carries the bug: user-bulk-july moved 124 of 125 rows and its status is Completed. StatusBadge knows Queued, Completed and Failed, with nothing between the last two.',
        why: 'Success ticks on a partly failed import are a lie by omission: 20 rows are missing and nothing says so. The summary leads with both numbers because the failure count is the one that needs acting on.',
        anatomy: ['Succeeded count', 'Failed count', 'Proportion bar'],
        states: [['All succeeded', 'No failed figure, no bar.'], ['Partly failed'], ['All failed', 'Bar fully red.']],
        tokens: [['succeeded', '#15803D'], ['failed', '#B91C1C'], ['bar track', '#FEE2E2'], ['bar fill', '#22C55E'], ['figure size', '19px, 700']],
        copy: ['{n} succeeded', '{n} failed'],
        rules: [
            'Both figures are exact counts, never rounded or abbreviated.',
            'Replaces the success ticks entirely when anything failed.',
            'The bar is decorative. The numbers carry the meaning.',
        ],
        done: 'A partly failed import states both counts where the ticks used to be.',
    },
    '8.2': {
        today: 'Import Log is a short list of .imp-log-item lines. For a completed import it prints three ticks, one of which reads \'All rows processed\' over a stat line saying 124 / 125.',
        why: 'A reason without a line number cannot be fixed, because the person has to find the row in a file of thousands. The line number is the index into their own spreadsheet, so it comes first. The list has to survive thousands of rows, which rules out rendering them all.',
        anatomy: ['Filter input', 'Table: Line, Reason', 'Pager'],
        states: [['Loaded'], ['Filtered'], ['Filtered to nothing'], ['Loading a page']],
        copy: ['Filter by reason or line number', 'Line', 'Reason', '{a} to {b} of {n}'],
        rules: [
            'Line number is the line in the uploaded file, counting the header as line 1.',
            'One row per failed line, with all its reasons in one cell, not one row per reason.',
            'Paginate at 50 per page, or virtualise. Never render thousands of rows.',
            'The filter matches reason text and line number.',
            'Line numbers in monospace so they align.',
        ],
        done: 'Twenty thousand failed rows stay scrollable, filterable and legible.',
        data: 'Needs line number and the list of reasons per failed row.',
    },
    '8.3': {
        today: 'There is no download at all in the View Import window to put this beside. The footer has Close, plus Retry Import when the whole import failed.',
        why: 'The full download makes the user find the failures again in a file they already failed to import. A failed-only file is the one they will actually fix and re-upload.',
        anatomy: ['Second download button beside the existing one'],
        states: [['Nothing failed', 'Button not rendered.'], ['Some failed']],
        copy: ['Download all rows', 'Download failed rows'],
        rules: [
            'The failed file keeps the original header and column order, so it re-imports unchanged once fixed.',
            'Add a trailing reason column. It is ignored on re-import.',
            'Not rendered when nothing failed.',
        ],
        done: 'A failed-rows download can be corrected and re-uploaded without reshaping it.',
    },
    '8.4': {
        why: 'A line of text explaining that removals are not saved yet is read once and then never again, while the mistake it guards against happens at the end of the task when attention is lowest. A prompt fires only when something would actually be lost, so it costs nothing on an untouched window and catches the case that matters.',
        anatomy: ['Confirm window', 'Error block naming what would be lost', 'Keep editing', 'Discard'],
        states: [['Nothing changed', 'Cancel closes immediately, no prompt.'], ['Changes pending']],
        copy: ['Discard your changes?', 'You removed {n} forms and have not saved.', 'Closing now puts them back. Save first if you meant to remove them.', 'Keep editing', 'Discard'],
        rules: [
            'Only prompt when something would be lost. Never on an untouched window.',
            'Keep editing is the safe default and takes focus.',
            'Discard is the danger-styled action, and is not the default.',
            'Same prompt on the X and on Escape, not just on Cancel.',
        ],
        done: 'Closing the Mapping window with unsaved removals asks first; closing it untouched does not.',
    },

    /* ── HF-37 · Refunds ───────────────────────────────────────────── */
    '9.1': {
        today: 'The invoice status is open, paid or overdue. A refunded invoice keeps reading paid, and so does one whose refund failed.',
        why: 'The same invoice is read in five places by people who will compare notes: the list, the preview, two PDFs and the client\'s own page. If the wording differs anywhere, a client asking "why does mine say something else" costs more than the feature saved. One component, one vocabulary.',
        anatomy: ['Status pill, with dot'],
        states: [
            ['Refund pending', 'Cool tone. Nothing is wrong, the money is in flight.'],
            ['Refunded', 'Info tone. Complete.'],
            ['Refund failed', 'Danger tone, with Stripe\'s reason on hover and in the detail view.'],
        ],
        tokens: [['pending', '#EDE9FE bg, #5B21B6 text'], ['refunded', '#E8F6F8 bg, #0A6473 text'], ['failed', '#FEE2E2 bg, #B91C1C text']],
        copy: ['Refund pending', 'Refunded', 'Refund failed'],
        rules: [
            'Identical label and tone in list, preview, both PDFs and the Lobby.',
            'Pending is deliberately cooler than a warning: it is waiting, not wrong.',
            'Stripe\'s reason is never shown to a client. It is internal.',
            'In PDFs, render the pill as text with the same words, since colour alone may not print.',
        ],
        done: 'The three states read identically in all five places.',
        component: 'StatusPill',
        data: 'Needs refund status, date, amount and Stripe reason on the invoice.',
    },
    '9.2': {
        why: 'A refund changes what the client actually owes, so it belongs in the column of figures they are already reading. Put it in a separate block and the total and the truth disagree on the same page, which is the kind of thing that becomes a phone call.',
        anatomy: ['Total', 'Refund line, negative, dated', 'Balance'],
        states: [['Full refund', 'Balance 0.'], ['Partial refund', 'Balance is the remainder.'], ['Refund pending', 'Line shown, balance unchanged until it settles.']],
        copy: ['Total', 'Refunded {date}', 'Balance'],
        rules: [
            'Directly under the total, above the balance. Never a separate panel.',
            'Negative amount with a minus sign, in the danger colour.',
            'Date in the reader\'s locale format.',
            'A pending refund shows the line but does not move the balance.',
            'Identical ordering in the preview, both PDFs and the Lobby page.',
        ],
        done: 'Total, refund and balance read as one sum everywhere the invoice appears.',
    },
    '9.3': {
        today: 'The list\'s empty cell is .pay-empty reading \'No invoices found\', in the muted grey of a result, and it is what shows when the request failed.',
        why: 'Same failure as 5.4 and 12.1: a failed list and an empty one are the same shape, so a server fault reads as "no invoices" and nobody retries.',
        anatomy: ['Error block with Try again'],
        states: [['Couldn\'t load'], ['Empty']],
        copy: ['Invoices couldn\'t be loaded', 'Something went wrong at our end. Nothing has changed.', 'Try again', 'No invoices yet'],
        rules: ['"Nothing has changed" matters here specifically, because this is money.'],
        done: 'A failed invoice list is visibly different from an empty one.',
        component: 'StateBlock tone="error"',
    },
    '9.4': {
        why: 'The window looks identical whether it moves money or records a note, and the difference is the entire meaning of pressing the button. One sentence before the action removes the ambiguity.',
        anatomy: ['Notice at the top', 'Amount', 'Date'],
        states: [['Paid by hand', 'Notice shown.'], ['Paid through Stripe', 'No notice, different flow.']],
        copy: [
            'This invoice was paid by hand, so nothing is sent to Stripe.',
            'Recording a refund here notes a refund you have already made outside the portal. No money moves.',
        ],
        rules: [
            'Only on invoices paid by hand.',
            'Above the fields, not below. It changes what the fields mean.',
            'Empty tone. Nothing is wrong, it is a different kind of action.',
        ],
        done: 'Nobody can record a manual refund believing money moved.',
    },
    '9.5': {
        why: 'Removing the switch on a refusal is what produced the missing-card bug: the setting disappears and the user cannot tell a refusal from a feature that does not exist. Keeping the switch and putting Stripe\'s own words beneath it leaves them with something to act on.',
        anatomy: ['Stripe row with the switch, kept', 'Error block below carrying Stripe\'s reason', 'Try again'],
        states: [['Refused'], ['Enabled'], ['Not connected']],
        copy: ['Stripe could not enable online payment.', '{stripe reason}', 'Try again'],
        rules: [
            'The switch stays on screen and returns to its previous position.',
            'Stripe\'s message verbatim. Do not paraphrase a payment processor.',
            'Shown to Admins only. For a Manager this screen is locked under 1.5.',
        ],
        done: 'A Stripe refusal leaves the switch in place and shows Stripe\'s reason.',
    },

    /* ── HF-29 · Templates ─────────────────────────────────────────── */
    '10.1': {
        today: 'Child rows carry a hardcoded .vtm-subtask-badge reading Unassigned, with no control behind it. The parent\'s control is one select, \'Who can be assigned?\', holding Staff, Clients, Bots or Any, so there is no designation on either side yet. A designation on a child needs the parent select to carry one first.',
        why: 'Child tasks have no assignee control at all today, so they silently inherit and nobody can tell. Prefilling from the parent keeps the common case to zero clicks, and marking it as inherited is what stops it reading as a decision someone already made.',
        anatomy: ['Child task row', 'Assignee roles select', 'Inherited marker'],
        states: [
            ['Inherited', 'Parent value, "from parent" tag.'],
            ['Overridden', 'Own value, no tag.'],
            ['Parent changed while inherited', 'Child follows.'],
            ['Parent changed after override', 'Child does not follow.'],
        ],
        copy: ['from parent', 'Assignee roles'],
        rules: [
            'Inheritance is live until overridden, then it stops.',
            'Clearing an override returns the row to inheriting.',
            'The marker is a tag, not italics: it has to survive being skimmed.',
        ],
        done: 'Every child task has its own assignee roles, visibly inherited until changed.',
    },
    '10.2': {
        today: 'Post Message is a plain textarea with no mention support of any kind, so the picker and the token it inserts are both new.',
        why: 'Mentions are typed as codes today, which means knowing the codes. A picker turns that into choosing from what exists, and it is the only way designations get used at all, since nobody memorises them.',
        anatomy: ['Role select', 'Designation select', 'Insert'],
        states: [['Role chosen, any designation'], ['Role and designation chosen'], ['No designations for that role']],
        copy: ['Insert a mention', 'Any designation', 'Insert'],
        rules: [
            'Designations are filtered by the chosen role: staff designations for staff and custom roles, client designations for clients.',
            'Any designation inserts a role-only mention.',
            'Inserts at the cursor, not at the end.',
        ],
        done: 'A mention can be inserted without knowing any codes.',
    },
    '10.3': {
        why: 'The preview exists so an author can read what the client will read. Showing a raw code breaks exactly that, and it is the only moment the author could have caught a wrong mention.',
        anatomy: ['Preview block', 'Mentions rendered as bracketed name placeholders'],
        states: [['Resolvable', 'Shows the kind of name that will appear.'], ['Unresolvable on this case', 'Shows the placeholder with a note.']],
        copy: ['[client\'s name]', '[lead attorney\'s name]'],
        rules: [
            'Never show the raw code in the preview.',
            'The placeholder describes who, not the code.',
            'In the editor the mention stays a chip, so it is still obviously a token.',
        ],
        done: 'A preview reads as a sentence, with no codes in it.',
    },

    /* ── HF-64 · Designations ──────────────────────────────────────── */
    '11.1': {
        today: 'The rail already shows the designation and calls it the role. .crp-member-role holds Lead Attorney, Case Manager, Paralegal. So this item adds the role, not the designation, and two people with different roles and the same designation currently read identically.',
        why: 'A designation is a job title inside a role, so it is always shown attached to the role: Lead Attorney alone does not say what the person can do, and Staff alone does not say what they are called. People who cannot change it get plain text rather than a disabled button, because a rail of disabled buttons reads as a broken screen.',
        anatomy: ['Role, semibold', 'Middle dot', 'Designation, regular', 'Caret, only when editable'],
        states: [
            ['Editable', 'Button, caret, hover background.'],
            ['Read only', 'Plain text, no caret, no hover.'],
            ['No designation', 'Italic placeholder.'],
            ['Saving', 'Optimistic, revert on failure.'],
        ],
        tokens: [['role', '13.5px, 600'], ['designation', '13.5px, 400, #475569'], ['separator', '#CBD5E1'], ['hover', '#F8FAFC bg, #CBD5E1 border'], ['button padding', '3px 7px 3px 8px, negative margin to keep alignment']],
        copy: ['No designation'],
        rules: [
            'Never render a disabled button for the read-only case.',
            'Whether it is editable is a capability, not a tier. Do not infer it from Admin.',
            'Truncate the designation, never the role.',
            'The accessible name states the current value and that it can be changed.',
        ],
        done: 'Role and designation always appear together, and only people who may change it get a control.',
        component: 'DesignationLabel',
    },
    '11.2': {
        why: 'The rail becomes a full-width list on a phone, so the pair has room to sit under the name instead of competing with it.',
        anatomy: ['Avatar', 'Name', 'Role · Designation underneath'],
        states: [['Editable'], ['Read only']],
        rules: ['Tap target at least 32px tall when editable.', 'The pair wraps under the name rather than truncating.'],
        done: 'Your Team on a phone shows the designation without truncation.',
    },
    '11.3': {
        why: 'Only the designations that belong to this person\'s role on this case are offered. Showing all of them invites a choice the API will reject, since the field is staff_designation or client_designation depending on the role.',
        anatomy: ['Person and role line', 'Designation select', 'Save', 'Cancel'],
        states: [['Open'], ['Saving'], ['Refused', 'Error block, window stays open.']],
        copy: ['Change designation', '{name} · {role} on this case', 'Designation', 'Staff designations. A client on this case would see the client list instead.'],
        rules: [
            'Options follow the role: staff designations for staff and any custom role, client designations for clients.',
            'Default is Primary.',
            'Save is disabled until the value differs.',
            'Sends staff_designation or client_designation, never both.',
        ],
        done: 'The window offers only the designations the role allows and defaults to Primary.',
    },
    '11.4': {
        today: 'Assigned Users is a .ccm-users-head list inside Edit Case running ID, Name, Email, Role, remove, with Role as a .ccm-role-select. Designation goes after that select.',
        why: 'Between Role and Action because it qualifies the role and the eye reads left to right: who, as what, as what exactly, then what you can do about it.',
        anatomy: ['Member', 'Role', 'Designation select', 'Action'],
        states: [['Staff row', 'Staff designations.'], ['Client row', 'Client designations.'], ['Custom role row', 'Staff designations.']],
        rules: [
            'Column sits between Role and Action, not at the end.',
            'Options re-filter when the role on that row changes.',
            'Changing the role resets the designation to Primary.',
        ],
        done: 'Every member row carries a designation that matches its role.',
    },
    '11.5': {
        today: 'Assign Users is a row that opens inside Edit Case, not a window of its own. It already has a Role select in .ccm-assign-role-field.',
        why: 'Same field, same rules, same place in the order. Assign Users and Edit Case produce the same record, so a difference between them is a bug waiting to be reported.',
        anatomy: ['Role select', 'Designation select beside it'],
        states: [['Default, Primary'], ['Role changed', 'Designation resets.']],
        rules: ['Identical option logic to 11.4.', 'Also applies to Automations → Assign Cases, which picks a role and now needs a designation too.'],
        done: 'Assign Users sets a designation with the same behaviour as Edit Case.',
    },

    /* ── HF-47 · Lobby ─────────────────────────────────────────────── */
    '12.1': {
        why: 'Six sections each failing in their own way, all currently rendering the empty message, means a client whose cases failed to load is told they have no cases. One component removes the whole class of bug and makes every section retry the same way.',
        anatomy: ['Error block with the section named', 'Try again'],
        states: [['Failed'], ['Empty'], ['Loading']],
        copy: ['Your cases couldn\'t be loaded.', 'Your inquiries couldn\'t be loaded.', 'Try again'],
        rules: [
            'One component, parameterised by section name. Not six copies.',
            'Try again refetches that section only, never the page.',
            'Sections fail independently. One failure never blanks the others.',
            'Error tone, never the empty tone.',
        ],
        done: 'No failed Lobby section can be mistaken for an empty one, and each retries alone.',
        component: 'StateBlock tone="error"',
        note: 'The ticket says six sections. This codebase has four: Cases, Announcements, Inquiries, Locations. The other two need naming.',
    },
    '12.2': {
        today: 'The counts are on the Open and Closed pills as .lobby-tab-count, not in the section header. A section that failed shows .lobby-empty-msg, the same sentence a section with nothing in it shows.',
        why: 'A zero is a fact. Showing it when the fetch failed states a fact nobody checked, and it is the number a client is most likely to repeat back to the firm.',
        anatomy: ['Section title', 'Count, or a dash'],
        states: [['Loaded', 'Count.'], ['Failed', 'Dash.'], ['Loading', 'Dash.'], ['Genuinely zero', 'Shows 0.']],
        tokens: [['count', '#F1F5F9 pill, #475569'], ['dash', '#CBD5E1, no pill']],
        rules: ['Dash, not blank: blank looks like a rendering fault.', 'A real zero still shows 0. The dash means unknown, not none.'],
        done: 'A count is only shown when it was actually fetched.',
    },
    '12.3': {
        why: 'The person is signed in, just not into this portal, and the two ways out are genuinely different: join with this account, or switch account. Naming the address they are signed in with is what lets them tell which situation they are in, since most people have more than one.',
        anatomy: ['Empty state naming the signed-in address', 'Join as a client', 'Use another account'],
        states: [['Not a member'], ['Join pending', 'Different sentence, no join button.'], ['Join refused']],
        copy: [
            'You\'re signed in as {email}, which isn\'t a member of this portal yet.',
            'Join as a client to see your cases here, or sign in with the account the firm invited.',
            'Join as a client',
            'Use another account',
        ],
        rules: [
            'The address is shown in full, never truncated. It is the thing being checked.',
            'Join as a client is primary; Use another account is secondary but not hidden.',
            'Based on the existing disabled-account window so the two feel like siblings.',
            'Empty tone. Nothing failed, they are just not a member yet.',
        ],
        done: 'A signed-in non-member can tell which account they are using and has both ways forward.',
    },
};
