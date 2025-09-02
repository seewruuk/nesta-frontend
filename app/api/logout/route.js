import { NextResponse } from "next/server";


export async function POST(req) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const body = await req.json();
    const refreshToken = body.refreshToken ?? body.refresh_token;
    const accessToken = body.accessToken;


    if (!refreshToken || !accessToken) {
        return NextResponse.json(
            { status: "error", message: "Missing refreshToken or accessToken" },
            { status: 400 }
        );
    }


    try {
        const response = await fetch(`${apiUrl}/api/users/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });


        const json = await response.json();
        return NextResponse.json({ status: 200, message: "Logout 200", json });
    } catch (error) {
        return NextResponse.json({
            status: "error",
            message: "An error occurred while processing your request.",
            error: String(error || "Unknown error"),
        });
    }
}