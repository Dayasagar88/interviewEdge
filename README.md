<div align="center">

<!-- Replace with your actual screenshot -->
![InterviewEdge Banner](https://github.com/Dayasagar88/interviewEdge/blob/main/client/src/assets/banner.png)

<br/>

# 🤖 InterviewEdge AI

**AI-powered mock interview platform with voice recognition, real-time feedback, and detailed performance analytics.**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38BDF8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://mongodb.com)

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Pages & Routes](#-pages--routes)
- [Credits System](#-credits-system)
- [API Endpoints](#-api-endpoints)
- [Contributing](#-contributing)

---

## 🧠 Overview

InterviewEdge is a full-stack AI mock interview platform designed to help job seekers practice and improve their interview skills. Users can select an interview type (Technical, HR, System Design, DSA), answer questions via voice or text, and receive instant AI-generated feedback with detailed performance scores across **Confidence**, **Communication**, and **Correctness**.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎙️ **Voice Interview** | Speak your answers using Web Speech API with real-time transcription |
| 🤖 **AI Question Generation** | Dynamic questions tailored to role, experience level, and interview type |
| 📊 **Performance Analytics** | Score rings, radar charts, and bar graphs for Confidence / Communication / Correctness |
| 📄 **Resume Analysis** | Upload your PDF resume to get AI-parsed skills and projects |
| 📝 **Interview History** | Full history with question-wise breakdown and expandable answer review |
| 💳 **Credit System** | Razorpay-integrated payments with Free / Starter / Pro plans |
| 📥 **PDF Report Download** | Export your full interview report as a styled PDF via html2canvas + jsPDF |

---

## 🛠 Tech Stack

### Frontend
- **React 18** + **Vite**
- **Framer Motion** — animations & transitions
- **Tailwind CSS** — utility-first styling
- **Redux Toolkit** — global state (user, auth)
- **React Router v6** — client-side routing
- **Axios** — HTTP requests
- **React Icons** — icon library
- **Web Speech API** — voice recognition & synthesis

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** — authentication
- **Google Gemini API** — AI question generation & evaluation
- **Razorpay** — payment gateway
- **Multer** + **pdf-parse** — resume upload & parsing

---

## 📁 Project Structure

```
interviewedge/
├── client/                     # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   └── Timer.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Interview.jsx
│       │   ├── Step1SetUp.jsx
│       │   ├── Step2Interview.jsx
│       │   ├── Step3Report.jsx
│       │   ├── InterviewReport.jsx
│       │   ├── InterviewHistory.jsx
│       │   └── Pricing.jsx
│       ├── redux/
│       │   └── userSlice.js
│       ├── App.jsx
│       └── main.jsx
│
└── server/                     # Express backend
    ├── controllers/
    │   ├── authController.js
    │   ├── interviewController.js
    │   └── paymentController.js
    ├── models/
    │   ├── User.js
    │   └── Interview.js
    ├── routes/
    │   ├── auth.js
    │   ├── interview.js
    │   └── payment.js
    ├── middleware/
    │   └── authMiddleware.js
    └── index.js
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v18+`
- MongoDB Atlas account
- Razorpay account
- Google Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/interviewedge.git
cd interviewedge
```

### 2. Install dependencies

```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

### 3. Set up environment variables

Create `.env` files in both `client/` and `server/` — see [Environment Variables](#-environment-variables) below.

### 4. Run the development servers

```bash
# Backend (from /server)
npm run dev

# Frontend (from /client)
npm run dev
```

Frontend runs on `http://localhost:5173` · Backend runs on `http://localhost:8000`

---

## 🗺 Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | `Home` | Landing page with features overview |
| `/login` | `Login` | User authentication |
| `/register` | `Register` | User registration |
| `/home` | `Dashboard` | User dashboard with credits & stats |
| `/interview` | `Interview` | 3-step interview flow |
| `/interview-report/:id` | `InterviewReport` | View full report by ID |
| `/interview-history` | `InterviewHistory` | All past interviews |
| `/pricing` | `Pricing` | Plan selection & payment |

---

## 💰 Credits System

InterviewEdge uses a credit-based model. Each AI interview question consumes **1 credit**.

| Plan | Price | Credits |
|---|---|---|
| Free | ₹0 | 100 |
| Starter Pack | ₹100 | 150 |
| Pro Pack | ₹500 | 650 |

Credits never expire and carry over forever. Payments are processed via **Razorpay**.

---

## 🔌 API Endpoints

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
```

### Interview
```
POST   /api/interview/create
POST   /api/interview/submit-answers
POST   /api/interview/finish-interview
GET    /api/interview/get-interview
GET    /api/interview/interview-report/:id
POST   /api/interview/analyze-resume
```

### Payment
```
POST   /api/payment/order
POST   /api/payment/verify
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch — `git checkout -b feature/your-feature`
3. Commit your changes — `git commit -m "Add: your feature"`
4. Push to the branch — `git push origin feature/your-feature`
5. Open a Pull Request

---

<div align="center">

Made with ❤️ by the InterviewEdge Team

⭐ Star this repo if you found it useful!

</div>
