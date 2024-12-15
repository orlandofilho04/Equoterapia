package com.equoterapia.web.repositories;


import com.equoterapia.web.entities.Session;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionRepository extends JpaRepository<Session, Long> {
}
