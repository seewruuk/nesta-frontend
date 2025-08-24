"use client";
import {useContext, useEffect, useState} from "react";
import {usePathname} from "next/navigation";
import {DisplayContext} from "@/context/DisplayContext";
import {AuthContext} from "@/context/AuthContext";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import Link from "next/link";
import {MobileMenu} from "@/components/MobileMenu";

export const links = [
    { name: "Strona główna", link: "/" },
    // { name: "Dashboard", link: "/dashboard" },
    { name: "Apartamenty", link: "/rental-offers" },
    { name: "Profil", link: "/users/k.sewruk" },
    { name: "Posty", link: "/posts" },
];

export default function Navbar() {
    const {displayVersion} = useContext(DisplayContext);
    const {isLogged} = useContext(AuthContext);
    const pathname = usePathname();

    // Guard, żeby uniknąć SSR/CSR mismatch
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    return displayVersion === "desktop" ? (
        <DesktopMenu pathname={pathname} isLogged={isLogged}/>
    ) : (
        <MobileMenu links={links} isLogged={isLogged}/>
    );
}

function DesktopMenu({pathname, isLogged}) {
    const {handleLogout} = useContext(AuthContext);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 0);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <div
            className={`relative w-screen z-50 transition-colors duration-300 ${
                scrolled ? "bg-black/90 backdrop-blur-md" : "bg-white"
            }`}
        >
            <Layout>
                <div
                    className={`navbar flex justify-between items-center text-[15px] h-[100px] ${
                        scrolled ? "text-white" : ""
                    }`}
                >
                      <ul className={`flex gap-8 ${scrolled ? "text-white" : ""}`}>
                          {links.map((l, i) => (
                              <li key={i}>
                                  <Link href={l.link}>
                    <span className="font-[500] transition-all hover:text-primary">
                      {l.name}
                    </span>
                                  </Link>
                              </li>
                          ))}
                      </ul>


                    {/*<div>*/}
                    {/*    <span className={"text-[2"}>*/}
                    {/*            Logo*/}
                    {/*    </span>*/}
                    {/*</div>*/}

                    {isLogged ? (
                        <div className="flex gap-2">
                            <Button
                                type="link"
                                title="Panel użytkownika"
                                onClick="/dashboard"
                                style="primary"
                            />
                            <Button
                                type="button"
                                title="Wyloguj"
                                onClick={() => handleLogout()}
                                style="white"
                            />
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Button
                                type="link"
                                title="Zaloguj się"
                                onClick="/login"
                                style="primary"
                            />
                            <Button
                                type="link"
                                title="Zarejestruj się"
                                onClick="/register"
                                style="white"
                            />
                        </div>
                    )}

                </div>
            </Layout>
        </div>
    );
}
