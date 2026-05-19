package com.hotel.hotel_app.controller;

import com.hotel.hotel_app.model.ChangePasswordRequest;
import com.hotel.hotel_app.model.Manager;
import com.hotel.hotel_app.repository.ManagerRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private ManagerRepository managerRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Manager loginRequest) {

        return managerRepository.findByUsername(loginRequest.getUsername())
                .map(manager -> {

                    boolean isPasswordCorrect = manager.getPassword().equals(loginRequest.getPassword());

                    if (!isPasswordCorrect) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(Map.of(
                                        "message", "Invalid username or password"));
                    }

                    return ResponseEntity.ok(
                            Map.of("message", "Login Successful"));

                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of(
                                "message", "Invalid username or password")));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordRequest request) {

        return managerRepository.findByUsername(request.getUsername())
                .map(manager -> {

                    boolean isCurrentPasswordCorrect = manager.getPassword()
                            .equals(request.getCurrentPassword());

                    if (!isCurrentPasswordCorrect) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(Map.of(
                                        "message", "Current password is incorrect"));
                    }

                    manager.setPassword(request.getNewPassword());
                    managerRepository.save(manager);

                    return ResponseEntity.ok(
                            Map.of(
                                    "message", "Password updated successfully"));

                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of(
                                "message", "User not found")));
    }
}
