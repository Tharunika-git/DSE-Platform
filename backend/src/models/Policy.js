const policies = [
    {
        id: 1,
        name: "User View Orders",
        role: "USER",
        service: "order-service",
        endpoint: "/api/orders",
        method: "GET",
        effect: "ALLOW"
    },
    {
        id: 2,
        name: "User Create Orders",
        role: "USER",
        service: "order-service",
        endpoint: "/api/orders",
        method: "POST",
        effect: "ALLOW"
    },
    {
        id: 3,
        name: "User Delete Users",
        role: "USER",
        service: "user-service",
        endpoint: "/api/users",
        method: "DELETE",
        effect: "DENY"
    },
    {
        id: 4,
        name: "Admin Delete Users",
        role: "ADMIN",
        service: "user-service",
        endpoint: "/api/users",
        method: "DELETE",
        effect: "ALLOW"
    },
    {
        id: 5,
        name: "Admin Access",
        role: "ADMIN",
        service: "admin-service",
        endpoint: "/api/admin",
        method: "GET",
        effect: "ALLOW"
    },
    {
    id: 6,
    name: "User View Inventory",
    role: "USER",
    service: "inventory-service",
    endpoint: "/api/inventory",
    method: "GET",
    effect: "ALLOW"
}
];

module.exports = policies;