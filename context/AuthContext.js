"use client"
import {createContext, useState} from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";


export const AuthContext = createContext({});


export default function AuthContextProvider({children}) {

    const router = useRouter();


    const initialState = {
        name: "",
        email: "",
        password: "",
    }

    const [user, setUser] = useState(
        Cookies.get("user") ? JSON.parse(Cookies.get("user")) : initialState
    )
    const [isLogged, setIsLogged] = useState(
        user.name === "" ? false : true
    )

    const handleLogin = (userData) => {
        setUser(userData);
        Cookies.set("user", JSON.stringify(userData), {expires: 7});
        console.log("login!")
    }

    const handleRegister = (userData) => {

        if (userData.password !== userData.confirmPassword) {
            toast.error("Passwords do not match!")
            return;
        }

        setUser(userData);
        Cookies.set("user", JSON.stringify(userData), {expires: 7});
        console.log("register!")

        router.push("/dashboard")
    }


    return (
        <AuthContext.Provider value={{
            user,
            setUser,

            isLogged,
            setIsLogged,

            handleLogin,
            handleRegister,
        }}>
            {children}
        </AuthContext.Provider>
    );
}