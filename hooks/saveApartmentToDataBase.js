export async function saveApartmentToData (data) {


    const url = process.env.NEXT_PUBLIC_API_URL;
    const userId = "7a282ec4-8c6c-43ef-9c17-2d7a7a7a3da4";

    const apartment = {
        "area": 75,
        "numberOfRooms": 3,
        "numberOfBathrooms": 1,
        "floor": 2,
        "furnished": true,
        "hasBalcony": true,
        "parkingType": "UNDERGROUND",
        "hasElevator": true,
        "disabledAccessible": false,
        "hasStorageRoomInBasement": true,
        "streetName": "Main Street",
        "buildingNumber": "12C",
        "apartmentNumber": "5",
        "city": "Wroclaw",
        "postalCode": "50-124",
        "country": "Poland"
    }

    try {
        const response = await fetch(`${url}/api/apartments`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
            },
            body: JSON.stringify(apartment),
        });

        if (!response.ok) {
            throw new Error("Failed to save apartment data");
        }
        const result = await response.json();
        console.log("Apartment saved successfully:", result);
        return result;

    }
    catch (error) {
        console.error("Error saving apartment data:", error);
        throw error;
    }
}