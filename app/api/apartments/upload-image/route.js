import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        // Odbieramy multipart/form-data z frontu
        const form = await req.formData();
        const file = form.get("file");
        const accessToken = form.get("accessToken");
        const apartmentId = form.get("apartmentId");

        if (!file) {
            return NextResponse.json(
                { status: 400, message: "Brak pliku (file)." },
                { status: 400 }
            );
        }
        if (!accessToken) {
            return NextResponse.json(
                { status: 400, message: "Brak accessToken." },
                { status: 400 }
            );
        }
        if (!apartmentId) {
            return NextResponse.json(
                { status: 400, message: "Brak apartmentId." },
                { status: 400 }
            );
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        // Budujemy multipart do backendu
        const backendForm = new FormData();
        backendForm.append("file", file);

        // Wysyłamy POJEDYNCZY plik do endpointu backendu
        const backendRes = await fetch(
            `${apiUrl}/api/apartments/${apartmentId}/images`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: backendForm,
            }
        );

        const data = await backendRes.json();
        if(data.id){
            return NextResponse.json({
                status: 200,
                message: "Plik wysłany pomyślnie.",
            })
        }else{
            return NextResponse.json({
                status: backendRes.status,
                message: data?.message || "Błąd podczas wysyłki pliku.",
                error: data?.error || null,
            }, {status: backendRes.status})
        }



    } catch (err) {
        return NextResponse.json(
            {
                status: 500,
                message: "Internal Server Error",
                error: err?.message || String(err),
            },
        );
    }
}
