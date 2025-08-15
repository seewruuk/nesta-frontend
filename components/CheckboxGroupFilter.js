// File: components/CheckboxGroupFilter.js
"use client";

import React from "react";

export default function CheckboxGroupFilter({
                                                label,
                                                filterKey,
                                                options,
                                                filters,
                                                setFilters,
                                                updateQuery,
                                            }) {
    const current = filters[filterKey];

    const onChange = (value, checked) => {
        let next;
        // Jeśli wartość boolean (tak/nie)
        if (typeof options[0].value === "boolean") {
            next = checked ? value : undefined;
        } else {
            // Tablica wartości
            const arr = Array.isArray(current) ? [...current] : [];
            if (checked) {
                arr.push(value);
            } else {
                const idx = arr.indexOf(value);
                if (idx !== -1) arr.splice(idx, 1);
            }
            next = arr;
        }
        setFilters((prev) => ({ ...prev, [filterKey]: next }));
        updateQuery(filterKey, next);
    };

    return (
        <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">{label}</p>
            <div className="flex flex-col gap-2">
                {options.map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={
                                typeof opt.value === "boolean"
                                    ? current === opt.value
                                    : Array.isArray(current) && current.includes(opt.value)
                            }
                            onChange={(e) => onChange(opt.value, e.target.checked)}
                            className="h-4 w-4 accent-primary"
                        />
                        <span className="text-sm text-gray-600">{opt.label}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}
