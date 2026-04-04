package ru.zyryanova.ProductService.finder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.zyryanova.ProductService.entity.auth.Person;
import ru.zyryanova.ProductService.entity.bd.Product;
import ru.zyryanova.ProductService.globalHandler.exception.PersonNotFoundException;
import ru.zyryanova.ProductService.globalHandler.exception.ProductNotFoundException;
import ru.zyryanova.ProductService.repo.PersonRepo;
import ru.zyryanova.ProductService.repo.ProductRepo;

@Component
public class Finder {
    private final PersonRepo personRepo;
    private final ProductRepo productRepo;

    @Autowired
    public Finder(PersonRepo personRepo, ProductRepo productRepo) {
        this.personRepo = personRepo;
        this.productRepo = productRepo;
    }

    public Person findPersonOrThrow(String email) {
        Person person = personRepo.findByEmail(email);
        if (person == null) {
            throw new PersonNotFoundException("Пользователь не найден");
        }
        return person;
    }

    public Person findPersonOrThrow(int id) {
        return personRepo.findById(id)
                .orElseThrow(() -> new PersonNotFoundException("Пользователь не найден"));
    }

    public Product findProductOrThrow(int id) {
        return productRepo.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Продукт не найден"));
    }

    public Product findProductOrThrow(String productName) {
        Product product = productRepo.findByProductName(productName);
        if (product == null) {
            throw new ProductNotFoundException("Продукт не найден");
        }
        return product;
    }



}
