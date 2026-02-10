const express = require("express");
const router = express.Router();

const authMiddleware = require('../middleware/auth');
const { run } = require('../controllers/aiController');

router.post('/run', authMiddleware, run);

module.exports = router;