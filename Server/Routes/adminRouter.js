const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middlewares/authMiddleware");
const adminMiddleware = require("../Middlewares/adminMiddleware");
const adminController = require("../Controllers/adminController");

// Secure all admin routes with authentication and admin role verification
router.use(authMiddleware, adminMiddleware);

// Dashboard metrics
router.get("/dashboard", adminController.getDashboardMetrics);

// Manage articles
router.get("/articles", adminController.getArticles);
router.put("/articles/:id/status", adminController.updateArticleStatus);

// Manage journalists
router.get("/journalists", adminController.getJournalists);
router.put("/journalists/:id/status", adminController.updateJournalistStatus);

// Manage users
router.get("/users", adminController.getUsers);

// Retrieve comments
router.get("/comments", adminController.getComments);

module.exports = router;
