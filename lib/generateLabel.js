export default function generateLabel(name) {

    const defaultStyle = 'px-[15px] py-[11px] rounded-md text-[11px]';


    switch (name) {
        case "available":
            return <div className={`${defaultStyle} bg-[#DFF2B6] text-[#74AA01]`}>Dostępny</div>
        case "notAvailable":
            return <div className={`${defaultStyle} bg-[#F8D7DA] text-[#842029]`}>Niedostępny</div>
        case "sold":
            return <div className={`${defaultStyle} bg-[#D1E7DD] text-[#0F5132]`}>Sprzedany</div>
        case "reserved":
            return <div className={`${defaultStyle} bg-[#FFF3CD] text-[#664d03]`}>Zarezerwowany</div>
        case "liked":
            return <div className={`${defaultStyle} bg-[#D1E7DD] text-[#0F5132]`}>Polubiony</div>
        default:
            return <div className={`${defaultStyle} bg-[#D1E7DD] text-[#0F5132]`}>Brak</div>

    }
}