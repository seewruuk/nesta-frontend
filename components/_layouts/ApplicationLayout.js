"use client";
import {useContext, useEffect, useMemo, useState} from "react";
import {AuthContext} from "@/context/AuthContext";
import DashboardElement from "@/components/DashboardElement";
import Image from "next/image";
import formatDate from "@/lib/formatDate";
import Button from "@/components/Button";
import StatusLabel from "@/components/StatusLabel";
import Debugger from "@/components/Debugger";
import {toast} from "react-hot-toast";
import {AnimatePresence, motion} from "framer-motion";
import {useRouter} from "next/navigation";

/** ===================== Pomocnicze komponenty ===================== **/

/** Delikatny box informacyjny / ostrzegawczy */
function InfoBanner({tone = "info", children, className = ""}) {
    const toneClasses = {
        info: "bg-blue-50 border-blue-200 text-blue-800",
        warn: "bg-yellow-50 border-yellow-200 text-yellow-800",
        ok: "bg-green-50 border-green-200 text-green-800",
        error: "bg-red-50 border-red-200 text-red-800",
        neutral: "bg-gray-50 border-gray-200 text-gray-800",
    };
    return (
        <div className={`p-4 border rounded-lg ${toneClasses[tone]} ${className}`}>
            {children}
        </div>
    );
}

function StatusBlock({title, status, decidedAt, reason}) {
    if (!status || status === "PENDING") return null;

    const isApproved = status === "APPROVED";
    const tone = isApproved ? "ok" : "error";

    return (
        <InfoBanner tone={tone} className="mb-4">
            <div className="font-medium">{title} <span className="capitalize">{status?.toLowerCase()}</span></div>
            {reason && <div className="mt-2 text-sm text-gray-700">Powód: {reason}</div>}
            {decidedAt && (
                <div className="mt-1 text-xs text-gray-500">{formatDate(decidedAt, "absolute")}</div>
            )}
        </InfoBanner>
    );
}

function DecisionActions({onApprove, onReject}) {
    return (
        <div className="flex gap-2 mt-4">
            <Button
                type="button"
                title="Akceptuj"
                style="primary"
                onClick={() => onApprove()}
            />
            <Button
                type="button"
                title="Odrzuć"
                style="primary"
                onClick={() => {
                    const msg = prompt("Podaj powód odrzucenia aplikacji") || "Brak podanego powodu";
                    onReject(msg);
                }}
            />
        </div>
    );
}

function RescheduleModal({open, onClose, onConfirm}) {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    useEffect(() => {
        if (!open) {
            setDate("");
            setTime("");
        }
    }, [open]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    className="fixed inset-0 z-50 grid place-items-center"
                >
                    <div className="absolute inset-0 bg-primary opacity-90" />
                    <div className="relative z-10 p-8 rounded-3xl bg-white w-full max-w-md">
                        <div className="flex flex-col gap-4">
                            <h3 className="text-center text-lg font-semibold">Wybierz datę i godzinę</h3>

                            <div className="flex flex-col gap-4">
                                <input
                                    type="date"
                                    className="border border-gray/20 rounded-lg p-2"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                                <input
                                    type="time"
                                    className="border border-gray/20 rounded-lg p-2"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                />

                                <div className="flex gap-2 justify-end">
                                    <Button type="button" title="Anuluj" style="black" onClick={onClose} />
                                    <Button
                                        type="button"
                                        title="Zapisz"
                                        style="primary"
                                        onClick={() => onConfirm(date, time)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}


export default function ApplicationLayout({applicationId}) {
    const {accessToken, userId, handleLogout} = useContext(AuthContext);
    const [applicationDetails, setApplicationDetails] = useState(null);
    const [loaded, setLoaded] = useState(false);           // <- ukrywa layout do czasu zakończenia próby pobrania
    const [showPopUp, setShowPopUp] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!accessToken) return;
        (async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
                const res = await fetch(`${baseUrl}/api/moveinapplications/read`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({accessToken, id: applicationId}),
                });

                if (res.status === 401) {
                    toast.error("Sesja wygasła. Zaloguj się ponownie.");
                    handleLogout();
                    setLoaded(true);
                    return;
                }

                if (!res.ok) {
                    toast.error("Nie udało się pobrać danych aplikacji.");
                    setLoaded(true);
                    return;
                }

                const {applications} = await res.json();
                setApplicationDetails(applications ?? null);
            } catch (err) {
                console.error("Błąd przy pobieraniu aplikacji:", err);
                toast.error("Wystąpił problem z połączeniem. Spróbuj ponownie.");
            } finally {
                setLoaded(true);
            }
        })();
    }, [accessToken, applicationId, handleLogout]);

    const {
        isLandlord,
        myStatus,
        otherStatus,
        decidedAt,
        decisionReason,
        landlordStatus
    } = useMemo(() => {
        const app = applicationDetails;
        const isLand = app ? app.rentierId !== userId : false;
        const mine = isLand ? app?.landlordStatus : app?.rentierStatus;
        const other = isLand ? app?.rentierStatus : app?.landlordStatus;
        const decided = isLand ? app?.landlordDecidedAt : app?.rentierDecidedAt;
        const reason = isLand ? app?.landlordDecisionReason : app?.rentierDecisionReason;
        return {
            isLandlord: isLand,
            myStatus: mine,
            otherStatus: other,
            decidedAt: decided,
            decisionReason: reason,
            landlordStatus: app?.landlordStatus,
        };
    }, [applicationDetails, userId]);


    const handleDecide = async (status, message) => {
            if (!accessToken) return;
            try {
                const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
                const res = await fetch(`${baseUrl}/api/moveinapplications/set-decision`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({accessToken, applicationId, status, message}),
                });

                if (res.status === 401) {
                    toast.error("Sesja wygasła. Zaloguj się ponownie.");
                    handleLogout();
                    return;
                }


                const data = await res.json();
                setApplicationDetails((prev) => prev ? ({
                    ...prev,
                    landlordStatus: status,
                    landlordDecidedAt: data.decidedAt ?? prev.landlordDecidedAt,
                    landlordDecisionReason: data.reason ?? prev.landlordDecisionReason,
                }) : prev);
                router.refresh()

                toast.success(
                    status === "APPROVED" ? "Aplikacja zaakceptowana." : "Aplikacja odrzucona."
                );
            } catch (err) {
                console.error("Błąd decyzji:", err);
                toast.error("Wystąpił błąd. Spróbuj ponownie.");
            }
        };

    const handleReschedule = async (date, time) => {
        if (!date || !time) {
            toast("Wybierz datę i godzinę.", {icon: "📅"});
            return;
        }
        if (!accessToken) return;

        const viewingDateTime = `${date}T${time}:00`;

        try {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
            const res = await fetch(`${baseUrl}/api/moveinapplications/reschedule-viewing`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({accessToken, applicationId, newDate: viewingDateTime}),
            });

            if (res.status === 401) {
                toast.error("Sesja wygasła. Zaloguj się ponownie.");
                handleLogout();
                return;
            }
            if (res.status === 409) {
                toast.error("Wybrany termin jest już zajęty. Wybierz inny.");
                return;
            }


            setShowPopUp(false);
            setApplicationDetails((prev) => prev ? ({...prev, viewingDateTime}) : prev);
            router.refresh()
            toast.success("Termin oględzin zaktualizowany.");
        } catch (err) {
            console.error("Błąd zmiany terminu oględzin:", err);
            toast.error("Wystąpił błąd. Spróbuj ponownie.");
        }
    };

    const handleCancelApplication = async () => {
        if (!accessToken) return;
        try {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
            const res = await fetch(`${baseUrl}/api/moveinapplications/set-decision`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    accessToken,
                    applicationId,
                    status: "CANCELLED",
                    message: "Najemca anulował aplikację",
                }),
            });

            if (res.status === 401) {
                toast.error("Sesja wygasła. Zaloguj się ponownie.");
                handleLogout();
                return;
            }
            if (!res.ok) {
                toast.error("Nie udało się anulować aplikacji.");
                return;
            }

            toast.success("Aplikacja anulowana.");
            router.refresh();
        } catch (err) {
            console.error("Błąd anulowania aplikacji:", err);
            toast.error("Wystąpił błąd. Spróbuj ponownie.");
        }
    };

    if (!loaded) return null;

    if (!applicationDetails) {
        return (
            <DashboardElement>
                <InfoBanner tone="neutral">Nie znaleziono szczegółów tej aplikacji.</InfoBanner>
            </DashboardElement>
        );
    }

    return (
        <>
            <Debugger data={applicationDetails} />

            {/* Modal zmiany terminu */}
            <RescheduleModal
                open={showPopUp}
                onClose={() => setShowPopUp(false)}
                onConfirm={handleReschedule}
            />

            <DashboardElement>
                <h2 className="text-2xl font-semibold mb-4">Aplikacja #{applicationId}</h2>

                <div className="flex items-center gap-4 mb-6">
                    <div className="relative h-20 w-20 rounded-full overflow-hidden border-[5px] border-primary">
                        <Image
                            src={"https://images.pexels.com/photos/25643042/pexels-photo-25643042.jpeg"}
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
                            {applicationDetails.rentierId}
                        </div>
                        <div className="text-sm text-gray-500">
                            Złożono: {formatDate(applicationDetails.createdAt, "absolute")}
                        </div>
                    </div>

                    <div className="flex flex-grow items-center justify-end gap-3">
                        <div className={"text-[14px] font-semibold text-gray-500"}>Twoja decyzja: </div>
                        <StatusLabel status={myStatus} fontSize={14} paddingX={8} paddingY={4} />

                    </div>

                </div>

                {/* Proponowany termin wizyty */}
                {applicationDetails.viewingDateTime && (
                    <InfoBanner tone="warn" className="mb-4">
                        Zaproponowany termin wizyty:{" "}
                        <span className="font-semibold">
              {formatDate(applicationDetails.viewingDateTime, "absolute")}
            </span>
                    </InfoBanner>
                )}

                {/* Blok statusu mojej strony */}
                <StatusBlock
                    title={isLandlord ? "Twój ruch:" : "Twoja decyzja:"}
                    status={myStatus}
                    decidedAt={decidedAt}
                    reason={decisionReason}
                />

                {/* Informacja o statusie drugiej strony */}
                {otherStatus && (
                    <InfoBanner tone="neutral" className="mb-4">
                        {isLandlord
                            ? `Status najemcy: ${otherStatus.toLowerCase()}`
                            : `Decyzja właściciela: ${otherStatus.toLowerCase()}`}
                    </InfoBanner>
                )}

                {/* Komunikat po odrzuceniu przez landlord'a */}
                {applicationDetails.viewingDateTime && landlordStatus === "REJECTED" && !isLandlord && (
                    <InfoBanner tone="error" className="mb-4">
                        Twoja aplikacja została odrzucona. Skontaktuj się z właścicielem w celu ustalenia nowego terminu
                        oględzin.
                    </InfoBanner>
                )}

                {/* Komunikat o anulowaniu przez najemcę */}
                {applicationDetails.rentierStatus === "CANCELLED" && (
                    <InfoBanner tone="error" className="mb-4">
                        {isLandlord ? "Najemca anulował aplikację." : "Anulowałeś swoją aplikację."}
                    </InfoBanner>
                )}

                {/* Dostępne akcje */}
                {myStatus === "PENDING" && isLandlord && (
                    <DecisionActions
                        onApprove={() => handleDecide("APPROVED", "Mam nadzieję, że mieszkanie się spodoba!")}
                        onReject={(msg) => handleDecide("REJECTED", msg)}
                    />
                )}

                {myStatus === "PENDING" && landlordStatus === "PENDING" && !isLandlord && (
                    <div className="flex flex-col gap-2">
                        <Button
                            type="button"
                            title="Zaproponuj nowy termin"
                            style="primary"
                            onClick={() => setShowPopUp(true)}
                        />
                        <Button
                            type="button"
                            title="Anuluj aplikację"
                            style="black"
                            onClick={handleCancelApplication}
                        />
                    </div>
                )}
            </DashboardElement>
        </>
    );
}
