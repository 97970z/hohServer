import express, { json } from "express";
import cors from "cors";
import connectDB from "./config/db";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import assignmentRouter from "./routes/assignments";

const app = express();

connectDB();

app.use(json());

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/assignments", assignmentRouter);

app.listen(3001, () => {
  console.log("Server started on port 3001");
});

// local용
const path = "/Users/user/Project/HelperOfHomework/client/build";
// aws용
// const path = "/home/ubuntu/hoh/client/build";
app.use(express.static(path));

app.get("/", (req, res) => {
  res.sendFile(path + "/index.html");
});
