import UploadImages from "@/components/UploadImages";

export default function page({params}){
    return(
        <UploadImages appId={params.id} />
    )
}