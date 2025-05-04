"use client";
import React from "react";

export default function RadioGroupFilter({
                                             label,
                                             options,
                                             filterKey,
                                             filters,
                                             setFilters,
                                             updateQuery
                                         }) {
    return (
        <div className="space-y-2">
            <p className="block text-sm font-medium text-gray-700">{label}</p>
            {options.map((opt) => (
                <div key={opt.value.toString()} className="flex items-center gap-2 text-sm">
                    <input
                        type="radio"
                        name={filterKey}
                        checked={filters[filterKey] === opt.value}
                        onChange={() => {
                            setFilters({ ...filters, [filterKey]: opt.value });
                            updateQuery(filterKey, opt.value);
                        }}
                        className="h-4 w-4 accent-primary cursor-pointer"
                    />
                    <span>{opt.label}</span>
                </div>
            ))}
        </div>
    );
}