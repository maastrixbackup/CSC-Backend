const banned = [
    'negotiate',
    'fight',
    'represent',
    'adjuster',
    'maximize payout',
    'contact carrier',
    'fema submission'
];

module.exports = (req, res, next) => {
    const text = JSON.stringify(req.body).toLowerCase();
    if (banned.some(word => text.includes(word))) {
        return res.status(403).json({
            message: 'Request blocked by CSC compliance policy'
        });
    }
    next();
};
