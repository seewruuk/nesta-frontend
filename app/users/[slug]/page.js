import UserProfileLayout from "@/components/_layouts/UserProfileLayout";

export default function page({params}) {
    return (<UserProfileLayout slug={params.slug}/>)
}