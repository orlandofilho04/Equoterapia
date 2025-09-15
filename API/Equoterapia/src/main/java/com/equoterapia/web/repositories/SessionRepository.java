package com.equoterapia.web.repositories;

import com.equoterapia.web.entities.Session;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

// Repositório para operações com a entidade Session (sessão de atendimento)
public interface SessionRepository extends JpaRepository<Session, Long> {
    // Busca todas as sessões por ID do equitador
    List<Session> findAllByEquitorId(Long equitor_id);

    // Busca todas as sessões por ID do mediador
    List<Session> findAllByMediatorId(Long mediator_id);

    // Verifica se já existe uma sessão marcada para o mesmo horário
    boolean existsSessionBySessionHour(LocalDateTime sessionHour);

    // Busca todas as sessões por ID do paciente
    List<Session> findAllByPacientId(Long pacient_id);

    // Busca todas as sessões por nome do paciente (usando LIKE)
    List<Session> findAllByPacientNameLike(String pacient_name);
}
