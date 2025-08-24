// File: components/PriceRangeFilter.js
"use client";

import React from "react";

/**
 * Zaktualizowana wersja z dwoma trybami pracy:
 * 1) KONTROLOWANY (preferowany): przekaż propsy: label, min, max, step, value, onChange.
 * 2) KOMPATYBILNOŚĆ WSTECZNA: jeśli nie podasz powyższych, komponent użyje
 *    { filters, setFilters, updateQuery } tak jak wcześniej.
 */
export default function PriceRangeFilter(props) {
    const {
        // Nowe, opcjonalne propsy (tryb kontrolowany)
        label,
        min,
        max,
        step,
        value,
        onChange,

        // Stare propsy (kompatybilność z wcześniejszym użyciem)
        filters,
        setFilters,
        updateQuery,
    } = props;

    const isControlled = typeof value === "number" && typeof onChange === "function";

    // Domyślne wartości (gdy nie pracujemy w trybie kontrolowanym)
    const fallbackMin = typeof min === "number" ? min : 1000;
    const fallbackMax = typeof max === "number" ? max : 15000;
    const effectiveMin = isControlled ? (typeof min === "number" ? min : 0) : fallbackMin;
    const effectiveMax = isControlled ? (typeof max === "number" ? max : 10000) : fallbackMax;
    const effectiveStep = typeof step === "number" ? step : 50;

    // Wartość do wyświetlenia:
    const displayValue = isControlled ? value : (filters?.priceRange ?? effectiveMin);

    const handleChange = (e) => {
        const val = Number(e.target.value);
        if (isControlled) {
            onChange(val);
        } else {
            setFilters?.((prev) => ({ ...prev, priceRange: val }));
            updateQuery?.("priceRange", val);
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                {label ?? "Cena za wynajem"}
            </label>

            <input
                type="range"
                min={effectiveMin}
                max={effectiveMax}
                step={effectiveStep}
                value={displayValue}
                onChange={handleChange}
                className="accent-primary w-full"
            />

            <div className="flex justify-between text-sm text-gray-600">
                <span>{effectiveMin} zł</span>
                <span>{displayValue} zł</span>
            </div>
        </div>
    );
}
