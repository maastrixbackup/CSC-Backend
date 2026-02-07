const openai = require('../config/openai');
const { checkGuardrails, prompts } = require('../utils/guardrails');

// Phase 1 explicitly disallowed prompt IDs
const DISALLOWED_PROMPT_IDS = new Set([
    'P1-006',
    'P1-007',
    'P1-015'
]);

exports.generateDraft = async (promptId) => {
    // const promptConfig = prompts[promptId];
    const promptConfig = prompts.PROMPTS[promptId];
    if (!promptConfig) {
        throw new Error('Invalid or unapproved prompt ID');
    }
    const promptText = promptConfig.text;

    if (DISALLOWED_PROMPT_IDS.has(promptId)) {
        return {
            refusal: true,
            reason: 'Prompt is disallowed under CSC Phase 1 rules',
            tool: promptConfig.tool
        };
    }

    // if (checkGuardrails(promptText)) {
    //     const err = new Error('Disallowed content detected by guardrails');
    //     err.code = 'GUARDRAIL_BLOCKED';
    //     throw err;
    // }

    // const isBlocked = checkGuardrails(prompt);
    // if (isBlocked) {
    //     const error = new Error('Disallowed request: negotiation or representation detected');
    //     error.code = 'GUARDRAIL_BLOCKED';
    //     throw error;
    // }

    const response = await openai.responses.create({
        model: 'gpt-5.2',
        // model: 'gpt-4o-mini',
        input: promptText
    });

    // const output = response.output_text;
    const output =
        response.output_text ||
        response.output?.[0]?.content?.[0]?.text ||
        '';
    // return response.output_text;
    return {
        refusal: false,
        output,
        tool: promptConfig.tool
        // prompt_version: VERSION
    };
};

