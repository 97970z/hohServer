import { Router } from "express";
import { check, validationResult } from "express-validator";
import { verifyToken, verifyRefreshToken, generateToken } from "../config/jwt";
import { verify } from "jsonwebtoken";
import { register, login } from "../controllers/auth";
import User from "../models/user";

const router = Router();
const emailVerificationSecret = process.env.EMAIL_VERIFICATION_SECRET;

router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 8 or more characters"
    ).isLength({ min: 8 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    register(req, res);
  }
);

router.get("/verify-email/:token", async (req, res) => {
  const token = req.params.token;

  try {
    const decoded = verify(token, emailVerificationSecret);
    const userId = decoded.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).send("유효하지 않은 이메일 인증입니다.");
    }

    if (user.isVerified) {
      return res.status(400).send("이미 이메일 인증을 완료했습니다.");
    }

    user.isVerified = true;
    await user.save();

    res
      .status(200)
      .send("이메일 인증에 성공했습니다. 사이트로 돌아가 로그인해주세요.");
  } catch (err) {
    console.log(err);
    res.status(500).send("이메일 인증에 실패했습니다.");
  }
});

router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    login(req, res);
  }
);

router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/refresh-token", (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: "No refresh token provided" });
  }

  const { success, decoded, error } = verifyRefreshToken(refreshToken);
  if (!success) {
    return res.status(401).json({ error: "Invalid refresh token: " + error });
  }

  const newTokenData = generateToken(decoded);
  res.status(200).json({
    token: newTokenData.token,
    accessTokenExp: newTokenData.accessTokenExp,
  });
});

router.get("/check-name/:name", async (req, res) => {
  const { name } = req.params;

  const user = await User.findOne({ name });
  // user의 길이가 4자 이상 12자 이하인지 확인
  if (name.length < 4 || name.length > 12) {
    return res
      .status(200)
      .json({ message: "이름은 4자 이상 12자 이하로 입력해주세요." });
  }
  if (!user) {
    return res.status(200).json({ message: "사용 가능한 이름입니다." });
  } else {
    return res.status(200).json({ message: "이미 사용 중 입니다." });
  }
});

router.post("/check-email", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(200).json({ message: "사용 가능한 이메일입니다." });
  }
  return res.status(200).json({ message: "이미 사용 중 입니다." });
});

export default router;
