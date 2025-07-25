# Task Manager Application

A full-stack real-time task management application built with React TypeScript frontend and Node.js backend with MongoDB.

## Features

- Real-time task creation and editing
- Multi-user collaboration with live updates
- Task status management (pending, in progress, completed)
- User authentication and session management
- Responsive design for multiple devices
- Task filtering and search functionality
- Comments system for task collaboration
- Priority levels and due dates
- Tag system for task organization

## Tech Stack

### Frontend
- React 18 with TypeScript
- React Router for navigation
- Socket.IO client for real-time updates
- Axios for API communication
- Responsive CSS with Grid and Flexbox

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- Socket.IO for real-time communication
- JWT for authentication
- bcryptjs for password hashing
- express-validator for input validation

## Project Structure

```
task-manager-app/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── taskController.js
│   │   └── userController.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── tasks.js
│   │   └── users.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── Login.tsx
│   │   │   │   └── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskDetail.tsx
│   │   │   └── TaskModal.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   └── socket.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── index.tsx
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd task-manager-app/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```bash
   cp env.example .env
   ```
   Then edit the `.env` file with your configuration:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/task-manager
   JWT_SECRET=your-secret-key-here
   NODE_ENV=development
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

The backend will be running on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd task-manager-app/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will be running on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Tasks
- `GET /api/tasks` - Get all tasks (with filters)
- `GET /api/tasks/:id` - Get specific task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/:id/comments` - Add comment to task

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get specific user

## Real-time Features

The application uses Socket.IO for real-time updates:
- Task creation notifications
- Task updates in real-time
- Task deletion notifications
- Live collaboration on tasks

## Responsive Design

The application is built with a mobile-first approach:
- CSS Grid and Flexbox for layouts
- Media queries for different screen sizes
- Touch-friendly UI elements
- Responsive breakpoints (sm, md, lg)

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Input validation with express-validator
- CORS configuration
- Protected routes with middleware

## Database Schema

### User Schema
- username (required, unique)
- email (required, unique)
- password (required, hashed)
- avatar (optional)
- isOnline (boolean)
- timestamps

### Task Schema
- title (required)
- description (optional)
- status (enum: pending, in-progress, completed)
- priority (enum: low, medium, high)
- assignedTo (reference to User)
- createdBy (reference to User, required)
- dueDate (optional)
- tags (array of strings)
- attachments (array of objects)
- comments (array of objects with user reference)
- timestamps

## Development

### Backend Development
- Express.js server setup with middleware
- MongoDB connection with Mongoose
- RESTful API endpoints
- Real-time communication with Socket.IO
- Error handling and validation

### Frontend Development
- React functional components with TypeScript
- State management with useState
- Form handling with proper validation
- API integration with typed responses
- Real-time updates with Socket.IO client

## Deployment

### Backend Deployment
1. Set up environment variables for production
2. Configure MongoDB connection string
3. Set up proper JWT secret
4. Deploy to your preferred hosting service

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the build folder to your hosting service
3. Configure proxy settings if needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes and technical assessment. 