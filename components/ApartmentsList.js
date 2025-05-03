import Button from "@/components/Button";
import Link from "next/link";
import Image from "next/image";

export default function ApartmentsList({apartments}) {
    return (

            <div className="flex-grow p-6 grid grid-cols-3 gap-6">
                {apartments.map((item, index) => (
                    <div key={index} className="flex flex-col">
                        <div className="relative h-[13dvw] bg-gray-200 mb-4 rounded-lg">
                            <Image src={item.images[0]} alt={"asd"} fill className="rounded-lg object-cover"/>

                        </div>

                        <div className="flex flex-col gap-2">
                            <Link
                                href={`/apartments/${item.slug}`}
                                className="text-lg font-semibold text-black hover:underline">{item.header}</Link>
                            <p className="text-sm text-gray-500">{item.address}</p>

                            <div className="flex flex-wrap gap-1 text-xs text-gray-500">
                                {item.filter.amenities.map((amenity, idx) => (
                                    <span key={idx}>{amenity},</span>
                                ))}
                            </div>

                            <div className="p-4 bg-white rounded-lg flex flex-col gap-2 shadow-sm">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-sm">
                                      {item.landlord.name}
                                    </span>
                                    <span className="text-sm font-medium text-gray-700">
                                      {Intl.NumberFormat("pl-PL").format(item.price)} zł / miesiąc
                                    </span>
                                </div>
                                <div className="flex gap-2 justify-between mt-2">
                                    <Button
                                        type="link"
                                        style="white"
                                        title="Skontaktuj się"
                                        onClick={`/apartments/${item.slug}`}
                                    />
                                    <Button
                                        type="link"
                                        style="primary"
                                        title="Zobacz więcej"
                                        onClick={`/apartments/${item.slug}`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

    );
}