const aiService = require('../services/aiService');
const logService = require('../services/logService');

exports.draftEmail = async (req, res) => {

    const {
        audience,
        vendorType,
        templatePack,
        jurisdiction
    } = req.body;

    try {
        const result = await aiService.runAI({
            audience,
            vendorType,
            templatePack,
            jurisdiction
        });

        //Log success
        await logService.logAI({
            user_id: req.user.id,
            prompt_id: result.meta.prompt_id,
            prompt_version: result.meta.prompt_version,
            track: result.meta.track,
            model_identifier: result.meta.model_identifier,
            output_classification: result.meta.output_classification,
            refusal_flag: result.meta.refusal_flag,
            audience,
            vendorType,
            templatePack,
            guardrail_version: result.meta.guardrail_version,
            policy_mode: result.meta.policy_mode,
            export_intent: 'vendor_or_property_owner_only',
            output: result.output,
            status: 'success'
        });

        return res.json({
            success: true,
            draft: result.output
        });

    } catch (err) {

        //Log refusal / error
        await logService.logAI({
            user_id: req.user.id,
            model_identifier: 'gpt-5.2',
            output_classification: 'refusal',
            refusal_flag: true,
            audience,
            vendorType,
            templatePack,
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

    // // const prompt = req.body.prompt;
    // const { prompt_id, prompt_version } = req.body;

    // try {
    //     // const output = await aiService.generateDraft(prompt_id);

    //     // await logService.logAI({
    //     //     user_id: req.user.id,
    //     //     model_identifier: 'gpt-5.2',
    //     //     prompt_version: 'v1_draft_email',
    //     //     tool_invoked: 'draft_email',
    //     //     output_classification: 'draft',
    //     //     refusal_flag: false,
    //     //     prompt,
    //     //     output,
    //     //     status: 'success'
    //     // });

    //     // return res.status(200).json({
    //     //     success: true,
    //     //     data: {
    //     //         draft: output
    //     //     }
    //     // });

    //     const result = await aiService.generateDraft(prompt_id);
    //     if (result.refusal) {
    //         await logService.logAI({
    //             user_id: req.user.id,
    //             model_identifier: 'gpt-5.2',
    //             prompt_id: prompt_id,
    //             prompt_version,
    //             tool_invoked: result.tool,
    //             output_classification: 'refusal',
    //             refusal_flag: true,
    //             prompt: prompt_id,
    //             output: null,
    //             status: 'error'
    //         });


    //         return res.status(403).json({
    //             success: false,
    //             message: 'This request is not allowed under ClaimScope Consulting, LLC (CSC).'
    //         });
    //     }

    //     //SUCCESS (DRAFT)
    //     await logService.logAI({
    //         user_id: req.user.id,
    //         model_identifier: 'gpt-5.2',
    //         prompt_id: prompt_id,
    //         prompt_version,
    //         tool_invoked: result.tool,
    //         output_classification: 'draft',
    //         refusal_flag: false,
    //         prompt: prompt_id,
    //         output: result.output,
    //         status: 'success'
    //     });

    //     return res.status(200).json({
    //         success: true,
    //         data: {
    //             draft: result.output
    //         }
    //     });


    // } catch (err) {
    //     await logService.logAI({
    //         user_id: req.user.id,
    //         model_identifier: 'gpt-5.2',
    //         prompt_id: prompt_id,
    //         prompt_version,
    //         tool_invoked: 'unknown',
    //         output_classification: 'refusal',
    //         refusal_flag: true,
    //         prompt: prompt_id,
    //         output: null,
    //         status: 'error',
    //         error_message: err.message
    //     });

    //     return res.status(500).json({
    //         success: false,
    //         message: err.message || 'AI error'
    //     });
    // }

};


