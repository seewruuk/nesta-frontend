import { NextResponse } from "next/server";

export async function POST(req) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const body = await req.json();

    try {
        // 1) Używamy `body`, nie `data`
        const apiRes = await fetch(`${apiUrl}/api/users/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        // 2) Parsujemy odpowiedź – może być JSON albo plain text
        let message;
        const contentType = apiRes.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
            const json = await apiRes.json();
            // zakładam, że przy błędzie masz { status, error, message, … }
            message = json.message || json;
        } else {
            message = await apiRes.text();
        }

        // 3) Jeśli backend zwrócił error (status >=400), przekazujemy status i komunikat
        if (!apiRes.ok) {
            return NextResponse.json(
                { status: "error", message },
                { status: apiRes.status }
            );
        }

        // 4) Sukces – zwracamy to, co dostał frontend
        return NextResponse.json(
            { status: "success", message },
            { status: apiRes.status }
        );
    } catch (error) {
        console.error("Error proxying register:", error);
        return NextResponse.json(
            { status: "error", message: "Service unavailable" },
            { status: 503 }
        );
    }
}
