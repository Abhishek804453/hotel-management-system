package com.hotel.hotel_app.repository;

import com.hotel.hotel_app.model.RoomServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomServiceRequestRepository extends JpaRepository<RoomServiceRequest, Long> {
}