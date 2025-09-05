export async function deleteOffer(offerId, accessToken) {


    const url = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${url}/api/rental-offers/delete`, {
        method: 'POST', headers: {
            'Content-Type': 'application/json',
        }, body: JSON.stringify({
            offerId: offerId, accessToken: accessToken
        })
    });


    return await response.json();

}