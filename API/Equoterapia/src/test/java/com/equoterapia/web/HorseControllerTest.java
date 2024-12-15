package com.equoterapia.web.resources;

import com.equoterapia.web.entities.Horse;
import com.equoterapia.web.services.HorseService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class HorseControllerTest {

    @Mock
    private HorseService horseService;

    @InjectMocks
    private HorseController horseController;

    private Horse horse;

    @BeforeEach
    void setUp() {
        horse = new Horse(1L, "Spirit", 1.5, "Trot", "Saddle");
    }

    @Test
    void findAll_ShouldReturnListOfHorses() {
        when(horseService.findAll()).thenReturn(List.of(horse));

        ResponseEntity<List<Horse>> response = horseController.findAll();

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().contains(horse));
    }

    @Test
    void insert_ShouldCreateHorseAndReturn201() {
        when(horseService.insert(any(Horse.class))).thenReturn(horse);

        ResponseEntity<Horse> response = horseController.insert(horse);

        assertEquals(201, response.getStatusCodeValue());
        assertEquals(horse, response.getBody());
        assertNotNull(response.getHeaders().getLocation());
    }
}
