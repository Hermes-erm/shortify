import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRouter from "./routes/apiRouter.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.listen(process.env.PORT, (error) => {
  error
    ? console.log("Error while running server : ", error)
    : console.log(`server running on port: ${process.env.PORT}`);
});

export default app;
