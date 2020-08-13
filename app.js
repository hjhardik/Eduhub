const express = require("express");
const bodyParser = require("body-parser"); //body-parser
const expressLayouts = require("express-ejs-layouts"); //using express layouts
const mongoose = require("mongoose"); //for mongodb database
const passport = require("passport"); //authentication and serialization of users
const flash = require("connect-flash"); //flash messages
const session = require("express-session"); //handling sessions of users

//init app
const app = express();

// Passport Config
require("./config/passport")(passport);

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// set EJS tempate engine
app.use(expressLayouts);
app.set("view engine", "ejs");

//static directory
app.use(express.static("./public"));

// body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Routes
app.use("/", require("./routes/index.js"));
app.use("/users", require("./routes/users.js"));
app.use(function (req, res) {
  res.status(404);
  res.render("error");
});
//port
const PORT = process.env.PORT || 5000;
//start server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
