"use client";

import InputField from "@/components/common/InputField";
import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "@/context/AuthContext";
import Button from "@/components/Button";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";
import {updateOffer} from "@/lib/offers/updateOffer";
import Transactions from "@/components/Transactions";
import {StateContext} from "@/context/StateContext";

export default function AddEditOffer({type = "add", body, offerId, dataOfferApartmentId}) {


    const [offerData, setOfferData] = useState(
        body ? body : [
            {
                label: "Miesięczny czynsz",
                type: "float",
                placeholder: "Podaj miesięczny czynsz",
                value: "",
                name: "monthlyRent",
                inputFiledType: "input",

            },
            {
                label: "Kaucja",
                type: "float",
                placeholder: "Podaj wysokość kaucji",
                value: "",
                name: "deposit",
                inputFiledType: "input",

            },
            {
                label: "Opłaty dodatkowe",
                type: "float",
                placeholder: "Podaj wysokość opłat dodatkowych",
                value: "",
                name: "utilitiesCost",
                inputFiledType: "input",

            },
            {
                label: "Czy opłaty są wliczone w czynsz?",
                type: "text",
                placeholder: "Tak/Nie",
                value: "",
                name: "utilitiesIncluded",
                selectOptions: [
                    {label: "Tak", value: true},
                    {label: "Nie", value: false},
                ],
                inputFiledType: "select",
            },
            {
                label: "Dostępność od",
                type: "date",
                placeholder: "Podaj datę dostępności",
                value: "",
                name: "availableFrom",
                inputFiledType: "input",
            },
            {
                label: "Dostępność do",
                type: "date",
                placeholder: "Podaj datę dostępności",
                value: "",
                name: "availableUntil",
                inputFiledType: "input",
            },
            {
                label: "Krótko- lub długoterminowy",
                type: "text",
                placeholder: "Tak/Nie",
                value: "",
                name: "shortTermRental",
                selectOptions: [
                    {label: "Tak", value: true},
                    {label: "Nie", value: false},
                ],
                inputFiledType: "select",
            },
            {
                label: "Czy umeblowany?",
                type: "text",
                placeholder: "FURNISHED / UNFURNISHED",
                value: "",
                name: "furnishingStatus",
                selectOptions: [
                    {label: "FURNISHED", value: "FURNISHED"},
                    {label: "UNFURNISHED", value: "UNFURNISHED"},
                ],
                inputFiledType: "select",
            },
            {
                label: "Preferowany status zatrudnienia",
                type: "text",
                placeholder: "EMPLOYED / STUDENT / ANY / Inny",
                value: "",
                name: "preferredEmploymentStatus",
                selectOptions: [
                    {label: "EMPLOYED", value: "EMPLOYED"},
                    {label: "STUDENT", value: "STUDENT"},
                    {label: "ANY", value: "ANY"},
                ],
                inputFiledType: "select",
            },
            {
                label: "Palenie dozwolone?",
                type: "text",
                placeholder: "NO/YES",
                value: "",
                name: "smokingPolicy",
                selectOptions: [
                    {label: "Tak", value: "YES"},
                    {label: "Nie", value: "NO"},
                ],
                inputFiledType: "select",
            },
            {
                label: "Zwierzęta dozwolone?",
                type: "text",
                placeholder: "YES/NO",
                value: "",
                name: "petPolicy",
                selectOptions: [
                    {label: "Tak", value: "YES"},
                    {label: "Nie", value: "NO"},
                ],
                inputFiledType: "select",

            },
            {
                label: "Czy dostępne dla osób niepełnosprawnych?",
                type: "text",
                placeholder: "YES/NO",
                value: "",
                name: "accessibleForDisabled",
                selectOptions: [
                    {label: "Tak", value: true},
                    {label: "Nie", value: false},
                ],
                inputFiledType: "select",
            },

        ]
    );
    const [apartmentId, setApartmentId] = useState(dataOfferApartmentId ? dataOfferApartmentId : null);
    const [initialData, setInitialData] = useState([]);
    const [apartments, setApartments] = useState([]);

    const {transactions} = useContext(StateContext)
    const {accessToken, handleLogout} = useContext(AuthContext);
    const router = useRouter();

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
                const data = await response.json();

                if(data.status === 401){
                    toast.error("Brak dostępu. Proszę się zalogować ponownie.");
                    handleLogout();
                    return;
                }

                setInitialData(data);
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


    const handleAddToDatabase = async () => {

        const dataToSend = {
            apartment: {
                id: apartmentId,
            },
            monthlyRent: parseFloat(offerData.find(item => item.name === "monthlyRent")?.value),
            deposit: parseFloat(offerData.find(item => item.name === "deposit")?.value),
            utilitiesCost: parseFloat(offerData.find(item => item.name === "utilitiesCost")?.value),
            utilitiesIncluded: offerData.find(item => item.name === "furnished")?.value,
            availableFrom: offerData.find(item => item.name === "availableFrom")?.value,
            availableUntil: offerData.find(item => item.name === "availableUntil")?.value,
            shortTermRental: offerData.find(item => item.name === "shortTermRental")?.value,
            furnishingStatus: offerData.find(item => item.name === "furnishingStatus")?.value,
            preferredEmploymentStatus: offerData.find(item => item.name === "preferredEmploymentStatus")?.value,
            smokingPolicy: offerData.find(item => item.name === "smokingPolicy")?.value,
            petPolicy: offerData.find(item => item.name === "petPolicy")?.value,
            accessibleForDisabled: offerData.find(item => item.name === "accessibleForDisabled")?.value,
        }

        try {
            const response = await fetch("/api/rental-offers/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    accessToken: accessToken,
                    data: JSON.stringify(dataToSend)
                }),
            });
            const data = await response.json();

            if(data.status === 409){
                toast.error(data.message);
                return;
            }

            router.push('/dashboard/rental-offers');
        } catch (err) {
            console.error("🔥 Error sending request:", err);
        }
    };

    const generateRandomApartment = () => {
        const randomApartment = {
            monthlyRent: (Math.random() * 2000 + 500).toFixed(2),
            deposit: (Math.random() * 1000 + 200).toFixed(2),
            utilitiesCost: (Math.random() * 300 + 50).toFixed(2),
            utilitiesIncluded: Math.random() > 0.5,
            availableFrom: new Date(Date.now() + Math.random() * (30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
            availableUntil: new Date(Date.now() + Math.random() * (90 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
            shortTermRental: Math.random() > 0.5,
            furnishingStatus: Math.random() > 0.5 ? "FURNISHED" : "FURNISHED",
            preferredEmploymentStatus: Math.random() > 0.5 ? "ANY" : "ANY",
            smokingPolicy: Math.random() > 0.5 ? "YES" : "NO",
            petPolicy: Math.random() > 0.5 ? "YES" : "NO",
            accessibleForDisabled: Math.random() > 0.5,
        };
        setOfferData(
            prevData =>
                prevData.map(item => ({
                    ...item,
                    value: randomApartment[item.name] || item.value
                })));
    }

    const handleUpdate = async (id) => {

        const dataToSend = {
            apartment: {
                id: apartmentId,
            },
            monthlyRent: parseFloat(offerData.find(item => item.name === "monthlyRent")?.value),
            deposit: parseFloat(offerData.find(item => item.name === "deposit")?.value),
            utilitiesCost: parseFloat(offerData.find(item => item.name === "utilitiesCost")?.value),
            utilitiesIncluded: offerData.find(item => item.name === "utilitiesIncluded")?.value,
            availableFrom: offerData.find(item => item.name === "availableFrom")?.value,
            availableUntil: offerData.find(item => item.name === "availableUntil")?.value,
            shortTermRental: offerData.find(item => item.name === "shortTermRental")?.value,
            furnishingStatus: offerData.find(item => item.name === "furnishingStatus")?.value,
            preferredEmploymentStatus: offerData.find(item => item.name === "preferredEmploymentStatus")?.value,
            smokingPolicy: offerData.find(item => item.name === "smokingPolicy")?.value,
            petPolicy: offerData.find(item => item.name === "petPolicy")?.value,
            accessibleForDisabled: offerData.find(item => item.name === "accessibleForDisabled")?.value,
        }
        console.log("dataToSend", dataToSend)

        try {
            const response = await updateOffer(id, accessToken, dataToSend);
            console.log("✅ Offer updated successfully:", response);
            toast.success("Oferta została zaktualizowana pomyślnie!");
            router.push(`/dashboard/rental-offers`);
        } catch (err) {
            console.error("🔥 Error updating offer:", err);
            toast.error("Wystąpił błąd podczas aktualizacji oferty.");
        }
    };

    return (
        <>
            <div className="bg-white py-[24px] px-[32px] rounded-lg flex flex-col gap-5">

                <div className={"flex flex-col gap-[32px]"}>
                    <div>
                        <h3>{
                            type === "add" ? "Dodaj nową ofertę" : "Edytuj ofertę"
                        }</h3>
                    </div>
                    <div className={"grid grid-cols-2 gap-5"}>
                        {
                            offerData.map((item, index) => (
                                <FormFileld
                                    key={index}
                                    label={item.label}
                                    item={item}
                                    changeState={(item, value) => {
                                        const newData = [...offerData];
                                        newData[index].value = value;
                                        setOfferData(newData);
                                    }}
                                />
                            ))
                        }

                    </div>
                </div>

                <div>
                    <label className={"text-[13px] font-semibold text-gray"}>Wybierz mieszkanie</label>
                    <select
                        className={"w-full p-2 border border-gray-300 rounded-md"}
                        value={apartmentId || ""}
                        onChange={(e) => setApartmentId(e.target.value)}
                    >
                        <option value={null}>Wybierz mieszkanie</option>
                        {
                            apartments && apartments.map((apartment) => (
                                <option key={apartment.id} value={apartment.id}>
                                    {apartment.streetName} {apartment.buildingNumber}, {apartment.city}
                                </option>
                            ))
                        }
                    </select>
                </div>


                <div className={"flex flex-col gap-5"}>
                    <Button
                        type={"button"}
                        style={"black"}
                        title={"Wygeneruj losową ofertę"}
                        onClick={generateRandomApartment}
                    />
                    <Button
                        type={"button"}
                        style={"primary"}
                        title={type === "add" ? "Dodaj nową ofertę" : "Zaktualizuj ofertę"}
                        onClick={
                            type === "add" ? handleAddToDatabase : () => handleUpdate(offerId, accessToken)
                        }
                    />


                </div>

            </div>

            <Transactions transactions={transactions} maxElements={5}/>

        </>
    );
}


const FormFileld = ({label, item, changeState}) => {
    return (
        <div className={"group"}>
            <label
                className={"text-[13px] font-semibold text-gray group-hover:text-black transition-all"}>{label}</label>
            <InputField
                type={item.type}
                placeholder={item.placeholder}
                value={item.value}
                onChange={(e) => changeState(item, e.target.value)}
                customStyle={item.customStyle}
                inputFiledType={item.inputFiledType}
                selectOptions={item.selectOptions}
            />
        </div>
    )
}
