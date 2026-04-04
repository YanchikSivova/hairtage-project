package ru.zyryanova.ProductService.service.Selection;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.zyryanova.ProductService.entity.auth.Person;
import ru.zyryanova.ProductService.entity.bd.HairType;
import ru.zyryanova.ProductService.entity.bd.PersonResult;
import ru.zyryanova.ProductService.finder.Finder;
import ru.zyryanova.ProductService.repo.HairTypeRepo;
import ru.zyryanova.ProductService.repo.PersonRepo;
import ru.zyryanova.ProductService.repo.PersonResultRepo;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SelectionService {
    private final PersonRepo personRepo;
    private final HairTypeRepo hairTypeRepo;
    private final Finder finder;
    private final PersonResultRepo personResultRepo;

    public SelectionService(PersonRepo personRepo, HairTypeRepo hairTypeRepo, Finder finder, PersonResultRepo personResultRepo) {
        this.personRepo = personRepo;
        this.hairTypeRepo = hairTypeRepo;
        this.finder = finder;
        this.personResultRepo = personResultRepo;
    }

    @Transactional
    public int selectHairType(List<Integer> answers, Authentication authentication){
        Map<Integer, Integer> countMap = new HashMap<>();

        for (int answer : answers) {
            countMap.put(answer, countMap.getOrDefault(answer, 0) + 1);
        }

        int resType = 0;
        int resValue = 0;

        for (int key : countMap.keySet()) {
            int value = countMap.get(key);
            if (value > resValue) {
                resValue = value;
                resType = key;
            }
        }

        if (authentication != null && !(authentication instanceof AnonymousAuthenticationToken)) {
            Person person = finder.findPersonOrThrow(authentication.getName());
            HairType hairType = hairTypeRepo.findById(resType).orElseThrow();
            person.setHairType(hairType);
            PersonResult personResult = new PersonResult(LocalDateTime.now(), hairType ,person);
            personResultRepo.save(personResult);
            personRepo.save(person);
        }

        return resType;
    }
}