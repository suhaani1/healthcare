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
   
## Screenshots
<img width="1917" height="858" alt="image" src="https://github.com/user-attachments/assets/45a95107-1885-4714-963d-4ad01d8649ac" />

### Patient's Portal
<img width="1917" height="861" alt="image" src="https://github.com/user-attachments/assets/b260cd9e-bdc1-45f1-8837-814c29ff2472" />

<img width="1906" height="862" alt="image" src="https://github.com/user-attachments/assets/60e3de09-20bb-41e0-b43e-9ce3d0ef0341" />

<img width="1917" height="846" alt="image" src="https://github.com/user-attachments/assets/be712991-d668-47dd-a1ac-4723d15cd10a" />
<img width="1917" height="896" alt="image" src="https://github.com/user-attachments/assets/ee5f4fdd-2de1-4290-801c-a44553640170" />

### Doctor's Portal
<img width="1917" height="857" alt="image" src="https://github.com/user-attachments/assets/d7ef562d-4c70-465d-b2bf-2b7283496797" />
<img width="1747" height="852" alt="image" src="https://github.com/user-attachments/assets/58729c3f-f3f4-45c2-aaf8-a6622a9cb031" />


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
