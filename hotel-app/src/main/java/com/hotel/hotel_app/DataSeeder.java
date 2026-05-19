package com.hotel.hotel_app;

import com.hotel.hotel_app.model.FoodItem;
import com.hotel.hotel_app.model.Room;
import com.hotel.hotel_app.repository.FoodItemRepository;
import com.hotel.hotel_app.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private FoodItemRepository foodItemRepository;

    @Override
    public void run(String... args) throws Exception {

        if (roomRepository.count() == 0) {
            Room r1 = new Room();
            r1.setRoomNumber(101);
            r1.setRoomType("Single (Non-AC)");
            r1.setPrice(1000.0);
            Room r2 = new Room();
            r2.setRoomNumber(102);
            r2.setRoomType("Single (AC)");
            r2.setPrice(1500.0);
            Room r3 = new Room();
            r3.setRoomNumber(103);
            r3.setRoomType("Double (Non-AC)");
            r3.setPrice(2000.0);
            Room r4 = new Room();
            r4.setRoomNumber(104);
            r4.setRoomType("Double (AC)");
            r4.setPrice(2500.0);
            Room r5 = new Room();
            r5.setRoomNumber(105);
            r5.setRoomType("Suite (Luxury)");
            r5.setPrice(5000.0);

            roomRepository.save(r1);
            roomRepository.save(r2);
            roomRepository.save(r3);
            roomRepository.save(r4);
            roomRepository.save(r5);
            System.out.println("--- Seeded 5 Demo Rooms ---");
        }

        if (foodItemRepository.count() == 0) {
            FoodItem f1 = new FoodItem();
            f1.setName("Chicken Biryani");
            f1.setPrice(350.0);
            f1.setDescription("Authentic Hyderabadi Dum Biryani");
            FoodItem f2 = new FoodItem();
            f2.setName("Paneer Butter Masala");
            f2.setPrice(250.0);
            f2.setDescription("Rich and creamy paneer curry");
            FoodItem f3 = new FoodItem();
            f3.setName("Veg Pizza");
            f3.setPrice(400.0);
            f3.setDescription("Wood-fired veggie delight");
            FoodItem f4 = new FoodItem();
            f4.setName("Cold Coffee");
            f4.setPrice(150.0);
            f4.setDescription("Refreshing iced coffee");

            foodItemRepository.save(f1);
            foodItemRepository.save(f2);
            foodItemRepository.save(f3);
            foodItemRepository.save(f4);
            System.out.println("--- Seeded 4 Demo Food Items ---");
        }
    }
}
