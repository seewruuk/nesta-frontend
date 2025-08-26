"use client";

import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const AuthContext = createContext({
    isLogged: null,
    accessToken: null,
    refreshToken: null,
    username: null,
    userId: null,
    userRoles: [],
    userRole : null,
    handleLogin: () => {},
    handleRegister: () => {},
    handleLogout: () => {},
});

function decodeJwt(token) {
    try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        return decoded;
    } catch (e) {
        console.error("JWT decode error:", e);
        return null;
    }
}

export default function AuthContextProvider({ children }) {
    const router = useRouter();

    const [isLogged, setIsLogged] = useState(Cookies.get("loggedIn") === "true");
    const [accessToken, setAccessToken] = useState(Cookies.get("access_token") || null);
    const [refreshToken, setRefreshToken] = useState(Cookies.get("refresh_token") || null);
    const [username, setUsername] = useState(Cookies.get("username") || null);
    const [userId, setUserId] = useState(Cookies.get("user_id") || null);
    const [userRoles, setUserRoles] = useState(() => {
        const roles = Cookies.get("user_roles");
        return roles ? JSON.parse(roles) : [];
    });
    const [userRole, setUserRole] = useState(null);


    useEffect(() => {
        const id = setInterval(() => {
            setIsLogged(Cookies.get("loggedIn") === "true");
            setAccessToken(Cookies.get("access_token") || null);
            setRefreshToken(Cookies.get("refresh_token") || null);
            setUsername(Cookies.get("username") || null);
            setUserId(Cookies.get("user_id") || null);
            const roles = Cookies.get("user_roles");
            setUserRoles(roles ? JSON.parse(roles) : []);
        }, 1000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        if (accessToken) {
            const decoded = decodeJwt(accessToken);
            if (decoded) {

                console.log("decoded JWT:", decoded); // Log the decoded token to verify its contents
                const id = decoded.sub;
                const uname = decoded.preferred_username;
                const roles = decoded.realm_access?.roles || [];
                const isUserRentier = roles.includes("RENTIER");
                const isUserLandlord = roles.includes("LANDLORD");


                // Zapis do ciastek
                Cookies.set("user_id", id);
                Cookies.set("user_roles", JSON.stringify(roles));
                Cookies.set("username", uname);


                // Aktualizacja stanu
                setUserId(id);
                setUserRoles(roles);
                setUsername(uname);
                setUserRole(isUserRentier ? "RENTIER" : isUserLandlord ? "LANDLORD" : "RENTIER");
            }
        } else {
            Cookies.remove("user_id");
            Cookies.remove("user_roles");
            setUserId(null);
            setUserRoles([]);
            setUsername(null);
            setUserRole(null);
        }
    }, [accessToken]);


    const handleLogin = async ({ username, password }) => {
        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            const json = await res.json();

            if (!res.ok || json.status === "error") {
                toast.error(json.message || "Błąd logowania");
                return;
            }

            Cookies.set("loggedIn", "true");
            Cookies.set("access_token", json.json.access_token);
            Cookies.set("refresh_token", json.json.refresh_token);

            setIsLogged(true);
            setAccessToken(json.json.access_token);
            setRefreshToken(json.json.refresh_token);

            toast.success("Zalogowano pomyślnie");
            router.push("/dashboard");
        } catch (e) {
            console.error("Login error:", e);
            toast.error("Serwis niedostępny");
        }
    };

    const handleRegister = async ({ username, email, password, confirmPassword }) => {
        if (password !== confirmPassword) {
            toast.error("Hasła nie są takie same!");
            return;
        }
        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password, role: "LANDLORD" }),
            });
            const json = await res.json();

            if (!res.ok || json.status === "error") {
                toast.error(json.message || "Błąd rejestracji");
                return;
            }

            toast.success("Zarejestrowano pomyślnie, loguję…");
            await handleLogin({ username, password });
        } catch (e) {
            console.error("Register error:", e);
            toast.error("Serwis niedostępny");
        }
    };


    const handleLogout = async () => {
        try {
            const res = await fetch("/api/logout", { method: "POST" });
            if (!res.ok) {
                toast.error("Błąd podczas wylogowania");
                return;
            }
            // czyścimy ciasteczka i stan
            ["loggedIn", "access_token", "refresh_token", "username", "user_id", "user_roles"].forEach(Cookies.remove);
            setIsLogged(false);
            setAccessToken(null);
            setRefreshToken(null);
            setUsername(null);
            setUserId(null);
            setUserRoles([]);

            toast.success("Wylogowano pomyślnie");
            router.push("/");
        } catch (e) {
            console.error("Logout error:", e);
            toast.error("Serwis niedostępny");
        }
    };

    return (
        <AuthContext.Provider
            value={{
                isLogged,
                accessToken,
                refreshToken,
                username,
                userId,
                userRoles,
                handleLogin,
                handleRegister,
                handleLogout,
                setIsLogged,
                userRole
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}