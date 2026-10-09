/* The shared status vocabulary, kept out of the component file so fast
   refresh stays happy and so a status can be referenced without importing
   the pill. A status is a claim the viewer has to act on, so the tone is
   chosen by what it asks of them, not by how it sounds. */

export const STATUS = {
    // existing, carried over so screens can migrate onto this component
    active:          { label: 'Active',           tone: 'success' },
    closed:          { label: 'Closed',           tone: 'neutral' },
    draft:           { label: 'Draft',            tone: 'neutral' },
    ready:           { label: 'Ready',            tone: 'success' },
    open:            { label: 'Open',             tone: 'info'    },
    paid:            { label: 'Paid',             tone: 'success' },
    processing:      { label: 'Processing',       tone: 'pending' },
    failed:          { label: 'Failed',           tone: 'danger'  },

    // ticket 9 — refunds
    refundPending:   { label: 'Refund pending',   tone: 'pending' },
    refunded:        { label: 'Refunded',         tone: 'info'    },
    refundFailed:    { label: 'Refund failed',    tone: 'danger'  },

    // ticket 4 — e-sign templates with no document attached
    needsDocument:   { label: 'Needs a document', tone: 'warning' },

    // ticket 6 — a hub whose access was taken away
    accessRemoved:   { label: 'Access removed',   tone: 'danger'  },
};
