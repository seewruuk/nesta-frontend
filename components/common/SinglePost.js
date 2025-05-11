import Image from "next/image";
import Button from "@/components/Button";
import formatDate from "@/lib/formatDate";
import Link from "next/link";

export default function SinglePosts({post}, key) {
    return (
        <div
            key={key}
            className={"bg-white p-[42px] rounded-[24px] flex flex-col gap-[16px]"}
        >
            <div>

                {/*Profile*/}
                <div className="flex items-center gap-[15px]">
                    <div className={"flex gap-2 items-center flex-grow"}>
                        <Link
                            href={`/users/k.sewruk`}
                            className={"aspect-square h-[80px] rounded-full border-6 border-primary relative hover:border-background transition-all"}>
                            <Image
                                src={"https://images.steamusercontent.com/ugc/18082018243785591829/B7C0C2561C9D52EC68ABF639FFCA65B30B7D13A1/"}
                                alt="Profile Picture" fill className="object-cover rounded-full"/>
                        </Link>
                        <div>
                            <Link className={"text-[14px] text-black font-semibold hover:underline"} href={"/users/seewruuk"}>Kacper Sewruk</Link>
                            <p className={"text-[13px] text-gray"}>{formatDate(post.date)}</p>
                        </div>
                    </div>

                    <button
                        className={"bg-background aspect-square h-[50px] rounded-lg hover:bg-primary text-black hover:text-white transition-all hover:cursor-pointer"}
                    >
                        o
                    </button>
                </div>
            </div>

            {/*Location & Title*/}
            <div className={"flex flex-col items-start gap-2"}>
                <div className={"text-[#8FD200] bg-[#F5FFDF] text-[11px] rounded-full px-[17px] py-[6px]"}>
                    {post.location}
                </div>
                <h3 className={"text-black text-[21px] font-semibold"}>{post.title}</h3>
            </div>

            {/*Message*/}
            <div className={"p-[20px] bg-background rounded-2xl text-black leading-7 text-[14px]"}>
                {post.description}
            </div>

            {/*Attachments*/}
            {/*<div>*/}
            {/*    <span>asd</span>*/}
            {/*</div>*/}

            {/*Actions*/}
            <Button
                style={"primary"}
                title={"Napisz wiadomość"}
                type={"button"}
                onClick={() => console.log("click")}

            />
        </div>
    )
}