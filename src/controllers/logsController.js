const logService = require("../services/logService");

exports.listLogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const logs = await logService.getLogs();
        // const logs = await logService.getLogs({ limit, offset });

        // const total = await logService.countAll();
        // const totalPages = Math.ceil(total / limit);

        return res.status(200).json({
            success: true,
            message: "Logs fetched successfully",
            // page,
            // limit,
            // total,
            // totalPages,
            data: logs
        });

    } catch (err) {
        console.error("List Logs Error:", err);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch logs"
        });
    }
};