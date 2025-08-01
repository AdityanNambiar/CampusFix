# CampusFix

CampusFix is a modern web platform that transforms how campus maintenance issues are reported, managed, and resolved. Designed for universities and colleges, it empowers students to easily submit complaints about hostel or campus facilities, track their resolution status in real time, and receive timely updates. Maintenance staff and administrators benefit from dedicated dashboards to efficiently assign, escalate, and resolve issues, ensuring a cleaner and safer campus for everyone.

## How It Works
- **Students:**
  - Register and log in to the platform.
  - Submit detailed maintenance complaints (e.g., broken lights, plumbing issues, etc.).
  - Track the status of each complaint (pending, in progress, resolved).
  - Receive email notifications as their complaint progresses.

- **Maintenance Staff:**
  - Log in to view complaints assigned to them.
  - Update the status of complaints as they work on them.
  - Mark issues as resolved when fixed.

- **Administrators:**
  - Manage all users and complaints from a central dashboard.
  - Assign or reassign complaints to maintenance staff.
  - Monitor unresolved issues and escalate them automatically if needed.
  - Generate reports for campus management.

This clear workflow ensures that every maintenance issue is addressed promptly, with full transparency for all parties involved.

## Features
- Student registration and login
- Complaint submission and real-time tracking
- Admin dashboard for managing users and complaints
- Maintenance staff dashboard for handling assigned tasks
- Automated escalation of unresolved complaints
- Email notifications for important updates
- Secure authentication and authorization

## Tech Stack
- **Frontend:** React, Vite, JavaScript, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Other:** JWT for authentication, Nodemailer for emails

## Getting Started

### Prerequisites
- Node.js (v14 or above)
- npm (v6 or above)
- MongoDB (local or cloud instance)

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/your-username/CampusFix.git
cd CampusFix-main
```

#### 2. Setup the Server
```bash
cd server
npm install
```

- Create a `.env` file in the `server` directory with the following variables:
  ```env
  MONGODB_URI=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret
  EMAIL_USER=your_email@example.com
  EMAIL_PASS=your_email_password
  ```
- Start the backend server with nodemon:
  ```bash
  npx nodemon index.js
  ```

#### 3. Setup the Client
```bash
cd ../client
npm install
npm run dev
```

The client will run on [http://localhost:5173](http://localhost:5173) by default.

## Usage
- **Students:** Register, log in, submit complaints, and track their resolution.
- **Admins:** Manage users and complaints, assign tasks, and monitor campus maintenance.
- **Maintenance Staff:** View assigned complaints and update their status as they work.

## Folder Structure
```
CampusFix-main/
  client/         # Frontend React application
  server/         # Backend Node.js/Express API
```

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License.
