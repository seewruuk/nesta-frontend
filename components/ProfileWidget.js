"use client"
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { UserMoveInApplications } from "@/components/UserMoveInApplcations";

/** Prosty, wspólny skeleton */
function Skeleton({ className = "" }) {
    return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}
function SkeletonText({ className = "" }) {
    return <Skeleton className={`h-4 ${className}`} />;
}
SkeletonText.displayName = "Skeleton.Text";
Skeleton.Text = SkeletonText;

function SkeletonCircle({ className = "" }) {
    return <Skeleton className={`rounded-full ${className}`} />;
}
SkeletonCircle.displayName = "Skeleton.Circle";
Skeleton.Circle = SkeletonCircle;

export default function ProfileWidget() {
    const [isClient, setIsClient] = useState(false);
    const { username, userRoles = [], userId, userRole } = useContext(AuthContext);

    useEffect(() => { setIsClient(true); }, []);

    const LoadingContent = () => (
        <>
            <div className="flex-grow flex flex-col justify-start items-start gap-[52px] w-full">
                <div className="text-[16px] font-semibold pb-[32px] uppercase">Twój profil</div>

                <div className="flex flex-col items-center w-full">
                    <div className="relative h-[120px] aspect-square">
                        <Skeleton.Circle className="w-full h-full" />
                    </div>
                    <div className="text-[15px] text-center flex flex-col items-center gap-2 mt-3 w-full">
                        <Skeleton.Text className="w-3/4" />
                        <Skeleton.Text className="w-1/2" />
                        <Skeleton.Text className="w-1/3" />
                    </div>
                </div>

                {/* Placeholder listy aplikacji */}
                <div className="w-full flex flex-col gap-2">
                    <Skeleton.Text className="w-24" />
                    <div className="flex flex-col gap-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="h-[84px] w-full" />
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-[8px] items-start">
                <Skeleton.Text className="w-24" />
            </div>
        </>
    );

    if (!isClient || !username) {
        // Ten sam układ co wersja finalna – brak skoków layoutu
        return <LoadingContent />;
    }

    return (
        <>
            <div className="flex-grow flex flex-col justify-start items-start gap-[52px] w-full">
                <div className="text-[16px] font-semibold pb-[32px] uppercase">Twój profil</div>

                <div className="flex flex-col items-center w-full">
                    <div className="relative aspect-square h-[120px] border-white border-[7px]">
                        <Image
                            src={"https://images.pexels.com/photos/4775198/pexels-photo-4775198.jpeg"}
                            alt={"avatar"}
                            fill
                            className="object-cover rounded-full"
                        />
                        <div className="absolute rounded-full border-4 border-white bottom-0 right-0 h-[32px] aspect-square bg-primary" />
                    </div>

                    <div className="text-[15px] text-center flex flex-col items-center gap-1">
                        <div className="flex gap-2 flex-col">
                            <label className="text-[14px] font-semibold">@{username}</label>
                            <label className="text-gray-600 text-[15px] font-mono">{userId}</label>
                        </div>
                        <div className="text-gray text-[11px] font-semibold">{userRole}</div>
                    </div>
                </div>

                {/* Lista aplikacji (wewnątrz ma własny skeleton) */}
                <UserMoveInApplications />
            </div>

            <div className="flex flex-col gap-[8px] items-start">
                <button className="text-[14px] text-gray-500 hover:text-black transition-all">Nesta 2025</button>
            </div>
        </>
    );
}
