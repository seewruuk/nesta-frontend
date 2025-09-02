import {NextResponse} from "next/server";
export async function POST(req) {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const {accessToken, invoiceId} = await req.json();
        const response = await fetch(`${apiUrl}/api/invoices/${invoiceId}`, {
            method: "DELETE", headers: {
                Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json",
            },
        });
        return NextResponse.json({
            status: 200, message: "Invoice delete successfully"
        })
    } catch (e) {
        return NextResponse.json({
            status: 500, message: "An error occurred while processing your request.", e: e.message,
        })
    }
}