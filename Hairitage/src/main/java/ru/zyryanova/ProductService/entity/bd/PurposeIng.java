package ru.zyryanova.ProductService.entity.bd;

import jakarta.persistence.*;
import ru.zyryanova.ProductService.enums.Group;

@Entity
@Table(name = "purpose")
public class PurposeIng {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "purpose_id")
    private Integer purposeIngId;

    @Enumerated(EnumType.STRING)
    @Column(name = "purpose_name")
    private Group purposeIngName;

    public PurposeIng() {}

    public Integer getPurposeIngId() {
        return purposeIngId;
    }

    public void setPurposeIngId(Integer purposeIngId) {
        this.purposeIngId = purposeIngId;
    }

    public Group getPurposeIngName() {
        return purposeIngName;
    }

    public void setPurposeIngName(Group purposeIngName) {
        this.purposeIngName = purposeIngName;
    }
}