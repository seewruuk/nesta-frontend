import {NextResponse} from "next/server";

export async function POST(req){

    try{
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const { accessToken } = await req.json();

        const response = await fetch(`${baseUrl}/api/apartments`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });

        const json = await response.json();
        return NextResponse.json({
            status: 200,
            message: "Apartments fetched successfully",
            apartments: json
        })

    }catch(err){
        return NextResponse.json({
            status: "error",
            message: "There was an error fetching the apartments",
        });
    }


}