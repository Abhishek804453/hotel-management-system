package com.hotel.hotel_app.model;

import java.util.List;

public class BillDTO {

    private double roomPrice;
    private double foodTotal;
    private double grandTotal;
    private List<FoodOrder> foodItems; 


    public double getRoomPrice() {
        return roomPrice;
    }

    public void setRoomPrice(double roomPrice) {
        this.roomPrice = roomPrice;
    }

    public double getFoodTotal() {
        return foodTotal;
    }

    public void setFoodTotal(double foodTotal) {
        this.foodTotal = foodTotal;
    }

    public double getGrandTotal() {
        return grandTotal;
    }

    public void setGrandTotal(double grandTotal) {
        this.grandTotal = grandTotal;
    }

    public List<FoodOrder> getFoodItems() {
        return foodItems;
    }

    public void setFoodItems(List<FoodOrder> foodItems) {
        this.foodItems = foodItems;
    }
}