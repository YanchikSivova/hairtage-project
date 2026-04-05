package ru.zyryanova.ProductService.entity.bd;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "relevant_range")
public class RelevantRange {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "relevant_range_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "purpose_id")
    private PurposeIng purposeIng;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "hairtype_id")
    private HairType hairType;

    @Column(name = "min_value")
    @Min(value = 0)
    private Integer minValue;

    @Column(name = "max_value")
    private Integer maxValue;

    protected RelevantRange() {}

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public PurposeIng getPurposeIng() {
        return purposeIng;
    }

    public void setPurposeIng(PurposeIng purposeIng) {
        this.purposeIng = purposeIng;
    }

    public HairType getHairType() {
        return hairType;
    }

    public void setHairType(HairType hairType) {
        this.hairType = hairType;
    }

    public Integer getMinValue() {
        return minValue;
    }

    public void setMinValue(Integer minValue) {
        this.minValue = minValue;
    }

    public Integer getMaxValue() {
        return maxValue;
    }

    public void setMaxValue(Integer maxValue) {
        this.maxValue = maxValue;
    }
}