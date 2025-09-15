package com.equoterapia.web;

// Importações das classes necessárias para os testes unitários e mocks
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

// Anotações para configuração do contexto de teste do Spring Boot e Mockito
@SpringBootTest
@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test") // Usa o profile 'test' para configurações específicas de teste
class AdministratorTest {

    // Cria um mock do serviço de administrador
    @Mock
    private AdministratorService administratorService;

    // Injeta o mock no resource (controller REST)
    @InjectMocks
    private AdministratorResource administratorResource;

    // Instância de administrador usada nos testes
    private Administrator administrator;

    // Método executado antes de cada teste para inicializar o objeto administrator
    @BeforeEach
    void setUp() {
        administrator = new Administrator();
        administrator.setId(1L);
        administrator.setNome("Igor");
        administrator.setEmail("igor@example.com");
        administrator.setCpf("12345678901");
    }

    // Testa se o método findAll retorna corretamente a lista de administradores
    @Test
    void findAll_ShouldReturnListOfAdministrators() {
        // Configura o mock para retornar uma lista com o administrador criado
        when(administratorService.findAll()).thenReturn(List.of(administrator));

        // Chama o método do resource e armazena a resposta
        ResponseEntity<List<Administrator>> response = administratorResource.findAll();

        // Verifica se o status HTTP é 200 (OK)
        assertEquals(200, response.getStatusCode().value());
        // Verifica se o corpo da resposta não é nulo
        assertNotNull(response.getBody());
        // Verifica se o administrador está presente na lista retornada
        assertTrue(response.getBody().contains(administrator));
        // Garante que o método findAll do serviço foi chamado uma vez
        verify(administratorService, times(1)).findAll();
    }

    // Testa se o método insert cria um administrador e retorna status 201 (Created)
    @Test
    void insert_ShouldCreateAdministratorAndReturn201() {
        // Configura o mock para retornar o administrador ao inserir
        when(administratorService.insert(any(Administrator.class))).thenReturn(administrator);

        // Chama o método de inserção do resource
        ResponseEntity<Administrator> response = administratorResource.insert(administrator);

        // Verifica se o status HTTP é 201 (Created)
        assertEquals(201, response.getStatusCode().value());
        // Verifica se o corpo da resposta é igual ao administrador criado
        assertEquals(administrator, response.getBody());
        // Verifica se o header Location está presente (URL do novo recurso)
        assertNotNull(response.getHeaders().getLocation());
        // Garante que o método insert do serviço foi chamado uma vez
        verify(administratorService, times(1)).insert(any(Administrator.class));
    }
}