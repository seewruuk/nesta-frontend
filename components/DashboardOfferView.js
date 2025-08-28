"use client";
import React, {useContext, useEffect, useState} from 'react';
import {StateContext} from "@/context/StateContext";
import {AuthContext} from "@/context/AuthContext";
import DashboardElement from "@/components/DashboardElement";
import {RenderIcon} from "@/components/RenderIcon";
import {icons} from "@/src/icons";
import useFetch from "@/hooks/useFetch";
import {AnimatePresence, motion} from "framer-motion";
import {useRouter} from "next/navigation";
import AddEditOffer from "@/components/AddEditOffer";
import {deleteOffer} from "@/lib/offers/deleteOffer";
import Debugger from "@/components/Debugger";

export default function DashboardOfferView({id}) {

    const {accessToken} = useContext(AuthContext);
    const [offerData, setOfferData] = useState([
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
            placeholder: "Pracujący / Studencki / Inny",
            value: "",
            name: "preferredEmploymentStatus",
            selectOptions: [
                {label: "Pracujący", value: "EMPLOYED"},
                {label: "Studencki", value: "STUDENT"},
                {label: "Inny", value: "ANY"},
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

    ]);
    const [initialState, setInitialState] = useState({})
    const {
        data,
        loading,
        error
    } = useFetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/rental-offers/`, accessToken, 'POST', {id: id});
    const {transactions} = useContext(StateContext)
    const [formData, setFormData] = useState({})
    const [showAlert, setShowAlert] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        try {
            const x = await deleteOffer(id, accessToken);
            router.push(`/dashboard/rental-offers`);

        } catch (err) {
            console.error("Błąd podczas usuwania apartamentu: ", err);
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
            const offer = data.offer;
            const formFields = offerData.map(field => {
                return {
                    ...field,
                    value: getValueFromData(offer, field.name),
                };
            });

            setInitialState({
                formFields: formFields,
                offerId: data.offer.id,
                transactions: transactions.filter(transaction => transaction.offerId === data.offer.id)
            });

            // Initialize formData with the values from initialState.formFields
            const initialFormData = {};
            formFields.forEach(field => {
                initialFormData[field.name] = field.value;
            });
            setFormData(initialFormData);
        } else if (error) {
            console.error("Error fetching offer data:", error);
            setInitialState({
                formFields: [],
                offerId: null,
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
            {
            }

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
                                    <h3>Czy na pewno usunąć ofertę?</h3>
                                    <p>Wybrano oferte o Id: {id}</p>
                                    <div className={"flex flex-col gap-2 "}>


                                    <button
                                        className={"bg-red-500 text-white px-6 py-4 rounded-xl hover:bg-red-600 transition-colors"}

                                        onClick={() => handleDelete(id, accessToken)}
                                        >
                                            Tak, chce usunąć ofertę
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
                    Podgląd oferty
                </h1>
                <p className="text-center text-gray-600 text-[11px] font-semibold">
                    ID: {data.offer.id}
                </p>
            </div>

            <DashboardElement>
                <div className={"flex gap-3 justify-between items-center"}>
                    <div>
                        <div className={"flex items-center gap-3"}>
                            <div className={"bg-gray-100 px-4 py-1 rounded-lg group"}>
                                <span className={"text-[12px] font-semibold text-gray-600 "}>
                                    #00{id}
                                </span>
                            </div>
                            <h3>
                                <span className={"font-[500] text-gray"}>{data.offer.apartment.streetName}, {data.offer.apartment.buildingNumber}</span>
                            </h3>
                        </div>
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
                    <AddEditOffer type={"edit"} body={initialState.formFields} offerId={initialState.offerId} dataOfferApartmentId={data.offer.apartment.id}/>

                )
            }

        </>
    );
}