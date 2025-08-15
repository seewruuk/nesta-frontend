// File: /app/api/rentalOffer/route.js
import { NextResponse } from "next/server";

export async function GET(req) {
    // Pobranie tokena z ciasteczek (HTTP-only)
    const tokenCookie = req.cookies.get("access_token");
    const token = tokenCookie?.value;
    if (!token) {
        return NextResponse.json({ message: "Brak autoryzacji" }, { status: 401 });
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
        const backendRes = await fetch(`${apiUrl}/api/rental-offers`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (backendRes.status === 401) {
            return NextResponse.json(
                { message: "Token wygasł lub nieprawidłowy" },
                { status: 401 }
            );
        }

        if (!backendRes.ok) {
            const errorText = await backendRes.text();
            return NextResponse.json(
                { message: errorText || "Błąd serwera backendu" },
                { status: backendRes.status }
            );
        }

        const data = await backendRes.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Błąd pobierania ofert wynajmu:", error);
        return NextResponse.json(
            { message: "Serwis niedostępny" },
            { status: 503 }
        );
    }
}
