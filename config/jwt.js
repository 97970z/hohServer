import { sign, verify } from "jsonwebtoken";
import { config } from "dotenv";

config();

const JWT_SECRET = process.env.JWT_SECRET;

export const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
  };
  const options = {
    expiresIn: "23h",
  };
  const token = sign(payload, JWT_SECRET, options);
  return token;
};

export const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  try {
    const decoded = verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
