const aiService = require('../services/aiService');
const logService = require('../services/logService');

exports.run = async (req, res) => {

    const {
        track_identifier,
        prompt_id
    } = req.body;

    try {
        const result = await aiService.runAI({
            track_identifier,
            prompt_id
        });

        // LOG SUCCESS OR REFUSAL
        await logService.logAI({
            user_id: req.user.id,
            track_identifier,
            prompt_id: result.meta.prompt_id,
            prompt_version: result.meta.prompt_version,
            model_identifier: result.meta.model_identifier,
            output_classification: result.meta.output_classification,
            refusal_flag: result.meta.refusal_flag,
            refusal_reason_code: result.meta.refusal_reason_code,
            guardrail_version: result.meta.guardrail_version,
            policy_mode: result.meta.policy_mode,
            output: result.output,
            status: result.meta.refusal_flag ? 'blocked' : 'success'
        });

        return res.json({
            success: true,
            draft: result.output,
            // meta: result.meta
        });

    } catch (err) {

        await logService.logAI({
            user_id: req.user.id,
            track_identifier,
            prompt_id,
            model_identifier: 'gpt-5.2',
            output_classification: 'refusal',
            refusal_flag: true,
            guardrail_version: 'GR-P1-v1',
            policy_mode: 'documentation_readiness_only',
            error_message: err.message,
            status: 'blocked'
        });

        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
};




// const aiService = require('../services/aiService');
// const logService = require('../services/logService');

// exports.draftEmail = async (req, res) => {

//     const {
//         audience,
//         vendorType,
//         templatePack,
//         jurisdiction
//     } = req.body;

//     try {
//         const result = await aiService.runAI({
//             audience,
//             vendorType,
//             templatePack,
//             jurisdiction
//         });

//         //Log success
//         await logService.logAI({
//             user_id: req.user.id,
//             prompt_id: result.meta.prompt_id,
//             prompt_version: result.meta.prompt_version,
//             track: result.meta.track,
//             model_identifier: result.meta.model_identifier,
//             output_classification: result.meta.output_classification,
//             refusal_flag: result.meta.refusal_flag,
//             audience,
//             vendorType,
//             templatePack,
//             guardrail_version: result.meta.guardrail_version,
//             policy_mode: result.meta.policy_mode,
//             export_intent: 'vendor_or_property_owner_only',
//             output: result.output,
//             status: 'success'
//         });

//         return res.json({
//             success: true,
//             draft: result.output
//         });

//     } catch (err) {

//         //Log refusal / error
//         await logService.logAI({
//             user_id: req.user.id,
//             model_identifier: 'gpt-5.2',
//             output_classification: 'refusal',
//             refusal_flag: true,
//             audience,
//             vendorType,
//             templatePack,
//             guardrail_version: 'GR-P1-v1',
//             policy_mode: 'documentation_readiness_only',
//             error_message: err.message,
//             status: 'blocked'
//         });

//         return res.status(400).json({
//             success: false,
//             message: err.message
//         });
//     }

// };


