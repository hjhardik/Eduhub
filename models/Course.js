const mongoose = require("mongoose");

//creating course schema to store courses created by the teachers
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
  //max five topics option is present therefore five files(each for one topic)
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
  //date of creation
  date: {
    type: Date,
    default: Date.now,
  },
});
//creating model
const Course = mongoose.model("Course", courseSchema);
//exporting model
module.exports = Course;
