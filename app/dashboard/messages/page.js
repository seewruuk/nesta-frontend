"use client"
import DashboardLayout from "@/components/_layouts/DashboardLayout";
import {useContext} from "react";
import {StateContext} from "@/context/StateContext";
import Messages from "@/components/Messages";

export default function Page(){

    const {messages} = useContext(StateContext)


    return(
        <DashboardLayout>
            <Messages messages={messages}/>
        </DashboardLayout>
    )
}