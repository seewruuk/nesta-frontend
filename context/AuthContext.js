// context/AuthContext.js
"use client";

import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const AuthContext = createContext({
    isLogged: null,
    accessToken: null,
    refreshToken: null,
    handleLogin: () => {},
    handleRegister: () => {},
    handleLogout: () => {},
});

export default function AuthContextProvider({ children }) {
    const router = useRouter();

    // null = jeszcze nie zweryfikowano, true/false = status zalogowania
    const [isLogged, setIsLogged] = useState(() => Cookies.get("loggedIn") === "true");
    const [accessToken, setAccessToken] = useState(() => Cookies.get("access_token") || null);
    const [refreshToken, setRefreshToken] = useState(() => Cookies.get("refresh_token") || null);

    // Pollujemy cookie co sekundę, żeby reagować na zmiany (np. wylogowanie w nowej karcie)
    useEffect(() => {
        const id = setInterval(() => {
            setIsLogged(Cookies.get("loggedIn") === "true");
            setAccessToken(Cookies.get("access_token") || null);
            setRefreshToken(Cookies.get("refresh_token") || null);
        }, 1000);
        return () => clearInterval(id);
    }, []);

    // Funkcja logowania
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

            // Ustawienie cookie i stan po zalogowaniu
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

    // Funkcja rejestracji
    const handleRegister = async ({ username, email, password, confirmPassword }) => {
        if (password !== confirmPassword) {
            toast.error("Hasła nie są takie same!");
            return;
        }

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
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

    // Funkcja wylogowania
    const handleLogout = async () => {
        try {
            const res = await fetch("/api/logout", { method: "POST" });
            if (!res.ok) {
                toast.error("Błąd podczas wylogowania");
                return;
            }

            // Usunięcie cookie i aktualizacja stanu
            Cookies.remove("loggedIn");
            Cookies.remove("access_token");
            Cookies.remove("refresh_token");
            setIsLogged(false);
            setAccessToken(null);
            setRefreshToken(null);

            toast.success("Wylogowano pomyślnie");
            router.push("/");
        } catch (e) {
            console.error("Logout error:", e);
            toast.error("Serwis niedostępny");
        }
    };

    return (
        <AuthContext.Provider
            value={{ isLogged, accessToken, refreshToken, handleLogin, handleRegister, handleLogout }}
        >
            {children}
        </AuthContext.Provider>
    );
}