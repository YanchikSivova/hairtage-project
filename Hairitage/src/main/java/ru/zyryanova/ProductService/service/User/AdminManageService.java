package ru.zyryanova.ProductService.service.User;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.zyryanova.ProductService.entity.bd.ProductType;
import ru.zyryanova.ProductService.entity.dto.ProductDto;
import ru.zyryanova.ProductService.entity.bd.Product;
import ru.zyryanova.ProductService.finder.Finder;
import ru.zyryanova.ProductService.repo.ProductRepo;
import ru.zyryanova.ProductService.repo.ProductTypeRepo;
import ru.zyryanova.ProductService.service.Product.AnalyzeService;
import ru.zyryanova.ProductService.service.Product.ProductService;

import java.util.Objects;

@Service
public class AdminManageService {
    private final ProductRepo productRepo;
    private final ProductTypeRepo productTypeRepo;
    private final AnalyzeService analyzeService;
    private final Finder finder;

    public AdminManageService(ProductRepo productRepo, ProductTypeRepo productTypeRepo, AnalyzeService analyzeService, Finder finder) {
        this.productRepo = productRepo;
        this.productTypeRepo = productTypeRepo;
        this.analyzeService = analyzeService;
        this.finder = finder;
    }

    @Transactional
    public void deleteProduct(int id){
        Product product = finder.findProductOrThrow(id);
        productRepo.delete(product);
    }

    @Transactional
    public void updateProduct(ProductDto updateProduct, Integer id) {
        Product product = finder.findProductOrThrow(id);

        boolean ingredientsChanged = !Objects.equals(
                product.getIngredientsList(),
                updateProduct.getIngredients()
        );

        product.setProductName(updateProduct.getProductName());
        product.setPicUrl(updateProduct.getPicUrl());
        product.setPrice(updateProduct.getPrice());

        ProductType productType = productTypeRepo.findByProductTypeName(updateProduct.getProductTypeName());
        if (productType == null) {
            throw new IllegalStateException("Тип продукта не найден");
        }
        product.setProductType(productType);

        product.setIngredientsList(updateProduct.getIngredients());

        if (ingredientsChanged) {
            analyzeService.defineHairType(product.getProductId());
        }
    }

    @Transactional
    public void addRole(String email){
        finder.findPersonOrThrow(email).setRole(ru.zyryanova.ProductService.enums.Role.ADMIN);
    }
}