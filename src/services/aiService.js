const openai = require('../config/openai');
const { checkGuardrails } = require('../utils/guardrails');

const {
  TEMPLATE_ROUTER,
  PROMPT_PACK_VERSION
} = require('../config/templateRouter');

const MODEL_IDENTIFIER = 'gpt-5.2';
const GUARDRAIL_VERSION = 'GR-P1-v1';
const POLICY_MODE = 'documentation_readiness_only';

exports.runAI = async ({
  track_identifier,
  prompt_id
}) => {

  // ENFORCE REQUIRED SELECTORS
  if (!track_identifier || !prompt_id) {
    throw new Error('TRACK_AND_PROMPT_ID_REQUIRED');
  }

  const trackNode = TEMPLATE_ROUTER[track_identifier];
  if (!trackNode) {
    throw new Error('INVALID_TRACK');
  }

  const promptConfig = trackNode.prompts[prompt_id];
  if (!promptConfig) {
    throw new Error('UNAPPROVED_PROMPT_ID');
  }

  // PRE-CALL GUARDRAIL (PROMPT-ID ONLY)
  const guardrailResult = checkGuardrails({ prompt_id });

  if (guardrailResult.refused) {
    return {
      output: guardrailResult.safe_response,
      meta: {
        track_identifier,
        prompt_id,
        prompt_version: PROMPT_PACK_VERSION,
        model_identifier: MODEL_IDENTIFIER,
        guardrail_version: GUARDRAIL_VERSION,
        policy_mode: POLICY_MODE,
        output_classification: 'refusal',
        refusal_flag: true,
        refusal_reason_code: guardrailResult.refusal_reason_code
      }
    };
  }

  // OPENAI CALL (MODEL LOCKED)
  const response = await openai.responses.create({
    model: MODEL_IDENTIFIER,
    input: promptConfig.system_prompt
  });

  const output =
    response.output_text ||
    response.output?.[0]?.content?.[0]?.text ||
    '';

  return {
    output,
    meta: {
      track_identifier,
      prompt_id,
      prompt_version: PROMPT_PACK_VERSION,
      model_identifier: MODEL_IDENTIFIER,
      guardrail_version: GUARDRAIL_VERSION,
      policy_mode: POLICY_MODE,
      output_classification: 'draft',
      refusal_flag: false,
      refusal_reason_code: null
    }
  };
};



// const openai = require('../config/openai');
// const { checkGuardrails, prompts } = require('../utils/guardrails');

// const {
//   TEMPLATE_ROUTER,
//   PROMPT_VERSION,
//   POLICY_MODE
// } = require('../config/templateRouter');
// // const { enforceGuardrails } = require('../middleware/guardrails');

// exports.runAI = async ({
//   audience,
//   vendorType = 'default',
//   templatePack,
//   jurisdiction = 'Alabama'
// }) => {

//     const ALLOWED_VENDOR_TYPES = [
//         'water_mitigation',
//         'mold_remediation',
//         'fire_smoke',
//         'biohazard',
//         'asbestos_abatement',
//         'applied_structural_drying',
//         'general_contractor'
//     ];

//     const SAFE_VENDOR_FALLBACK = 'general_contractor';

//     const resolvedVendorType =
//     ALLOWED_VENDOR_TYPES.includes(vendorType)
//         ? vendorType
//         : SAFE_VENDOR_FALLBACK;

//         const audienceNode = TEMPLATE_ROUTER[audience];
//   if (!audienceNode) {
//     throw new Error('Invalid audience');
//   }

//   const vendorNode =
//     audienceNode[resolvedVendorType] || audienceNode.default;

//     const template = vendorNode?.[templatePack];

//   if (!template) {
//     throw new Error('Invalid or unapproved template selection');
//   }

//   //Guardrail enforcement (pre-call)
// //   enforceGuardrails(template.system_prompt);

//   //OpenAI call (model LOCKED)
//   const response = await openai.responses.create({
//     model: 'gpt-5.2',
//     input: template.system_prompt
//   });

//   const output =
//     response.output_text ||
//     response.output?.[0]?.content?.[0]?.text ||
//     '';

//   //Classify output
//   const isRefusal = output.toLowerCase().includes('cannot assist');

//   return {
//     output,
//     meta: {
//       prompt_id: template.prompt_id,
//       prompt_version: PROMPT_VERSION,
//       track: template.track,
//       policy_mode: POLICY_MODE,
//       model_identifier: 'gpt-5.2',
//       output_classification: isRefusal ? 'refusal' : 'draft',
//       refusal_flag: isRefusal,
//       track_identifier: template.track,
//       audience,
//       vendor_type: resolvedVendorType,
//       template_pack: templatePack,
//       guardrail_version: 'GR-P1-v1',
//       policy_mode: POLICY_MODE,
//       export_intent:
//       audience === 'vendor_contractor'
//       ? 'vendor_only'
//       : 'property_owner_only',
//     }
//   };
// };