# Backend API Documentation

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Setup
Create a `.env` file in the backend directory (copy from `.env.example`):
```
MONGO_URI=mongodb://localhost:27017/quantyx
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**For MongoDB Atlas (Cloud)**:
1. Create a cluster at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/dbname`
3. Replace `MONGO_URI` in `.env`

### 3. Run the Server
```bash
npm run start     # Production mode
npm run dev       # Development mode
npm run server    # Quick start
```

Server runs on `http://localhost:3001`

---

## API Endpoints

### Authentication Routes

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response (201):
{
  "message": "User registered successfully",
  "user": { id, name, email, createdAt },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
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

Response (200):
{
  "message": "Login successful",
  "user": { id, name, email, createdAt },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

#### Refresh Token
```
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}

Response (200):
{
  "message": "Token refreshed",
  "accessToken": "eyJhbGc..."
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <accessToken>

Response (200):
{
  "user": { id, name, email, createdAt }
}
```

#### Update Profile
```
PUT /api/auth/profile
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com"
}

Response (200):
{
  "message": "Profile updated successfully",
  "user": { id, name, email, createdAt }
}
```

#### Logout
```
POST /api/auth/logout
Authorization: Bearer <accessToken>

Response (200):
{
  "message": "Logout successful"
}
```

---

## Market Data Routes

#### Get NSE Symbols List
```
GET /api/symbols
Response: { symbols: [...] }
```

#### Get Stock Quotes
```
GET /api/quotes?symbols=RELIANCE,TCS,INFY
Response: { quotes: [...] }
```

#### Get Candlestick Data
```
GET /api/candles?symbol=RELIANCE&range=1mo&interval=1d
Response: { candles: [...] }
```

#### Get Technical Analysis
```
GET /api/technicals?symbol=RELIANCE
Response: { rsi, macd, ... }
```

#### Get Market Heatmap
```
GET /api/heatmap
Response: { sectors: [...] }
```

---

## Error Handling

All errors follow this format:
```json
{
  "error": "Error message here"
}
```

### Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid token)
- `404` - Not Found
- `500` - Server Error

---

## Security Features

✅ **Password Hashing**: Bcrypt with salt (10 rounds)
✅ **JWT Tokens**: Secure token-based authentication
✅ **CORS**: Configured for localhost
✅ **Input Validation**: Email, password, name validation
✅ **Token Expiry**: Access tokens expire in 7 days, refresh tokens in 30 days
✅ **Refresh Token Rotation**: New refresh token on each login/refresh

---

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String (required, 2-100 chars),
  email: String (required, unique, valid format),
  password: String (required, hashed, not returned),
  googleId: String (optional, for OAuth),
  refreshToken: String (optional, secure storage),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Profile (replace TOKEN with real access token)
```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

---

## Frontend Integration

The frontend should:
1. Store `accessToken` and `refreshToken` from login/register response
2. Send `Authorization: Bearer <accessToken>` header with protected requests
3. On 401 response, use `refreshToken` to get new `accessToken` via `/api/auth/refresh`
4. Retry original request with new token
5. Clear tokens and redirect to login if refresh fails

See `frontend/src/services/httpClient.js` for axios interceptor implementation.

---

## Troubleshooting

**MongoDB Connection Failed**
- Ensure MongoDB is running locally: `mongod`
- Or update `MONGO_URI` to your MongoDB Atlas cluster

**CORS Error**
- Ensure `FRONTEND_URL` is set in `.env`
- Check that frontend origin matches CORS whitelist

**JWT Token Invalid**
- Verify `JWT_SECRET` matches frontend
- Check token hasn't expired

**Port Already in Use**
- Change `PORT` in `.env`
- Or kill the process: `lsof -ti:3001 | xargs kill`

---

## Project Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── models/
│   └── User.js            # User schema
├── controllers/
│   └── authController.js  # Auth logic
├── routes/
│   └── auth.js            # Auth endpoints
├── middleware/
│   ├── auth.js            # JWT verification
│   └── errorHandler.js    # Error handling
├── utils/
│   └── validators.js      # Input validation
├── .env.example           # Environment template
├── .env                   # Environment variables (git ignored)
├── package.json           # Dependencies
└── server.js              # Express app entry point
```

---

## Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ORM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT tokens
- **cors** - Cross-origin requests
- **dotenv** - Environment variables

---

## Next Steps

1. ✅ Setup MongoDB
2. ✅ Configure `.env`
3. ✅ Run backend: `npm run server`
4. ✅ Test endpoints with cURL or Postman
5. ✅ Connect frontend via `frontend/src/services/httpClient.js`
6. ⏳ Setup Google OAuth (optional)
7. ⏳ Deploy to production

---

**Last Updated**: April 2026
**Version**: 4.0.0
