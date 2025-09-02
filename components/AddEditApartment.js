"use client";

import InputField from "@/components/common/InputField";
import React, {useContext, useState} from "react";
import {AuthContext} from "@/context/AuthContext";
import Button from "@/components/Button";
import {updateApartment} from "@/lib/apartment/updateApartment";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";
import {data} from "autoprefixer";

export default function AddEditApartment({type = "add", body, appId}) {

    const [appData, setAppData] = useState(body ? body : [{
        label: "Powierzchnia",
        type: "number",
        placeholder: "Podaj powierzchnię mieszkania",
        value: "",
        name: "area",
        inputFiledType: "input",

    }, {
        label: "Ilość pokoi",
        type: "number",
        placeholder: "Podaj ilość pokoi",
        value: "",
        name: "numberOfRooms",
        inputFiledType: "input",

    }, {
        label: "Ilość łazienek",
        type: "number",
        placeholder: "Podaj ilość łazienek",
        value: "",
        name: "numberOfBathrooms",
        inputFiledType: "input",

    }, {
        label: "Piętro",
        type: "number",
        placeholder: "Piętro na którym znajduje się mieszkanie",
        value: "",
        name: "floor",
        inputFiledType: "input",

    }, {
        label: "Umeblowanie",
        type: "text",
        placeholder: "Tak/Nie",
        value: "",
        name: "furnished",
        selectOptions: [{label: "Tak", value: true}, {label: "Nie", value: false},],
        inputFiledType: "select",

    }, {
        label: "Czy posiada balkon?",
        type: "text",
        placeholder: "Tak/Nie",
        value: "",
        name: "hasBalcony",
        selectOptions: [{label: "Tak", value: true}, {label: "Nie", value: false},],
        inputFiledType: "select",
    }, {
        label: "Typ parkingu",
        type: "text",
        placeholder: "UNDERGROUND/OUTDOOR/NO PARKING",
        value: "",
        name: "parkingType",
        selectOptions: [{label: "UNDERGROUND", value: "UNDERGROUND"}, {
            label: "STREET",
            value: "STREET"
        }, {label: "NONE", value: "NONE"}],
        inputFiledType: "select",
    }, {
        label: "Posiada windę?",
        type: "text",
        placeholder: "Tak/Nie",
        value: "",
        name: "hasElevator",
        selectOptions: [{label: "Tak", value: true}, {label: "Nie", value: false},],
        inputFiledType: "select",
    }, {
        label: "Dostęp dla osób niepełnosprawnych",
        type: "text",
        placeholder: "Tak/Nie",
        value: "",
        name: "disabledAccessible",
        selectOptions: [{label: "Tak", value: true}, {label: "Nie", value: false},],
        inputFiledType: "select",
    }, {
        label: "Czy posiada komórkę lokatorską w piwnicy?",
        type: "text",
        placeholder: "Tak/Nie",
        value: "",
        name: "hasStorageRoomInBasement",
        selectOptions: [{label: "Tak", value: true}, {label: "Nie", value: false},],
        inputFiledType: "select",
    }, {
        label: "Nazwa ulicy",
        type: "text",
        placeholder: "Podaj nazwę ulicy",
        value: "",
        name: "streetName",
        inputFiledType: "input",

    }, {
        label: "Numer budynku",
        type: "text",
        placeholder: "Podaj numer budynku",
        value: "",
        name: "buildingNumber",
        inputFiledType: "input",

    }, {
        label: "Numer mieszkania",
        type: "text",
        placeholder: "Podaj numer mieszkania",
        value: "",
        name: "apartmentNumber",
        inputFiledType: "input",

    }, {
        label: "Miasto",
        type: "text",
        placeholder: "Podaj nazwę miasta",
        value: "",
        name: "city",
        inputFiledType: "input",

    }, {
        label: "Kod pocztowy",
        type: "text",
        placeholder: "Podaj kod pocztowy",
        value: "",
        name: "postalCode",
        inputFiledType: "input",

    }, {
        label: "Kraj",
        type: "text",
        placeholder: "Podaj nazwę kraju",
        value: "",
        name: "country",
        inputFiledType: "input",
    },]);
    const {accessToken} = useContext(AuthContext);
    const router = useRouter();

    const handleAddToDatabase = async () => {

        const dataToSend = {
            area: appData.find(item => item.name === "area")?.value,
            numberOfRooms: appData.find(item => item.name === "numberOfRooms")?.value,
            numberOfBathrooms: appData.find(item => item.name === "numberOfBathrooms")?.value,
            floor: appData.find(item => item.name === "floor")?.value,
            furnished: appData.find(item => item.name === "furnished")?.value,
            hasBalcony: appData.find(item => item.name === "hasBalcony")?.value,
            parkingType: appData.find(item => item.name === "parkingType")?.value.toUpperCase(),
            hasElevator: appData.find(item => item.name === "hasElevator")?.value,
            disabledAccessible: appData.find(item => item.name === "disabledAccessible")?.value,
            hasStorageRoomInBasement: appData.find(item => item.name === "hasStorageRoomInBasement")?.value,
            streetName: appData.find(item => item.name === "streetName")?.value,
            buildingNumber: appData.find(item => item.name === "buildingNumber")?.value,
            apartmentNumber: appData.find(item => item.name === "apartmentNumber")?.value,
            city: appData.find(item => item.name === "city")?.value,
            postalCode: appData.find(item => item.name === "postalCode")?.value,
            country: appData.find(item => item.name === "country")?.value,
        }

        try {
            const response = await fetch("/api/apartments/add", {
                method: "POST", headers: {
                    "Content-Type": "application/json",
                }, body: JSON.stringify({
                    accessToken: accessToken, data: JSON.stringify(dataToSend)
                }),
            });
            const data = await response.json();
            if (data.data.id) {
                toast.success("Mieszkanie zostało dodane pomyślnie!");
                router.push("/dashboard/apartments");
            } else {
                toast.error("Błąd podczas dodawania mieszkania: " + data.error);
            }
        } catch (err) {
            toast.error(`Błąd podczas dodawania mieszkania: ${err}`);
        }
    };

    const handleUpdate = async (id, token) => {

        const dataToSend = {
            area: appData.find(item => item.name === "area")?.value,
            numberOfRooms: appData.find(item => item.name === "numberOfRooms")?.value,
            numberOfBathrooms: appData.find(item => item.name === "numberOfBathrooms")?.value,
            floor: appData.find(item => item.name === "floor")?.value,
            furnished: appData.find(item => item.name === "furnished")?.value,
            hasBalcony: appData.find(item => item.name === "hasBalcony")?.value,
            parkingType: appData.find(item => item.name === "parkingType")?.value.toUpperCase(),
            hasElevator: appData.find(item => item.name === "hasElevator")?.value,
            disabledAccessible: appData.find(item => item.name === "disabledAccessible")?.value,
            hasStorageRoomInBasement: appData.find(item => item.name === "hasStorageRoomInBasement")?.value,
            streetName: appData.find(item => item.name === "streetName")?.value,
            buildingNumber: appData.find(item => item.name === "buildingNumber")?.value,
            apartmentNumber: appData.find(item => item.name === "apartmentNumber")?.value,
            city: appData.find(item => item.name === "city")?.value,
            postalCode: appData.find(item => item.name === "postalCode")?.value,
            country: appData.find(item => item.name === "country")?.value,
        }


        try {
            const response = await updateApartment(id, token, dataToSend);
            toast.success("Mieszkanie zostało zaktualizowane pomyślnie!");
            router.push(`/dashboard/apartments`);
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
            area: Math.floor(Math.random() * 100) + 20,
            numberOfRooms: Math.floor(Math.random() * 5) + 1,
            numberOfBathrooms: 2,
            floor: Math.floor(Math.random() * 10) + 1,
            furnished: Math.random() > 0.5,
            hasBalcony: Math.random() > 0.5,
            parkingType: Math.random() > 0.5 ? "UNDERGROUND" : "STREET",
            hasElevator: Math.random() > 0.5,
            disabledAccessible: Math.random() > 0.5,
            hasStorageRoomInBasement: Math.random() > 0.5,
            streetName: randomString(15),
            buildingNumber: Math.floor(Math.random() * 100) + 1,
            apartmentNumber: Math.floor(Math.random() * 50) + 1,
            city: randomString(10), // Random city name
            postalCode: `${Math.floor(Math.random() * 90) + 10}-${Math.floor(Math.random() * 900) + 100}`, // Random postal code
            country: "Poland"
        };
        setAppData(prevData => prevData.map(item => ({
            ...item, value: randomApartment[item.name] || item.value
        })));
    }

    return (<>
            <div className="bg-white py-[24px] px-[32px] rounded-lg flex flex-col gap-5">

                <div className={"flex flex-col gap-[32px]"}>
                    <div>
                        <h3>
                            {type === "add" ? "Dodaj mieszkanie" : "Edytuj mieszkanie"}
                        </h3>
                    </div>
                    <div className={"grid grid-cols-2 gap-5"}>
                        {appData.map((item, index) => (<FormFileld
                                key={index}
                                label={item.label}
                                item={item}
                                changeState={(item, value) => {
                                    const newData = [...appData];
                                    newData[index].value = value;
                                    setAppData(newData);
                                }}
                            />))}

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
                        title={type === "add" ? "Dodaj mieszkanie" : "Zaktualizuj mieszkanie"}
                        onClick={type === "add" ? handleAddToDatabase : () => handleUpdate(appId, accessToken)}
                    />
                </div>
            </div>

            {/*<pre>*/}
            {/*            <code className="text-sm text-gray-800">*/}
            {/*                {JSON.stringify(appData, null, 2)}*/}
            {/*            </code>*/}
            {/*          </pre>*/}

        </>);
}


const FormFileld = ({label, item, changeState}) => {
    return (<div className={"group"}>
            <label htmlFor={label.name}
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
        </div>)
}
