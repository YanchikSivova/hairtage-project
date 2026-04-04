package ru.zyryanova.ProductService.entity.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class PersonResultDto {
    private Integer hairTypeId;
    private String hairTypeName;
    private LocalDateTime createdAt;

    public PersonResultDto() {
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
