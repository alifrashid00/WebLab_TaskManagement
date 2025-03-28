#  Secure Task Management System (TMS)

A full-stack web application built to help users manage their personal and professional tasks with a clean interface, secure login system, and role-based access for both users and admins.

---

##  Features

###  User Authentication
- Secure user registration and login with hashed passwords using `bcryptjs`
- Email verification with token-based activation
- JWT-based session management for protected routes

###  Role Management
- Users: Create, manage, and track tasks
- Admins: View a list of all registered users
- The first time the server runs, an admin account is automatically created

###  Task Management
- Create, edit, complete, and delete tasks
- Task fields include: title, description, due date, priority, and category
- Tasks are filtered and sorted by priority, due date, or category
- Category selection is done through dropdown (e.g., Work, Study, Personal)

---

##  Tech Stack

**Frontend:**
- React.js
- Axios
- React Router DOM

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT + bcryptjs for authentication
- Nodemailer for sending verification emails

---

##  Getting Started

###  Clone the Repo

```bash
git clone https://github.com/alifrashid00/WebLab_TaskManagement.git
cd WebLab_TaskManagement
```
### Dependency Install
``` bash
cd server
npm install

cd client
npm install
```

### Create .env file in /server
-Use app password from Google(https://myaccount.google.com/apppasswords)
``` bash
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

### Run
Server
```

npx nodemon server.js

```
Client
```
npm start
```






