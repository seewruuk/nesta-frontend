import {NextResponse} from "next/server";

export async function POST(req){
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const { accessToken, id } = await req.json();


        const response = await fetch(`${apiUrl}/api/move-in-applications/${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });


        const json = await response.json();
        if(json.status === 401){
            return NextResponse.json({
                status: 401,
                message: "Unauthorized access. Please check your access token.",
                error: "Unauthorized"
            });
        }
        return NextResponse.json({
            status: 200,
            message: "Offer fetched successfully",
            applications: json
        })

    }catch (err){
        return NextResponse.json({
            status: "error",
            message: "There was an error fetching the move in applications",
            error: err || "Unknown error"
        });
    }
}
