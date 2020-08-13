const express = require("express");
const multer = require("multer"); //for storing PDF files to server
const router = express.Router(); //express router
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth"); ///autheticatiion midlewares
const path = require("path");
const fs = require("fs");

//models
const Course = require("../models/Course");
const Annotation = require("../models/Annotation");

// Welcome Page
router.get("/", forwardAuthenticated, (req, res) => res.render("welcome"));

// Dashboard
router.get("/dashboard", ensureAuthenticated, async (req, res) => {
  //recieve latest 3 courses and all of the courses from the database,respectively
  let latestCourses = await Course.find({}).sort({ date: -1 }).limit(3);
  let allCourses = await Course.find({}).sort({ date: -1 });
  //if user is accessign dashboard route
  if (req.user.role == "student") {
    res.render("dashboard", {
      user: req.user,
      latestCourses,
      allCourses,
    });
  } else {
    //also sends courses created b the teacher to teacherDashboard
    const teacherCourses = await Course.find({
      teacherName: req.user.name,
    }).sort({ date: -1 });
    res.render("teacherDashboard", {
      user: req.user,
      teacherCourses: teacherCourses,
      latestCourses,
      allCourses,
    });
  }
});

//get asked course through _id of course
router.get("/course/:id", ensureAuthenticated, async (req, res) => {
  //finds course with same _id from database
  const requestedCourse = await Course.findOne({ _id: req.params.id });
  if (requestedCourse != null) {
    res.render("course", {
      course: requestedCourse,
      userName: req.user.name,
      userRole: req.user.role,
      userEmail: req.user.email,
    });
  } else {
    //if case of error ,display 404
    res.render("error");
  }
});
//find annotations for a given file though fileId
router.post("/course/annotations/find", async (req, res) => {
  let reqFile = req.body.fileId;
  if (reqFile == "") {
    res.sendStatus(200);
  } else {
    //finds all annotations with same fileId
    await Annotation.find({ fileId: reqFile })
      .select({ _id: 0, data: 1 })
      .exec((err, annos) => {
        if (!err) {
          res.send(annos);
        } else {
          console.log(err);
        }
      });
  }
});
//add annos route
router.post("/course/annotations/add", async (req, res) => {
  let data = req.body.data;
  let fileName = req.body.fileId;
  if (data == "" || fileName == "" || data == undefined) {
    res.sendStatus(200);
  } else {
    let id = data.id;
    await Annotation.findOne({ id: id, fileId: fileName }).then((anno) => {
      //chekcs if already not present, then creates one
      if (!anno) {
        const ano = new Annotation({
          id: id,
          fileId: fileName,
          data: data,
        });
        ano.save();
      }
    });
    res.sendStatus(200);
  }
});
//update annos route
router.post("/course/annotations/update", (req, res) => {
  let data = req.body.data;
  let fileName = req.body.fileId;
  let id = data.id;
  //find annos from DB by fileId and then updates it
  Annotation.findOneAndUpdate(
    { id: id, fileId: fileName },
    { "data.bodyValue": data.bodyValue },
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );
  res.sendStatus(200);
});
//delete annos route
router.post("/course/annotations/delete", async (req, res) => {
  let data = req.body.data;
  let fileName = req.body.fileId;
  let id = data.id;
  //finds annos by _id and then dleets it from DB
  await Annotation.deleteOne({ id: id, fileId: fileName }, (err) => {
    if (err) {
      console.log(err);
    }
  });
  res.sendStatus(200);
});
//createCourse route
router.get("/createCourse", ensureAuthenticated, (req, res) => {
  //not allow if student tries to access the route
  if (req.user.role == "student") {
    req.flash("error_msg", "Only available for teachers.");
    res.redirect("/dashboard");
  } else {
    res.render("createCourse");
  }
});
//recive canvas image as base64 string then convert it PNG file by fs.writeFIle
router.post("/course", async (req, res) => {
  var canvaImg = req.body.canvasImg;
  var base64Data = canvaImg.replace(/^data:image\/png;base64,/, "");
  fs.writeFile(
    `./public/canvas/${req.user.name}.png`,
    base64Data,
    "base64",
    function (err) {}
  );
  //chekcs if by fault PDF is already present and if so deletes it
  if (fs.existsSync(`./public/canvas/${req.user.name}.pdf`)) {
    fs.unlinkSync(`./public/canvas/${req.user.name}.pdf`);
  }
  //call the toolsCode.js code (PDF TOOLS API CODE) present in ./../toolsCode.js file
  var outputFile = await require("./../toolsCode")(`${req.user.name}`);
  //wait for 3 secs then send download file request to user
  setTimeout(() => {
    if (fs.existsSync(`./public/canvas/${outputFile}`)) {
      res.download(`./public/canvas/${outputFile}`, function (err) {
        if (err) {
          console.log(err); // Check error if you want
        }
        // delete the created PDF from the server as the user has downloaded it successfully
        fs.unlinkSync(`./public/canvas/${outputFile}`);
        console.log(
          "User has successfully completed PDF download and file is deleted from server storage."
        );
      });
    } else {
      // if something errorprone happens send no content
      res.sendStatus(204);
    }
  }, 3000);
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
//create new course
router.post("/createCourse", upload, (req, res) => {
  const teacherName = req.user.name;
  const { courseName, subjectName, totalTopics, description } = req.body;
  let errors = [];

  // form validation checks
  if (!courseName || !subjectName || !parseInt(totalTopics) || !description) {
    errors.push({ msg: "Please enter all fields" });
  }
  if (
    courseName.length >= 49 ||
    subjectName.length >= 49 ||
    description.length >= 130
  ) {
    errors.push({ msg: "Please enter brief values for fields." });
  }
  //if any of the topic fields are empty
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
  //if no PDF is selected in any of the file inputs
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
  //if validation not succeded, re-render page
  if (errors.length > 0) {
    res.render("createCourse", {
      errors,
      courseName,
      subjectName,
      description,
    });
  } else {
    //else create new course in database by trimming trailing and preceding spaces
    const newCourse = new Course({
      courseName: courseName.trim(),
      subjectName: subjectName.trim(),
      teacherName: teacherName.trim(),
      totalTopics,
      fileOne: req.files.pdfFile1[0].filename,
      topicOne: req.body.topic1.trim(),
      fileTwo:
        req.files.pdfFile2 != undefined ? req.files.pdfFile2[0].filename : null,
      topicTwo: req.body.topic2 != undefined ? req.body.topic2.trim() : null,
      fileThree:
        req.files.pdfFile3 != undefined ? req.files.pdfFile3[0].filename : null,
      topicThree: req.body.topic3 != undefined ? req.body.topic3.trim() : null,
      fileFour:
        req.files.pdfFile4 != undefined ? req.files.pdfFile4[0].filename : null,
      topicFour: req.body.topic4 != undefined ? req.body.topic4.trim() : null,
      fileFive:
        req.files.pdfFile5 != undefined ? req.files.pdfFile5[0].filename : null,
      topicFive: req.body.topic5 != undefined ? req.body.topic5.trim() : null,
      description: description.trim(),
    });
    //save newCourse
    newCourse
      .save()
      .then((course) => {
        req.flash("success_msg", "Course Created successfully");
        res.redirect("/dashboard");
      })
      .catch((err) => console.log(err));
  }
});
//export the router
module.exports = router;
