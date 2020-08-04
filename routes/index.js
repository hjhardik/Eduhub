const express = require("express");
const multer = require("multer");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const Course = require("../models/Course");

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

router.get("/createCourse", ensureAuthenticated, (req, res) => {
  if (req.user.role == "student") {
    req.flash("error_msg", "Only available for teachers.");
    res.redirect("/dashboard");
  } else {
    res.render("createCourse");
  }
});
//=====================file upload======================
//set storage engine
const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
//init upload
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    console.log("checking file");
    checkFileType(file, cb);
  },
}).single("pdfFile1");
//check file type
function checkFileType(file, cb) {
  //allowed extensions
  const fileTypes = /pdf/;
  //check ext
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  //check mime
  const mimetype = fileTypes.test(file.mimetype);
  if (mimetype && extname) {
    console.log("True nigga");
    return cb(null, true);
  } else {
    console.log("PDf file only bro");
    cb("Error : PDF files(.pdf) only");
  }
}

//====================================================
router.post("/createCourse", upload, (req, res) => {
  console.log(req);
  const teacherName = req.user.name;
  const { courseName, subjectName, totalTopics, description } = req.body;
  let errors = [];

  // form validation
  if (!courseName || !subjectName || !parseInt(totalTopics) || !description) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (errors.length > 0) {
    res.render("createCourse", {
      errors,
      courseName,
      subjectName,
      description,
    });
  } else {
    const newCourse = new Course({
      courseName,
      subjectName,
      teacherName,
      totalTopics,
      fileOne: req.file.filename,
      topicOne: req.body.topic1,
      fileTwo: req.file.filename,
      topicTwo: req.body.topic2,
      fileThree: req.file.filename,
      topicThree: req.body.topic3,
      fileFour: req.file.filename,
      topicFour: req.body.topic4,
      fileFive: req.file.filename,
      topicFive: req.body.topic5,
      description,
    });
    newCourse
      .save()
      .then((course) => {
        req.flash("success_msg", "Course Created successfully");
        res.redirect("/dashboard");
      })
      .catch((err) => console.log(err));
  }
});

module.exports = router;
