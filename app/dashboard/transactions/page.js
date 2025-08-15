"use client"
import DashboardLayout from "@/components/_layouts/DashboardLayout";
import Transactions from "@/components/Transactions";
import {useContext} from "react";
import {StateContext} from "@/context/StateContext";

export default function Page(){

    const {transactions} = useContext(StateContext)

    return(
        <DashboardLayout>
            <Transactions maxElements={10} transactions={transactions}/>
        </DashboardLayout>
    )
}