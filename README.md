# Hotel Management System

A full-stack application designed to streamline hotel operations. This system handles room management, guest bookings, and billing efficiently.

## 🚀 Tech Stack
* **Frontend:** React.js, Vite, CSS
* **Backend:** Java, Spring Boot
* **Database:** PostgreSQL / MySQL
* **Build Tools:** Maven, npm

## 📂 Project Structure
This repository is a monorepo containing:
* `/hotel-frontend` - The User Interface (React)
* `/hotel-app` - The Backend Logic (Spring Boot)

## ⚙️ How to Run Locally

### 1. Backend Setup
1.  Navigate to the backend folder: `cd hotel-app`
2.  Update `application.properties` with your database credentials.
3.  Run the application:
    ```bash
    ./mvnw spring-boot:run
    ```

### 2. Frontend Setup
1.  Open a new terminal and navigate to the frontend: `cd hotel-frontend`
2.  Install dependencies: `npm install`
3.  Start the development server:
    ```bash
    npm run dev
    ```