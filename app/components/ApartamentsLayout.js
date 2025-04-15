"use client"
import data from "@/data/apartments.json"
import {useState} from "react";

export default function ApartmentsLayout() {

    const [initialApartments, setInitialApartments] = useState(data);
    const [filteredApartments, setFilteredApartments] = useState(data);

    return (
        <div className={"flex gap-[24px]"}>
            <div className={"w-1/4 p-[60px] bg-[#fff]"}>

            </div>
            <div className={'flex-grow mr-[60px] grid grid-cols-3 pt-[60px] space-x-[20px] space-y-[45px]'}>
                {
                    filteredApartments.map((item, index) => {
                        return (
                            <div
                                key={item + index}
                                className={""}
                            >
                                <div className={'relative h-[250px] bg-primary'}>
                                    asd
                                </div>

                                <div className={"flex flex-col gap-[15px]"}>
                                    <h3>{item.header}</h3>
                                    <p>{item.address}</p>
                                    <div>
                                        {
                                            item.filter.amenities.map((item, index) => {
                                                    return (
                                                        <div key={item + index}>
                                                            <span>i</span>
                                                            <span>{item}</span>
                                                        </div>
                                                    )
                                                }
                                            )
                                        }
                                    </div>
                                    <div>
                                        <div>
                                            <span>{item.landlord.name}</span>
                                            <span>{item.price} zł / miesiąc</span>
                                        </div>
                                        <div>
                                            <button>Skontaktuj się</button>
                                            <button>Zobacz więcej</button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        )
                    })
                }

            </div>
        </div>
    )
}