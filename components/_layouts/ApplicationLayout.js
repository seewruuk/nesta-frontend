"use client";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import DashboardElement from "@/components/DashboardElement";
import Image from "next/image";
import formatDate from "@/lib/formatDate";
import Button from "@/components/Button";
import StatusLabel from "@/components/StatusLabel";
import Debugger from "@/components/Debugger";

export default function ApplicationLayout({ applicationId }) {
    const { accessToken, userId } = useContext(AuthContext);
    const [applicationDetails, setApplicationDetails] = useState(null);
    const [showPopUp, setShowPopUp] = useState(false);

    // Rozdzielone stany dla daty i czasu
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");

    // Fetch szczegółów aplikacji
    useEffect(() => {
        if (!accessToken) return;
        (async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
                const res = await fetch(`${baseUrl}/api/moveinapplications/read`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ accessToken, id: applicationId }),
                });
                if (!res.ok) throw new Error("Fetch failed");
                const { applications } = await res.json();
                setApplicationDetails(applications);
            } catch (err) {
                console.error("Błąd przy pobieraniu aplikacji:", err);
            }
        })();
    }, [accessToken, applicationId]);

    // Ustawienie wybranej daty
    const handleSelectDate = (e) => {
        setSelectedDate(e.target.value);
    };

    // Ustawienie wybranej godziny
    const handleSelectTime = (e) => {
        setSelectedTime(e.target.value);
    };

    // Wyślij aplikację z połączoną datą i czasem w formacie ISO
    const handleSaveApplication = async () => {
        if (!selectedDate || !selectedTime) {
            alert("Proszę wybrać zarówno datę, jak i godzinę oględzin.");
            return;
        }
        const viewingDateTime = `${selectedDate}T${selectedTime}:00`;

        try {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
            const response = await fetch(`${baseUrl}/api/moveinapplications/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    accessToken,
                    rentalOfferId: applicationDetails.rentalOfferId,
                    viewingDateTime,
                }),
            });
            const data = await response.json();
            if (data.application) {
                alert("Aplikacja została wysłana pomyślnie!");
                setShowPopUp(false);
                setApplicationDetails(data.application);
            } else {
                alert(
                    "Wystąpił błąd podczas wysyłania aplikacji: " +
                    (data.error || "Nieznany błąd")
                );
            }
        } catch (err) {
            console.error("Wystąpił błąd:", err);
            alert("Wystąpił błąd sieci. Spróbuj ponownie.");
        }
    };

    // Landlord podejmuje decyzję (APPROVED/REJECTED)
    const handleDecide = async (status, message) => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
            const res = await fetch(`${baseUrl}/api/moveinapplications/set-decision`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accessToken, applicationId, status, message }),
            });
            if (!res.ok) throw new Error("Decision failed");
            const data = await res.json();
            setApplicationDetails((prev) => ({
                ...prev,
                landlordStatus: status,
                landlordDecidedAt: data.decidedAt,
                landlordDecisionReason: data.reason || prev.landlordDecisionReason,
            }));
        } catch (err) {
            console.error("Błąd decyzji:", err);
            alert("Nie udało się zapisać decyzji. Spróbuj ponownie.");
        }
    };

    if (!applicationDetails) {
        return <DashboardElement>Ładowanie szczegółów aplikacji...</DashboardElement>;
    }

    // Określenie roli użytkownika
    const isLandlord =
        applicationDetails.rentierId !== userId;
    const myStatus = isLandlord
        ? applicationDetails.landlordStatus
        : applicationDetails.rentierStatus;
    const otherStatus = isLandlord
        ? applicationDetails.rentierStatus
        : applicationDetails.landlordStatus;
    const decidedAt = isLandlord
        ? applicationDetails.landlordDecidedAt
        : applicationDetails.rentierDecidedAt;
    const decisionReason = isLandlord
        ? applicationDetails.landlordDecisionReason
        : applicationDetails.rentierDecisionReason;

    return (
        <>
            <DashboardElement>
                {/* Debugger dla surowych danych */}
                <Debugger data={applicationDetails} />

                <h2 className="text-2xl font-semibold mb-4">
                    Aplikacja #{applicationId}
                </h2>

                <div className="flex items-center gap-4 mb-6">
                    <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-gray-200">
                        <Image
                            src={
                                applicationDetails.rentierAvatarUrl ||
                                "/default-avatar.png"
                            }
                            alt="Avatar najemcy"
                            fill
                            className="object-cover"
                        />
                        {applicationDetails.online && (
                            <span className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 rounded-full border-2 border-white" />
                        )}
                    </div>
                    <div>
                        <div className="text-lg font-bold">
                            {applicationDetails.rentierName}
                        </div>
                        <div className="text-sm text-gray-500">
                            Złożono:{" "}
                            {formatDate(
                                applicationDetails.createdAt,
                                "absolute"
                            )}
                        </div>
                    </div>
                    <StatusLabel
                        status={myStatus}
                        fontSize={14}
                        paddingX={8}
                        paddingY={4}
                    />
                </div>

                {/* Proponowany termin wizyty */}
                <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg mb-4">
                    Zaproponowany termin wizyty:{" "}
                    <span className="font-semibold">
            {formatDate(
                applicationDetails.viewingDateTime,
                "absolute"
            )}
          </span>
                </div>

                {/* Sekcja decyzji i statusów */}
                {myStatus !== "PENDING" && decidedAt && (
                    <div
                        className={
                            "p-4 mb-4 rounded-lg border " +
                            (myStatus === "APPROVED"
                                ? "bg-green-50 border-green-200 text-green-800"
                                : "bg-red-50 border-red-200 text-red-800")
                        }
                    >
                        {isLandlord
                            ? "Twój ruch:"
                            : "Twoja decyzja:"}{" "}
                        <span className="font-semibold capitalize">
              {myStatus.toLowerCase()}
            </span>
                        {decisionReason && (
                            <div className="mt-2 text-sm text-gray-600">
                                Powód: {decisionReason}
                            </div>
                        )}
                        <div className="mt-1 text-xs text-gray-500">
                            {formatDate(decidedAt, "absolute")}
                        </div>
                    </div>
                )}

                {/* Landlord może podjąć decyzję gdy status PENDING */}


                {/* Rentier czeka na decyzję landlord’a */}
                {myStatus === "PENDING" && !isLandlord && (
                    <div className="p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg mb-4">
                        Oczekiwanie na decyzję landlord’a
                    </div>
                )}


                {/* Status drugiej strony */}
                {otherStatus && (
                    <div className="p-4 bg-gray-50 border border-gray-200 text-gray-800 rounded-lg">
                        {isLandlord
                            ? `Status najemcy: ${otherStatus.toLowerCase()}`
                            : `Decyzja właściciela: ${otherStatus.toLowerCase()}`}
                    </div>
                )}

                {myStatus === "PENDING" && isLandlord && (
                    <div className="flex gap-2 mt-4">
                        <Button
                            type={"button"}
                            title="Akceptuj"
                            style="primary"
                            onClick={() => handleDecide("APPROVED", "Spadaj")}
                        />
                        <Button
                            type={"button"}
                            title="Odrzuć"
                            style="primary"
                            onClick={() => handleDecide("REJECTED", "Witaj")}
                        />
                    </div>
                )}

            </DashboardElement>
        </>
    );
}
