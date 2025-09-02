import { NextResponse } from "next/server";


export async function POST(req) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const body = await req.json();


    try {
        const apiRes = await fetch(`${apiUrl}/api/users/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });


        let message;
        const contentType = apiRes.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
            const json = await apiRes.json();
            message = json.message || json;
        } else {
            message = await apiRes.text();
        }


        if (!apiRes.ok) {
            return NextResponse.json({ status: "error", message }, { status: apiRes.status });
        }


        return NextResponse.json({ status: "success", message }, { status: apiRes.status });
    } catch (error) {
        console.error("Error proxying register:", error);
        return NextResponse.json(
            { status: "error", message: "Service unavailable" },
            { status: 503 }
        );
    }
}