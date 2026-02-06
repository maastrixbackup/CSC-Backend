const openai = require('../config/openai');
const { checkGuardrails } = require('../utils/guardrails');

exports.generateDraft = async (prompt) => {
    const isBlocked = checkGuardrails(prompt);
    if (isBlocked) {
        const error = new Error('Disallowed request: negotiation or representation detected');
        error.code = 'GUARDRAIL_BLOCKED';
        throw error;
    }

    const response = await openai.responses.create({
        model: 'gpt-5.2',
        // model: 'gpt-4o-mini',
        input: prompt
    });

    return response.output_text;
};

