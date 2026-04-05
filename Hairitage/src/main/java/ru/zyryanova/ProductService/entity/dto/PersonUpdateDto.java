package ru.zyryanova.ProductService.entity.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

public class PersonUpdateDto {
    @NotBlank
    private String username;
    @NotBlank
    @Email
    private String email;

    public PersonUpdateDto() {
    }

    public PersonUpdateDto(String username, String email) {
        this.username = username;
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
