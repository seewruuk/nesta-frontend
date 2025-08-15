"use client";

import InputField from "@/components/common/InputField";
import {useContext, useState} from "react";
import {AuthContext} from "@/context/AuthContext";
import Button from "@/components/Button";

export default function AddOffer() {


    const [offerData, setOfferData] = useState([
        {
            label: "Miesięczny czynsz",
            type: "float",
            placeholder: "Podaj miesięczny czynsz",
            value: "",
            name: "monthlyRent",
        },
        {
            label: "Kaucja",
            type: "float",
            placeholder: "Podaj wysokość kaucji",
            value: "",
            name: "deposit",
        },
        {
            label: "Opłaty dodatkowe",
            type: "float",
            placeholder: "Podaj wysokość opłat dodatkowych",
            value: "",
            name: "utilitiesCost",
        },
        {
            label: "Czy opłaty są wliczone w czynsz?",
            type: "text",
            placeholder: "Tak/Nie",
            value: "",
            name: "utilitiesIncluded",
        },
        {
            label: "Dostępność od",
            type: "date",
            placeholder: "Podaj datę dostępności",
            value: "",
            name: "availableFrom",
        },
        {
            label: "Dostępność do",
            type: "date",
            placeholder: "Podaj datę dostępności",
            value: "",
            name: "availableUntil",
        },
        {
            label: "Krótko- lub długoterminowy",
            type: "text",
            placeholder: "Tak/Nie",
            value: "",
            name: "shortTermRental",
        },
        {
            label: "Czy umeblowany?",
            type: "text",
            placeholder: "FURNISHED / UNFURNISHED",
            value: "",
            name: "furnishingStatus",
        },
        {
            label: "Preferowany status zatrudnienia",
            type: "text",
            placeholder: "Pracujący / Studencki / Emerytowany / Inny",
            value: "",
            name: "preferredEmploymentStatus",
        },
        {
            label: "Palenie dozwolone?",
            type: "text",
            placeholder: "NO/YES",
            value: "",
            name: "smokingPolicy",
        },
        {
            label: "Zwierzęta dozwolone?",
            type: "text",
            placeholder: "YES/NO",
            value: "",
            name: "petPolicy",
        },
        {
            label: "Czy dostępne dla osób niepełnosprawnych?",
            type: "text",
            placeholder: "YES/NO",
            value: "",
            name: "accessibleForDisabled",
        },

    ]);
    const {accessToken} = useContext(AuthContext);
    const handleAddToDatabase = async () => {

        const dataToSend = {
            apartment : {
                id: 6
            },
            monthlyRent: offerData.find(item => item.name === "monthlyRent")?.value,
            deposit: offerData.find(item => item.name === "deposit")?.value,
            utilitiesCost: offerData.find(item => item.name === "utilitiesCost")?.value,
            utilitiesIncluded: offerData.find(item => item.name === "furnished")?.value.toLowerCase() === "tak",
            availableFrom: offerData.find(item => item.name === "availableFrom")?.value,
            availableUntil: offerData.find(item => item.name === "availableUntil")?.value,
            shortTermRental: offerData.find(item => item.name === "shortTermRental")?.value.toLowerCase() === "tak",
            furnishingStatus: offerData.find(item => item.name === "furnishingStatus")?.value,
            preferredEmploymentStatus: offerData.find(item => item.name === "preferredEmploymentStatus")?.value,
            smokingPolicy: offerData.find(item => item.name === "smokingPolicy")?.value,
            petPolicy: offerData.find(item => item.name === "petPolicy")?.value,
            accessibleForDisabled: offerData.find(item => item.name === "accessibleForDisabled")?.value.toLowerCase() === "yes",
        }

        try {
            const response = await fetch("/api/offers/add", {
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
            console.log(data)
        } catch (err) {
            console.error("🔥 Error sending request:", err);
        }
    };

    const generateRandomApartment = () => {
        const randomApartment = {
            monthlyRent: (Math.random() * 2000 + 500).toFixed(2),
            deposit: (Math.random() * 1000 + 200).toFixed(2),
            utilitiesCost: (Math.random() * 300 + 50).toFixed(2),
            utilitiesIncluded: Math.random() > 0.5 ? "Tak" : "Nie",
            availableFrom: new Date(Date.now() + Math.random() * (30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
            availableUntil: new Date(Date.now() + Math.random() * (90 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
            shortTermRental: Math.random() > 0.5 ? "Tak" : "Nie",
            furnishingStatus: Math.random() > 0.5 ? "FURNISHED" : "FURNISHED",
            preferredEmploymentStatus: Math.random() > 0.5 ? "ANY" : "ANY",
            smokingPolicy: Math.random() > 0.5 ? "YES" : "NO",
            petPolicy: Math.random() > 0.5 ? "YES" : "NO",
            accessibleForDisabled: Math.random() > 0.5 ? "YES" : "NO"
        };
        setOfferData(
            prevData =>
                prevData.map(item => ({
                    ...item,
                    value: randomApartment[item.name] || item.value
                })));
    }

    return (
        <>
            <div className="bg-white py-[24px] px-[32px] rounded-lg flex flex-col gap-5">

                <div className={"flex flex-col gap-[32px]"}>
                    <div>
                        <h2>Dodaj Oferte</h2>
                    </div>
                    <div>
                        <h3>Informacje podstawowe</h3>
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

                <div className={"flex flex-col gap-5"}>
                    <Button
                        type={"button"}
                        style={"black"}
                        title={"Wygeneruj losowe dane"}
                        onClick={generateRandomApartment}
                    />
                    <Button
                        type={"button"}
                        style={"primary"}
                        title={"Dodaj mieszkanie"}
                        onClick={handleAddToDatabase}
                    />


                </div>

                {/*<pre>*/}
                {/*    {JSON.stringify(offerData, null, 2)}*/}
                {/*</pre>*/}

            </div>
        </>
    );
}


const FormFileld = ({label, item, changeState}) => {
    return (
        <div>
            <label>{label}</label>
            <InputField
                type={item.type}
                placeholder={item.placeholder}
                value={item.value}
                onChange={(e) => changeState(item, e.target.value)}
                customStyle={item.customStyle}
            />
        </div>
    )
}
