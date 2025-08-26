"use client";
import Layout from "@/components/Layout";
import Link from "next/link";
import Button from "@/components/Button";
import Image from "next/image";
import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import PageTransition from "@/components/PageTransition";
import {AnimatePresence, motion} from "framer-motion";
import {AuthContext} from "@/context/AuthContext";
import Debugger from "@/components/Debugger";
import {RenderIcon} from "@/components/RenderIcon";
import {icons} from "@/src/icons";
import {DEFAULT_IMAGES, randomApartmentTitles} from "@/components/ApartmentsList";
import {toast} from "react-hot-toast";
import {useRouter} from "next/navigation";
import {ImageUrl} from "@/lib/imageUrl";

/**
 * ---------------------------
 *     POD-KOMPONENTY
 * ---------------------------
 */

const ApplicationPopup = React.memo(function ApplicationPopup({
                                                                  open,
                                                                  onClose,
                                                                  onSubmit,
                                                                  availableFrom,
                                                                  availableUntil,
                                                                  setDate,
                                                                  setTime,
                                                              }) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    className="fixed inset-0 z-50 grid h-full place-items-center"
                    aria-modal="true"
                    role="dialog"
                >
                    <div className="absolute inset-0 bg-primary opacity-90" onClick={onClose} />
                    <div className="relative z-50 w-[min(92vw,560px)] rounded-3xl bg-white p-6 md:p-8 shadow-xl">
                        <div className="flex flex-col gap-4">
                            <h3 className="text-center text-lg font-semibold">Wybierz datę i godzinę</h3>

                            <div className="text-sm flex justify-evenly">
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-[15px] font-semibold text-gray-500">Dostępny od</span>
                                    <span>{availableFrom ?? "-"}</span>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-[15px] font-semibold text-gray-500">Dostępny do</span>
                                    <span>{availableUntil ?? "-"}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <input
                                    type="date"
                                    className="rounded-lg border border-gray/20 p-2"
                                    onChange={(e) => setDate(e.target.value)}
                                />
                                <input
                                    type="time"
                                    className="rounded-lg border border-gray/20 p-2"
                                    onChange={(e) => setTime(e.target.value)}
                                />

                                <Button type="button" style="black" title="Wyślij aplikację" onClick={onSubmit}>
                                    Wyślij aplikację
                                </Button>
                            </div>
                        </div>

                        <button
                            aria-label="Zamknij"
                            onClick={onClose}
                            className="absolute right-4 top-4 rounded-full bg-gray-100 px-2 py-1 text-sm"
                        >
                            ✕
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
});

const Lightbox = React.memo(function Lightbox({
                                                  open,
                                                  images,
                                                  index,
                                                  onClose,
                                                  onPrev,
                                                  onNext,
                                              }) {
    const escHandler = useCallback(
        (e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") onPrev();
            if (e.key === "ArrowRight") onNext();
        },
        [onClose, onPrev, onNext]
    );

    useEffect(() => {
        if (!open) return;
        document.addEventListener("keydown", escHandler);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", escHandler);
            document.body.style.overflow = "";
        };
    }, [open, escHandler]);

    if (!open) return null;

    const current = images?.[index];

    return (
        <AnimatePresence>
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                className="fixed inset-0 z-[60] bg-black/90"
                onClick={onClose}
                role="dialog"
                aria-modal="true"
            >
                <div
                    className="absolute inset-0 flex items-center justify-center p-4"
                    onClick={(e) => e.stopPropagation()}
                >
                    {current && (
                        <div className="relative w-full h-full max-w-6xl max-h-[90vh]">
                            <Image
                                src={ImageUrl(current.publicUrl)}
                                alt="Podgląd zdjęcia"
                                fill
                                className="object-contain select-none"
                                priority
                            />
                        </div>
                    )}

                    {/* Nawigacja */}
                    <button
                        aria-label="Poprzednie zdjęcie"
                        onClick={onPrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 backdrop-blur transition hover:bg-white/20"
                    >
                        ‹
                    </button>
                    <button
                        aria-label="Następne zdjęcie"
                        onClick={onNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 backdrop-blur transition hover:bg-white/20"
                    >
                        ›
                    </button>

                    <button
                        aria-label="Zamknij"
                        onClick={onClose}
                        className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1 backdrop-blur transition hover:bg-white/20"
                    >
                        ✕
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
});

const Gallery = React.memo(function Gallery({
                                                images,
                                                selectedIndex,
                                                setSelectedIndex,
                                                onOpenLightbox,
                                            }) {
    const main = images?.[selectedIndex];

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <div
                className="relative h-[380px] cursor-zoom-in overflow-hidden rounded-lg bg-gray/10"
                onClick={onOpenLightbox}
                role="button"
                aria-label="Otwórz zdjęcie w trybie pełnoekranowym"
            >
                {main && (
                    <Image
                        src={ImageUrl(main.publicUrl)}
                        alt="Zdjęcie mieszkania"
                        fill
                        className="object-cover"
                        priority
                    />
                )}
            </div>
            <div className="mt-[12px]">
                <div className="flex gap-2 justify-start overflow-x-auto">
                    {images?.map((i, idx) => (
                        <button
                            key={idx}
                            className={`relative h-[80px] min-w-[130px] overflow-hidden rounded-lg border ${
                                idx === selectedIndex ? "border-black" : "border-transparent"
                            }`}
                            onClick={() => setSelectedIndex(idx)}
                            aria-label={`Wybierz zdjęcie ${idx + 1}`}
                        >
                            <Image
                                src={ImageUrl(i.publicUrl)}
                                alt={`Miniatura ${idx + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
});

const InfoList = React.memo(function InfoList({apartmentData}) {
    const a = apartmentData?.apartment ?? {};
    return (
        <div>
            <h4 className="mb-[12px] text-[24px] font-semibold text-black">Informacje ogólne</h4>
            <ul className="leading-8 text-[16px] font-[300] text-gray-700">
                <li>
                    <strong>Adres:</strong>{" "}
                    {`${a.streetName ?? ""} ${a.buildingNumber ?? ""}/${a.apartmentNumber ?? ""}, ${a.postalCode ?? ""} ${a.city ?? ""}, ${a.country ?? ""}`}
                </li>
                <li>
                    <strong>Piętro:</strong> {a.floor ?? "-"}
                </li>
                <li>
                    <strong>Dostępne od:</strong>{" "}
                    {apartmentData?.availableFrom ? new Date(apartmentData.availableFrom).toLocaleDateString() : "-"}
                </li>
                <li>
                    <strong>Dostępne do:</strong>{" "}
                    {apartmentData?.availableUntil ? new Date(apartmentData.availableUntil).toLocaleDateString() : "-"}
                </li>
                <li>
                    <strong>Wynajem krótkoterminowy:</strong>{" "}
                    {apartmentData?.shortTermRental ? "Tak" : "Nie"}
                </li>
            </ul>
        </div>
    );
});

const Policies = React.memo(function Policies({apartmentData}) {
    const mapEmployment = {
        ANY: "Dowolny",
        EMPLOYED: "Zatrudniony",
        STUDENT: "Student",
    };
    return (
        <div>
            <h4 className="mb-[12px] text-[24px] font-semibold text-black">Zasady i polityki</h4>
            <ul className="leading-8 text-[16px] font-[300] text-gray-700">
                <li>
                    <strong>Zwierzęta:</strong> {apartmentData?.petPolicy === "YES" ? "Dozwolone" : "Niedozwolone"}
                </li>
                <li>
                    <strong>Palenie:</strong> {apartmentData?.smokingPolicy === "YES" ? "Dozwolone" : "Niedozwolone"}
                </li>
                <li>
                    <strong>Preferowany status zatrudnienia:</strong>{" "}
                    {mapEmployment[apartmentData?.preferredEmploymentStatus] ?? "-"}
                </li>
            </ul>
        </div>
    );
});

const Amenities = React.memo(function Amenities({apartmentData}) {
    const a = apartmentData?.apartment ?? {};
    const parkingMap = {STREET: "Ulica", UNDERGROUND: "Podziemny", NONE: "Brak"};
    return (
        <div>
            <h4 className="mb-[12px] text-[24px] font-semibold text-black">Udogodnienia</h4>
            <ul className="leading-8 text-[16px] font-[300] text-gray-700">
                <li>
                    <strong>Meble:</strong> {a.furnished ? "Tak" : "Nie"} (
                    {apartmentData?.furnishingStatus?.toLowerCase?.() ?? "-"})
                </li>
                <li>
                    <strong>Balkon:</strong> {a.hasBalcony ? "Tak" : "Nie"}
                </li>
                <li>
                    <strong>Winda:</strong> {a.hasElevator ? "Tak" : "Nie"}
                </li>
                <li>
                    <strong>Komórka lokatorska:</strong> {a.hasStorageRoomInBasement ? "Tak" : "Nie"}
                </li>
                <li>
                    <strong>Dla niepełnosprawnych:</strong> {a.disabledAccessible ? "Tak" : "Nie"}
                </li>
                <li>
                    <strong>Parking:</strong> {parkingMap[a.parkingType] ?? "-"}
                </li>
            </ul>
        </div>
    );
});

/**
 * ---------------------------
 *     KOMPONENT GŁÓWNY
 * ---------------------------
 */

export default function SingleApartmentLayout({id}) {
    const {accessToken, handleLogout, userId} = useContext(AuthContext);
    const [showPopUp, setShowPopUp] = useState(false);
    const [apartmentData, setApartmentData] = useState(null);
    const [apartmentImages, setApartmentImages] = useState(DEFAULT_IMAGES);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [combinedDateTime, setCombinedDateTime] = useState("");
    const [apartmentApplications, setApartmentApplications] = useState([]);
    const [userHasApplied, setUserHasApplied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const router = useRouter();
    const fetchedRef = useRef(false);

    // Pobieranie danych mieszkania
    useEffect(() => {
        if (!accessToken || !id) return;

        // zapobiegnij niepotrzebnym wielokrotnym wywołaniom, jeśli React StricMode w DEV wywołuje dwukrotnie
        if (fetchedRef.current) return;
        fetchedRef.current = true;

        const fetchApartmentData = async () => {
            try {
                setLoading(true);
                setError("");
                const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
                const response = await fetch(`${baseUrl}/api/rental-offers`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({accessToken, id}),
                    cache: "no-store",
                });

                const data = await response.json();

                if (data?.status === 401) {
                    toast.error("Brak dostępu. Proszę się zalogować ponownie.");
                    handleLogout();
                    return;
                }

                const offer = data?.offer;
                setApartmentData(offer ?? null);

                const imgs = offer?.apartment?.images?.length ? offer.apartment.images : DEFAULT_IMAGES;
                setApartmentImages(imgs);
                setSelectedIndex(0);

                const applications = offer?.moveInApplications ?? [];
                setApartmentApplications(applications);
                setUserHasApplied(applications.some((app) => app?.rentierId === userId));
            } catch (err) {
                console.error("Wystąpił błąd:", err);
                setError("Nie udało się pobrać danych mieszkania.");
            } finally {
                setLoading(false);
            }
        };

        fetchApartmentData();
    }, [accessToken, id, handleLogout, userId]);

    // Sklejanie daty i czasu na ISO
    useEffect(() => {
        if (selectedDate && selectedTime) {
            const combined = new Date(`${selectedDate}T${selectedTime}`);
            setCombinedDateTime(combined.toISOString());
        }
    }, [selectedDate, selectedTime]);

    const displayedTitle = useMemo(() => {
        if (!apartmentData?.id && apartmentData?.id !== 0) return "";
        return randomApartmentTitles[apartmentData.id % randomApartmentTitles.length];
    }, [apartmentData]);

    const handleSaveApplication = useCallback(async () => {
        if (!combinedDateTime || !apartmentData?.id) {
            toast.error("Wybierz poprawnie datę i godzinę.");
            return;
        }
        try {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
            const response = await fetch(`${baseUrl}/api/moveinapplications/create`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    accessToken,
                    selectedDate: combinedDateTime,
                    rentalOfferId: apartmentData.id,
                }),
            });
            const data = await response.json();
            if (data?.application) {
                toast.success("Twoja aplikacja została wysłana pomyślnie!");
                setShowPopUp(false);
                router.refresh();
            } else {
                toast.error(data?.error || "Coś poszło nie tak. Spróbuj ponownie później.");
            }
        } catch (err) {
            console.error("Wystąpił błąd:", err);
            toast.error("Nie udało się wysłać aplikacji.");
        }
    }, [combinedDateTime, apartmentData?.id, accessToken, router]);

    const openLightbox = useCallback(() => setLightboxOpen(true), []);
    const closeLightbox = useCallback(() => setLightboxOpen(false), []);
    const prevImage = useCallback(() => {
        setSelectedIndex((i) => (i - 1 + apartmentImages.length) % apartmentImages.length);
    }, [apartmentImages.length]);
    const nextImage = useCallback(() => {
        setSelectedIndex((i) => (i + 1) % apartmentImages.length);
    }, [apartmentImages.length]);

    if (loading) {
        return (
            <div className="px-6 pt-[150px]">
                <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
                <div className="mt-4 h-[380px] w-full animate-pulse rounded bg-gray-200" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="px-6 pt-[150px]">
                <p className="text-red-600">{error}</p>
                <Link href="/rental-offers" className="text-sm text-gray-500 underline">
                    Powrót
                </Link>
            </div>
        );
    }

    if (!apartmentData) {
        return <div className="px-6 pt-[150px]">Ładowanie...</div>;
    }

    const a = apartmentData?.apartment ?? {};

    return (
        <>
            {/* Debugger wyłączony w produkcji */}
            {process.env.NODE_ENV === "development" && apartmentImages && <Debugger data={apartmentImages} />}

            {/* Lightbox Fullscreen */}
            <Lightbox
                open={lightboxOpen}
                images={apartmentImages}
                index={selectedIndex}
                onClose={closeLightbox}
                onPrev={prevImage}
                onNext={nextImage}
            />

            <PageTransition>
                <Layout>
                    <div className="flex items-center gap-6 pt-[150px]">
                        <Link href="/rental-offers" className="text-sm text-gray-500">
                            Powrót
                        </Link>
                        <div className="h-[1px] flex-grow bg-gray/20" />
                    </div>

                    <section className="mt-[24px] flex items-center justify-between gap-12">
                        {/* Galeria */}
                        <Gallery
                            images={apartmentImages}
                            selectedIndex={selectedIndex}
                            setSelectedIndex={setSelectedIndex}
                            onOpenLightbox={openLightbox}
                        />

                        {/* Prawy panel */}
                        <div className="flex-1 h-full">
                            <div className="flex flex-col gap-5">
                                <div className="flex flex-wrap items-baseline justify-between gap-4">
                                    <div className="text-xl font-semibold text-gray-900">{displayedTitle}</div>
                                </div>

                                <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                                    <svg
                                        className="h-4 w-4 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={1.5}
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M19.5 10.5c0 7.5-7.5 12-7.5 12S4.5 18 4.5 10.5a7.5 7.5 0 1115 0z"
                                        />
                                    </svg>
                                    <span>{a?.streetName ?? "-"}</span>
                                </div>

                                <div className="flex-grow">
                                    <div className="mt-2 flex items-center gap-4 text-[16px] font-semibold text-gray-700">
                                        {a?.numberOfRooms ? (
                                            <div className="flex items-center gap-2">
                                                <RenderIcon icon={icons.door} className="h-[32px]" />
                                                <span>{a.numberOfRooms}</span>
                                            </div>
                                        ) : null}

                                        {a?.numberOfBathrooms ? (
                                            <div className="flex items-center gap-2">
                                                <RenderIcon icon={icons.wc} className="h-[32px]" />
                                                <span>{a.numberOfBathrooms}</span>
                                            </div>
                                        ) : null}

                                        {a?.area ? (
                                            <div className="flex items-center gap-2">
                                                <RenderIcon icon={icons.size} className="h-[32px]" />
                                                <span>{a.area} m²</span>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="mt-[6px] flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <div className="text-[32px] font-semibold">{apartmentData.monthlyRent} zł</div>
                                        <div>/ miesiąc</div>
                                    </div>

                                    {apartmentData?.deposit ? (
                                        <div>
                                            <span className="text-[14px] text-gray-500">Kaucja: </span>
                                            <span className="font-semibold">{apartmentData.deposit} zł</span>
                                        </div>
                                    ) : null}
                                </div>
                            </div>

                            {!userHasApplied ? (
                                <div className="mt-[12px] flex flex-col gap-2">
                                    <Button
                                        type="button"
                                        onClick={() => setShowPopUp(true)}
                                        title="Zaproponuj datę wprowadzenia się"
                                        style="primary"
                                    />
                                </div>
                            ) : (
                                <div className="mt-[12px] flex flex-col gap-2">
                                    <Button
                                        type="button"
                                        title="Już złożyłeś aplikację na to mieszkanie"
                                        style="primary"
                                        disabled={userHasApplied}
                                        onClick={() => setShowPopUp(false)}
                                    />
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="mt-[90px] flex flex-wrap gap-12 pb-[120px]">
                        <div className="flex gap-12">
                            <InfoList apartmentData={apartmentData} />
                            <Policies apartmentData={apartmentData} />
                        </div>
                        <Amenities apartmentData={apartmentData} />
                    </section>
                </Layout>
            </PageTransition>

            {/* Popup aplikacji */}
            <ApplicationPopup
                open={showPopUp}
                onClose={() => setShowPopUp(false)}
                onSubmit={handleSaveApplication}
                availableFrom={apartmentData?.availableFrom}
                availableUntil={apartmentData?.availableUntil}
                setDate={setSelectedDate}
                setTime={setSelectedTime}
            />
        </>
    );
}
