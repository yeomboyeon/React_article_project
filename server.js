// 기본 서버 설정

const express = require("express");
const cors = require("cors");

const app = express();
const port = 4000;

app.use(
  cors({
    origin: true,
  })
);

app.get("/", (req, res) => {
  res.send("안녕");
});

app.listen(port, () => {
  console.log("서버 시작");
});
