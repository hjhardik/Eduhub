// middlewares to ensure authentication for protected routes
module.exports = {
  //ensure authentication if user tries to directly access a protected route
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    //flashes error msg if user is not signed in
    req.flash("error_msg", "Please log in to view that resource");
    res.redirect("/users/login");
  },
  // redirects directly the user to dashboard if already signed in and else to login/signup
  forwardAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect("/dashboard");
  },
};
