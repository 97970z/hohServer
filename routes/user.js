import { Router } from "express";
import { check, validationResult } from "express-validator";
import { verifyToken } from "../config/jwt";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  checkDuplicateName,
} from "../controllers/user";

const router = Router();

// 모든 유저 정보 가져오기
router.get("/", async (req, res) => {
  getAllUsers(req, res);
});

// 특정 유저 정보 가져오기
router.get("/:id", async (req, res) => {
  getUserById(req, res);
});

// 유저 정보 수정하기
router.put(
  "/:id",
  verifyToken,
  [
    check("name", "Name is required").not().isEmpty(),
    // check("email", "Please include a valid email").isEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    updateUser(req, res);
  }
);

// 유저 정보 삭제하기
router.delete("/:id", verifyToken, async (req, res) => {
  deleteUser(req, res);
});

// 유저 이름 중복 체크
router.get("/duplicate-check/:name", async (req, res) => {
  checkDuplicateName(req, res);
});

export default router;
