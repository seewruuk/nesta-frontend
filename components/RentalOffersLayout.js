// File: components/RentalOffersLayout.js
"use client";

import { useState, useEffect, Suspense, useContext } from "react";
import { useSearchParams } from "next/navigation";
import FiltersTopBar from "@/components/FiltersTopBar";
import ApartmentsList from "@/components/ApartmentsList";
import PageTransition from "@/components/PageTransition";
import Loading from "@/components/Loading";
import { AuthContext } from "@/context/AuthContext";
import Debugger from "@/components/Debugger";

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
    const { accessToken } = useContext(AuthContext);
    const searchParams = useSearchParams();

    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
        availableFrom: undefined,
        availableUntil: undefined,
        preferredEmploymentStatus: "",
        hasStorageRoomInBasement: undefined,
        parkingType: "",
    });

    // Pobranie danych z URL (location, priceRange)
    useEffect(() => {
        const locationParam = searchParams.get("location") ?? "";
        const priceRangeParam = searchParams.get("priceRange");

        setFilters(prev => ({
            ...prev,
            location: locationParam,
            priceRange: priceRangeParam ? Number(priceRangeParam) : prev.priceRange,
        }));
    }, [searchParams]);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                setLoading(true);
                setError("");

                const res = await fetch("/api/rental-offers", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ accessToken }),
                });

                const response = await res.json();

                const adapted = (response?.offers ?? []).map((o) => {
                    const furnishingMap = {
                        FURNISHED: "Umeblowane",
                        UNFURNISHED: "Nieumeblowane",
                        PARTLY_FURNISHED: "Częściowo umeblowane",
                        PARTIALLY_FURNISHED: "Częściowo umeblowane",
                    };
                    const furnishing =
                        furnishingMap[o.furnishingStatus] ??
                        (o.apartment?.furnished ? "Umeblowane" : "Nieumeblowane");

                    const amenities = [];
                    if (o.apartment?.hasBalcony) amenities.push("Balkon");
                    if (o.apartment?.hasElevator) amenities.push("Winda");
                    if (o.apartment?.parkingType && o.apartment.parkingType !== "STREET") {
                        amenities.push("Miejsce parkingowe");
                    }

                    const smokingAllowed = o.smokingPolicy === "YES";
                    const petsAccepted = o.petPolicy === "YES";
                    const disabledAccess = Boolean(
                        o.accessibleForDisabled || o.apartment?.disabledAccessible
                    );

                    return {
                        id: o.id,
                        landlordId: o.landlordId,
                        propertyType: "Mieszkanie",
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
                        floor: o.apartment.floor,
                        furnishing,
                        shortTermRental: o.shortTermRental,
                        smokingAllowed,
                        petsAccepted,
                        disabledAccess,
                        amenities,
                        availableFrom: o.availableFrom,
                        availableUntil: o.availableUntil,
                        preferredEmploymentStatus: o.preferredEmploymentStatus,
                        hasStorageRoomInBasement: o.apartment?.hasStorageRoomInBasement,
                        parkingType: o.apartment?.parkingType,
                        image: null,
                    };
                });

                setOffers(adapted);
            } catch (err) {
                setError(err?.message || "Nie udało się pobrać ofert.");
            } finally {
                setLoading(false);
            }
        };

        fetchOffers();
    }, []);

    const displayed = offers.filter((item) => {
        if (filters.location) {
            const q = filters.location.toLowerCase();
            const hit =
                (item.city || "").toLowerCase().includes(q) ||
                (item.address || "").toLowerCase().includes(q);
            if (!hit) return false;
        }

        if (typeof filters.priceRange === "number" && item.price > filters.priceRange)
            return false;

        if (filters.propertyType && item.propertyType !== filters.propertyType)
            return false;

        if (filters.minArea !== undefined && item.area < filters.minArea) return false;
        if (filters.maxArea !== undefined && item.area > filters.maxArea) return false;

        if (
            filters.billsIncluded !== undefined &&
            item.utilitiesIncluded !== filters.billsIncluded
        )
            return false;

        if (filters.deposit !== undefined && (item.deposit > 0) !== filters.deposit)
            return false;

        if (Array.isArray(filters.furnishing) && filters.furnishing.length > 0) {
            if (!filters.furnishing.includes(item.furnishing)) return false;
        }

        if (Array.isArray(filters.roomsCount) && filters.roomsCount.length > 0) {
            const okRooms = filters.roomsCount.some((val) =>
                val === "4+" ? item.rooms >= 4 : item.rooms === Number(val)
            );
            if (!okRooms) return false;
        }

        if (Array.isArray(filters.bathrooms) && filters.bathrooms.length > 0) {
            const okBath = filters.bathrooms.some((val) =>
                val === "3+" ? item.bathrooms >= 3 : item.bathrooms === Number(val)
            );
            if (!okBath) return false;
        }

        if (Array.isArray(filters.amenities) && filters.amenities.length > 0) {
            const allPresent = filters.amenities.every((a) => item.amenities.includes(a));
            if (!allPresent) return false;
        }

        if (
            filters.shortTermRental !== undefined &&
            item.shortTermRental !== filters.shortTermRental
        )
            return false;

        if (
            typeof filters.smokingAllowed === "boolean" &&
            item.smokingAllowed !== filters.smokingAllowed
        )
            return false;

        if (
            filters.disabledAccess !== undefined &&
            item.disabledAccess !== filters.disabledAccess
        )
            return false;

        if (
            typeof filters.petsAccepted === "boolean" &&
            item.petsAccepted !== filters.petsAccepted
        )
            return false;

        // NOWE FILTRY ⬇️⬇️⬇️

        if (
            filters.availableFrom &&
            new Date(item.availableFrom) < new Date(filters.availableFrom)
        )
            return false;

        if (
            filters.availableUntil &&
            new Date(item.availableUntil) > new Date(filters.availableUntil)
        )
            return false;

        if (
            filters.preferredEmploymentStatus &&
            item.preferredEmploymentStatus !== filters.preferredEmploymentStatus
        )
            return false;

        if (
            filters.hasStorageRoomInBasement !== undefined &&
            item.hasStorageRoomInBasement !== filters.hasStorageRoomInBasement
        )
            return false;

        if (
            filters.parkingType &&
            item.parkingType !== filters.parkingType
        )
            return false;

        return true;
    });

    if (loading) return <Loading />;
    if (error) return <div className="p-6 text-red-500">Błąd: {error}</div>;

    return (
        <div className="bg-gray-50 min-h-screen pt-[100px] px-4">
            <FiltersTopBar filters={filters} setFilters={setFilters} />
            <ApartmentsList apartments={displayed} />
            {/*<Debugger data={displayed}  />*/}
        </div>
    );
}
