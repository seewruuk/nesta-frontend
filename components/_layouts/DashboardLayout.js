"use client"
import Link from "next/link";
import LikedOffers from "@/components/LikedOffers";
import apartments from "@/data/apartments.json"
import Transactions from "@/components/Transactions";
import Messages from "@/components/Messages";
import {StateContext} from "@/context/StateContext";
import {useContext} from "react";
import PageTransition from "@/components/PageTransition";
import Image from "next/image";
import LogoMain from "@/public/logo.svg"
import {icons} from "@/src/icons";
import {AuthContext} from "@/context/AuthContext";
import ProfileWidget from "@/components/ProfileWidget";
import Debugger from "@/components/Debugger";

export default function DashboardLayout({children}) {

    const {links} = useContext(StateContext)
    const {handleLogout} = useContext(AuthContext);

    return (
        <>
            <div className="flex relative min-h-screen overflow-y-auto">

                {/* Lewa kolumna (zawsze stała szerokość) */}
                <aside className="w-1/6 shrink-0 px-[48px] py-[32px] bg-white flex flex-col justify-between">
                    <div className="flex-grow flex flex-col justify-start items-start gap-[52px]">
                        <div>
                            <Link href={"/"} className="hover:opacity-50 transition-all">
                                <div className="relative aspect-video h-[62px]">
                                    <Image src={LogoMain} alt={"Nesta Logo main"} fill className="object-contain"/>
                                </div>
                            </Link>
                        </div>

                        <nav className="flex gap-5 flex-col">
                            <div className="text-[16px] font-semibold pb-[32px] uppercase">Nawigacja</div>
                            {links.map((item, index) => (
                                <Link
                                    href={item.href}
                                    key={index}
                                    className="flex gap-4 hover:text-primary transition-all items-center"
                                >
                                    <div className="relative aspect-square h-[32px] grid place-items-center">
                                        <Image src={item.icon} alt={`${item.name}-${index}`} fill className="object-contain p-1"/>
                                    </div>
                                    <div>{item.name}</div>
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div>
                        <div className="flex gap-5 flex-col">
                            <div className="text-[16px] font-semibold pb-[32px] uppercase">Opcje</div>

                            {/*<Link href={"/"} className="flex gap-4 hover:text-primary transition-all items-center">*/}
                            {/*    <div className="relative aspect-square h-[32px] grid place-items-center">*/}
                            {/*        <Image src={icons.dashboard} alt={"settings icon"} fill className="object-contain p-1"/>*/}
                            {/*    </div>*/}
                            {/*    <div>Ustawienia</div>*/}
                            {/*</Link>*/}


                            <button
                                onClick={() => handleLogout()}
                                className="flex gap-4 text-red-500 transition-all items-center cursor-pointer"
                            >
                                <div className="relative aspect-square h-[32px] grid place-items-center">
                                    <Image src={icons.logout} alt={"logout icon"} fill className="object-contain p-1"/>
                                </div>
                                <div>Logout</div>
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Środkowa kolumna (treść) */}
                <main className="w-4/6 px-[30px] py-[30px] overflow-x-auto flex flex-col gap-5 relative">
                    {children}
                </main>

                {/* Prawa kolumna – zawsze renderowana (ProfileWidget ma własny skeleton) */}
                <ProfileWidget/>
            </div>
        </>
    )
}
