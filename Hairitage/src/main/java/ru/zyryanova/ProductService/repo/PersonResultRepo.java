package ru.zyryanova.ProductService.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.zyryanova.ProductService.entity.bd.PersonResult;

import java.util.List;

@Repository
public interface PersonResultRepo extends JpaRepository<PersonResult, Integer> {
    List<PersonResult> findByPerson_IdOrderByCreatedAtDesc(Integer personId);
}
