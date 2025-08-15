import {NextResponse} from "next/server";

export async function POST(req) {

    try{
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const { accessToken, apartmentId, dataToSend } = await req.json();

        const  response = await fetch(`${baseUrl}/api/apartments/${apartmentId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSend)
        });

        const responseJson = await response.json();
        console.log("Update response:", responseJson);

        return NextResponse.json({
            status: 200,
            message: "Apartment updated successfully",
            json: responseJson
        })
    }catch(e){
        return NextResponse.json({
            status: 500,
            message: "An error occurred while processing your request.",
            e : e.message
        })
    }

}