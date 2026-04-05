package ru.zyryanova.ProductService.service.Product;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.zyryanova.ProductService.entity.ProductClassScore;
import ru.zyryanova.ProductService.entity.bd.*;
import ru.zyryanova.ProductService.finder.Finder;
import ru.zyryanova.ProductService.repo.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyzeService {
    private final IngredientRepo ingredientRepo;
    private final ProductRepo productRepo;
    private final HairTypeRepo hairTypeRepo;
    private final ProductClassScoreRepo productClassScoreRepo;
    private final Finder finder;
    private final PurposeIngRepo purposeIngRepo;
    private final RelevantRangeRepo relevantRangeRepo;

    public AnalyzeService(
            IngredientRepo ingredientRepo,
            ProductRepo productRepo,
            HairTypeRepo hairTypeRepo,
            ProductClassScoreRepo productClassScoreRepo,
            Finder finder,
            PurposeIngRepo purposeIngRepo,
            RelevantRangeRepo relevantRangeRepo
    ) {
        this.ingredientRepo = ingredientRepo;
        this.productRepo = productRepo;
        this.hairTypeRepo = hairTypeRepo;
        this.productClassScoreRepo = productClassScoreRepo;
        this.finder = finder;
        this.purposeIngRepo = purposeIngRepo;
        this.relevantRangeRepo = relevantRangeRepo;
    }

    private int getWeightByPosition(int position) {
        if (position >= 1 && position <= 3) {
            return 10; // 1.0
        }
        if (position >= 4 && position <= 6) {
            return 7; // 0.7
        }
        if (position >= 7 && position <= 10) {
            return 4; // 0.4
        }
        if (position >= 11 && position <= 15) {
            return 2; // 0.2
        }
        return 1; // 0.1
    }

    public Map<Integer, Integer> calculateScores(Product product) {
        Map<Integer, Integer> scores = new HashMap<>();

        List<String> ingredients = product.getIngredientsList();

        for (int i = 0; i < ingredients.size(); i++) {
            String ingredientName = ingredients.get(i);
            Ingredient ingredient = ingredientRepo.findByIngredientName(ingredientName);

            if (ingredient == null) {
                continue;
            }

            int position = i + 1;
            int weight = getWeightByPosition(position);

            Integer purposeId = ingredient.getPurposeIng().getPurposeIngId();
            scores.put(purposeId, scores.getOrDefault(purposeId, 0) + weight);
        }

        return scores;
    }

    @Transactional
    public void saveProductScores(Product product, Map<Integer, Integer> scores) {
        productClassScoreRepo.deleteByProduct_ProductId(product.getProductId());

        for (Map.Entry<Integer, Integer> entry : scores.entrySet()) {
            Integer purposeId = entry.getKey();
            Integer score = entry.getValue();

            PurposeIng purposeIng = purposeIngRepo.findById(purposeId).orElseThrow();

            ProductClassScore pcs = new ProductClassScore();
            pcs.setProduct(product);
            pcs.setPurposeIng(purposeIng);
            pcs.setScore(score);

            productClassScoreRepo.save(pcs);
        }
    }

    @Transactional
    public void defineHairType(int productId) {
        Product product = finder.findProductOrThrow(productId);

        Map<Integer, Integer> scores = calculateScores(product);
        saveProductScores(product, scores);

        product.getProductSuitability().clear();

        List<HairType> hairTypes = hairTypeRepo.findAll();

        for (HairType hairType : hairTypes) {
            List<RelevantRange> ranges = relevantRangeRepo.findByHairType_HairTypeId(hairType.getHairTypeId());

            boolean ok = true;

            for (RelevantRange range : ranges) {
                Integer purposeId = range.getPurposeIng().getPurposeIngId();
                int score = scores.getOrDefault(purposeId, 0);

                if (score < range.getMinValue() || score > range.getMaxValue()) {
                    ok = false;
                    break;
                }
            }

            if (ok) {
                product.getProductSuitability().add(hairType);
            }
        }

        productRepo.save(product);
    }
}