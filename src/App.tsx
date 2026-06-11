import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
;

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/signup' element={<SignUpPage/>} />
        <Route path='/signin' element={<SignInPage/>} />
        <Route path='/login' element={<Navigate to="/signin" />} />
      </Routes>
    </>
  );
};

export default App;