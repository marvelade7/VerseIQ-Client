import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import QuizPage from "./pages/QuizPage";
import QuizHistory from "./pages/QuizHistory";

const App = () => {
    const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
        const token = localStorage.getItem("token");
        return token ? element : <Navigate to="/signin" replace />;
    };
    return (
        <>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/signin" element={<SignInPage />} />
                    <Route
                        path="/dashboard"
                        element={<ProtectedRoute element={<Dashboard />} />}
                    />
                    <Route
                        path="/quiz"
                        element={<ProtectedRoute element={<QuizPage />} />}
                    />
                    <Route path='/history' element={<ProtectedRoute element={<QuizHistory />} />} />
                </Routes>
            </AuthProvider>
        </>
    );
};

export default App;
