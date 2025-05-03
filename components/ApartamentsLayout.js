"use client";
import {useState, useEffect} from "react";
import data from "@/data/apartments.json";
import FilterSidebar from "@/components/FilterSidebar";
import ApartmentsList from "@/components/ApartmentsList";
import PageTransition from "@/components/PageTransition";

export default function ApartmentsLayout() {
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

    const applyFilters = () => {
        const filtered = initialApartments.filter((apartment) => {
            const {filter} = apartment;
            if (
                filters.location &&
                !filter.location.toLowerCase().includes(filters.location.toLowerCase())
            ) return false;
            if (filters.district && filter.district !== filters.district) return false;
            if (apartment.price > filters.priceRange) return false;
            if (typeof filters.billsIncluded === "boolean" && filter.billsIncluded !== filters.billsIncluded)
                return false;
            if (typeof filters.deposit === "boolean" && filter.deposit !== filters.deposit)
                return false;
            if (filters.propertyType && filter.propertyType !== filters.propertyType)
                return false;
            if (filters.furnishing.length > 0 && !filters.furnishing.includes(filter.furnishing))
                return false;
            if (filters.roomsCount.length > 0 && !filters.roomsCount.includes(filter.roomsCount))
                return false;
            if (filters.bathrooms.length > 0 && !filters.bathrooms.includes(filter.bathrooms))
                return false;
            if (filters.amenities.length > 0) {
                for (let amenity of filters.amenities) {
                    if (!filter.amenities.includes(amenity)) return false;
                }
            }
            if (typeof filters.shortTermRental === "boolean" && filter.shortTermRental !== filters.shortTermRental)
                return false;
            if (filters.smokingAllowed !== undefined && filter.smokingAllowed !== filters.smokingAllowed)
                return false;
            if (typeof filters.disabledAccess === "boolean" && filter.disabledAccess !== filters.disabledAccess)
                return false;
            if (filters.petsAccepted !== undefined && filter.petsAccepted !== filters.petsAccepted)
                return false;
            return true;
        });
        setFilteredApartments(filtered);
    };

    useEffect(() => {
        applyFilters();
    }, [filters]);

    return (
        <PageTransition>
            <div className="flex bg-gray-50 min-h-screen items-start pt-[100px]">
                <FilterSidebar filters={filters} setFilters={setFilters}/>
                <ApartmentsList apartments={filteredApartments}/>
            </div>
        </PageTransition>

    );
}
