import React from "react";
import { ThemeProvider } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";

import theme from "./theme/theme";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import Root from "./components/Root";
import ProtectedRoute from "./components/ProtectedRoute";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import AddRecipePage from "./pages/AddRecipePage";
import UserProfilePage from "./pages/UserProfilePage";
import ProfilePage from "./pages/ProfilePage";
import FavouritesPage from "./pages/FavouritesPage";
import AiRecipeGeneratePage from "./pages/AiRecipeGeneratepage";
import AiSavedRecipesPage from "./pages/AiSavedRecipesPage";
import AiRecipeDetailPage from "./pages/AiRecipeDetailPage";
import AdminRoutes from "./pages/admin/AdminRoutes";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DashboardHome from "./pages/admin/components/DashboardHome";
import ManageUsers from "./pages/admin/components/ManageUsers";
import ManageRecipes from "./pages/admin/components/ManageRecipes";
import ManageAiRecipes from "./pages/admin/components/ManageAiRecipes";
import PostComplaintPage from "./pages/PostComplaintPage";
import ManageComplaints from "./pages/admin/components/ManageComplaints";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        {/* Entry point */}
        <Route path="/" element={<Root />} />

        {/* Public pages */}
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/recipes/:id" element={<RecipeDetailPage />} />
        <Route path="/users/:id" element={<UserProfilePage />} />
        <Route path="/generated-ai-recipes/:id" element={<AiRecipeDetailPage />} />

        {/* Admin routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute isAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="recipes" element={<ManageRecipes />} />
          <Route path="ai-recipes" element={<ManageAiRecipes />} />
          <Route path="complaints" element={<ManageComplaints />} />
          <Route path="*" element={<Navigate to="/admin-dashboard" replace />} />
        </Route>



        {/* Protected home */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-recipe"
          element={
            <ProtectedRoute>
              <AddRecipePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/favourites"
          element={
            <ProtectedRoute>
              <FavouritesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai-recipe-generate"
          element={
            <ProtectedRoute>
              <AiRecipeGeneratePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/generated-ai-recipes"
          element={
            <ProtectedRoute>
              <AiSavedRecipesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/report-issue"
          element={
            <ProtectedRoute>
              <PostComplaintPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect to root */}
        <Route path="*" element={<Root />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
