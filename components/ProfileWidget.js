"use client"
import displayAvatar from "@/lib/displayAvatar";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { UserMoveInApplications } from "@/components/UserMoveInApplcations";

export default function ProfileWidget() {
    const [isMounted, setIsMounted] = useState(false);
    const { username, userRoles, userId } = useContext(AuthContext);

    // Ustawiamy, że jesteśmy po stronie klienta
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Dopóki nie jesteśmy na kliencie lub nie mamy danych, nic nie renderujemy
    if (!isMounted || !username) return null;

    return (
        <div className="w-1/6 px-[48px] py-[32px] bg-white flex flex-col justify-between">
            <div className="flex-grow flex flex-col justify-start items-start gap-[52px]">
                <div className="text-[16px] font-semibold pb-[32px] uppercase">Twój profil</div>
                <div className="flex flex-col items-center w-full">
                    <div className="relative aspect-square h-[120px] border-white border-[7px]">
                        <Image
                            src={"https://images.pexels.com/photos/4775198/pexels-photo-4775198.jpeg"}
                            alt={"avatar"}
                            layout="fill"
                            className="object-cover rounded-full"
                        />
                        <div className="absolute rounded-full border-4 border-white bottom-0 right-0 h-[32px] aspect-square bg-primary" />
                    </div>
                    <div className="text-[15px] text-center flex flex-col items-center gap-1">
                        <div className="flex gap-2 flex-col">
                            <label className="text-[14px] font-semibold">@{username}</label>
                            <label className="text-[11px]">{userId}</label>
                        </div>
                        <div className="text-gray text-[11px] font-semibold">{userRoles[2]}</div>
                        <div className="font-semibold">
                            <span className="bg-gray-200 text-gray-500 px-2 py-1 rounded-md">4.25</span> / 5.00
                        </div>
                    </div>
                </div>
                <UserMoveInApplications />
            </div>
            <div className="flex flex-col gap-[8px] items-start">
                <button className="text-[14px] text-gray-500 hover:text-black transition-all">Nesta 2025</button>
            </div>
        </div>
    );
}
