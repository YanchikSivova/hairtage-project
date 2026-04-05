import { useAuth } from "./useAuth";
import { useState, useEffect } from "react";
import { getResults, postSurvey, getResultsByHairtype } from "../api/hairtageApi";
export const useResults = (mode, hairTypeId) => {
    const { user } = useAuth()  //будет true/false
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const receiveResults = async () => {
        setLoading(true)
        setError(null)
        // try {
        //     let data;
        //     const answers = localStorage.getItem("answers");

        //     //если в localStorage есть сохраненные ответы
        //     if(answers){
        //         data = postSurvey(answers);
        //         //удаляем для авторизованного
        //         if(user){
        //             localStorage.removeItem("answers");
        //         }
        //     //если нет сохраненныъ ответов
        //     }else{
        //         if(user){
        //             //для авторизованного пытаемся найти тип волос если хочет подборку из истории опросов
        //             const hairTypeId = localStorage.getItem("hairTypeId");
        //             //если из истории опросов, то получаем подборку, удаляем из localStorage
        //             if(hairTypeId){
        //                 data = getResultsByHairtype(hairTypeId);
        //                 localStorage.removeItem("hairTypeId");
        //             //если не из истории, то получаем последний пройденный опрос
        //             }else{
        //                 data = getResults();
        //             }
        //         }else{
        //             throw new Error("Нет сохраненных ответов");
        //         }
        //     }
        //     const resultsArray = response?.data || response || [];
        //     setResults(resultsArray);
        // } catch (err) {
        //     setError(err?.response?.data?.message || "Ошибка получения результатов");
        //     setResults([]);
        // } finally {
        //     setLoading(false);
        // }
        try{
            let data
            if (mode === 'survey'){
                const answers = JSON.parse(localStorage.getItem('answers'));
                data = await postSurvey(answers);
                localStorage.removeItem('answers');
            }else if(mode === 'history'){
                data = await getResultsByHairtype(hairTypeId);
            }else{
                data = await getResults()
            }
            setResults(data || []);
        }catch(err){
            setError(err?.response?.data?.message || "Ошибка получения результатов");
            setResults([]);
        }finally{
            setLoading(false);
        }
    };
    useEffect(() => {
        receiveResults();
    }, [user,mode]);

    const shampoos = results.filter(p => p.category === "Шампунь");
    const conditioners = results.filter(p => p.category === "Кондиционер");
    const masks = results.filter(p => p.category === "Маска")
    
    return {results, shampoos, conditioners, masks, error, loading };
}

