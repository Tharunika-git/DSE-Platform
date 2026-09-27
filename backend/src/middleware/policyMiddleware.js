const authenticateToken = require("./authMiddleware");
const { evaluatePolicy } = require("../services/policyEngine");
const securityEvents = require("../models/SecurityEvent");

const enforcePolicy = (service, endpoint) => {

    return [
        authenticateToken,

        (req, res, next) => {

            const result = evaluatePolicy({
                role: req.user.role,
                service: service,
                endpoint: endpoint,
                method: req.method
            });

            // Create security event
            const securityEvent = {
                id: securityEvents.length + 1,
                userId: req.user.id,
                email: req.user.email,
                role: req.user.role,
                service: service,
                endpoint: endpoint,
                method: req.method,
                decision: result.decision,
                reason: result.reason,
                policyId: result.policy ? result.policy.id : null,
                timestamp: new Date().toISOString()
            };

            // Store event
            securityEvents.push(securityEvent);

            // Attach decision to request
            req.securityDecision = result;

            // Deny request
            if (!result.allowed) {
                return res.status(403).json({
                    message: "Access denied",
                    security: {
                        decision: result.decision,
                        reason: result.reason,
                        policy: result.policy
                    }
                });
            }

            // Allow request
            next();
        }
    ];
};

module.exports = enforcePolicy;