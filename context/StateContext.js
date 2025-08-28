"use client"


import {createContext, useState} from "react";
import {icons} from "@/src/icons";

export const StateContext = createContext({});


export default function StateContextProvider({children}) {

    const [links, setLinks] = useState([
        {name: "Dashboard", href: "/dashboard", icon: icons.dashboard},
        {name: "Mieszkania", href: "/dashboard/apartments", icon: icons.apartments},
        {name: "Oferty", href: "/dashboard/rental-offers", icon: icons.rentaloffers},
        {name: "Faktury", href: "/dashboard/invoices", icon: icons.transactions},
        {name: "Wiadomości", href: "/dashboard/messages", icon: icons.messages},
        {name: "Aplikacje", href: "/dashboard/moveinapplications", icon: icons.reviews},
    ])
    const [transactions, setTransactions] = useState([
        {id: "#12548796", label: "Czynsz za mieszkanie", status: "paid", date: "23-01-2025", value: 3500},
        {id: "#12548796", label: "Rachunek za prąd", status: "waiting", date: "10-02-2025", value: 250},
        {id: "#12548796", label: "Naprawa drzwi balkonowych", status: "paid", date: "05-02-2025", value: 400},
        {id: "#12548796", label: "Rachunek za internet", status: "in-progress", date: "05-02-2025", value: 10},
    ])
    const [messages, setMessages] = useState([
        {
            id: "i15n123ior5",
            from: "Kacper Sewruk",
            messages: [
                {
                    origin: "tenant",
                    text: "Cześć, czy mógłbyś mi powiedzieć, kiedy przyjedziesz do naprawy drzwi balkonowych?",
                    date: "2025-01-23T08:15:00Z",
                    isRead: false
                },
                {
                    origin: "owner",
                    text: "Cześć Kacprze, mogę w sobotę 25.01 o 10:00. Pasuje?",
                    date: "2025-01-23T09:00:00Z",
                    isRead: true
                },
                {
                    origin: "tenant",
                    text: "Pasuje, dziękuję! Czy potrzebujesz czegoś, żebym przygotował?",
                    date: "2025-01-23T09:05:00Z",
                    isRead: false
                },
                {
                    origin: "owner",
                    text: "Wystarczy dostęp do balkonu i skrzynka z podstawowymi narzędziami. Do zobaczenia!",
                    date: "2025-01-23T09:20:00Z",
                    isRead: true
                },
                {
                    origin: "tenant",
                    text: "Wszystko będzie gotowe 🙂",
                    date: "2025-01-23T09:25:00Z",
                    isRead: false
                },
                {
                    origin: "owner",
                    text: "Super, do zobaczenia w sobotę.",
                    date: "2025-01-23T09:30:00Z",
                    isRead: true
                }
            ]
        },
        {
            id: "i15n123ior6",
            from: "Joanna Kowalska",
            messages: [
                {
                    origin: "tenant",
                    text: "Dzień dobry, czy dasz radę naprawić okno w salonie w ten piątek?",
                    date: "2025-01-22T14:10:00Z",
                    isRead: false
                },
                {
                    origin: "owner",
                    text: "Cześć Joanno, piątek 24.01 mogę być około 15:00. Pasuje?",
                    date: "2025-01-22T14:45:00Z",
                    isRead: true
                },
                {
                    origin: "tenant",
                    text: "Tak, świetnie. Ile to będzie kosztować?",
                    date: "2025-01-22T14:50:00Z",
                    isRead: false
                },
                {
                    origin: "owner",
                    text: "Szacunkowo około 200 PLN, ostateczna cena po diagnozie.",
                    date: "2025-01-22T15:10:00Z",
                    isRead: true
                },
                {
                    origin: "tenant",
                    text: "Ok, dziękuję. Do zobaczenia w piątek.",
                    date: "2025-01-22T15:15:00Z",
                    isRead: false
                },
                {
                    origin: "owner",
                    text: "Do zobaczenia, będę miał przy sobie nowe uszczelki.",
                    date: "2025-01-22T15:20:00Z",
                    isRead: true
                },
                {
                    origin: "tenant",
                    text: "Dziękuję, wszystko działa perfekcyjnie po naprawie!",
                    date: "2025-01-24T16:30:00Z",
                    isRead: false
                },
                {
                    origin: "owner",
                    text: "Cieszę się, daj znać, jeśli coś jeszcze będzie do zrobienia.",
                    date: "2025-01-24T16:45:00Z",
                    isRead: true
                }
            ]
        }
    ])

    return (
        <StateContext.Provider value={{
            links,
            transactions,
            messages,

            setLinks,
            setTransactions,
            setMessages
        }}>
            {children}
        </StateContext.Provider>
    );
}