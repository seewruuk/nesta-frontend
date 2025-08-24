"use client";
import React, {useContext, useEffect, useState} from 'react';
import {StateContext} from "@/context/StateContext";
import {AuthContext} from "@/context/AuthContext";
import DashboardElement from "@/components/DashboardElement";
import {RenderIcon} from "@/components/RenderIcon";
import {icons} from "@/src/icons";
import useFetch from "@/hooks/useFetch";
import AddEditApartment from "@/components/AddEditApartment";
import {deleteApartment} from "@/lib/deleteApartment";
import {AnimatePresence, motion} from "framer-motion";
import {useRouter} from "next/navigation";

export default function DashboardApartmentView({id}) {

    const {accessToken} = useContext(AuthContext);
    const [appData, setAppData] = useState([
        {
            label: "Powierzchnia",
            type: "number",
            placeholder: "Podaj powierzchnię mieszkania",
            value: "",
            name: "area",
            inputFiledType: "input",

        },
        {
            label: "Ilość pokoi",
            type: "number",
            placeholder: "Podaj ilość pokoi",
            value: "",
            name: "numberOfRooms",
            inputFiledType: "input",

        },
        {
            label: "Ilość łazienek",
            type: "number",
            placeholder: "Podaj ilość łazienek",
            value: "",
            name: "numberOfBathrooms",
            inputFiledType: "input",

        },
        {
            label: "Piętro",
            type: "number",
            placeholder: "Piętro na którym znajduje się mieszkanie",
            value: "",
            name: "floor",
            inputFiledType: "input",

        },
        {
            label: "Umeblowanie",
            type: "text",
            placeholder: "Tak/Nie",
            value: "",
            name: "furnished",
            selectOptions: [
                {label: "Tak", value: true},
                {label: "Nie", value: false},
            ],
            inputFiledType: "select",

        },
        {
            label: "Czy posiada balkon?",
            type: "text",
            placeholder: "Tak/Nie",
            value: "",
            name: "hasBalcony",
            selectOptions: [
                {label: "Tak", value: true},
                {label: "Nie", value: false},
            ],
            inputFiledType: "select",
        },
        {
            label: "Typ parkingu",
            type: "text",
            placeholder: "UNDERGROUND/OUTDOOR/NO PARKING",
            value: "",
            name: "parkingType",
            selectOptions: [
                {label: "UNDERGROUND", value: "UNDERGROUND"},
                {label: "STREET", value: "STREET"},
                {label: "NONE", value: "NONE"}
            ],
            inputFiledType: "select",
        },
        {
            label: "Posiada windę?",
            type: "text",
            placeholder: "Tak/Nie",
            value: "",
            name: "hasElevator",
            selectOptions: [
                {label: "Tak", value: true},
                {label: "Nie", value: false},
            ],
            inputFiledType: "select",
        },
        {
            label: "Dostęp dla osób niepełnosprawnych",
            type: "text",
            placeholder: "Tak/Nie",
            value: "",
            name: "disabledAccessible",
            selectOptions: [
                {label: "Tak", value: true},
                {label: "Nie", value: false},
            ],
            inputFiledType: "select",
        },
        {
            label: "Czy posiada komórkę lokatorską w piwnicy?",
            type: "text",
            placeholder: "Tak/Nie",
            value: "",
            name: "hasStorageRoomInBasement",
            selectOptions: [
                {label: "Tak", value: true},
                {label: "Nie", value: false},
            ],
            inputFiledType: "select",
        },
        {
            label: "Nazwa ulicy",
            type: "text",
            placeholder: "Podaj nazwę ulicy",
            value: "",
            name: "streetName",
            inputFiledType: "input",

        },
        {
            label: "Numer budynku",
            type: "text",
            placeholder: "Podaj numer budynku",
            value: "",
            name: "buildingNumber",
            inputFiledType: "input",

        },
        {
            label: "Numer mieszkania",
            type: "text",
            placeholder: "Podaj numer mieszkania",
            value: "",
            name: "apartmentNumber",
            inputFiledType: "input",

        },
        {
            label: "Miasto",
            type: "text",
            placeholder: "Podaj nazwę miasta",
            value: "",
            name: "city",
            inputFiledType: "input",

        },
        {
            label: "Kod pocztowy",
            type: "text",
            placeholder: "Podaj kod pocztowy",
            value: "",
            name: "postalCode",
            inputFiledType: "input",

        },
        {
            label: "Kraj",
            type: "text",
            placeholder: "Podaj nazwę kraju",
            value: "",
            name: "country",
            inputFiledType: "input",
        },
    ]);
    const [initialState, setInitialState] = useState({})
    const {
        data,
        loading,
        error
    } = useFetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/apartments/`, accessToken, 'POST', {id: id});
    const {transactions} = useContext(StateContext)
    const [formData, setFormData] = useState({})
    const [showAlert, setShowAlert] = useState(false);
    const router = useRouter();

    const handleDelete = async (appId, token) => {
        try {
            const x = await deleteApartment(appId, token);
            router.push(`/dashboard/apartments`);

        } catch (err) {
            console.error("Błąd podczas usuwania apartamentu: ", err);
            alert(`Błąd podczas usuwania apartamentu: ${err}`);
        }
    };

    function getValueFromData(data, name) {
        // jeśli klucz istnieje (nawet gdy jest false), zwróć jego wartość
        if (Object.prototype.hasOwnProperty.call(data, name)) {
            return data[name];
        }
        // w przeciwnym razie zostaw wartość domyślną (np. pusty string)
        return '';
    }


    useEffect(() => {
        if (data && !loading && !error) {
            const apartment = data.apartment;
            const formFields = appData.map(field => {
                console.log(field, data.apartment[field.name]);
                return {
                    ...field,
                    value: getValueFromData(apartment, field.name),
                };
            });

            setInitialState({
                formFields: formFields,
                apartmentId: data.apartment.id,
                transactions: transactions.filter(transaction => transaction.apartmentId === data.apartment.id)
            });

            // Initialize formData with the values from initialState.formFields
            const initialFormData = {};
            formFields.forEach(field => {
                initialFormData[field.name] = field.value;
            });
            setFormData(initialFormData);
        } else if (error) {
            console.error("Error fetching apartment data:", error);
            setInitialState({
                formFields: [],
                apartmentId: null,
                transactions: []
            });
            setFormData({});
        }
    }, [data, loading, error]);


    if (loading) return null;

    if (error) return (
        <div className="text-red-500 text-center mt-4">
            <p>{error}</p>
            <pre>
                <code className="text-sm text-gray-800">
                    {JSON.stringify(error, null, 2)}
                </code>
            </pre>

        </div>
    )


    return (
        <>

            <AnimatePresence>
                {
                    showAlert && (
                        <motion.div
                            className="fixed top-0 left-0 bottom-0 right-0 bg-red-500/90 backdrop-blur-[2px] bg-opacity-50 flex items-center justify-center z-[9999]"
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                        >
                            <DashboardElement>
                                <div className={"min-w-[34.375rem] flex items-center justify-center flex-col gap-3"}>
                                    <h3>Czy na pewno usunąc apartament?</h3>
                                    <p>Wybrano apartament o Id: {id}</p>
                                    <div className={"flex flex-col gap-2 "}>

                                        <button
                                            className={"bg-red-500 text-white px-6 py-4 rounded-xl hover:bg-red-600 transition-colors"}
                                            onClick={() => handleDelete(id, accessToken)}
                                        >
                                            Tak, usuń mieszkanie
                                        </button>
                                        <button
                                            className={"bg-gray-200 text-gray-800 px-6 py-4 rounded-xl hover:bg-gray-300 transition-colors"}
                                            onClick={() => setShowAlert(false)}
                                        >
                                            Anuluj
                                        </button>
                                    </div>

                                </div>

                            </DashboardElement>
                        </motion.div>
                    )
                }
            </AnimatePresence>

            <div className={"bg-transparent py-[24px]"}>
                <h1 className="text-[20px] font-semibold text-center">
                    Podgląd mieszkania
                </h1>
                <p className="text-center text-gray-600 text-[11px] font-semibold">
                    ID: {data.apartment.id}
                </p>
            </div>

            <DashboardElement>
                <div className={"flex gap-3 justify-between items-center"}>
                    <div>
                        <h3>{data.apartment.streetName} {data.apartment.buildingNumber}</h3>
                        <span
                            className={"text-[12px] text-gray font-semibold"}>{data.apartment.city}, {data.apartment.country}</span>
                    </div>
                    <div>
                        <div className="flex gap-6 items-center">
                            <button className="flex items-center gap-3 cursor-pointer"
                                    onClick={() => console.log("Settings")}>
                                <RenderIcon icon={icons.edit} className={"h-[24px]"}/>
                                <span className={"text-[14px] font-semibold mt-1"}>Ustawienia</span>
                            </button>
                            <button className="flex items-center gap-3 cursor-pointer"
                                    onClick={
                                        () => {
                                            setShowAlert(true);
                                        }
                                    }
                            >
                                <RenderIcon icon={icons.remove} className={"h-[24px]"}/>
                                <span className={"text-[14px] font-semibold mt-1 text-red-500"}>Usuń</span>
                            </button>
                        </div>
                    </div>
                </div>


            </DashboardElement>

            {
                initialState.formFields && (
                    <AddEditApartment type={"edit"} body={initialState.formFields} appId={initialState.apartmentId}/>

                )
            }

        </>
    );
}