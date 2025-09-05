export async function updateOffer(offerId, accessToken, dataToSend) {


    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${baseUrl}/api/rental-offers/update`, {
        method: 'POST', headers: {
            'Content-Type': 'application/json',
        }, body: JSON.stringify({
            offerId: offerId, accessToken: accessToken, dataToSend: dataToSend,
        })
    });


    return await response.json();

}