"use client"
import LoginImage from "@/public/images/loginimage.png"
import RegisterImage from "@/public/images/registerimage.png"
import Image from "next/image";
import Button from "@/components/Button";
import InputField from "@/components/common/InputField";
import Link from "next/link";
import {useContext, useState} from "react";
import {AuthContext} from "@/context/AuthContext";

export default function LoginRegisterLayout({type = "login"}) {

    const {user, setUser, handleLogin, handleRegister} = useContext(AuthContext)


    const renderSection = () => {
        switch (type) {
            case "login":
                return <LoginComponent user={user} setUser={setUser}/>
            case "register":
                return <RegisterComponent user={user} setUser={setUser}/>
            case "forgot-password":
                return <ForgotPasswordComponent user={user} setUser={setUser}/>
            default:
                return <LoginComponent user={user} setUser={setUser}/>
        }
    }

    return (
        <section className="w-screen relative min-h-screen grid place-items-center pt-[146px]">


            <div className="z-10">
                {
                    renderSection()
                }
            </div>

            <div className={`bg-blue-500 w-1/2 absolute top-0 bottom-0 z-0 ${type==="login" ? "left-0" : "right-0"} `}>
                <Image layout="fill" src={type === "login" ? LoginImage : RegisterImage} alt="Login Image"
                       className={"object-cover"}/>
            </div>

        </section>
    )
}


const LoginComponent = ({user, setUser}) => {


    const [initialState, setInitialState] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    })


    return (
        <div className={"p-[42px] rounded-[24px] bg-white min-w-[450px] text-center flex flex-col gap-[22px]"}>
            <h2 className={"text-black text-[21px] font-bold"}>Zaloguj się</h2>
            <div className={"flex flex-col gap-2"}>
                <InputField
                    type={"email"}
                    placeholder={"Email"}
                    value={initialState.name}
                    onChange={(e) => setInitialState({...initialState, name: e.target.value})}
                />
                <InputField
                    type={"password"}
                    placeholder={"Hasło"}
                    value={initialState.password}
                    onChange={(e) => setInitialState({...initialState, password: e.target.value})}
                />
                <div className={"flex justify-between text-[9px] text-[#494949]"}>
                    <p>Nie pamiętasz hasła?</p>
                    <Link href={"/forgot-password"} className={"underline"}>Przypomnij hasło</Link>
                </div>

            </div>

            <div className={"text-[11px] text-[#494949]"}>
                <p>Nie posiadasz jeszcze konta?</p>
                <Link href={"/register"} className={"underline"}>Stwórz je tutaj</Link>
            </div>

            <Button
                type={"button"}
                style={"primary"}
                title={"Zaloguj się"}
            />

        </div>
    )
}

const RegisterComponent = ({user, setUser}) => {


    const [initialState, setInitialState] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    })

    return (
        <div className={"p-[42px] rounded-[24px] bg-white min-w-[450px] text-center flex flex-col gap-[22px]"}>
            <h2 className={"text-black text-[21px] font-bold"}>Zarejestruj się</h2>
            <div className={"flex flex-col gap-2"}>
                <InputField
                    type={"text"}
                    placeholder={"Imię"}
                    value={initialState.name}
                    onChange={(e) => setInitialState({...initialState, name: e.target.value})}
                />
                <InputField
                    type={"email"}
                    placeholder={"Email"}
                    value={initialState.email}
                    onChange={(e) => setInitialState({...initialState, email: e.target.value})}
                />
                <InputField
                    type={"password"}
                    placeholder={"Hasło"}
                    value={initialState.password}
                    onChange={(e) => setInitialState({...initialState, password: e.target.value})}
                />
                <InputField
                    type={"password"}
                    placeholder={"Powtórz hasło"}
                    value={initialState.confirmPassword}
                    onChange={(e) => setInitialState({...initialState, confirmPassword: e.target.value})}
                />
            </div>

            <div className={"text-[11px] text-[#494949]"}>
                <p>Masz już konto?</p>
                <Link href={"/login"} className={"underline"}>Zaloguj się tutaj</Link>
            </div>

            <Button
                type={"button"}
                style={"primary"}
                title={"Zarejestruj się"}
            />

        </div>
    )
}

const ForgotPasswordComponent = ({user, setUser}) => {

    const [initialState, setInitialState] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    })

    return (
        <>
            <div className={"p-[42px] rounded-[24px] bg-white min-w-[450px] text-center flex flex-col gap-[22px]"}>
                <h2 className={"text-black text-[21px] font-bold"}>Zresetuj hasło</h2>
                <div className={"flex flex-col gap-2"}>
                    <InputField
                        type={"email"}
                        placeholder={"Email"}
                        value={initialState.email}
                        onChange={(e) => setInitialState({...initialState, email: e.target.value})}
                    />
                </div>

                <div className={"text-[11px] text-[#494949]"}>
                    <p>Nie masz jeszcze konta?</p>
                    <Link href={"/register"} className={"underline"}>Stwórz je tutaj</Link>
                </div>

                <Button
                    type={"button"}
                    style={"primary"}
                    title={"Wyślij"}
                />

            </div>
        </>
    )
}