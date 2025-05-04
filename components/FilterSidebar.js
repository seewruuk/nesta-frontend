"use client";
import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import LocationDistrictFilter from "./LocationDistrictFilter";
import PriceRangeFilter from "./PriceRangeFilter";
import CheckboxGroupFilter from "./CheckboxGroupFilter";
import RadioGroupFilter from "./RadioGroupFilter";

export default function FilterSidebar({ filters, setFilters }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    // Aktualizacja URL po zmianie filtra
    const updateQuery = (key, value) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) {
            params.delete(key);
        } else if (Array.isArray(value)) {
            params.delete(key);
            value.forEach((v) => params.append(key, v));
        } else {
            params.set(key, String(value));
        }
        router.replace(
            `${pathname}${params.toString() ? `?${params.toString()}` : ""}`,
            { shallow: true }
        );
    };

    // Reset wszystkich filtrów (stan w ApartmentsLayout)
    const resetFilters = () => {
        setFilters({
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
        router.replace(pathname, { shallow: true });
    };

    return (
        <div className="w-1/4 p-6 bg-white border-r border-stone-200 flex flex-col gap-6">
            <button
                disabled={
                    !Object.keys(filters).some((key) => {
                        const value = filters[key];
                        return (
                            (Array.isArray(value) && value.length > 0) ||
                            (typeof value === "boolean" && value) ||
                            (typeof value === "string" && value !== "")
                        );
                    })

                }
                onClick={resetFilters}
                className="disabled:text-black/30 w-full border py-4 rounded-lg hover:bg-black hover:text-white transition-all duration-200 ease-in-out text-center text-sm font-semibold text-black cursor-pointer disabled:hover:bg-transparent disabled:cursor-not-allowed"
            >
                Resetuj opcje
            </button>

            <LocationDistrictFilter filters={filters} setFilters={setFilters} updateQuery={updateQuery} />
            <PriceRangeFilter filters={filters} setFilters={setFilters} updateQuery={updateQuery} />

            <CheckboxGroupFilter
                label="Czy rachunki są wliczone w cenę?"
                filterKey="billsIncluded"
                options={[{ label: "Tak", value: true }, { label: "Nie", value: false }]}
                filters={filters}
                setFilters={setFilters}
                updateQuery={updateQuery}
            />
            <CheckboxGroupFilter
                label="Kaucja"
                filterKey="deposit"
                options={[{ label: "Tak", value: true }, { label: "Nie", value: false }]}
                filters={filters}
                setFilters={setFilters}
                updateQuery={updateQuery}
            />
            <CheckboxGroupFilter
                label="Typ nieruchomości"
                filterKey="propertyType"
                options={[
                    { label: "Mieszkanie", value: "Mieszkanie" },
                    { label: "Studio", value: "Studio" },
                    { label: "Dom", value: "Dom" }
                ]}
                filters={filters}
                setFilters={setFilters}
                updateQuery={updateQuery}
            />
            <CheckboxGroupFilter
                label="Wyposażenie"
                filterKey="furnishing"
                options={[
                    { label: "Umeblowane", value: "Umeblowane" },
                    { label: "Nieumeblowane", value: "Nieumeblowane" },
                    { label: "Częściowo umeblowane", value: "Częściowo umeblowane" }
                ]}
                filters={filters}
                setFilters={setFilters}
                updateQuery={updateQuery}
            />
            <CheckboxGroupFilter
                label="Liczba pokoi w mieszkaniu"
                filterKey="roomsCount"
                options={[
                    { label: "1", value: "1" },
                    { label: "2", value: "2" },
                    { label: "3", value: "3" },
                    { label: "4+", value: "4+" }
                ]}
                filters={filters}
                setFilters={setFilters}
                updateQuery={updateQuery}
            />
            <CheckboxGroupFilter
                label="Liczba łazienek"
                filterKey="bathrooms"
                options={[
                    { label: "1", value: "1" },
                    { label: "2", value: "2" },
                    { label: "3+", value: "3+" }
                ]}
                filters={filters}
                setFilters={setFilters}
                updateQuery={updateQuery}
            />
            <CheckboxGroupFilter
                label="Udogodnienia"
                filterKey="amenities"
                options={[
                    { label: "Wifi", value: "Wifi" },
                    { label: "Balkon", value: "Balkon" },
                    { label: "Zmywarka", value: "Zmywarka" },
                    { label: "Winda", value: "Winda" },
                    { label: "Pralka", value: "Pralka" },
                    { label: "Miejsce parkingowe", value: "Miejsce parkingowe" }
                ]}
                filters={filters}
                setFilters={setFilters}
                updateQuery={updateQuery}
            />
            <CheckboxGroupFilter
                label="Wynajem krótkoterminowy"
                filterKey="shortTermRental"
                options={[{ label: "Tak", value: true }, { label: "Nie", value: false }]}
                filters={filters}
                setFilters={setFilters}
                updateQuery={updateQuery}
            />
            <RadioGroupFilter
                label="Czy akceptuje palenie?"
                filterKey="smokingAllowed"
                options={[
                    { label: "Tak", value: true },
                    { label: "Nie", value: false },
                    { label: "Do ustalenia", value: "Do ustalenia" }
                ]}
                filters={filters}
                setFilters={setFilters}
                updateQuery={updateQuery}
            />
            <CheckboxGroupFilter
                label="Dostęp dla osób niepełnosprawnych"
                filterKey="disabledAccess"
                options={[{ label: "Tak", value: true }, { label: "Nie", value: false }]}
                filters={filters}
                setFilters={setFilters}
                updateQuery={updateQuery}
            />
            <RadioGroupFilter
                label="Czy akceptuje zwierzęta?"
                filterKey="petsAccepted"
                options={[
                    { label: "Tak", value: true },
                    { label: "Nie", value: false },
                    { label: "Do ustalenia", value: "Do ustalenia" }
                ]}
                filters={filters}
                setFilters={setFilters}
                updateQuery={updateQuery}
            />
        </div>
    );
}

