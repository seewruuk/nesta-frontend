import SingleApartmentLayout from "@/app/components/_layouts/SingleApartmentLayout";

export default function page({params}) {
    return (
        <SingleApartmentLayout slug={params.slug}/>
    )
}