import DashboardOfferView from "@/components/DashboardOfferView";

export default function Page({ params }) {
    return (
        <>
            <DashboardOfferView id={params.id} />
        </>
    );
}