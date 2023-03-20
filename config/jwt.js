import { sign, verify } from "jsonwebtoken";
import { config } from "dotenv";

config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export const generateToken = (user) => {
  const accessTokenExp = Math.floor(Date.now() / 1000) + 60 * 30; // 1 hour
  const refreshTokenExp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // 1 week
  const payload = {
    id: user.id,
    email: user.email,
  };
  const token = sign({ ...payload, exp: accessTokenExp }, JWT_SECRET);
  const refreshToken = sign(
    { ...payload, exp: refreshTokenExp },
    JWT_REFRESH_SECRET
  );
  return { token, accessTokenExp, refreshToken, refreshTokenExp };
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

export const verifyRefreshToken = (refreshToken) => {
  try {
    const decoded = verify(refreshToken, JWT_REFRESH_SECRET);
    return { success: true, decoded };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
