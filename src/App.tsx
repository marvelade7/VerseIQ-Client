import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import QuizPage from "./pages/QuizPage";
import QuizHistory from "./pages/QuizHistory";
import DashboardLayout from "./pages/DashboardLayout";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
    return (
        <>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/signin" element={<SignInPage />} />
                    <Route element={<ProtectedRoute element={<DashboardLayout />} />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/leaderboard" element={<Leaderboard />} />
                        {/* <Route path="/history" element={<History />} /> */}
                        <Route path="/settings" element={<Settings />} />
                    <Route
                        path="/history"
                        element={<ProtectedRoute element={<QuizHistory />} />}
                    />
                    </Route>
                    <Route
                        path="/quiz"
                        element={<ProtectedRoute element={<QuizPage />} />}
                    />
                </Routes>
            </AuthProvider>
        </>
    );
};

export default App;
