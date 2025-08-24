import {NextResponse} from "next/server";

export async function POST(req) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const { accessToken, data } = await req.json();

    try {
        const response = await fetch(`${apiUrl}/api/apartments`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: data
        });
        const result = await response.json();
        return NextResponse.json(
            {status: "success", message: "Apartment saved successfully", data: result},
            {status: 200}
        );
    } catch (error) {
        return NextResponse.json(
            {status: "error", error: error.message},
            {status: 503}
        );
    }
}