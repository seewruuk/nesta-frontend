import NextResponse from "next/server";

export async function POST(req) {

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const {accessToken, applicationId, status, message} = await req.json();

    try {
        const data = {
            status: status,
            reason: message,
        }
        const response = await fetch(`${apiUrl}/api/move-in-applications/${applicationId}/decision`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
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



