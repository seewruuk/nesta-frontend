import generateLabel from "@/lib/generateLabel";
import displayAvatar from "@/lib/displayAvatar";
import sectionHeader from "@/lib/sectionHeader";
import DashboardElement from "@/components/DashboardElement";
import Link from "next/link";
import Image from "next/image";

export default function YourOffers({apartments}) {
    return (
        <DashboardElement>
            {
                sectionHeader("Twoje oferty")
            }
            <div className={"flex gap-[15px] overflow-x-scroll"}>


                {/*<div className={"min-w-[320px]  "}>*/}
                {/*    <div className={"bg-gray-200 aspect-video rounded-lg animate-pulse"}/>*/}
                {/*    <div >*/}
                {/*        <h4 className={'text-[18px] font-semibold mt-[12px]'}>Pierwsze kroki!</h4>*/}
                {/*        <p className={"text-[13px]"}>*/}
                {/*            Witamy w aplikacji Nesta! <br />*/}
                {/*            Załóż swoje pierwsze ogłoszenie, aby zacząć korzystać z naszej platformy.*/}
                {/*        </p>*/}
                {/*    </div>*/}
                {/*</div>*/}

                {apartments.map((item, index) => {
                    return (
                        <Link
                            href={`/rental-offers/${item.slug}`}
                            key={item + index}
                            className="flex flex-col gap-[12px] items-start max-w-[320px]"
                        >
                            <div className="h-[184px] w-[280px] rounded-2xl relative">
                                <Image src={item.images[0]} fill alt={item.header}
                                       className="rounded-2xl object-cover"/>
                            </div>

                            {generateLabel("available")}

                            <div className="w-[280px] flex items-center gap-2">
                                {displayAvatar({avatarUrl: null, type: "s"})}
                                <div className={"truncate text-[14px] font-[500]"}>
                                    {item.header}
                                </div>
                            </div>
                            <div className={"text-[14px] font-bold"}>3200 PLN / miesiąc</div>
                        </Link>
                    )
                })}
            </div>
        </DashboardElement>
    )
}