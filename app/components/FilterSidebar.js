export default function FilterSidebar({filters, setFilters})
{
    return (
        <div className="w-1/4 p-6 bg-white border-r border-stone-200 flex flex-col gap-6">
            {/* Lokalizacja i dzielnica */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Lokalizacja
                </label>
                <input
                    type="text"
                    placeholder="Gdańsk"
                    value={filters.location}
                    onChange={(e) =>
                        setFilters({ ...filters, location: e.target.value })
                    }
                    className="border border-stone-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-stone-400 placeholder:text-stone-400 text-sm"
                />
                <select
                    value={filters.district}
                    onChange={(e) =>
                        setFilters({ ...filters, district: e.target.value })
                    }
                    className="border border-stone-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-stone-400 text-sm text-stone-700"
                >
                    <option value="">Dzielnica</option>
                    <option value="Śródmieście">Śródmieście</option>
                    <option value="Okęcie">Okęcie</option>
                    <option value="Oliwa">Oliwa</option>
                    <option value="Bemowo">Bemowo</option>
                    <option value="Stare Miasto">Stare Miasto</option>
                </select>
            </div>

            {/* Cena za wynajem */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Cena za wynajem
                </label>
                <input
                    type="range"
                    step={500}
                    min={1000}
                    max={15000}
                    value={filters.priceRange}
                    onChange={(e) =>
                        setFilters({ ...filters, priceRange: Number(e.target.value) })
                    }
                    className="accent-primary w-full cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-600">
                    <span>{Intl.NumberFormat("pl-PL").format(1000)} zł</span>
                    <span>{Intl.NumberFormat("pl-PL").format(filters.priceRange)} zł</span>
                </div>
            </div>

            {/* Rachunki wliczone w cenę */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Czy rachunki są wliczone w cenę?
                </label>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                        type="checkbox"
                        checked={filters.billsIncluded === true}
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                billsIncluded: e.target.checked ? true : undefined,
                            })
                        }
                        className="h-4 w-4 accent-primary cursor-pointer"
                    />
                    <span>Tak</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                        type="checkbox"
                        checked={filters.billsIncluded === false}
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                billsIncluded: e.target.checked ? false : undefined,
                            })
                        }
                        className="h-4 w-4 accent-primary cursor-pointer"
                    />
                    <span>Nie</span>
                </div>
            </div>

            {/* Kaucja */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Kaucja</label>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                        type="checkbox"
                        checked={filters.deposit === true}
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                deposit: e.target.checked ? true : undefined,
                            })
                        }
                        className="h-4 w-4 accent-primary cursor-pointer"
                    />
                    <span>Tak</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                        type="checkbox"
                        checked={filters.deposit === false}
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                deposit: e.target.checked ? false : undefined,
                            })
                        }
                        className="h-4 w-4 accent-primary cursor-pointer"
                    />
                    <span>Nie</span>
                </div>
            </div>

            {/* Typ nieruchomości i wyposażenie */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Typ nieruchomości
                </label>
                <select
                    value={filters.propertyType}
                    onChange={(e) =>
                        setFilters({ ...filters, propertyType: e.target.value })
                    }
                    className="border border-stone-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-stone-400 text-sm text-stone-700"
                >
                    <option value="">Wybierz typ</option>
                    <option value="Mieszkanie">Mieszkanie</option>
                    <option value="Studio">Studio</option>
                    <option value="Dom">Dom</option>
                </select>

                <div className="pt-2">
                    <p className="text-sm font-medium text-gray-700">Wyposażenie</p>
                    {["Umeblowane", "Nieumeblowane", "Częściowo umeblowane"].map(
                        (option) => (
                            <div
                                key={option}
                                className="flex items-center gap-2 text-sm text-gray-600 mt-1"
                            >
                                <input
                                    type="checkbox"
                                    checked={filters.furnishing.includes(option)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setFilters({
                                                ...filters,
                                                furnishing: [...filters.furnishing, option],
                                            });
                                        } else {
                                            setFilters({
                                                ...filters,
                                                furnishing: filters.furnishing.filter(
                                                    (item) => item !== option
                                                ),
                                            });
                                        }
                                    }}
                                    className="h-4 w-4 accent-primary cursor-pointer"
                                />
                                <span>{option}</span>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* Liczba pokoi i łazienek */}
            <div className="space-y-4">
                <div>
                    <p className="text-sm font-medium text-gray-700">
                        Liczba pokoi w mieszkaniu
                    </p>
                    <div className="mt-1 space-y-1">
                        {["1", "2", "3", "4+"].map((option) => (
                            <div key={option} className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={filters.roomsCount.includes(option)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setFilters({
                                                ...filters,
                                                roomsCount: [...filters.roomsCount, option],
                                            });
                                        } else {
                                            setFilters({
                                                ...filters,
                                                roomsCount: filters.roomsCount.filter(
                                                    (item) => item !== option
                                                ),
                                            });
                                        }
                                    }}
                                    className="h-4 w-4 accent-primary cursor-pointer"
                                />
                                <span>{option}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="text-sm font-medium text-gray-700">Liczba łazienek</p>
                    <div className="mt-1 space-y-1">
                        {["1", "2", "3+"].map((option) => (
                            <div key={option} className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={filters.bathrooms.includes(option)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setFilters({
                                                ...filters,
                                                bathrooms: [...filters.bathrooms, option],
                                            });
                                        } else {
                                            setFilters({
                                                ...filters,
                                                bathrooms: filters.bathrooms.filter(
                                                    (item) => item !== option
                                                ),
                                            });
                                        }
                                    }}
                                    className="h-4 w-4 accent-primary cursor-pointer"
                                />
                                <span>{option}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Udogodnienia */}
            <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Udogodnienia</p>
                {[
                    "Wifi",
                    "Balkon",
                    "Zmywarka",
                    "Winda",
                    "Pralka",
                    "Miejsce parkingowe",
                ].map((option) => (
                    <div
                        key={option}
                        className="flex items-center gap-2 text-sm text-gray-600"
                    >
                        <input
                            type="checkbox"
                            checked={filters.amenities.includes(option)}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setFilters({
                                        ...filters,
                                        amenities: [...filters.amenities, option],
                                    });
                                } else {
                                    setFilters({
                                        ...filters,
                                        amenities: filters.amenities.filter(
                                            (item) => item !== option
                                        ),
                                    });
                                }
                            }}
                            className="h-4 w-4 accent-primary cursor-pointer"
                        />
                        <span>{option}</span>
                    </div>
                ))}
            </div>

            {/* Wynajem krótkoterminowy */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Czy wynajem krótkoterminowy?
                </label>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                        type="checkbox"
                        checked={filters.shortTermRental === true}
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                shortTermRental: e.target.checked ? true : undefined,
                            })
                        }
                        className="h-4 w-4 accent-primary cursor-pointer"
                    />
                    <span>Tak</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                        type="checkbox"
                        checked={filters.shortTermRental === false}
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                shortTermRental: e.target.checked ? false : undefined,
                            })
                        }
                        className="h-4 w-4 accent-primary cursor-pointer"
                    />
                    <span>Nie</span>
                </div>
            </div>

            {/* Akceptacja palenia */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Czy akceptuje palenie?
                </label>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                        type="radio"
                        name="smokingAllowed"
                        checked={filters.smokingAllowed === true}
                        onChange={() =>
                            setFilters({ ...filters, smokingAllowed: true })
                        }
                        className="h-4 w-4 accent-primary cursor-pointer"
                    />
                    <span>Tak</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                        type="radio"
                        name="smokingAllowed"
                        checked={filters.smokingAllowed === false}
                        onChange={() =>
                            setFilters({ ...filters, smokingAllowed: false })
                        }
                        className="h-4 w-4 accent-primary cursor-pointer"
                    />
                    <span>Nie</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                        type="radio"
                        name="smokingAllowed"
                        checked={filters.smokingAllowed === "Do ustalenia"}
                        onChange={() =>
                            setFilters({ ...filters, smokingAllowed: "Do ustalenia" })
                        }
                        className="h-4 w-4 accent-primary cursor-pointer"
                    />
                    <span>Do ustalenia</span>
                </div>
            </div>

            {/* Dostęp dla osób niepełnosprawnych */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Dostęp dla osób niepełnosprawnych
                </label>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                        type="checkbox"
                        checked={filters.disabledAccess === true}
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                disabledAccess: e.target.checked ? true : undefined,
                            })
                        }
                        className="h-4 w-4 accent-primary cursor-pointer"
                    />
                    <span>Tak</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                        type="checkbox"
                        checked={filters.disabledAccess === false}
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                disabledAccess: e.target.checked ? false : undefined,
                            })
                        }
                        className="h-4 w-4 accent-primary cursor-pointer"
                    />
                    <span>Nie</span>
                </div>
            </div>

            {/* Akceptacja zwierząt */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Czy akceptuje zwierzęta?
                </label>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                        type="radio"
                        name="petsAccepted"
                        checked={filters.petsAccepted === true}
                        onChange={() =>
                            setFilters({ ...filters, petsAccepted: true })
                        }
                        className="h-4 w-4 accent-primary cursor-pointer"
                    />
                    <span>Tak</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                        type="radio"
                        name="petsAccepted"
                        checked={filters.petsAccepted === false}
                        onChange={() =>
                            setFilters({ ...filters, petsAccepted: false })
                        }
                        className="h-4 w-4 accent-primary cursor-pointer"
                    />
                    <span>Nie</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                        type="radio"
                        name="petsAccepted"
                        checked={filters.petsAccepted === "Do ustalenia"}
                        onChange={() =>
                            setFilters({ ...filters, petsAccepted: "Do ustalenia" })
                        }
                        className="h-4 w-4 accent-primary cursor-pointer"
                    />
                    <span>Do ustalenia</span>
                </div>
            </div>
        </div>
    );
}