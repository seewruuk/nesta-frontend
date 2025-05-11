import Image from "next/image";
import Link from "next/link";

export default function ApartmentCardSmall({apartment}, key) {
    return (
        <div className={"flex gap-4 items-center"} key={key}>
            <Link href={`/apartments/${apartment.slug}`} className={"relative h-[140px] w-[220px] rounded-2xl overflow-hidden"}>
                <Image alt={`Thumbnail for ${apartment.header}`} src={apartment.images[0]} fill className="object-cover"/>
            </Link>
            <div className={"flex flex-col gap-2"}>
                <Link href={`/apartments/${apartment.slug}`} className={"text-[16px] font-semibold text-black hover:underline"}>{apartment.header}</Link>
                <p className={"text-[14px] text-gray"}>{apartment.address}</p>
                <p className={"text-[14px] font-semibold text-black"}>{apartment.price} PLN / miesiąc</p>
            </div>
        </div>
    )
}