import { NextResponse } from "next/server";

export async function POST() {
    const res = NextResponse.json({ status: "success" });

    // Usuń cookie httpOnly
    res.cookies.set("access_token", "", {
        httpOnly: true,
        path: "/",
        maxAge: 0,
    });
    res.cookies.set("refresh_token", "", {
        httpOnly: true,
        path: "/",
        maxAge: 0,
    });

    // Usuń cookie non-httpOnly
    res.cookies.set("loggedIn", "", {
        path: "/",
        maxAge: 0,
    });
    res.cookies.set("user", "", {
        path: "/",
        maxAge: 0,
    });

    return res;
}
