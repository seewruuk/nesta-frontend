import DashboardElement from "@/components/DashboardElement";
import sectionHeader from "@/lib/sectionHeader";
import generateTransactionLabel from "@/lib/generateTransactionLabel";

export default function Transactions({transactions, maxElements = undefined}) {

    return (
        <DashboardElement>
            {
                sectionHeader("Ostatnie transakcje")
            }

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
                {
                        transactions.slice(0, maxElements).map((transaction, index) => {
                            return (
                                <div key={index} className={"flex gap-4 items-center"}>
                                    <div className={"flex-1 font-semibold"}>{transaction.id}</div>
                                    <div className={"flex-1"}>{transaction.id}</div>
                                    <div className={"flex-1 justify-items-start"}>{generateTransactionLabel(transaction.status)}</div>
                                    <div className={"flex-1"}>{transaction.date}</div>
                                    <div className={"flex-1 font-semibold"}>{transaction.value}</div>
                                    <div className={"font-semibold"}>o</div>
                                </div>
                            )
                        })
                    }
                </div>

            </div>
        </DashboardElement>
    )
}