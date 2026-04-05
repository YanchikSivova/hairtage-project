package ru.zyryanova.ProductService.globalHandler;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import ru.zyryanova.ProductService.globalHandler.exception.PersonNotFoundException;
import ru.zyryanova.ProductService.globalHandler.exception.ProductNotFoundException;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(PersonNotFoundException.class)
    public ResponseEntity<?> handlePersonNotFound(PersonNotFoundException ex) {
        return ResponseEntity.status(404).body(Map.of(
                "error", "person_not_found",
                "message", ex.getMessage()
        ));
    }

    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<?> handleProductNotFound(ProductNotFoundException ex) {
        return ResponseEntity.status(404).body(Map.of(
                "error", "product_not_found",
                "message", ex.getMessage()
        ));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<?> handleIllegalState(IllegalStateException ex) {
        return ResponseEntity.status(400).body(Map.of(
                "error", "illegal_state",
                "message", ex.getMessage()
        ));
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidation(MethodArgumentNotValidException ex) {

        String error = ex.getBindingResult()
                .getFieldErrors()
                .get(0)
                .getDefaultMessage();

        return ResponseEntity.status(400).body(Map.of(
                "error", "validation_error",
                "message", error
        ));
    }
}
