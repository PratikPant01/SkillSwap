# SkillSwap 

**SkillSwap** is a student-focused skill exchanging and learning platform. Instead of traditional paid courses, students can exchange their skills, making learning more accessible, practical, and community-driven.

---

## Project Overview

SkillSwap allows users to create profiles, showcase their skills, and offer or request teaching sessions. It uses a **credit-based system** to facilitate fair exchanges:
- **Teach to Earn**: Share your knowledge and earn credits.
- **Learn to Grow**: Use credits to request help or learn new skills from peers.

## Key Features

- **Personalized Profiles**: Showcase skills, education, languages, and portfolio.
- **Skill Management**: Tag skills you can "Teach" and skills you want to "Learn".
- **Postings**: Create "Teach" or "Learn" posts to find matches.
- **Credit System**: Integrated economy with daily bonuses and task rewards.
- **Real-time Messaging**: Chat with potential mentors or students.
- **Review System**: Rate and comment on successful exchanges.

## Tech Stack

- **Frontend**: Next.js 15+, Tailwind CSS 4+, TypeScript, Lucide React.
- **Backend**: Node.js, Express.js, PostgreSQL, JWT Authentication.

---

## Project Structure

```text
SkillSwap/
├── skillswap-frontend/   # Next.js frontend application
│   ├── app/              # App router (pages, layouts)
│   ├── component/        # Reusable UI components
│   └── hooks/            # Custom React hooks
├── skillswap-backend/    # Node.js/Express backend API
│   ├── src/
│   │   ├── routes/       # API route definitions
│   │   ├── database/     # DB schema and migrations
│   │   └── middleware/   # Auth and other middlewares
└── README.md             # This file (Consolidated Documentation)
```

---

## Backend Setup (`skillswap-backend`)

### Prerequisites
- **Node.js**: v18+ recommended.
- **PostgreSQL**: Local or cloud instance.

### Installation & Run
1. **Install Dependencies**: `cd skillswap-backend && npm install`
2. **Environment Variables**: Create `.env` in `skillswap-backend/`:
   ```env
   PORT=5000
   DB_URL=your_postgresql_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
3. **Initialize Database**: 
   - Create a PostgreSQL database (e.g., `skillswap`).
   - Navigate to the database directory and run the init script:
     ```bash
     cd src/database
     node init.js
     ```
   - *Note: Ensure your `DB_URL` in `.env` points to the newly created database.*
4. **Start Server**: `npm run dev` (dev) or `npm start` (prod).

### API Endpoints
- **Auth**: `POST /register`, `POST /login`
- **Posts**: `GET/POST /posts`, `GET /posts/mine`, `POST /posts/:id/assign`, `POST /posts/:id/complete`
- **Profile**: `GET/PUT /profile/me`, `GET /profile/:username`
- **Skills**: `GET /skills`, `GET/POST /user-skills`
- **Credits**: `GET /credits/history`, `POST /credits/add`

---

## Frontend Setup (`skillswap-frontend`)

### Prerequisites
- **Node.js**: v18+ recommended.

### Installation & Run
1. **Install Dependencies**: `cd skillswap-frontend && npm install`
2. **Environment Variables**: Create `.env.local` in `skillswap-frontend/`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```
3. **Start Development**: `npm run dev`
4. **Build for Production**: `npm run build && npm start`

### Page Mapping
- `/`: Landing page
- `/browse`: Explore posts
- `/post/create`: Listing creation
- `/profile`: User dashboard
- `/chat`: Real-time messaging
- `/auth/login` & `/auth/register`: Authentication

---
*Created with ❤️ for students, by students.*
h

---
