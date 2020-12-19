import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/api/users/me", (req, res) => {
  return res.send("Hi there");
});

app.listen(PORT, () =>
  console.info(`🚀️ [ Auth ] service is running on port ${PORT} ✈️`)
);
