package ru.zyryanova.ProductService.controller;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import ru.zyryanova.ProductService.entity.dto.ProductDto;
import ru.zyryanova.ProductService.service.Product.AnalyzeService;
import ru.zyryanova.ProductService.service.Product.ProductService;

import java.util.List;

@RestController
@RequestMapping("/product")
public class ProductController {
    private final ProductService productService;
    private final AnalyzeService analyzeService;

    public ProductController(ProductService productService, AnalyzeService analyzeService) {
        this.productService = productService;
        this.analyzeService = analyzeService;
    }

    @PostMapping("/addProducts")
    public void createProduct(@RequestBody List<@Valid ProductDto> productDto){
        for (ProductDto dto : productDto) {
            int productId = productService.createProduct(dto).getProductId();
            analyzeService.defineHairType(productId);
        }
    }
}