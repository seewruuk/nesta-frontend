import AddApartmentWidget from "@/components/AddApartmentWidget";
import DashboardElement from "@/components/DashboardElement";
import UserApartments from "@/components/UserApartments";

export default function Page() {
    return (<>

            <DashboardElement>
                <div className="flex flex-col items-center justify-center h-full">
                    <h2 className="text-2xl font-semibold mb-4">Witaj w sekcji mieszkań!</h2>
                    <p className="text-gray-600">Tutaj możesz zarządzać swoimi ofertami mieszkań.</p>
                </div>
            </DashboardElement>

            <DashboardElement>
                <div>
                    <h3 className={"mb-[15px]"}>Twoje mieszkania</h3>
                    <UserApartments/>
                </div>
            </DashboardElement>

            <AddApartmentWidget
                type="apartment"
                bgClass="bg-emerald-300"
                title="Dodaj mieszkanie!"
                description="Szybko rozpocznij dodawanie nowej nieruchomości."
                ctaTitle="Rozpocznij dodawanie mieszkania"
                href="/dashboard/apartments/add"
            />

        </>)
}
