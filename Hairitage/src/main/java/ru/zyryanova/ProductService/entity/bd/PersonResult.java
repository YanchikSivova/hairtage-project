package ru.zyryanova.ProductService.entity.bd;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import jakarta.persistence.*;
import ru.zyryanova.ProductService.entity.auth.Person;

import java.time.LocalDateTime;

@Entity
@Table(name = "person_result")
public class PersonResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "person_result_id")
    private Integer personResultId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "person_id")
    private Person person;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "hairtype_id")
    private HairType hairType;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public PersonResult() {}

    public PersonResult(LocalDateTime createdAt, HairType hairType, Person person) {
        this.createdAt = createdAt;
        this.hairType = hairType;
        this.person = person;
    }

    public Integer getPersonResultId() {
        return personResultId;
    }

    public void setPersonResultId(Integer personResultId) {
        this.personResultId = personResultId;
    }

    public Person getPerson() {
        return person;
    }

    public void setPerson(Person person) {
        this.person = person;
    }

    public HairType getHairType() {
        return hairType;
    }

    public void setHairType(HairType hairType) {
        this.hairType = hairType;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
