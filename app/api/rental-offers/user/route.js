import {NextResponse} from "next/server";
export async function POST(req) {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const {accessToken} = await req.json();
        const response = await fetch(`${apiUrl}/api/rental-offers`, {
            method: "GET", headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
        });
        const json = await response.json();
        return NextResponse.json({
            status: 200, message: "Offer fetched successfully", offer: json
        })
    } catch (err) {
        return NextResponse.json({
            status: "error", message: "There was an error fetching the offers", error: err.message || "Unknown error"
        });
    }
}


