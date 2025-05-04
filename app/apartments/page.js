import ApartmentsLayout from "@/components/ApartamentsLayout";
import Loading from "@/components/Loading";
import {Suspense} from "react";


export default function Page(){
    return(
        <Suspense fallback={<Loading />}>
            <ApartmentsLayout />
        </Suspense>
    )
}