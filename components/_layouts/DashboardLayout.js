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

export default function DashboardLayout({children}) {

    const {links} = useContext(StateContext)
    const {handleLogout} = useContext(AuthContext);

    return (
        <>
            <div className={"flex relative min-h-screen"}>


                <div className={"w-1/6 px-[48px] py-[32px] bg-white flex flex-col justify-between"}>
                    <div className={"flex-grow flex flex-col justify-start items-start gap-[52px]"}>
                        <div>
                            <Link href={"/"} className={"hover:opacity-50 transition-all"}>
                                <div className={"relative aspect-video h-[62px] "}>
                                    <Image src={LogoMain} alt={"Nesta Logo main"} layout={"fill"}
                                           className={"object-contain"}/>
                                </div>
                            </Link>
                        </div>

                        <div className={"flex gap-5 flex-col"}>
                            <div className={"text-[16px] font-semibold pb-[32px] uppercase"}>Overview</div>
                            {
                                links.map((item, index) => {
                                    return (
                                        <Link href={item.href} key={index}
                                              className={"flex gap-4 hover:text-primary transition-all items-center"}>
                                            <div className={"relative aspect-square h-[32px] grid place-items-center"}>
                                                <Image src={item.icon} alt={item + index} layout={"fill"}
                                                       className={"object-contain p-1"}/>
                                            </div>
                                            <div>{item.name}</div>
                                        </Link>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div>
                        <div className={"flex gap-5 flex-col"}>
                            <div className={"text-[16px] font-semibold pb-[32px] uppercase"}>Settings</div>

                            <Link href={"/"}
                                  className={"flex gap-4 hover:text-primary transition-all items-center"}>
                                <div className={"relative aspect-square h-[32px] grid place-items-center"}>
                                    <Image src={icons.dashboard} alt={"settings icon"} layout={"fill"}
                                           className={"object-contain p-1"}/>
                                </div>
                                <div>Settings</div>
                            </Link>
                            <div
                                onClick={() => handleLogout()}
                                className={"flex gap-4 text-red-500 transition-all items-center cursor-pointer"}>
                                <div className={"relative aspect-square h-[32px] grid place-items-center"}>
                                    <Image src={icons.logout} alt={"logout icon"} layout={"fill"}
                                           className={"object-contain p-1"}/>
                                </div>
                                <div>Logout</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={'w-4/6 p-[30px] overflow-x-scroll flex flex-col gap-5 relative'}>
                    {children}
                </div>



                <div className={"w-1/6 px-[48px] py-[32px] bg-white flex flex-col justify-between"}>
                    <div className={"flex-grow flex flex-col justify-start items-start gap-[52px]"}>
                        <span>Profile information</span>
                    </div>
                    <div>
                        <span>asd</span>
                    </div>
                </div>
            </div>
        </>
    )
}