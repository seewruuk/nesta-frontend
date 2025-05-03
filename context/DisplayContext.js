"use client"
import {createContext, useEffect, useState} from "react";

export const DisplayContext = createContext({});


export default function DisplayContextProvider({children}) {

    const [windowDimensions, setWindowDimensions] = useState({width: 0, height: 0});
    useEffect(() => {
        function getWindowDimensions() {
            const {innerWidth: width, innerHeight: height} = window;
            return {width, height};
        }

        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        if (typeof window !== "undefined") {
            setWindowDimensions(getWindowDimensions());
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }
    }, []);


    const {width} = windowDimensions;
    const isMobile = width <= 1024;
    const [displayVersion, setDisplayVersion] = useState(isMobile ? "mobile" : "desktop");

    useEffect(() => {
        setDisplayVersion(isMobile ? "mobile" : "desktop");
    }, [isMobile]);


    return (
        <DisplayContext.Provider value={{
            displayVersion,
        }}>
            {children}
        </DisplayContext.Provider>
    );
}