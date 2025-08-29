# MindX Full Stack Web Development Course

A comprehensive guide to full-stack web development using the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Table of Contents

- [Lesson 1: Web Services](#lesson-1-web-services)
- [Lesson 2: Express.js](#lesson-2-expressjs)
- [Lesson 3: JSON Server](#lesson-3-json-server)
- [Lesson 4: MongoDB](#lesson-4-mongodb)
- [Lesson 5: MVC Model & Middleware](#lesson-5-mvc-model--middleware)
- [Lesson 6: Authentication & Authorization](#lesson-6-authentication--authorization)
- [Lesson 7: Password Hashing & Environment Variables](#lesson-7-password-hashing--environment-variables)
- [Lesson 8: Tokens](#lesson-8-tokens)
- [Lesson 9: Database Relationships](#lesson-9-database-relationships)
- [Lesson 10: File Upload](#lesson-10-file-upload)
- [Lesson 11: Data Management](#lesson-11-data-management)
- [Lesson 12: Deployment](#lesson-12-deployment)
- [Lesson 13: Redux Toolkit](#lesson-13-redux-toolkit)
- [Lesson 14: Project Completion](#lesson-14-project-completion)
- [Lesson 15: Final Project](#lesson-15-final-project)

---

## Lesson 1: Web Services

### Overview of Web Services

Web services are a collection of **protocols** and **standards** used to exchange data between applications or systems, making communication between systems easier.

To explain "protocols" and "standards," we first need to understand the Client-Server model.

### Client-Server Model

**Clients**: Applications and devices on the client side, used to interact and organize communication between users and servers by receiving and sending **requests** and receiving **responses** from servers through protocols.

**Server**: The server receives **request** information sent from clients, processes it, and returns processed information (**response**) to clients.

**Protocols**: The way clients communicate with servers. The most common protocol today is **HTTP (HyperText Transfer Protocol)**.

When working with HTTP, we have what's called HTTP Request Methods.

**Standards**: Strict rules and requirements that must be followed. In this course, these are the standards for protocols. Throughout the course, we'll implement **RESTful API** standards using the **MERN Stack** to demonstrate the Client-Server model.

### MERN Stack

**What is MERN Stack?**

MERN Stack is a JavaScript stack that makes development easier, faster, and helps expand projects while quickly adapting to data changes during web full-stack application development.

**Components**:

- **M**ongoDB: Database
- **E**xpress.js: Backend framework
- **R**eact.js: Frontend framework
- **N**ode.js: Runtime environment

**Why choose MERN Stack**: It's a JavaScript stack that makes usage easier, faster, helps expand projects, and quickly adapts to data changes during web full-stack application development.

### Node.js

**Role in MERN Stack**:

- Provides an execution environment for JavaScript programs, allowing users to execute JavaScript on the server side (outside the browser)
- Allows selection and installation of free library packages through Node Package Manager (NPM)
- **NPM**: A default library management program in Node.js that helps organize and install JavaScript libraries for Node.js

**Installation**:

- Download Node.js LTS version from: https://nodejs.org/en
- **Note**: Different NPM versions can affect projects, so we need a version manager called NVM

**NVM Installation**:

- **Windows**: Visit https://github.com/coreybutler/nvm-windows/releases
- **Mac** (requires Homebrew first):
  ```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
  nvm list  # Check installed versions
  nvm use <version>  # Use specific version
  ```

### JavaScript with Node.js

**Executing JavaScript programs with Node.js**:

```bash
node <file_path>
```

**Example**:

```bash
node ./index.js
```

**Path conventions**:

- `.` represents current position
- `/` helps identify which file or folder to use
- `./` accesses files/folders at the same level as current position
- `../` goes up one level from current position

**Important**: Some browser-specific modules won't work in Node.js environment.

### Creating a Server with Node.js

**Basic HTTP server creation**:

```javascript
import http from 'http';

const app = http.createServer((request, response) => {
  // Handle requests here
});

app.listen(8080, () => {
  console.log('Server is running!');
});
```

### HTTP Request Methods

**GET Method**: Client only sends a request to the API, server processes and returns results.

**Example implementation**:

```javascript
import http from 'http';

const listStudent = [
  {
    id: 1,
    fullName: 'Jackie',
    age: 5,
    class: '5A',
  },
  {
    id: 2,
    fullName: 'Juli MTP',
    age: 5,
    class: '5A',
  },
  {
    id: 3,
    fullName: 'Denis',
    age: 5,
    class: '5B',
  },
];

const app = http.createServer((request, response) => {
  const endpoint = request.url;
  const method = request.method;

  switch (endpoint) {
    case '/':
      response.end(`Hello MindX`);
      break;
    case '/students':
      if (method === 'GET') {
        response.end(JSON.stringify(listStudent));
      }
      break;
    default:
      response.end(`404 Not found`);
      break;
  }
});

app.listen(8080, () => {
  console.log('Server is running!');
});
```

**Key points**:

- Use `request.method` to check the HTTP method
- Always validate the method before processing requests
- Different methods have different meanings and should be handled separately

### Practice Exercise

Create a `data.js` file with an empty users array, where each user has these **required** fields:

```javascript
{
    "id": number,
    "userName": string,
    "email": string,
    "address": string,
    "age": number
}
```

**All endpoints should use GET method**:

1. **`/users`** - Get list of all users
2. **`/users/old`** - Get users with age >= 50
3. **`/users/add-random`** - Add a new user with random information
4. **`/users/add/userName={value}&email={value}&address={value}&age={value}`** - Add user with specified information (id should be random)
5. **`/users/update/{user_id}/field_name=value`** - Update user information by ID

**Example update endpoints**:

- Update one field: `/users/update/1/userName="Doraemon"`
- Update multiple fields: `/users/update/1/userName="Doraemon"&age="5"`

---

## Lesson 2: Express.js

### Why Choose Express.js?

In the previous lesson, we learned how to use the `http` module, a built-in Node.js module for creating HTTP protocol servers. However, using the pure `http` module can be very complex, so we have Express.js framework that helps us install and set up HTTP protocol servers more easily and efficiently, minimizing unnecessary logic.

**Key advantages of Express.js**:

- **Simple and easy to use**: Express.js has simple and understandable syntax, helping developers easily grasp and implement features.
- **Flexible**: Express.js doesn't impose a specific structure, allowing developers to freely customize and build applications as desired.
- **Middleware support**: Express.js provides a powerful middleware system, allowing implementation of functions like authentication, logging, data compression, and error handling flexibly and easily.
- **High performance**: Express.js is built on Node.js, a high-performance platform that allows fast processing of concurrent web requests with good scalability.

### Installing Express.js

To install Express.js, we first need to create a new project.

1. Create a folder named `server` and open terminal
2. Use the command `npm init` and select settings to create `package.json` for the project (Press enter to select defaults)
3. Install Express.js with the command: `npm i express`

After running the command, you can see that `package.json` has added a `dependencies` key with express information and the installed version.

### Creating a Server with Express.js

Create an `index.js` file and set it up according to the code below:

```javascript
import express from 'express';
const app = express();

app.listen(8080, () => {
  console.log('Server is running!');
});
```

To use ES6 module syntax, you need to configure the `type` field in `package.json` as mentioned in Lesson 1.

Test the server with the command `node index.js` and see the results.

### GET Request Base Endpoint with Express.js

As we learned in the previous lesson, to interact with the server using HTTP protocol, we need to work with methods and practiced with the most basic method - GET method.

Initialize GET method with base API endpoint:

```javascript
import express from 'express';
const app = express();

// GET method with base API
app.get('', (req, res) => {
  res.end('Hello MindX!');
});

app.listen(8080, () => {
  console.log('Server is running!');
});
```

**Method parameters**: The method above (and other methods) takes 2 input parameters in order:

1. **route** (path)
2. **callback function handler**

This function takes 2 input parameters in turn: request and response, however there will be differences from the **requestListener** when using the http module, but the essence is the same.

When using `res.end`, it may not be flexible when we want to send different data types to the client, we have to parse data through string format, sometimes making it difficult for the client to read data.

So we have a function called `res.send` that helps return data more easily and flexibly, without needing to parse through string format anymore.

```javascript
app.get('', (req, res) => {
  const data = { school: 'MindX technology school' };
  res.send(data);
});
```

### CRUD with Express.js

CRUD stands for Create, Read, Update, Delete. In RESTful API, this standard provides rules for working with API methods.

**Read (GET)**

```javascript
app.get('/users', (req, res) => {
  const data = { school: 'MindX technology school' };
  res.send(data);
});
```

**Create (POST)**

```javascript
app.post('/users', (req, res) => {
  // Handle user creation
  res.status(201).send({ message: 'User created successfully' });
});
```

**Update (PUT/PATCH)**

```javascript
app.put('/users/:id', (req, res) => {
  // Handle user update
  res.send({ message: 'User updated successfully' });
});
```

**Delete (DELETE)**

```javascript
app.delete('/users/:id', (req, res) => {
  // Handle user deletion
  res.send({ message: 'User deleted successfully' });
});
```

### Practice Exercise

Use the data file above with RESTful API standards to implement the following practice exercises:

1. **Write API to get user information by ID passed in params**
2. **Write API to create user with information as above, with random ID (uuid), email must be unique, must check for duplicate email when creating user**
3. **Write API to get posts of user by userId passed in params**
4. **Write API to create post with user ID passed in params**
5. **Write API to update post information by postId passed in params, only the user who created the post is allowed**
6. **Write API to delete post by postId passed in params, only the user who created the post is allowed**
7. **Write API to search posts with content corresponding to query params**
8. **Write API to get all posts with isPublic true, false posts will not be returned**

### Key Points

- Express.js simplifies HTTP server creation compared to the native `http` module
- Use `res.send()` instead of `res.end()` for more flexible data responses
- Implement proper HTTP method validation for RESTful APIs
- Always check user permissions for update/delete operations
- Use middleware for authentication and validation

---

## Lesson 3: JSON Server

### What is JSON Server?

JSON Server is a tool that allows you to quickly create a REST API from a JSON file. It's perfect for prototyping and development, providing a full REST API with zero configuration.

### Key Features

- **Zero configuration**: Just create a JSON file and run the server
- **Full REST API**: Automatically provides GET, POST, PUT, PATCH, DELETE endpoints
- **Real-time updates**: Changes to the JSON file are reflected immediately
- **Filtering and pagination**: Built-in support for query parameters
- **Relationships**: Support for nested resources and foreign keys

### Installation and Setup

```bash
# Install globally
npm install -g json-server

# Or install as dev dependency
npm install --save-dev json-server
```

### Creating a JSON Database

Create a `db.json` file:

```json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "age": 30
    }
  ],
  "posts": [
    {
      "id": 1,
      "title": "First Post",
      "content": "Hello World!",
      "userId": 1
    }
  ]
}
```

### Running JSON Server

```bash
# Basic usage
json-server --watch db.json

# Custom port
json-server --watch db.json --port 3001

# Custom host
json-server --watch db.json --host 0.0.0.0
```

### Available Endpoints

**Users**:

- `GET /users` - Get all users
- `GET /users/1` - Get user with ID 1
- `POST /users` - Create new user
- `PUT /users/1` - Update user with ID 1
- `DELETE /users/1` - Delete user with ID 1

**Posts**:

- `GET /posts` - Get all posts
- `GET /posts/1` - Get post with ID 1
- `POST /posts` - Create new post
- `PUT /posts/1` - Update post with ID 1
- `DELETE /posts/1` - Delete post with ID 1

### Advanced Features

**Filtering**:

```
GET /users?age_gte=25&age_lte=35
GET /posts?title_like=hello
```

**Pagination**:

```
GET /users?_page=1&_limit=10
```

**Sorting**:

```
GET /users?_sort=age&_order=desc
```

**Relationships**:

```
GET /users/1?_embed=posts
GET /posts/1?_expand=user
```

### Use Cases

- **Prototyping**: Quick API development for frontend testing
- **Development**: Local development environment
- **Testing**: API testing and mock data
- **Learning**: Understanding REST API concepts

### Limitations

- Not suitable for production
- Limited to JSON data structure
- No authentication or authorization
- No complex business logic

---

## Lesson 4: MongoDB

### What is MongoDB?

MongoDB is a NoSQL document database that stores data in flexible, JSON-like documents. It's designed for scalability and performance, making it ideal for modern web applications.

### Key Features

- **Document-oriented**: Data is stored in flexible, JSON-like documents
- **Schema-less**: No predefined structure required
- **Scalable**: Horizontal scaling with sharding
- **High performance**: Fast read/write operations
- **Rich queries**: Powerful query language with aggregation

### MongoDB vs SQL Databases

| MongoDB (NoSQL)     | SQL Databases      |
| ------------------- | ------------------ |
| Document-based      | Table-based        |
| Schema-less         | Fixed schema       |
| Horizontal scaling  | Vertical scaling   |
| JSON-like documents | Structured rows    |
| Flexible queries    | Structured queries |

### Installation

**Windows**:

1. Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Run installer and follow setup wizard
3. Add MongoDB to system PATH

**macOS**:

```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community
```

**Linux (Ubuntu)**:

```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file for MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod
```

### Basic Concepts

**Database**: Container for collections
**Collection**: Group of documents (similar to tables in SQL)
**Document**: Individual record (similar to rows in SQL)
**Field**: Key-value pair within a document

### MongoDB Shell (mongosh)

```bash
# Connect to MongoDB
mongosh

# Show databases
show dbs

# Use database
use myDatabase

# Show collections
show collections

# Insert document
db.users.insertOne({
  name: "John Doe",
  email: "john@example.com",
  age: 30
})

# Find documents
db.users.find()

# Find specific document
db.users.findOne({ name: "John Doe" })

# Update document
db.users.updateOne(
  { name: "John Doe" },
  { $set: { age: 31 } }
)

# Delete document
db.users.deleteOne({ name: "John Doe" })
```

### CRUD Operations

**Create (Insert)**:

```javascript
// Insert one document
db.collection.insertOne(document);

// Insert multiple documents
db.collection.insertMany([document1, document2]);
```

**Read (Query)**:

```javascript
// Find all documents
db.collection.find();

// Find with filter
db.collection.find({ field: 'value' });

// Find one document
db.collection.findOne({ field: 'value' });

// Projection (select specific fields)
db.collection.find({}, { name: 1, email: 1, _id: 0 });
```

**Update**:

```javascript
// Update one document
db.collection.updateOne({ filter }, { $set: { field: 'newValue' } });

// Update multiple documents
db.collection.updateMany({ filter }, { $set: { field: 'newValue' } });
```

**Delete**:

```javascript
// Delete one document
db.collection.deleteOne({ filter });

// Delete multiple documents
db.collection.deleteMany({ filter });
```

### Query Operators

**Comparison**:

```javascript
// Equal
{
  age: 30;
}

// Greater than
{
  age: {
    $gt: 25;
  }
}

// Less than or equal
{
  age: {
    $lte: 35;
  }
}

// In array
{
  status: {
    $in: ['active', 'pending'];
  }
}
```

**Logical**:

```javascript
// AND (implicit)
{ age: { $gt: 25 }, status: "active" }

// OR
{ $or: [{ age: { $lt: 25 } }, { status: "admin" }] }

// NOT
{ status: { $ne: "inactive" } }
```

### Aggregation Pipeline

```javascript
db.users.aggregate([
  // Match stage (filter)
  { $match: { age: { $gte: 18 } } },

  // Group stage
  {
    $group: {
      _id: '$city',
      totalUsers: { $sum: 1 },
      avgAge: { $avg: '$age' },
    },
  },

  // Sort stage
  { $sort: { totalUsers: -1 } },
]);
```

### Indexing

```javascript
// Create index on single field
db.users.createIndex({ email: 1 });

// Create unique index
db.users.createIndex({ email: 1 }, { unique: true });

// Create compound index
db.users.createIndex({ lastName: 1, firstName: 1 });

// Create text index for search
db.posts.createIndex({ content: 'text' });
```

### Best Practices

- **Use indexes** for frequently queried fields
- **Limit document size** (16MB max)
- **Use appropriate data types**
- **Implement proper error handling**
- **Monitor performance** with explain() method
- **Use connection pooling** in applications

---

## Lesson 5: MVC Model & Middleware

### What is MVC?

MVC (Model-View-Controller) is an architectural pattern that separates an application into three main logical components:

- **Model**: Manages data, business logic, and rules
- **View**: Displays data and handles user interface
- **Controller**: Processes user input and coordinates between Model and View

### MVC Architecture in Node.js/Express

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    View     │    │ Controller  │    │    Model    │
│  (Frontend) │◄──►│ (Routes)    │◄──►│ (Database)  │
└─────────────┘    └─────────────┘    └─────────────┘
```

### Project Structure

```
project/
├── models/          # Data models and database logic
├── views/           # Frontend templates/views
├── controllers/     # Business logic and request handling
├── routes/          # API endpoint definitions
├── middleware/      # Custom middleware functions
├── config/          # Configuration files
├── public/          # Static files (CSS, JS, images)
└── app.js           # Main application file
```

### Models

Models represent data structure and business logic:

```javascript
// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('User', userSchema);
```

### Controllers

Controllers handle business logic and coordinate between models and views:

```javascript
// controllers/userController.js
import User from '../models/User.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### Routes

Routes define API endpoints and connect them to controllers:

```javascript
// routes/userRoutes.js
import express from 'express';
import { getAllUsers, createUser, getUserById } from '../controllers/userController.js';

const router = express.Router();

router.get('/', getAllUsers);
router.post('/', createUser);
router.get('/:id', getUserById);

export default router;
```

### Views (Frontend)

Views handle the presentation layer:

```javascript
// React component example
import React, { useState, useEffect } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map(user => (
          <li key={user._id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
```

### What is Middleware?

Middleware functions are functions that have access to the request object (req), response object (res), and the next middleware function in the application's request-response cycle.

### Built-in Middleware

```javascript
import express from 'express';
const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files middleware
app.use(express.static('public'));

// CORS middleware
app.use(cors());
```

### Custom Middleware

**Authentication Middleware**:

```javascript
// middleware/auth.js
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};
```

**Logging Middleware**:

```javascript
// middleware/logger.js
export const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.url}`);
  next();
};
```

**Error Handling Middleware**:

```javascript
// middleware/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
```

### Middleware Order

The order of middleware matters:

```javascript
import express from 'express';
import { logger } from './middleware/logger.js';
import { authenticateToken } from './middleware/auth.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

// Global middleware (applied to all routes)
app.use(logger);
app.use(express.json());

// Route-specific middleware
app.use('/api/users', authenticateToken, userRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);
```

### Middleware Types

1. **Application-level middleware**: Applied to all routes
2. **Router-level middleware**: Applied to specific routes
3. **Error-handling middleware**: Handle errors
4. **Built-in middleware**: Express built-in functions
5. **Third-party middleware**: External packages

### Best Practices

- **Order matters**: Place middleware in logical order
- **Error handling**: Always include error handling middleware last
- **Performance**: Avoid heavy operations in middleware
- **Reusability**: Create reusable middleware functions
- **Security**: Implement security middleware early in the chain

---

## Lesson 6: Authentication & Authorization

### What is Authentication?

Authentication is the process of verifying who a user is. It answers the question "Who are you?"

### What is Authorization?

Authorization is the process of determining what a user can access. It answers the question "What are you allowed to do?"

### Authentication Methods

1. **Username/Password**: Traditional login system
2. **OAuth**: Third-party authentication (Google, Facebook, GitHub)
3. **JWT Tokens**: Stateless authentication tokens
4. **Session-based**: Server-side session management
5. **Biometric**: Fingerprint, face recognition

### Session-based Authentication

```javascript
// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and verify password
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create session
    req.session.userId = user._id;
    req.session.userRole = user.role;

    res.json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Protected route
app.get('/profile', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  // Handle authenticated request
});
```

### JWT-based Authentication

```javascript
// Login with JWT
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

### Authorization Levels

1. **Public**: Anyone can access
2. **Authenticated**: Only logged-in users
3. **Role-based**: Users with specific roles
4. **Resource-based**: Users who own the resource

### Role-based Authorization

```javascript
// Middleware for role checking
export const requireRole = roles => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
};

// Usage
app.get('/admin/users', authenticateToken, requireRole(['admin']), getUsers);
app.post('/admin/users', authenticateToken, requireRole(['admin']), createUser);
```

---

## Lesson 7: Password Hashing & Environment Variables

### Password Security

**Never store plain text passwords!** Always hash passwords before storing them in the database.

### Password Hashing with bcrypt

```bash
npm install bcrypt
```

```javascript
import bcrypt from 'bcrypt';

// Hash password
export const hashPassword = async password => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// Verify password
export const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// User registration
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user with hashed password
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
```

### Environment Variables

Environment variables store configuration data outside of your code.

### Using .env Files

Create a `.env` file in your project root:

```env
# Database configuration
DB_URI=mongodb://localhost:27017/myapp
DB_NAME=myapp

# JWT configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Server configuration
PORT=3000
NODE_ENV=development

# External services
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Loading Environment Variables

```bash
npm install dotenv
```

```javascript
import dotenv from 'dotenv';
dotenv.config();

// Access environment variables
const port = process.env.PORT || 3000;
const dbUri = process.env.DB_URI;
const jwtSecret = process.env.JWT_SECRET;
```

### Security Best Practices

1. **Never commit .env files** to version control
2. **Use strong, unique secrets** for JWT and sessions
3. **Rotate secrets** regularly
4. **Use different secrets** for different environments
5. **Validate environment variables** at startup

---

## Lesson 8: Tokens

### What are JWT Tokens?

JWT (JSON Web Token) is a compact, URL-safe means of representing claims to be transferred between two parties.

### JWT Structure

JWT consists of three parts separated by dots:

```
header.payload.signature
```

1. **Header**: Contains token type and algorithm
2. **Payload**: Contains claims (user data)
3. **Signature**: Verifies token authenticity

### JWT Implementation

```bash
npm install jsonwebtoken
```

```javascript
import jwt from 'jsonwebtoken';

// Generate token
export const generateToken = payload => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  });
};

// Verify token
export const verifyToken = token => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Middleware to extract token from request
export const extractToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    req.token = authHeader.substring(7);
  }

  next();
};
```

### Token Refresh

```javascript
// Refresh token endpoint
app.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Generate new access token
    const newAccessToken = generateToken({ userId: decoded.userId });

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});
```

### Token Security

1. **Short expiration** for access tokens (15min - 1hour)
2. **Longer expiration** for refresh tokens (7-30 days)
3. **Store tokens securely** (httpOnly cookies for web, secure storage for mobile)
4. **Implement token blacklisting** for logout
5. **Use HTTPS** in production

---

## Lesson 9: Database Relationships

### Types of Relationships

1. **One-to-One**: One user has one profile
2. **One-to-Many**: One user has many posts
3. **Many-to-Many**: Many users can like many posts

### One-to-One Relationship

```javascript
// User model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

// Profile model
const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  bio: String,
  avatar: String,
  location: String,
});

// Create relationship
const user = await User.create({ name: 'John', email: 'john@example.com' });
const profile = await Profile.create({
  userId: user._id,
  bio: 'Software Developer',
});
```

### One-to-Many Relationship

```javascript
// User model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

// Post model
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

// Populate author information
const posts = await Post.find().populate('author', 'name email');
```

### Many-to-Many Relationship

```javascript
// User model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  likedPosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
});

// Post model
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

// Like a post
app.post('/posts/:postId/like', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    const userId = req.user.userId;

    if (post.likes.includes(userId)) {
      // Unlike
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

### Aggregation with Relationships

```javascript
// Get posts with author information and like count
const posts = await Post.aggregate([
  {
    $lookup: {
      from: 'users',
      localField: 'author',
      foreignField: '_id',
      as: 'authorInfo',
    },
  },
  {
    $addFields: {
      likeCount: { $size: '$likes' },
      author: { $arrayElemAt: ['$authorInfo', 0] },
    },
  },
  {
    $project: {
      authorInfo: 0,
    },
  },
]);
```

---

## Lesson 10: File Upload

### File Upload Methods

1. **Multer**: Popular middleware for handling multipart/form-data
2. **Cloudinary**: Cloud-based image and video management
3. **AWS S3**: Amazon's cloud storage service
4. **Local storage**: Store files on server filesystem

### File Upload with Multer

```bash
npm install multer
```

```javascript
import multer from 'multer';

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

// Upload single file
app.post('/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    res.json({
      message: 'File uploaded successfully',
      filename: req.file.filename,
      path: req.file.path,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload multiple files
app.post('/upload-multiple', upload.array('images', 5), (req, res) => {
  try {
    const files = req.files;
    res.json({
      message: `${files.length} files uploaded successfully`,
      files: files.map(file => ({
        filename: file.filename,
        path: file.path,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

### Cloudinary Integration

```bash
npm install cloudinary multer-storage-cloudinary
```

```javascript
import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads',
    allowed_formats: ['jpg', 'png', 'gif', 'jpeg'],
  },
});

const upload = multer({ storage: storage });
```

### File Validation

```javascript
// Validate file size and type
const validateFile = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: 'File is required' });
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ message: 'Invalid file type' });
  }

  if (req.file.size > 5 * 1024 * 1024) {
    // 5MB
    return res.status(400).json({ message: 'File too large' });
  }

  next();
};
```

---

## Lesson 11: Data Management

### Data Validation

Use libraries like Joi or Zod for input validation:

```bash
npm install joi
```

```javascript
import Joi from 'joi';

// User validation schema
const userSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  age: Joi.number().min(13).max(120).optional(),
});

// Validation middleware
export const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      details: error.details.map(detail => detail.message),
    });
  }

  next();
};
```

### Error Handling

```javascript
// Custom error class
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // Production error response
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong!',
      });
    }
  }
};
```

### Data Pagination

```javascript
// Pagination middleware
export const paginateResults = model => {
  return async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
      const total = await model.countDocuments();
      const results = await model.find().skip(skip).limit(limit).sort({ createdAt: -1 });

      req.paginatedResults = {
        results,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Usage
app.get('/users', paginateResults(User), (req, res) => {
  res.json(req.paginatedResults);
});
```

---

## Lesson 12: Deployment

### Deployment Options

1. **Heroku**: Easy deployment for small to medium applications
2. **Vercel**: Great for frontend and serverless functions
3. **Netlify**: Excellent for static sites and JAMstack
4. **AWS**: Scalable cloud infrastructure
5. **DigitalOcean**: Simple cloud hosting
6. **Railway**: Modern deployment platform

### Environment Setup

```bash
# Production environment variables
NODE_ENV=production
PORT=3000
DB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your-production-secret
CORS_ORIGIN=https://yourdomain.com
```

### Heroku Deployment

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret

# Deploy
git push heroku main

# Open app
heroku open
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
      - DB_URI=mongodb://mongo:27017/myapp
    depends_on:
      - mongo

  mongo:
    image: mongo:6.0
    ports:
      - '27017:27017'
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

### Production Considerations

1. **Security**: HTTPS, CORS, rate limiting
2. **Performance**: Compression, caching, CDN
3. **Monitoring**: Logging, error tracking, health checks
4. **Backup**: Database backups, file storage
5. **Scaling**: Load balancing, horizontal scaling

---

## Lesson 13: Redux Toolkit

### What is Redux Toolkit?

Redux Toolkit (RTK) is the official, opinionated, batteries-included toolset for efficient Redux development.

### Installation

```bash
npm install @reduxjs/toolkit react-redux
```

### Store Setup

```javascript
// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import postReducer from './slices/postSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    post: postReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Creating Slices

```javascript
// store/slices/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for API calls
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await fetch('/api/users');
  return response.json();
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {
    addUser: (state, action) => {
      state.users.push(action.payload);
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter(user => user.id !== action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUsers.pending, state => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { addUser, updateUser, deleteUser } = userSlice.actions;
export default userSlice.reducer;
```

### Using Redux in Components

```javascript
// components/UserList.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../store/slices/userSlice';

function UserList() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector(state => state.user);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
```

### Redux Toolkit Features

1. **createSlice**: Simplified slice creation with immer
2. **createAsyncThunk**: Handle async operations
3. **createEntityAdapter**: Normalized state management
4. **RTK Query**: Data fetching and caching
5. **DevTools**: Built-in Redux DevTools support

---

## Lesson 14: Project Completion

### Project Structure

```
my-fullstack-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   └── utils/
│   ├── package.json
│   └── public/
├── server/                 # Node.js backend
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── config/
│   └── app.js
├── shared/                 # Shared types/utilities
│   ├── types/
│   └── utils/
└── README.md
```

### Key Features to Implement

1. **User Authentication**: Login, register, JWT tokens
2. **CRUD Operations**: Full data management
3. **File Upload**: Image/document handling
4. **Search & Filtering**: Advanced data queries
5. **Pagination**: Large dataset handling
6. **Real-time Updates**: WebSocket integration
7. **Responsive Design**: Mobile-first approach
8. **Error Handling**: Comprehensive error management

### Testing Strategy

```javascript
// Unit tests with Jest
import { render, screen } from '@testing-library/react';
import UserList from '../UserList';

test('renders user list', () => {
  render(<UserList />);
  expect(screen.getByText(/users/i)).toBeInTheDocument();
});

// Integration tests
test('creates new user', async () => {
  const response = await request(app).post('/api/users').send({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
  });

  expect(response.status).toBe(201);
  expect(response.body.name).toBe('John Doe');
});
```

### Performance Optimization

1. **Code Splitting**: Lazy load components
2. **Memoization**: Use React.memo and useMemo
3. **Image Optimization**: Compress and lazy load images
4. **Database Indexing**: Optimize database queries
5. **Caching**: Implement Redis or in-memory caching

---

## Lesson 15: Final Project

### Project Requirements

Build a complete full-stack application demonstrating all learned concepts:

1. **Frontend**: React with TypeScript, Redux Toolkit, responsive design
2. **Backend**: Node.js/Express with MongoDB, JWT authentication
3. **Features**: User management, content creation, file uploads, search
4. **Deployment**: Deploy to cloud platform with CI/CD

### Project Ideas

1. **Social Media Platform**: Users, posts, likes, comments, file sharing
2. **E-commerce Site**: Products, cart, orders, user management
3. **Blog Platform**: Articles, categories, user authentication, admin panel
4. **Task Management**: Projects, tasks, team collaboration, file attachments
5. **Learning Platform**: Courses, lessons, progress tracking, user profiles

### Implementation Checklist

- [ ] Project setup and configuration
- [ ] Database design and models
- [ ] API endpoints and controllers
- [ ] Authentication and authorization
- [ ] Frontend components and pages
- [ ] State management with Redux
- [ ] File upload functionality
- [ ] Search and filtering
- [ ] Responsive design
- [ ] Testing implementation
- [ ] Error handling
- [ ] Performance optimization
- [ ] Deployment configuration
- [ ] Documentation

### Presentation and Demo

1. **Live Demo**: Show working application
2. **Code Walkthrough**: Explain key implementations
3. **Technical Decisions**: Justify architecture choices
4. **Future Improvements**: Discuss potential enhancements
5. **Q&A Session**: Answer questions from audience

### Evaluation Criteria

- **Functionality**: All features working correctly
- **Code Quality**: Clean, maintainable, well-documented
- **User Experience**: Intuitive interface and smooth interactions
- **Performance**: Fast loading and responsive
- **Security**: Proper authentication and data protection
- **Deployment**: Successfully deployed and accessible

---

## Conclusion

This course provides a comprehensive foundation for full-stack web development using the MERN stack. Each lesson builds upon the previous one, creating a solid understanding of modern web development practices.

**Key Learning Outcomes**:

- Understanding of web services and protocols
- Mastery of Node.js and Express.js
- Database design and management with MongoDB
- Frontend development with React.js
- State management with Redux
- Authentication and security best practices
- Deployment and production considerations

**Next Steps**:
After completing this course, students should be able to:

- Build complete full-stack web applications
- Implement RESTful APIs
- Handle user authentication and authorization
- Manage database relationships
- Deploy applications to production environments

---

_This document is based on the MindX Full Stack Web Development Course available at: https://mindxschool.gitbook.io/full-stack-web_
