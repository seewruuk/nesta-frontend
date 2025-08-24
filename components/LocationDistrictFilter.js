"use client";

import React, { useMemo } from "react";
export default function LocationDistrictFilter({
                                                   filters,
                                                   setFilters,
                                                   updateQuery,
                                                   cities = [],
                                                   districtsByCity = {},
                                               }) {
    const location = filters?.location ?? "";
    const selectedCity = useMemo(() => {
        if (!Array.isArray(cities) || cities.length === 0 || !location) return "";
        const lower = location.toLowerCase();
        const match = cities.find((c) => lower.startsWith(c.toLowerCase()));
        return match || "";
    }, [location, cities]);

    const availableDistricts = useMemo(() => {
        if (!selectedCity) return [];
        return districtsByCity[selectedCity] || [];
    }, [selectedCity, districtsByCity]);

    const district = filters?.district ?? "";

    const onLocationChange = (val) => {
        setFilters((prev) => {
            const next = { ...prev, location: val };
            // Jeśli użytkownik zmienił miasto, zresetuj dzielnicę
            if (district && selectedCity && !val.toLowerCase().startsWith(selectedCity.toLowerCase())) {
                next.district = "";
            }
            return next;
        });
        updateQuery?.("location", val);
    };

    const onDistrictChange = (val) => {
        setFilters((prev) => ({ ...prev, district: val }));
        updateQuery?.("district", val || undefined);
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
                Lokalizacja (miasto / adres)
            </label>

            {/* Input z opcjonalnym datalist dla miast */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="np. Gdańsk, Chabrowa 24..."
                    value={location}
                    onChange={(e) => onLocationChange(e.target.value)}
                    list={cities && cities.length > 0 ? "cities-datalist" : undefined}
                    className="w-full border rounded-md px-3 py-2"
                />
                {cities && cities.length > 0 && (
                    <datalist id="cities-datalist">
                        {cities.map((c) => (
                            <option key={c} value={c} />
                        ))}
                    </datalist>
                )}
            </div>

            {/* Selektor dzielnicy (pokazuj tylko gdy mamy dopasowane miasto i listę dzielnic) */}
            {selectedCity && availableDistricts.length > 0 && (
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Dzielnica ({selectedCity})
                    </label>
                    <select
                        value={district}
                        onChange={(e) => onDistrictChange(e.target.value)}
                        className="w-full border rounded-md px-3 py-2 bg-white"
                    >
                        <option value="">Dowolnie</option>
                        {availableDistricts.map((d) => (
                            <option key={d} value={d}>
                                {d}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
}
