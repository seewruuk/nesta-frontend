export default function generateTransactionLabel(name) {

    const defaultStyle = 'px-[15px] py-[11px] rounded-md text-[11px]';


    switch (name) {
        case "paid":
            return <div className={`${defaultStyle} bg-[#DFF2B6] text-[#74AA01]`}>Zaksięgowano</div>
        case "waiting":
            return <div className={`${defaultStyle} bg-[#E9E9E9] text-[#909090]`}>Oczekuje na płatność</div>
        case "in-progress":
            return <div className={`${defaultStyle} bg-[#FFEDD4] text-[#DD9C40]`}>W trakcie</div>
        default:
            return <div className={`${defaultStyle} bg-black text-white`}>Brak</div>

    }
}