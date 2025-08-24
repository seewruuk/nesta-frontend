"use client"
import apartments from "@/data/apartments.json"
import Layout from "@/components/Layout";
import Link from "next/link";
import Button from "@/components/Button";
import Image from "next/image";
import {useContext, useEffect, useState} from "react";
import PageTransition from "@/components/PageTransition";
import {AnimatePresence, motion} from "framer-motion";
import {AuthContext} from "@/context/AuthContext";
import Debugger from "@/components/Debugger";
import {RenderIcon} from "@/components/RenderIcon";
import {icons} from "@/src/icons";
import {DEFAULT_IMAGES, randomApartmentTitles} from "@/components/ApartmentsList";


export default function SingleApartmentLayout({id}) {
    const {accessToken} = useContext(AuthContext);
    const [showPopUp, setShowPopUp] = useState(false);
    const [apartmentData, setApartmentData] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");

    useEffect(() => {
        if (accessToken) {
            const fetchApartmentData = async () => {
                try {
                    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
                    const response = await fetch(`${baseUrl}/api/rental-offers`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            accessToken: accessToken,
                            id: id
                        })
                    })

                    const data = await response.json();
                    setApartmentData(data.offer);
                } catch (err) {
                    console.log("Wystąpił błąd:", err);
                }
            }

            fetchApartmentData();
        }
    }, [accessToken])

    const handleSelectDate = (date) => {

        // if(date < apartmentData.availableFrom || date > apartmentData.availableUntil){
        //     alert("Wybrana data jest poza dostępnym zakresem.");
        //     return;
        // }
        setSelectedDate(date);
    }
    const handleSelectTime = (time) => {
        if(selectedDate){
            const combinedDateTime = `${selectedDate}T${time}:00`;
            setSelectedDate(combinedDateTime);
        }
    }
    // date and time format 2025-08-23T12:18:08.783268w

    const handleSaveApplication = async () => {

        try {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
            const response = await fetch(`${baseUrl}/api/moveinapplications/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    accessToken: accessToken,
                    selectedDate: selectedDate,
                    rentalOfferId: apartmentData.id
                })
            })
            const data = await response.json();
            if(data.application){
                alert("Aplikacja została wysłana pomyślnie!");
                setShowPopUp(false);
            }else{
                alert("Wystąpił błąd podczas wysyłania aplikacji: " + (data.error || "Nieznany błąd"));
            }
        } catch (err) {
            console.log("Wystąpił błąd:", err);
        }
    }



    let item = {
        images: DEFAULT_IMAGES
    }


    if (!apartmentData) {
        return <div>Ładowanie...</div>

    }
    return (
        <>

            {
                apartmentData && <Debugger data={apartmentData}/>
            }

            <AnimatePresence>
                {
                    showPopUp &&
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        className={"absolute top-0 left-0 right-0 bottom-0 z-50 h-full grid place-items-center isolate"}>
                        <div className={"z-0 bg-primary absolute top-0 bottom-0 right-0 left-0 opacity-90"}/>
                        <div className={"p-8 rounded-3xl bg-white z-50"}>
                            <div>
                                <h3>Wybierz date i godzine</h3>
                                <p>availableFrom {apartmentData.availableFrom}</p>
                                <p>availableUntil {apartmentData.availableUntil}</p>
                                <input type="date" className={"border border-gray/20 rounded-lg p-2 mt-4"}
                                       onChange={(e) => handleSelectDate(e.target.value)}/>
                                <input type="time" className={"border border-gray/20 rounded-lg p-2 mt-4"}
                                       onChange={(e) => handleSelectTime(e.target.value)}/>

                                <button
                                    type={"button"}
                                    onClick={() => handleSaveApplication()}
                                >
                                    Wyślij aplikację
                                </button>

                            </div>
                        </div>
                    </motion.div>
                }
            </AnimatePresence>

            <PageTransition>


                <Layout>

                    <div className={"flex items-center gap-6 pt-[150px]"}>
                        <Link href={"/rental-offers"} className="text-sm text-gray-500">
                            Powrót
                        </Link>

                        <div className={"h-[1px] flex-grow bg-gray/20"}/>
                    </div>


                    <section className={"flex justify-between gap-12 items-center mt-[24px]"}>
                        <div className={"flex-1 flex flex-col overflow-hidden"}>
                            <div className={"h-[380px] relative rounded-lg overflow-hidden bg-gray/10"}>
                                <Image src={item.images[selectedIndex]} alt={"asd"} fill className=" object-cover"/>
                            </div>
                            <div>
                                <div className={"flex gap-2 mt-[12px] justify-start overflow-x-scroll"}>
                                    {item.images.map((image, index) => (
                                        <div
                                            key={index}
                                            className={`h-[80px] min-w-[130px] relative rounded-lg overflow-hidden  bg-gray/1`}
                                            onClick={() => setSelectedIndex(index)}
                                        >
                                            <Image src={image} alt={"asd"} fill className=" object-cover"/>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className={"flex-1 h-full"}>
                            <div className="flex flex-col gap-5">
                                <div className="flex items-baseline justify-between gap-4 flex-wrap">
                                    <div
                                        className="text-xl font-semibold text-gray-900">
                                        {
                                            randomApartmentTitles[
                                            apartmentData.id % randomApartmentTitles.length
                                                ]
                                        }
                                    </div>
                                </div>

                                <div className="mt-2 text-gray-500 text-sm flex items-center gap-2">
                                    <svg
                                        className="w-4 h-4 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={1.5}
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M19.5 10.5c0 7.5-7.5 12-7.5 12S4.5 18 4.5 10.5a7.5 7.5 0 1115 0z"
                                        />
                                    </svg>
                                    <span>{apartmentData.apartment.streetName}</span>
                                </div>


                                <div className={'flex-grow'}>
                                    <div
                                        className="text-gray-700 text-sm mt-2 flex items-center gap-2 text-[16px] font-semibold">

                                        {
                                            apartmentData.apartment.numberOfRooms &&
                                            <div className={"flex gap-2 items-center"}>
                                                <RenderIcon icon={icons.door} className={"h-[32px]"}/>
                                                <span>{apartmentData.apartment.numberOfRooms}</span>
                                            </div>
                                        }

                                        {
                                            apartmentData.apartment.numberOfBathrooms &&
                                            <div className={"flex gap-2 items-center"}>
                                                <RenderIcon icon={icons.wc} className={"h-[32px]"}/>
                                                <span>{apartmentData.apartment.numberOfBathrooms}</span>
                                            </div>
                                        }

                                        {
                                            apartmentData.apartment.area &&
                                            <div className={"flex gap-2 items-center"}>
                                                <RenderIcon icon={icons.size} className={"h-[32px]"}/>
                                                <span>{apartmentData.apartment.area} m²</span>
                                            </div>
                                        }

                                    </div>
                                </div>


                                {/* Udogodnienia */}
                                {/*{apartmentData.amenities?.length > 0 && (*/}
                                {/*    <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-600">*/}
                                {/*        {apartmentData.amenities.slice(0, 5).map((amenity) => (*/}
                                {/*            <span*/}
                                {/*                key={amenity}*/}
                                {/*                className="bg-gray-100 rounded px-2 py-1 text-xs"*/}
                                {/*            >*/}
                                {/*          {amenity}*/}
                                {/*        </span>*/}
                                {/*        ))}*/}
                                {/*    </div>*/}
                                {/*)}*/}

                                <div className={"flex flex-col mt-[6px]"}>
                                    {/*<div className={"text-gray-500 text-[14px]"}>Koszt: </div>*/}
                                    <div className={"flex items-center gap-2"}>
                                        <div className={"text-[32px] font-semibold"}>{apartmentData.monthlyRent} zł
                                        </div>
                                        <div> / miesiąc</div>
                                    </div>
                                    {
                                        apartmentData.deposit ? (
                                            <div>
                                                <span className={"text-gray-500 text-[14px]"}>Kaucja: </span>
                                                <span className={"font-semibold"}>{apartmentData.deposit} zł</span>
                                            </div>
                                        ) : null
                                    }
                                    {/*{*/}
                                    {/*    apartmentData.utilitiesCost ? (*/}
                                    {/*        <div>*/}
                                    {/*            <span className={"text-gray-500 text-[14px]"}>utilitiesCost: </span>*/}
                                    {/*            <span*/}
                                    {/*                className={"font-semibold"}>{apartmentData.utilitiesCost} zł</span>*/}
                                    {/*        </div>*/}
                                    {/*    ) : null*/}
                                    {/*}*/}
                                </div>
                            </div>

                            <div className={"flex flex-col gap-2 mt-[12px]"}>
                                <Button
                                    type={"button"}
                                    onClick={() => setShowPopUp(true)}
                                    title={"Umów się na oględziny"}
                                    style={"primary"}
                                />
                            </div>
                        </div>
                    </section>


                    <section className={"flex gap-12 mt-[90px] flex-wrap pb-[120px]"}>

                        <div className={"flex gap-12"}>
                            <div>
                                <h4 className={"text-[24px] font-semibold text-black mb-[12px]"}>
                                    Informacje ogólne
                                </h4>
                                <ul className="text-[16px] text-gray-700 font-[300] leading-8">
                                    <li>
                                        <strong>Adres:</strong>{" "}
                                        {`${apartmentData.apartment.streetName} ${apartmentData.apartment.buildingNumber}/${apartmentData.apartment.apartmentNumber}, ${apartmentData.apartment.postalCode} ${apartmentData.apartment.city}, ${apartmentData.apartment.country}`}
                                    </li>
                                    <li>
                                        <strong>Piętro:</strong> {apartmentData.apartment.floor}
                                    </li>
                                    <li>
                                        <strong>Dostępne od:</strong>{" "}
                                        {new Date(apartmentData.availableFrom).toLocaleDateString()}
                                    </li>
                                    <li>
                                        <strong>Dostępne do:</strong>{" "}
                                        {new Date(apartmentData.availableUntil).toLocaleDateString()}
                                    </li>
                                    <li>
                                        <strong>Wynajem krótkoterminowy:</strong>{" "}
                                        {apartmentData.shortTermRental ? "Tak" : "Nie"}
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h4 className={"text-[24px] font-semibold text-black mb-[12px]"}>
                                    Zasady i polityki
                                </h4>
                                <ul className="text-[16px] text-gray-700 font-[300] leading-8">
                                    <li>
                                        <strong>Zwierzęta:</strong>{" "}
                                        {apartmentData.petPolicy === "YES" ? "Dozwolone" : "Niedozwolone"}
                                    </li>
                                    <li>
                                        <strong>Palenie:</strong>{" "}
                                        {apartmentData.smokingPolicy === "YES" ? "Dozwolone" : "Niedozwolone"}
                                    </li>
                                    <li>
                                        <strong>Preferowany status zatrudnienia:</strong>{" "}
                                        {{
                                            ANY: "Dowolny",
                                            EMPLOYED: "Zatrudniony",
                                            STUDENT: "Student"
                                        }[apartmentData.preferredEmploymentStatus]}
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className={""}>
                            <h4 className={"text-[24px] font-semibold text-black mb-[12px]"}>Udogodnienia</h4>
                            <ul className="text-[16px] text-gray-700 font-[300] leading-8">
                                <li>
                                    <strong>Meble:</strong>{" "}
                                    {apartmentData.apartment.furnished ? "Tak" : "Nie"} (
                                    {apartmentData.furnishingStatus.toLowerCase()})
                                </li>
                                <li>
                                    <strong>Balkon:</strong>{" "}
                                    {apartmentData.apartment.hasBalcony ? "Tak" : "Nie"}
                                </li>
                                <li>
                                    <strong>Winda:</strong>{" "}
                                    {apartmentData.apartment.hasElevator ? "Tak" : "Nie"}
                                </li>
                                <li>
                                    <strong>Komórka lokatorska:</strong>{" "}
                                    {apartmentData.apartment.hasStorageRoomInBasement ? "Tak" : "Nie"}
                                </li>
                                <li>
                                    <strong>Dla niepełnosprawnych:</strong>{" "}
                                    {apartmentData.apartment.disabledAccessible ? "Tak" : "Nie"}
                                </li>
                                <li>
                                    <strong>Parking:</strong>{" "}
                                    {{
                                        STREET: "Ulica",
                                        UNDERGROUND: "Podziemny",
                                        NONE: "Brak"
                                    }[apartmentData.apartment.parkingType]}
                                </li>
                            </ul>
                        </div>


                    </section>


                </Layout>
            </PageTransition>
        </>

    )
}