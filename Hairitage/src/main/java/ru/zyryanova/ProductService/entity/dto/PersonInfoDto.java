package ru.zyryanova.ProductService.entity.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public class PersonInfoDto {
    private String username;
    private String email;
    private Integer hairTypeId;
    private List<PersonResultDto> history;

    public PersonInfoDto() {}

    public PersonInfoDto(Integer hairTypeId, String email, String username, List<PersonResultDto> history) {
        this.hairTypeId = hairTypeId;
        this.email = email;
        this.username = username;
        this.history = history;
    }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Integer getHairTypeId() {
        return hairTypeId;
    }

    public void setHairTypeId(Integer hairTypeId) {
        this.hairTypeId = hairTypeId;
    }

    public List<PersonResultDto> getHistory() {
        return history;
    }

    public void setHistory(List<PersonResultDto> history) {
        this.history = history;
    }
}