import DashboardElement from "@/components/DashboardElement";
import UserOffers from "@/components/UserOffers";
import AddApartmentWidget from "@/components/AddApartmentWidget";

export default function Page() {
    return (
        <>

            <DashboardElement>
                <div className="flex flex-col items-center justify-center h-full">
                    <h2 className="text-2xl font-semibold mb-4">Witaj w sekcji ofert!</h2>
                    <p className="text-gray-600">Tutaj możesz zarządzać swoimi ofertami wynajmu.</p>
                </div>
            </DashboardElement>

            <DashboardElement>
                <div>
                    <h3 className={"mb-[15px]"}>Twoje oferty</h3>
                    <UserOffers />
                </div>
            </DashboardElement>

            {/* Uwaga: preset w AddApartmentWidget ma klucz "rental-offer" (liczba pojedyncza) */}
            <AddApartmentWidget
                type="rental-offer"
                bgClass="bg-blue-300"
                title="Dodaj ofertę wynajmu!"
                description="Rozpocznij dodawanie nowej oferty wynajmu."
                ctaTitle="Dodaj nową ofertę"
                href="/dashboard/rental-offers/add"
            />

        </>
    )
}
