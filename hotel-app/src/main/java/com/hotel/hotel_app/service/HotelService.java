package com.hotel.hotel_app.service;

import com.hotel.hotel_app.model.Room;
import com.hotel.hotel_app.model.BillDTO;
import com.hotel.hotel_app.model.FoodOrder;
import com.hotel.hotel_app.model.Customer;
import com.hotel.hotel_app.model.GuestHistory;
import com.hotel.hotel_app.repository.RoomRepository;
import com.hotel.hotel_app.repository.FoodOrderRepository;
import com.hotel.hotel_app.repository.CustomerRepository;
import com.hotel.hotel_app.repository.GuestHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

@Service
public class HotelService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private FoodOrderRepository foodOrderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private GuestHistoryRepository guestHistoryRepository;

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public List<Room> getAvailableRooms() {
        return roomRepository.findByIsBooked(false);
    }

    public Room bookRoom(int roomNumber, String customerName, String customerContact) {
        Room roomToBook = roomRepository.findByRoomNumber(roomNumber);

        if (roomToBook != null && !roomToBook.isBooked()) {

            Optional<Customer> existingCustomer = customerRepository.findByContact(customerContact);

            if (existingCustomer.isPresent()) {
                Customer customer = existingCustomer.get();
                customer.setName(customerName);
                customerRepository.save(customer);
            } else {
                Customer newCustomer = new Customer();
                newCustomer.setName(customerName);
                newCustomer.setContact(customerContact);
                customerRepository.save(newCustomer);
            }

            roomToBook.setBooked(true);
            roomToBook.setCustomerName(customerName);
            roomToBook.setCustomerContact(customerContact);

            return roomRepository.save(roomToBook);
        }
        return null;
    }

    public Room vacateRoom(int roomNumber) {
        Room roomToVacate = roomRepository.findByRoomNumber(roomNumber);
        if (roomToVacate != null) {

            BillDTO billInfo = calculateBill(roomNumber);
            if (billInfo != null && roomToVacate.getCustomerName() != null) {
                GuestHistory history = new GuestHistory();
                history.setCustomerName(roomToVacate.getCustomerName());
                history.setCustomerContact(roomToVacate.getCustomerContact());
                history.setRoomNumber(roomNumber);
                history.setRoomBill(billInfo.getRoomPrice());
                history.setFoodBill(billInfo.getFoodTotal());
                history.setTotalBill(billInfo.getGrandTotal());
                history.setCheckOutDate(LocalDateTime.now());
                guestHistoryRepository.save(history);
            }

            foodOrderRepository.deleteByRoomNumber(roomNumber);
            roomToVacate.setBooked(false);
            roomToVacate.setCustomerName(null);
            roomToVacate.setCustomerContact(null);
            return roomRepository.save(roomToVacate);
        }
        return null;
    }

    public BillDTO calculateBill(int roomNumber) {
        Room room = roomRepository.findByRoomNumber(roomNumber);
        if (room == null)
            return null;

        List<FoodOrder> foodOrders = foodOrderRepository.findByRoomNumber(roomNumber);
        double roomPrice = room.getPrice();
        double foodTotal = foodOrders.stream().mapToDouble(FoodOrder::getItemPrice).sum();
        double grandTotal = roomPrice + foodTotal;

        BillDTO bill = new BillDTO();
        bill.setRoomPrice(roomPrice);
        bill.setFoodItems(foodOrders);
        bill.setFoodTotal(foodTotal);
        bill.setGrandTotal(grandTotal);
        return bill;
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public java.util.List<com.hotel.hotel_app.model.CustomerDashboardDTO> getCustomerDashboard() {
        List<Customer> customers = customerRepository.findAll();
        java.util.List<com.hotel.hotel_app.model.CustomerDashboardDTO> dashboardList = new java.util.ArrayList<>();

        for (Customer c : customers) {
            Room activeRoom = roomRepository.findByCustomerContact(c.getContact());

            if (activeRoom != null) {
                BillDTO bill = calculateBill(activeRoom.getRoomNumber());

                dashboardList.add(new com.hotel.hotel_app.model.CustomerDashboardDTO(
                        c.getId(),
                        c.getName(),
                        c.getContact(),
                        String.valueOf(activeRoom.getRoomNumber()),
                        "Occupied",
                        bill.getRoomPrice(),
                        bill.getFoodTotal(),
                        bill.getGrandTotal(),
                        "Pending"));
            } else {
                dashboardList.add(new com.hotel.hotel_app.model.CustomerDashboardDTO(
                        c.getId(),
                        c.getName(),
                        c.getContact(),
                        "---",
                        "Checked Out",
                        0.00,
                        0.00,
                        0.00,
                        "Paid"));
            }
        }
        return dashboardList;
    }
}