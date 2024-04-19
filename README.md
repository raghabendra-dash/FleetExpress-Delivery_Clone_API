# FleetExpress - Instant_Delivery_Clone

FleetExpress is a clone app inspired by popular instant delivery services like Swiggy, Blinkit and Zepto. The app aims to provide a seamless and efficient instant delivery experience for various products, including food, groceries, electronics, and more. Users can enjoy quick delivery, real-time tracking, and a user-friendly interface for placing orders and managing deliveries.




### Features:

1. **Welcome Email Feature with Nodemailer:**
   - Automatically sends a welcome email to users upon successful registration.
   - Includes HTML content with the company's brand logo and personalized messages.

2. **Handling Duplicate Key Error in MongoDB:**
   - Ensures that each user's email address is unique to prevent duplicate registrations.
   - Provides clear error messages when a duplicate key error occurs during registration.

3. **Mongoose Middleware for Password Hashing:**
   - Automatically hashes user passwords using bcrypt via Mongoose Middleware before saving to the database.
   - Enhances security by storing hashed passwords instead of plaintext.

4. **Modified Review Deletion Feature:**
   - Allows users to delete only their own reviews to maintain data integrity.
   - Updates product ratings accurately when reviews are deleted.

5. **Controller and Repository for Placing Orders:**
   - Implements a controller to manage order placement, updates, and deletions.
   - Utilizes repository functions for database operations related to orders, ensuring clean and modular code architecture.



## Getting Started

1. **Prerequisites:**
   - Node.js and npm installed on your system.
   - MongoDB installed and running locally or a connection to a MongoDB database.
   - Set Up Postman.
     
**_If you haven't already, download and install Postman, which is a popular API development tool used for testing API endpoints._**

2. **Installation:**
   
   > npm install
