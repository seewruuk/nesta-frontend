// components/LoginRegisterLayout.js
"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import LoginImage from "@/public/images/loginimage.png";
import RegisterImage from "@/public/images/registerimage.png";
import Button from "@/components/Button";
import InputField from "@/components/common/InputField";
import { AuthContext } from "@/context/AuthContext";

export default function LoginRegisterLayout({ type = "login" }) {
    const { isLogged } = useContext(AuthContext);
    const router = useRouter();

    // Jeśli jeszcze nie wiadomo, czy zalogowany — pokaż loader
    if (isLogged === null) {
        return (
            <div className="w-screen h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
            </div>
        );
    }

    // Gdy użytkownik zalogowany, przekieruj od razu
    useEffect(() => {
        if (isLogged) {
            router.replace("/dashboard");
        }
    }, [isLogged, router]);

    // Jeśli po walidacji okaże się, że jest zalogowany, nic nie renderujemy
    if (isLogged) return null;

    const renderSection = () => {
        switch (type) {
            case "login":
                return <LoginComponent />;
            case "register":
                return <RegisterComponent />;
            case "forgot-password":
                return <ForgotPasswordComponent />;
            default:
                return <LoginComponent />;
        }
    };

    return (
        <section className="w-screen relative min-h-screen grid place-items-center pt-[146px]">
            <div className="z-10">{renderSection()}</div>
            <div
                className={`bg-blue-500 w-1/2 absolute top-0 bottom-0 z-0 ${
                    type === "login" ? "left-0" : "right-0"
                }`}
            >
                <Image
                    layout="fill"
                    src={type === "login" ? LoginImage : RegisterImage}
                    alt="Auth Image"
                    className="object-cover"
                />
            </div>
        </section>
    );
}

const LoginComponent = () => {
    const { handleLogin } = useContext(AuthContext);
    const [form, setForm] = useState({ username: "", password: "" });

    return (
        <div className="p-[42px] rounded-[24px] bg-white min-w-[450px] text-center flex flex-col gap-[22px]">
            <h2 className="text-black text-[21px] font-bold">Zaloguj się</h2>
            <div className="flex flex-col gap-2">
                <InputField
                    type="text"
                    placeholder="Nazwa użytkownika"
                    value={form.username}
                    onChange={(e) =>
                        setForm((prev) => ({ ...prev, username: e.target.value }))
                    }
                />
                <InputField
                    type="password"
                    placeholder="Hasło"
                    value={form.password}
                    onChange={(e) =>
                        setForm((prev) => ({ ...prev, password: e.target.value }))
                    }
                />
                <div className="flex justify-between text-[9px] text-[#494949]">
                    <p>Nie pamiętasz hasła?</p>
                    <Link href="/forgot-password" className="underline">
                        Przypomnij hasło
                    </Link>
                </div>
            </div>

            <div className="text-[11px] text-[#494949]">
                <p>Nie posiadasz jeszcze konta?</p>
                <Link href="/register" className="underline">
                    Stwórz je tutaj
                </Link>
            </div>

            <Button
                type="button"
                style="primary"
                title="Zaloguj się"
                onClick={() => handleLogin(form)}
            />
        </div>
    );
};

const RegisterComponent = () => {
    const { handleRegister } = useContext(AuthContext);
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    return (
        <div className="p-[42px] rounded-[24px] bg-white min-w-[450px] text-center flex flex-col gap-[22px]">
            <h2 className="text-black text-[21px] font-bold">Zarejestruj się</h2>
            <div className="flex flex-col gap-2">
                <InputField
                    type="text"
                    placeholder="Nazwa użytkownika"
                    value={form.username}
                    onChange={(e) =>
                        setForm((prev) => ({ ...prev, username: e.target.value }))
                    }
                />
                <InputField
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) =>
                        setForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                />
                <InputField
                    type="password"
                    placeholder="Hasło"
                    value={form.password}
                    onChange={(e) =>
                        setForm((prev) => ({ ...prev, password: e.target.value }))
                    }
                />
                <InputField
                    type="password"
                    placeholder="Powtórz hasło"
                    value={form.confirmPassword}
                    onChange={(e) =>
                        setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
                    }
                />
            </div>

            <div className="text-[11px] text-[#494949]">
                <p>Masz już konto?</p>
                <Link href="/login" className="underline">
                    Zaloguj się tutaj
                </Link>
            </div>

            <Button
                type="button"
                style="primary"
                title="Zarejestruj się"
                onClick={() => handleRegister(form)}
            />
        </div>
    );
};

const ForgotPasswordComponent = () => {
    // tu możesz dodać swój handleForgotPassword
    return (
        <div className="p-[42px] rounded-[24px] bg-white min-w-[450px] text-center flex flex-col gap-[22px]">
            <h2 className="text-black text-[21px] font-bold">Zresetuj hasło</h2>
            <div className="flex flex-col gap-2">
                <InputField type="email" placeholder="Email" />
            </div>
            <div className="text-[11px] text-[#494949]">
                <p>Nie masz jeszcze konta?</p>
                <Link href="/register" className="underline">
                    Stwórz je tutaj
                </Link>
            </div>
            <Button type="button" style="primary" title="Wyślij" />
        </div>
    );
};
