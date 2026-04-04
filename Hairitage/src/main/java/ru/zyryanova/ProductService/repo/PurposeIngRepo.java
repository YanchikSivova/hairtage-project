package ru.zyryanova.ProductService.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.zyryanova.ProductService.entity.bd.PurposeIng;

@Repository
public interface PurposeIngRepo extends JpaRepository<PurposeIng, Integer> {

}
