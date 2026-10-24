# SaathiCare

SaathiCare is a full-stack healthcare platform designed to make healthcare services more accessible, connected, and convenient for patients and healthcare professionals.

The platform provides a digital environment where patients can interact with doctors, manage appointments, and access healthcare-related services through a modern web application.

## Features

### Patient
- Patient registration and login
- Secure authentication
- Patient dashboard
- Doctor discovery
- Appointment booking
- Appointment management
- Doctor-patient communication
- Healthcare information and services

### Doctor
- Doctor registration and login
- Doctor dashboard
- Appointment management
- Patient information
- Doctor-patient chat
- Profile management

### Security
- JWT-based authentication
- Protected routes
- Password hashing
- Role-based access control
- Environment variables for sensitive configuration
- Secure API communication

## Technology Stack

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

### Development Tools
- Git
- GitHub
- Visual Studio Code
- Postman
- npm

## Project Structure

```text
SaathiCare/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── saathiCare_be/
│   ├── bin/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── app.js
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/suhaani1/saathicare.git
```

Move into the project:

```bash
cd saathicare
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Install backend dependencies

Open another terminal or go back to the project root:

```bash
cd ../saathiCare_be
npm install
```


## Running the Application

### Start Backend

Inside `saathiCare_be`:

```bash
nodemon start
```



### Start Frontend

Inside `frontend`:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```



## API

The backend provides REST APIs for authentication, users, doctors, patients, appointments, and communication.

Example API structure:

```text
/api/auth
/api/users
/api/doctors
/api/appointments
/api/chat
```

The exact endpoints may vary according to the implementation.

## Authentication

SaathiCare uses token-based authentication.

The authentication flow includes:

1. User registration
2. Login
3. Password verification
4. JWT generation
5. Protected API requests
6. Role-based access

## Future Improvements

- Online doctor consultation
- Video consultation
- Online prescription management
- Medicine reminders
- Health records management
- AI-powered healthcare assistance
- Payment integration
- Notifications
- Deployment to cloud infrastructure
