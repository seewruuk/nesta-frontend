import UserInvoices from "@/components/UserInvoices";
import AddRentaOfferWidget from "@/components/AddApartmentWidget";
import AddApartmentWidget from "@/components/AddApartmentWidget";

export default function Page(){


    return(
        <>
            <UserInvoices />

            <AddApartmentWidget
                type="rental-offers"
                bgClass="bg-gray-300"
                title="Dodaj nowa fakture"
                description="Rozpocznij dodawanie nowej faktury."
                ctaTitle="Dodaj nową ofertę"
                href="/dashboard/invoices/add"
            />

        </>
    )
}