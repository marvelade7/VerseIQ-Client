import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import QuizPage from "./pages/QuizPage";
import QuizHistory from "./pages/QuizHistory";
import DashboardLayout from "./pages/DashboardLayout";
import Profile from "./pages/Profile";
import History from "./pages/History";
import Leaderboard from "./pages/Leaderboard";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
    // const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
    //     const token = localStorage.getItem("verseiq_token");
    //     return token ? element : <Navigate to="/signin" replace />;
    // };
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
                        <Route path="/history" element={<History />} />
                        <Route path="/settings" element={<Settings />} />
                        {/* etc. */}
                    </Route>
                    <Route
                        path="/quiz"
                        element={<ProtectedRoute element={<QuizPage />} />}
                    />
                    <Route
                        path="/history"
                        element={<ProtectedRoute element={<QuizHistory />} />}
                    />
                </Routes>
            </AuthProvider>
        </>
    );
};

export default App;
