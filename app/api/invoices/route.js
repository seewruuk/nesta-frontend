import {NextResponse} from "next/server";

export async function POST(req){

    try{
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const { accessToken } = await req.json();

        const response = await fetch(`${apiUrl}/api/invoices`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });

        if(response.status === 401){
            return NextResponse.json({
                status: 401,
                message: "Unauthorized access. Please check your access token.",
                error: "Unauthorized"
            });
        }

        if(response.status === 500){
            return NextResponse.json({
                status: 500,
                message: "Server error while fetching invoices.",
                error: "Server Error"
            });
        }

        const json = await response.json();

        return NextResponse.json({
            status: 200,
            message: "Invoices fetched successfully",
            invoices: json
        })

    }catch(err){
        return NextResponse.json({
            status: "error",
            message: "There was an error fetching the invoices",
            error: err || "Unknown error"
        });
    }


}