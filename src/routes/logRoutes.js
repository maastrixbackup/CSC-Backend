const express = require("express");
const router = express.Router();
const {
    listLogs,
} = require("../controllers/logsController");

const authMiddleware = require("../middleware/auth");

router.get("/logList", authMiddleware, listLogs);

module.exports = router;