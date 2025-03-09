package com.equoterapia.web;

import com.equoterapia.web.entities.Administrator;
import com.equoterapia.web.resources.AdministratorResource;
import com.equoterapia.web.services.AdministratorService;
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
class AdministratorTest {

    @Mock
    private AdministratorService administratorService;

    @InjectMocks
    private AdministratorResource administratorResource;

    private Administrator administrator;

    @BeforeEach
    void setUp() {
        administrator = new Administrator();
        administrator.setId(1L);
        administrator.setNome("Igor");
        administrator.setEmail("igor@example.com");
        administrator.setCpf("12345678901");
    }

    @Test
    void findAll_ShouldReturnListOfAdministrators() {
        when(administratorService.findAll()).thenReturn(List.of(administrator));

        ResponseEntity<List<Administrator>> response = administratorResource.findAll();

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().contains(administrator));
        verify(administratorService, times(1)).findAll();
    }

    @Test
    void insert_ShouldCreateAdministratorAndReturn201() {
        when(administratorService.insert(any(Administrator.class))).thenReturn(administrator);

        ResponseEntity<Administrator> response = administratorResource.insert(administrator);

        assertEquals(201, response.getStatusCode().value());
        assertEquals(administrator, response.getBody());
        assertNotNull(response.getHeaders().getLocation());
        verify(administratorService, times(1)).insert(any(Administrator.class));
    }
}