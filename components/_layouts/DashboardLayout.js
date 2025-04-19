"use client"
import Link from "next/link";
import LikedOffers from "@/components/LikedOffers";
import apartments from "@/data/apartments.json"
import Transactions from "@/components/Transactions";
import Messages from "@/components/Messages";
import {StateContext} from "@/context/StateContext";
import {useContext} from "react";
import PageTransition from "@/components/PageTransition";

export default function DashboardLayout({children}) {

    const {links} = useContext(StateContext)

    return (
        <>

            <div className={"flex relative"}>
                <div className={"w-[250px] px-[40px] pt-[72px] bg-white min-h-screen"}>
                    <div className={"flex gap-5 flex-col"}>
                        {
                            links.map((item, index) => {
                                return (
                                    <Link href={item.href} key={index}
                                          className={"flex gap-4 hover:text-primary transition-all"}>
                                        <span>o</span>
                                        <div>{item.name}</div>
                                    </Link>
                                )
                            })
                        }
                    </div>
                </div>
                <div className={'flex-grow p-[30px] overflow-x-scroll flex flex-col gap-5 relative'}>
                    {children}
                </div>

            </div>


        </>
    )
}