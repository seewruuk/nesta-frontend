"use client"
import {AuthContext} from "@/context/AuthContext";
import {useContext, useState, useEffect} from "react";
import Link from "next/link";
import formatDate from "@/lib/formatDate";
import StatusLabel from "@/components/StatusLabel";

export const UserMoveInApplications = () => {

    const {accessToken, username, userId} = useContext(AuthContext);
    const [applications, setApplications] = useState([]);
    const apiEndpoints = {
        testnajemca4: "/api/moveinapplications/by-landlord",
        testnajemca2: "/api/moveinapplications/by-rentier",
        landlord: "/api/moveinapplications/by-rentier",

    }

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await fetch(apiEndpoints[username], {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        accessToken: accessToken,
                        userId: userId
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setApplications(data);
                } else {
                    console.error('Failed to fetch applications');
                }
            } catch (error) {
                console.error('Error fetching applications:', error);
            }
        };

        if (accessToken) {
            fetchApplications();
        }
    }, []);

    return (
        <div className={"w-full"}>
            <label>Aplikacje</label>

            <div className={"flex flex-col gap-2 w-full"}>
                {
                    applications.length === 0 ? (
                        <div>Brak aplikacji</div>
                    ) : (
                        applications && applications.map((app, index) => (
                            <Link
                                key={index}
                                className={"bg-slate-50 p-5 rounded-lg text-[11px] w-full flex flex-col gap-3"}
                                href={`/dashboard/moveinapplications/${app.id}`}
                            >
                                <div>{formatDate(app.createdAt, "relative")}</div>
                                <div className={"flex justify-between items-center"}>
                                    <div>Landlord status:</div>
                                    <StatusLabel status={app.landlordStatus} />
                                </div>
                                <div className={"flex justify-between items-center"}>
                                    <div>Rentier status:</div>
                                    <StatusLabel status={app.rentierStatus} />
                                </div>
                                <p className={"truncate"}>{app.rentierId}</p>
                                <p className={"truncate"}>Rental offer: {app.rentalOffer}</p>
                            </Link>
                        ))
                    )
                }
            </div>

        </div>
    )
}