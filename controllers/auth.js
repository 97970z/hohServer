import { genSalt, hash, compare } from "bcryptjs";
import { generateToken } from "../config/jwt";
import User from "../models/user";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 존재하는 유저인지 확인
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // 유저 생성
    user = new User({
      name,
      email,
      password,
      points: 0,
    });

    // 패스워드 암호화
    const salt = await genSalt(10);
    user.password = await hash(password, salt);
    await user.save();

    // jwt 토큰 생성
    const token = generateToken(user);

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 존재하는 유저인지 확인
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // 패스워드 확인
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // jwt 토큰 생성
    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};
