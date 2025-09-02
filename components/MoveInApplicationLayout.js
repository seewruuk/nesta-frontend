"use client";

import {useContext, useEffect, useState} from "react";
import Link from "next/link";
import {AuthContext} from "@/context/AuthContext";
import StatusLabel from "@/components/StatusLabel";
import Debugger from "@/components/Debugger";

/** ————————————————————————————————————————————
 *  Mały, wspólny skeleton (pasuje do reszty dashboardu)
 *  ———————————————————————————————————————————— */
function Skeleton({className = ""}) {
    return <div className={`animate-pulse bg-gray-200 rounded ${className}`}/>;
}

Skeleton.Text = ({className = ""}) => <Skeleton className={`h-4 ${className}`}/>;

/** ————————————————————————————————————————————
 *  Pomocnicze formatowanie dat PL
 *  ———————————————————————————————————————————— */
function fmtDateTime(value) {
    if (!value) return "—";
    try {
        const d = new Date(value);
        return d.toLocaleString("pl-PL", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return String(value);
    }
}

function fmtDate(value) {
    if (!value) return "—";
    try {
        const d = new Date(value);
        return d.toLocaleDateString("pl-PL", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    } catch {
        return String(value);
    }
}

/** ————————————————————————————————————————————
 *  Karta pojedynczej aplikacji
 *  ———————————————————————————————————————————— */
function ApplicationCard({app}) {
    const sideColor =
        app?.landlordStatus === "APPROVED"
            ? "before:bg-emerald-500"
            : app?.landlordStatus === "REJECTED"
                ? "before:bg-rose-500"
                : "before:bg-amber-400";

    return (
        <>

            <div
                className={`relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-5 transition hover:shadow-md ${sideColor} before:absolute before:left-0 before:top-0 before:h-full before:w-1.5 before:content-['']`}
            >
                {/* Nagłówek */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col">
                        <div className="text-xs text-gray-500">ID aplikacji</div>
                        <div className="font-mono text-sm">{app?.id ?? "—"}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-500">Utworzono</div>
                        <div className="text-sm font-medium">{fmtDate(app?.createdAt)}</div>
                    </div>
                </div>

                {/* Treść */}
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                        <div className="text-xs text-gray-500">Oferta</div>
                        <div className="text-sm font-medium">#{app?.rentalOffer ?? "—"}</div>
                    </div>

                    <div className="space-y-1">
                        <div className="text-xs text-gray-500">Termin oględzin</div>
                        <div className="text-sm font-medium">{fmtDateTime(app?.viewingDateTime)}</div>
                    </div>

                    <div className="space-y-1">
                        <div className="text-xs text-gray-500">Status właściciela</div>
                        <div className="text-sm">
                            <StatusLabel status={app?.landlordStatus}/>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="text-xs text-gray-500">Status najemcy</div>
                        <div className="text-sm">
                            <StatusLabel status={app?.rentierStatus}/>
                        </div>
                    </div>
                </div>

                {/* Powody decyzji (opcjonalne) */}
                {(app?.landlordDecisionReason || app?.rentierDecisionReason) && (
                    <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm leading-6">
                        {app?.landlordDecisionReason ? (
                            <div>
                                <span className="font-semibold">Powód (właściciel): </span>
                                <span className="text-gray-700">{app.landlordDecisionReason}</span>
                            </div>
                        ) : null}
                        {app?.rentierDecisionReason ? (
                            <div>
                                <span className="font-semibold">Powód (najemca): </span>
                                <span className="text-gray-700">{app.rentierDecisionReason}</span>
                            </div>
                        ) : null}
                    </div>
                )}

                {/* Stopka / CTA */}
                <div className="mt-5 flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                        Najemca: <span className="font-mono">{app?.rentierId ?? "—"}</span>
                    </div>
                    <Link
                        href={`/dashboard/moveinapplications/${app?.id}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm text-white transition hover:bg-neutral-800"
                    >
                        Szczegóły
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M8 5l8 7-8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                  strokeLinejoin="round"/>
                        </svg>
                    </Link>
                </div>
            </div>


        </>
    );
}

/** ————————————————————————————————————————————
 *  Skeleton karty (odzwierciedla prawdziwy układ)
 *  ———————————————————————————————————————————— */
function ApplicationCardSkeleton() {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-5">
            <div className="absolute left-0 top-0 h-full w-1.5 bg-gray-200"/>
            <div className="flex items-start justify-between gap-4">
                <div>
                    <Skeleton.Text className="w-16 mb-1"/>
                    <Skeleton.Text className="w-24"/>
                </div>
                <div className="text-right">
                    <Skeleton.Text className="w-20 mb-1"/>
                    <Skeleton.Text className="w-28"/>
                </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Skeleton.Text className="w-28"/>
                <Skeleton.Text className="w-40"/>
                <Skeleton className="h-6 w-24"/>
                <Skeleton className="h-6 w-24"/>
            </div>
            <div className="mt-5 flex items-center justify-between">
                <Skeleton.Text className="w-40"/>
                <Skeleton className="h-9 w-28"/>
            </div>
        </div>
    );
}

/** ————————————————————————————————————————————
 *  Główny widok
 *  ———————————————————————————————————————————— */
export default function MoveInApplicationLayout() {
    const {accessToken, userRole, userId} = useContext(AuthContext);
    const [userApplications, setUserApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const apiEndpoints = {
        LANDLORD: "/api/moveinapplications/by-landlord",
        RENTIER: "/api/moveinapplications/by-rentier",
    };

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(apiEndpoints[userRole], {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({accessToken, userId}),
                    cache: "no-store",
                });

                if (response.status === 401) {
                    setUserApplications([]);
                    return;
                }

                if (response.ok) {
                    const data = await response.json();
                    setUserApplications(Array.isArray(data) ? data : []);
                } else {
                    console.error("Failed to fetch applications");
                    setUserApplications([]);
                }
            } catch (error) {
                console.error("Error fetching applications:", error);
                setUserApplications([]);
            } finally {
                setIsLoading(false);
            }
        };

        if (accessToken && userRole) {
            fetchApplications();
        } else {
            setIsLoading(false);
        }
    }, [accessToken, userRole, userId]);

    return (
        <div className="w-full">
            <div className="mb-4 flex items-end justify-between">
                <div>
                    <h2 className="text-2xl font-semibold">Twoje aplikacje</h2>
                    <p className="text-sm text-gray-500">Przeglądaj statusy i terminy umówionych oględzin.</p>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {Array.from({length: 4}).map((_, i) => (
                        <ApplicationCardSkeleton key={i}/>
                    ))}
                </div>
            ) : userApplications && userApplications.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {userApplications.map((app) => (
                        <ApplicationCard key={app.id} app={app}/>
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
                    Brak aplikacji do wyświetlenia.
                </div>
            )}
        </div>
    );
}
