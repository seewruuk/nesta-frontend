import {NextResponse} from "next/server";
export async function POST(req){
    try{
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const { accessToken, offerId } = await req.json();

        const response = await fetch(`${apiUrl}/api/rental-offers/${offerId}`, {
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
            message: "An error occurred while processing your request."
        })
    }
}