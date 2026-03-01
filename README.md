# 🎥 WeMeet — Real-Time WebRTC Video Conferencing Platform

WeMeet is a full-stack peer-to-peer video conferencing application built using **WebRTC** and **WebSockets**. It enables secure, low-latency video communication along with screen sharing, in-meeting chat, scheduling, and recording capabilities.

This project focuses on real-time architecture, clean backend design, and scalable system thinking.

---

## 📸 Demo Screenshots

> Add screenshots inside a `/screenshots` folder in your repo.

### 🏠 Home / Lobby
![Home Screenshot](./screenshots/home.png)

### 📹 Video Call Interface
![Call Screenshot](./screenshots/call.png)

### 💬 In-Meeting Chat
![Chat Screenshot](./screenshots/chat.png)

---

## 🚀 Features

### 🔹 Core Communication
- Peer-to-peer video & audio calling using WebRTC
- Low-latency signaling via WebSockets (Socket.io)
- Dynamic room creation & joining

### 🔹 Collaboration
- Screen sharing
- Real-time chat during meetings
- Screen recording with local download
- Meeting scheduling with persistence

### 🔹 Backend & Data
- Secure REST APIs
- Persistent meeting storage
- Structured relational schema using Prisma ORM

---

## 🏗 Tech Stack

### **Frontend**
- React
- TailwindCSS
- WebRTC APIs
- Socket.io Client

### **Backend**
- Node.js
- Express.js
- Socket.io (WebSockets)
- Prisma ORM

### **Database**
- PostgreSQL

---

## 🧠 Architecture Overview

WeMeet follows a **client-server signaling architecture**:

1. Clients connect to signaling server via WebSocket.
2. SDP offers/answers exchanged through server.
3. WebRTC establishes direct peer-to-peer connection.
4. Media streams flow directly between peers.
5. Server stores meeting metadata and scheduling data.

### 🔄 Real-Time Flow

User A → WebSocket → Signaling Server → WebSocket → User B  
After signaling → Direct WebRTC P2P connection

This minimizes server bandwidth usage for media streams.

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone <your-repo-url>
cd wemeet
```
### 2️⃣ Backend Setup
```bash
cd Backend
npm install
```
Create a .env file:
```bash
APPNAME="your_app_name" //Better for environment, can skip this
DEBUG=your_app_name:* //Better for environment, can skip this
DATABASE_URL='your_db_url'
PORT='port_number'
FRONTEND_URL_DEV = "http://localhost:5173" // For dev environment
FRONTEND_URL_PROD = "deployed_url"
```
Run prisma migrations:
```bash
npx prisma migrate dev
```
Start backend:
```bash
npm run start
```

3️⃣ Frontend Setup
```bash
cd Frontend
npm install
```
Create a .env file:
```bash
VITE_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
VITE_BE_API_BASE = "http://localhost:4000/api"
VITE_BE_API_PROD = "deployed_url/api"
VITE_CLERK_SECRET_KEY="your_clerk_secret_key"
VITE_WS_URL="wss://localhost:4000"
```
Start frontend:
```bash
npm run dev
```
