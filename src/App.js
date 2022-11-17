import React from "react";
import "./App.css";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

console.clear();

// 도메인이 다른 포트 번호가 다른데 쿠키 공유가 안되는데 공유를 가능하게 해줌
axios.defaults.withCredentials = true;

/**
 * 1. react router dom 설정
 * 2. context provider 설정
 * 3. 회원가입 설정
 * 4. 서버 연동
 * 5. 로그인 설정
 * 6. 세션 저장
 * 7. 서버 연동
 * 8. mysql 연동
 * 9. git 연동
 */

// 게시글 작성
/**제목,내용 입력 내용이 state 저장 후 작성하기 누르면 서버에 요청보내기 */
function Write() {
  const { loginUser } = React.useContext(StoreContext);
  const navigation = useNavigate();

  const [data, setData] = React.useState({
    title: "",
    body: "",
  });

  const 데이터변경 = (event) => {
    const name = event.target.name;
    const cloneData = { ...data };
    cloneData[name] = event.target.value;
    setData(cloneData);
  };

  const 게시글작성 = async () => {
    await axios({
      url: "http://localhost:4000/article",
      method: "POST",
      data: data,
    })
      .then((response) => {
        // console.log(res.data);
        if (response.data.code === "success") {
          alert(response.data.message);
          navigation("/");
        }
      })
      .catch((e) => {
        console.log("게시글 작성 에러", e);
      });
  };

  // 게시글 작성 페이지 html
  return (
    <div style={{ display: "flex", flexDirection: "column", padding: 12 }}>
      <h2>게시글 작성</h2>
      <h3>제목</h3>
      <input name="title" onChange={데이터변경} />
      <h3>내용</h3>
      <textarea
        name="body"
        onChange={데이터변경}
        clos="50"
        rows="10"
      ></textarea>
      <button onClick={게시글작성} type="button" style={{ marginTop: 12 }}>
        작성하기
      </button>
    </div>
  );
}

/*회원가입 */
function Join() {
  const navigation = useNavigate();

  const [data, setData] = React.useState({
    id: "",
    pw: "",
  });

  const 데이터변경 = (event) => {
    // 변경 값 확인
    // alert(event.target.name);
    const name = event.target.name;

    const cloneData = { ...data };

    // 클론데이타에 name [배열]값 저장
    // 받을 값이 여러개여도 이거 하나로 한번에 받아버리기 위해서
    cloneData[name] = event.target.value;
    // console.log(cloneData);
    // 입력된 값이 setData에 의해서 변경(cloneData에 저장 > 애는 data)
    setData(cloneData);
  };

  const 회원가입 = async () => {
    // 여기에 입력한 값이 기억해야 한다.
    await axios({
      url: "http://localhost:4000/join",
      method: "POST", // GET : 가져올때, POST: 생성할때
      data: data, //  GET : params, POST: data
    })
      .then((res) => {
        // console.log(res.data);
        const { code, message } = res.data;

        if (code === "success") {
          alert(message);
          navigation("/login");
        }
      })
      .catch((e) => {
        console.log("join 에러", e);
      });
    console.log(data); // 입력된 값이 저장됨을 확인
  };

  // 화면에 보여질 입력창 입력
  //
  return (
    <div>
      <input type="text" name="id" onChange={데이터변경} />
      <input type="password" name="pw" onChange={데이터변경} />
      <button type="button" onClick={회원가입}>
        회원가입
      </button>
    </div>
  );
}

/*로그인*/
function Login() {
  const navigation = useNavigate();

  const [data, setData] = React.useState({
    id: "",
    pw: "",
  });

  const 데이터변경 = (event) => {
    const name = event.target.name;
    const cloneData = { ...data };
    cloneData[name] = event.target.value;
    setData(cloneData);
  };

  const 로그인 = async () => {
    await axios({
      url: "http://localhost:4000/login",
      method: "POST",
      data: data,
    })
      // (9)
      .then((res) => {
        alert(res.data.message);

        if (res.data.code === "success") {
          window.location.href = "/";
        }
        // console.log(res.data);
      })
      .catch((e) => {
        console.log("login 에러", e);
      });
    console.log(data);
  };

  return (
    <div>
      <input name="id" onChange={데이터변경} />
      <input name="pw" onChange={데이터변경} />
      <button type="button" onClick={로그인}>
        로그인
      </button>
    </div>
  );
}

/*게시글 상세정보 */
function Article() {
  const { seq } = useParams();
  const [article, setArticle] = React.useState({});

  /**게시글 상세정보 가져오기 */
  const 게시판상세정보가져오기 = async () => {
    await axios({
      url: "http://localhost:4000/article_row",
      params: {
        seq: seq,
      },
    }).then((response) => {
      // console.log(response.data);
      setArticle(response.data);
    });
  };

  React.useEffect(() => {
    게시판상세정보가져오기();
  }, []);

  // 댓글 불러오고 저장하기
  // article_row 서버 호출시 댓글 정보까지 같이 가져오게 하기
  // state에 댓글 저장, 서버 요청, 댓글 테이블에 등록
  const [replyText, setReplyText] = React.useState("");
  const 댓글정보저장 = (event) => {
    setReplyText(event.target.value);
  };

  const 댓글쓰기 = async () => {
    await axios({
      url: "http://localhost:4000/reply",
      method: "POST",
      data: {
        replyText: replyText,
        seq: seq,
      },
    }).then((res) => {});
  };

  return (
    <div className="ui-wrap">
      <div className="ui-body-wrap">
        <h2>{article.title}</h2>
        <div className="ui-body">
          <p>{article.body}</p>
        </div>

        <h3>댓글</h3>

        <div className="ui-reply">
          <div>댓글이 없습니다</div>
        </div>

        <form className="ui-reply-form">
          <textarea onChange={댓글정보저장}></textarea>
          {/* {replyText} 댓글정보 저장되는지 확인*/}
          <button className="ui-blue-button" onClick={댓글쓰기}>
            댓글쓰기
          </button>
        </form>
      </div>
    </div>
  );
}

// 메인 페이지
function Main() {
  const navigation = useNavigate();
  const { loginUser } = React.useContext(StoreContext);

  /** article 전부 가져와서 main 페이지에 보여주기
   * css 꾸며주기
   * useState(가져온거 저장), useEffect(서버에서 가져오기) 활용
   */

  const [article, setArticle] = React.useState([]);

  const 게시글정보가져오기 = async () => {
    await axios({
      url: "http://localhost:4000/article",
      method: "GET",
    }).then((response) => {
      // console.log(response.data);
      setArticle(response.data);
    });
  };

  React.useEffect(() => {
    // alert("실행 여부 확인");
    게시글정보가져오기();
  }, []);

  const 글등록페이지이동 = () => {
    navigation("/write");
  };

  return (
    <div className="ui-wrap">
      {/* <h2>{loginUser.nickname}님 안녕하세요!</h2> */}
      <button className="ui-green-button" onClick={글등록페이지이동}>
        글등록
      </button>
      <table className="ui-table">
        <thead>
          <tr>
            <th>제목</th>
            <th>내용</th>
            <th>작성자</th>
          </tr>
        </thead>
        <tbody>
          {article.length > 0 &&
            article.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item.title}</td>
                  <td>{item.body}</td>
                  <td>{item.nickname}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

const StoreContext = React.createContext({});

function App() {
  // (10) 로그인 정보 가져오기
  const [loginUser, setLoginUser] = React.useState({});

  //(11)서버 새로고침 될 때마다 정보 보내주기
  const 세션정보가져오기 = async () => {
    await axios({
      url: "http://localhost:4000/user",
    }).then((res) => {
      console.log(res.data);

      setLoginUser(res.data);
    });
  };

  React.useEffect(() => {
    세션정보가져오기();
  }, []);

  return (
    <StoreContext.Provider value={{ loginUser }}>
      <Routes>
        <Route exact path="/" element={<Main />}></Route>
        <Route exact path="/login" element={<Login />}></Route>
        <Route exact path="/join" element={<Join />}></Route>
        <Route exact path="/write" element={<Write />}></Route>
        <Route exact path="/article/:seq" element={<Article />}></Route>
      </Routes>
    </StoreContext.Provider>
  );
}

export default App;
