import NextResponse from "next/server";

export async function POST(req) {

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const {accessToken, date, time, rentalOfferId, x} = await req.json();

    try {
        const data = {
            rentalOffer: {
                id: rentalOfferId
            },
            // viewingDateTime: `${date}T${time}:00` // Assuming time is in HH:MM format
            viewingDateTime: x // Assuming time is in HH:MM format
        }


        const response = await fetch(`${apiUrl}/api/test`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: data
        });
        const result = await response.json();

        return NextResponse.json(
            {status: "success", message: "Move-in application submitted successfully", data: result},
            {status: 200}
        );

    } catch (error) {
        return NextResponse.json(
            {status: "error", error: error.message},
            {status: 503}
        );
    }
}



