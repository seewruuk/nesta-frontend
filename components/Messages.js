import DashboardElement from "@/components/DashboardElement";
import sectionHeader from "@/lib/sectionHeader";
import formatDate from "@/lib/formatDate";

export default function Messages({messages, maxElements = 4}) {
    return (
        <DashboardElement>
            {sectionHeader("Wiadomości")}
            <div className={"flex flex-col gap-4"}>
                {
                    messages.slice(0, maxElements).map((item, index) => {
                        return (
                            <div
                                key={item + index}
                                className={"flex gap-4"}
                            >
                                <div
                                    className={"aspect-square h-[74px] rounded-full border-2 border-primary bg-black/10"}/>
                                <div className={"grow flex justify-between items-center"}>
                                    <div>
                                        <div className={"flex gap-2 items-center"}>
                                            {
                                                !item.messages[0].isRead && (
                                                    <div className={"aspect-square h-[17px] rounded-full bg-primary"}/>
                                                )
                                            }
                                            <div className={"font-semibold"}>{item.from}</div>
                                        </div>
                                        <div
                                            className={`${item.messages[0].isRead ? "font-semibold" : ""} mt-[6px]`}>{item.messages[0].text}</div>
                                    </div>
                                    <div>
                                        <div
                                            className={"text-[16px] font-semibold"}>{formatDate(item.messages[0].date, "absolute")}</div>
                                        {/*<div className={"text-[11px] text-black/40"}>{item.messages[0].origin === "tenant" ? "Wysłano" : "Odebrano"}</div>*/}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>

        </DashboardElement>
    )
}