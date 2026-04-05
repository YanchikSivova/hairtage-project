package ru.zyryanova.ProductService.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.zyryanova.ProductService.entity.bd.RelevantRange;

import java.util.List;

@Repository
public interface RelevantRangeRepo extends JpaRepository<RelevantRange, Integer> {
    List<RelevantRange> findByHairType_HairTypeId(Integer hairTypeId);
}