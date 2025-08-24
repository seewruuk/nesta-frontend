"use client"
import {useContext, useEffect, useState} from "react";
import Cookies from "js-cookie";
import {AuthContext} from "@/context/AuthContext";
import {deleteApartment} from "@/lib/deleteApartment";
import {updateApartment} from "@/lib/apartment/updateApartment";
import Link from "next/link";

export default function UserApartments() {

    const [apartments, setApartments] = useState([]);
    const {accessToken} = useContext(AuthContext);



    useEffect(() => {
        const fetchUserApartments = async () => {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
            try {
                const response = await fetch(`${baseUrl}/api/apartments`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        accessToken: accessToken
                    })
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch apartments");
                }
                const data = await response.json();
                setApartments(data.apartments);
            } catch (error) {
                console.error("Error fetching apartments:", error);
            }
        }
        if (accessToken) {
            fetchUserApartments();
        } else {
            console.warn("Access token is not available");
        }
    }, [accessToken]);

    return (
        <>
            <div className={"mt-[32px]"}>
                {
                    apartments && apartments.length > 0 ? (
                        <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px] text-black"}>
                            {
                                apartments.map((item, index) => {
                                    return (
                                        <div key={index} className={"bg-white p-[16px] rounded-lg shadow-md"}>
                                            <Link href={`/dashboard/apartments/${item.id}`} className={"text-[20px] font-semibold mb-[8px] hover:underline"}>{item.streetName} {item.buildingNumber}</Link>
                                            <p className={"text-gray-700"}>Miasto: {item.city}</p>
                                            <p className={"text-gray-700"}>Kod pocztowy: {item.postalCode}</p>
                                            <p className={"text-gray-700"}>Powierzchnia: {item.area} m²</p>
                                            <p className={"text-gray-700"}>Liczba pokoi: {item.numberOfRooms}</p>
                                            <p className={"text-gray-700"}>Piętro: {item.floor}</p>
                                        </div>
                                    )
                                })}
                        </div>
                    ) : (
                        <p className={"text-gray-500"}>Brak mieszkań do wyświetlenia.</p>
                    )
                }
            </div>


        </>
    )
}