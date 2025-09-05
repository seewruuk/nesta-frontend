"use client"
import {useContext} from "react";
import {StateContext} from "@/context/StateContext";
import Messages from "@/components/Messages";

export default function Page() {

    const {messages} = useContext(StateContext)


    return (<>
        <Messages messages={messages}/>
    </>)
}