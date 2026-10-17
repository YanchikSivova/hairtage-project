package ru.zyryanova.ProductService.service.Selection;

import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class SelectionServiceTest {

    @Test
    void selectsMostFrequentHairTypeAndIgnoresSkipAnswer() {
        assertEquals(1, SelectionService.determineHairType(List.of(1, 2, 1, 3, 4)));
    }

    @Test
    void resolvesTiesByLowestHairTypeId() {
        assertEquals(1, SelectionService.determineHairType(List.of(1, 2, 3, 1, 2)));
    }

    @Test
    void rejectsMissingAnswers() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> SelectionService.determineHairType(List.of(1, 2, 3)));
        assertEquals("Необходимо ответить на все 5 вопросов", exception.getMessage());
    }

    @Test
    void rejectsOptionsOutsideEachQuestionRange() {
        IllegalArgumentException outOfRangeException = assertThrows(IllegalArgumentException.class,
                () -> SelectionService.determineHairType(List.of(1, 2, 3, 4, 1)));
        assertEquals("Ответ содержит недопустимый вариант", outOfRangeException.getMessage());

        IllegalArgumentException nullAnswerException = assertThrows(IllegalArgumentException.class,
                () -> SelectionService.determineHairType(Arrays.asList(1, 2, null, 1, 1)));
        assertEquals("Ответ содержит недопустимый вариант", nullAnswerException.getMessage());
    }
}