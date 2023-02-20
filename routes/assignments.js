import { Router } from "express";
import {
  createAssignment,
  getAssignments,
  getAssignmentById,
} from "../controllers/assignments";
import { verifyToken } from "../config/jwt";

const router = Router();

// 과제 생성
router.post("/", async (req, res) => {
  createAssignment(req, res);
});

// 모든 과제 가져오기
router.get("/", async (req, res) => {
  getAssignments(req, res);
});

// 특정 과제 가져오기
router.get("/:id", async (req, res) => {
  getAssignmentById(req, res);
});

export default router;
