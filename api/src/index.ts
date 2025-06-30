import express from "express";
import testRoutes from "./routes/test";

const app = express();
app.use(express.json());

app.use("/api", testRoutes); // ⬅️ ici

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
