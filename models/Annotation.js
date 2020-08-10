const mongoose = require("mongoose");

const annotationSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
  fileId: {
    type: String,
    required: true,
  },
});

const Annotation = mongoose.model("Annotation", annotationSchema);

module.exports = Annotation;
