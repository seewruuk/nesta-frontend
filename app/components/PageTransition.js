import {AnimatePresence, motion} from "framer-motion";

export default function PageTransition({children}) {
    return (
        <AnimatePresence>
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                key={"home"}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    )
}