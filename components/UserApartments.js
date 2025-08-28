"use client";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import Link from "next/link";
import Debugger from "@/components/Debugger";
import Image from "next/image";

/** ————————————————————————————————————————————
 *  Utilities
 *  ———————————————————————————————————————————— */
const firstImageUrl = (item) => {
    const firstPublic = item?.images?.[0]?.publicUrl;
    if (!firstPublic) return "/default-image.jpg";
    const base = process.env.NEXT_PUBLIC_API_URL || "";
    return `${base}${firstPublic}`;
};

const fmt = (v, fallback = "—") => (v === 0 ? "0" : v ? String(v) : fallback);

/** ————————————————————————————————————————————
 *  Minimalny, wspólny Skeleton
 *  ———————————————————————————————————————————— */
function Skeleton({ className = "" }) {
    return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}
Skeleton.Text = ({ className = "" }) => <Skeleton className={`h-4 ${className}`} />;
Skeleton.Circle = ({ className = "" }) => <Skeleton className={`rounded-full ${className}`} />;
Skeleton.Image = ({ className = "" }) => <Skeleton className={`aspect-[16/10] w-full animate-pulse ${className}`} />;

/** ————————————————————————————————————————————
 *  Badge / Feature
 *  ———————————————————————————————————————————— */
function Badge({ children }) {
    return (
        <span className="rounded-full bg-black/60 backdrop-blur px-2.5 py-1 text-[11px] font-medium text-white shadow-sm">
            {children}
        </span>
    );
}

function Feature({ label, value }) {
    return (
        <div className="text-[12px] text-gray-700">
            <span className="font-semibold text-gray-900">{label}: </span>
            <span>{value}</span>
        </div>
    );
}

/** ————————————————————————————————————————————
 *  Kafelek z obrazkiem + lokalny skeleton obrazu
 *  ———————————————————————————————————————————— */
function ApartmentCard({ item }) {
    const [imgLoaded, setImgLoaded] = useState(false);
    // bez useMemo — proste wyprowadzenie za każdym renderem
    const imageUrl = firstImageUrl(item);
    const photosCount = item?.images?.length || 0;

    return (
        <div className="group relative bg-white rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden transition-all duration-300">
            {/* Obszar obrazka */}
            <div className="relative">
                {/* Skeleton obrazu (przykryty po załadowaniu) */}
                {!imgLoaded && (
                    <div className="absolute inset-0 z-0">
                        <Skeleton.Image />
                    </div>
                )}

                <div className={`relative aspect-[16/10] ${imgLoaded ? "" : "opacity-0"}`}>
                    <Image
                        src={imageUrl}
                        alt={`${fmt(item?.streetName, "Adres")} ${fmt(item?.buildingNumber, "")}`}
                        fill
                        className="object-cover transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (min-width: 769px) 33vw"
                        priority={false}
                        onLoadingComplete={() => setImgLoaded(true)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />

                    {/* Badges lewy górny */}
                    <div className="absolute top-3 left-3 flex gap-2">
                        {item?.area ? <Badge>{item.area} m²</Badge> : null}
                        {item?.numberOfRooms ? <Badge>{item.numberOfRooms} pokoje</Badge> : null}
                    </div>

                    {/* Licznik zdjęć prawy górny */}
                    {photosCount > 0 && (
                        <div className="absolute top-3 right-3">
                            <Badge>{photosCount} zdjęć</Badge>
                        </div>
                    )}

                    {/* Tytuł / adres */}
                    <div className="absolute bottom-3 left-3 right-3 text-white drop-shadow">
                        <Link
                            href={`/dashboard/apartments/${item.id}`}
                            className="text-[18px] font-semibold leading-tight hover:underline"
                        >
                            {fmt(item?.streetName, "Adres")} {fmt(item?.buildingNumber, "")}
                        </Link>
                        <p className="text-[12px] opacity-90">
                            {fmt(item?.city)}{item?.postalCode ? `, ${item.postalCode}` : ""}
                        </p>
                    </div>
                </div>
            </div>

            {/* Treść pod obrazem */}
            <div className="p-4">
                <div className="grid grid-cols-3 gap-2">
                    <Feature label="Piętro" value={fmt(item?.floor)} />
                    <Feature label="Winda" value={item?.hasElevator ? "Tak" : "Nie"} />
                    <Feature label="Balkon" value={item?.hasBalcony ? "Tak" : "Nie"} />
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <div className="text-[12px] text-gray-500">
                        ID: <span className="font-mono">{item?.id}</span>
                    </div>
                    <Link
                        href={`/dashboard/apartments/${item.id}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-black text-white text-[13px] px-4 py-2 hover:bg-neutral-800 transition-colors"
                    >
                        Szczegóły
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="opacity-90"
                        >
                            <path d="M8 5l8 7-8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}

/** ————————————————————————————————————————————
 *  Widok listy użytkownika z pełnym skeletonem siatki
 *  ———————————————————————————————————————————— */
export default function UserApartments() {
    const [apartments, setApartments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { accessToken, handleLogout, userId } = useContext(AuthContext);

    useEffect(() => {
        const fetchUserApartments = async () => {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
            try {
                setIsLoading(true);
                const response = await fetch(`${baseUrl}/api/apartments`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ accessToken }),
                });
                if (response.status === 401) {
                    handleLogout();
                    return;
                }
                const data = await response.json();
                setApartments(Array.isArray(data?.apartments) ? data.apartments : []);
            } catch (error) {
                console.error("Error fetching apartments:", error);
            } finally {
                setIsLoading(false);
            }
        };
        if (accessToken) fetchUserApartments();
        else {
            console.warn("Access token is not available");
            setIsLoading(false);
        }
    }, [accessToken]);

    // bez useMemo — proste filtrowanie w renderze
    const myApartments = (apartments || []).filter((a) => a?.landlordId === userId);

    // Skeleton element odzwierciedlający kartę
    const CardSkeleton = () => (
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden">
            <Skeleton.Image />
            <div className="p-4">
                <div className="grid grid-cols-3 gap-2">
                    <Skeleton.Text className="w-2/3" />
                    <Skeleton.Text className="w-1/2" />
                    <Skeleton.Text className="w-2/5" />
                </div>
                <div className="mt-4 flex items-center justify-between">
                    <Skeleton.Text className="w-24" />
                    <Skeleton className="h-9 w-24" />
                </div>
            </div>
        </div>
    );

    return (
        <>

            <div className="mt-[32px]">
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px] text-black">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <CardSkeleton key={i} />
                        ))}
                    </div>
                ) : myApartments?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px] text-black">
                        {myApartments.map((item) => (
                            <ApartmentCard key={item.id} item={item} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">Brak mieszkań do wyświetlenia.</p>
                )}
            </div>
        </>
    );
}
