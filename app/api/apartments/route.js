import {NextResponse} from "next/server";

export async function POST(req){

    try{
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const { accessToken, id } = await req.json();

        if(id){
            const response = await fetch(`${apiUrl}/api/apartments/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });

            const json = await response.json();
            return NextResponse.json({
                status: 200,
                message: "Apartment fetched successfully",
                apartment: json
            })
        }

        const response = await fetch(`${apiUrl}/api/apartments`, {
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
            error: err || "Unknown error"
        });
    }


}