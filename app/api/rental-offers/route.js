import {NextResponse} from "next/server";

export async function POST(req){

    try{
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const { accessToken, id } = await req.json();

        if(id){
            const response = await fetch(`${apiUrl}/api/rental-offers/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });

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

        const json = await response.json();
        return NextResponse.json({
            status: 200,
            message: "Offers fetched successfully",
            offers: json
        })

    }catch(err){
        return NextResponse.json({
            status: "error",
            message: "There was an error fetching the offers",
            error: err.message || "Unknown error"
        });
    }


}