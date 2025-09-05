import DashboardApartmentView from "@/components/DasboshboardApartmentView";

export default function Page({params}) {
    return (<>
            <DashboardApartmentView id={params.id}/>
        </>);
}