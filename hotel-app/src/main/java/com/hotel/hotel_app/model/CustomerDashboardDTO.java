package com.hotel.hotel_app.model;

public class CustomerDashboardDTO {
    private Long id;
    private String name;
    private String contact;
    private String roomNumber;
    private String roomStatus;
    private double foodBill;
    private double roomBill;
    private double totalBill;

    private String billStatus;

    public CustomerDashboardDTO(Long id, String name, String contact, String roomNumber, String roomStatus,
            double roomBill, double foodBill, double totalBill, String billStatus) {
        this.id = id;
        this.name = name;
        this.contact = contact;
        this.roomNumber = roomNumber;
        this.roomStatus = roomStatus;
        this.roomBill = roomBill;
        this.foodBill = foodBill;
        this.totalBill = totalBill;
        this.billStatus = billStatus;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getContact() {
        return contact;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public String getRoomStatus() {
        return roomStatus;
    }

    public double getfoodBill() {
        return foodBill;
    }

    public double getroomBill() {
        return roomBill;
    }

    public double gettotalBill() {
        return totalBill;
    }

    public String getBillStatus() {
        return billStatus;
    }
}