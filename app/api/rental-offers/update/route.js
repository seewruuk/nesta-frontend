import {NextResponse} from "next/server";
export async function POST(req) {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const {accessToken, offerId, dataToSend} = await req.json();
        const response = await fetch(`${apiUrl}/api/rental-offers/${offerId}`, {
            method: "PUT", headers: {
                Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json",
            }, body: JSON.stringify(dataToSend)
        });
        const responseJson = await response.json();
        return NextResponse.json({
            status: 200, message: "Offer updated successfully", json: responseJson
        })
    } catch (e) {
        return NextResponse.json({
            status: 500, message: "An error occurred while processing your request.", e: e.message
        })
    }
}