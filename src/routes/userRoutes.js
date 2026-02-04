const express = require("express");
const router = express.Router();

const { getProfile } = require("../controllers/userController");
const authMiddleware = require("../middleware/auth");

router.get("/getProfile", authMiddleware, getProfile);

module.exports = router;
