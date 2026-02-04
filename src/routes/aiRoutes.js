const express = require("express");
const router = express.Router();

const authMiddleware = require('../middleware/auth');
const { draftEmail } = require('../controllers/aiController');

router.post('/draft-email', authMiddleware, draftEmail);

module.exports = router;