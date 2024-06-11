import express from "express";
import Userfront from "./userfront";

const app = express();

app.use(express.json());

app.get("/", async (req, res) => {
  const workspace = await Userfront.getTenant();

  return res.json(workspace);
});

export default app;
