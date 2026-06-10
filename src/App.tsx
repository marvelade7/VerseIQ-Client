import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignUpPage from "./pages/SignUpPage";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/signup' element={<SignUpPage/>} />
      </Routes>
    </>
  );
};

export default App;