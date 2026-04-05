package ru.zyryanova.ProductService.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.zyryanova.ProductService.entity.bd.Ingredient;

public interface IngredientRepo extends JpaRepository<Ingredient, Integer> {
    Ingredient findByIngredientName(String name);
}
