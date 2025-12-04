# Valley Vice – Basketball Stats Tracker

🔗 **Live App:** https://valleyvice.vercel.app/  
📁 **GitHub:** https://github.com/mylescruz/valleyvice

A full-stack basketball statistics tracking platform built with **Next.js**, **NextAuth.js**, **MongoDB**, and **Tailwind CSS**.  
Designed to manage 20 seasons of data for a men’s recreational basketball team, including player stats, game logs, analytics, play-by-play tracking, and roster management.

---

## 🚀 Features

### 📈 **Stats Page**
- View each player's **total** and **average** stats for the selected season  
- Stats recalculated on the backend every time a game is recorded  
- Dropdown selector to switch between 20 seasons of data  

---

### 📅 **Seasons Page**
- Displays games for the selected season with:
  - Game number  
  - Opponent  
  - Location  
  - Date  
  - Win/Loss indicator  
  - Final score  
- Click any game to open the full game detail page

---

### 🏀 **Game Page**
- Shows game-specific stats for each participating player  
- Displays:
  - 2PT made  
  - 3PT made  
  - Assists  
  - Rebounds  
  - Steals  
  - Other tracked metrics  
- Shot percentages  
- **Play-by-play** timeline if available (built from stat tracking order)

---

### 👥 **Roster Page**
- Season-specific roster view  
- Player cards showing:
  - Image  
  - Name  
  - Jersey number  
  - Height  
  - Position  

---

### 🧍 **Player Page**
- View individual player history across seasons  
- **Per-Season Totals Table**  
- **Per-Season Averages Table**  
- Total / career averages displayed at bottom  

---

### 📊 **Analytics Page**
Aggregated data visualizations including:
- All-time average stat leaders  
- All-time total stat leaders  
- Win/loss record vs. top 10 most frequent opponents  

---

### ⛹️ **Live Stats Tracker (Admin Only)**
A real-time stat tracking interface used during games:
- Game setup form (season, game number, opponent, date, location)  
- Select active players from roster  
- Add new subs or temporary players  
- Track by quarter (used to build play-by-play later)  
- Choose stat → choose player  
- **Undo** last recorded stat  
- **Save Draft** to return later  
- **Complete Game** finalizes:
  - Game record  
  - Season totals  
  - Player totals  
  - Player averages  
  - Analytics collections (for fast reads)

---

## 🔐 Authentication
- Implemented using **NextAuth.js**  
- **Google (Gmail) provider**  
- Only authenticated **admin users** can access stat tracking features  
- Protected routes validate sessions before loading data  

---

## 🛠 Tech Stack

### **Frontend**
- Next.js  
- Tailwind CSS  
- Recharts  

### **Backend**
- Next.js API Routes  
- MongoDB (players, seasons, games, stats, play-by-play, analytics collections)

---

## 🧪 Local Development Setup

### 1. Install dependencies
npm install

### 2. Environment Variables

Create a .env.local file:

MONGODB_URI=your_mongodb_uri

MONGODB_DB=your_mongodb_db

NEXTAUTH_SECRET=your_nextauth_secret

NEXTAUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your_google_client_id

GOOGLE_CLIENT_SECRET=your_google_client_secret

### 3. Run the dev server
npm run dev
