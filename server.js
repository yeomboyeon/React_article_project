const express = require("express");
const cors = require("cors");
const session = require("express-session");
const app = express();
const port = 4000;

// 임시로 서버에 저장(Mysql 하기 전) , 테스트용
const DB = {
  user: [
    {
      id: "asd",
      pw: "asd",
    },
  ],
};

app.use(express.json());

app.use(
  session({
    secret: "SECRET",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(
  cors({
    origin: true,
    credentials: true, // 외부도메인 쿠키 공유 받기
  })
);

app.get("/", (req, res) => {
  res.send("안녕");
});

app.post("/join", (req, res) => {
  // console.log(req.body);
  const { id, pw } = req.body;

  // 배열에 넣기
  DB.user.push({
    id: id,
    pw: pw,
  });

  // console.log(DB.user);

  res.send({
    code: "success",
    message: "회원가입 완료",
  });
});

app.get("/test", (req, res) => {
  console.log(req.session);
  res.send("//");
});

app.post("/login", (req, res) => {
  // console.log(req.body);
  const { id, pw } = req.body;

  const user = DB.user;
  // console.log(user);

  // 회원가입 성공했는지 여부 확인
  // 세션에 findUser 저장해야 함.
  // 이를 위해서 다운로드 하기 server폴더에 npm install express-session 설치
  const findUser = user.find((item) => {
    return item.id === id && item.pw === pw;
  });
  // console.log(findUser);

  // 세션 저장
  req.session.loginUser = findUser;
  req.session.save();

  res.send("/");
});

app.listen(port, () => {
  console.log("서버 시작");
});
