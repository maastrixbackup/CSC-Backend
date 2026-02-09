const PROMPT_VERSION = 'P1-PROMPTS-v2-20260207';
const POLICY_MODE = 'documentation_readiness_only';

const SHARED_MITIGATION_TEMPLATES = {
    daily_log: {
        prompt_id: 'P1-016',
        track: 'Track 1',
        system_prompt: `
Draft a draft-only daily documentation log for a mitigation contractor.
Include date, crew, activities performed, equipment in use, and observations.
Documentation readiness only. No negotiation, no insurer-facing language.
`
    },

    equipment_log: {
        prompt_id: 'P1-016',
        track: 'Track 1',
        system_prompt: `
Draft an equipment log for mitigation documentation readiness.
Include equipment type, serial number, location, runtime, and dates.
No negotiation or carrier-facing language.
`
    },

    moisture_reading_log: {
        prompt_id: 'P1-016',
        track: 'Track 1',
        system_prompt: `
Draft a moisture reading log template documenting readings by area,
material type, date, and instrument used.
Documentation readiness only.
`
    },

    work_completed_summary: {
        prompt_id: 'P1-017',
        track: 'Track 1',
        system_prompt: `
Draft a neutral documentation-only summary of mitigation work performed.
Do not demand payment or interpret coverage.
`
    },

    materials_invoice_tracker: {
        prompt_id: 'P1-022',
        track: 'Track 1',
        system_prompt: `
Draft a materials and invoice tracking template for documentation readiness.
List materials, quantities, dates, and invoice references.
`
    }
};

const TEMPLATE_ROUTER = {

    // TRACK 3 — Disaster Documentation Readiness + FEMA IA/PA
    // Audience: Property Owner / Internal CSC
    property_owner: {
        default: {

            documentation_readiness_summary: {
                prompt_id: 'P1-001',
                track: 'Track 3',
                system_prompt: `
                    Draft an educational explanation of what “documentation readiness” means for a property insurance claim file.
                    Keep the language consulting-only and draft-only.
                `
            },

            fema_ia_overview: {
                prompt_id: 'P1-002',
                track: 'Track 3',
                system_prompt: `
                    Create a draft educational overview explaining FEMA Individual Assistance (IA) documentation categories in plain language.
                    No advocacy or negotiation.
                `
            },

            fema_pa_overview: {
                prompt_id: 'P1-003',
                track: 'Track 3',
                system_prompt: `
                    Create a draft educational overview explaining FEMA Public Assistance (PA) documentation requirements at a high level.
                `
            },

            scope_review_checklist: {
                prompt_id: 'P1-004',
                track: 'Track 3',
                system_prompt: `
                    Draft a checklist of documents a property owner should gather before a scope review,
                    framed as documentation consulting (not negotiation or representation).
                `
            },

            document_request_list: {
                prompt_id: 'P1-005',
                track: 'Track 3',
                system_prompt: `
                    Draft a neutral, professional document request list for a client preparing an insurance documentation file.
                    Do not include demands or outcome promises.
                `
            },

            documentation_status_email: {
                prompt_id: 'P1-008',
                track: 'Track 3',
                system_prompt: `
                    Draft a neutral email asking the insurer for a status update on documentation receipt,
                    without advocacy or negotiation language.
                `
            },

            internal_file_summary: {
                prompt_id: 'P1-009',
                track: 'Track 3',
                system_prompt: `
                    Create a draft internal summary of what documents have been received and what is missing,
                    using a structured bullet format.
                `
            },

            photos_receipts_checklist: {
                prompt_id: 'P1-010',
                track: 'Track 3',
                system_prompt: `
                    Create a checklist explaining how to organize photos, receipts, and invoices
                    for disaster-related documentation.
                `
            },

            client_education_mistakes: {
                prompt_id: 'P1-011',
                track: 'Track 3',
                system_prompt: `
                    Draft a short educational note listing common mistakes people make
                    when assembling insurance documentation after a loss.
                `
            },

            documentation_timeline: {
                prompt_id: 'P1-012',
                track: 'Track 3',
                system_prompt: `
                    Create a draft timeline template for tracking documentation milestones
                    (inspection date, photo log, receipts, communications),
                    without legal or negotiation framing.
                `
            }
        }
    },


    // TRACK 1 — Contractor Documentation Support
    // Audience: Vendor / Contractor
    vendor_contractor: {

        default: {},

        water_mitigation: SHARED_MITIGATION_TEMPLATES,

        mold_remediation: SHARED_MITIGATION_TEMPLATES,

        fire_smoke: SHARED_MITIGATION_TEMPLATES,

        biohazard: SHARED_MITIGATION_TEMPLATES,

        applied_structural_drying: SHARED_MITIGATION_TEMPLATES,

        general_contractor: {
            daily_log: {
                prompt_id: 'P1-016',
                track: 'Track 1',
                system_prompt: `
Draft a daily job documentation log for a general contractor.
Include date, work performed, subcontractors, and site observations.
Documentation readiness only.
`
            },

            scope_checklist_gc: {
                prompt_id: 'P1-016',
                track: 'Track 1',
                system_prompt: `
Draft a scope documentation checklist for a general contractor.
List work categories, notes, and supporting documentation.
No pricing advocacy or insurer-facing language.
`
            },

            change_order_log: {
                prompt_id: 'P1-021',
                track: 'Track 1',
                system_prompt: `
Draft a project-side change order log for internal documentation.
Include date, description, reason, and reference number.
No carrier communication language.
`
            },

            materials_invoice_tracker: {
                prompt_id: 'P1-022',
                track: 'Track 1',
                system_prompt: `
Draft a materials and invoice tracking template for a general contractor.
Documentation readiness only.
`
            }
        },

        asbestos_abatement: {
            daily_log: {
                prompt_id: 'P1-016',
                track: 'Track 1',
                system_prompt: `
Draft a documentation-only daily activity log for asbestos abatement work.
Use neutral, factual language only.
Do NOT reference health claims, liability, clearance guarantees,
regulatory interpretation, or insurer obligations.
`
            },

            work_completed_summary: {
                prompt_id: 'P1-017',
                track: 'Track 1',
                system_prompt: `
Draft a strictly factual summary of asbestos abatement activities completed.
No health conclusions, no compliance assertions, no carrier-facing language.
`
            }
        }
    },

    // TRACK 2 — Real Estate / REO Documentation Readiness
    // Audience: Internal CSC / Property Managers
    internal_csc: {
        default: {

            reo_documentation_checklist: {
                prompt_id: 'P1-018',
                track: 'Track 2',
                system_prompt: `
                    Draft a documentation readiness checklist for an REO property file
                    (photos, inspection notes, repair records, vendor bids, condition summaries).
                `
            },

            investor_property_summary: {
                prompt_id: 'P1-019',
                track: 'Track 2',
                system_prompt: `
                    Draft a structured summary template for a property condition documentation file
                    for an investor or property manager.
                `
            },

            condition_documentation_timeline: {
                prompt_id: 'P1-023',
                track: 'Track 2',
                system_prompt: `
                    Create a timeline template for tracking condition documentation milestones
                    for a property file (inspection, vendor bids, repairs, photos).
                `
            },

            vendor_bid_comparison: {
                prompt_id: 'P1-024',
                track: 'Track 2',
                system_prompt: `
                    Draft a neutral comparison summary template for multiple vendor bids
                    (scope items, exclusions, notes),
                    without recommending a contractor or giving legal advice.
                `
            }
        }
    }
};

module.exports = {
    TEMPLATE_ROUTER,
    PROMPT_VERSION,
    POLICY_MODE
};