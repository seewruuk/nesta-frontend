"use client"
import Transactions from "@/components/Transactions";
import {useContext} from "react";
import {StateContext} from "@/context/StateContext";

export default function Page() {

    const {transactions} = useContext(StateContext)

    return (<>
            <Transactions maxElements={10} transactions={transactions}/>
        </>)
}