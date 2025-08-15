// /app/api/login/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const { username, password } = await req.json();

    try {
        // Keycloak endpoint zwraca tokeny jako GET z query params
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

        // Tworzymy odpowiedź i ustawiamy ciasteczka
        return NextResponse.json({
            status: "success",
            json : {
                access_token,
                refresh_token,
                expires_in,
                refresh_expires_in
            }
        });
        // res.cookies.set("access_token", access_token, {
        //     httpOnly: true,
        //     path: "/",
        //     maxAge: expires_in,
        //     sameSite: "lax",
        // });
        // res.cookies.set("refresh_token", refresh_token, {
        //     httpOnly: true,
        //     path: "/",
        //     maxAge: refresh_expires_in,
        //     sameSite: "lax",
        // });
        // // po res.cookies.set("access_token", …) i res.cookies.set("refresh_token", …)
        // res.cookies.set("loggedIn", "true", {
        //     httpOnly: false,
        //     path: "/",
        //     maxAge: expires_in,
        //     sameSite: "lax",
        // });



        // return res;
    } catch (error) {
        console.error("Error proxying login:", error);
        return NextResponse.json(
            { status: "error", message: "Service unavailable" },
            { status: 503 }
        );
    }
}
