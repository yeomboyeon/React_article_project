import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";

/**
 * 1. react router dom 설정
 * 2. context provider 설정
 *
 */

/*회원가입 */
function Join() {
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

  const 회원가입 = () => {
    // 여기에 입력한 값이 기억해야 한다.
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

function Login() {
  return <div>Login</div>;
}

function Main() {
  return <div>Main</div>;
}

const StoreContext = React.createContext({});

function App() {
  return (
    <StoreContext.Provider value={{}}>
      <Routes>
        <Route exact path="/" element={<Main />}></Route>
        <Route exact path="/login" element={<Login />}></Route>
        <Route exact path="/join" element={<Join />}></Route>
      </Routes>
    </StoreContext.Provider>
  );
}

export default App;
