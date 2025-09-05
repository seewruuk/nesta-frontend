import ApplicationLayout from "@/components/_layouts/ApplicationLayout";

export default function Page({params}) {
    return (<>
            <ApplicationLayout applicationId={params.id}/>
        </>)
}