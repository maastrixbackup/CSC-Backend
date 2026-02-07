const aiService = require('../services/aiService');
const logService = require('../services/logService');

exports.draftEmail = async (req, res) => {
    // const prompt = req.body.prompt;
    const { prompt_id, prompt_version } = req.body;

    try {
        // const output = await aiService.generateDraft(prompt_id);

        // await logService.logAI({
        //     user_id: req.user.id,
        //     model_identifier: 'gpt-5.2',
        //     prompt_version: 'v1_draft_email',
        //     tool_invoked: 'draft_email',
        //     output_classification: 'draft',
        //     refusal_flag: false,
        //     prompt,
        //     output,
        //     status: 'success'
        // });

        // return res.status(200).json({
        //     success: true,
        //     data: {
        //         draft: output
        //     }
        // });

        const result = await aiService.generateDraft(prompt_id);
        if (result.refusal) {
            await logService.logAI({
                user_id: req.user.id,
                model_identifier: 'gpt-5.2',
                prompt_id: prompt_id,
                prompt_version,
                tool_invoked: result.tool,
                output_classification: 'refusal',
                refusal_flag: true,
                prompt: prompt_id,
                output: null,
                status: 'error'
            });

            return res.status(403).json({
                success: false,
                message: 'This request is not allowed under Phase 1 rules.'
            });
        }

        //SUCCESS (DRAFT)
        await logService.logAI({
            user_id: req.user.id,
            model_identifier: 'gpt-5.2',
            prompt_id: prompt_id,
            prompt_version,
            tool_invoked: result.tool,
            output_classification: 'draft',
            refusal_flag: false,
            prompt: prompt_id,
            output: result.output,
            status: 'success'
        });

        return res.status(200).json({
            success: true,
            data: {
                draft: result.output
            }
        });


    } catch (err) {
        await logService.logAI({
            user_id: req.user.id,
            model_identifier: 'gpt-5.2',
            prompt_id: prompt_id,
            prompt_version,
            tool_invoked: 'unknown',
            output_classification: 'refusal',
            refusal_flag: true,
            prompt: prompt_id,
            output: null,
            status: 'error',
            error_message: err.message
        });

        return res.status(500).json({
            success: false,
            message: err.message || 'AI error'
        });
    }
};


