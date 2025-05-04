"use client";
import React from "react";

export default function PriceRangeFilter({ filters, setFilters, updateQuery }) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Cena za wynajem</label>
            <input
                type="range"
                step={500}
                min={1000}
                max={15000}
                value={filters.priceRange}
                onChange={(e) => {
                    const val = Number(e.target.value);
                    setFilters({ ...filters, priceRange: val });
                    updateQuery("priceRange", val);
                }}
                className="accent-primary w-full"
            />
            <div className="flex justify-between text-sm text-gray-600">
                <span>1000 zł</span>
                <span>{filters.priceRange} zł</span>
            </div>
        </div>
    );
}