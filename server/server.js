const express = require("express");
const cors = require("cors");
const session = require("express-session");

// (1) mysql 연결위한 설정하기
const mysql = require("mysql2");
const db = mysql.createPoolCluster();

const app = express();
const port = 4000;

app.use(express.json());

// Session 설정
// express-session 설치
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
    credentials: true, // 외부 도메인 쿠키 공유 받기
  })
);

// (2) mysql 연결(mysql 최초 호스트 연결설정 창과 동일하게)
// db.add("article_project", { "변경 가능"
db.add("article_project", {
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "article_project",
  port: 3306,
});

// (4) 컬럼 실행할 때마다 추가해야하는 코드를 관리 하는 함수
function 디비실행(query) {
  return new Promise(function (resolve, reject) {
    db.getConnection("article_project", function (error, connection) {
      if (error) {
        console.log("데이터베이스 연결 오류", error);
        reject(true);
      }
      // 실행될 때 커리만 바뀌기 때문에 query로 바꾸기
      connection.query(query, function (error, data) {
        if (error) {
          console.log("쿼리 연결 오류", error);
          reject(true);
        }
        resolve(data); // 성공시
        // console.log(data);
      });
      connection.release();
    });
  });
}

// (3) 비동기를 동기로 변환, promise 객체로 묶기
// resolve, reject 추가
// async await 추가
// (4) 너무 코드가 길기 때문에 함수로 빼서 관리 및 활용
app.get("/", async (req, res) => {
  // console.log("11111"); // 동기로 변환 여부 확인

  // (5) 디비실행 함수 불러오기
  const 데이터 = await 디비실행("SELECT * FROM user");

  // const 데이터 = await new Promise(function (resolve, reject) {

  //   db.getConnection("article_project", function (error, connection) {
  //     if (error) {
  //       console.log("데이터베이스 연결 오류", error);
  //       reject(true);
  //     }
  //     connection.query("SELECT * FROM user", function (error, data) {
  //       if (error) {
  //         console.log("쿼리 연결 오류", error);
  //         reject(true);
  //       }
  //       resolve(data); // 성공시
  //       // console.log(data);
  //       console.log("22222"); // 동기로 변환 여부 확인
  //     });
  //     connection.release();
  //   });
  // });

  // console.log("33333"); // 동기로 변환 여부 확인

  console.log(데이터); // 실제 데이터 가져오는지..
  res.send("안녕 이리로 와야해");
});

app.post("/join", async (req, res) => {
  // console.log(req.body);
  // post 일때 body로 받음
  const { id, pw } = req.body;

  //(7) 결과 변수 저장
  const result = {
    code: "success",
    message: "회원가입 완료",
  };

  // (7) 중복 체크
  const 회원 = await 디비실행(`SELECT * FROM user WHERE id = '${id}'`);
  if (회원.length > 0) {
    result.code = "error";
    result.message = "이미 같은 아이디로 회원가입 되었음";
    res.send(result);
    return;
  }
  console.log(회원);

  // (6) mysql user 테이블에 insert 저장하기
  const query = `INSERT INTO user(id,password,nickname) VALUES('${id}', '${pw}', '지나가는 나그네요')`;
  await 디비실행(query);

  // console.log(DB.user);

  res.send(result);
});

app.get("/test", (req, res) => {
  console.log(req.session);
  res.send("//");
});

// (12)
app.get("/user", (req, res) => {
  res.send(req.session.loginUser);
});

app.post("/login", async (req, res) => {
  // console.log(req.body);
  // post 일때 body로 받음
  const { id, pw } = req.body;

  // (8) id,pw 같은 데이터 있는지 확인
  // 같은 데이터가 존재하면 Session 저장
  // 없으면 메시지 보내주기(회원정보가 존재하지 않습니다.)
  const result = {
    code: "success",
    message: "로그인 완료",
  };
  const 회원 = await 디비실행(
    `SELECT * FROM user WHERE id = '${id}' AND password = '${pw}'`
  );
  if (회원.length > 0) {
    result.code = "error";
    result.message = "회원정보가 존재하지 않습니다.";
    res.send(result);
    return;
  }
  // // 회원가입 성공했는지 여부 확인
  // // 세션에 findUser 저장해야 함.
  // // 이를 위해서 다운로드 하기 server폴더에 npm install express-session 설치
  // const findUser = user.find((item) => {
  //   return item.id === id && item.pw === pw;
  // });
  // // console.log(findUser);

  // // 세션 저장
  // req.session.loginUser = findUser;
  // req.session.save();
  req.session.loginUser = 회원[0];
  req.session.save();

  res.send(result);
});

app.listen(port, () => {
  console.log("서버 시작");
});
