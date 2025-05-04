import {AnimatePresence, motion} from "framer-motion";

export default function Loading() {
    return (
        <AnimatePresence>
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                key={"Loading"}
            >
                <div className={"fixed top-0 left-0 w-full h-full bg-white z-50 flex justify-center items-center flex-col"}>
                    <div className={"animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"}/>
                    <h2 className={"text-sm mt-10 animate-pulse"}>Loading...</h2>
                </div>

            </motion.div>
        </AnimatePresence>
    )
}