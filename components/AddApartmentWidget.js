"use client";
import Button from "@/components/Button";
import {useContext} from "react";
import {AuthContext} from "@/context/AuthContext";

const PRESETS = {
    apartment: {
        bgClass: "bg-primary",
        title: "Dodaj mieszkanie!",
        description: "Aby rozpocząć dodawanie oferty, dodaj na początku samo mieszkanie.",
        ctaTitle: "Dodaj mieszkanie",
        href: "/dashboard/apartments/add",
    }, invoice: {
        bgClass: "bg-amber-300",
        title: "Dodaj fakturę!",
        description: "Aby rozpocząć dodawanie faktury, dodaj na początku samą fakturę.",
        ctaTitle: "Dodaj fakturę",
        href: "/dashboard/invoices/add",
    }, "rental-offer": {
        bgClass: "bg-blue-300",
        title: "Dodaj ofertę najmu!",
        description: "Aby rozpocząć dodawanie oferty najmu, dodaj na początku samą ofertę.",
        ctaTitle: "Dodaj ofertę najmu",
        href: "/dashboard/rental-offers/add",
    },
};

export default function AddApartmentWidget({
                                               type = "apartment",
                                               title,
                                               description,
                                               ctaTitle,
                                               href,
                                               bgClass,
                                               greeting = "Witaj",
                                               showGreeting = true,
                                               buttonStyle = "black",
                                               className = "",
                                           }) {
    const {username} = useContext(AuthContext);
    const preset = PRESETS[type] ?? PRESETS.apartment;

    const final = {
        bgClass: bgClass ?? preset.bgClass,
        title: title ?? preset.title,
        description: description ?? preset.description,
        ctaTitle: ctaTitle ?? preset.ctaTitle,
        href: href ?? preset.href,
    };

    return (<div
        className={`${final.bgClass} w-full py-[42px] px-[24px] rounded-[20px] ${className}`.trim()}
    >
        <div className="flex items-start flex-col gap-[12px]">


            <h1 className="text-[24px] font-bold">{final.title}</h1>

            {final.description && <p>{final.description}</p>}

            <Button
                title={final.ctaTitle}
                type="link"
                style={buttonStyle}
                onClick={final.href}
            />
        </div>
    </div>);
}
