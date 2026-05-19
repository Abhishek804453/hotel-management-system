-- Update Room Prices to Rupees
UPDATE room SET price = 1000.00 WHERE room_number = 101;
UPDATE room SET price = 1500.00 WHERE room_number = 102;
UPDATE room SET price = 2000.00 WHERE room_number = 201;
UPDATE room SET price = 2500.00 WHERE room_number = 202;

-- Update Food Prices to Rupees
UPDATE food_item SET price = 149.00 WHERE name = 'Classic Burger';
UPDATE food_item SET price = 299.00 WHERE name = 'Margherita Pizza';
UPDATE food_item SET price = 129.00 WHERE name = 'Caesar Salad';
UPDATE food_item SET price = 249.00 WHERE name = 'Spaghetti Carbonara';