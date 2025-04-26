"use client"
import DashboardLayout from "@/components/_layouts/DashboardLayout";
import LikedOffers from "@/components/LikedOffers";
import apartments from "@/data/apartments.json";
import Transactions from "@/components/Transactions";
import Messages from "@/components/Messages";
import {useContext} from "react";
import {StateContext} from "@/context/StateContext";

export default function Page() {
    const {messages, transactions} = useContext(StateContext)


    return (
        <>
            <DashboardLayout>
                <LikedOffers apartments={[...apartments, ...apartments]}/>
                <Transactions maxElements={5} transactions={transactions}/>
                <Messages maxElements={2} messages={messages}/>
            </DashboardLayout>
        </>
    )
}