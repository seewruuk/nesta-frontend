// File: components/FiltersTopBar.js
"use client";

import React from "react";

export default function FiltersTopBar({ filters, setFilters }) {
    const update = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => {
        setFilters({
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
    };

    return (
        <div className="bg-white rounded-md px-4 py-6 mb-6 max-w-[1200px] mx-auto">
            <div className="flex flex-wrap gap-4 items-end">

                {/* Lokalizacja */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Lokalizacja</label>
                    <input
                        type="text"
                        value={filters.location}
                        onChange={(e) => update("location", e.target.value)}
                        placeholder="Wpisz miasto lub adres"
                        className="border border-gray-300 rounded px-3 py-2 w-[200px]"
                    />
                </div>

                {/* Cena */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Cena maks.</label>
                    <input
                        type="number"
                        value={filters.priceRange}
                        onChange={(e) =>
                            update("priceRange", e.target.value ? Number(e.target.value) : "")
                        }
                        placeholder="do zł"
                        className="border border-gray-300 rounded px-3 py-2 w-[120px]"
                    />
                </div>

                {/* Powierzchnia */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Powierzchnia</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="od"
                            value={filters.minArea ?? ""}
                            onChange={(e) => {
                                const val = e.target.value === "" ? undefined : Number(e.target.value);
                                update("minArea", val);
                            }}
                            className="border border-gray-300 rounded px-2 py-2 w-[60px]"
                        />
                        <input
                            type="number"
                            placeholder="do"
                            value={filters.maxArea ?? ""}
                            onChange={(e) => {
                                const val = e.target.value === "" ? undefined : Number(e.target.value);
                                update("maxArea", val);
                            }}
                            className="border border-gray-300 rounded px-2 py-2 w-[60px]"
                        />
                        <span className="text-sm text-gray-500 self-center">m²</span>
                    </div>
                </div>

                {/* Pokoje */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Pokoje</label>
                    <div className="flex gap-1">
                        {["1", "2", "3", "4+"].map((val) => (
                            <button
                                key={val}
                                onClick={() => {
                                    const current = filters.roomsCount.includes(val);
                                    const newValues = current
                                        ? filters.roomsCount.filter((v) => v !== val)
                                        : [...filters.roomsCount, val];
                                    update("roomsCount", newValues);
                                }}
                                className={`px-3 py-2 rounded border text-sm ${
                                    filters.roomsCount.includes(val)
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-white text-gray-700 border-gray-300"
                                }`}
                            >
                                {val}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dostępność od */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Dostępne od</label>
                    <input
                        type="date"
                        value={filters.availableFrom ?? ""}
                        onChange={(e) => update("availableFrom", e.target.value || undefined)}
                        className="border border-gray-300 rounded px-3 py-2 w-[150px]"
                    />
                </div>

                {/* Dostępność do */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Dostępne do</label>
                    <input
                        type="date"
                        value={filters.availableUntil ?? ""}
                        onChange={(e) => update("availableUntil", e.target.value || undefined)}
                        className="border border-gray-300 rounded px-3 py-2 w-[150px]"
                    />
                </div>

                {/* Status zatrudnienia */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Status zatrudnienia</label>
                    <select
                        value={filters.preferredEmploymentStatus}
                        onChange={(e) => update("preferredEmploymentStatus", e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 w-[160px]"
                    >
                        <option value="">Dowolny</option>
                        <option value="EMPLOYED">Zatrudniony</option>
                        <option value="STUDENT">Student</option>
                        <option value="RETIRED">Emeryt</option>
                    </select>
                </div>

                {/* Komórka lokatorska */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Komórka lokatorska</label>
                    <select
                        value={
                            filters.hasStorageRoomInBasement === undefined
                                ? ""
                                : String(filters.hasStorageRoomInBasement)
                        }
                        onChange={(e) => {
                            const val =
                                e.target.value === ""
                                    ? undefined
                                    : e.target.value === "true";
                            update("hasStorageRoomInBasement", val);
                        }}
                        className="border border-gray-300 rounded px-3 py-2 w-[150px]"
                    >
                        <option value="">Dowolnie</option>
                        <option value="true">Tak</option>
                        <option value="false">Nie</option>
                    </select>
                </div>

                {/* Rodzaj parkowania */}
                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Parking</label>
                    <select
                        value={filters.parkingType}
                        onChange={(e) => update("parkingType", e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 w-[160px]"
                    >
                        <option value="">Dowolnie</option>
                        <option value="STREET">Ulica</option>
                        <option value="GARAGE">Garaż</option>
                        <option value="UNDERGROUND">Podziemny</option>
                        <option value="OUTDOOR">Naziemny</option>
                    </select>
                </div>

                {/* Reset */}
                <div className="ml-auto flex gap-2">
                    <button
                        onClick={resetFilters}
                        className="px-4 py-2 text-sm text-gray-600 hover:underline"
                    >
                        Wyczyść filtry
                    </button>
                </div>
            </div>
        </div>
    );
}
