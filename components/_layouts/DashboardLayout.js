"use client"
import Link from "next/link";
import {StateContext} from "@/context/StateContext";
import {useContext} from "react";
import Image from "next/image";
import LogoMain from "@/public/logo.svg"
import {icons} from "@/src/icons";
import {AuthContext} from "@/context/AuthContext";
import ProfileWidget from "@/components/ProfileWidget";

export default function DashboardLayout({children}) {
    const {links} = useContext(StateContext);
    const {handleLogout, isLogged, accessToken} = useContext(AuthContext);
    if (isLogged === null) {
        return (<div className="w-screen h-screen grid place-items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"/>
        </div>);
    }
    if (!isLogged || !accessToken) {
        return null;
    }

    return (<>
        <div className="relative flex h-[calc(100vh-100px)] overflow-hidden">

            <aside className="w-1/6 shrink-0 px-[48px] py-[32px] bg-white flex flex-col justify-between h-full">
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
                        {links.map((item, index) => (<Link
                            href={item.href}
                            key={index}
                            className="flex gap-4 hover:text-primary transition-all items-center"
                        >
                            <div className="relative aspect-square h-[32px] grid place-items-center">
                                <Image src={item.icon} alt={`${item.name}-${index}`} fill
                                       className="object-contain p-1"/>
                            </div>
                            <div>{item.name}</div>
                        </Link>))}
                    </nav>
                </div>

                <div>
                    <div className="flex gap-5 flex-col">
                        <div className="text-[16px] font-semibold pb-[32px] uppercase">Opcje</div>
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

            <main
                className="w-4/6 px-[30px] py-[30px] flex flex-col gap-5 relative h-full overflow-y-auto overflow-x-hidden overscroll-contain">
                {children}
            </main>

            <aside className="w-1/6 shrink-0 px-[48px] py-[32px] bg-white flex flex-col justify-between h-full">
                <ProfileWidget/>
            </aside>
        </div>
    </>)
}
