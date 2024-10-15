import { useState, useEffect } from 'react';

const useFetch = (url) => {
    const [data, setData] = useState(null);  // Initially null to handle no data
    const [loading, setLoading] = useState(true); // Start with loading true
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(url);
            if (!response.ok) {  // Check if the response is successful
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            const json = await response.json();
            setData(json?.result);
        } catch (err) {
            setError(err.message); // Capture the error message
        } finally {
            setLoading(false); // Always set loading to false
        }
    };

    useEffect(() => {
        fetchData();  // Fetch data on mount
    }, [url]);  // Dependency on `url`, to ensure re-fetching only when the URL changes

    const refetch = () => {
        setLoading(true);  // Set loading true before re-fetch
        fetchData();       // Manually trigger fetch
    };

    return { data, loading, error, refetch };  // Return the data, loading, error, and refetch
}

export default useFetch;
