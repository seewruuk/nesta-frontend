import {NextResponse} from "next/server";

export async function POST(req) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const { accessToken, data } = await req.json();

    try {
        const response = await fetch(`${apiUrl}/api/rental-offers`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: data
        });
        const result = await response.json();


        if(response.status === 401){
            return NextResponse.json({
                status: 401,
                message: "Unauthorized access. Please check your access token.",
                error: "Unauthorized"
            });
        }

        if(response.status === 409){
            return NextResponse.json({
                status: 409,
                message: "Conflict error. The offer might already exist.",
                error: "Conflict"
            });
        }


        return NextResponse.json(
            {status: "success", message: "Offer saved successfully", data: result},
            {status: 200}
        );
    } catch (error) {
        return NextResponse.json(
            {status: "error", error: error.message},
            {status: 503}
        );
    }

}