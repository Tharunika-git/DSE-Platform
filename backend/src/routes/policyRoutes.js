const express = require("express");
const policies = require("../models/Policy");

const router = express.Router();

// Get all policies
router.get("/", (req, res) => {
    res.json({
        count: policies.length,
        policies
    });
});

// Create a new policy
router.post("/", (req, res) => {

    const {
        name,
        role,
        service,
        endpoint,
        method,
        effect
    } = req.body;

    if (!name || !role || !service || !endpoint || !method || !effect) {
        return res.status(400).json({
            message: "All policy fields are required"
        });
    }

    const newPolicy = {
        id: policies.length + 1,
        name,
        role,
        service,
        endpoint,
        method: method.toUpperCase(),
        effect: effect.toUpperCase()
    };

    policies.push(newPolicy);

    res.status(201).json({
        message: "Policy created successfully",
        policy: newPolicy
    });
});

// Update a policy
router.put("/:id", (req, res) => {

    const policyId = Number(req.params.id);

    const policy = policies.find(
        policy => policy.id === policyId
    );

    if (!policy) {
        return res.status(404).json({
            message: "Policy not found"
        });
    }

    const {
        name,
        role,
        service,
        endpoint,
        method,
        effect
    } = req.body;

    if (name) policy.name = name;
    if (role) policy.role = role;
    if (service) policy.service = service;
    if (endpoint) policy.endpoint = endpoint;
    if (method) policy.method = method.toUpperCase();
    if (effect) policy.effect = effect.toUpperCase();

    res.json({
        message: "Policy updated successfully",
        policy
    });
});

// Delete a policy
router.delete("/:id", (req, res) => {

    const policyId = Number(req.params.id);

    const policyIndex = policies.findIndex(
        policy => policy.id === policyId
    );

    if (policyIndex === -1) {
        return res.status(404).json({
            message: "Policy not found"
        });
    }

    const deletedPolicy = policies.splice(policyIndex, 1);

    res.json({
        message: "Policy deleted successfully",
        policy: deletedPolicy[0]
    });
});

module.exports = router;