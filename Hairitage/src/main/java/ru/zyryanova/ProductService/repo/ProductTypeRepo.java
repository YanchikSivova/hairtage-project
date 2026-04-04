package ru.zyryanova.ProductService.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.zyryanova.ProductService.entity.bd.ProductType;

public interface ProductTypeRepo extends JpaRepository<ProductType, Integer> {
    ProductType findByProductTypeName(String productTypeName);
}
