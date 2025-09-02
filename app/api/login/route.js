import { NextResponse } from "next/server";


export async function POST(req) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const { username, password } = await req.json();


    try {
        const loginRes = await fetch(
            `${apiUrl}/api/users/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
            { method: "GET" }
        );


        if (!loginRes.ok) {
            return NextResponse.json(
                { status: "error", message: `Login failed: ${loginRes.status} ${loginRes.statusText}` },
                { status: loginRes.status }
            );
        }


        const { access_token, refresh_token, expires_in, refresh_expires_in } = await loginRes.json();


// Return tokens to client; client will set cookies
        return NextResponse.json({
            status: "success",
            json: { access_token, refresh_token, expires_in, refresh_expires_in },
        });
    } catch (error) {
        console.error("Error proxying login:", error);
        return NextResponse.json(
            { status: "error", message: "Service unavailable" },
            { status: 503 }
        );
    }
}