package ru.zyryanova.ProductService.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.zyryanova.ProductService.entity.bd.Product;

import java.util.List;

@Repository
public interface ProductRepo extends JpaRepository<Product, Integer>{
    List<Product> findByProductSuitability_HairTypeId(int hairTypeId);
    Product findByProductName(String productName);

}
