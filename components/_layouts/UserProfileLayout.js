"use client";
import PageTransition from "@/components/PageTransition";
import apartments from "@/data/apartments.json"
import Layout from "@/components/Layout";
import Image from "next/image";
import ApartmentCardSmall from "@/components/common/ApartmentCardSmall";
import formatDate from "@/lib/formatDate";
import Button from "@/components/Button";

export default function UserProfileLayout({slug}) {

    return (<PageTransition>
            <Layout>
                <section className="pt-[120px] isolate">

                    <div className={"h-[370px] bg-cover bg-center relative overflow-hidden rounded-2xl -z-10"}>
                        <Image
                            src={"https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}
                            alt="Profile Cover" fill className="object-cover"/>
                    </div>

                    <div className={"flex justify-between items-end gap-[24px] -mt-[50px] z-50 px-[50px]"}>

                        <div
                            className={"aspect-square h-[200px] rounded-full border-8 border-background bg-background relative"}>
                            <Image
                                src={"https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg"}
                                alt="Profile Picture" fill className="object-cover rounded-full"/>
                            <div
                                className={"bg-primary aspect-square h-[40px] rounded-full absolute bottom-0 right-0 border-background border-5"}/>
                        </div>

                        <div className={"flex justify-between items-center flex-grow mb-[20px]"}>
                            <div>
                                <p className={"text-[9px] text-gray"}>Warszawa, Polska</p>
                                <h3 className={"text-[24px] font-semibold text-black"}>Natalia Bogurodzica</h3>
                                <p className={"text-[16px] font-semibold text-black"}>Polecam swoje mieszkania, są
                                    spoko</p>
                                <p className={"text-[9px] text-gray"}>Średnia ocen: 4.5 / 5.0</p>
                            </div>
                            <div className={"flex gap-2"}>
                                <Button
                                    title={"Dodaj opinie"}
                                    style={"white"}
                                    onClick={() => console.log("click")}
                                    type={"button"}
                                />
                                <Button
                                    title={"Napisz wiadomość"}
                                    style={"primary"}
                                    onClick={() => console.log("click")}
                                    type={"button"}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className={"mt-[50px] flex justify-between gap-[42px]"}>

                    <div className={"flex-1"}>
                        <Header title={"Ogłoszenia"}/>
                        <div className={"flex flex-col gap-4 mt-[42px]"}>
                            {apartments.map((item, index) => {
                                return (<ApartmentCardSmall key={item + index} apartment={item}/>)
                            })}
                        </div>
                    </div>

                    <div className={"flex-1"}>
                        <Header title={"Opinie"}/>

                        <div className={"flex flex-col gap-4 mt-[42px]"}>
                            {/*{reviews.map((item, index) => {*/}
                            {/*    return (<div key={item + index} className={"flex flex-col gap-2"}>*/}
                            {/*            <div className={"flex gap-3 items-center"}>*/}
                            {/*                <div className={"aspect-square rounded-full h-[8px] bg-primary"}/>*/}
                            {/*                <p className={"font-semibold text-black"}>{item.name}</p>*/}
                            {/*            </div>*/}
                            {/*            <p className={"text-[14px] text-gray"}>{item.text}</p>*/}
                            {/*            <div*/}
                            {/*                className={"flex justify-between items-center flex-grow mb-[20px] border-t py-4 border-gray/20"}>*/}
                            {/*                <p className={"text-[12px] text-gray"}>{item.rating} / 5.0</p>*/}
                            {/*                <p className={"text-[12px] text-gray"}>{formatDate(item.date)}</p>*/}
                            {/*            </div>*/}

                            {/*        </div>)*/}
                            {/*})}*/}
                        </div>
                    </div>
                </section>
            </Layout>
        </PageTransition>);
}

const Header = ({title, float = "right"}) => {
    return (<div className={"flex gap-3 items-center"}>
            <div
                className={`aspect-square rounded-full h-[8px] bg-primary ${float === "right" ? "order-1" : "order-2"}`}/>
            <p className={`font-semibold text-black ${float === "right" ? "order-2" : "order-1"}`}>{title}</p>
        </div>)
}