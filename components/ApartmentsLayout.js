
// ApartmentsLayout.js
"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import data from "@/data/apartments.json";
import FilterSidebar from "@/components/FilterSidebar";
import ApartmentsList from "@/components/ApartmentsList";
import PageTransition from "@/components/PageTransition";

export default function ApartmentsLayout() {
    const searchParams = useSearchParams();
    const [initialApartments] = useState(data);
    const [filteredApartments, setFilteredApartments] = useState(data);
    const [filters, setFilters] = useState({
        location: "",
        district: "",
        priceRange: 15000,
        billsIncluded: undefined,
        deposit: undefined,
        propertyType: "",
        furnishing: [],
        roomsCount: [],
        bathrooms: [],
        amenities: [],
        shortTermRental: undefined,
        smokingAllowed: undefined,
        disabledAccess: undefined,
        petsAccepted: undefined,
    });

    // przy inicjalizacji ustaw filtry z URL
    useEffect(() => {
        const updated = { ...filters };
        if (searchParams.get("location")) updated.location = searchParams.get("location");
        if (searchParams.get("priceRange")) updated.priceRange = Number(searchParams.get("priceRange"));
        if (searchParams.get("propertyType")) updated.propertyType = searchParams.get("propertyType");
        if (searchParams.get("minArea")) updated.minArea = searchParams.get("minArea");
        if (searchParams.get("maxArea")) updated.maxArea = searchParams.get("maxArea");
        setFilters(updated);
    }, []);

    const applyFilters = () => {
        const filtered = initialApartments.filter((apartment) => {
            const { filter, area } = apartment;
            if (filters.location && !filter.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
            if (apartment.price > filters.priceRange) return false;
            if (filters.propertyType && filter.propertyType !== filters.propertyType) return false;
            if (filters.minArea && apartment.area < Number(filters.minArea)) return false;
            if (filters.maxArea && apartment.area > Number(filters.maxArea)) return false;
            // ... pozostałe warunki
            return true;
        });
        setFilteredApartments(filtered);
    };

    useEffect(() => applyFilters(), [filters]);

    return (
        <PageTransition>
            <div className="flex bg-gray-50 min-h-screen items-start pt-[100px]">
                <FilterSidebar filters={filters} setFilters={setFilters}/>
                <ApartmentsList apartments={filteredApartments}/>
            </div>
        </PageTransition>
    );
}
