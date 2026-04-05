package ru.zyryanova.ProductService.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.zyryanova.ProductService.entity.bd.HairType;

public interface HairTypeRepo extends JpaRepository<HairType, Integer> {
}
