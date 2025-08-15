import Button from "@/components/Button";

export default function AddApartmentWidget() {
    return(
        <div className="bg-primary w-full py-[42px] px-[24px] rounded-[20px]">
            <div className="flex items-start flex-col gap-[12px]">
                <span>Witaj, Kacper!</span>
                <h1 className={"text-[24px] font-bold"}>Dodaj mieszkanie!</h1>
                <p>
                    Aby rozpocząć dodawanie oferty, dodaj na początku samoe mieszkanie.
                </p>
                <Button
                    title={"Dodaj mieszkanie"}
                    type={"link"}
                    style={"black"}
                    onClick={"/dashboard/apartments/add"}

                />
            </div>
        </div>
    )
}