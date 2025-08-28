"use client"
import Messages from "@/components/Messages";
import {useContext} from "react";
import {StateContext} from "@/context/StateContext";
import UserOffers from "@/components/UserOffers";
import UserApartments from "@/components/UserApartments";
import UserInvoices from "@/components/UserInvoices";

export default function Page() {
    const {messages} = useContext(StateContext)

    return (
            <>
                <UserOffers />
                <UserApartments />
                <UserInvoices />
                <Messages maxElements={2} messages={messages}/>
            </>
    )
}