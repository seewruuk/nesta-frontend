"use client";
import {useState, useEffect} from 'react';
export default function useFetch(url, accessToken = null, method = 'GET', body) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError(null);

        async function fetchData() {
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: body ? JSON.stringify({
                    accessToken: accessToken,
                    ...body
                }) : null,

            });
            const responseJson = await response.json();
            if(responseJson.status === 200){
                if (isMounted) {
                    setData(responseJson);
                    setLoading(false);
                }
            }else{
                if (isMounted) {
                    setError(responseJson.message || 'An error occurred');
                    setLoading(false);
                }
            }
        }

        fetchData()
            .catch(err => {
                if (isMounted) {
                    setError(err);
                    setLoading(false);
                }
            });
        return () => {
            isMounted = false;
        }
    }, [url]);

    return {data, loading, error};
}