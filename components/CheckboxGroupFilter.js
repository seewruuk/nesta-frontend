"use client";
import React from "react";

export default function CheckboxGroupFilter({
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
                <div key={opt.value} className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                        type="checkbox"
                        checked={filters[filterKey]?.includes
                            ? filters[filterKey].includes(opt.value)
                            : filters[filterKey] === opt.value
                        }
                        onChange={(e) => {
                            let vals;
                            if (Array.isArray(filters[filterKey])) {
                                vals = e.target.checked
                                    ? [...filters[filterKey], opt.value]
                                    : filters[filterKey].filter((v) => v !== opt.value);
                            } else {
                                vals = e.target.checked ? opt.value : undefined;
                            }
                            setFilters({ ...filters, [filterKey]: vals });
                            updateQuery(filterKey, vals);
                        }}
                        className="h-4 w-4 accent-primary cursor-pointer"
                    />
                    <span>{opt.label}</span>
                </div>
            ))}
        </div>
    );
}