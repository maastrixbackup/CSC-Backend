const db = require('../config/db');
const logAI = async (data) => {
    const query = `
    INSERT INTO ai_logs (
      user_id,
      model_identifier,
      prompt_id,
      prompt_version,
      tool_invoked,
      output_classification,
      refusal_flag,
      prompt,
      audience,
      vendor_type,
      template_pack,
      guardrail_version,
      policy_mode,
      export_intent,
      output,
      status,
      error_message
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;


    const values = [
        data.user_id,
        data.model_identifier || null,
        data.prompt_id || null,
        data.prompt_version || null,
        data.tool_invoked || null,
        data.output_classification || 'draft',
        data.refusal_flag ? 1 : 0,
        data.prompt || null,
        data.audience || null,
        data.vendorType || null,
        data.templatePack || null,
        data.guardrail_version || null,
        data.policy_mode || null,
        data.export_intent || null,

        data.output || null,
        data.status || null,
        data.error_message || null
    ];
    await db.query(query, values);
};

const getLogs = async () => {
    const query = `
        SELECT
            id,
            user_id,
            model_identifier,
            prompt_id,
            prompt_version,
            tool_invoked,
            output_classification,
            refusal_flag,
            prompt,
            output,
            status,
            error_message,
            created_at
        FROM ai_logs
        ORDER BY created_at DESC
    `;

    const [rows] = await db.query(query);
    return rows;
};

// exports.getLogs = async ({ limit, offset }) => {
//     const query = `
//         SELECT
//             id,
//             user_id,
//             model_identifier,
//             prompt_version,
//             tool_invoked,
//             output_classification,
//             refusal_flag,
//             prompt,
//             output,
//             status,
//             error_message,
//             created_at
//         FROM ai_logs
//         ORDER BY created_at DESC
//         LIMIT ? OFFSET ?
//     `;

//     const [rows] = await db.query(query, [limit, offset]);
//     return rows;
// };

const countAll = async () => {
    const query = `SELECT COUNT(*) AS total FROM ai_logs`;
    const [rows] = await db.query(query);
    return rows[0].total;
};

module.exports = { logAI, getLogs, countAll };
