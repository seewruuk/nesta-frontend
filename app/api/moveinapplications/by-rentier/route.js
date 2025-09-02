import {NextResponse} from "next/server";
export async function POST(req) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const {accessToken, userId} = await req.json();
    try {
        const response = await fetch(`${apiUrl}/api/move-in-applications/by-rentier/${userId}`, {
            method: "GET", headers: {
                Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json",
            },
        });
        const result = await response.json();
        if (result.status === 401) {
            return NextResponse.json({
                status: 401, message: "Unauthorized access. Please check your access token.", error: "Unauthorized"
            });
        }
        return NextResponse.json(result,);
    } catch (error) {
        return NextResponse.json({status: "error", error: error.message},);
    }
}