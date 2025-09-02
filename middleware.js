import { NextResponse } from "next/server";


// Paths that must be authenticated
const PROTECTED_MATCHERS = ["/dashboard", "/dashboard/", "/dashboard/:path*"];


function decodeJwt(token) {
    try {
        const payload = token.split(".")[1];
        const json = typeof atob === "function" ? atob(payload) : Buffer.from(payload, "base64").toString();
        return JSON.parse(json);
    } catch {
        return null;
    }
}


export function middleware(req) {
    const { nextUrl, cookies } = req;
    const pathname = nextUrl.pathname;


// Skip if route is not protected
    const isProtected = PROTECTED_MATCHERS.some((p) => {
        if (p.endsWith(":path*")) return pathname.startsWith(p.replace(":path*", ""));
        return pathname === p;
    });
    if (!isProtected) return NextResponse.next();


// Basic cookie presence check
    const loggedIn = cookies.get("loggedIn")?.value === "true";
    const accessToken = cookies.get("access_token")?.value;


// If missing, bounce to /login
    if (!loggedIn || !accessToken) {
        const url = nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("next", pathname); // optional return after login
        return NextResponse.redirect(url);
    }


// Optional: soft expiry check
    const decoded = decodeJwt(accessToken);
    if (decoded?.exp && Date.now() / 1000 >= decoded.exp) {
        const url = nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("reason", "expired");
        url.searchParams.set("next", pathname);
        return NextResponse.redirect(url);
    }


    return NextResponse.next();
}


export const config = {
    matcher: ["/dashboard/:path*", "/dashboard"],
};