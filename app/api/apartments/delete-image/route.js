import {NextResponse} from "next/server";


export async function POST(req){

    try{
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const { accessToken, apartmentId, imageId } = await req.json();


        const response = await fetch(`${apiUrl}/api/apartments/${apartmentId}/images/${imageId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });
        const responseJson = await response.json();

        return NextResponse.json({
            status: 200,
            message: "Apartment deleted successfully",
            json: responseJson
        })
    }catch(e){
        return NextResponse.json({
            status: 500,
            message: "An error occurred while processing your request.",
            e: e.message,
        })
    }
}