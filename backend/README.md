# CropContract Backend API

Backend server for the CropContract platform - A MERN stack application for contract farming.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env` file and update with your credentials
   - Add your MongoDB connection string
   - Set a strong JWT secret

3. Start the development server:
```bash
npm run dev
```

4. For production:
```bash
npm start
```

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── middleware/
│   └── authMiddleware.js  # JWT authentication & authorization
├── models/
│   └── User.js            # User model schema
├── routes/
│   └── authRoutes.js      # Authentication routes
├── .env                   # Environment variables
├── .gitignore            # Git ignore file
├── server.js             # Express server entry point
└── package.json          # Dependencies and scripts
```

## 🔌 API Endpoints

### Authentication Routes

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Farmer",
  "location": "Maharashtra"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5ec49f1b2c72b8c8e4f1a",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Farmer",
    "location": "Maharashtra",
    "createdAt": "2024-10-31T10:30:00.000Z"
  }
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5ec49f1b2c72b8c8e4f1a",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Farmer",
    "location": "Maharashtra",
    "createdAt": "2024-10-31T10:30:00.000Z"
  }
}
```

#### Get Current User (Protected)
```
GET /api/auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "60d5ec49f1b2c72b8c8e4f1a",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Farmer",
    "location": "Maharashtra",
    "createdAt": "2024-10-31T10:30:00.000Z"
  }
}
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens expire after 30 days.

## 📦 Dependencies

### Production
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `cors` - Cross-Origin Resource Sharing
- `dotenv` - Environment variables

### Development
- `nodemon` - Auto-restart server on changes

## 🔧 Environment Variables

Create a `.env` file in the backend directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=development
```

## 🛡️ Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token-based authentication
- Protected routes with middleware
- Role-based access control (Farmer/Buyer)
- Input validation
- Email uniqueness validation

## 📝 User Model

```javascript
{
  name: String (required, max 50 chars),
  email: String (required, unique, validated),
  password: String (required, min 6 chars, hashed),
  role: String (required, enum: ['Farmer', 'Buyer']),
  location: String (optional),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

## 🧪 Testing with Postman

1. **Register a new user:**
   - Method: POST
   - URL: `http://localhost:5000/api/auth/register`
   - Body: JSON with name, email, password, role

2. **Login:**
   - Method: POST
   - URL: `http://localhost:5000/api/auth/login`
   - Body: JSON with email, password

3. **Get user profile:**
   - Method: GET
   - URL: `http://localhost:5000/api/auth/me`
   - Headers: `Authorization: Bearer <token>`

## 🚦 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## 📄 License

MIT License

---

**Status**: ✅ Backend Ready for Development
