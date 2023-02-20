import express, { json } from "express";
import cors from "cors";
import connectDB from "./config/db";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import assignmentRouter from "./routes/assignments";

const app = express();

connectDB();

app.use(json());
app.use(cors());
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/assignments", assignmentRouter);

app.listen(3001, () => {
  console.log("Server started on port 3001");
});

app.use(express.static(__dirname + "./build"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "./build/index.html");
});
