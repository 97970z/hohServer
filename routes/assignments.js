import { Router } from "express";
import {
  createAssignment,
  getAssignments,
  getAssignmentById,
  createAssignmentAnswer,
  getAssignmentAnswerById,
  deleteAssignment,
  deleteAssignmentAnswer,
} from "../controllers/assignments";

const router = Router();

router.post("/", async (req, res) => {
  createAssignment(req, res);
});

router.post("/answer", async (req, res) => {
  createAssignmentAnswer(req, res);
});

router.get("/answer/:id", async (req, res) => {
  getAssignmentAnswerById(req, res);
});

router.get("/", async (req, res) => {
  getAssignments(req, res);
});

router.get("/:id", async (req, res) => {
  getAssignmentById(req, res);
});

router.delete("/:id", async (req, res) => {
  deleteAssignment(req, res);
});

router.delete("/answer/:id", async (req, res) => {
  deleteAssignmentAnswer(req, res);
});

export default router;
