package ru.zyryanova.ProductService.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import ru.zyryanova.ProductService.entity.bd.Product;
import ru.zyryanova.ProductService.entity.dto.ProductDto;
import ru.zyryanova.ProductService.repo.ProductRepo;
import ru.zyryanova.ProductService.repo.PersonRepo;
import ru.zyryanova.ProductService.service.Product.AnalyzeService;
import ru.zyryanova.ProductService.service.User.AdminManageService;
import ru.zyryanova.ProductService.service.User.PersonService;
import ru.zyryanova.ProductService.service.Product.ProductService;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {
    private final AdminManageService adminManageService;
    private final ProductService productService;
    private final AnalyzeService analyzeService;


    @Autowired
    public AdminController(AdminManageService adminManageService, ProductService productService, AnalyzeService analyzeService) {
        this.adminManageService = adminManageService;
        this.productService = productService;
        this.analyzeService = analyzeService;
    }
    @GetMapping()
    public List<Product> allProducts(){
        return productService.showAllProducts();
    }

    @DeleteMapping("/delete/{id}")
    public void deleteProduct(@PathVariable int id){
        adminManageService.deleteProduct(id);
    }
    @PatchMapping("/update/{id}")
    public void updateProduct(@RequestBody @Valid ProductDto productDto, @PathVariable int id){
        adminManageService.updateProduct(productDto, id);
    }
    @PostMapping("/create")
    public void createProduct(@RequestBody @Valid ProductDto productDto){
        int productId = productService.createProduct(productDto).getProductId();
        analyzeService.defineHairType(productId);
    }
    @PatchMapping("/addRole/{email}")
    public void addRole(@PathVariable String email){
        adminManageService.addRole(email);
    }
}
