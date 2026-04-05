package ru.zyryanova.ProductService.service.Product;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.zyryanova.ProductService.entity.bd.Product;
import ru.zyryanova.ProductService.entity.bd.ProductType;
import ru.zyryanova.ProductService.entity.dto.ProductDto;
import ru.zyryanova.ProductService.repo.ProductRepo;
import ru.zyryanova.ProductService.repo.ProductTypeRepo;

import java.util.List;

@Service
public class ProductService {
    private final ProductRepo productRepo;
    private final ProductTypeRepo productTypeRepo;

    public ProductService(ProductRepo productRepo, ProductTypeRepo productTypeRepo) {
        this.productRepo = productRepo;
        this.productTypeRepo = productTypeRepo;
    }
    public List<Product> showAllProducts(){
        return productRepo.findAll();
    }
    @Transactional
    public Product createProduct(ProductDto productDto) {
        return productRepo.save(convertToProduct(productDto));
    }



    public Product convertToProduct(ProductDto productDto){
        Product product = new Product();
        product.setProductName(productDto.getProductName());

        ProductType productType = productTypeRepo.findByProductTypeName(productDto.getProductTypeName());
        if (productType == null) {
            throw new IllegalStateException("Тип продукта не найден");
        }

        product.setProductType(productType);
        product.setIngredientsList(productDto.getIngredients());
        product.setPrice(productDto.getPrice());
        product.setPicUrl(productDto.getPicUrl());
        return product;
    }

    public List<ProductDto> listOfProducts(int hairTypeId){
        List<Product> listOfProducts = productRepo.findByProductSuitability_HairTypeId(hairTypeId);
        return responseList(listOfProducts);
    }

    public List<ProductDto> responseList(List<Product> listOfProducts){
        return listOfProducts.stream().map(p -> {
            ProductDto dto = new ProductDto();
            dto.setProductName(p.getProductName());
            dto.setProductTypeName(p.getProductType().getProductTypeName());
            dto.setIngredients(p.getIngredientsList());
            dto.setPicUrl(p.getPicUrl());
            dto.setPrice(p.getPrice());
            return dto;
        }).toList();
    }
}