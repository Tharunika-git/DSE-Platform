const express = require("express");
const enforcePolicy = require("../middleware/policyMiddleware");

const router = express.Router();

router.get(
    "/orders",
    enforcePolicy("order-service", "/api/orders"),
    (req, res) => {

        res.json({
            message: "Order service accessed successfully",

            security: {
                decision: req.securityDecision.decision,
                reason: req.securityDecision.reason,
                user: req.user
            },

            orders: [
                {
                    id: 101,
                    product: "Laptop",
                    status: "Confirmed"
                },
                {
                    id: 102,
                    product: "Mobile Phone",
                    status: "Shipped"
                }
            ]
        });
    }
);
router.delete(
    "/users",
    enforcePolicy("user-service", "/api/users"),
    (req, res) => {

        res.json({
            message: "User deletion request approved",
            security: {
                decision: req.securityDecision.decision,
                reason: req.securityDecision.reason,
                user: req.user
            }
        });
    }
);
router.get(
    "/inventory",
    enforcePolicy("inventory-service", "/api/inventory"),
    (req, res) => {

        res.json({
            message: "Inventory service accessed successfully",

            security: {
                decision: req.securityDecision.decision,
                reason: req.securityDecision.reason,
                user: req.user
            },

            inventory: [
                {
                    id: 1,
                    product: "Laptop",
                    stock: 25
                },
                {
                    id: 2,
                    product: "Mobile Phone",
                    stock: 40
                }
            ]
        });
    }
);
module.exports = router;