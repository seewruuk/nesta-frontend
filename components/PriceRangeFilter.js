// File: components/PriceRangeFilter.js
"use client";
import React from "react";

export default function PriceRangeFilter({ filters, setFilters, updateQuery }) {
    // Ustal minimalną i maksymalną wartość
    const min = 1000;
    const max = 15000;
    // Jeśli filters.priceRange jest undefined, użyj min jako domyślnej
    const value = filters.priceRange ?? min;

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                Cena za wynajem
            </label>
            <input
                type="range"
                step={500}
                min={min}
                max={max}
                value={value}
                onChange={(e) => {
                    const val = Number(e.target.value);
                    setFilters((prev) => ({ ...prev, priceRange: val }));
                    updateQuery("priceRange", val);
                }}
                className="accent-primary w-full"
            />
            <div className="flex justify-between text-sm text-gray-600">
                <span>{min} zł</span>
                <span>{value} zł</span>
            </div>
        </div>
    );
}
