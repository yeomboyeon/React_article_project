import React from "react";
import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";

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
 */

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

function Main() {
  return <div>Main</div>;
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
      </Routes>
    </StoreContext.Provider>
  );
}

export default App;
