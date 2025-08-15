"use client"
import {useContext, useEffect, useState} from "react";
import Cookies from "js-cookie";
import {AuthContext} from "@/context/AuthContext";
import {updateApartment} from "@/lib/apartment/updateApartment";
import {deleteOffer} from "@/lib/offers/deleteOffer";

export default function UserOffers() {

    const [offers, setOffers] = useState([]);
    const {accessToken} = useContext(AuthContext);

    const handleDelete = async (id, token) => {
        try {
            const response = await deleteOffer(id, token);
            console.log(response);
            console.log("Deleting offer ID: ", id);
        } catch (err) {
            console.error("Błąd podczas usuwania apartamentu: ", err);
        }
    };
    const handleUpdate = async (id, token) => {
        try {
            const response = await updateApartment(id, token);
            console.log("response ", response);
        } catch (err) {
            console.error("Błąd podczas usuwania apartamentu: ", err);
            alert(`Błąd podczas usuwania apartamentu: ${err}`);
        }
    };

    useEffect(() => {
        const fetchOffers = async () => {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
            try {
                const response = await fetch(`${baseUrl}/api/offers`, {
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
                setOffers(data.offers);
            } catch (error) {
                console.error("Error fetching apartments:", error);
            }
        }
        if (accessToken) {
            fetchOffers();
        } else {
            console.warn("Access token is not available");
        }
    }, [accessToken]);


    return (
        <>
            <div className={"mt-[32px]"}>
                <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px] text-black"}>
                    {
                        offers && offers.map((item, index) => {
                            return (
                                <div key={index} className={"bg-white p-[16px] rounded-lg shadow-md"}>
                                    <h3 className={"text-[20px] font-semibold mb-[8px]"}>Oferta</h3>

                                    <div className={"flex gap-2 items-center mt-[32px]"}>
                                        <button
                                            onClick={() => handleDelete(item.id, accessToken)}
                                        >
                                            Usuń
                                        </button>
                                        <button
                                            onClick={() => handleUpdate(item.id, accessToken)}
                                        >
                                            Edytuj
                                        </button>
                                    </div>

                                </div>
                            )
                        })}


                </div>
            </div>

            {/*<pre>*/}
            {/*        {*/}
            {/*            JSON.stringify(offers, null, 2)*/}
            {/*        }*/}
            {/*    </pre>*/}

        </>
    )
}