package com.hotel.hotel_app.repository;

import com.hotel.hotel_app.model.Manager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ManagerRepository extends JpaRepository<Manager, String> {

    Optional<Manager> findByUsername(String username);
}