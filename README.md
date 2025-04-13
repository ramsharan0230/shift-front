# Shift Board Frontend

This is the frontend application for **Shift Board**, developed using **Nuxt 3** with **TypeScript**. For the UI, **Tailwind CSS** is used to ensure a responsive and clean design.

Check out the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

---

## 🔧 Tech Stack

- **Nuxt 3**
- **TypeScript**
- **Tailwind CSS**
- **VueDraggable** (for drag and drop functionality)
- **Pinia** (state management)
- **Nuxt Middleware** (for route protection)

---

## 🚀 Features

1. **Authentication**  
   - Login: `http://localhost:3000/auth/login`  
   - Register: `http://localhost:3000/auth/register`  

2. **Protected Board Page**  
   After registering or logging in, users can access the board at:  
   `http://localhost:3000/board`  
   > ⚠️ This page is protected by an `auth` middleware.

3. **Task Management**  
   On the board page, authenticated users can:
   - Create new tasks
   - Assign tasks to different stages: `To Do`, `In Progress`, `QA`, or `Done`
   - Use **drag and drop** (powered by `vuedraggable`) to move tasks across stages

4. **Backend API**  
   The frontend communicates with a backend running at:  
   `http://localhost:8000`

---

## 📦 Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
