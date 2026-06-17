import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
    const { token, user } = useAuth();
    return token && user ? element : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;