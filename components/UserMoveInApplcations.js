"use client"
import {AuthContext} from "@/context/AuthContext";
import {useContext, useState, useEffect} from "react";
import Link from "next/link";
import formatDate from "@/lib/formatDate";
import StatusLabel from "@/components/StatusLabel";

export const UserMoveInApplications = () => {

    const {accessToken, username, userId, handleLogout, userRole} = useContext(AuthContext);
    const [applications, setApplications] = useState([]);

    // notatka - endpointy trzeba poprawić na dynamiczne jak chodzi o userId oraz jego status
    const apiEndpoints = {
        LANDLORD: "/api/moveinapplications/by-landlord",
        RENTIER: "/api/moveinapplications/by-rentier",
    }

    useEffect(() => {
        const fetchApplications = async () => {
            try {
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
    }, [accessToken]);

    return (
      <>
          {
              applications && applications.length > 0 && (
                  <div className={"w-full"}>
                      <label>Aplikacje</label>
                      <div className={"flex flex-col gap-2 w-full"}>
                          {
                              applications && applications.length > 0 && applications.map((app, index) => (
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
                          }
                      </div>
                  </div>
              )
          }

      </>
    )
}