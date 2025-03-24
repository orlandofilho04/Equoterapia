package com.equoterapia.web.repositories;


import com.equoterapia.web.entities.Session;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SessionRepository extends JpaRepository<Session, Long> {
    List<Session> findAllByEquitorId(Long equitor_id);
}
