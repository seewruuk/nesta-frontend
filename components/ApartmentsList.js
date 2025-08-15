// File: components/ApartmentsList.js
"use client";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Button";
import PlaceholderImage from "@/public/images/registerimage.png"

export default function ApartmentsList({ apartments }) {
    if (!apartments.length) {
        return <div className="p-6">Brak ofert spełniających kryteria.</div>;
    }

    return (
        <div className="flex-grow p-6 grid grid-cols-3 gap-6">
            {apartments.map((item) => (
                <div key={item.id} className="flex flex-col">
                    <Link
                        href={`/rental-offers/${item.id}`}
                        className="relative h-[13dvw] bg-gray-200 mb-4 rounded-lg"
                    >
                        <Image
                            src={item.image || PlaceholderImage}
                            alt={item.address}
                            fill
                            className="rounded-lg object-cover hover:opacity-80 transition-all"
                        />
                    </Link>

                    <div className="flex flex-col gap-2">
                        <Link
                            href={`/rental-offers/${item.id}`}
                            className="text-lg font-semibold text-black hover:underline"
                        >
                            {item.propertyType} {item.rooms}-pokojowe, {item.area}m²
                        </Link>
                        <p className="text-sm text-gray-500">{item.address}</p>

                        <div className="flex flex-wrap gap-1 text-xs text-gray-500">
                            {item.amenities.map((amenity, idx) => (
                                <span key={idx}>
                  {amenity}
                                    {idx < item.amenities.length - 1 ? "," : ""}
                </span>
                            ))}
                        </div>

                        <div className="p-4 bg-white rounded-lg flex flex-col gap-2 shadow-sm">
                            <div className="flex justify-between items-center">
                <span className="font-semibold text-sm">
                  Właściciel: {item.landlordId}
                </span>
                                <span className="text-sm font-medium text-gray-700">
                  {Intl.NumberFormat("pl-PL").format(item.price)} zł / miesiąc
                </span>
                            </div>

                            <div className="flex gap-2 justify-end mt-2">
                                <Button
                                    type="link"
                                    style="primary"
                                    title="Zobacz więcej"
                                    onClick={`/rental-offers/${item.id}`}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
