"use client";

import React, { useCallback, useContext, useMemo, useState } from "react";
import { StateContext } from "@/context/StateContext";
import { AuthContext } from "@/context/AuthContext";
import DashboardElement from "@/components/DashboardElement";
import { RenderIcon } from "@/components/RenderIcon";
import { icons } from "@/src/icons";
import useFetch from "@/hooks/useFetch";
import AddEditApartment from "@/components/AddEditApartment";
import { deleteApartment } from "@/lib/deleteApartment";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Debugger from "@/components/Debugger";
import Image from "next/image";

/* =========================
   Stałe / utilsy (poza komponentem)
   ========================= */

const FORM_FIELDS = [
    { label: "Powierzchnia", type: "number", placeholder: "Podaj powierzchnię mieszkania", value: "", name: "area", inputFiledType: "input" },
    { label: "Ilość pokoi", type: "number", placeholder: "Podaj ilość pokoi", value: "", name: "numberOfRooms", inputFiledType: "input" },
    { label: "Ilość łazienek", type: "number", placeholder: "Podaj ilość łazienek", value: "", name: "numberOfBathrooms", inputFiledType: "input" },
    { label: "Piętro", type: "number", placeholder: "Piętro na którym znajduje się mieszkanie", value: "", name: "floor", inputFiledType: "input" },
    {
        label: "Umeblowanie",
        type: "text",
        placeholder: "Tak/Nie",
        value: "",
        name: "furnished",
        selectOptions: [
            { label: "Tak", value: true },
            { label: "Nie", value: false },
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
            { label: "Tak", value: true },
            { label: "Nie", value: false },
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
            { label: "UNDERGROUND", value: "UNDERGROUND" },
            { label: "STREET", value: "STREET" },
            { label: "NONE", value: "NONE" },
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
            { label: "Tak", value: true },
            { label: "Nie", value: false },
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
            { label: "Tak", value: true },
            { label: "Nie", value: false },
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
            { label: "Tak", value: true },
            { label: "Nie", value: false },
        ],
        inputFiledType: "select",
    },
    { label: "Nazwa ulicy", type: "text", placeholder: "Podaj nazwę ulicy", value: "", name: "streetName", inputFiledType: "input" },
    { label: "Numer budynku", type: "text", placeholder: "Podaj numer budynku", value: "", name: "buildingNumber", inputFiledType: "input" },
    { label: "Numer mieszkania", type: "text", placeholder: "Podaj numer mieszkania", value: "", name: "apartmentNumber", inputFiledType: "input" },
    { label: "Miasto", type: "text", placeholder: "Podaj nazwę miasta", value: "", name: "city", inputFiledType: "input" },
    { label: "Kod pocztowy", type: "text", placeholder: "Podaj kod pocztowy", value: "", name: "postalCode", inputFiledType: "input" },
    { label: "Kraj", type: "text", placeholder: "Podaj nazwę kraju", value: "", name: "country", inputFiledType: "input" },
];

const getValueFromData = (obj, name) =>
    Object.prototype.hasOwnProperty.call(obj ?? {}, name) ? obj[name] : "";

/** Ustala URL obrazka tła:
 * - jeśli istnieje obraz o id===1, weź jego publicUrl,
 * - w przeciwnym razie pierwszy obraz,
 * - zwróć pełny URL bazując na NEXT_PUBLIC_API_URL.
 */
const getHeroImageUrl = (images = []) => {
    if (!images.length) return null;
    const base = process.env.NEXT_PUBLIC_API_URL || "";
    const preferred = images.find((i) => i?.id === 1) ?? images[0];
    return preferred?.publicUrl ? `${base}${preferred.publicUrl}` : null;
};

/* =========================
   Mini-komponenty (w tym pliku)
   ========================= */

function ConfirmDeleteModal({ open, apartmentId, onConfirm, onClose }) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed top-0 left-0 bottom-0 right-0 bg-red-500/90 backdrop-blur-[2px] bg-opacity-50 flex items-center justify-center z-[9999]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <DashboardElement>
                        <div className="min-w-[34.375rem] flex items-center justify-center flex-col gap-3">
                            <h3>Czy na pewno usunąc apartament?</h3>
                            <p>Wybrano apartament o Id: {apartmentId}</p>
                            <div className="flex flex-col gap-2 ">
                                <button
                                    className="bg-red-500 text-white px-6 py-4 rounded-xl hover:bg-red-600 transition-colors"
                                    onClick={onConfirm}
                                >
                                    Tak, usuń mieszkanie
                                </button>
                                <button
                                    className="bg-gray-200 text-gray-800 px-6 py-4 rounded-xl hover:bg-gray-300 transition-colors"
                                    onClick={onClose}
                                >
                                    Anuluj
                                </button>
                            </div>
                        </div>
                    </DashboardElement>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function ApartmentHero({ id, imageUrl }) {
    return (
        <div className="bg-transparent py-[24px] relative">
            <h1 className="text-[20px] font-semibold text-center">Podgląd mieszkania</h1>
            <p className="text-center text-gray-600 text-[11px] font-semibold">ID: {id}</p>
        </div>
    );
}

function ActionBar({ apartmentId, onAskDelete }) {
    return (
        <DashboardElement>
            <div className="flex gap-3 justify-between items-center">
                <div>
                    {/* Placeholder na tytuł / adres — nadrabiamy w wyższym komponencie */}
                </div>
                <div className="flex gap-6 items-center">
                    <button className="flex items-center gap-3 cursor-pointer" onClick={() => console.log("Settings")}>
                        <RenderIcon icon={icons.edit} className="h-[24px]" />
                        <span className="text-[14px] font-semibold mt-1">Zmień zdjęcie</span>
                    </button>

                    <Link href={`/dashboard/apartments/${apartmentId}/images`} className="flex items-center gap-3 cursor-pointer">
                        <RenderIcon icon={icons.images} className="h-[24px]" />
                        <span className="text-[14px] font-semibold mt-1">Zdjęcia</span>
                    </Link>

                    <button className="flex items-center gap-3 cursor-pointer" onClick={onAskDelete}>
                        <RenderIcon icon={icons.remove} className="h-[24px]" />
                        <span className="text-[14px] font-semibold mt-1 text-red-500">Usuń</span>
                    </button>
                </div>
            </div>
        </DashboardElement>
    );
}

/* =========================
   Główny komponent
   ========================= */

export default function DashboardApartmentView({ id }) {
    const router = useRouter();
    const { accessToken } = useContext(AuthContext);
    const { transactions } = useContext(StateContext);

    const { data, loading, error } = useFetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/apartments/`,
        accessToken,
        "POST",
        { id }
    );

    const [showAlert, setShowAlert] = useState(false);

    const apartment = data?.apartment;

    // Pochodne dane liczone raz, kiedy 'data' lub 'transactions' się zmienią
    const memo = useMemo(() => {
        if (!apartment) {
            return {
                formFields: [],
                apartmentId: null,
                heroUrl: null,
                filteredTx: [],
                initialFormData: {},
            };
        }

        const formFields = FORM_FIELDS.map((field) => ({
            ...field,
            value: getValueFromData(apartment, field.name),
        }));

        const initialFormData = formFields.reduce((acc, f) => {
            acc[f.name] = f.value;
            return acc;
        }, {});

        const heroUrl = getHeroImageUrl(apartment.images ?? []);
        const filteredTx = (transactions ?? []).filter(
            (t) => t?.apartmentId === apartment.id
        );

        return {
            formFields,
            apartmentId: apartment.id,
            heroUrl,
            filteredTx,
            initialFormData,
        };
    }, [apartment, transactions]);

    const handleDelete = useCallback(
        async (appId) => {
            try {
                await deleteApartment(appId, accessToken);
                router.push(`/dashboard/apartments`);
            } catch (err) {
                console.error("Błąd podczas usuwania apartamentu: ", err);
                alert(`Błąd podczas usuwania apartamentu: ${err}`);
            }
        },
        [router, accessToken]
    );

    if (loading) return null;

    if (error) {
        return (
            <div className="text-red-500 text-center mt-4">
                <p>{String(error)}</p>
                <pre>
          <code className="text-sm text-gray-800">
            {JSON.stringify(error, null, 2)}
          </code>
        </pre>
            </div>
        );
    }

    if (!apartment) return null;

    return (
        <>

            <ConfirmDeleteModal
                open={showAlert}
                apartmentId={id}
                onConfirm={() => handleDelete(id)}
                onClose={() => setShowAlert(false)}
            />

            <ApartmentHero id={apartment.id} imageUrl={memo.heroUrl} />

            <DashboardElement>
                <div className="flex gap-3 justify-between items-center">
                    <div>
                        <h3>
                            {apartment.streetName} {apartment.buildingNumber}
                        </h3>
                        <span className="text-[12px] text-gray font-semibold">
              {apartment.city}, {apartment.country}
            </span>
                    </div>
                    <div className="hidden md:block">
                        <div className="flex gap-6 items-center">
                            <button className="flex items-center gap-3 cursor-pointer" onClick={() => console.log("Settings")}>
                                <RenderIcon icon={icons.edit} className="h-[24px]" />
                                <span className="text-[14px] font-semibold mt-1">Zmień zdję</span>
                            </button>

                            <Link
                                href={`/dashboard/apartments/${apartment.id}/images`}
                                className="flex items-center gap-3 cursor-pointer"
                            >
                                <RenderIcon icon={icons.images} className="h-[24px]" />
                                <span className="text-[14px] font-semibold mt-1">Zdjęcia</span>
                            </Link>

                            <button
                                className="flex items-center gap-3 cursor-pointer"
                                onClick={() => setShowAlert(true)}
                            >
                                <RenderIcon icon={icons.remove} className="h-[24px]" />
                                <span className="text-[14px] font-semibold mt-1 text-red-500">
                  Usuń
                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </DashboardElement>

            {/* Alternatywny pasek akcji — do łatwego wyniesienia */}
            <div className="md:hidden">
                <ActionBar apartmentId={apartment.id} onAskDelete={() => setShowAlert(true)} />
            </div>

            {/* Edycja pól (zostawiam AddEditApartment jak w oryginale, ale z już policzonym body/appId) */}
            {memo.formFields?.length > 0 && (
                <AddEditApartment type="edit" body={memo.formFields} appId={memo.apartmentId} />
            )}
        </>
    );
}
