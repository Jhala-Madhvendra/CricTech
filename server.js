const express = require("express");
const app = express();
const pointsRoutes = require("../CricHeroAssignment/src/routes/calculatorRoutes");

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use("/points", pointsRoutes);

// Handle 404 - Not Found
app.use((req, res, next) => {
    res.status(404).json({ success: false, error: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Error:", err.message); // Log error for debugging
    res.status(err.status || 500).json({
        success: false,
        error: err.message || "Internal Server Error",
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
