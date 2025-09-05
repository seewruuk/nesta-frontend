export default function displayAvatar({avatarUrl, type}) {

    switch (type) {
        case "s":
            return (<div className="relative h-[28px] aspect-square rounded-full bg-primary"/>)
        case "m":
            return (<div className="relative h-[40px] aspect-square rounded-full bg-primary"/>)
        default:
            return (<div className="relative h-[60px] aspect-square rounded-full bg-primary"/>)
    }
}