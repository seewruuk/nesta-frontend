"use client";

import InputField from "@/components/common/InputField";
import {useContext, useState} from "react";
import {AuthContext} from "@/context/AuthContext";
import Button from "@/components/Button";
import {updateApartment} from "@/lib/apartment/updateApartment";
import {useSearchParams} from "next/navigation";

export default function AddApartment({type = "add"}) {


    const [appData, setAppData] = useState([
        {
            label: "Powierzchnia",
            type: "number",
            placeholder: "Podaj powierzchnię mieszkania",
            value: "",
            name: "area",
        },
        {
            label: "Ilość pokoi",
            type: "number",
            placeholder: "Podaj ilość pokoi",
            value: "",
            name: "numberOfRooms",
        },
        {
            label: "Ilość łazienek",
            type: "number",
            placeholder: "Podaj ilość łazienek",
            value: "",
            name: "numberOfBathrooms",
        },
        {
            label: "Piętro",
            type: "number",
            placeholder: "Piętro na którym znajduje się mieszkanie",
            value: "",
            name: "floor",
        },
        {
            label: "Umeblowanie",
            type: "text",
            placeholder: "Tak/Nie/Częściowo",
            value: "",
            name: "furnished",
        },
        {
            label: "Czy posiada balkon?",
            type: "text",
            placeholder: "Tak/Nie",
            value: "",
            name: "hasBalcony",
        },
        {
            label: "Typ parkingu",
            type: "text",
            placeholder: "UNDERGROUND/OUTDOOR/NO PARKING",
            value: "",
            name: "parkingType",
        },
        {
            label: "Posiada windę?",
            type: "text",
            placeholder: "Tak/Nie",
            value: "",
            name: "hasElevator",
        },
        {
            label: "Dostęp dla osób niepełnosprawnych",
            type: "text",
            placeholder: "Tak/Nie",
            value: "",
            name: "disabledAccessible"
        },
        {
            label: "Czy posiada komórkę lokatorską w piwnicy?",
            type: "text",
            placeholder: "Tak/Nie",
            value: "",
            name: "hasStorageRoomInBasement"
        },
        {
            label: "Nazwa ulicy",
            type: "text",
            placeholder: "Podaj nazwę ulicy",
            value: "",
            name: "streetName"
        },
        {
            label: "Numer budynku",
            type: "text",
            placeholder: "Podaj numer budynku",
            value: "",
            name: "buildingNumber"
        },
        {
            label: "Numer mieszkania",
            type: "text",
            placeholder: "Podaj numer mieszkania",
            value: "",
            name: "apartmentNumber"
        },
        {
            label: "Miasto",
            type: "text",
            placeholder: "Podaj nazwę miasta",
            value: "",
            name: "city"
        },
        {
            label: "Kod pocztowy",
            type: "text",
            placeholder: "Podaj kod pocztowy",
            value: "",
            name: "postalCode"
        },
        {
            label: "Kraj",
            type: "text",
            placeholder: "Podaj nazwę kraju",
            value: "",
            name: "country"
        },
    ]);
    const {accessToken} = useContext(AuthContext);
    const searchParams = useSearchParams();
    const app_id = searchParams.get("id");

    const handleAddToDatabase = async () => {

        const dataToSend = {
            area: appData.find(item => item.name === "area")?.value,
            numberOfRooms: appData.find(item => item.name === "numberOfRooms")?.value,
            numberOfBathrooms: appData.find(item => item.name === "numberOfBathrooms")?.value,
            floor: appData.find(item => item.name === "floor")?.value,
            furnished: appData.find(item => item.name === "furnished")?.value.toLowerCase() === "tak",
            hasBalcony: appData.find(item => item.name === "hasBalcony")?.value.toLowerCase() === "tak",
            parkingType: appData.find(item => item.name === "parkingType")?.value.toUpperCase(),
            hasElevator: appData.find(item => item.name === "hasElevator")?.value.toLowerCase() === "tak",
            disabledAccessible: appData.find(item => item.name === "disabledAccessible")?.value.toLowerCase() === "tak",
            hasStorageRoomInBasement: appData.find(item => item.name === "hasStorageRoomInBasement")?.value.toLowerCase() === "tak",
            streetName: appData.find(item => item.name === "streetName")?.value,
            buildingNumber: appData.find(item => item.name === "buildingNumber")?.value,
            apartmentNumber: appData.find(item => item.name === "apartmentNumber")?.value,
            city: appData.find(item => item.name === "city")?.value,
            postalCode: appData.find(item => item.name === "postalCode")?.value,
            country: appData.find(item => item.name === "country")?.value,
        }

        try {
            const response = await fetch("/api/save-apartment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body : JSON.stringify({
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

    const handleUpdate = async (id, token) => {

        const dataToSend = {
            area: appData.find(item => item.name === "area")?.value,
            numberOfRooms: appData.find(item => item.name === "numberOfRooms")?.value,
            numberOfBathrooms: appData.find(item => item.name === "numberOfBathrooms")?.value,
            floor: appData.find(item => item.name === "floor")?.value,
            furnished: appData.find(item => item.name === "furnished")?.value.toLowerCase() === "tak",
            hasBalcony: appData.find(item => item.name === "hasBalcony")?.value.toLowerCase() === "tak",
            parkingType: appData.find(item => item.name === "parkingType")?.value.toUpperCase(),
            hasElevator: appData.find(item => item.name === "hasElevator")?.value.toLowerCase() === "tak",
            disabledAccessible: appData.find(item => item.name === "disabledAccessible")?.value.toLowerCase() === "tak",
            hasStorageRoomInBasement: appData.find(item => item.name === "hasStorageRoomInBasement")?.value.toLowerCase() === "tak",
            streetName: appData.find(item => item.name === "streetName")?.value,
            buildingNumber: appData.find(item => item.name === "buildingNumber")?.value,
            apartmentNumber: appData.find(item => item.name === "apartmentNumber")?.value,
            city: appData.find(item => item.name === "city")?.value,
            postalCode: appData.find(item => item.name === "postalCode")?.value,
            country: appData.find(item => item.name === "country")?.value,
        }


        try {
            const response = await updateApartment(id, token, dataToSend);
            console.log("response ", response);
        } catch (err) {
            console.error("Błąd podczas usuwania apartamentu: ", err);
            alert(`Błąd podczas usuwania apartamentu: ${err}`);
        }
    };

    function randomString(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ';
        let str = '';
        for (let i = 0; i < length; i++) {
            str += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return str;
    }

    const generateRandomApartment = () => {
        const randomApartment = {
            area: Math.floor(Math.random() * 100) + 20, // Random area between 20 and 120
            numberOfRooms: Math.floor(Math.random() * 5) + 1, // Random number of rooms between 1 and 5
            numberOfBathrooms: 2,
            floor: Math.floor(Math.random() * 10) + 1, // Random floor between 1 and 10
            furnished: Math.random() > 0.5 ? "Tak" : "Nie", // Randomly furnished or not
            hasBalcony: Math.random() > 0.5 ? "Tak" : "Nie", // Randomly has balcony or not
            parkingType: "UNDERGROUND",
            hasElevator: Math.random() > 0.5 ? "Tak" : "Nie", // Randomly has elevator or not
            disabledAccessible: Math.random() > 0.5 ? "Tak" : "Nie", // Randomly accessible or not
            hasStorageRoomInBasement: Math.random() > 0.5 ? "Tak" : "Nie", // Randomly has storage room in basement or not
            streetName: randomString(15),
            buildingNumber: Math.floor(Math.random() * 100) + 1,
            apartmentNumber: Math.floor(Math.random() * 50) + 1,
            city: randomString(10), // Random city name
            postalCode: `${Math.floor(Math.random() * 90) + 10}-${Math.floor(Math.random() * 900) + 100}`, // Random postal code
            country: "Poland"
        };
        setAppData(
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
                        <h2>Dodaj mieszkanie</h2>
                    </div>
                    <div>
                        <h3>Informacje podstawowe</h3>
                    </div>
                    <div className={"grid grid-cols-2 gap-5"}>
                        {
                            appData.map((item, index) => (
                                <FormFileld
                                    key={index}
                                    label={item.label}
                                    item={item}
                                    changeState={(item, value) => {
                                        const newData = [...appData];
                                        newData[index].value = value;
                                        setAppData(newData);
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
                        title={"Wygeneruj losowe mieszkanie"}
                        onClick={generateRandomApartment}
                    />
                    <Button
                        type={"button"}
                        style={"primary"}
                        title={"Dodaj mieszkanie"}
                        onClick={
                            type === "add" ? handleAddToDatabase : () => handleUpdate(app_id, accessToken)
                        }
                    />


                </div>

            </div>
        </>
    );
}


const FormFileld = ({label, item, changeState}) => {
    return(
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
