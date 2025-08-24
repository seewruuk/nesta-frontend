// File: components/RadioGroupFilter.js
"use client";

import React from "react";

export default function RadioGroupFilter({
                                             label,
                                             filterKey,
                                             options,
                                             filters,
                                             setFilters,
                                             updateQuery,
                                         }) {
    const current = filters[filterKey];

    const onChange = (value) => {
        setFilters((prev) => ({ ...prev, [filterKey]: value }));
        updateQuery(filterKey, value);
    };

    return (
        <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">{label}</p>
            <div className="flex flex-col gap-2">
                {options.map((opt, index) => (
                    <label key={index} className="flex items-center gap-2">
                        <input
                            type="radio"
                            name={filterKey}
                            value={opt.value}
                            checked={current === opt.value}
                            onChange={() => onChange(opt.value)}
                            className="h-4 w-4 accent-primary"
                        />
                        <span className="text-sm text-gray-600">{opt.label}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}
