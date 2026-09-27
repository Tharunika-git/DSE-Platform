const policies = require("../models/Policy");

const evaluatePolicy = ({
    role,
    service,
    endpoint,
    method
}) => {

    const matchingPolicies = policies.filter(policy =>
        policy.role === role &&
        policy.service === service &&
        policy.endpoint === endpoint &&
        policy.method === method
    );

    if (matchingPolicies.length === 0) {
        return {
            allowed: false,
            decision: "DENY",
            reason: "No matching security policy found",
            policy: null
        };
    }

    const policy = matchingPolicies[0];

    return {
        allowed: policy.effect === "ALLOW",
        decision: policy.effect,
        reason:
            policy.effect === "ALLOW"
                ? "Request matches an allow policy"
                : "Request matches a deny policy",
        policy: policy
    };
};

module.exports = {
    evaluatePolicy
};