import Assignment from "../models/assignment";
import Answer from "../models/answer";

export const createAssignment = async (req, res) => {
  try {
    const { title, author, genre, expiration, content, points } = req.body;

    const assignment = new Assignment({
      title,
      author,
      genre,
      expiration,
      content,
      points,
    });

    await assignment.save();

    res.json(assignment);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

export const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.json(assignments);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

export const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ msg: "Assignment not found" });
    }

    res.json(assignment);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Assignment not found" });
    }
    res.status(500).json({ msg: "Server error" });
  }
};

export const createAssignmentAnswer = async (req, res) => {
  try {
    const { assignment, content, author } = req.body;

    const answer = new Answer({
      content,
      author,
      assignment,
    });

    const assignments = await Assignment.findById(assignment);
    assignments.answers.push(answer);
    await assignments.save();
    await answer.save();

    res.json(answer);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

export const getAssignmentAnswerById = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({ msg: "Answer not found" });
    }

    res.json(answer);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Answer not found" });
    }
    res.status(500).json({ msg: "Server error" });
  }
};

export const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ msg: "Assignment not found" });
    }

    await assignment.remove();

    res.json({ msg: "Assignment removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Assignment not found" });
    }
    res.status(500).json({ msg: "Server error" });
  }
};
