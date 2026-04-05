package ru.zyryanova.ProductService.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ru.zyryanova.ProductService.entity.dto.PersonInfoDto;
import ru.zyryanova.ProductService.entity.dto.PersonUpdateDto;
import ru.zyryanova.ProductService.entity.dto.ProductDto;
import ru.zyryanova.ProductService.entity.auth.Person;
import ru.zyryanova.ProductService.service.Product.ProductService;
import ru.zyryanova.ProductService.service.Selection.SelectionService;
import ru.zyryanova.ProductService.service.User.RegistrationService;
import ru.zyryanova.ProductService.service.User.PersonService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/person")
public class PersonController {
    private final SelectionService selectionService;
    private final ProductService productService;
    private final RegistrationService registrationService;
    private final PersonService personService;

    @Autowired
    public PersonController(SelectionService selectionService, ProductService productService, RegistrationService registrationService, PersonService personService) {
        this.productService = productService;
        this.selectionService = selectionService;
        this.registrationService = registrationService;
        this.personService = personService;
    }
    // это подборка сразу на основе определения типа волос (список сюда посылается)
    @PostMapping("/selection")
    public List<ProductDto> selectHairTypeAndProducts(@RequestBody List<Integer> answers, Authentication authentication){
        int hairTypeId = selectionService.selectHairType(answers, authentication);
        return productService.listOfProducts(hairTypeId);
    }
    @GetMapping("/selection/{hairTypeId}")
    public List<ProductDto> getProductsByHairType(@PathVariable int hairTypeId) {
        return productService.listOfProducts(hairTypeId);
    }
    // это подборка продуктов для аутентифицированного пользователя (подборка для аутентифицированного пользователя из бдшки)
    @GetMapping("/selection/auth")
    public List<ProductDto> selectProductsOfAuthPerson(Authentication authentication){
        int hairTypeId = personService.defineHairTypeOfAuthPerson(authentication).getHairTypeId();
        return productService.listOfProducts(hairTypeId);
    }
    @PostMapping("/registration")
    public void registration(@RequestBody @Valid Person person){
        registrationService.register(person);
    }

    @GetMapping("/accountInfo")
    public ResponseEntity<PersonInfoDto> accountInfo(Authentication authentication) {
        return personService.showInfo(authentication.getName());
    }

    @PatchMapping("/update")
    public void updatePerson(@RequestBody @Valid PersonUpdateDto dto, Authentication authentication) {
        personService.updatePerson(dto, authentication);
    }

    @GetMapping("/isAdmin")
    public Map<String, Boolean> isAdmin(Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        return Map.of("isAdmin", isAdmin);
    }

    @GetMapping("/checkAuth")
    public Map<String, Boolean> checkAuth(Authentication authentication) {
        boolean authenticated =
                authentication != null &&
                        authentication.isAuthenticated() &&
                        !(authentication instanceof AnonymousAuthenticationToken);

        return Map.of("authenticated", authenticated);
    }

}
