package com.hotel.hotel_app.controller;

import com.hotel.hotel_app.model.*;
import com.hotel.hotel_app.repository.*;
import com.hotel.hotel_app.service.HotelService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@CrossOrigin("*")
@RestController
@RequestMapping("/api")
public class HotelController {

    @Autowired
    private HotelService hotelService;

    @Autowired
    private FoodItemRepository foodItemRepository;

    @Autowired
    private FoodOrderRepository foodOrderRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private GuestHistoryRepository guestHistoryRepository;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @PostMapping("/assistant")
    public ResponseEntity<?> getAiAssistantReply(
            @RequestBody Map<String, String> request) {

        String userMessage = request.get("message");

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key="
                + geminiApiKey;

        String systemPrompt = "You are a friendly and professional hotel assistant for 'Grand Hotel & Suites'. "
                + "Answer briefly about room bookings, food menu (we have Paneer, Biryani, etc.), "
                + "and check-in times. Guest query: "
                + userMessage;

        var body = Map.of(
                "contents",
                List.of(
                        Map.of(
                                "parts",
                                List.of(
                                        Map.of("text", systemPrompt)))));

        try {

            RestTemplate restTemplate = new RestTemplate();

            Map<String, Object> response = restTemplate.postForObject(url, body, Map.class);

            List candidates = (List) response.get("candidates");

            Map content = (Map) ((Map) candidates.get(0)).get("content");

            List parts = (List) content.get("parts");

            String aiReply = (String) ((Map) parts.get(0)).get("text");

            return ResponseEntity.ok(
                    Map.of("reply", aiReply));

        } catch (Exception e) {

            return ResponseEntity.ok(
                    Map.of(
                            "reply",
                            "I'm having trouble connecting right now. Please try again later!"));
        }
    }

    @GetMapping("/rooms")
    public List<Room> getAllRooms() {
        return hotelService.getAllRooms();
    }

    @PutMapping("/rooms/{roomNumber}/book")
    public ResponseEntity<Room> bookRoom(
            @PathVariable int roomNumber,
            @RequestBody BookingRequest bookingRequest) {

        Room updatedRoom = hotelService.bookRoom(
                roomNumber,
                bookingRequest.getCustomerName(),
                bookingRequest.getCustomerContact());

        if (updatedRoom != null) {
            return ResponseEntity.ok(updatedRoom);
        }

        return ResponseEntity.notFound().build();
    }

    @PostMapping("/rooms/{roomNumber}/vacate")
    public ResponseEntity<?> vacateRoom(
            @PathVariable int roomNumber,
            @RequestBody BookingRequest verificationDetails) {

        Room room = roomRepository.findByRoomNumber(roomNumber);

        if (room == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Room not found");
        }

        if (!room.isBooked()) {
            return ResponseEntity.badRequest()
                    .body("Room is already empty.");
        }

        String dbName = room.getCustomerName().trim();
        String dbContact = room.getCustomerContact().trim();

        String inputName = verificationDetails.getCustomerName().trim();

        String inputContact = verificationDetails.getCustomerContact().trim();

        boolean nameMatch = dbName.equalsIgnoreCase(inputName);

        boolean contactMatch = dbContact.equals(inputContact);

        if (!nameMatch || !contactMatch) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(
                            "Verification Failed: Name or Contact does not match our records.");
        }

        BillDTO bill = hotelService.calculateBill(roomNumber);

        hotelService.vacateRoom(roomNumber);

        return ResponseEntity.ok(bill);
    }

    @PostMapping("/rooms/{roomNumber}/verify-checkout")
    public ResponseEntity<?> verifyCheckout(
            @PathVariable int roomNumber,
            @RequestBody BookingRequest verificationDetails) {

        Room room = roomRepository.findByRoomNumber(roomNumber);

        if (room == null || !room.isBooked()) {

            return ResponseEntity.badRequest()
                    .body("Room not found or is already empty.");
        }

        String dbName = room.getCustomerName().trim();
        String dbContact = room.getCustomerContact().trim();

        String inputName = verificationDetails.getCustomerName().trim();

        String inputContact = verificationDetails.getCustomerContact().trim();

        if (!dbName.equalsIgnoreCase(inputName)
                || !dbContact.equals(inputContact)) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(
                            "Verification Failed: Name or Contact does not match our records.");
        }

        BillDTO bill = hotelService.calculateBill(roomNumber);

        return ResponseEntity.ok(bill);
    }

    @GetMapping("/rooms/{roomNumber}/bill")
    public ResponseEntity<BillDTO> getRoomBill(
            @PathVariable int roomNumber) {

        BillDTO bill = hotelService.calculateBill(roomNumber);

        if (bill != null) {
            return ResponseEntity.ok(bill);
        }

        return ResponseEntity.notFound().build();
    }

    @GetMapping("/menu")
    public List<FoodItem> getFoodMenu() {
        return foodItemRepository.findAll();
    }

    @GetMapping("/orders")
    public List<FoodOrder> getAllOrders() {
        return foodOrderRepository.findAll();
    }

    @PostMapping("/orders")
    public ResponseEntity<?> createFoodOrder(
            @RequestBody FoodOrderRequest orderRequest) {

        Room room = roomRepository.findByRoomNumber(
                orderRequest.getRoomNumber());

        if (room == null || !room.isBooked()) {

            return new ResponseEntity<>(
                    "Room is not booked or does not exist",
                    HttpStatus.BAD_REQUEST);
        }

        FoodOrder newOrder = new FoodOrder();

        newOrder.setRoomNumber(orderRequest.getRoomNumber());
        newOrder.setItemName(orderRequest.getItemName());
        newOrder.setItemPrice(orderRequest.getItemPrice());
        newOrder.setOrderTime(LocalDateTime.now());

        FoodOrder savedOrder = foodOrderRepository.save(newOrder);

        return ResponseEntity.ok(savedOrder);
    }

    @GetMapping("/customers")
    public List<CustomerDashboardDTO> getCustomers() {
        return hotelService.getCustomerDashboard();
    }

    @GetMapping("/guest-check")
    public ResponseEntity<?> checkGuestStatus(
            @RequestParam String contact) {

        Room activeRoom = roomRepository.findByCustomerContact(contact);

        if (activeRoom != null) {

            return ResponseEntity.ok(
                    Map.of(
                            "hasBooking", true,
                            "roomNumber", activeRoom.getRoomNumber(),
                            "customerName", activeRoom.getCustomerName()));
        }

        return ResponseEntity.ok(
                Map.of("hasBooking", false));
    }

    @GetMapping("/history")
    public List<GuestHistory> getGuestHistory() {
        return guestHistoryRepository.findAll();
    }
}
