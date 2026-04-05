import React, { useState } from "react";
import { useResults } from "../hooks/useResults";
import { useEffect } from "react";
import '../styles/pages/results.css'
import { useLocation } from "react-router-dom";
function Results() {
    const location = useLocation();
    const {mode, hairTypeId} = location.state || {mode: 'last'};
    const {
        results,
        shampoos,
        masks,
        conditioners,
        error,
        loading
    } = useResults(mode, hairTypeId);

    useEffect(() => { document.body.classList.add('with-pic'); return () => { document.body.classList.remove('with-pic'); }; }, []);

    // const [visibleCounts, setVisibleCounts] = useState({
    //     shampoos: 5,
    //     masks: 5,
    //     conditioners: 5
    // });

    // const loadMore = (category) => {
    //     setVisibleCounts(prev => ({
    //         ...prev,
    //         [category]: prev[category] + 5
    //     }));
    // };

    const renderProductGrid = (products, categoryTitle) => {
        if (!products || products.length === 0) {
            return (
                <div className="categoryContainer">
                    <p className="category-title">{categoryTitle}</p>
                    <p>Нет продуктов в этой категории</p>
                </div>
            )
        }
        return (
            <div className="categoryContainer">
                <p className="category-title">{categoryTitle}</p>
                <div className="products-grid">
                    {products.map(product => (
                        <div key={product.id || product.name} className="product-card">
                            <img
                                src={`assets/images/${product.pic_url}`}
                                alt={product.name}
                            />
                            <div className="product-info">
                                <p>{product.name}</p>
                                <div className="price">
                                    Ценовой сегмент: {product.price_category}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <main className="results">
                <h1 className="results-title">Ваша персональная подборка</h1>
                <div className="categoryContainer">
                    <p>Загрузка...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="results">
                <h1 className="results-title">Ваша персональная подборка</h1>
                <div className="categoryContainer">
                    <p>Ошибка: {error}</p>
                </div>
            </main>
        )
    }

    return (
        <main className="results">
            <h1 className="results-title">Ваша персональная подборка</h1>
            {results.length === 0 && (
                <div className="categoryContainer">
                    <p>Не удалось получить результаты опроса</p>
                </div>
            )}
            {shampoos && shampoos.length > 0 && renderProductGrid(shampoos, "Шампуни")}
            {masks && masks.length > 0 && renderProductGrid(masks, "Маски")}
            {conditioners && conditioners.length > 0 && renderProductGrid(conditioners, "<Бальзамы и кондиционеры")}
        </main>
    );
}
export default Results;