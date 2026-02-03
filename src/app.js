require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require("./routes/authRoutes");
// const aiRoutes = require("./routes/aiRoutes");
// const logRoutes = require("./routes/logRoutes");

const app = express();

const authMiddleware = require("./middleware/auth");

app.use(cors());
app.use(express.json());

// app.use(
//     cors({
//         origin: "*",
//         methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//         credentials: true,
//     }),
// );

app.use('/api/auth', authRoutes);
// app.use('/ai', aiRoutes);
// app.use('/logs', logRoutes);

module.exports = app;
