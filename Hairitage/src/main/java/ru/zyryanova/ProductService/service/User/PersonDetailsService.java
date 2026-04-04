package ru.zyryanova.ProductService.service.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import ru.zyryanova.ProductService.entity.auth.Person;
import ru.zyryanova.ProductService.entity.auth.PersonDetailsEntity;
import ru.zyryanova.ProductService.repo.PersonRepo;

@Service
public class PersonDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {
    private final PersonRepo personRepo;

    @Autowired
    public PersonDetailsService(PersonRepo personRepo) {
        this.personRepo = personRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Person person = personRepo.findByEmail(username);
        if (person == null) {
            throw new UsernameNotFoundException("Пользователь не найден");
        }
        return new PersonDetailsEntity(person);
    }

}
