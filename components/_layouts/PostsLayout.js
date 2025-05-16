"use client"
import Image from "next/image";


import PageTransition from "@/components/PageTransition";
import Layout from "@/components/Layout";
import {useState} from "react";
import InputField from "@/components/common/InputField";
import Button from "@/components/Button";
import SinglePosts from "@/components/common/SinglePost";

export default function PostsLayout() {


    const [postData, setPostData] = useState({
        location: "",
        title: "",
        description: "",
        attachedData: false,
        attachedApartments: [],
        date: new Date(),
        linkedByUser: false,
    })

    const [locationForm, setLocationForm] = useState("")

    const [posts, setPosts] = useState([
        {
            title: "Szukam współlokatorki do już wynajmowanego mieszkania",
            description: <p>
                Hej! Szukam współlokatorki do 2-pokojowego mieszkania na Pradze Północ (okolice Ząbkowskiej). Pokój
                wolny od 1 czerwca, 1400 zł + opłaty (ok. 200 zł). Mieszkanie jest w pełni wyposażone, mamy zmywarkę,
                pralkę, szybki internet i balkon z widokiem na podwórko :) Ja — 25 lat, pracuję na etacie, raczej
                spokojna, cenię sobie czystość i wieczory z herbatą, nie z imprezami 😄
                Szukam osoby w podobnym klimacie — najlepiej dziewczyny, która szanuje wspólną przestrzeń. <br/>

                <strong>Pisz priv po więcej info i zdjęcia mieszkania!</strong>
            </p>,
            location: ["Warszawa"],
            attachedData: false,
            attachedApartments: [],
            date: "23-01-2025",
            likedByUser: false,
        },
        {
            title: "Pokój do wynajęcia — szukam współlokatora",
            description: <p>
                Cześć! Mam do wynajęcia pokój w 3-pokojowym mieszkaniu na Gdańskim Wrzeszczu. Świetna lokalizacja — 5
                min pieszo do SKM, blisko UG i Olivia Business Centre. Pokój wolny od zaraz, cena to 1200 zł + media.
                Mieszkanie w pełni umeblowane, z dużą kuchnią, osobną łazienką i toaletą. Szukam współlokatora, który
                potrafi żyć w zgodzie z innymi, nie urządza domówek co weekend i nie zostawia naczyń na wieczność 😉
                Zainteresowanych zapraszam na priv!
            </p>,
            location: ["Gdynia"],
            attachedData: false,
            attachedApartments: [],
            date: "02-05-2025",
            likedByUser: false,
        }
    ]);

    const handleAddLocation = (location) => {
        setPostData((prevState) => ({
            ...prevState,
            location: [...prevState.location, location]
        }))
    }


    return (
        <PageTransition>
            <Layout>
                <div className={"pt-[120px]"}/>
                <section className={"bg-white p-[42px] rounded-[24px]"}>

                    {/*User Profile info*/}
                    <div className={"flex gap-4 items-center"}>
                        <div className={"aspect-square h-[100px] rounded-full border-6 border-primary relative"}>
                            {/*<Image*/}
                            {/*    src={"https://images.steamusercontent.com/ugc/18082018243785591829/B7C0C2561C9D52EC68ABF639FFCA65B30B7D13A1/"}*/}
                            {/*    alt="Profile Picture" fill className="object-cover rounded-full"/>*/}
                        </div>
                        <div>
                            <h3 className={"text-[21px] text-black"}>Cześć, Kacper</h3>
                            <p className={"text-[13px] text-gray"}>Szukasz współlokatora? Dodaj ogłoszenie!</p>
                        </div>
                    </div>

                    <div className={"flex flex-col gap-[16px] mt-[16px]"}>
                        {/*<div*/}
                        {/*    className={"flex bg-background text-[14px] text-[#494949] rounded-lg py-[10px] px-[12px] gap-4 mt-[20px]"}>*/}
                        {/*<button*/}
                        {/*    onClick={() => setPostData((prevState) => ({*/}
                        {/*        ...prevState,*/}
                        {/*        location: [...prevState.location, locationForm]*/}
                        {/*    }))}*/}
                        {/*    className={"bg-primary text-black text-[11px] rounded-md font-semibold px-[12px] py-[4px] hover:bg-black hover:cursor-pointer hover:text-white transition-all"}>Dodaj*/}
                        {/*    miasto*/}
                        {/*</button>*/}

                        {/*<input*/}
                        {/*    className={"flex-grow outline-none"}*/}
                        {/*    type={"text"}*/}
                        {/*    placeholder={"Miasto"}*/}
                        {/*    value={locationForm}*/}
                        {/*    onChange={(e) => setLocationForm(e.target.value)}*/}
                        {/*/>*/}
                        {/*</div>*/}

                        <InputField
                            type={"text"}
                            placeholder={"Miasto"}
                            value={postData.location}
                            onChange={(e) => setPostData({...postData, location: e.target.value})}
                        />

                        {/*{*/}
                        {/*    postData.location && postData.location.length > 0 && (*/}
                        {/*        <div className={"flex gap-2"}>*/}
                        {/*            {*/}
                        {/*                postData.location.map((location, index) => (*/}
                        {/*                    <div key={index}*/}
                        {/*                         className={"flex gap-2 items-start"}>*/}
                        {/*                        <button*/}
                        {/*                            onClick={() => setPostData((prevState) => ({*/}
                        {/*                                ...prevState,*/}
                        {/*                                location: prevState.location.filter((_, i) => i !== index)*/}
                        {/*                            }))}*/}
                        {/*                            className={"bg-primary/20 text-[12px] px-[12px] py-[4px] rounded-md text-primary font-semibold hover:bg-red-500 hover:cursor-pointer hover:text-white transition-all"}>*/}
                        {/*                            {location}*/}
                        {/*                        </button>*/}
                        {/*                    </div>*/}
                        {/*                ))*/}
                        {/*            }*/}
                        {/*        </div>*/}
                        {/*    )*/}
                        {/*}*/}
                        <InputField
                            type={"text"}
                            placeholder={"Nagłówek ogłoszenia"}
                            value={postData.title}
                            onChange={(e) => setPostData({...postData, title: e.target.value})}
                        />
                        <textarea
                            className={"bg-background min-h-[200px] py-[10px] px-[12px] text-[#494949] text-[14px] rounded-lg w-full outline-none resize-none"}
                            placeholder={"Wiadomość..."}
                            value={postData.description}
                            onChange={(e) => setPostData({...postData, description: e.target.value})}
                        />

                        <div>
                            <input type={"checkbox"} id={"attachedData"} className={""}/>
                            <label htmlFor={"attachedData"}>Czy post dotyczy <strong>konkretnego
                                mieszkania?</strong></label>
                        </div>

                        <Button
                            type={"button"}
                            title={"Dodaj ogłoszenie"}
                            onClick={
                                () => {
                                    setPosts((prevState) => [...prevState, postData])
                                    setPostData({
                                        location: "",
                                        title: "",
                                        description: "",
                                        attachedData: false,
                                        attachedApartments: [],
                                    })
                                }
                            }
                            style={"primary"}
                        />
                    </div>
                </section>

                <section className={"pt-[37px] flex flex-col gap-[37px] pb-[100px]"}>
                    <hr className={"border-gray/40 border-dashed "}/>

                    {/*Filters*/}
                    <div className={"flex justify-between"}>
                        <div className={"flex gap-2"}>
                            <div className={"flex flex-col gap-2"}>
                                <label className={"text-[11px] text-gray"}>Lokalizacja</label>
                                <select
                                    className={"py-[10px] px-[12px] text-[#494949] text-[14px] bg-white min-w-[210px] rounded-lg w-full"}>
                                    <option>Cała Polska</option>
                                </select>
                            </div>
                            <div className={"flex flex-col gap-2"}>
                                <label className={"text-[11px] text-gray"}>Typ wpisów</label>
                                <select
                                    className={"py-[10px] px-[12px] text-[#494949] text-[14px] bg-white min-w-[210px] rounded-lg w-full"}>
                                    <option>Wszystkie wpisy</option>
                                </select>
                            </div>
                        </div>
                        <div className={"flex flex-col gap-2"}>
                            <label className={"text-[11px] text-gray"}>Sortowanie</label>
                            <select
                                className={"py-[10px] px-[12px] text-[#494949] text-[14px] bg-white min-w-[210px] rounded-lg w-full"}>
                                <option>Od najnowszych</option>
                            </select>
                        </div>
                    </div>

                    {/*Posts*/}
                    <div className={"flex flex-col gap-[37px]"}>
                        {
                            posts.map((post, index) => (
                                <SinglePosts key={index} post={post}/>
                            ))
                        }
                    </div>


                </section>


            </Layout>
        </PageTransition>
    )
}