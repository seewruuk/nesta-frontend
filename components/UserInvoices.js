"use client"
import DashboardElement from "@/components/DashboardElement";
import sectionHeader from "@/lib/sectionHeader";
import {useContext, useEffect, useMemo, useState} from "react";
import {AuthContext} from "@/context/AuthContext";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";

export default function UserInvoices({offerId}) {
    const {accessToken, userEmail, userRole, handleLogout} = useContext(AuthContext);
    const [userInvoices, setUserInvoices] = useState([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchUserInvoices = async () => {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
            try {
                setLoading(true);
                const response = await fetch(`${baseUrl}/api/invoices`, {
                    method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({accessToken}),
                });
                const data = await response.json();

                if (data.status === 401) {
                    toast.error("Brak dostępu. Proszę się zalogować ponownie.");
                    handleLogout();
                }
                if (data.status === 500) {
                    toast.error("Błąd serwera podczas pobierania faktur.");
                }
                if (data.status === 200) {

                    if (!offerId) {
                        setUserInvoices(data.invoices.content);
                        return;
                    }
                    const initialDataInvoices = data.invoices.content;
                    const filteredInvoices = initialDataInvoices.filter((invoice) => invoice.rentalOfferId === offerId);
                    setUserInvoices(filteredInvoices);
                } else if (![401, 500].includes(data.status)) {
                    toast.error("Nie udało się pobrać faktur.");
                }
            } catch (error) {
                console.error("Error fetching invoices:", error);
                toast.error("Wystąpił błąd podczas pobierania faktur.");
            } finally {
                setLoading(false);
            }
        };

        if (accessToken) fetchUserInvoices();
    }, [accessToken]);

    const formatAmount = (amountCents, currency = "PLN") => {
        const amount = (amountCents ?? 0) / 100;
        try {
            return new Intl.NumberFormat("pl-PL", {
                style: "currency", currency, minimumFractionDigits: 2,
            }).format(amount);
        } catch {
            return `${amount.toFixed(2)} ${currency}`;
        }
    };

    const formatDate = (iso) => {
        if (!iso) return "—";
        const d = new Date(iso);
        return d.toLocaleString("pl-PL", {
            year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
        });
    };

    const stats = useMemo(() => {
        const total = userInvoices.length;
        const unpaid = userInvoices.filter((i) => !i.paid).length;
        const sumDue = userInvoices
            .filter((i) => !i.paid)
            .reduce((acc, i) => acc + (i.amountCents || 0), 0);
        return {total, unpaid, sumDue};
    }, [userInvoices]);

    const filtered = useMemo(() => {
        if (!query) return userInvoices;
        const q = query.toLowerCase();
        return userInvoices.filter((i) => [i.number, i.currency, i.rentalOfferId?.toString()].some((v) => (v ?? "").toString().toLowerCase().includes(q)));
    }, [query, userInvoices]);


    const handlePayInvoice = async (invoiceId) => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

            const response = await fetch(`${baseUrl}/api/payments/checkout`, {
                method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({
                    accessToken: accessToken,
                    invoiceId: invoiceId,
                    email: userEmail,
                    description: `Opłata za fakturę ${invoiceId}})`,
                }),
            });
            const data = await response.json();

            if (data.status === 500) {
                toast.error(data?.message || "Nie udało się wygenerować linku do płatności.");
                return;
            }
            if (data.status === 401) {
                toast.error("Brak dostępu. Proszę się zalogować ponownie.");
                return;
            }

            toast.loading("Przekierowanie do płatności...", {duration: 2000});
            router.push(data.redirectUrl);
        } catch (error) {
            console.error("Error generating payment link:", error);
            toast.error("Wystąpił błąd podczas generowania linku do płatności.");
        }
    }

    const handleDeleteInvoice = async (invoiceId) => {

        try {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

            const response = await fetch(`${baseUrl}/api/invoices/delete`, {
                method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({
                    accessToken: accessToken, invoiceId: invoiceId,
                }),
            });

            toast.success("Faktura została usunięta.");
            router.push("/dashboard/invoices")

        } catch (error) {
            console.error("Error deleting invoice:", error);
            toast.error("Wystąpił błąd podczas usuwania faktury.");
        }
    }


    return (<>

        <DashboardElement>
            {sectionHeader("Twoje faktury")}

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="  -0 shadow-sm bg-gradient-to-br from-gray-50 to-white rounded-xl">
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ReceiptIcon className="h-5 w-5"/>
                            <div className="text-sm text-gray-500">Wszystkich</div>
                        </div>
                        <span className="text-xl font-semibold">{stats.total}</span>
                    </div>
                </div>

                <div className=" shadow-sm rounded-xl bg-white">
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ClockIcon className="h-5 w-5"/>
                            <span className="text-sm text-gray-500">Nieopłacone</span>
                        </div>
                        <div className="text-right">
                            <div className="text-xl font-semibold">{stats.unpaid}</div>
                        </div>
                    </div>
                </div>

                <div className=" shadow-sm rounded-xl bg-white">
                    <div className="p-4">
                        <div className="flex items-center gap-2">
                            <SearchIcon className="h-5 w-5"/>
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Szukaj po numerze / walucie / ofercie"
                                className="h-9 w-full rounded-md bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-gray-300"
                            />
                            {query && (<button
                                type="button"
                                className="h-9 w-9 inline-flex items-center justify-center rounded-md hover:bg-gray-100"
                                onClick={() => setQuery("")}
                                aria-label="Wyczyść filtr"
                            >
                                <XIcon className="h-4 w-4"/>
                            </button>)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                {loading ? (<InvoiceSkeleton/>) : filtered.length === 0 ? (<EmptyState/>) : (
                    <div className="max-h-[60vh] rounded-xl    bg-white/60 overflow-y-auto">
                        <ul className="">
                            {filtered.map((inv) => (<li key={inv.id} className="p-4 hover:bg-gray-50/70 transition">
                                <div
                                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-medium truncate">{inv.number}</span>
                                            {inv.paid ? (<span
                                                className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-emerald-600 text-white">Opłacona</span>) : (
                                                <span
                                                    className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800">Do zapłaty</span>)}
                                        </div>
                                        <div className="mt-1 text-sm text-gray-500">
                                            Wystawiono: {formatDate(inv.createdAt)}
                                            {inv.paidAt && (<>
                                                <span className="mx-2">•</span>
                                                Opłacono: {formatDate(inv.paidAt)}
                                            </>)}
                                        </div>
                                        <div className="mt-1 text-xs text-gray-400">Oferta najmu
                                            ID: {inv.rentalOfferId ?? "—"}</div>
                                    </div>

                                    <div
                                        className="flex items-end md:items-center gap-3 md:gap-6 md:text-right">
                                        <div>
                                            <div className="text-lg font-semibold leading-none">
                                                {formatAmount(inv.amountCents, inv.currency)}
                                            </div>
                                            <div className="text-xs text-gray-500">{inv.currency}</div>
                                        </div>

                                        {inv.paid ? (<div
                                            className="flex items-center text-emerald-600 text-sm font-medium">
                                            <CheckIcon className="h-5 w-5 mr-1"/> Opłacona
                                        </div>) : (

                                            <>
                                                {userRole === "LANDLORD" ? (<button
                                                    type="button"
                                                    className="inline-flex items-center justify-center rounded-2xl bg-red-50 text-red-500 px-4 py-2 text-sm font-medium hover:bg-red-500 hover:text-white transition-all active:scale-[0.98]"
                                                    onClick={() => {
                                                        handleDeleteInvoice(inv.id);
                                                    }}
                                                >
                                                    Usuń fakturę
                                                </button>) : (<button
                                                    type="button"
                                                    className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 active:scale-[0.98]"
                                                    onClick={() => {
                                                        handlePayInvoice(inv.id);
                                                    }}
                                                >
                                                    Opłać
                                                </button>)}
                                            </>

                                        )}

                                    </div>
                                </div>
                            </li>))}
                        </ul>
                    </div>)}
            </div>
        </DashboardElement>
    </>);
}

function EmptyState() {
    return (<div className="     -dashed rounded-xl bg-white">
        <div className="p-10 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <ReceiptIcon className="h-5 w-5"/>
            </div>
            <div className="text-lg font-medium">Brak faktur do wyświetlenia</div>
            <p className="text-sm text-gray-500 mt-1">Gdy pojawią się nowe dokumenty, zobaczysz je tutaj.</p>
        </div>
    </div>);
}

function InvoiceSkeleton() {
    return (<div className="space-y-3">
        {Array.from({length: 4}).map((_, i) => (<div key={i} className="animate-pulse rounded-lg    p-4 bg-white/50">
            <div className="h-4 w-48 bg-gray-200 rounded"/>
            <div className="mt-2 h-3 w-64 bg-gray-200 rounded"/>
            <div className="mt-3 h-8 w-24 bg-gray-200 rounded"/>
        </div>))}
    </div>);
}

function cn(...cls) {
    return cls.filter(Boolean).join(" ");
}

function ReceiptIcon({className}) {
    return (<svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={cn("inline-block", className)}
    >
        <path d="M7 3h10a1 1 0 0 1 1 1v15l-3-2-3 2-3-2-3 2V4a1 1 0 0 1 1-1z"/>
        <path d="M9 7h6M9 11h6"/>
    </svg>);
}

function CheckIcon({className}) {
    return (<svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={cn("inline-block", className)}
    >
        <path d="M20 6 9 17l-5-5"/>
    </svg>);
}

function ClockIcon({className}) {
    return (<svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={cn("inline-block", className)}
    >
        <circle cx="12" cy="12" r="9"/>
        <path d="M12 7v5l4 2"/>
    </svg>);
}

function SearchIcon({className}) {
    return (<svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={cn("inline-block", className)}
    >
        <circle cx="11" cy="11" r="7"/>
        <path d="m21 21-4.3-4.3"/>
    </svg>);
}

function XIcon({className}) {
    return (<svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={cn("inline-block", className)}
    >
        <path d="M18 6 6 18M6 6l12 12"/>
    </svg>);
}