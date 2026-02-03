const express = require("express");
const router = express.Router();
const {
    login,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/auth");

router.post("/login", login);

module.exports = router;