import { Router } from "express";
import { check, validationResult } from "express-validator";
import { verifyToken } from "../config/jwt";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user";

const router = Router();

router.get("/", async (req, res) => {
  getAllUsers(req, res);
});

router.get("/:id", async (req, res) => {
  getUserById(req, res);
});

router.put(
  "/:id",
  verifyToken,
  [check("name", "Name is required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    updateUser(req, res);
  }
);

router.delete("/:id", verifyToken, async (req, res) => {
  deleteUser(req, res);
});

export default router;
