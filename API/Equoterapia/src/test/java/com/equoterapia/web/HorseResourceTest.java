package com.equoterapia.web;

import com.equoterapia.web.entities.Horse;
import com.equoterapia.web.resources.HorseResource;
import com.equoterapia.web.services.HorseService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
class HorseResourceTest {

    @Mock
    private HorseService horseService;

    @InjectMocks
    private HorseResource horseResource;

    private Horse horse;

    @BeforeEach
    void setUp() {
        horse = new Horse();
        horse.setId(1L);
        horse.setName("Horse");
        horse.setHeight(1.5);
        horse.setGait("Walking");
        horse.setEquipment("Saddle");
    }

    @Test
    void findAll_ShouldReturnListOfHorses() {
        when(horseService.findAll()).thenReturn(List.of(horse));

        ResponseEntity<List<Horse>> response = horseResource.findAll();

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().contains(horse));
        verify(horseService, times(1)).findAll();
    }

    @Test
    void insert_ShouldCreateHorseAndReturn201() {
        when(horseService.insert(any(Horse.class))).thenReturn(horse);

        ResponseEntity<Horse> response = horseResource.insert(horse);

        assertEquals(201, response.getStatusCode().value());
        assertEquals(horse, response.getBody());
        assertNotNull(response.getHeaders().getLocation());
        verify(horseService, times(1)).insert(any(Horse.class));
    }
}
