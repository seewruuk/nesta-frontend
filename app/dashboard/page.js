"use client"
import DashboardLayout from "@/components/_layouts/DashboardLayout";
import LikedOffers from "@/components/LikedOffers";
import apartments from "@/data/apartments.json";
import Transactions from "@/components/Transactions";
import Messages from "@/components/Messages";
import {useContext} from "react";
import {StateContext} from "@/context/StateContext";
import PageTransition from "@/components/PageTransition";
import YourOffers from "@/components/YourOffers";
import AddRentaOfferWidget from "@/components/AddApartmentWidget";
import UserOffers from "@/components/UserOffers";

export default function Page() {
    const {messages, transactions} = useContext(StateContext)

    return (
            <>
                <AddRentaOfferWidget />
                <UserOffers />
                {/*<LikedOffers apartments={[...apartments, ...apartments]}/>*/}
                <Transactions maxElements={5} transactions={transactions}/>
                <Messages maxElements={2} messages={messages}/>
            </>
    )
}