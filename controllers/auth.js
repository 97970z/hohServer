import { genSalt, hash, compare } from "bcryptjs";
import nodemailer from "nodemailer";
import { sign } from "jsonwebtoken";
import { generateToken } from "../config/jwt";
import User from "../models/user";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const emailExists = await User.findOne({ email });
    if (emailExists) return res.status(400).send("Email already exists");

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      points: 0,
    });

    try {
      const savedUser = await user.save();

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      const emailVerificationSecret = process.env.EMAIL_VERIFICATION_SECRET;
      const emailToken = sign(
        { userId: savedUser._id },
        emailVerificationSecret,
        { expiresIn: "1d" }
      );
      // local용
      const verificationLink = `http://localhost:3001/api/auth/verify-email/${emailToken}`;
      // aws용
      // const verificationLink = `http://18.210.14.214/api/auth/verify-email/${emailToken}`;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: savedUser.email,
        subject: "Email Verification",
        html: `<p>Click on the following link to verify your email: <a href="${verificationLink}">${verificationLink}</a></p>`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res.status(500).send("Error sending verification email");
        } else {
          console.log("Email sent: " + info.response);
          res.send("Verification email sent");
        }
      });
    } catch (err) {
      console.log(err);
      res.status(400).send("Error saving user");
    }

    const { token, accessTokenExp, refreshToken, refreshTokenExp } =
      generateToken(user);

    res.json({
      token,
      accessTokenExp,
      refreshToken,
      refreshTokenExp,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ msg: "Please verify your email" });
    }

    const { token, accessTokenExp, refreshToken, refreshTokenExp } =
      generateToken(user);

    res.json({
      token,
      accessTokenExp,
      refreshToken,
      refreshTokenExp,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};
