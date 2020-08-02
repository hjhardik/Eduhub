module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "Please log in to view that resource");
    res.redirect("/users/login");
  },
  forwardAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect("/dashboard");
  },
  // ensureAuthTeacher: function (req, res, next) {
  //   if (req.user.role == "teacher") {
  //     return next();
  //   }
  //   req.flash("error_msg", "That resource is only available for teachers.");
  //   res.redirect("/dashboard");
  // },
};
