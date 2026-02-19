# Airbnb Project - Property Rental Platform

A full-stack web application built with Node.js, Express, and MongoDB that allows users to browse, list, and book properties. The platform features user authentication, property listings with reviews, secure payment processing, and interactive mapping functionality.

## 🌟 Features

### Core Functionality
- **User Authentication & Authorization**
  - Secure user registration and login with Passport.js
  - Session management with MongoDB store
  - User profile pages for property owners and guests

- **Property Listings**
  - Create, read, update, and delete listings
  - Rich property descriptions with title, location, and pricing
  - Image upload and management via Cloudinary
  - Category-based property filtering
  - Pagination support for browsing listings
  - Geolocation integration with Mapbox

- **Booking System**
  - Browse and filter available properties
  - Secure booking functionality
  - Booking history and management
  - Owner dashboard to view customer bookings

- **Reviews & Ratings**
  - Leave reviews and ratings for properties
  - View all reviews for each listing
  - Review management for property owners

- **Payment Processing**
  - Integrated Razorpay payment gateway
  - Secure checkout process
  - Order and payment tracking

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js (v22.17.1)
- **Framework:** Express.js (v5.1.0)
- **Database:** MongoDB with Mongoose ODM (v8.18.3)

### Frontend
- **Templating Engine:** EJS with EJS-Mate
- **Styling:** Custom CSS
- **Interactive Features:** Vanilla JavaScript
- **Mapping:** Mapbox SDK

### Authentication & Security
- **Auth:** Passport.js with Local Strategy
- **Session:** Express-session with MongoDB store
- **Flash Messages:** Connect-flash for user feedback
- **Password Security:** Passport-local-mongoose

### Third-party Services
- **Payment:** Razorpay (v2.9.6)
- **Cloud Storage:** Cloudinary with Multer integration
- **Geocoding:** Mapbox Geocoding API
- **HTTP Utilities:** Method-override, Cookie-parser

## 📁 Project Structure

```
├── controller/                 # Business logic controllers
│   ├── listings.js            # Listing CRUD operations
│   ├── reviews.js             # Review management
│   └── users.js               # User authentication & profile
├── model/                      # Mongoose schemas
│   ├── listing.js             # Listing schema
│   ├── review.js              # Review schema
│   ├── booking.js             # Booking schema
│   └── user.js                # User schema
├── routes/                     # Express route handlers
│   ├── listings.js            # Listing routes
│   ├── reviews.js             # Review routes
│   └── user.js                # User routes
├── public/                     # Static assets
│   ├── css/                   # Stylesheets
│   │   ├── CStyle.css
│   │   └── RatingCss.css
│   └── javascript/            # Client-side scripts
│       ├── map.js             # Mapbox integration
│       └── script.js           # General scripts
├── views/                      # EJS templates
│   ├── layouts/               # Layout templates
│   ├── listings/              # Listing pages
│   ├── users/                 # User pages (login, signup, profile)
│   ├── bookings/              # Booking pages
│   └── includes/              # Partials (navbar, footer, etc.)
├── init/                       # Database initialization
│   ├── data.js                # Seed data
│   └── index.js               # Init script
├── utility/                    # Helper functions
│   ├── asyncwrap.js           # Async error wrapper
│   ├── ExpressError.js        # Custom error class
│   └── razorpay.js            # Razorpay config
├── index.js                   # Main application entry point
├── middleware.js              # Custom middleware
├── cloudConfig.js             # Cloudinary configuration
├── schema.js                  # Data validation schemas
└── package.json               # Dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js v22.17.1 or higher
- MongoDB Atlas account or local MongoDB instance
- Cloudinary account for image storage
- Mapbox account for geolocation features
- Razorpay account for payment processing

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Tamojit999/airbnb_project.git
   cd airbnb_project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=3000
   ATLASDB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/<database>
   CLOUD_NAME=<your_cloudinary_cloud_name>
   CLOUD_API_KEY=<your_cloudinary_api_key>
   CLOUD_API_SECRET=<your_cloudinary_api_secret>
   MAP_TOKEN=<your_mapbox_token>
   RAZORPAY_KEY_ID=<your_razorpay_key_id>
   RAZORPAY_KEY_SECRET=<your_razorpay_key_secret>
   ```

4. **Initialize the database (optional)**
   ```bash
   node init/index.js
   ```

5. **Start the application**
   ```bash
   npm start
   ```

   The application will be available at `http://localhost:3000`

## 📖 Usage

### For Users
1. **Sign Up:** Create a new account using the signup page
2. **Browse Listings:** View all available properties or filter by category
3. **View Details:** Click on a property to see full details, reviews, and location
4. **Book Property:** Select dates and proceed to checkout with Razorpay
5. **Leave Reviews:** Rate and review properties you've booked

### For Property Owners
1. **Create Listing:** Add new properties with descriptions, images, and pricing
2. **Manage Listings:** Edit or delete your listings
3. **View Bookings:** See customer bookings and details
4. **Monitor Reviews:** Check guest feedback and ratings

## 🔐 Security Features

- Passport.js authentication with secure session management
- Input validation using Joi
- Password hashing with passport-local-mongoose
- CSRF protection through method-override
- Secure payment handling via Razorpay
- Cloudinary for secure image storage

## 🗂️ Database Models

### User
- Stores user credentials, profile information, and authentication details
- Tracks listings owned by users and booking history

### Listing
- Contains property information (title, description, price, location)
- Stores geolocation data for Mapbox integration
- Associates reviews via reference
- Links to owner user

### Review
- Stores user reviews and ratings
- References both user reviewer and listing reviewed

### Booking
- Records transaction details (payment ID, order ID)
- Links customer, owner, and listing
- Tracks payment confirmation

## 📝 API Overview

### Listing Routes
- `GET /listings` - View all listings with pagination
- `GET /listings/new` - Render create listing form
- `POST /listings` - Create new listing
- `GET /listings/:id` - View listing details
- `GET /listings/:id/edit` - Edit listing form
- `PUT /listings/:id` - Update listing
- `DELETE /listings/:id` - Delete listing

### Review Routes
- `POST /listings/:id/reviews` - Add review to listing
- `DELETE /listings/:id/reviews/:reviewId` - Delete review

### User Routes
- `GET /signup` - User signup form
- `POST /signup` - Register new user
- `GET /login` - User login form
- `POST /login` - Authenticate user
- `GET /logout` - Logout user
- `GET /profile` - View user profile
- `GET /owner` - Owner dashboard

## 🛒 Payment Integration

The application uses **Razorpay** for secure payment processing:
- Customers can securely book properties through the checkout page
- Payment confirmation generates a booking record
- Order and payment IDs are stored for reference

## 📍 Mapping Features

**Mapbox integration** provides:
- Display property locations on interactive maps
- Geocoding for location search
- Automatic coordinate conversion for listings

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the package.json file for details.

## 🔗 Links

- **Repository:** https://github.com/Tamojit999/airbnb_project
- **Issues:** https://github.com/Tamojit999/airbnb_project/issues

## 👤 Author

Created as part of the SIGMA 8.0 web development bootcamp.

## 📧 Support

For issues and questions, please open an issue on the [GitHub repository](https://github.com/Tamojit999/airbnb_project/issues).

---

