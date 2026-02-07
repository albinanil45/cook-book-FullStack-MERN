import { Outlet } from "react-router-dom";
import ResponsiveLayout from "../../components/ResponsiveLayout";
import AdminSidebar from "./components/AdminSidebar";

const AdminDashboard = () => {
    return (
        <ResponsiveLayout drawerContent={<AdminSidebar />}>
            <Outlet />
        </ResponsiveLayout>
    );
};

export default AdminDashboard;
