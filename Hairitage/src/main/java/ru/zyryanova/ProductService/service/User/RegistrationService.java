package ru.zyryanova.ProductService.service.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.zyryanova.ProductService.entity.auth.Person;
import ru.zyryanova.ProductService.enums.Role;
import ru.zyryanova.ProductService.repo.PersonRepo;

@Service
public class RegistrationService {
    private final PersonRepo personRepo;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public RegistrationService(PersonRepo personRepo, PasswordEncoder passwordEncoder) {
        this.personRepo = personRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void register(Person person){
        person.setRole(Role.USER);
        person.setPassword(passwordEncoder.encode(person.getPassword()));
        personRepo.save(person);
    }
}
