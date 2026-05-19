package com.hotel.hotel_app.controller;

import com.hotel.hotel_app.model.RoomServiceRequest;
import com.hotel.hotel_app.repository.RoomServiceRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/room-service")
@CrossOrigin("*")
public class RoomServiceController {

    @Autowired
    private RoomServiceRequestRepository repository;

    @PostMapping("/request")
    public RoomServiceRequest createRequest(@RequestBody RoomServiceRequest request) {
        request.setStatus("Pending");
        return repository.save(request);
    }

    @GetMapping("/all")
    public List<RoomServiceRequest> getAllRequests() {
        return repository.findAll();
    }

    @PutMapping("/update/{id}")
    public RoomServiceRequest updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        RoomServiceRequest request = repository.findById(id).orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus(payload.get("status"));
        return repository.save(request);
    }
}