"use client"
import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import Button from "@/components/Button";
import InputField from "@/components/common/InputField";

export default function SearchApartments() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [searchValues, setSearchValues] = useState({
        location: "", priceRange: 6500,
    });

    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchValues.location) params.set("location", searchValues.location);
        params.set("priceRange", String(searchValues.priceRange));
        router.push(`/rental-offers?${params.toString()}`);
    };

    return (<div className="flex flex-col">
            <div className="-mb-[16px] text-[12px] font-semibold isolate">
                <button
                    className="pt-[14px] pb-[27px] px-[32px] rounded-lg border border-[#D9D9D9] bg-white cursor-pointer hover:bg-black hover:text-white transition-all">
                    Wynajem
                </button>
                <button
                    onClick={() => router.push("/posts")}
                    className="pt-[14px] pb-[27px] px-[32px] rounded-lg border border-[#D9D9D9] bg-transparent cursor-pointer hover:bg-black hover:text-white transition-all">
                    Znajdź współlokatora
                </button>
            </div>

            <div
                className="bg-white p-[24px] rounded-2xl border border-[#D9D9D9] z-50 flex gap-4 items-center justify-between">
                <div>
                    <div className="w-[260px]">
                        <InputField
                            type="text"
                            value={searchValues.location}
                            onChange={e => setSearchValues({...searchValues, location: e.target.value})}
                            placeholder="Podaj miasto..."
                        />
                    </div>
                    <div className="mt-[12px]">
                        <input
                            type="range"
                            step={500}
                            min={1000}
                            max={15000}
                            value={searchValues.priceRange}
                            onChange={e => setSearchValues({...searchValues, priceRange: Number(e.target.value)})}
                            className="accent-primary w-full"
                        />
                        <div className="flex justify-between text-[12px]">
                            <div className="bg-background px-[14px] py-[6px] rounded-full">1000 zł</div>
                            <div className="bg-background px-[14px] py-[6px] rounded-full">
                                {searchValues.priceRange} zł
                            </div>
                        </div>
                    </div>
                </div>

                <div className="block">
                    <Button
                        type={"button"}
                        title={"Szukaj"}
                        onClick={handleSearch}
                        style={"primary"}
                    />
                </div>
            </div>
        </div>);
}
