import { NextResponse } from "next/server";

export async function POST(req) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    let accessToken, applicationId, status, message;
    try {
        ({ accessToken, applicationId, status, message } = await req.json());
    } catch {
        return NextResponse.json(
            { status: 400, message: "Invalid JSON body" },
            { status: 400 }
        );
    }

    try {
        const payload = {
            status,
            reason: message ?? null,
        };

        const upstream = await fetch(
            `${apiUrl}/api/move-in-applications/${applicationId}/decision`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            }
        );

        // Backend zwraca 204 No Content przy sukcesie — przekaż to dalej 1:1
        if (upstream.status === 204) {
            return new Response(null, { status: 204 });
        }

        // Inne odpowiedzi — przekaż treść jeśli jest
        const ct = upstream.headers.get("content-type") || "";
        const data = ct.includes("application/json")
            ? await upstream.json()
            : await upstream.text();

        return NextResponse.json(
            { status: upstream.status, data },
            { status: upstream.status }
        );
    } catch (error) {
        return NextResponse.json(
            {
                status: "error",
                message: "Upstream error",
                error: String(error),
            },
            { status: 500 }
        );
    }
}
