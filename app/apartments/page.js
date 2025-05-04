import Loading from "@/components/Loading";
import {Suspense} from "react";
import ApartmentsLayout from "@/components/ApartmentsLayout";


export default function Page(){
    return(
        <Suspense fallback={<Loading />}>
            <ApartmentsLayout />
        </Suspense>
    )
}