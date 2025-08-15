export async function updateApartment(apartmentId, accessToken, dataToSend) {


    const url = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${url}/api/update-apartment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            apartmentId: apartmentId,
            accessToken: accessToken,
            dataToSend : dataToSend,
        })
    });


    return await response.json();

}