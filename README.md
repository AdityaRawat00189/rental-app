# 🏠 Rental App

A college rental platform built with **Node.js**, **Express**, **MongoDB**, and **React (Vite)**.  

Campus-Link is a hyper-local, student-to-student sharing economy platform built to eliminate the high cost of "one-semester" college essentials. It allows students to monetize idle belongings like engineering tools, lab gear, and books by renting them to peers within their own campus ecosystem.

---

## 🚀 Features
🎓 College-Specific Scoping: Users only see items available within their own college. The marketplace is automatically filtered based on the user's verified college domain.

🔐 Academic Verification: Registration is restricted to users with verified college emails (.edu, .ac.in), ensuring a trusted community.

📸 Multi-Image Support: Professional image processing pipeline using Multer and Cloudinary for high-quality product galleries.

🛡️ Secure Transactions: JWT-based authentication with custom middleware to protect user data and listing ownership.

📊 Status Management: Real-time tracking of item availability (Available, Booked, Under Maintenance, Hidden).

💼 Dashboard: Dedicated views for "My Lended Items" and "My Rental Requests."

---

## 💻 Tech Stack
Backend: "Node.js, Express.js"
Database: MongoDB (Mongoose ODM)
Auth: "JSON Web Tokens (JWT), Bcrypt.js"
Files: "Multer, Cloudinary API"
Validation: Custom Domain-locking & OTP Verification

## 📂 Project Structure

## 🗺️ API Endpoints

🔑 Authentication (/api/auth):

   1. POST: /signup,Register new student (Domain locked), Public
   2. POST: /verify-otp,Verify email via 6-digit OTP, Public
   3. POST: /resend-otp,Resend 6-digit OTP to email, Public
   4. POST: /login,Authenticate user & get Token, Public

📦 Item Management (/api/items):
   1. GET: id ,Get full details of a specific item, Private
   2. GET: my-items, Get all items listed by the current user, Private
   3. POST: create, Create a new listing (Supports multi-image(max 5 images)), Private
   4. PUT: id, Update a listing (Owner only), Private
   5. DELETE: id, Remove a listing & *Cloudinary images, Private


🤝 Booking System (/api/bookings): 

## 🛠️ Installation & Setup


## Routes Required
🔑 Authentication (/api/auth):

   1. POST: /signup,Register new student (Domain locked), Public, completed
   2. POST: /verify-otp,Verify email via 6-digit OTP, Public, completed
   3. POST: /resend-otp,Resend 6-digit OTP to email, Public, completed
   4. POST: /login,Authenticate user & get Token, Public, completed
   5. POST: /google-login,Authenticate user without ID and Password(Google OAuth), Public, Prending

📦 Item Management (/api/items):

   1. GET: /id ,Get full details of a specific item, Private, completed
   2. GET: /my-items, Get all items listed by the current user, Private, completed
   3. POST: /create, Create a new listing (Supports multi-image(max 5 images)), Private, completed
   4. PUT: /id, Update a listing (Owner only), Private, completed
   5. DELETE: /id, Remove a listing & *Cloudinary images, Private, completed
   <!-- 6. GET: /lended-items, Get all Booked items of User with lender Info, Private, Pending -->
   
🤝 Booking System (/api/bookings): 
   1. 

🤝  System (/api/bookings): 

## Features
Add msg send with req ,on booking item
Automate a msg to gmail, to lender and owner using `CRON` before 36 hours after 12 hours each
View All Lended items with deadline by the lender
Add 1-1 personal Messaging feature
Add Rating Route,active after deadline (for lender , renter, item)
Add OTP verify before handling the item(to screen not on email)
Add filter by categories
