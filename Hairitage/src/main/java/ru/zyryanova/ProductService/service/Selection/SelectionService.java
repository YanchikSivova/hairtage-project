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
import java.util.List;

@Service
public class SelectionService {
    private static final int EXPECTED_ANSWER_COUNT = 5;
    private static final int HAIR_TYPE_COUNT = 3;
    private static final int SKIP_OPTION = 4;

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
        int resType = determineHairType(answers);

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

    static int determineHairType(List<Integer> answers) {
        if (answers == null || answers.size() != EXPECTED_ANSWER_COUNT) {
            throw new IllegalArgumentException("Необходимо ответить на все 5 вопросов");
        }

        int[] counts = new int[HAIR_TYPE_COUNT];
        for (int index = 0; index < answers.size(); index++) {
            Integer answer = answers.get(index);
            int maxOption = index == EXPECTED_ANSWER_COUNT - 1 ? SKIP_OPTION : HAIR_TYPE_COUNT;
            if (answer == null || answer < 1 || answer > maxOption) {
                throw new IllegalArgumentException("Ответ содержит недопустимый вариант");
            }
            if (answer <= HAIR_TYPE_COUNT) {
                counts[answer - 1]++;
            }
        }

        int result = 1;
        for (int index = 1; index < counts.length; index++) {
            if (counts[index] > counts[result - 1]) {
                result = index + 1;
            }
        }
        return result;
    }
}