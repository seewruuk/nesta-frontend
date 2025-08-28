import {NextResponse} from "next/server";

export async function POST(req) {

    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const {accessToken, id} = await req.json();

        if (id) {
            const response = await fetch(`${apiUrl}/api/rental-offers/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 401) {
                return NextResponse.json({
                    status: 401,
                    message: "Unauthorized access. Please check your access token.",
                    error: "Unauthorized"
                });
            }

            const json = await response.json();
            return NextResponse.json({
                status: 200,
                message: "Offer fetched successfully",
                offer: json
            })
        }


        const response = await fetch(`${apiUrl}/api/rental-offers`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });

        // Handle unauthorized access p2
        if (response.status === 401) {
            return NextResponse.json({
                status: 401,
                message: "Unauthorized access. Please check your access token.",
                error: "Unauthorized"
            });
        }

        const json = await response.json();

        return NextResponse.json({
            status: 200,
            message: "Offers fetched successfully",
            offers: json
        })

    } catch (err) {
        return NextResponse.json({
            status: "error",
            message: "There was an error fetching the offers",
            error: err.message || "Unknown error"
        });
    }


}

export async function GET(req) {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/api/rental-offers`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json()

        return NextResponse.json({
            status: 200,
            message: "Offers fetched successfully",
            offers: data
        })
    }catch (error) {
        return NextResponse.json({
            status: "error",
            message: "There was an error fetching the offers",
            error: error.message || "Unknown error"
        });
    }
}
