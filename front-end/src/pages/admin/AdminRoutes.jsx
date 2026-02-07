import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import DashboardHome from "./components/DashboardHome";
import ManageUsers from "./components/ManageUsers";
import ManageRecipes from "./components/ManageRecipes";
import ManageAiRecipes from "./components/ManageAiRecipes";

const AdminRoutes = () => {
    return (

        <Route path="/admin-dashboard" element={<AdminDashboard />}>
            <Route index element={<DashboardHome />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="recipes" element={<ManageRecipes />} />
            <Route path="ai-recipes" element={<ManageAiRecipes />} />
            <Route path="*" element={<Navigate to="/admin-dashboard" />} />
        </Route>

    );
};

export default AdminRoutes;
