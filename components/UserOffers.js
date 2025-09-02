"use client"
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import Debugger from "@/components/Debugger";
import {ImageUrl} from "@/lib/imageUrl";

/** ————————————————————————————————————————————
 *  Minimalny, wspólny Skeleton
 *  ———————————————————————————————————————————— */
function Skeleton({ className = "" }) {
    return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}
Skeleton.Text = ({ className = "" }) => <Skeleton className={`h-4 ${className}`} />;
Skeleton.Image = ({ className = "" }) => <Skeleton className={`aspect-[16/10] w-full ${className}`} />;

/** ————————————————————————————————————————————
 *  Karta oferty z lokalnym skeletonem obrazka
 *  ———————————————————————————————————————————— */
function OfferCard({ item }) {
    const [imgLoaded, setImgLoaded] = useState(false);

    // Obsługa różnych wariantów images
    const defaultImage = "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg";
    let imageUrl = defaultImage;

    if (Array.isArray(item.apartment.images) && item.apartment.images.length > 0) {
        const first = item.apartment.images[0];
        if (first && typeof first === "object" && first.publicUrl) {
            imageUrl = ImageUrl(first.publicUrl);
        } else if (typeof first === "string") {
            imageUrl = first;
        }
    }

    return (
        <div className="relative">

            {
                item.rentierId && (
                    <div className="absolute top-2 right-2 bg-black text-white text-xs font-semibold px-2 py-1 rounded-lg z-50">
                        Wynajęte
                    </div>
                )
            }

            <div className="bg-gray-100 px-4 py-1 rounded-lg group absolute z-50 top-2 left-2">
                <span className="text-[12px] font-semibold text-gray-600">
                    #00{item.id}
                </span>
            </div>

            <div className="relative w-full h-[180px] rounded-t-lg overflow-hidden">
                {!imgLoaded && (
                    <div className="absolute inset-0 z-0">
                        <Skeleton.Image />
                    </div>
                )}
                <Image
                    src={imageUrl}
                    alt={"app"}
                    fill
                    className={`object-cover transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
                    onLoadingComplete={() => setImgLoaded(true)}
                    priority={false}
                />
            </div>

            <div className="bg-white p-[16px] rounded-b-lg shadow-md">
                <Link href={`/dashboard/rental-offers/${item.id}`} className="flex flex-col group">
                    <div className="flex flex-col items-start gap-1">
                        <span className="group-hover:underline text-[20px] font-semibold">
                            {item.apartment?.streetName} {item.apartment?.buildingNumber}
                        </span>
                        <div>
                            <span>
                                {item.apartment?.city}
                                {item.apartment?.city && item.apartment?.country ? ", " : ""}
                                {item.apartment?.country}
                            </span>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}

/** ————————————————————————————————————————————
 *  Skeleton karty (odzwierciedla docelowy layout)
 *  ———————————————————————————————————————————— */
function OfferCardSkeleton() {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Skeleton.Image />
            <div className="p-[16px]">
                <Skeleton.Text className="w-2/3 mb-2" />
                <Skeleton.Text className="w-1/2" />
            </div>
        </div>
    );
}

/** ————————————————————————————————————————————
 *  Lista ofert użytkownika + skeleton siatki
 *  ———————————————————————————————————————————— */
export default function UserOffers({limit = null}) {
    const [offers, setOffers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const { accessToken, handleLogout, userId } = useContext(AuthContext);

    useEffect(() => {
        const fetcher = async () => {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
            try {
                setIsLoading(true);

                const response = await fetch(`${baseUrl}/api/rental-offers`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ accessToken })
                });

                // Jeżeli backend zwraca 401 jako status:
                if (response.status === 401) {
                    handleLogout();
                    setOffers([]);
                    return;
                }

                const data = await response.json();
                console.log(data)

                // Jeżeli backend używa odpowiedzi JSON z błędem:
                if (data?.error === "Unauthorized") {
                    handleLogout();
                    setOffers([]);
                    return;
                }

                setOffers(Array.isArray(data?.offers) ? data.offers : []);
                if(limit) {
                    setOffers(prev => prev.slice(0, limit));
                }
            } catch (error) {
                console.error("Error fetching offers:", error);
                setOffers([]);
            } finally {
                setIsLoading(false);
            }
        };

        if (accessToken) {
            fetcher();
        } else {
            console.warn("Access token is not available");
            setIsLoading(false);
        }
    }, [accessToken]);

    // Filtrujemy oferty po landlordId już po pobraniu, by nie renderować pustych elementów
    const myOffers = (offers || []).filter(o => o?.landlordId === userId);

    return (
        <>
            {/*<label className={"text-xs text-gray-500 font-semibold"}>Twoje Oferty</label>*/}
            <div className="">
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px] text-black">
                        {Array.from({ length: 6 }).map((_, i) => <OfferCardSkeleton key={i} />)}
                    </div>
                ) : myOffers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px] text-black">
                        {myOffers.map((item) => (
                            <OfferCard key={item.id} item={item} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">Brak ofert do wyświetlenia.</p>
                )}
            </div>
        </>
    );
}
