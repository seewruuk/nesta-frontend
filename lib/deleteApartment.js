export async function deleteApartment(apartmentId, accessToken) {


    const url = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${url}/api/apartments/delete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            apartmentId: apartmentId,
            accessToken: accessToken
        })
    });
    const json = await response.json();
    if(json.status===500){
        return {
            error: true,
            json: json
        }
    }
    return json

}