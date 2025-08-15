export async function deleteApartment(apartmentId, accessToken) {


    const url = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${url}/api/delete-apartment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            apartmentId: apartmentId,
            accessToken: accessToken
        })
    });


    return await response.json();

}