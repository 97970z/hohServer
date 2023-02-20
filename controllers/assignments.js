import Assignment from "../models/assignment";

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
