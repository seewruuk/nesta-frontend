import Image from "next/image";

export const RenderIcon = ({icon, className = "", randomAlt = Math.random()}) => {
    return (<div className={"relative aspect-square " + className}>
            <Image src={icon} alt={randomAlt} layout="fill" className="object-contain"/>
        </div>)
}