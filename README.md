# 🖌️ Collaborative Whiteboard

A full-stack TypeScript project for real-time collaborative drawing.  
Users can connect to the same board and see each other’s strokes instantly.

---

## ✨ Features

- ✅ Real-time drawing synchronization with WebSockets  
- ✅ React + Vite frontend  
- ✅ Node.js + Express backend  
- ✅ TypeScript everywhere  
- ✅ Monorepo setup with pnpm workspaces  
- ✅ Ready for future extensions:
  - User authentication
  - Board saving/loading
  - AI-powered features

---

## 🏗️ Project Structure

```
collab-whiteboard/
├── apps/
│   ├── backend/   # Express + Socket.IO server
│   └── frontend/  # React + Konva client
├── pnpm-workspace.yaml
└── README.md
```

---

## ⚡ Tech Stack

**Frontend:** React, TypeScript, Vite, Konva  
**Backend:** Node.js, Express, Socket.IO  
**Package Manager:** pnpm  
**Language:** TypeScript

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- pnpm (`npm install -g pnpm`)

### 1️⃣ Install dependencies

From the root folder:

```sh
pnpm install
```

This installs dependencies for all apps.

### 2️⃣ Start the backend

In a new terminal:

```sh
cd apps/backend
pnpm dev
```

Server will run at:  
http://localhost:4000

### 3️⃣ Start the frontend

In a new terminal:

```sh
cd apps/frontend
pnpm dev
```

App will be available at:  
http://localhost:5173

---

## 🖼️ Usage

Open the frontend URL in multiple browser tabs.  
Draw on the canvas.  
All connected clients will see updates in real time.

---

## 🛣️ Roadmap

- Basic authentication (OAuth or email/password)
- Save/load boards to PostgreSQL
- Role-based access control (owner, editor, viewer)
- AI summarization of sticky notes
- Dockerized deployment

---

## 🤝 Contributing

Pull requests are welcome.  
Please open issues to discuss features or report bugs.

---

## 📄 License

MIT

---

## 💡 Acknowledgements

- React
- Vite
- Konva
- Socket.IO
