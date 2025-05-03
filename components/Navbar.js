"use client";
import {useContext, useEffect, useState} from "react";
import {usePathname} from "next/navigation";
import {DisplayContext} from "@/context/DisplayContext";
import Layout from "@/components/Layout";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import {MobileMenu} from "@/components/MobileMenu";


export const links = [
    {name: "Strona główna", link: '/'},
    {name: "Dashboard", link: '/dashboard'},
    {name: "Apartamenty", link: "/apartments",},
];


export default function Navbar() {
    const [mounted, setMounted] = useState(false);
    const {displayVersion} = useContext(DisplayContext);
    const pathname = usePathname();


    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    switch (displayVersion) {
        case "desktop":
            return <DesktopMenu pathname={pathname}/>;
        case "mobile":
            return <MobileMenu links={links}/>;
        default:
            return null;
    }
}

const DesktopMenu = ({pathname}) => {

    const baseUrl = "/";

    const [activeMenu, setActiveMenu] = useState(null); // Trzymanie aktywnego menu
    const [timeoutId, setTimeoutId] = useState(null); // Trzymanie ID timeoutu
    const [scrolled, setScrolled] = useState(false); // Stan określający, czy przewinięto stronę

    // Funkcja obsługująca zmianę stanu na podstawie scrolla
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        // Czyszczenie nasłuchiwacza podczas odmontowywania komponentu
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handleMouseEnter = (index) => {
        if (timeoutId) clearTimeout(timeoutId); // Anulowanie timeoutu
        setActiveMenu(index);
    };

    const handleMouseLeave = () => {
        const id = setTimeout(() => {
            setActiveMenu(null); // Ukrywanie menu z opóźnieniem
        }, 200); // 200ms opóźnienia
        setTimeoutId(id);
    };

    return (
        <div
            className={`fixed w-screen z-50 transition-colors duration-300 ${
                scrolled ? "bg-black/90 backdrop-blur-md" : "bg-white"
            }`}
        >

            <Layout>
                <div
                    className={`navbar ${
                        scrolled ? "text-white" : ""
                    } flex justify-between items-center text-[15px] h-[100px]`}
                >
                    <div>
                        <Link href={"/"}>
                            {/*<Image*/}
                            {/*    src={*/}
                            {/*        scrolled ? `${baseUrl}/assets/logo-white.svg` : */}
                            {/*    }*/}
                            {/*    alt={"Galeria Mentis Logo"}*/}
                            {/*    width={220}*/}
                            {/*    height={50}*/}
                            {/*/>*/}
                        </Link>
                    </div>
                    <div className={"flex items-center gap-[24px]"}>
                        <ul className={`flex gap-8 ${scrolled ? "text-white" : ""}`}>
                            {links.map((link, index) => {
                                return (
                                    <li key={index}>
                                        <Link href={link.link}>
                                            <span
                                                className={
                                                    `font-[500] transition-all hover:text-primary ${
                                                        scrolled ? "text-white" : ""
                                                    }`
                                                }
                                            >
                                                {link.name}
                                            </span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>

                        <Button
                            type={"link"}
                            title={`Zaloguj się`}
                            onClick={"/login"}
                            style={"primary"}
                        />
                        <Button
                            type={"link"}
                            title={`Zarejestruj się`}
                            onClick={"/register"}
                            style={"white"}
                        />
                    </div>
                </div>
            </Layout>
        </div>
    );
};

