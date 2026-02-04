const banned = [
    'negotiate',
    'fight',
    'represent',
    'adjuster',
    'maximize payout',
    'contact carrier',
    'fema submission'
];

const checkGuardrails = (text) => {
    if (!text || typeof text !== "string") return false;

    const normalized = text.toLowerCase();
    return banned.some(word => normalized.includes(word));
};

module.exports = { checkGuardrails };