const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
    maxlength: 50,
  },
  subjectName: {
    type: String,
    required: true,
    maxlength: 50,
  },
  teacherName: {
    type: String,
    required: true,
  },
  totalTopics: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
    maxlength: 100,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
