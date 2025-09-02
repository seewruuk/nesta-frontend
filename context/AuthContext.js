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
    userEmail: null,
    userRoles: [],
    userRole: null,
    handleLogin: () => {},
    handleRegister: () => {},
    handleLogout: () => {},
});

function decodeJwt(token) {
    try {
        const payload = token.split(".")[1];
        const decoded = JSON.parse(atob(payload));
        return decoded;
    } catch (e) {
        console.error("JWT decode error:", e);
        return null;
    }
}

function isExpired(token) {
    const d = decodeJwt(token);
    if (!d?.exp) return false;
    return Date.now() / 1000 >= d.exp;
}

export default function AuthContextProvider({ children }) {
    const router = useRouter();

    const [isLogged, setIsLogged] = useState(Cookies.get("loggedIn") === "true");
    const [accessToken, setAccessToken] = useState(Cookies.get("access_token") || null);
    const [refreshToken, setRefreshToken] = useState(Cookies.get("refresh_token") || null);
    const [username, setUsername] = useState(Cookies.get("username") || null);
    const [userId, setUserId] = useState(Cookies.get("user_id") || null);
    const [userEmail, setUserEmail] = useState(null);
    const [userRoles, setUserRoles] = useState(() => {
        const roles = Cookies.get("user_roles");
        return roles ? JSON.parse(roles) : [];
    });
    const [userRole, setUserRole] = useState(null);

    // Keep state in sync with cookies (simple polling)
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

    // Derive identity from token
    useEffect(() => {
        if (accessToken) {
            if (isExpired(accessToken)) {
                // Expired: clear and bounce if on a protected page
                [
                    "loggedIn",
                    "access_token",
                    "refresh_token",
                    "username",
                    "user_id",
                    "user_roles",
                ].forEach((n) => Cookies.remove(n));
                setIsLogged(false);
                setAccessToken(null);
                setRefreshToken(null);
                setUsername(null);
                setUserId(null);
                setUserRoles([]);
                setUserRole(null);
                setUserEmail(null);
                if (typeof window !== "undefined" && window.location.pathname.startsWith("/dashboard")) {
                    router.replace("/login?reason=expired");
                }
                return;
            }

            const decoded = decodeJwt(accessToken);
            if (decoded) {
                const id = decoded.sub;
                const email = decoded.email;
                const uname = decoded.preferred_username;
                const roles = decoded.realm_access?.roles || [];
                const isUserRentier = roles.includes("RENTIER");
                const isUserLandlord = roles.includes("LANDLORD");

                // Persist minimal info in cookies
                Cookies.set("user_id", id, { sameSite: "Lax", secure: true });
                Cookies.set("user_roles", JSON.stringify(roles), { sameSite: "Lax", secure: true });
                Cookies.set("username", uname, { sameSite: "Lax", secure: true });

                setUserId(id);
                setUserRoles(roles);
                setUsername(uname);
                setUserEmail(email);
                setUserRole(isUserRentier ? "RENTIER" : isUserLandlord ? "LANDLORD" : "RENTIER");
            }
        } else {
            Cookies.remove("user_id");
            Cookies.remove("user_roles");
            setUserId(null);
            setUserRoles([]);
            setUsername(null);
            setUserRole(null);
            setUserEmail(null);
        }
    }, [accessToken, router]);

    // Extra client-side guard (middleware already blocks on the server edge)
    useEffect(() => {
        if (typeof window === "undefined") return;
        const onDashboard = window.location.pathname.startsWith("/dashboard");
        if (onDashboard && (!isLogged || !accessToken)) {
            router.replace("/login");
        }
    }, [isLogged, accessToken, router]);

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

            Cookies.set("loggedIn", "true", { sameSite: "Lax", secure: true });
            Cookies.set("access_token", json.json.access_token, { sameSite: "Lax", secure: true });
            Cookies.set("refresh_token", json.json.refresh_token, { sameSite: "Lax", secure: true });

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

    const handleRegister = async ({ username, email, password, confirmPassword, status = "RENTIER" }) => {
        if (password !== confirmPassword) {
            toast.error("Hasła nie są takie same!");
            return;
        }
        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password, role: status }),
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
            const res = await fetch("/api/logout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken, accessToken }),
            });

            if (!res.ok) {
                toast.error("Błąd podczas wylogowania");
                return;
            }

            await res.json();

            [
                "loggedIn",
                "access_token",
                "refresh_token",
                "username",
                "user_id",
                "user_roles",
            ].forEach((n) => Cookies.remove(n));

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
                userRole,
                userEmail,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
