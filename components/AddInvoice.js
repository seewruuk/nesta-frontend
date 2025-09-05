"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import DashboardElement from "@/components/DashboardElement";
import sectionHeader from "@/lib/sectionHeader";
import { toast } from "react-hot-toast";
import Button from "@/components/Button";
import Debugger from "@/components/Debugger";
import Image from "next/image";
import { ImageUrl } from "@/lib/imageUrl";

export default function AddInvoice() {
    const { accessToken } = useContext(AuthContext);

    // ---- UI/FORM STATE ----
    const [userRentalOffers, setUserRentalOffers] = useState(null);
    const [offersLoading, setOffersLoading] = useState(false);

    const [form, setForm] = useState({
        rentalOfferId: "",
        amountPln: "", // przyjazny input (np. 10,00)
        amountCents: "", // faktycznie wysyłany int w stringu
        currency: "PLN",
        receiverId: "", // teraz ustawiane automatycznie z oferty (rentierId)
    });

    const [submitting, setSubmitting] = useState(false);
    const [createdInvoice, setCreatedInvoice] = useState(null);

    // ---- LOAD OFFERS ----
    useEffect(() => {
        const fetcher = async () => {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
            try {
                setOffersLoading(true);
                const response = await fetch(`${baseUrl}/api/rental-offers`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ accessToken }),
                });
                const data = await response.json();
                if (data?.error === "Unauthorized" || data?.status === 401) {
                    toast.error("Brak dostępu. Zaloguj się ponownie.");
                    return;
                }

                // ⬇️ NAJMNIEJ INWAZYJNA ZMIANA:
                // filtrujemy oferty – pokazujemy tylko te, które mają przypisanego najemcę (rentierId != null)
                const onlyWithRentier = (data?.offers || []).filter((o) => !!o?.rentierId);
                setUserRentalOffers(onlyWithRentier);
            } catch (error) {
                console.error("Error fetching offers:", error);
                toast.error("Nie udało się pobrać ofert.");
            } finally {
                setOffersLoading(false);
            }
        };

        if (accessToken) fetcher();
    }, [accessToken]);

    // ---- HELPERS ----
    const parseAmountToCents = (val) => {
        if (!val) return "";
        // akceptujemy 10, 10.5, 10,50, 10.50
        const normalized = String(val).replace(/,/g, ".").replace(/[^0-9.]/g, "").trim();
        if (normalized === "") return "";
        const number = Number(normalized);
        if (Number.isNaN(number)) return "";
        // Zaokrąglamy do groszy, unikamy błędów binarnych
        return String(Math.round(number * 100));
    };

    // aktualizuj amountCents przy zmianie amountPln
    useEffect(() => {
        setForm((f) => ({ ...f, amountCents: parseAmountToCents(f.amountPln) }));
    }, [form.amountPln]);

    // Wybrana oferta
    const selectedOffer = useMemo(() => {
        if (!userRentalOffers || !form.rentalOfferId) return null;
        return userRentalOffers.find(
            (o) => String(o.id) === String(form.rentalOfferId)
        );
    }, [userRentalOffers, form.rentalOfferId]);

    // Gdy wybierzemy ofertę – ustawiamy receiverId = rentierId (auto)
    useEffect(() => {
        if (selectedOffer?.rentierId) {
            setForm((f) => ({ ...f, receiverId: selectedOffer.rentierId }));
        } else {
            setForm((f) => ({ ...f, receiverId: "" }));
        }
    }, [selectedOffer]);

    const isValid = useMemo(() => {
        const idOk =
            !!form.rentalOfferId && !Number.isNaN(parseInt(form.rentalOfferId));
        const centsOk =
            !!form.amountCents && !Number.isNaN(parseInt(form.amountCents));
        // receiverId teraz pochodzi z oferty (rentierId) i nie jest edytowalny
        const recv = selectedOffer?.rentierId || form.receiverId;
        const recvOk = !!recv && String(recv).length > 10; // prosta walidacja UUID
        return idOk && centsOk && recvOk && !submitting;
    }, [form.rentalOfferId, form.amountCents, form.receiverId, selectedOffer, submitting]);

    const handleAddInvoice = async () => {
        if (!accessToken) {
            toast.error("Brak tokenu dostępu.");
            return;
        }
        if (!isValid) {
            toast.error("Uzupełnij poprawnie wszystkie pola.");
            return;
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const receiverId = selectedOffer?.rentierId || form.receiverId;

        const payload = {
            accessToken,
            rentalOfferId: parseInt(form.rentalOfferId),
            amountCents: parseInt(form.amountCents),
            currency: form.currency || "PLN",
            receiverId,
        };

        try {
            setSubmitting(true);
            const res = await fetch(`${baseUrl}/api/invoices/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (data?.status === 401) {
                toast.error("401: Brak autoryzacji. Zaloguj się ponownie.");
                return;
            }
            if (data?.status === 500 || data?.status === "error") {
                toast.error("500: Błąd serwera podczas tworzenia faktury.");
                return;
            }
            if (data?.status === 200) {
                toast.success("Faktura utworzona.");
                const invoice = data?.apartments || null;
                setCreatedInvoice(invoice);
                setForm((f) => ({ ...f, amountPln: "", amountCents: "" }));
            } else {
                toast.error("Nieoczekiwana odpowiedź API.");
            }
        } catch (e) {
            console.error(e);
            toast.error("Wystąpił błąd sieci.");
        } finally {
            setSubmitting(false);
        }
    };

    // ---- RENDER ----
    return (
        <DashboardElement>
            {sectionHeader("Dodaj nową fakturę")}

            <ol className="mt-4 space-y-6">
                {/* Krok 1 */}
                <li className="rounded-xl   bg-white/70 p-4">
                    <div className="flex items-center gap-2">
                        <StepBullet>1</StepBullet>
                        <h3 className="font-semibold">Wybór oferty (pobieramy ID)</h3>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                        Wybierz ofertę, dla której chcesz dodać fakturę. Zaznaczenie ustawi
                        <span className="font-medium"> rentalOfferId</span>. Pokazujemy tylko oferty
                        z przypisanym najemcą (<span className="font-mono">rentierId</span>).
                    </p>

                    <div className="mt-4">
                        {offersLoading ? (
                            <OfferSkeleton />
                        ) : !userRentalOffers || userRentalOffers.length === 0 ? (
                            <EmptyOffers />
                        ) : (
                            <ul className="grid grid-cols-1 gap-3">
                                {userRentalOffers.map((o) => {
                                    const img = o?.apartment?.images?.[0]?.publicUrl;
                                    const address = [
                                        o?.apartment?.streetName,
                                        o?.apartment?.buildingNumber,
                                        o?.apartment?.apartmentNumber && `/${o.apartment.apartmentNumber}`,
                                    ]
                                        .filter(Boolean)
                                        .join(" ");
                                    const city = [o?.apartment?.postalCode, o?.apartment?.city]
                                        .filter(Boolean)
                                        .join(" ");
                                    const selected = String(form.rentalOfferId) === String(o.id);
                                    return (
                                        <li key={o.id}>
                                            <label
                                                className={`flex gap-3 rounded-lg   p-3 hover:bg-gray-50 cursor-pointer ${
                                                    selected ? "ring-2 ring-black/10" : ""
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="offer"
                                                    className="mt-1 h-4 w-4"
                                                    checked={selected}
                                                    onChange={() =>
                                                        setForm((f) => ({
                                                            ...f,
                                                            rentalOfferId: String(o.id),
                                                            // ustawiamy od razu receiverId = rentierId
                                                            receiverId: o?.rentierId || "",
                                                        }))
                                                    }
                                                />

                                                {img ? (
                                                    <div className="h-16 w-24 relative">
                                                        <Image
                                                            src={ImageUrl(img)}
                                                            alt="Podgląd"
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="h-16 w-24 rounded bg-gray-100  grid place-items-center text-xs text-gray-500">
                                                        Brak zdjęcia
                                                    </div>
                                                )}

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="font-medium">Oferta #{o.id}</span>
                                                        <span className="text-xs text-gray-500">
                              {o.furnishingStatus}
                            </span>
                                                    </div>
                                                    <div className="text-sm text-gray-700 truncate">{address}</div>
                                                    <div className="text-xs text-gray-500">{city}</div>
                                                    <div className="mt-1 text-xs text-gray-500">
                                                        Czynsz: {formatPln(o.monthlyRent)} • Kaucja: {formatPln(o.deposit)} •
                                                        Media: {formatPln(o.utilitiesCost)}
                                                    </div>
                                                    {/* podgląd przypisanego najemcy */}
                                                    <div className="mt-1 text-xs text-gray-500">
                                                        Najemca (rentierId):{" "}
                                                        <span className="font-mono">{o?.rentierId || "—"}</span>
                                                    </div>
                                                </div>
                                            </label>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </li>

                {/* Krok 2 */}
                <li className="rounded-xl   bg-white/70 p-4">
                    <div className="flex items-center gap-2">
                        <StepBullet>2</StepBullet>
                        <h3 className="font-semibold">Wprowadzenie kwoty</h3>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                        Podaj kwotę w PLN (np. <span className="font-mono">10,00</span> lub
                        <span className="font-mono"> 10.00</span>). Zostanie ona przeliczona na grosze
                        (<span className="font-mono">amountCents</span>).
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <div>
                            <label className="text-sm text-gray-700">Kwota (PLN)</label>
                            <input
                                type="text"
                                inputMode="decimal"
                                placeholder="np. 10,00"
                                className="mt-1 w-full rounded-md   px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
                                value={form.amountPln}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, amountPln: e.target.value }))
                                }
                            />
                        </div>
                    </div>
                </li>

                {/* Krok 3 */}
                <li className="rounded-xl   bg-white/70 p-4">
                    <div className="flex items-center gap-2">
                        <StepBullet>3</StepBullet>
                        <h3 className="font-semibold">Id użytkownika (receiverId)</h3>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">receiverId</span> jest teraz pobierany automatycznie
                        z wybranej oferty (<span className="font-mono">rentierId</span>).
                    </p>
                    <div className="mt-3">
                        <input
                            type="text"
                            readOnly
                            className="w-full rounded-md   bg-gray-50 px-3 py-2 text-sm"
                            value={form.receiverId || ""}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Pole tylko do podglądu — wartość pochodzi z oferty.
                        </p>
                    </div>
                </li>

                {/* Krok 4 */}
                <li className="rounded-xl   bg-white/70 p-4">
                    <div className="flex items-center gap-2">
                        <StepBullet>4</StepBullet>
                        <h3 className="font-semibold">Dodaj fakture</h3>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                        Obsługujemy statusy <span className="font-mono">200</span>,{" "}
                        <span className="font-mono">401</span> i <span className="font-mono">500</span>.
                    </p>

                    <div className="mt-3 flex items-center gap-3">
                        <Button
                            title={submitting ? "Wysyłanie..." : "Dodaj fakturę"}
                            onClick={handleAddInvoice}
                            type="button"
                            disabled={!isValid}
                            style={isValid ? "primary" : "disabled"}
                        />
                        {!isValid && (
                            <span className="text-xs text-gray-500">
                Uzupełnij poprawnie poprzednie kroki, aby kontynuować.
              </span>
                        )}
                    </div>

                    {createdInvoice && (
                        <div className="mt-4 rounded-lg   bg-emerald-50 p-3 text-emerald-900">
                            <div className="font-medium">Utworzono fakturę</div>
                            <div className="mt-1 text-sm">
                                Numer: <span className="font-mono">{createdInvoice?.number || "—"}</span>
                                <span className="mx-2">•</span>
                                Kwota: {formatPln((createdInvoice?.amountCents ?? 0) / 100)} (
                                {createdInvoice?.amountCents ?? 0} gr)
                            </div>
                            <div className="text-xs text-emerald-800">
                                ID: {createdInvoice?.id || "—"} • Oferta:{" "}
                                {createdInvoice?.rentalOffer || createdInvoice?.rentalOfferId || "—"}
                            </div>
                        </div>
                    )}
                </li>
            </ol>
        </DashboardElement>
    );
}

// ---- UI helpers ----
function StepBullet({ children }) {
    return (
        <span className="grid h-6 w-6 place-items-center rounded-full bg-black/90 text-white text-xs">
      {children}
    </span>
    );
}

function EmptyOffers() {
    return (
        <div className="rounded-lg    -dashed p-6 text-center text-sm text-gray-600">
            Brak ofert do wyboru.
        </div>
    );
}

function OfferSkeleton() {
    return (
        <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-lg   p-3">
                    <div className="h-4 w-48 bg-gray-200 rounded" />
                    <div className="mt-2 h-3 w-64 bg-gray-200 rounded" />
                </div>
            ))}
        </div>
    );
}

function formatPln(amount) {
    if (amount == null) return "—";
    try {
        return new Intl.NumberFormat("pl-PL", {
            style: "currency",
            currency: "PLN",
            minimumFractionDigits: 2,
        }).format(Number(amount));
    } catch {
        return `${Number(amount).toFixed(2)} PLN`;
    }
}
