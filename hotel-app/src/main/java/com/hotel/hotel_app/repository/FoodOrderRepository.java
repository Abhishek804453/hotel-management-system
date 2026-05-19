package com.hotel.hotel_app.repository;

import com.hotel.hotel_app.model.FoodOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import org.springframework.transaction.annotation.Transactional; 

@Repository
public interface FoodOrderRepository extends JpaRepository<FoodOrder, Long> {
    
    List<FoodOrder> findByRoomNumber(int roomNumber);

    @Transactional
    void deleteByRoomNumber(int roomNumber);
}