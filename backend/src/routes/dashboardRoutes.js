const express = require("express");
const securityEvents = require("../models/SecurityEvent");
const policies = require("../models/Policy");

const router = express.Router();

router.get("/", (req, res) => {

    const totalRequests = securityEvents.length;

    const allowedRequests = securityEvents.filter(
        event => event.decision === "ALLOW"
    ).length;

    const deniedRequests = securityEvents.filter(
        event => event.decision === "DENY"
    ).length;

    const allowRate = totalRequests === 0
        ? 0
        : Math.round((allowedRequests / totalRequests) * 100);

    const denyRate = totalRequests === 0
        ? 0
        : Math.round((deniedRequests / totalRequests) * 100);

    res.json({
        dashboard: "DSE Security Dashboard",

        statistics: {
            totalRequests,
            allowedRequests,
            deniedRequests,
            activePolicies: policies.length,
            allowRate: `${allowRate}%`,
            denyRate: `${denyRate}%`
        },

        status:
            deniedRequests > 0
                ? "SECURITY EVENTS DETECTED"
                : "SECURE"
    });
});

module.exports = router;