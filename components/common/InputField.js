export default function InputField({type, placeholder, value, onChange, customStyle, inputFiledType = "input", selectOptions = []}) {

    switch (inputFiledType) {
        case "input":
            return (
                <input
                    autoComplete="off"
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={`${customStyle} py-[10px] px-[12px] text-[#494949] text-[14px] bg-[#F5F5F5] rounded-lg w-full`}
                />
            )
        case "textarea":
            return (
                <textarea
                    autoComplete="off"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={`${customStyle} py-[10px] px-[12px] text-[#494949] text-[14px] bg-[#F5F5F5] rounded-lg w-full`}
                />
            )
        case "select":
            return (
                <select
                    value={value}
                    onChange={onChange}
                    className={`${customStyle} py-[10px] px-[12px] text-[#494949] text-[14px] bg-[#F5F5F5] rounded-lg w-full`}
                >
                    {selectOptions.map((option, index) => (
                        <option key={index} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            )

        case "date":
            return (
                <input
                    autoComplete="off"
                    type="date"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={`${customStyle} py-[10px] px-[12px] text-[#494949] text-[14px] bg-[#F5F5F5] rounded-lg w-full`}
                />
            )

        default:
            return (
                <input
                    autoComplete="off"
                    type={inputFiledType}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={`${customStyle} py-[10px] px-[12px] text-[#494949] text-[14px] bg-[#F5F5F5] rounded-lg w-full`}
                />
            )
    }
}