"use client"
import apartments from "@/data/apartments.json"
import Layout from "@/app/components/Layout";
import Link from "next/link";
import Button from "@/app/components/Button";
import Image from "next/image";
import {useState} from "react";
import PageTransition from "@/app/components/PageTransition";


export default function SingleApartmentLayout({slug}) {

    const item = apartments.find((item) => item.slug === slug);
    const [selectedIndex, setSelectedIndex] = useState(0)

    if (!item) {
        return <p>Nie znaleziono mieszkania</p>
    }

    const data = [
        {
            header: "Opis mieszkania",
            desc: `
                    Interdum et malesu they adamale fames ac anteipsu pimsine faucibus curabitur arcu site
                    feugiat in tortor in, volutpat sollicitudin libero. Hotel non lorem acer suscipit
                    bibendum
                    vulla facilisi nedeuter nunc volutpa mollis sapien velet conseyer turpeutionyer masin
                    libero
                    sempe mollis.
            `
        },

        {
            header: "Zameldowanie",
            desc: `
                    Interdum et malesu they adamale fames ac anteipsu pimsine faucibus curabitur arcu site
                    feugiat in tortor in, volutpat sollicitudin libero. Hotel non lorem acer suscipit
                    bibendum
                    vulla facilisi nedeuter nunc volutpa mollis sapien velet conseyer turpeutionyer masin
                    libero
                    sempe mollis.
            `
        },

        {
            header: "Zwierzęta",
            desc: `
                    Interdum et malesu they adamale fames ac anteipsu pimsine faucibus curabitur arcu site
                    feugiat in tortor in, volutpat sollicitudin libero. Hotel non lorem acer suscipit
                    bibendum
                    vulla facilisi nedeuter nunc volutpa mollis sapien velet conseyer turpeutionyer masin
                    libero
                    sempe mollis.
            `
        },

        {
            header: "Dodatkowe informacje",
            desc: `
                    Interdum et malesu they adamale fames ac anteipsu pimsine faucibus curabitur arcu site
                    feugiat in tortor in, volutpat sollicitudin libero. Hotel non lorem acer suscipit
                    bibendum
                    vulla facilisi nedeuter nunc volutpa mollis sapien velet conseyer turpeutionyer masin
                    libero
                    sempe mollis.
            `
        },
    ]

    return (
        <PageTransition>
            <Layout>

                <div className={"flex items-center gap-6 mt-[52px]"}>
                    <Link href={"/apartments"} className="text-sm text-gray-500">
                        Powrót
                    </Link>

                    <div className={"h-[1px] flex-grow bg-gray/20"}/>
                </div>


                <section className={"flex justify-between gap-12 items-center mt-[24px]"}>

                    <div className={"flex-1 flex flex-col overflow-hidden"}>
                        <div className={"h-[380px] relative rounded-lg overflow-hidden"}>
                            <Image src={item.images[selectedIndex]} alt={"asd"} fill className=" object-cover"/>
                        </div>
                        <div>
                            <div className={"flex gap-2 mt-[12px] justify-start overflow-x-scroll"}>
                                {item.images.map((image, index) => (
                                    <div
                                        key={index}
                                        className={`h-[80px] min-w-[130px] relative rounded-lg overflow-hidden ${selectedIndex === index ? "border-2 border-primary" : "opacity-50"}`}
                                        onClick={() => setSelectedIndex(index)}
                                    >
                                        <Image src={image} alt={"asd"} fill className=" object-cover"/>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>


                    <div className={"flex-1"}>
                        <div className={"flex flex-col gap-[25px]"}>
                            <div className={"flex justify-between"}>
                                <div className={"flex gap-2 items-center"}>
                                    <div className={"aspect-square h-[32px] bg-primary rounded-full"}/>
                                    <p>Joana Kowalska</p>
                                </div>
                                <div>
                                    Zobacz opinie
                                </div>
                            </div>
                            <div className={"flex flex-col gap-[12px]"}>
                                <h4 className={"text-[32px] font-semibold"}>{item.price} zł / miesiąc</h4>
                                <p className={"text-[16px] font-semibold"}>{item.header}</p>
                                <p className={"text-[12px] text-gray"}>{item.address}</p>
                                <div>
                                    {item.filter.amenities.map((amenity, index) => (
                                        <span key={index}
                                              className={"text-sm text-gray-500"}>{amenity}{index !== item.filter.amenities.length - 1 ? ", " : ""}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className={"flex flex-col gap-2 mt-[12px]"}>
                            <Button
                                type={"link"}
                                onClick={() => console.log("clicked")}
                                title={"Skontaktuj się"}
                                style={"primary"}
                            />
                            <Button
                                type={"link"}
                                onClick={() => console.log("clicked")}
                                title={"Umów się na oględziny"}
                                style={"white"}
                            />
                        </div>
                    </div>
                </section>


                <section className={"flex gap-12 mt-[90px]"}>
                    <div className={"order-2 flex-grow"}>
                        Udogodnienia
                    </div>
                    <div className={"order-1 max-w-[760px] flex flex-col gap-12"}>
                        {
                            data.map((item, index) => {
                                return (
                                    <div key={item+index}>
                                        <h4 className={"text-[24px] font-semibold text-black"}>{item.header}</h4>
                                        <p className={"text-[16px] mt-[16px] font-[300] leading-8 text-gray"}>{item.desc}</p>
                                    </div>
                                )
                            })
                        }
                    </div>

                </section>


            </Layout>


        </PageTransition>
    )
}