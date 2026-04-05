# Charcha Manch Node.js Backend

A Node.js backend application built with Express.js and MongoDB Atlas for managing constituency information, representative details, departments, and candidate data.

## 🚀 Features

- **RESTful API** for constituency management
- **MongoDB Atlas** integration with Mongoose ODM
- **UUID generation** for department IDs
- **Input validation** and sanitization
- **Comprehensive error handling**
- **Security middleware** (Helmet, CORS)
- **Logging** with Morgan
- **ES6 Modules** for modern JavaScript
- **Production-ready** configuration

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **ODM**: Mongoose
- **Validation**: express-validator
- **Security**: Helmet, CORS
- **Logging**: Morgan
- **Environment**: dotenv
- **Modules**: ES6 Modules (ESM)

## 📋 Prerequisites

- Node.js (v18.0.0 or higher)
- MongoDB Atlas account
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd charchamanchNodejs
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the example environment file and configure your MongoDB Atlas connection:

```bash
cp env.example .env
```

Edit `.env` file with your MongoDB Atlas credentials:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/constituency_db
PORT=3000
NODE_ENV=development
```

### 4. Run the Application

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

**Seed database:**
```bash
npm run seed
```

The server will start on `http://localhost:3000`

## 🗄️ MongoDB Atlas Setup

### 1. Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new project

### 2. Create a Cluster

1. Click "Build a Database"
2. Choose "FREE" tier (M0)
3. Select your preferred cloud provider and region
4. Click "Create"

### 3. Set Up Database Access

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Create a username and password
4. Select "Read and write to any database"
5. Click "Add User"

### 4. Set Up Network Access

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add your specific IP addresses

### 5. Get Connection String

1. Go to "Database" in the left sidebar
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<username>`, `<password>`, and `<database>` with your values

## 📊 Database Schema

### Constituency Collection

```javascript
{
  area_name: String, // Unique identifier
  vidhayak_info: {
    name: String,
    image_url: String,
    age: Number,
    last_election_vote_percentage: String,
    experience: Number,
    party_name: String,
    party_icon_url: String,
    manifesto_link: String,
    metadata: {
      education: String,
      net_worth: String,
      criminal_cases: Number,
      attendance: String,
      questions_asked: Number,
      funds_utilisation: String
    }
  },
  dept_info: [
    {
      id: String, // UUID
      dept_name: String,
      work_info: [String],
      survey_score: [
        {
          question: String,
          yes_votes: Number,
          no_votes: Number
        }
      ]
    }
  ],
  other_candidates: [
    {
      id: Number,
      candidate_name: String,
      candidate_party: String,
      vote_share: String
    }
  ]
}
```

## 🔌 API Endpoints

### Base URL: `http://localhost:3000`

### 1. Health Check
```
GET /health
```
Returns server status and health information.

### 2. Get All Constituencies
```
GET /api/constituencies
```
Returns a list of all constituency area names for dropdown selection.

**Response:**
```json
[
  { "area_name": "Mumbai Central" },
  { "area_name": "Delhi North" }
]
```

### 3. Get Constituency Details
```
GET /api/constituencies/:area_name
```
Returns complete information for a specific constituency.

**Parameters:**
- `area_name`: URL-encoded constituency name (e.g., "Mumbai%20Central")

**Response:**
```json
{
  "area_name": "Mumbai Central",
  "vidhayak_info": { ... },
  "dept_info": [ ... ],
  "other_candidates": [ ... ]
}
```

### 4. Root Endpoint
```
GET /
```
Returns API documentation and available endpoints.

## 🧪 Testing the API

### Using cURL

**Get all constituencies:**
```bash
curl http://localhost:3000/api/constituencies
```

**Get specific constituency:**
```bash
curl http://localhost:3000/api/constituencies/Mumbai%20Central
```

**Health check:**
```bash
curl http://localhost:3000/health
```

### Using Postman

1. Import the following collection:
   - `GET` `{{base_url}}/health`
   - `GET` `{{base_url}}/api/constituencies`
   - `GET` `{{base_url}}/api/constituencies/{{area_name}}`

2. Set environment variable:
   - `base_url`: `http://localhost:3000`
   - `area_name`: `Mumbai Central`

## 🗃️ Database Seeding

Populate the database with sample data:

```bash
npm run seed
```

This will:
- Connect to MongoDB Atlas
- Clear existing data
- Insert sample constituencies with proper UUIDs
- Verify the insertion

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Input Validation**: Sanitization and validation
- **Environment Variables**: Secure configuration
- **Error Handling**: No sensitive information exposure

## 🚀 Deployment

### Vercel Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard

### Heroku Deployment

1. Create Heroku app:
```bash
heroku create your-app-name
```

2. Set environment variables:
```bash
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
heroku config:set NODE_ENV=production
```

3. Deploy:
```bash
git push heroku main
```

## 📁 Project Structure

```
charchamanchNodejs/
├── src/
│   ├── models/
│   │   └── constituency.js      # Mongoose schema
│   ├── routes/
│   │   └── constituencies.js    # API routes
│   ├── config/
│   │   └── db.js               # Database connection
│   ├── utils/
│   │   └── sampleData.js       # Sample data utilities
│   ├── scripts/
│   │   └── seedDatabase.js     # Database seeding
│   └── server.js               # Main server file
├── .env                        # Environment variables
├── env.example                 # Example environment file
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify your connection string
   - Check network access settings
   - Ensure username/password are correct

2. **Port Already in Use**
   - Change PORT in .env file
   - Kill existing process: `lsof -ti:3000 | xargs kill -9`

3. **Validation Errors**
   - Check data format in sample data
   - Verify UUID generation
   - Review schema requirements

### Logs

Check console output for detailed error messages and connection status.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

---

**Happy Coding! 🎉**
