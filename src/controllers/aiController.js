const aiService = require('../services/aiService');
const logService = require('../services/logService');

exports.draftEmail = async (req, res) => {
    const prompt = req.body.prompt;

    try {
        const output = await aiService.generateDraft(prompt);

        await logService.logAI({
            user_id: req.user.id,
            model_identifier: 'gpt-4o-mini',
            prompt_version: 'v1_draft_email',
            tool_invoked: 'draft_email',
            output_classification: 'draft',
            refusal_flag: false,
            prompt,
            output,
            status: 'success'
        });

        return res.status(200).json({
            success: true,
            data: {
                draft: output
            }
        });


    } catch (err) {
        await logService.logAI({
            user_id: req.user.id,
            model_identifier: 'gpt-4o-mini',
            prompt_version: 'v1_draft_email',
            tool_invoked: 'draft_email',
            output_classification: 'refusal',
            refusal_flag: true,
            prompt,
            output: null,
            status: 'error',
            error_message: err.message
        });

        // return res.status(500).json({
        //     success: false,
        //     message: 'AI error'
        // });

        return res.status(500).json({
            success: false,
            message: err.message || "AI error"
        });
    }
};


