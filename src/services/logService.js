const db = require('../config/db');
exports.logAI = async (data) => {
    const query = `
    INSERT INTO ai_logs (
      user_id,
      model_identifier,
      prompt_version,
      tool_invoked,
      output_classification,
      refusal_flag,
      prompt,
      output,
      status,
      error_message
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        data.user_id,
        data.model_identifier || null,
        data.prompt_version || null,
        data.tool_invoked || null,
        data.output_classification || 'draft',
        data.refusal_flag ? 1 : 0,
        data.prompt || null,
        data.output || null,
        data.status || null,
        data.error_message || null
    ];
    await db.query(query, values);
};
