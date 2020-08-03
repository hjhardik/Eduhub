const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
    maxlength: 50,
  },
  teacherName: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
    maxlength: 20,
  },
  topics: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
    maxlength: 50,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
