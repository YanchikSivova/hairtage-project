import { useAuth } from "./useAuth";
import { useState, useEffect } from "react";
import { getResults, postResults } from "../api/hairtageApi";
export const useResults = () => {
    const { user } = useAuth()
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const receiveResults = async () => {
        setLoading(true)
        setError(null)
        try {
            let data;
            if (user) {
                data = await getResults();
            } else {
                const answers = localStorage.getItem("answers")
                if (!answers) {
                    throw new Error("Нет сохраненных ответов");
                }
                data = await postResults(answers);
            }
            setResults(data || []);
        } catch (err) {
            setError(err?.response?.data?.message || "Ошибка получения результатов");
            setResults([]);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        receiveResults();
    }, [user]);

    const shampoos = results.filter((p) => p.category === "Шампунь");
    const conditioners = results.filter((p) => p.category === "Кондиционер");
    const masks = results.filter((p) => p.category === "Маска")
    
    return {results, shampoos, conditioners, masks, error, loading };
}

