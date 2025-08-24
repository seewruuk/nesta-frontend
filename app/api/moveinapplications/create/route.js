import {NextResponse} from "next/server";

export async function POST(req) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const { accessToken, selectedDate, rentalOfferId } = await req.json();

    try {
        const response = await fetch(`${apiUrl}/api/move-in-applications`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                rentalOffer: { id :  rentalOfferId },
                viewingDateTime: selectedDate
            })

        });
        const result = await response.json();
        if(result.id){
            return NextResponse.json(
                {status: "success", message: "Apartment saved successfully", application: result},
                {status: 200}
            );
        }
        return NextResponse.json(
            {status: "error", error: result.message || "Something went wrong"},
            {status: 503}
        );

    } catch (error) {
        return NextResponse.json(
            {status: "error", error: error.message},
            {status: 503}
        );
    }
}