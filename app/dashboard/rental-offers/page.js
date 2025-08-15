import DashboardLayout from "@/components/_layouts/DashboardLayout";
import AddApartmentWidget from "@/components/AddApartmentWidget";
import DashboardElement from "@/components/DashboardElement";
import UserApartments from "@/components/UserApartments";
import Button from "@/components/Button";
import UserOffers from "@/components/UserOffers";

export default function Page() {
    return (
        <DashboardLayout>

            <DashboardElement>
                <div className="flex flex-col items-center justify-center h-full">
                    <h2 className="text-2xl font-semibold mb-4">Witaj w sekcji ofert!</h2>
                    <p className="text-gray-600">Tutaj możesz zarządzać swoimi ofertami ofertami wynajmu.</p>
                </div>
            </DashboardElement>

            <DashboardElement>
                <div>
                    <h3>Twoje Oferty</h3>
                    <UserOffers />
                </div>
            </DashboardElement>

            <div className="bg-black/20 w-full py-[42px] px-[24px] rounded-[20px]">
                <div className="flex items-start flex-col gap-[12px]">
                    <span>Witaj, Kacper!</span>
                    <h1 className={"text-[24px] font-bold"}>Dodaj Oferte!</h1>
                    <p>
                        Tutaj możesz dodać nową ofertę wynajmu. Wypełnij formularz i dodaj szczegóły swojej oferty.
                    </p>
                    <Button
                        title={"Dodaj ofertę"}
                        type={"link"}
                        style={"black"}
                        onClick={"/dashboard/rental-offers/add"}

                    />
                </div>
            </div>

        </DashboardLayout>
    )
}