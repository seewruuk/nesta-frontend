import {NextResponse} from "next/server";

export async function POST(req) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const {accessToken, selectedDate, rentalOfferId} = await req.json();
    try {
        const response = await fetch(`${apiUrl}/api/move-in-applications`, {
            method: "POST", headers: {
                Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json",
            }, body: JSON.stringify({
                rentalOffer: {id: rentalOfferId}, viewingDateTime: selectedDate
            })
        });
        const result = await response.json();
        return NextResponse.json({
            status: 200, result,
        });
    } catch (error) {
        return NextResponse.json({status: "error", error: error.message}, {status: 503});
    }
}