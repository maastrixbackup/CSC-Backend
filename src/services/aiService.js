const openai = require('../config/openai');
const { checkGuardrails, prompts } = require('../utils/guardrails');

const {
  TEMPLATE_ROUTER,
  PROMPT_VERSION,
  POLICY_MODE
} = require('../config/templateRouter');
// const { enforceGuardrails } = require('../middleware/guardrails');

exports.runAI = async ({
  audience,
  vendorType = 'default',
  templatePack,
  jurisdiction = 'Alabama'
}) => {

    const ALLOWED_VENDOR_TYPES = [
        'water_mitigation',
        'mold_remediation',
        'fire_smoke',
        'biohazard',
        'asbestos_abatement',
        'applied_structural_drying',
        'general_contractor'
    ];

    const SAFE_VENDOR_FALLBACK = 'general_contractor';

    const resolvedVendorType =
    ALLOWED_VENDOR_TYPES.includes(vendorType)
        ? vendorType
        : SAFE_VENDOR_FALLBACK;

        const audienceNode = TEMPLATE_ROUTER[audience];
  if (!audienceNode) {
    throw new Error('Invalid audience');
  }

  const vendorNode =
    audienceNode[resolvedVendorType] || audienceNode.default;

    const template = vendorNode?.[templatePack];

  if (!template) {
    throw new Error('Invalid or unapproved template selection');
  }
  //Resolve template safely
//   const template =
//     TEMPLATE_ROUTER?.[audience]?.[vendorType]?.[templatePack] ||
//     TEMPLATE_ROUTER?.[audience]?.default?.[templatePack];

//   if (!template) {
//     throw new Error('Invalid or unapproved template selection');
//   }

  //Guardrail enforcement (pre-call)
//   enforceGuardrails(template.system_prompt);

  //OpenAI call (model LOCKED)
  const response = await openai.responses.create({
    model: 'gpt-5.2',
    input: template.system_prompt
  });

  const output =
    response.output_text ||
    response.output?.[0]?.content?.[0]?.text ||
    '';

  //Classify output
  const isRefusal = output.toLowerCase().includes('cannot assist');

  return {
    output,
    meta: {
      prompt_id: template.prompt_id,
      prompt_version: PROMPT_VERSION,
      track: template.track,
      policy_mode: POLICY_MODE,
      model_identifier: 'gpt-5.2',
      output_classification: isRefusal ? 'refusal' : 'draft',
      refusal_flag: isRefusal,
      track_identifier: template.track,
      audience,
      vendor_type: resolvedVendorType,
      template_pack: templatePack,
      guardrail_version: 'GR-P1-v1',
      policy_mode: POLICY_MODE,
      export_intent:
      audience === 'vendor_contractor'
      ? 'vendor_only'
      : 'property_owner_only',
    }
  };
};

// // Phase 1 explicitly disallowed prompt IDs
// const DISALLOWED_PROMPT_IDS = new Set([
//     'P1-006',
//     'P1-007',
//     'P1-015'
// ]);

// exports.generateDraft = async (promptId) => {
//     // const promptConfig = prompts[promptId];
//     const promptConfig = prompts.PROMPTS[promptId];
//     if (!promptConfig) {
//         throw new Error('Invalid or unapproved prompt ID');
//     }
//     const promptText = promptConfig.text;

//     if (DISALLOWED_PROMPT_IDS.has(promptId)) {
//         return {
//             refusal: true,
//             reason: 'Prompt is disallowed under CSC Phase 1 rules',
//             tool: promptConfig.tool
//         };
//     }
    

//     // if (checkGuardrails(promptText)) {
//     //     const err = new Error('Disallowed content detected by guardrails');
//     //     err.code = 'GUARDRAIL_BLOCKED';
//     //     throw err;
//     // }

//     // const isBlocked = checkGuardrails(prompt);
//     // if (isBlocked) {
//     //     const error = new Error('Disallowed request: negotiation or representation detected');
//     //     error.code = 'GUARDRAIL_BLOCKED';
//     //     throw error;
//     // }

//     const response = await openai.responses.create({
//         model: 'gpt-5.2',
//         // model: 'gpt-4o-mini',
//         input: promptText
//     });

//     // const output = response.output_text;
//     const output =
//         response.output_text ||
//         response.output?.[0]?.content?.[0]?.text ||
//         '';
//     // return response.output_text;
//     return {
//         refusal: false,
//         output,
//         tool: promptConfig.tool
//         // prompt_version: VERSION
//     };
// };



