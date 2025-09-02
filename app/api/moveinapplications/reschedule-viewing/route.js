import NextResponse from "next/server";

export async function POST(req) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const {accessToken, applicationId, newDate} = await req.json();
    try {
        const data = {
            updatedViewingDateTime: newDate,
        }
        const response = await fetch(`${apiUrl}/api/move-in-applications/${applicationId}/reschedule`, {
            method: "PUT", headers: {
                Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json",
            }, body: JSON.stringify(data),
        });
        if (response.status === 401) {
            return NextResponse.json({
                status: 401, message: "Unauthorized access. Please check your access token.", error: "Unauthorized"
            });
        }
        if (response.status === 409) {
            return NextResponse.json({
                status: 409,
                message: "The selected time slot is no longer available.",
                error: "The selected time slot is no longer available. Please choose a different time.",
            });
        }
        const result = await response.json();
        return NextResponse.json({
            status: response.status, data: result
        });
    } catch (error) {
        return NextResponse.json({status: "error", error: error.message}, {status: 503});
    }
}



