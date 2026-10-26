const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { rateLimit } = require("express-rate-limit");

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "16kb" }));
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
const loginLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30 });

app.post("/authenticate", loginLimit, async (req, res) => {
    const { username, secret } = req.body || {};
    if (typeof username !== "string" || !username.trim() || username.length > 150 ||
        typeof secret !== "string" || !secret || secret.length > 1024) {
        return res.status(400).json({ error: "Username and password are required." });
    }
    if (!process.env.CHAT_ENGINE_PROJECT_ID) {
        return res.status(503).json({ error: "Chat service is not configured." });
    }
    try {
        // Verify an existing user's credentials. Never create, overwrite, or reset
        // a user's secret during authentication using a project administrator key.
        const r = await axios.get("https://api.chatengine.io/users/me/", {
            headers: {
                "Project-ID": process.env.CHAT_ENGINE_PROJECT_ID,
                "User-Name": username,
                "User-Secret": secret,
            },
            timeout: 10000,
        });
        return res.status(200).json({ username: r.data.username });
    } catch (e) {
        const rejected = [401, 403, 404].includes(e.response?.status);
        return res.status(rejected ? 401 : 502).json({ error: rejected ? "Invalid credentials." : "Chat service unavailable." });
    }
});

if (require.main === module) app.listen(3001);
module.exports = app;
