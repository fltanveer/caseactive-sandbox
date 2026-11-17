/* Build notes for HB-1, keyed by item id. Same fields as ../specs.js. */

export const HB_SPECS = {
    '21.1': {
        why: 'The website is the one thing that brands the hub, so it comes first, already filled in from the work email, with a way out for firms that have none.',
        anatomy: ['Firm website: globe icon, the guessed domain, a spinner while looking and a tick when found', 'Hint on the left, "We don\'t have a website" on the right', 'Firm name, with "Filled in from {site}" once filled', 'Your team size and Launch my Hub, unchanged'],
        copy: ['Firm website', 'yourfirm.com', 'We\'ll use it to set up your logo and colours', 'We don\'t have a website', 'Enter a website like johnsonlaw.com', 'No website — your Hub will use the default look.', 'Add a website', 'Firm name', 'e.g. Johnson & Associates', 'We\'ll fill this in from your website — or type it now.', 'Filled in from johnsonlaw.com', 'Launch my Hub', 'Creating your Hub…'],
        rules: [
            'Accepts johnsonlaw.com, www.johnsonlaw.com and https://johnsonlaw.com/about; on blur it is tidied to johnsonlaw.com.',
            'Anything without a dot and an ending (.com, .law, .co.uk…) shows the error, after the field is left.',
            'Firm name is filled from the site only while it is empty or still holds a name we filled. A name the person typed is never overwritten.',
            'A name we filled is cleared when the website changes, and filled again if the new site has one.',
            'We don\'t have a website swaps the field for the note; Add a website brings it back and runs the lookup again.',
        ],
        done: 'The field is first, accepts a bare domain, and every state has its line.',
    },
    '21.2': {
        why: 'Seeing the hub as clients will see it is what makes a wrong logo or unreadable colour obvious before launch, not after.',
        anatomy: ['Heading "Here\'s your Hub" and "This is what your clients see when they log in."', 'Preview: browser tab with favicon and "{firm} · Client Hub"; header in the hub\'s own white with the logo box (200 × 40) and avatar; Cases with Open and Closed, and the lobby\'s case card (title, Updated yesterday, members, Demand sent tab, accent corner)', 'Status card: icon, title, one or two lines, actions, and for a found brand the colour swatch with "{hex} brand colour · white/black text on it, picked for contrast"'],
        states: [
            ['Looking up', 'Favicon, logo and links shimmer; the accent is grey until the colour is known.'],
            ['Found', 'Logo and favicon applied, brand colour on the accent. Change logo · Use default look.'],
            ['Nothing found', 'Default look. Upload logo.'],
            ['Couldn\'t reach the site', 'Default look. Upload logo.'],
            ['Logo too small', 'Default look, with the reason. Upload logo.'],
            ['Default look chosen', 'Default look. Use {site} branding.'],
            ['No website', 'Default look. Upload logo.'],
            ['No website guessed', '"Add your website to see your Hub"; the preview shows the default look.'],
        ],
        copy: ['Here\'s your Hub', 'This is what your clients see when they log in.', 'Looking up johnsonlaw.com…', 'Finding your logo and colours. This usually takes a few seconds.', 'Found your logo and colours', 'From johnsonlaw.com. Change them now, or fine-tune later in Design Settings.', 'We couldn\'t find a logo on johnsonlaw.com', 'Your Hub will start with the default look. Upload your logo now, or add it later in Design Settings.', 'We couldn\'t reach johnsonlaw.com', 'Check the address, or carry on. Your Hub will start with the default look.', 'The logo on johnsonlaw.com is too small', 'It wouldn\'t look sharp in your Hub, so we\'ll use the default look. Upload a larger logo now, or add one later in Design Settings.', 'Using the default look', 'Add your logo and colours any time in Design Settings.', 'Use johnsonlaw.com branding', 'No website? No problem.', 'Add your website to see your Hub', 'We\'ll show it here with your logo and colours.'],
        rules: ['Default look: white header with the firm\'s name as text, the CaseActive favicon, the teal (#149EB1) accent.',
            'The header banner never takes the brand colour (Welby, 17 Nov); the logo and favicon change, and the brand colour becomes the hub\'s accent: the Open tab and the case card\'s corner, with black or white text on it.',
            'A found logo that is white or very light would vanish on the white header: the lookup should prefer the site\'s dark logo, and the preview makes a light one obvious so it can be changed.', 'Text colour is picked automatically, black or white, whichever reads better on the background.', 'Use default look keeps the found branding in memory, so it can come back without another lookup.'],
        tokens: [['panel', 'light CaseActive gradient, 165deg #E8F7F9 → #EEF5FD → #F2F1FD, dark text'], ['preview', '#fff card, 12px radius, header 58px (50px on phones)'], ['status card', '#fff, 1px #DCE7EE, 12px radius; error 1px #FECACA']],
        done: 'All states render on computer and phone, and a wide and a square logo both look right.',
    },
    '21.3': {
        why: 'A plain picker is enough because the header scales any logo into its box: nothing needs cropping to fit. Cropping stays in Design Settings for anyone who wants it.',
        states: [['Uploading', 'Spinner and the check it is running.'], ['Uploaded', 'The new logo in the preview; colours from the site, or the default ones.'], ['Too small', 'Refused with its size; the current logo stays.'], ['Wrong type', 'Refused.'], ['Too large', 'Refused.']],
        copy: ['Change logo', 'Upload logo', 'Use default look', 'Choose another file', 'Uploading your logo…', 'Checking it will look sharp in your Hub\'s header.', 'Using your uploaded logo', 'Colours still come from johnsonlaw.com. Crop or resize it later in Design Settings.', 'Your Hub keeps the default colours. Change them any time in Design Settings.', 'That logo is too small', 'It\'s 48 × 48 px. Logos need to be at least 64 px tall (or 320 px wide if they\'re very wide) to look sharp. We kept your current logo.', 'That file type isn\'t supported', 'Use a PNG, JPG, SVG or WebP file.', 'That file is too large', 'Logos can be up to 5 MB. Try a smaller file.'],
        rules: ['Decision: plain file picker, no cropper.', 'Accepts PNG, JPG, SVG or WebP up to 5 MB, with the same size rule as the lookup (21.8).', 'Upload logo on the nothing-found states opens the same picker.'],
        done: 'A real file goes through the check and each result has its state.',
    },
    '21.4': {
        why: 'Starting the lookup early means it is usually finished by the time the person sees the screen, so nobody waits on it.',
        rules: [
            'The website comes from the work email: jane@johnsonlaw.com gives johnsonlaw.com. gmail.com, outlook.com, yahoo.com, icloud.com, hotmail.com and aol.com give nothing.',
            'The lookup starts in the background on the name step; the create-hub step usually opens on found.',
            'Editing the website runs it again 600 ms after typing stops, and the preview goes back to looking.',
            'Launch my Hub is never blocked. Pressed while looking, it reads "Creating your Hub…" for up to 5 seconds, then the hub is created with the default look.',
            'Logo, favicon, firm name and both colours are saved to Settings → General → Design Settings, where they are changed later.',
        ],
        done: 'The lookup never makes anyone wait, and nothing typed by the person is overwritten.',
    },
    '21.5': {
        rules: ['Below 640 px the left panel is hidden, as the signup has no room for it.', '"Your Hub preview" and the status card sit between the website field and Firm name.', 'The hub in it uses its phone header: logo box 160 × 32, a menu instead of the links, no stage names.'],
        copy: ['Your Hub preview'],
        done: 'The result appears right under the field it came from on a phone.',
    },
    '21.6': {
        today: 'The left panel says "You\'re all set!" with a checklist, and the third card reads Customize Hub · Add your firm\'s logo & colors.',
        anatomy: ['Left: "Live now" chip, "Your Hub is live", "Here\'s what your clients see when they log in.", the hub preview', 'Right: unchanged (Hub launched, Go to dashboard, Invite first client), with the third card reworded'],
        copy: ['Live now', 'Your Hub is live', 'Here\'s what your clients see when they log in.', 'Adjust your branding', 'Fine-tune your logo and colours in Design Settings', 'Add your branding', 'Add your logo and colours in Design Settings'],
        rules: ['Branded hub: Adjust your branding. Default look: Add your branding.', 'On a phone the panel stacks above the right side.', 'For Welby: the checklist (Hub ready, Role configured, Practice areas saved) gives way to the preview.'],
        done: 'The done screen shows the hub that just went live and the card matches its look.',
    },
    '21.7': {
        why: 'The window is a short form; a one-line result with a thumbnail says what was found without making it a second preview screen.',
        anatomy: ['Your Company Website first, Optional, empty, with its hint', 'The result line: thumbnail of the logo on white (as in the header), title, colours line with the brand colour swatch, actions', 'Your Company Name (filled from the site), Your Company Industry', 'Tabs and footer as today'],
        copy: ['Create a Hub', 'Set up another Hub — for a new office, or a demo for a prospect.', 'Your Company Website', 'Optional', 'theirfirm.com', 'We\'ll use it to set up the logo and colours. Leave it empty for the default look.', 'Enter a website like riveralaw.com', 'Looking up riveralaw.com…', 'Finding the logo and colours.', 'Logo found', 'Colours from riveralaw.com', 'Change', 'Use default', 'Uploading logo…', 'Checking it will look sharp.', 'Using your uploaded logo', 'Default colours', 'Nothing found on riveralaw.com', 'Couldn\'t reach riveralaw.com', 'The logo on riveralaw.com is too small', 'The Hub will use the default look.', 'Upload logo', 'Using the default look', 'Branding can be added later in Design Settings.', 'Use riveralaw.com branding', 'That logo is too small', 'It\'s 48 × 48 px. Use one at least 64 px tall.', 'Filled in from riveralaw.com'],
        rules: ['Decision: the "Logo found" line with a thumbnail, not the full preview.', 'Same lookup as signup, but nothing is guessed: the person is logged in and often making a demo hub for someone else.', 'Empty means the default look.'],
        done: 'Every lookup and upload state fits on one line in the window, on computer and phone.',
    },
    '21.8': {
        why: 'The header shows the logo at up to 40 px tall (32 px on phones). High-density screens draw that with 80 device pixels, so below 64 px the stretching starts to blur; 80 px and up is fully sharp.',
        rules: [
            'At least 64 px tall. For logos wider than 5:1, at least 320 px wide instead. SVG always passes.',
            'Favicon: at least 32 × 32 px, or the default favicon is used.',
            'Found logos that are smaller are rejected and the default look is used. Uploads that are smaller are refused with an error.',
            'Fit rule: scale the logo down until it fits the box, keep its shape, align it left. Never crop, never stretch. Trim empty or transparent margins before measuring.',
        ],
        tokens: [['desktop logo box', '200 × 40 px'], ['phone logo box', '160 × 32 px']],
        done: 'The rule is applied the same way to found and uploaded logos.',
    },
    '21.9': {
        rules: ['Every line of copy is listed in its item\'s notes: 21.1 field, 21.2 preview, 21.3 Change logo, 21.5 phone, 21.6 done, 21.7 window.', '"Design Settings" is the card\'s name in Settings → General.'],
        done: 'No state is left without its words.',
    },
};
