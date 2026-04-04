package ru.zyryanova.ProductService.entity.bd;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "hairtype")
public class HairType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hairtype_id")
    private Integer hairTypeId;

    @Column(name = "hairtype_name", nullable = false, unique = true)
    @NotBlank
    private String hairTypeName;

    public HairType() {
    }

    public Integer getHairTypeId() {
        return hairTypeId;
    }

    public void setHairTypeId(Integer hairTypeId) {
        this.hairTypeId = hairTypeId;
    }

    public String getHairTypeName() {
        return hairTypeName;
    }

    public void setHairTypeName(String hairTypeName) {
        this.hairTypeName = hairTypeName;
    }
}