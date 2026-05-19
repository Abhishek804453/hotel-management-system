package com.hotel.hotel_app.repository;

import com.hotel.hotel_app.model.GuestHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GuestHistoryRepository extends JpaRepository<GuestHistory, Long> {
}
