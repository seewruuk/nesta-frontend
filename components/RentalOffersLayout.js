// File: components/RentalOffersLayout.js
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import FilterSidebar from "@/components/FilterSidebar";
import ApartmentsList from "@/components/ApartmentsList";
import PageTransition from "@/components/PageTransition";
import Loading from "@/components/Loading";

export default function RentalOffersLayout() {
    return (
        <Suspense fallback={<Loading />}>
            <PageTransition>
                <RentalOffersRoot />
            </PageTransition>
        </Suspense>
    );
}

function RentalOffersRoot() {
    const searchParams = useSearchParams();

    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Domyślne filtry, priceRange ustawione na min wartość
    const [filters, setFilters] = useState({
        location: "",
        priceRange: 2500,
        propertyType: "",
        minArea: undefined,
        maxArea: undefined,
        billsIncluded: undefined,
        deposit: undefined,
        furnishing: [],
        roomsCount: [],
        bathrooms: [],
        amenities: [],
        shortTermRental: undefined,
        smokingAllowed: undefined,
        disabledAccess: undefined,
        petsAccepted: undefined,
    });

    // Pobranie ofert z backendu
    useEffect(() => {
        const fetchOffers = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/rentalOffer");
                const response = await res.json();
                console.log(response);
                if (res.status === 401) {
                    throw new Error("Brak autoryzacji lub token wygasł");
                }
                if (!res.ok) {
                    const txt = await res.text();
                    throw new Error(txt || "Błąd serwera");
                }
                const data = await res.json();
                // Mapowanie pól odpowiedzi na format frontendu
                const adapted = data.map((o) => ({
                    id: o.id,
                    landlordId: o.userId,
                    propertyType: o.apartment.type || "Mieszkanie",
                    rooms: o.apartment.numberOfRooms,
                    bathrooms: o.apartment.numberOfBathrooms,
                    area: o.apartment.area,
                    elevator: o.apartment.hasElevator,
                    balcony: o.apartment.hasBalcony,
                    city: o.apartment.city,
                    address: `${o.apartment.streetName} ${o.apartment.buildingNumber}/${o.apartment.apartmentNumber}, ${o.apartment.postalCode} ${o.apartment.city}`,
                    price: o.monthlyRent,
                    utilitiesIncluded: o.utilitiesIncluded,
                    deposit: o.deposit,
                    amenities: o.apartment.furnished ? ["Umeblowane"] : [],
                    image: null,
                }));
                setOffers(adapted);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchOffers();
    }, []);

    // Inicjalizacja filtrów z URL tylko raz
    useEffect(() => {
        const upd = { ...filters };
        const pLocation = searchParams.get("location");
        if (pLocation) upd.location = pLocation;
        const pPrice = searchParams.get("priceRange");
        if (pPrice) upd.priceRange = Number(pPrice);
        const pType = searchParams.get("propertyType");
        if (pType) upd.propertyType = pType;
        const pMin = searchParams.get("minArea");
        if (pMin) upd.minArea = Number(pMin);
        const pMax = searchParams.get("maxArea");
        if (pMax) upd.maxArea = Number(pMax);
        setFilters(upd);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Zastosowanie filtrów
    const displayed = offers.filter((item) => {
        if (filters.location && !item.city.toLowerCase().includes(filters.location.toLowerCase())) return false;
        if (filters.priceRange && item.price > filters.priceRange) return false;
        if (filters.propertyType && item.propertyType !== filters.propertyType) return false;
        if (filters.minArea !== undefined && item.area < filters.minArea) return false;
        if (filters.maxArea !== undefined && item.area > filters.maxArea) return false;
        if (filters.billsIncluded !== undefined && item.utilitiesIncluded !== filters.billsIncluded) return false;
        if (filters.deposit !== undefined && (item.deposit > 0) !== filters.deposit) return false;
        return true;
    });

    if (loading) return <Loading />;
    if (error) return <div className="p-6 text-red-500">Błąd: {error}</div>;

    return (
        <div className="flex bg-gray-50 min-h-screen items-start pt-[100px]">
            <FilterSidebar filters={filters} setFilters={setFilters} />
            <ApartmentsList apartments={displayed} />
        </div>
    );
}
