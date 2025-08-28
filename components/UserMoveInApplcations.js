"use client"
import {AuthContext} from "@/context/AuthContext";
import {useContext, useState, useEffect} from "react";
import Link from "next/link";
import formatDate from "@/lib/formatDate";
import StatusLabel from "@/components/StatusLabel";

/** Minimalny skeleton */
function Skeleton({ className = "" }) {
    return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}
Skeleton.Text = ({ className = "" }) => <Skeleton className={`h-4 ${className}`} />;

export const UserMoveInApplications = () => {
    const {accessToken, handleLogout, userRole, userId} = useContext(AuthContext);
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // notatka - endpointy trzeba poprawić na dynamiczne jak chodzi o userId oraz jego status
    const apiEndpoints = {
        LANDLORD: "/api/moveinapplications/by-landlord",
        RENTIER: "/api/moveinapplications/by-rentier",
    }

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(apiEndpoints[userRole], {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        accessToken: accessToken,
                        userId: userId
                    }),
                });

                if(response.status === 401){
                    handleLogout();
                    return;
                }

                if (response.ok) {
                    const data = await response.json();
                    setApplications(Array.isArray(data) ? data : []);
                } else {
                    console.error('Failed to fetch applications');
                    setApplications([]);
                }
            } catch (error) {
                console.error('Error fetching applications:', error);
                setApplications([]);
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

    if (isLoading) {
        return (
            <div className="w-full">
                <label className="block mb-2">Aplikacje</label>
                <div className="flex flex-col gap-2 w-full">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-slate-50 p-5 rounded-lg w-full flex flex-col gap-3">
                            <Skeleton.Text className="w-24" />
                            <div className="flex justify-between items-center">
                                <Skeleton.Text className="w-28" />
                                <Skeleton className="h-5 w-16" />
                            </div>
                            <div className="flex justify-between items-center">
                                <Skeleton.Text className="w-28" />
                                <Skeleton className="h-5 w-16" />
                            </div>
                            <Skeleton.Text className="w-2/3" />
                            <Skeleton.Text className="w-1/2" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!applications || applications.length === 0) {
        return null;
    }

    return (
        <div className="w-full">
            <label className="block mb-2">Aplikacje</label>
            <div className="flex flex-col gap-2 w-full">
                {applications.map((app, index) => (
                    <Link
                        key={index}
                        className="bg-slate-50 p-5 rounded-lg text-[11px] w-full flex flex-col gap-3"
                        href={`/dashboard/moveinapplications/${app.id}`}
                    >
                        <div>{formatDate(app.createdAt, "relative")}</div>
                        <div className="flex justify-between items-center">
                            <div>Landlord status:</div>
                            <StatusLabel status={app.landlordStatus} />
                        </div>
                        <div className="flex justify-between items-center">
                            <div>Rentier status:</div>
                            <StatusLabel status={app.rentierStatus} />
                        </div>
                        <p className="truncate">{app.rentierId}</p>
                        <p className="truncate">Rental offer: {app.rentalOffer}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
