const express = require("express");
const multer = require("multer");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const Course = require("../models/Course");
const path = require("path");
const fs = require("fs");

// Welcome Page
router.get("/", forwardAuthenticated, (req, res) => res.render("welcome"));

// Dashboard
router.get("/dashboard", ensureAuthenticated, async (req, res) => {
  if (req.user.role == "student") {
    res.render("dashboard", {
      user: req.user,
    });
  } else {
    const teacherCourses = await Course.find({
      teacherName: req.user.name,
    }).sort({ date: -1 });
    res.render("teacherDashboard", {
      user: req.user,
      teacherCourses: teacherCourses,
    });
  }
});

router.get("/course/:id", ensureAuthenticated, async (req, res) => {
  const requestedCourse = await Course.findOne({ _id: req.params.id });
  if (requestedCourse != null) {
    res.render("course", {
      course: requestedCourse,
    });
  } else {
    res.render("error");
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
router.post("/canvas", (req, res) => {
  canvaImg = req.body.canvasImg;
  var base64Data = canvaImg.replace(/^data:image\/png;base64,/, "");
  fs.writeFile(
    `./public/canvas/${req.user.name}.png`,
    base64Data,
    "base64",
    function (err) {
      console.log(err);
    }
  );
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
    checkFileType(file, cb);
  },
}).fields([
  {
    name: "pdfFile1",
    maxCount: 1,
  },
  {
    name: "pdfFile2",
    maxCount: 1,
  },
  {
    name: "pdfFile3",
    maxCount: 1,
  },
  {
    name: "pdfFile4",
    maxCount: 1,
  },
  {
    name: "pdfFile5",
    maxCount: 1,
  },
]);
//check file type
function checkFileType(file, cb) {
  //allowed extensions
  const fileTypes = /pdf/;
  //check ext
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  //check mime
  const mimetype = fileTypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error : PDF files(.pdf) only");
  }
}

//====================================================
router.post("/createCourse", upload, (req, res) => {
  const teacherName = req.user.name;
  const { courseName, subjectName, totalTopics, description } = req.body;
  let errors = [];

  // form validation
  if (!courseName || !subjectName || !parseInt(totalTopics) || !description) {
    errors.push({ msg: "Please enter all fields" });
  }

  try {
    if (
      req.body.topic1 == "" ||
      req.body.topic2 == "" ||
      req.body.topic3 == "" ||
      req.body.topic4 == "" ||
      req.body.topic5 == ""
    ) {
      errors.push({ msg: "Please enter all topic fields." });
    }
  } catch {}

  if (totalTopics == 1) {
    if (req.files.pdfFile1 == undefined) {
      errors.push({ msg: "Please upload the required Pdf file." });
    }
  } else if (totalTopics == 2) {
    if (req.files.pdfFile1 == undefined || req.files.pdfFile2 == undefined) {
      errors.push({ msg: "Please upload all necessary PDFs." });
    }
  } else if (totalTopics == 3) {
    if (
      req.files.pdfFile1 == undefined ||
      req.files.pdfFile2 == undefined ||
      req.files.pdfFile3 == undefined
    ) {
      errors.push({ msg: "Please upload all necessary PDFs." });
    }
  } else if (totalTopics == 4) {
    if (
      req.files.pdfFile1 == undefined ||
      req.files.pdfFile2 == undefined ||
      req.files.pdfFile3 == undefined ||
      req.files.pdfFile4 == undefined
    ) {
      errors.push({ msg: "Please upload all necessary PDFs." });
    }
  } else if (totalTopics == 5) {
    if (
      req.files.pdfFile1 == undefined ||
      req.files.pdfFile2 == undefined ||
      req.files.pdfFile3 == undefined ||
      req.files.pdfFile4 == undefined ||
      req.files.pdfFile5 == undefined
    ) {
      errors.push({ msg: "Please upload all necessary PDFs." });
    }
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
      fileOne: req.files.pdfFile1[0].filename,
      topicOne: req.body.topic1,
      fileTwo:
        req.files.pdfFile2 != undefined ? req.files.pdfFile2[0].filename : null,
      topicTwo: req.body.topic2 != undefined ? req.body.topic2 : null,
      fileThree:
        req.files.pdfFile3 != undefined ? req.files.pdfFile3[0].filename : null,
      topicThree: req.body.topic3 != undefined ? req.body.topic3 : null,
      fileFour:
        req.files.pdfFile4 != undefined ? req.files.pdfFile4[0].filename : null,
      topicFour: req.body.topic4 != undefined ? req.body.topic4 : null,
      fileFive:
        req.files.pdfFile5 != undefined ? req.files.pdfFile5[0].filename : null,
      topicFive: req.body.topic5 != undefined ? req.body.topic5 : null,
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
