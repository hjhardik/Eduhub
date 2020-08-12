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
  fileOne: {
    type: String,
    required: true,
  },
  topicOne: {
    type: String,
    required: true,
  },
  fileTwo: {
    type: String,
    default: null,
  },
  topicTwo: {
    type: String,
  },
  fileThree: {
    type: String,
    default: null,
  },
  topicThree: {
    type: String,
  },
  fileFour: {
    type: String,
    default: null,
  },
  topicFour: {
    type: String,
  },
  fileFive: {
    type: String,
    default: null,
  },
  topicFive: {
    type: String,
  },
  description: {
    type: String,
    required: true,
    maxlength: 150,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
