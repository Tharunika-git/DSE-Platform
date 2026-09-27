const express = require("express");
const securityEvents = require("../models/SecurityEvent");

const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        count: securityEvents.length,
        events: securityEvents
    });
});

module.exports = router;