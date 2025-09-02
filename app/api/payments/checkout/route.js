import {NextResponse} from "next/server";

export async function POST(req) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const {
        accessToken, invoiceId, email, description
    } = await req.json();

    try {
        const response = await fetch(`${apiUrl}/api/payments/checkout`, {
            method: "POST", headers: {
                Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json",
            }, body: JSON.stringify({
                invoiceId, email, description
            })
        });

        if (response.status === 401) {
            return NextResponse.json({
                status: 401, message: "Unauthorized access. Please check your access token.", error: "Unauthorized"
            });
        }

        const result = await response.json();
        return NextResponse.json({
            status: 200, message: "Payment link fetched successfully", redirectUrl: result.redirectUrl
        })
    } catch (error) {
        return NextResponse.json({
            status: "error", message: "There was an error fetching the payment link", error: error || "Unknown error"
        });
    }
}