"use client"
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";

export default function Debugger({ data }) {
    const {
        isLogged,
        accessToken,
        refreshToken,
        username,
        userId,
    } = useContext(AuthContext);

    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.code === "Numpad5") {
                setVisible((prev) => !prev);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const isDataReady = (
        typeof isLogged !== "undefined" &&
        typeof username !== "undefined" &&
        typeof accessToken !== "undefined" &&
        typeof refreshToken !== "undefined" &&
        typeof userId !== "undefined" &&
        typeof data !== "undefined"
    );

    if (!visible || !isDataReady) return null;

    return (
        <div className=" fixed top-10 right-10 z-50 bg-gray-100 px-5 py-3 shadow-lg rounded overflow-scroll">
            <div className="max-w-[350px] max-h-[500px] overflow-x-auto overflow-y-auto text-sm">
                <pre>
                    <code>{JSON.stringify(
                        {
                            isLogged,
                            username,
                            accessToken,
                            refreshToken,
                            userId,
                            propsData: data,
                        }, null, 2)}</code>
                </pre>
            </div>
        </div>
    );
}
