# 🍳 Cook Book – MERN Stack Recipe Application

Cook Book is a full-stack **MERN (MongoDB, Express, React, Node.js)** web application that allows users to **share, explore, and generate recipes using AI**.  
The project consists of **User** and **Admin** modules with role-based access control, recipe moderation, complaint handling, and AI-powered recipe generation using the **Google Gemini API**.

---

## 🚀 Features

### 👤 User Module
- User registration and login
- JWT-based authentication
- Add and post recipes
- Browse all recipes
- View detailed recipe pages
- Add or remove recipes from favourites
- Generate recipes using AI (Gemini API)
- Save AI-generated recipes
- View own profile
- View other users’ profiles
- Report issues or complaints to admin
- Fully responsive UI

---

### 🛠️ Admin Module
- Secure admin login
- Admin dashboard
- View all users
- Block or unblock users
- View all user-posted recipes
- Delete inappropriate recipes
- Manage AI-generated recipes
- View and resolve user complaints
- Platform moderation and control

---

## 🧠 AI Recipe Generation
The application integrates **Google Gemini API** to generate recipes based on user input such as:
- Ingredients
- Cuisine preference
- Meal type
- Custom prompts

Users can view, save, and manage AI-generated recipes.

---

## 🧑‍💻 Tech Stack

### Frontend
- React.js (Vite)
- Material UI (MUI)
- React Router DOM
- Axios
- Framer Motion
- Context API (User, Recipe, Favourite)

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt for password hashing

### AI
- Google Gemini API

---

## 📂 Project Structure

```
cook-book/
│
├── back-end/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── adminMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Recipe.js
│   │   ├── AiRecipe.js
│   │   └── Complaint.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── recipeRoutes.js
│   │   ├── aiRecipe.js
│   │   ├── complaintRoutes.js
│   │   └── adminRoutes.js
│   ├── app.js
│   └── package.json
│
├── front-end/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── ResponsiveLayout.jsx
│   │   │   └── Root.jsx
│   │   ├── context/
│   │   │   ├── UserContext.jsx
│   │   │   ├── RecipeContext.jsx
│   │   │   └── FavouriteContext.jsx
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── components/
│   │   │   │   │   ├── AdminSidebar.jsx
│   │   │   │   │   ├── DashboardHome.jsx
│   │   │   │   │   ├── ManageUsers.jsx
│   │   │   │   │   ├── ManageRecipes.jsx
│   │   │   │   │   ├── ManageAiRecipes.jsx
│   │   │   │   │   └── ManageComplaints.jsx
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   └── AdminRoutes.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── AddRecipePage.jsx
│   │   │   ├── RecipeDetailPage.jsx
│   │   │   ├── FavouritesPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── UserProfilePage.jsx
│   │   │   ├── PostComplaintPage.jsx
│   │   │   ├── AiRecipeGeneratePage.jsx
│   │   │   ├── AiRecipeDetailPage.jsx
│   │   │   └── AiSavedRecipesPage.jsx
│   │   ├── theme/
│   │   │   └── theme.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
│
└── README.md
```

---

## 🔐 Authentication & Security
- JWT-based authentication
- Role-based authorization (User / Admin)
- Protected routes for sensitive pages
- Passwords encrypted using bcrypt

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js
- MongoDB
- Google Gemini API Key

---

### 1️⃣ Clone Repository
```bash
git clone https://github.com/albinanil45/cook-book-FullStack-MERN.git
cd cook-book
```

---

### 2️⃣ Backend Setup
```bash
cd back-end
npm install
```

Create a `.env` file inside `back-end`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Run backend server:
```bash
node app
```

---

### 3️⃣ Frontend Setup
```bash
cd front-end
npm install
npm run dev
```

---

## 🧪 Future Enhancements
- Notification system
- Advanced admin analytics dashboard

---

## 🎓 Project Use Case
- Full Stack MERN Application
- Academic / College Mini or Main Project
- AI-powered recipe generation system
- Portfolio-ready project

---

## 📄 License
This project is licensed under the MIT License.

---

## 👤 Author
ALBIN ANILKUMAR  
