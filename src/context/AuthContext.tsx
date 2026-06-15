import { createContext, useContext, useState, type ReactNode } from "react";

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    bestScore: number;
    longestStreak: number;
    totalQuizTaken: number;
    createdAt: string;
    updatedAt: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (data: { token: string; user: User }) => void;
    logout: () => void;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        // const saved = localStorage.getItem("verseiq_user");
        const saved = localStorage.getItem("verseiq_user");
        try {
            return saved && saved !== "undefined" ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const [token, setToken] = useState<string | null>(
        () => localStorage.getItem("verseiq_token") || null,
    );

    const login = (data: { token: string; user: User }) => {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("verseiq_token", data.token);
        localStorage.setItem("verseiq_user", JSON.stringify(data.user));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("verseiq_token");
        localStorage.removeItem("verseiq_user");
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
        localStorage.setItem("verseiq_user", JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider
            value={{ user, token, login, logout, updateUser }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error("useAuth must be used within an AuthProvider");
    return context;
}
