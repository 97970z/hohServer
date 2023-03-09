import { Schema, model } from "mongoose";

const AssignmentSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  expiration: {
    type: Date,
    required: true,
  },
  createdAt: { type: Date, required: true, default: Date.now },
  content: {
    type: String,
    required: true,
  },
  gptanswer: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  answers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Answer",
    },
  ],
});

const Assignment = model("Assignment", AssignmentSchema);

export default Assignment;
