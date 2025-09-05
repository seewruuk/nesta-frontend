"use client"
import DashboardElement from "@/components/DashboardElement";
import sectionHeader from "@/lib/sectionHeader";
import generateTransactionLabel from "@/lib/generateTransactionLabel";
import Image from "next/image";
import {icons} from "@/src/icons";
import {useContext} from "react";
import {AuthContext} from "@/context/AuthContext";

export default function Transactions({transactions, maxElements = undefined}) {

    const {accessToken} = useContext(AuthContext);

    return (<DashboardElement>
            {sectionHeader("Ostatnie transakcje")}

            <div className={"text-[16px] text-black"}>
                <div className={"flex justify-between gap-4  opacity-[40%] mb-[24px]"}>
                    <div className={"flex-1"}>Opis</div>
                    <div className={"flex-1"}>ID transakcji</div>
                    <div className={"flex-1"}>Status</div>
                    <div className={"flex-1"}>Data</div>
                    <div className={"flex-1"}>Kwota</div>
                    <div className={""}></div>
                </div>
                <div className={"flex justify-between gap-4 flex-col"}>
                    {transactions.slice(0, maxElements).map((transaction, index) => {
                        return (<div key={index} className={"flex gap-4 items-center"}>
                                <div className={"flex-1 font-semibold"}>{transaction.id}</div>
                                <div className={"flex-1"}>{transaction.id}</div>
                                <div
                                    className={"flex-1 justify-items-start"}>{generateTransactionLabel(transaction.status)}</div>
                                <div className={"flex-1"}>{transaction.date}</div>
                                <div className={"flex-1 font-semibold"}>{transaction.value}</div>
                                <button
                                    className={"relative h-[21px] aspect-square grid place-items opacity-30 hover:opacity-100 transition-all cursor-pointer"}>
                                    <Image src={icons.payment} alt={"payment icon"} fill
                                           className={"object-contain"}/>
                                </button>
                            </div>)
                    })}
                </div>
            </div>
        </DashboardElement>)
}