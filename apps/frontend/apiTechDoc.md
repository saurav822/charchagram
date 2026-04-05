
---

## 1. User Management (`/users`)

### 1.1 User Registration
**Endpoint:** `POST /users/register`  
**Description:** Register a new user account  
**Authentication:** Not required  

**Request Payload:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "password123"
}
```

**Response:**
- **Success (200):**
```json
{
  "_id": "60f1a2b3c4d5e6f7g8h9i0j1",
  "name": "John Doe",
  "email": "john@example.com"
}
```
- **Headers:** `x-auth-token: <jwt_token>`
- **Error (400):** Validation error message or "User already registered"

---

### 1.2 User Login
**Endpoint:** `POST /users/login`  
**Description:** Authenticate user and get JWT token  
**Authentication:** Not required  

**Request Payload:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
- **Success (200):** JWT token string
- **Error (400):** "Invalid email or password"

---

### 1.3 Get Current User Profile
**Endpoint:** `GET /users/me`  
**Description:** Get authenticated user's profile  
**Authentication:** Required  

**Request Payload:** None

**Response:**
- **Success (200):**
```json
{
  "_id": "60f1a2b3c4d5e6f7g8h9i0j1",
  "name": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "isAdmin": false
}
```
- **Error:** "this user doesn't exists in the database!"

---

### 1.4 Get User by ID
**Endpoint:** `GET /users/:id`  
**Description:** Get user profile by user ID  
**Authentication:** Not required  

**Request Payload:** None

**Response:**
- **Success (200):** Same structure as `/users/me`
- **Error:** "this user doesn't exists in the database!"

---

### 1.5 User Logout
**Endpoint:** `POST /users/logout`  
**Description:** Logout user (currently not implemented)  
**Authentication:** Not required  

**Request Payload:** None  
**Response:** Not implemented

---

## 2. Posts (`/posts`)

### 2.1 Get All Posts
**Endpoint:** `GET /posts`  
**Description:** Retrieve all posts with author information  
**Authentication:** Not required  

**Request Payload:** None

**Response:**
- **Success (200):**
```json
[
  {
    "_id": "60f1a2b3c4d5e6f7g8h9i0j1",
    "title": "How to Learn React?",
    "description": "I'm new to React and looking for resources...",
    "constituency": "Nalanda",
    "author": {
      "name": "John Doe"
    },
    "tags": [
      {
        "_id": "60f1a2b3c4d5e6f7g8h9i0j2",
        "name": "react",
        "used": 5
      }
    ],
    "views": 42,
    "upvotes": ["60f1a2b3c4d5e6f7g8h9i0j3"],
    "time": "2024-01-01T10:00:00.000Z"
  }
]
```

---

### 2.2 Get Posts by Constituency
**Endpoint:** `GET /posts/constituency/:area_name`  
**Description:** Get all posts for a specific constituency  
**Authentication:** Not required  

**Request Payload:** None

**Response:**
- **Success (200):** Array of posts for the specified constituency
- **Error (400):** "Constituency not found" or error message

---

### 2.3 Get Post by ID
**Endpoint:** `GET /posts/:id`  
**Description:** Get specific post with incremented view count  
**Authentication:** Not required  

**Request Payload:** None

**Response:**
- **Success (200):** Single post object (same structure as above)
- **Error:** Error message if post not found

---

### 2.4 Create Post
**Endpoint:** `POST /posts/create`  
**Description:** Create a new post with constituency and tags  
**Authentication:** Required  

**Request Payload:**
```json
{
  "title": "How to Learn React?",
  "description": "I'm new to React and looking for resources...",
  "constituency": "Nalanda",
  "tags": ["60f1a2b3c4d5e6f7g8h9i0j2"]
}
```

**Response:**
- **Success (200):** "Post successfully created."
- **Error (400):** Validation error, "Invalid Tag", or "Invalid Constituency"

---

### 2.5 Like/Unlike Post
**Endpoint:** `PUT /posts/like/:id`  
**Description:** Toggle like/unlike on a post  
**Authentication:** Required  

**Request Payload:** None

**Response:**
- **Success (200):** Updated post object with populated author
- **Error (400):** "Post doesn't exists" or "You can't upvote your own post"

---

## 3. Replies (`/reply`)

### 3.1 Get Replies for Post
**Endpoint:** `GET /reply/:id`  
**Description:** Get all replies for a specific post  
**Authentication:** Not required  

**Request Payload:** None

**Response:**
- **Success (200):**
```json
[
  {
    "_id": "60f1a2b3c4d5e6f7g8h9i0j4",
    "post": "60f1a2b3c4d5e6f7g8h9i0j1",
    "comment": "Great question! I recommend starting with the official docs...",
    "author": {
      "name": "Jane Smith",
      "username": "janesmith"
    },
    "upvotes": ["60f1a2b3c4d5e6f7g8h9i0j5"],
    "time": "2024-01-01T11:00:00.000Z"
  }
]
```
- **Error (400):** "The Post with given ID doesn't exists!"

---

### 3.2 Create Reply
**Endpoint:** `POST /reply/create/:id`  
**Description:** Create a reply to a post  
**Authentication:** Required  

**Request Payload:**
```json
{
  "comment": "Great question! I recommend starting with the official docs..."
}
```

**Response:**
- **Success (200):** Created reply object with populated author
- **Error (400):** Validation error or "The Post with given ID doesn't exists!"

---

### 3.3 Like/Unlike Reply
**Endpoint:** `PUT /reply/like/:id`  
**Description:** Toggle like/unlike on a reply  
**Authentication:** Required  

**Request Payload:** None

**Response:**
- **Success (200):** Updated reply object with populated author
- **Error (400):** "reply doesn't exists" or "You can't upvote your own reply"

---

## 4. Comments (`/comments`)

### 4.1 Get Comments for Reply
**Endpoint:** `GET /comments/reply/:id`  
**Description:** Get all comments for a specific reply  
**Authentication:** Not required  

**Request Payload:** None

**Response:**
- **Success (200):**
```json
[
  {
    "_id": "60f1a2b3c4d5e6f7g8h9i0j6",
    "reply": "60f1a2b3c4d5e6f7g8h9i0j4",
    "comment": "I agree with this approach!",
    "author": {
      "name": "Mike Johnson",
      "username": "mikej"
    },
    "upvotes": ["60f1a2b3c4d5e6f7g8h9i0j7"],
    "time": "2024-01-01T12:00:00.000Z"
  }
]
```
- **Error (400):** "The Reply with given ID doesn't exists!"

---

### 4.2 Create Comment
**Endpoint:** `POST /comments/create/:id`  
**Description:** Create a comment on a reply  
**Authentication:** Required  

**Request Payload:**
```json
{
  "comment": "I agree with this approach!"
}
```

**Response:**
- **Success (200):** Created comment object with populated author
- **Error (400):** Validation error or "The Reply with given ID doesn't exists!"

---

### 4.3 Like/Unlike Comment
**Endpoint:** `PUT /comments/like/:id`  
**Description:** Toggle like/unlike on a comment  
**Authentication:** Required  

**Request Payload:** None

**Response:**
- **Success (200):** Updated comment object with populated author
- **Error (400):** "Comment doesn't exists" or "You can't upvote your own comment"

---

## 5. Constituencies (`/constituencies`)

### 5.1 Get All Constituencies
**Endpoint:** `GET /constituencies`  
**Description:** Retrieve all available constituencies  
**Authentication:** Not required  

**Request Payload:** None

**Response:**
- **Success (200):**
```json
[
  {
    "_id": "68a0a0f9aaa00fb724a96771",
    "area_name": "Nalanda"
  },
  {
    "_id": "68a0a0f9aaa00fb724a9676f",
    "area_name": "Patna Sahib"
  }
]
```

---

### 5.2 Get Constituency by Area Name
**Endpoint:** `GET /constituencies/:area_name`  
**Description:** Get detailed information about a specific constituency  
**Authentication:** Not required  

**Request Payload:** None

**Response:**
- **Success (200):** Constituency object with detailed information
- **Error (400):** "Constituency not found"

---

## 6. Tags (`/tags`)

### 6.1 Get All Tags
**Endpoint:** `GET /tags`  
**Description:** Retrieve all available tags  
**Authentication:** Not required  

**Request Payload:** None

**Response:**
- **Success (200):**
```json
[
  {
    "_id": "60f1a2b3c4d5e6f7g8h9i0j2",
    "name": "react",
    "used": 5
  },
  {
    "_id": "60f1a2b3c4d5e6f7g8h9i0j6",
    "name": "javascript",
    "used": 12
  }
]
```

---

### 6.2 Create Tag
**Endpoint:** `POST /tags`  
**Description:** Create a new tag (Admin only)  
**Authentication:** Required + Admin  

**Request Payload:**
```json
{
  "name": "newtag"
}
```

**Response:**
- **Success (200):**
```json
{
  "_id": "60f1a2b3c4d5e6f7g8h9i0j7",
  "name": "newtag",
  "used": 0
}
```
- **Error (400):** "enter a valid tag"

---

## 7. Data Models

### User Model
```json
{
  "_id": "ObjectId",
  "name": "String (5-50 chars)",
  "email": "String (5-255 chars, unique)",
  "username": "String (3-50 chars, unique)",
  "password": "String (5-1024 chars, hashed)",
  "isAdmin": "Boolean (default: false)"
}
```

### Post Model
```json
{
  "_id": "ObjectId",
  "title": "String (10-80 chars)",
  "description": "String (5-1024 chars)",
  "constituency": "String (required, must match existing constituency)",
  "tags": "Array of Tag objects",
  "author": "ObjectId (ref: User)",
  "views": "Number (default: 1)",
  "upvotes": "Array of ObjectIds (ref: User)",
  "time": "Date (default: now)"
}
```

### Reply Model
```json
{
  "_id": "ObjectId",
  "post": "ObjectId (ref: Post)",
  "comment": "String (3-5000 chars)",
  "author": "ObjectId (ref: User)",
  "upvotes": "Array of ObjectIds (ref: User)",
  "time": "Date (default: now)"
}
```

### Comment Model
```json
{
  "_id": "ObjectId",
  "reply": "ObjectId (ref: Reply)",
  "comment": "String (3-1000 chars)",
  "author": "ObjectId (ref: User)",
  "upvotes": "Array of ObjectIds (ref: User)",
  "time": "Date (default: now)"
}
```

### Tag Model
```json
{
  "_id": "ObjectId",
  "name": "String (5-25 chars)",
  "used": "Number (default: 0)"
}
```

### Constituency Model
```json
{
  "_id": "ObjectId",
  "area_name": "String (unique, required)",
  "vidhayak_info": "Object (MLA information)",
  "dept_info": "Array (department information)",
  "other_candidates": "Array (other candidates)",
  "latest_news": "Array (latest news)"
}
```

---

## 8. Error Responses

### Common Error Status Codes
- **400 Bad Request:** Validation errors, invalid data
- **401 Unauthorized:** Missing or invalid authentication token
- **403 Forbidden:** Insufficient permissions (e.g., non-admin trying to create tags)
- **404 Not Found:** Constituency, post, reply, or comment not found

### Error Response Format
```json
{
  "error": "Error message description"
}
```

---

## 9. Authentication Flow

1. **Register** → Get JWT token in `x-auth-token` header
2. **Login** → Get JWT token
3. **Use token** → Include in `x-auth-token` header for protected endpoints
4. **Token contains:** User ID and admin status

---

## 10. New Features Summary

### Constituency-Based Posts
- Posts are now associated with specific constituencies
- Users can fetch posts by constituency using `/posts/constituency/:area_name`
- Creating a post requires specifying a constituency
- Constituency validation ensures posts are linked to valid areas

### Enhanced Discussion System
- **Posts** → **Replies** → **Comments** hierarchy
- Users can reply to posts and comment on replies
- Each level supports upvoting/downvoting
- Full discussion threading capability

### Tag and Constituency Management
- Posts can have multiple tags and one constituency
- Tags are validated against existing tag database
- Constituencies are validated against existing constituency database
- Admin users can create new tags

---

## 11. Notes

- All timestamps are in ISO 8601 format
- ObjectIds are MongoDB ObjectId strings
- Populated fields (like author names) are automatically included in responses
- View counts are automatically incremented when posts are accessed
- Upvotes are toggle-based (clicking again removes the upvote)
- Tags and constituencies must exist before they can be used in posts
- Admin users have additional privileges (tag creation)
- Constituency-based filtering enables location-specific discussions
- The three-tier discussion system (Post → Reply → Comment) provides comprehensive community engagement