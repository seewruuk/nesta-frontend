"use client"
import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";

export default function UserOffers() {

    const [offers, setOffers] = useState([]);
    const {accessToken} = useContext(AuthContext);


    useEffect(() => {
        const fetcher = async () => {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
            try {
                const response = await fetch(`${baseUrl}/api/rental-offers`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        accessToken: accessToken
                    })
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch offers");
                }
                const data = await response.json();
                setOffers(data.offers);
            } catch (error) {
                console.error("Error fetching offers:", error);
            }
        }
        if (accessToken) {
            fetcher();
        } else {
            console.warn("Access token is not available");
        }
    }, [accessToken]);


    return (
        <>
            <div className={""}>
                {
                    offers && offers.length > 0 ? (
                        <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px] text-black"}>
                            {
                                offers.map((item, index) => {
                                    return (
                                        <div key={index} className={"relative"}>
                                            <div className={"bg-gray-100 px-4 py-1 rounded-lg group absolute z-50 top-2 left-2"}>
                                                        <span className={"text-[12px] font-semibold text-gray-600 "}>
                                                            #00{item.id}
                                                        </span>
                                            </div>
                                            <div className={"relative w-full h-[180px] rounded-t-lg overflow-hidden"}>
                                                <Image src={"https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"} alt={"app"} layout="fill" className={"object-cover"} />
                                            </div>
                                            <div className={"bg-white p-[16px] rounded-b-lg shadow-md"}>
                                            <Link href={`/dashboard/rental-offers/${item.id}`}
                                                  className={"flex flex-col group"}>
                                                <div className={"flex flex-col items-start gap-1"}>
                                                    <span className={"group-hover:underline text-[20px] font-semibold"}>{item.apartment.streetName} {item.apartment.buildingNumber}</span>
                                                    <div>
                                                        <span>{item.apartment.city}, {item.apartment.country}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                            </div>
                                        </div>
                                    )
                                })}
                        </div>
                    ) : (
                        <p className={"text-gray-500"}>Brak ofert do wyświetlenia.</p>
                    )
                }
            </div>

        </>
    )
}