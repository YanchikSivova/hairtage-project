package ru.zyryanova.ProductService.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.zyryanova.ProductService.entity.auth.Person;

@Repository
public interface PersonRepo extends JpaRepository<Person, Integer> {
    Person findByEmail(String email);
}