"use client";
import React from "react";

export default function LocationDistrictFilter({ filters, setFilters, updateQuery }) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Lokalizacja</label>
            <input
                type="text"
                placeholder="Gdańsk"
                value={filters.location}
                onChange={(e) => {
                    setFilters({ ...filters, location: e.target.value });
                    updateQuery("location", e.target.value);
                }}
                className="border border-stone-300 rounded-md px-3 py-2 w-full text-sm"
            />
            <select
                value={filters.district}
                onChange={(e) => {
                    setFilters({ ...filters, district: e.target.value });
                    updateQuery("district", e.target.value);
                }}
                className="border border-stone-300 rounded-md px-3 py-2 w-full text-sm"
            >
                <option value="">Dzielnica</option>
                <option value="Śródmieście">Śródmieście</option>
                <option value="Okęcie">Okęcie</option>
                <option value="Oliwa">Oliwa</option>
                <option value="Bemowo">Bemowo</option>
                <option value="Stare Miasto">Stare Miasto</option>
            </select>
        </div>
    );
}