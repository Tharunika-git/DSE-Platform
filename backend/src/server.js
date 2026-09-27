const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const securityEventRoutes = require("./routes/securityEventRoutes");
const policyRoutes = require("./routes/policyRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
    res.json({
        service: "DSE Security API",
        status: "running"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api/security-events", securityEventRoutes);
app.use("/api/policies", policyRoutes);
app.use("/api/dashboard", dashboardRoutes);


const PORT = 5000;

app.listen(PORT, () => {
    console.log(`DSE Security API running on port ${PORT}`);
});