package com.equoterapia.web;

// Importações das classes necessárias para os testes unitários e mocks
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

// Anotações para configuração do contexto de teste do Spring Boot e Mockito
@SpringBootTest
@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test") // Usa o profile 'test' para configurações específicas de teste
class HorseTest {

    // Cria um mock do serviço de cavalos
    @Mock
    private HorseService horseService;

    // Injeta o mock no resource (controller REST)
    @InjectMocks
    private HorseResource horseResource;

    // Instância de cavalo usada nos testes
    private Horse horse;

    // Método executado antes de cada teste para inicializar o objeto horse
    @BeforeEach
    void setUp() {
        horse = new Horse();
        horse.setId(1L);
        horse.setName("Horse");
        horse.setHeight(1.5);
        horse.setGait("Walking");
        horse.setEquipment("Saddle");
    }

    // Testa se o método findAll retorna corretamente a lista de cavalos
    @Test
    void findAll_ShouldReturnListOfHorses() {
        // Configura o mock para retornar uma lista com o cavalo criado
        when(horseService.findAll()).thenReturn(List.of(horse));

        // Chama o método do resource e armazena a resposta
        ResponseEntity<List<Horse>> response = horseResource.findAll();

        // Verifica se o status HTTP é 200 (OK)
        assertEquals(200, response.getStatusCode().value());
        // Verifica se o corpo da resposta não é nulo
        assertNotNull(response.getBody());
        // Verifica se o cavalo está presente na lista retornada
        assertTrue(response.getBody().contains(horse));
        // Garante que o método findAll do serviço foi chamado uma vez
        verify(horseService, times(1)).findAll();
    }

    // Testa se o método insert cria um cavalo e retorna status 201 (Created)
    @Test
    void insert_ShouldCreateHorseAndReturn201() {
        // Configura o mock para retornar o cavalo ao inserir
        when(horseService.insert(any(Horse.class))).thenReturn(horse);

        // Chama o método de inserção do resource
        ResponseEntity<Horse> response = horseResource.insert(horse);

        // Verifica se o status HTTP é 201 (Created)
        assertEquals(201, response.getStatusCode().value());
        // Verifica se o corpo da resposta é igual ao cavalo criado
        assertEquals(horse, response.getBody());
        // Verifica se o header Location está presente (URL do novo recurso)
        assertNotNull(response.getHeaders().getLocation());
        // Garante que o método insert do serviço foi chamado uma vez
        verify(horseService, times(1)).insert(any(Horse.class));
    }
}
