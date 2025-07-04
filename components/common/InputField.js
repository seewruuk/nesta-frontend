export default function InputField({type, placeholder, value, onChange, customStyle}) {

    return (
        <input
            autoComplete="off"
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`${customStyle} py-[10px] px-[12px] text-[#494949] text-[14px] bg-[#F5F5F5] rounded-lg w-full`}
        />
    );
}