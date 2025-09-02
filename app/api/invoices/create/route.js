import {NextResponse} from "next/server";
export async function POST(req) {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const {
            accessToken,
            rentalOfferId,
            amountCents,
            currency,
            receiverId
        } = await req.json();

        const response = await fetch(`${apiUrl}/api/invoices/create`, {
            method: "POST", headers: {
                Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json",
            }, body: JSON.stringify({
                rentalOfferId, amountCents, currency, receiverId
            }),
        });
        if (response.status === 401) {
            return NextResponse.json({
                status: 401, message: "Unauthorized access. Please check your access token.", error: "Unauthorized"
            });
        }
        const json = await response.json();
        return NextResponse.json({
            status: 200, message: "Invoice created successfully", apartments: json
        })
    } catch (err) {
        return NextResponse.json({
            status: "error", message: "There was an error creating the invoice", error: err || "Unknown error"
        });
    }


}