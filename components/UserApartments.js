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

    const handleDelete = async (id, token) => {
        try {
            const x = await deleteApartment(id, token);
            console.log("Deleting offer ID: ", id);
            console.log(x)
            console.log("Deleting apartment ID: ", id);
        } catch (err) {
            console.error("Błąd podczas usuwania apartamentu: ", err);
            alert(`Błąd podczas usuwania apartamentu: ${err}`);
        }
    };

    useEffect(() => {
        const fetchUserApartments = async () => {
            const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;
            try {
                const response = await fetch(`${apiUrl}/api/apartmentsReadAll`, {
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
                <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px] text-black"}>
                    {
                        apartments && apartments.map((item, index) => {
                            return (
                                <div key={index} className={"bg-white p-[16px] rounded-lg shadow-md"}>
                                    <h3 className={"text-[20px] font-semibold mb-[8px]"}>{item.streetName} {item.buildingNumber}</h3>
                                    <p className={"text-gray-700"}>Miasto: {item.city}</p>
                                    <p className={"text-gray-700"}>Kod pocztowy: {item.postalCode}</p>
                                    <p className={"text-gray-700"}>Powierzchnia: {item.area} m²</p>
                                    <p className={"text-gray-700"}>Liczba pokoi: {item.numberOfRooms}</p>
                                    <p className={"text-gray-700"}>Piętro: {item.floor}</p>
                                    <div className={"flex gap-2 items-center mt-[32px]"}>
                                        <button
                                            onClick={() => handleDelete(item.id, accessToken)}
                                            >
                                            Usuń
                                        </button>
                                        <Link href={`/dashboard/apartments/update?id=`+item.id}>
                                            Edytuj
                                        </Link>
                                    </div>

                                </div>
                            )
                        })}


                </div>
            </div>

            {/*<pre>*/}
            {/*    {JSON.stringify(apartments, null, 2)}*/}
            {/*</pre>*/}
        </>
    )
}