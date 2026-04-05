package ru.zyryanova.ProductService.service.User;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.zyryanova.ProductService.entity.auth.Person;
import ru.zyryanova.ProductService.entity.bd.HairType;
import ru.zyryanova.ProductService.entity.bd.PersonResult;
import ru.zyryanova.ProductService.entity.dto.PersonUpdateDto;
import ru.zyryanova.ProductService.entity.dto.PersonInfoDto;
import ru.zyryanova.ProductService.entity.dto.PersonResultDto;
import ru.zyryanova.ProductService.enums.Role;
import ru.zyryanova.ProductService.finder.Finder;
import ru.zyryanova.ProductService.repo.PersonRepo;
import ru.zyryanova.ProductService.repo.PersonResultRepo;

import java.util.ArrayList;
import java.util.List;

@Service
public class PersonService {
    private final PersonResultRepo personResultRepo;
    private final PersonRepo personRepo;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final Finder finder;

    public PersonService(PersonResultRepo personResultRepo, PersonRepo personRepo, BCryptPasswordEncoder bCryptPasswordEncoder, Finder finder) {
        this.personResultRepo = personResultRepo;
        this.personRepo = personRepo;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.finder = finder;
    }

    public ResponseEntity<PersonInfoDto> showInfo(String email){
        Person person = finder.findPersonOrThrow(email);
        Integer hairTypeId = person.getHairType() != null
                ? person.getHairType().getHairTypeId()
                : null;
        List<PersonResultDto> list = findPersonREsultDtoList(personResultRepo.findByPerson_IdOrderByCreatedAtDesc(person.getId()));
        PersonInfoDto personInfoDto =
                new PersonInfoDto(hairTypeId,person.getEmail(), person.getUsername(), list);

        return ResponseEntity.ok(personInfoDto);
    }

    @Transactional
    public void addRole(int id){
        finder.findPersonOrThrow(id).setRole(Role.ADMIN);
    }

    public HairType defineHairTypeOfAuthPerson(Authentication authentication){
        Person person = finder.findPersonOrThrow(authentication.getName());
        if (person.getHairType() == null) {
            throw new IllegalStateException("Тип волос не определен");
        }
        return person.getHairType();
    }

    @Transactional
    public void updatePerson(PersonUpdateDto dto, Authentication authentication) {

        String email = authentication.getName();

        Person person = finder.findPersonOrThrow(email);

        person.setUsername(dto.getUsername());
        person.setEmail(dto.getEmail());

        person.setPassword(bCryptPasswordEncoder.encode(dto.getPassword()));

        personRepo.save(person);
    }


    public List<PersonResultDto> findPersonREsultDtoList(List<PersonResult> list){
        List<PersonResultDto> result = new ArrayList<>();
        for(PersonResult pr: list){
            PersonResultDto personResultDto = new PersonResultDto();
            personResultDto.setHairTypeId(pr.getHairType().getHairTypeId());
            personResultDto.setHairTypeName(pr.getHairType().getHairTypeName());
            personResultDto.setCreatedAt(pr.getCreatedAt());
            result.add(personResultDto);
        }
        return result;
    }
}