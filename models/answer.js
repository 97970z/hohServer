import { Schema, model } from "mongoose";

const AnswerSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignment: {
    type: Schema.Types.ObjectId,
    ref: "Assignment",
    required: true,
  },
  createdAt: { type: Date, required: true, default: Date.now },
});

const Answer = model("Answer", AnswerSchema);

export default Answer;
