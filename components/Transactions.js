"use client"
import DashboardElement from "@/components/DashboardElement";
import sectionHeader from "@/lib/sectionHeader";
import {useContext} from "react";
import {AuthContext} from "@/context/AuthContext";

export default function Transactions({transactions, maxElements = undefined}) {

    const {accessToken} = useContext(AuthContext);

    return (<DashboardElement>
            {sectionHeader("Ostatnie transakcje")}

            <div>
                asd
            </div>


        </DashboardElement>)
}