const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

// Welcome Page
router.get("/", forwardAuthenticated, (req, res) => res.render("welcome"));

// Dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  if (req.user.role == "student") {
    res.render("dashboard", {
      user: req.user,
    });
  } else {
    res.render("teacherDashboard", {
      user: req.user,
    });
  }
});

module.exports = router;
