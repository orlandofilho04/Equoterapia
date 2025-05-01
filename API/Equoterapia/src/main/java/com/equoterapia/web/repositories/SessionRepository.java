package com.equoterapia.web.repositories;


import com.equoterapia.web.entities.Session;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface SessionRepository extends JpaRepository<Session, Long> {
    List<Session> findAllByEquitorId(Long equitor_id);
    List<Session> findAllByMediatorId(Long mediator_id);
    boolean existsSessionBySessionHour(LocalDateTime sessionHour);

    List<Session> findAllByPacientId(Long pacient_id);
    List<Session> findAllByPacientNameLike(String pacient_name);
}
