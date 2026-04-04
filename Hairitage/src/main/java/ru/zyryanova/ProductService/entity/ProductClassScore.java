package ru.zyryanova.ProductService.entity;

import jakarta.persistence.*;
import ru.zyryanova.ProductService.entity.bd.Product;
import ru.zyryanova.ProductService.entity.bd.PurposeIng;


@Entity
@Table(name = "product_class_score")
public class ProductClassScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_class_score_id", unique = true)
    private Integer productClassScoreId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purpose_id", nullable = false)
    private PurposeIng purposeIng;

    @Column(name = "score", nullable = false)
    private Integer score;

    public ProductClassScore() {}

    public Integer getProductClassScoreId() {
        return productClassScoreId;
    }

    public void setProductClassScoreId(Integer productClassScoreId) {
        this.productClassScoreId = productClassScoreId;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public PurposeIng getPurposeIng() {
        return purposeIng;
    }

    public void setPurposeIng(PurposeIng purposeIng) {
        this.purposeIng = purposeIng;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

}


