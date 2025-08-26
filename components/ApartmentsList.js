// File: components/ApartmentsList.js
"use client";

import Link from "next/link";
import Image from "next/image";
import {Swiper, SwiperSlide} from "swiper/react";
import {Pagination, A11y} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import {RenderIcon} from "@/components/RenderIcon";
import {icons} from "@/src/icons";
import Debugger from "@/components/Debugger";

export const DEFAULT_IMAGES = [
    "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
    "https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg",
    "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",

    "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
    "https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg",
    "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",

    "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
    "https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg",
    "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
];

export const randomApartmentTitles = [
    "Przestronny apartament w centrum miasta",
    "Nowoczesne mieszkanie z widokiem na park",
    "Urokliwy apartament blisko plaży",
    "Luksusowy penthouse z tarasem",
    "Klimatyczne studio w zabytkowej kamienicy",
    "Rodzinny apartament z ogrodem",
    "Eleganckie mieszkanie w prestiżowej dzielnicy",
    "Przytulny apartament z balkonem",
    "Designerskie mieszkanie w modnej okolicy",
    "Komfortowy apartament blisko komunikacji miejskiej",
];

export default function ApartmentsList({apartments}) {
    if (!apartments?.length) {
        return (
            <div className="max-w-[1200px] mx-auto py-16 text-center text-gray-500">
                <h3>
                    Nie znaleziono żadnych ofert spełniających podane kryteria.
                </h3>
                <p>
                    Spróbuj zmienić filtry wyszukiwania lub sprawdź ponownie później.
                </p>
            </div>
        )
    }
    return (
        <>
            {
                <Debugger data={apartments} />
            }
            <div className="space-y-6 max-w-[1200px] mx-auto pb-16">
                {apartments.map((item) => {
                    const images =
                        Array.isArray(item.images) && item.images.length > 0
                            ? item.images
                            : DEFAULT_IMAGES;

                    const initialIndex = Math.floor(Math.random() * images.length);

                    return (
                        <div
                            key={item.id}
                            className="flex bg-white rounded-lg overflow-hidden"
                        >

                            {/* LEWA: zdjęcie */}
                            <div className="h-[320px] w-[450px] relative shrink-0">
                                <Swiper
                                    modules={[Pagination, A11y]}
                                    pagination={{
                                        clickable: true,
                                        bulletClass: "swiper-pagination-bullet bg-gray-300", // bazowe
                                        bulletActiveClass: "bg-primary swiper-pagination-bullet-active" // aktywna = kolor primary
                                    }}
                                    loop={images.length > 1}
                                    initialSlide={initialIndex}
                                    className="h-full w-full"
                                >

                                    {images.map((src, idx) => (
                                        <SwiperSlide key={`${item.id}-img-${idx}`}>
                                            <div className="relative w-full h-full bg-gray-100">
                                                <Image
                                                    src={`${process.env.NEXT_PUBLIC_API_URL}${src.publicUrl}`}
                                                    alt={`Zdjęcie ${idx + 1}`}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw"
                                                />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>

                            {/* PRAWA: szczegóły */}
                            <div className="p-4 flex flex-col flex-grow relative">
                                {/* Cena + czynsz */}
                                <div className="flex items-baseline justify-between gap-4 flex-wrap">
                                    <Link
                                        href={`/rental-offers/${item.id}`}
                                        className="text-xl font-semibold text-gray-900 hover:underline">
                                        {
                                            randomApartmentTitles[
                                            item.id % randomApartmentTitles.length
                                                ]
                                        }
                                    </Link>

                                    <Link
                                        href={`/rental-offers/${item.id}`}
                                        className="text-sm text-gray-500 font-semibold hover:underline"
                                    >
                                        Zobacz szczegóły
                                    </Link>
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
                                    <span>{item.address}</span>
                                </div>


                                <div className={'flex-grow'}>
                                    <div
                                        className="text-gray-700 text-sm mt-2 flex items-center gap-2 text-[16px] font-semibold">

                                        {
                                            item.rooms &&
                                            <div className={"flex gap-2 items-center"}>
                                                <RenderIcon icon={icons.door} className={"h-[32px]"}/>
                                                <span>{item.rooms}</span>
                                            </div>
                                        }

                                        {
                                            item.bathrooms &&
                                            <div className={"flex gap-2 items-center"}>
                                                <RenderIcon icon={icons.wc} className={"h-[32px]"}/>
                                                <span>{item.bathrooms}</span>
                                            </div>
                                        }

                                        {
                                            item.floor &&
                                            <div className={"flex gap-2 items-center"}>
                                                <RenderIcon icon={icons.size} className={"h-[32px]"}/>
                                                <span>{item.area} m²</span>
                                            </div>
                                        }

                                    </div>
                                </div>


                                {/* Adres */}


                                {/* Udogodnienia */}
                                {item.amenities?.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-600">
                                        {item.amenities.slice(0, 5).map((amenity) => (
                                            <span
                                                key={amenity}
                                                className="bg-gray-100 rounded px-2 py-1 text-xs"
                                            >
                                          {amenity}
                                        </span>
                                        ))}
                                    </div>
                                )}

                                <div className={"flex flex-col mt-[6px]"}>
                                    {/*<div className={"text-gray-500 text-[14px]"}>Koszt: </div>*/}
                                    <div className={"flex items-center gap-2"}>
                                        <div className={"text-[32px] font-semibold"}>{item.price} zł</div>
                                        <div> / miesiąc</div>
                                    </div>
                                    {
                                        item.deposit ? (
                                            <div>
                                                <span className={"text-gray-500 text-[14px]"}>Kaucja: </span>
                                                <span className={"font-semibold"}>{item.deposit} zł</span>
                                            </div>
                                        ) : null
                                    }
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
