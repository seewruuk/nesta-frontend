"use client"
import Layout from "@/components/Layout";
import Image from "next/image";
import ImageOne from "@/public/images/home/image-1.jpg"
import ImageTwo from "@/public/images/home/image-2.jpg"
import Icon from "@/public/message.svg"
import SearchApartments from "@/components/SearchApartments";
import PageTransition from "@/components/PageTransition";


export default function HomeLayout() {
    return (
        <PageTransition>
            <Layout>
                <div className={"pt-[120px] flex min-h-[88dvh] text-black"}>
                    <div className={"flex-1 flex flex-col justify-center gap-5"}>
                        <div className={"flex gap-2 items-center"}>
                            <div className={"relative h-[25px] aspect-square"}>
                                <Image src={Icon} alt="Hero" layout={"fill"} className={"object-cover"}/>
                            </div>
                            <div className={"text-[12px]"}>Znajdź mieszkanie, które Ci odpowiada</div>
                        </div>
                        <h1 className={"text-[40px] font-[700] leading-[50px] mt-2"}>
                            Znajdź swoje <br/>
                            idealne miejsce
                        </h1>

                        <p className={"text-[16px] leading-7 mt-2 max-w-[450px]"}>
                            Niezależnie od tego czy chcesz kupić, sprzedać czy wynająć nieruchomość, pomożemy Ci. U nas
                            wymarzone nieruchomości znajdują właścicieli swoich marzeń!
                        </p>

                        <SearchApartments/>
                    </div>
                    <div className={"flex-1 flex justify-center gap-6 mt-[60px]"}>
                        <div className={"max-w-[250px] relative w-full mb-[60px]"}>
                            <Image src={ImageOne} alt="Hero" layout={"fill"} className={"object-cover"}/>
                        </div>
                        <div className={"max-w-[250px] relative w-full mt-[50px]"}>
                            <Image src={ImageTwo} alt="Hero" layout={"fill"} className={"object-cover"}/>
                        </div>
                    </div>
                </div>
            </Layout>
        </PageTransition>

    )
}