# PinSpace 📌

PinSpace is a modern, high-performance Pinterest-inspired full-stack web application built with **React 18**, **Vite**, **Tailwind CSS**, and **Supabase** (PostgreSQL 15, GoTrue Auth, and Storage).

---

## ✨ Features

- **Masonry Layout Feed:** Pinterest-style responsive multi-column masonry grid with varying card aspect ratios.
- **Supabase Authentication:** User registration, password validation, session persistence, and protected routes.
- **Explore & Category Discovery:** Trending categories with real-time tag filtering.
- **Pin Creation & Media Management:** Image drag-and-drop file upload to Supabase Storage, URL input, tags chip input, and board assignment.
- **Board System:** Create private/public boards, organize pins, quick-save, and save modal picker with duplicate prevention.
- **User Profiles:** Creator profiles displaying created pins, saved boards, bio, avatar, and social links.
- **Row Level Security (RLS):** Strict PostgreSQL security policies protecting unauthorized data access or modification.
- **Dual-Mode Persistence:** Connects to live Supabase backend when credentials are provided, with seamless fallback for offline local preview.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, React Router v6, Tailwind CSS v3, Lucide React icons, Vite 6
- **Backend / Database:** Supabase (PostgreSQL 15 with Row Level Security)
- **Auth:** Supabase GoTrue authentication engine
- **Storage:** Supabase Storage bucket (`pin-images`)
- **Testing:** Node.js backend validation suite (`test/validate-backend.js`)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/pinspace.git
cd pinspace
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment configuration
Copy `.env.example` to `.env` and fill in your Supabase project credentials:
```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-publishable-key
```

### 4. Database Setup
Execute the SQL script in [`supabase/schema.sql`](supabase/schema.sql) in your Supabase SQL Editor. This will set up:
- `profiles`, `pins`, `boards`, and `board_pins` tables
- Foreign key constraints and indexes
- Automatic user profile creation trigger (`handle_new_user`)
- Row Level Security (RLS) policies for all tables and storage objects

### 5. Start the development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 6. Run the test suite
```bash
npm test
```

---

## 📁 Project Structure

```
pinspace/
├── public/               # Static assets & logos
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── board/        # Board cards, create/edit modals
│   │   ├── common/       # Navbar, Footer, ProtectedRoute, Toast
│   │   ├── pin/          # PinCard, MasonryGrid, SaveToBoardModal
│   │   └── profile/      # EditProfileModal
│   ├── context/          # React Contexts (Auth, Pin, Notification)
│   ├── data/             # Initial sample dataset & categories
│   ├── lib/              # Supabase client & validation logic
│   ├── pages/            # Page views (Home, Explore, PinDetail, Create, Profile, Boards, Login, Register)
│   └── services/         # API abstraction (pins, boards, profile, storage)
├── supabase/             # PostgreSQL database schema & seed scripts
├── test/                 # Validation & backend test suites
└── PinSpace_FullStack_QA_Audit_Report.docx # Complete QA audit report
```

---

## 📄 License
MIT
