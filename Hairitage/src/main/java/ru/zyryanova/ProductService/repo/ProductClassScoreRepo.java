package ru.zyryanova.ProductService.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.zyryanova.ProductService.entity.ProductClassScore;

import java.util.List;

public interface ProductClassScoreRepo extends JpaRepository<ProductClassScore, Integer> {
    List<ProductClassScore> findByProduct_ProductId(Integer productId);
    void deleteByProduct_ProductId(Integer productId);
}