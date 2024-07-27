import express from "express";
import cors from "cors";
import "dotenv/config";
import { TransfersRouts } from "./routes/transferRoutes/transfer.Routes";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/transfers", TransfersRouts.execute());

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
