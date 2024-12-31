# Food Delivery Platform

- This repository contains a web application platform that connects users with local restaurants for food delivery. 
- Users can browse restaurants, add items to their cart, track their orders, and leave reviews.

## Features

- **Restaurant Management**: Displays `restaurants` with menus and details.
  
- **User Authentication**: Secure user `login` and `registration` using `sessions` and `bcrypt`.
  
- **Real-time Order Tracking**: Track the status of `orders` with `estimated delivery time`.
  
- **Reviews and Ratings**: Users can leave `reviews` and `rate` their experience.
  
- **Cart Management**: `Add`, `update`, and `delete` items from the shopping cart.
  
- **Delivery Scheduling**: Manage delivery `times` and `costs`.
  
- **Admin Panel**: Restricted area for `admins` to manage the system.
  


## Project Structure

- **/controllers**:         *Contains logic for handling `routes`
  
- **/data**:                *`MongoDB` database configuration.*
  
- **/middlewares**:         *Middleware for authentication, `CSRF`, etc.*
  
- **/public**:             *Static files like `CSS` and images.*
  
- **/routes**:             *`Application routing` (user, admin, auth).*
  
- **/session**:            *`Session` configuration.*
  
- **/views**:             *`EJS` templates for rendering pages.*
  
## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/) running locally or accessible remotely

### Steps
1. Clone the repository:
  ```bash
  git clone https://github.com/your-username/food-delivery-platform.git
  cd food-delivery-platform
  ```
2. Install dependencies:
  ```bash
  npm install
  ```
3. Start the application:
  ```bash
  npm start
  ```
### Usage:
- Navigate to `http://localhost:5000` to access the application.
  
- Users can browse restaurants, manage their cart, place orders, and leave reviews.
  
- Admins can access restricted routes for administrative tasks.

## Technologies Used
- **Backend**: `Node.js`, `Express.js`
  
- **Database**: `MongoDB`
  
- **Frontend**: `EJS` (Embedded JavaScript templates)
  
- **Authentication**: `Sessions`, `bcrypt`, `CSRF protection`

